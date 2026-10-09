import User from "../models/userSchema.model.js"
import Product from "../models/productSchema.model.js"
import Order from "../models/orderSchema.model.js"
import Payment from "../models/paymentSchema.model.js"
import { confirmPaymentAndOrder } from "./payment.controller.js"
import { verifyDeliveryOTP, sendSMS } from "../services/sms.service.js"

/**
 * Controller to fetch live Admin Dashboard Statistics from MongoDB.
 */
export const getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments()
        const totalProducts = await Product.countDocuments()
        const totalOrders = await Order.countDocuments()

        const successfulPayments = await Payment.countDocuments({ paymentStatus: "success" })
        const pendingPayments = await Payment.countDocuments({ paymentStatus: "pending" })

        const pendingOrders = await Order.countDocuments({
            orderStatus: { $in: ["pending_payment", "confirmed", "processing", "shipped", "out_for_delivery"] }
        })
        const deliveredOrders = await Order.countDocuments({ orderStatus: "delivered" })

        // Total Revenue calculation (successful payments or confirmed/delivered orders)
        const revenueResult = await Order.aggregate([
            {
                $match: {
                    orderStatus: { $in: ["confirmed", "processing", "shipped", "out_for_delivery", "delivered"] }
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$totalAmount" }
                }
            }
        ])

        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0

        return res.status(200).json({
            success: true,
            message: "Admin statistics fetched successfully",
            totalUsers,
            totalProducts,
            totalOrders,
            successfulPayments,
            pendingPayments,
            pendingOrders,
            deliveredOrders,
            totalRevenue
        })
    } catch (error) {
        console.error("GET ADMIN STATS ERROR:", error)
        return res.status(500).json({
            success: false,
            message: "Failed to fetch admin statistics",
            error: error.message
        })
    }
}

/**
 * USER MANAGEMENT
 */
export const getAllUsersAdmin = async (req, res) => {
    try {
        const users = await User.find().select("-password").sort({ createdAt: -1 })
        res.status(200).json({
            success: true,
            users: users || []
        })
    } catch (error) {
        console.error("ADMIN GET ALL USERS ERROR:", error)
        res.status(500).json({ message: "Failed to fetch users" })
    }
}

export const toggleUserStatusAdmin = async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findById(id)

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: "You cannot deactivate your own admin account." })
        }

        user.isActive = user.isActive === false ? true : false
        await user.save()

        res.status(200).json({
            success: true,
            message: `User account has been ${user.isActive ? "activated" : "deactivated"}.`,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isActive: user.isActive
            }
        })
    } catch (error) {
        console.error("ADMIN TOGGLE USER STATUS ERROR:", error)
        res.status(500).json({ message: "Failed to update user status" })
    }
}

export const updateUserRoleAdmin = async (req, res) => {
    try {
        const { id } = req.params
        const { role } = req.body

        if (!["user", "admin"].includes(role)) {
            return res.status(400).json({ message: "Invalid role specified." })
        }

        const user = await User.findById(id)
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        user.role = role
        await user.save()

        res.status(200).json({
            success: true,
            message: `User role updated to ${role} successfully.`,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })
    } catch (error) {
        console.error("ADMIN UPDATE USER ROLE ERROR:", error)
        res.status(500).json({ message: "Failed to update user role" })
    }
}

/**
 * ORDER MANAGEMENT & DELIVERY OTP VERIFICATION
 */
export const getAllOrdersAdmin = async (req, res) => {
    try {
        const { status, search } = req.query
        const filter = {}

        if (status && status !== "ALL") {
            filter.orderStatus = status
        }

        const orders = await Order.find(filter)
            .populate("user", "name email phone")
            .populate("items.product", "name price image brand")
            .populate("payment")
            .sort({ createdAt: -1 })

        res.status(200).json({
            success: true,
            orders: orders || []
        })
    } catch (error) {
        console.error("ADMIN GET ORDERS ERROR:", error)
        res.status(500).json({ message: "Failed to fetch orders" })
    }
}

export const updateOrderStatusAdmin = async (req, res) => {
    try {
        const { id } = req.params
        const { orderStatus } = req.body

        const validStatuses = [
            "pending_payment",
            "confirmed",
            "processing",
            "shipped",
            "out_for_delivery",
            "delivered",
            "cancelled"
        ]

        if (!validStatuses.includes(orderStatus)) {
            return res.status(400).json({
                message: `Invalid order status. Allowed values: ${validStatuses.join(", ")}`
            })
        }

        const order = await Order.findById(id)
        if (!order) {
            return res.status(404).json({ message: "Order not found" })
        }

        // Prevent invalid status transition (e.g. delivered -> processing)
        if (order.orderStatus === "delivered" && orderStatus !== "delivered") {
            return res.status(400).json({
                message: "Delivered orders cannot be reverted to an earlier status."
            })
        }

        // Standard requiring OTP for transition to 'delivered'
        if (orderStatus === "delivered" && !order.otpVerified) {
            return res.status(400).json({
                message: "Delivery OTP verification required to complete delivery. Please verify customer Delivery OTP."
            })
        }

        order.orderStatus = orderStatus
        await order.save()

        res.status(200).json({
            success: true,
            message: `Order status updated to ${orderStatus}.`,
            order
        })
    } catch (error) {
        console.error("ADMIN UPDATE ORDER STATUS ERROR:", error)
        res.status(500).json({ message: "Failed to update order status" })
    }
}

export const verifyDeliveryOtpAdmin = async (req, res) => {
    try {
        const { id } = req.params
        const { otp } = req.body

        if (!otp) {
            return res.status(400).json({ message: "Delivery OTP is required" })
        }

        const order = await Order.findById(id)
        if (!order) {
            return res.status(404).json({ message: "Order not found" })
        }

        const verification = await verifyDeliveryOTP(otp, order)

        if (!verification.valid) {
            order.otpAttempts = (order.otpAttempts || 0) + 1
            await order.save()
            return res.status(400).json({ message: verification.message })
        }

        order.otpVerified = true
        order.orderStatus = "delivered"
        await order.save()

        const user = await User.findById(order.user)
        if (user && user.phone) {
            await sendSMS(
                user.phone,
                `Your MiniShop Order #${order._id.toString().slice(-6)} has been verified and DELIVERED! Thank you.`
            )
        }

        res.status(200).json({
            success: true,
            message: "✓ Customer Delivery OTP verified successfully! Order marked as DELIVERED.",
            order
        })
    } catch (error) {
        console.error("ADMIN VERIFY DELIVERY OTP ERROR:", error)
        res.status(500).json({ message: "Failed to verify Delivery OTP" })
    }
}

/**
 * PAYMENT MANAGEMENT & VERIFICATION
 */
export const getAllPaymentsAdmin = async (req, res) => {
    try {
        const payments = await Payment.find()
            .populate("user", "name email phone")
            .populate("order", "totalAmount orderStatus items")
            .populate("verifiedBy", "name email")
            .sort({ createdAt: -1 })

        res.status(200).json({
            success: true,
            payments: payments || []
        })
    } catch (error) {
        console.error("ADMIN GET PAYMENTS ERROR:", error)
        res.status(500).json({ message: "Failed to fetch payments" })
    }
}

export const verifyPaymentAdmin = async (req, res) => {
    try {
        const { id } = req.params
        const result = await confirmPaymentAndOrder(id, req.user._id)

        res.status(200).json({
            success: true,
            message: "✓ Payment verified by Admin. Order confirmed & Delivery OTP generated.",
            payment: result.payment,
            order: result.order,
            deliveryOtp: result.rawOtp
        })
    } catch (error) {
        console.error("ADMIN VERIFY PAYMENT ERROR:", error)
        res.status(500).json({ message: "Failed to verify payment: " + error.message })
    }
}
