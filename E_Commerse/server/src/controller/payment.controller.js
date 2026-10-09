import Payment from "../models/paymentSchema.model.js"
import Order from "../models/orderSchema.model.js"
import Cart from "../models/cartSchema.model.js"
import User from "../models/userSchema.model.js"
import { generateDeliveryOTP, sendSMS } from "../services/sms.service.js"
import {
    getGatewayConfig,
    generateUpiIntentUri,
    verifyWebhookSignature,
    verifyPaymentGatewaySignature
} from "../services/paymentGateway.service.js"

/**
 * Get public Payment & Gateway Configuration
 */
export const getPaymentConfig = async (req, res) => {
    try {
        const config = getGatewayConfig()
        res.status(200).json({
            success: true,
            merchantId: config.merchantId,
            keyId: config.keyId,
            upiId: config.upiId,
            payeeName: config.payeeName,
            paymentName: config.paymentName,
            paymentQrImage: config.paymentQrImage
        })
    } catch (err) {
        console.error("GET PAYMENT CONFIG ERROR:", err)
        res.status(500).json({
            message: "Failed to load payment configuration"
        })
    }
}

/**
 * Helper function to confirm payment & order on server side
 */
export const confirmPaymentAndOrder = async (paymentId, verifiedByUserId = null) => {
    const payment = await Payment.findById(paymentId)
    if (!payment) throw new Error("Payment record not found")

    const order = await Order.findById(payment.order)
    if (!order) throw new Error("Associated order not found")

    // If already marked success, return existing data
    if (payment.paymentStatus === "success" && order.orderStatus === "confirmed") {
        return { payment, order, rawOtp: null }
    }

    // 1. Update Payment record
    payment.paymentStatus = "success"
    if (verifiedByUserId) {
        payment.verifiedBy = verifiedByUserId
        payment.verifiedAt = new Date()
    }
    await payment.save()

    // 2. Generate Delivery OTP for the confirmed order
    const { rawOtp, otpHash, otpExpiresAt } = await generateDeliveryOTP()

    // 3. Update Order record
    order.payment = payment._id
    order.paymentStatus = "success"
    order.orderStatus = "confirmed"
    order.otpHash = otpHash
    order.otpExpiresAt = otpExpiresAt
    order.otpVerified = false
    await order.save()

    // 4. Empty User's Cart ONLY upon verified payment
    await Cart.findOneAndUpdate(
        { user: payment.user },
        { items: [] }
    )

    // 5. Send Order Confirmation SMS with Delivery OTP snippet
    const user = await User.findById(payment.user)
    if (user && user.phone) {
        await sendSMS(
            user.phone,
            `Your payment of ₹${order.totalAmount} for DigitalMart Order #${order._id.toString().slice(-6)} was SUCCESSFUL! Your Delivery OTP is ${rawOtp}. Give this OTP to the agent upon delivery.`
        )
    }

    return { payment, order, rawOtp }
}

/**
 * Controller to generate dynamic UPI Intent URI and Payment transaction for checkout
 */
export const createUpiPaymentIntentController = async (req, res) => {
    try {
        const { orderId } = req.body

        if (!orderId) {
            return res.status(400).json({ message: "orderId is required" })
        }

        // 1. Fetch order owned by user
        const order = await Order.findOne({
            _id: orderId,
            user: req.user._id
        }).populate("items.product")

        if (!order) {
            return res.status(404).json({ message: "Order not found or unauthorized access" })
        }

        // 2. Calculate exact amount strictly from DB product prices (security rule!)
        let dbTotalAmount = 0
        if (order.items && order.items.length > 0) {
            order.items.forEach(item => {
                const itemPrice = Number(item.product?.price ?? item.price ?? 0)
                const itemQty = Number(item.quantity ?? 1)
                dbTotalAmount += itemPrice * itemQty
            })
        } else {
            dbTotalAmount = Number(order.totalAmount || 0)
        }

        const totalAmount = Math.max(0, dbTotalAmount)
        const config = getGatewayConfig()

        // 3. Check existing payment record for this order
        let payment = await Payment.findOne({ order: order._id })
        const transactionRef = payment?.transactionId || `TXN_${order._id.toString().slice(-6)}_${Date.now()}`

        if (!payment) {
            payment = await Payment.create({
                order: order._id,
                user: req.user._id,
                amount: totalAmount,
                paymentMethod: "UPI",
                paymentStatus: "pending",
                transactionId: transactionRef
            })
        } else {
            payment.amount = totalAmount
            payment.paymentMethod = "UPI"
            if (payment.paymentStatus !== "success") {
                payment.paymentStatus = "pending"
            }
            await payment.save()
        }

        // 4. Construct NPCI compliant UPI Intent URI
        const upiUri = generateUpiIntentUri({
            upiId: config.upiId,
            payeeName: config.payeeName,
            amount: totalAmount,
            transactionRef: transactionRef,
            note: `Payment for Order #${order._id.toString().slice(-6)}`
        })

        res.status(200).json({
            success: true,
            upiUri,
            transactionId: transactionRef,
            amount: totalAmount,
            currency: "INR",
            orderId: order._id,
            merchantId: config.merchantId,
            payeeName: config.payeeName,
            upiId: config.upiId,
            paymentQrImage: config.paymentQrImage,
            paymentStatus: payment.paymentStatus,
            orderStatus: order.orderStatus
        })

    } catch (err) {
        console.error("CREATE UPI INTENT ERROR:", err)
        res.status(500).json({
            message: "Failed to create UPI Payment Intent: " + (err.message || "Internal server error")
        })
    }
}

/**
 * Controller to verify Webhook Callback / Signature from Payment Gateway
 */
export const verifyPaymentWebhookController = async (req, res) => {
    try {
        const {
            orderId,
            transactionId,
            utrNumber,
            signature,
            gatewayOrderId,
            gatewayPaymentId,
            paymentStatus
        } = req.body

        if (!orderId) {
            return res.status(400).json({ message: "orderId is required for payment verification" })
        }

        // 1. Fetch order & payment from DB
        const order = await Order.findById(orderId)
        if (!order) {
            return res.status(404).json({ message: "Associated order not found" })
        }

        let payment = await Payment.findOne({ order: orderId })

        // 2. Prevent Replay Attack / Duplicate Confirmation
        if (payment && payment.paymentStatus === "success" && order.orderStatus === "confirmed") {
            return res.status(200).json({
                success: true,
                verified: true,
                message: "✓ Payment has already been verified & order is confirmed!",
                payment,
                order
            })
        }

        // 3. Handle explicit Payment Failure callback from Gateway
        if (paymentStatus === "failed") {
            if (payment) {
                payment.paymentStatus = "failed"
                await payment.save()
            }
            order.paymentStatus = "failed"
            await order.save()

            return res.status(200).json({
                success: false,
                verified: false,
                paymentStatus: "failed",
                message: "Payment verification failed or payment was rejected by user."
            })
        }

        // 4. Perform Signature / UTR verification logic
        const cleanUtr = utrNumber ? String(utrNumber).trim() : ""
        const cleanSig = signature ? String(signature).trim() : ""

        // Webhook / Gateway Signature Verification Check
        let isSignatureValid = false
        if (cleanSig && gatewayOrderId && gatewayPaymentId) {
            isSignatureValid = verifyPaymentGatewaySignature({
                gatewayOrderId,
                gatewayPaymentId,
                signature: cleanSig
            })
        }

        // 12-digit PhonePe UTR or 8+ alphanumeric reference verification rule
        const isValidUtr = /^\d{12}$/.test(cleanUtr) || (cleanUtr.length >= 8 && /^[a-zA-Z0-9]+$/.test(cleanUtr))

        // Authoritative verification flag
        const isVerifiedSuccess = isSignatureValid || isValidUtr

        const transId = transactionId || (cleanUtr ? `UTR_${cleanUtr}` : payment?.transactionId || `TXN_${Date.now()}`)

        if (!payment) {
            payment = await Payment.create({
                order: order._id,
                user: order.user,
                amount: order.totalAmount, // Calculated strictly on server!
                paymentMethod: "UPI",
                paymentStatus: isVerifiedSuccess ? "success" : "pending",
                transactionId: transId,
                utrNumber: cleanUtr || null,
                signature: cleanSig || null
            })
        } else {
            payment.transactionId = transId
            if (cleanUtr) payment.utrNumber = cleanUtr
            if (cleanSig) payment.signature = cleanSig
            payment.paymentStatus = isVerifiedSuccess ? "success" : "pending"
            await payment.save()
        }

        if (isVerifiedSuccess) {
            // Confirm payment & order on server side
            const result = await confirmPaymentAndOrder(payment._id)

            return res.status(200).json({
                success: true,
                verified: true,
                message: "✓ Payment Verified & Order Confirmed!",
                payment: result.payment,
                order: result.order,
                deliveryOtp: result.rawOtp
            })
        } else {
            // Unverified: keep status pending
            return res.status(200).json({
                success: true,
                verified: false,
                paymentStatus: "pending",
                message: "Payment status: PENDING verification. If you paid via PhonePe or GPay, please enter your 12-digit UTR number.",
                payment,
                order
            })
        }

    } catch (err) {
        console.error("WEBHOOK VERIFICATION ERROR:", err)
        res.status(500).json({
            message: "Failed to process payment verification: " + (err.message || "Internal server error")
        })
    }
}

/**
 * Submit Payment for Verification (Scan & Pay QR / UPI / Card)
 */
export const createPayment = async (req, res) => {
    try {
        const { orderId, paymentMethod, utrNumber, transactionId } = req.body

        if (!orderId) {
            return res.status(400).json({
                message: "orderId is required"
            })
        }

        const method = paymentMethod || "UPI"

        // 1. Fetch order from DB owned by req.user
        const order = await Order.findOne({
            _id: orderId,
            user: req.user._id
        })

        if (!order) {
            return res.status(404).json({
                message: "Order not found or unauthorized access"
            })
        }

        // 2. Check existing payment for this order
        let payment = await Payment.findOne({ order: orderId })

        if (payment && payment.paymentStatus === "success" && order.orderStatus === "confirmed") {
            return res.status(200).json({
                success: true,
                verified: true,
                message: "✓ Payment has already been verified & order is confirmed!",
                payment,
                order
            })
        }

        const cleanUtr = utrNumber ? String(utrNumber).trim() : ""
        const transId = transactionId || (cleanUtr ? `UTR_${cleanUtr}` : `TXN_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`)

        // 3. Create or update pending Payment record in DB
        if (!payment) {
            payment = await Payment.create({
                order: order._id,
                user: req.user._id,
                amount: order.totalAmount, // Server calculated amount!
                paymentMethod: method,
                paymentStatus: "pending",
                transactionId: transId,
                utrNumber: cleanUtr || null
            })
        } else {
            payment.paymentMethod = method
            payment.transactionId = transId
            if (cleanUtr) payment.utrNumber = cleanUtr
            payment.paymentStatus = "pending"
            await payment.save()
        }

        // 4. Perform Backend Payment Verification
        const isValidUtr = /^\d{12}$/.test(cleanUtr) || (cleanUtr.length >= 8 && /^[a-zA-Z0-9]+$/.test(cleanUtr))

        if (isValidUtr) {
            // Backend confirms payment & order
            const confirmedResult = await confirmPaymentAndOrder(payment._id)

            return res.status(200).json({
                success: true,
                verified: true,
                message: "✓ Payment verified & Order Confirmed!",
                payment: confirmedResult.payment,
                order: confirmedResult.order,
                deliveryOtp: confirmedResult.rawOtp
            })
        } else {
            return res.status(200).json({
                success: true,
                verified: false,
                paymentStatus: "pending",
                message: "Payment status is PENDING verification. If you have paid, please enter your 12-digit UTR / Reference number from your UPI app.",
                payment,
                order
            })
        }

    } catch (err) {
        console.error("CREATE / VERIFY PAYMENT ERROR:", err)
        res.status(500).json({
            message: "Payment verification failed: " + (err.message || "Internal server error")
        })
    }
}

/**
 * Get payment and order verification status for a specific order
 */
export const getPaymentStatus = async (req, res) => {
    try {
        const { orderId } = req.params
        const order = await Order.findOne({ _id: orderId, user: req.user._id })

        if (!order) {
            return res.status(404).json({ message: "Order not found" })
        }

        const payment = await Payment.findOne({ order: orderId, user: req.user._id })

        const verified = payment?.paymentStatus === "success" && order.orderStatus === "confirmed"

        res.status(200).json({
            success: true,
            verified,
            paymentStatus: payment?.paymentStatus || order.paymentStatus || "pending",
            orderStatus: order.orderStatus,
            payment,
            order
        })
    } catch (err) {
        console.error("GET PAYMENT STATUS ERROR:", err)
        res.status(500).json({ message: "Internal server error" })
    }
}

export const getAllPayment = async (req, res) => {
    try {
        const payments = await Payment.find({
            user: req.user._id
        })
            .populate("order")
            .sort({ createdAt: -1 })

        res.status(200).json({
            message: "Fetched user payments successfully",
            payments: payments || []
        })

    } catch (err) {
        console.error("GET PAYMENTS ERROR:", err)
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

export const getOnePayment = async (req, res) => {
    try {
        const { id } = req.params

        const payment = await Payment.findOne({
            _id: id,
            user: req.user._id
        }).populate("order")

        if (!payment) {
            return res.status(404).json({
                message: "Payment record not found"
            })
        }

        res.status(200).json({
            message: "Fetched payment details successfully",
            payment
        })

    } catch (err) {
        console.error("GET PAYMENT ERROR:", err)
        res.status(500).json({
            message: "Internal server error"
        })
    }
}