import express from "express"
import authUser from "../middlewares/authUser.middleware.js"
import authAdmin from "../middlewares/authAdmin.middleware.js"
import {
  getActiveOffers,
  getAllOffers,
  createOffer,
  updateOffer,
  deleteOffer
} from "../controller/offer.controller.js"

const offerRoute = express.Router()

// Public route to get active offers
offerRoute.get("/", getActiveOffers)

// Admin routes
offerRoute.get("/admin", authUser, authAdmin, getAllOffers)
offerRoute.post("/", authUser, authAdmin, createOffer)
offerRoute.put("/:id", authUser, authAdmin, updateOffer)
offerRoute.delete("/:id", authUser, authAdmin, deleteOffer)

export default offerRoute
