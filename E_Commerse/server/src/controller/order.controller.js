import Order from "../models/orderSchema.model.js"
import Cart from "../models/cartSchema.model.js"
import Payment from "../models/paymentSchema.model.js"
import User from "../models/userSchema.model.js"
import { generateDeliveryOTP, verifyDeliveryOTP, sendSMS } from "../services/sms.service.js"

export const createOrder = async (req, res) => {
    try {
        const { shippingAddress, paymentMethod } = req.body

        // 1. Validate shipping address
        if (
            !shippingAddress ||
            !shippingAddress.street ||
            !shippingAddress.city ||
            !shippingAddress.state ||
            !shippingAddress.pincode
        ) {
            return res.status(400).json({
                message: "Shipping address with street, city, state, and pincode is required"
            })
        }

        const street = String(shippingAddress.street).trim()
        const city = String(shippingAddress.city).trim()
        const state = String(shippingAddress.state).trim()
        const pincode = String(shippingAddress.pincode).trim()

        if (!street || !city || !state || !pincode) {
            return res.status(400).json({
                message: "All shipping address fields must be non-empty"
            })
        }

        // 2. Fetch user's cart from database
        const cart = await Cart.findOne({
            user: req.user._id
        }).populate("items.product")

        if (!cart || !cart.items || cart.items.length === 0) {
            return res.status(400).json({
                message: "Your shopping cart is empty. Please add products before checkout."
            })
        }

        const validItems = cart.items.filter(item => item && item.product)

        if (validItems.length === 0) {
            return res.status(400).json({
                message: "Cart contains invalid or unavailable products."
            })
        }

        // 3. Calculate total amount strictly from database product prices
        let totalAmount = 0
        const orderItems = validItems.map(item => {
            const itemPrice = Number(item.product.price ?? item.price ?? 0)
            const itemQty = Number(item.quantity ?? 1)
            totalAmount += itemPrice * itemQty

            return {
                product: item.product._id,
                name: item.product.name || "Product",
                price: itemPrice,
                quantity: itemQty
            }
        })

        const selectedMethod = paymentMethod === "cod" ? "cod" : "online"
        const isCod = selectedMethod === "cod"

        // Generate OTP for COD immediately
        let rawOtp = null
        let otpHash = null
        let otpExpiresAt = null

        if (isCod) {
            const otpData = await generateDeliveryOTP()
            rawOtp = otpData.rawOtp
            otpHash = otpData.otpHash
            otpExpiresAt = otpData.otpExpiresAt
        }

        // 4. Create Order document
        const order = await Order.create({
            user: req.user._id,
            items: orderItems,
            totalAmount: Math.max(0, totalAmount),
            shippingAddress: {
                street,
                city,
                state,
                pincode
            },
            paymentMethod: selectedMethod,
            orderStatus: isCod ? "confirmed" : "pending_payment",
            paymentStatus: "pending",
            otpHash,
            otpExpiresAt,
            otpVerified: false
        })

        // 5. Update user saved shipping address
        await User.findByIdAndUpdate(req.user._id, {
            address: {
                street,
                city,
                state,
                pincode: Number(pincode) || 0
            }
        })

        if (isCod) {
            // Empty User's Cart ONLY upon successful COD order creation
            await Cart.findOneAndUpdate(
                { user: req.user._id },
                { items: [] }
            )

            // Send Confirmation SMS
            const user = await User.findById(req.user._id)
            if (user && user.phone) {
                await sendSMS(
                    user.phone,
                    `Your Cash on Delivery Order #${order._id.toString().slice(-6)} for ₹${order.totalAmount} has been CONFIRMED! Your Delivery OTP is ${rawOtp}.`
                )
            }

            return res.status(201).json({
                success: true,
                message: "✓ Cash on Delivery order placed successfully!",
                order,
                deliveryOtp: rawOtp
            })
        }

        // Online payment order initialized
        res.status(201).json({
            success: true,
            message: "Order created. Please complete online payment to confirm.",
            order
        })

    } catch (err) {
        console.error("CREATE ORDER ERROR:", err)
        res.status(500).json({
            message: "Failed to process checkout: " + (err.message || "Internal server error")
        })
    }
}

/**
 * Controller to confirm COD for an existing pending order (placed from Checkout)
 */
export const confirmCodOrderController = async (req, res) => {
    try {
        const { orderId } = req.body

        if (!orderId) {
            return res.status(400).json({
                message: "orderId is required"
            })
        }

        const order = await Order.findOne({
            _id: orderId,
            user: req.user._id
        })

        if (!order) {
            return res.status(404).json({
                message: "Order not found or unauthorized access"
            })
        }

        // Generate OTP if not present
        let rawOtp = null
        if (!order.otpHash) {
            const otpData = await generateDeliveryOTP()
            rawOtp = otpData.rawOtp
            order.otpHash = otpData.otpHash
            order.otpExpiresAt = otpData.otpExpiresAt
        }

        order.paymentMethod = "cod"
        order.orderStatus = "confirmed"
        order.paymentStatus = "pending"
        order.otpVerified = false
        await order.save()

        // Clear user's cart in DB
        await Cart.findOneAndUpdate(
            { user: req.user._id },
            { items: [] }
        )

        // Send SMS notification if phone is available
        const user = await User.findById(req.user._id)
        if (user && user.phone) {
            await sendSMS(
                user.phone,
                `Your Cash on Delivery Order #${order._id.toString().slice(-6)} for ₹${order.totalAmount} has been CONFIRMED!${rawOtp ? ` Your Delivery OTP is ${rawOtp}.` : ""}`
            )
        }

        res.status(200).json({
            success: true,
            message: "✓ Cash on Delivery order confirmed!",
            order,
            deliveryOtp: rawOtp
        })

    } catch (err) {
        console.error("CONFIRM COD ORDER ERROR:", err)
        res.status(500).json({
            message: err.message || "Failed to confirm Cash on Delivery order"
        })
    }
}

/**
 * Controller for Customer / Admin / Delivery Agent to verify Delivery OTP
 */
export const verifyDeliveryOtpController = async (req, res) => {
    try {
        const { orderId, otp } = req.body

        if (!orderId || !otp) {
            return res.status(400).json({
                message: "orderId and 6-digit Delivery OTP are required"
            })
        }

        // Find order (accessible by user or admin)
        const query = req.user.role === "admin"
            ? { _id: orderId }
            : { _id: orderId, user: req.user._id }

        const order = await Order.findOne(query)

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            })
        }

        if (order.orderStatus === "delivered" || order.otpVerified) {
            return res.status(400).json({
                message: "Order has already been marked as DELIVERED."
            })
        }

        // Validate OTP
        const verification = await verifyDeliveryOTP(otp, order)

        if (!verification.valid) {
            // Increment attempt counter
            order.otpAttempts = (order.otpAttempts || 0) + 1
            await order.save()

            return res.status(400).json({
                message: verification.message
            })
        }

        // Mark order as DELIVERED
        order.otpVerified = true
        order.orderStatus = "delivered"
        
        // If Cash on Delivery, mark paymentStatus as success upon delivery verification
        if (order.paymentMethod === "cod") {
            order.paymentStatus = "success"
        }

        await order.save()

        // Send SMS notification if phone is available
        const user = await User.findById(order.user)
        if (user && user.phone) {
            await sendSMS(
                user.phone,
                `Your MiniShop Order #${order._id.toString().slice(-6)} has been successfully DELIVERED! Thank you for shopping with us.`
            )
        }

        res.status(200).json({
            message: "✓ Delivery OTP verified successfully! Order marked as DELIVERED.",
            order
        })

    } catch (err) {
        console.error("VERIFY DELIVERY OTP ERROR:", err)
        res.status(500).json({
            message: err.message || "Internal server error"
        })
    }
}

export const getMyOrder = async (req, res) => {
    try {
        const rawOrders = await Order.find({
            user: req.user._id
        }).populate("items.product").sort({ createdAt: -1 }).lean()

        const payments = await Payment.find({ user: req.user._id }).lean()
        const paymentMap = {}
        payments.forEach(p => {
            if (p.order) {
                paymentMap[p.order.toString()] = p
            }
        })

        const orders = rawOrders.map(o => {
            const pm = o.paymentMethod === "cod" 
                ? "Cash on Delivery" 
                : (paymentMap[o._id.toString()]?.paymentMethod || "Online Payment")
            return {
                ...o,
                paymentMethod: pm,
                paymentDetails: paymentMap[o._id.toString()] || null
            }
        })

        res.status(200).json({
            message: "Fetched user orders successfully",
            order: orders,
            orders: orders
        })
    } catch (err) {
        console.error("GET ORDERS ERROR:", err)
        res.status(500).json({
            message: "Internal server error",
            error: err.message
        })
    }
}

export const getOrder = async (req, res) => {
    try {
        const { id } = req.params
        
        // Ownership security check: user must own order unless admin
        const query = req.user.role === "admin"
            ? { _id: id }
            : { _id: id, user: req.user._id }

        const order = await Order.findOne(query).populate("items.product")

        if (!order) {
            return res.status(404).json({
                message: "Order not found or unauthorized access"
            })
        }

        res.status(200).json({
            message: "Fetched order details successfully",
            order
        })
    } catch (err) {
        console.error("GET ORDER ERROR:", err)
        res.status(500).json({
            message: "Internal server error"
        })
    }
}