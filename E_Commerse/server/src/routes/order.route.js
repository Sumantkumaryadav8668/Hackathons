import express from "express"
import authUser from "../middlewares/authUser.middleware.js"
import {
    createOrder,
    confirmCodOrderController,
    getMyOrder,
    getOrder,
    verifyDeliveryOtpController
} from "../controller/order.controller.js"

const orderRoute = express.Router()

orderRoute.use(authUser)

orderRoute.post("/", createOrder)
orderRoute.post("/confirm-cod", confirmCodOrderController)
orderRoute.get("/", getMyOrder)
orderRoute.get("/my-orders", getMyOrder)
orderRoute.post("/verify-delivery-otp", verifyDeliveryOtpController)
orderRoute.post("/verify-otp", verifyDeliveryOtpController)
orderRoute.get("/:id", getOrder)

export default orderRoute