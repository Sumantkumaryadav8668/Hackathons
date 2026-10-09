import express from "express"
import authUser from "../middlewares/authUser.middleware.js"
import {
    createPayment,
    createUpiPaymentIntentController,
    verifyPaymentWebhookController,
    getAllPayment,
    getOnePayment,
    getPaymentConfig,
    getPaymentStatus
} from "../controller/payment.controller.js"

const paymentRoute = express.Router()

// Public payment QR config endpoint
paymentRoute.get("/config", getPaymentConfig)

paymentRoute.use(authUser)

paymentRoute.post("/create-intent", createUpiPaymentIntentController)
paymentRoute.post("/intent", createUpiPaymentIntentController)
paymentRoute.post("/webhook", verifyPaymentWebhookController)
paymentRoute.post("/verify-signature", verifyPaymentWebhookController)

paymentRoute.post("/", createPayment)
paymentRoute.post("/create", createPayment)
paymentRoute.post("/verify", createPayment)
paymentRoute.get("/status/:orderId", getPaymentStatus)
paymentRoute.get("/", getAllPayment)
paymentRoute.get("/:id", getOnePayment)

export default paymentRoute