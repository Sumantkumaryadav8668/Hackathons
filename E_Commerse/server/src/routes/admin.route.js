import express from "express"
import {
    getAdminStats,
    getAllUsersAdmin,
    toggleUserStatusAdmin,
    updateUserRoleAdmin,
    getAllOrdersAdmin,
    updateOrderStatusAdmin,
    verifyDeliveryOtpAdmin,
    getAllPaymentsAdmin,
    verifyPaymentAdmin
} from "../controller/admin.controller.js"
import authUser from "../middlewares/authUser.middleware.js"
import authAdmin from "../middlewares/authAdmin.middleware.js"

const router = express.Router()

// All routes require authentication & admin role
router.use(authUser, authAdmin)

// Stats
router.get("/stats", getAdminStats)

// Users
router.get("/users", getAllUsersAdmin)
router.put("/users/:id/status", toggleUserStatusAdmin)
router.put("/users/:id/role", updateUserRoleAdmin)

// Orders
router.get("/orders", getAllOrdersAdmin)
router.put("/orders/:id/status", updateOrderStatusAdmin)
router.post("/orders/:id/verify-delivery-otp", verifyDeliveryOtpAdmin)

// Payments
router.get("/payments", getAllPaymentsAdmin)
router.post("/payments/:id/verify", verifyPaymentAdmin)

export default router
