import mongoose from "mongoose"

const offerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  discountPercentage: {
    type: Number,
    min: 0,
    max: 100
  },
  code: {
    type: String,
    trim: true
  },
  bannerImage: {
    type: String,
    default: ""
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true })

const Offer = mongoose.model("Offer", offerSchema)

export default Offer
