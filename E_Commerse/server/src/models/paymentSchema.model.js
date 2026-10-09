import mongoose from "mongoose"

const paymentSchema = new mongoose.Schema(
    {
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        amount: {
            type: Number,
            required: true,
            min: 0
        },

        paymentMethod: {
            type: String,
            enum: [
                "UPI",
                "Card",
                "QR"
            ],
            required: true
        },

        paymentStatus: {
            type: String,
            enum: [
                "created",
                "pending",
                "success",
                "failed",
                "refunded"
            ],
            default: "pending"
        },

        transactionId: {
            type: String,
            default: null,
            trim: true
        },

        gatewayReference: {
            type: String,
            default: null,
            trim: true
        },

        signature: {
            type: String,
            default: null,
            trim: true
        },

        rawGatewayResponse: {
            type: mongoose.Schema.Types.Mixed,
            default: null
        },

        utrNumber: {
            type: String,
            default: null,
            trim: true
        },

        verifiedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        verifiedAt: {
            type: Date,
            default: null
        },

        notes: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
)

paymentSchema.index({ order: 1 })
paymentSchema.index({ user: 1 })
paymentSchema.index({ paymentStatus: 1 })

const Payment = mongoose.model(
    "Payment",
    paymentSchema
)

export default Payment