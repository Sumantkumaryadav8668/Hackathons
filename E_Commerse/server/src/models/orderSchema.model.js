import mongoose from "mongoose"


const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
    },

  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
      },

      name: {
        type: String,
        required: true
      },

      price: {
        type: Number,
        required: true,
        min: 0
      },

      quantity: {
        type: Number,
        required: true,
        min: 1
      }
    }
  ],


  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },


  shippingAddress: {
    street: {
      type: String,
      required: true
    },

    city: {
      type: String,
      required: true
    },

    state: {
      type: String,
      required: true
    },

    pincode: {
      type: String,
      required: true
    }
  },

  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Payment",
    default: null
  },

  paymentMethod: {
    type: String,
    enum: ["online", "cod"],
    default: "online"
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

  orderStatus: {
    type: String,
    enum: [
      "pending_payment",
      "confirmed",
      "processing",
      "shipped",
      "out_for_delivery",
      "delivered",
      "cancelled"
    ],
    default: "pending_payment"
  },

  // Delivery OTP Security System
  otpHash: {
    type: String,
    default: null
  },
  otpExpiresAt: {
    type: Date,
    default: null
  },
  otpAttempts: {
    type: Number,
    default: 0
  },
  otpVerified: {
    type: Boolean,
    default: false
  }
},{timestamps: true}
)

orderSchema.index({ user: 1, createdAt: -1 })
orderSchema.index({ orderStatus: 1 })
orderSchema.index({ paymentStatus: 1 })

const Order = mongoose.model("Order", orderSchema)

export default Order