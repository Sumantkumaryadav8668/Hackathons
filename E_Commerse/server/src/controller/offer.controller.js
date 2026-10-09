import Offer from "../models/offerSchema.model.js"

export const getActiveOffers = async (req, res) => {
  try {
    const offers = await Offer.find({ isActive: true }).sort({ createdAt: -1 })
    res.status(200).json({
      message: "Fetched active offers successfully",
      offers
    })
  } catch (err) {
    console.log("GET ACTIVE OFFERS ERROR:", err)
    res.status(500).json({ message: "Internal server error" })
  }
}

export const getAllOffers = async (req, res) => {
  try {
    const offers = await Offer.find().sort({ createdAt: -1 })
    res.status(200).json({
      message: "Fetched all offers successfully",
      offers
    })
  } catch (err) {
    console.log("GET ALL OFFERS ERROR:", err)
    res.status(500).json({ message: "Internal server error" })
  }
}

export const createOffer = async (req, res) => {
  try {
    const { title, description, discountPercentage, code, bannerImage, isActive } = req.body

    if (!title) {
      return res.status(400).json({ message: "Title is required for an offer" })
    }

    const offer = await Offer.create({
      title,
      description,
      discountPercentage: discountPercentage ? Number(discountPercentage) : 0,
      code,
      bannerImage: bannerImage || "",
      isActive: isActive !== undefined ? Boolean(isActive) : true
    })

    res.status(201).json({
      message: "Offer created successfully",
      offer
    })
  } catch (err) {
    console.log("CREATE OFFER ERROR:", err)
    res.status(500).json({ message: "Internal server error", error: err.message })
  }
}

export const updateOffer = async (req, res) => {
  try {
    const { id } = req.params

    const offer = await Offer.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })

    if (!offer) {
      return res.status(404).json({ message: "Offer not found" })
    }

    res.status(200).json({
      message: "Offer updated successfully",
      offer
    })
  } catch (err) {
    console.log("UPDATE OFFER ERROR:", err)
    res.status(500).json({ message: "Internal server error" })
  }
}

export const deleteOffer = async (req, res) => {
  try {
    const { id } = req.params

    const offer = await Offer.findByIdAndDelete(id)

    if (!offer) {
      return res.status(404).json({ message: "Offer not found" })
    }

    res.status(200).json({
      message: "Offer deleted successfully",
      offer
    })
  } catch (err) {
    console.log("DELETE OFFER ERROR:", err)
    res.status(500).json({ message: "Internal server error" })
  }
}
