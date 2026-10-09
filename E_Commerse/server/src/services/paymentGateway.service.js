import crypto from "crypto"

/**
 * Get centralized Payment Gateway configuration from environment variables.
 */
export const getGatewayConfig = () => {
    return {
        merchantId: process.env.PAYMENT_MERCHANT_ID || "minishop_merchant_01",
        keyId: process.env.PAYMENT_KEY_ID || "rzp_test_minishop_key",
        keySecret: process.env.PAYMENT_KEY_SECRET || "minishop_payment_key_secret_2026",
        webhookSecret: process.env.PAYMENT_WEBHOOK_SECRET || "minishop_webhook_secret_key_2026",
        upiId: process.env.UPI_ID || "sumantkumar@upi",
        payeeName: process.env.PAYEE_NAME || "SUMANT KUMAR YADAV",
        paymentName: process.env.PAYMENT_NAME || "DigitalMart Official Store",
        paymentQrImage: process.env.PAYMENT_QR_IMAGE || "/payment-assets/phonepe-qr.png"
    }
}

/**
 * Constructs an NPCI-compliant standard UPI Intent URI.
 * Spec: upi://pay?pa={UPI_ID}&pn={PAYEE_NAME}&tr={TRANSACTION_REF}&tn={NOTE}&am={AMOUNT}&cu=INR
 */
export const generateUpiIntentUri = ({
    upiId,
    payeeName,
    amount,
    transactionRef,
    note
}) => {
    const config = getGatewayConfig()
    const targetUpiId = upiId || config.upiId
    const targetPayeeName = payeeName || config.payeeName
    const formattedAmount = Number(amount || 0).toFixed(2)
    const ref = transactionRef || `TXN_${Date.now()}`
    const paymentNote = note || `Order Payment #${ref.slice(-8)}`

    const params = new URLSearchParams({
        pa: targetUpiId,
        pn: targetPayeeName,
        tr: ref,
        tn: paymentNote,
        am: formattedAmount,
        cu: "INR"
    })

    return `upi://pay?${params.toString()}`
}

/**
 * Verify HMAC-SHA256 Webhook Payload Signature from Gateway.
 */
export const verifyWebhookSignature = (payloadString, signatureHeader, secretKey = null) => {
    try {
        const config = getGatewayConfig()
        const secret = secretKey || config.webhookSecret

        if (!signatureHeader || !secret) return false

        const expectedSignature = crypto
            .createHmac("sha256", secret)
            .update(typeof payloadString === "string" ? payloadString : JSON.stringify(payloadString))
            .digest("hex")

        // Timing-safe comparison to prevent timing side-channel attacks
        const signatureBuffer = Buffer.from(signatureHeader)
        const expectedBuffer = Buffer.from(expectedSignature)

        if (signatureBuffer.length !== expectedBuffer.length) {
            return false
        }

        return crypto.timingSafeEqual(signatureBuffer, expectedBuffer)
    } catch (err) {
        console.error("[GATEWAY WEBHOOK SIG ERROR]:", err)
        return false
    }
}

/**
 * Verify Razorpay / Gateway Payment Signature (order_id + "|" + payment_id)
 */
export const verifyPaymentGatewaySignature = ({
    gatewayOrderId,
    gatewayPaymentId,
    signature,
    secretKey = null
}) => {
    try {
        const config = getGatewayConfig()
        const secret = secretKey || config.keySecret

        if (!gatewayOrderId || !gatewayPaymentId || !signature || !secret) {
            return false
        }

        const body = `${gatewayOrderId}|${gatewayPaymentId}`
        const expectedSignature = crypto
            .createHmac("sha256", secret)
            .update(body)
            .digest("hex")

        return expectedSignature === signature
    } catch (err) {
        console.error("[PAYMENT SIG VERIFY ERROR]:", err)
        return false
    }
}
