import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    title: {
      type: String,
      trim: true
    },

    description: {
      type: String,
      required: true
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    discountPrice: {
      type: Number,
      min: 0
    },

    category: {
      type: String,
      required: true,
    },

    subCategory: {
      type: String,
      default: "",
      trim: true
    },

    brand: {
      type: String,
      required: true
    },

    image: {
      type: [String],
      required: true
    },

    images: {
      type: [String],
      default: []
    },

    thumbnail: {
      type: String,
      default: ""
    },

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    tags: {
      type: [String],
      default: []
    },

    isPublished: {
      type: Boolean,
      default: true
    },

    totalSales: {
      type: Number,
      default: 0
    },

    averageRating: {
      type: Number,
      default: 4.5,
      min: 0,
      max: 5
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    }
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;