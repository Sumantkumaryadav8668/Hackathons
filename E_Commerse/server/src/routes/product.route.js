import express from "express"
import authAdmin from "../middlewares/authAdmin.middleware.js"
import { getallProduct, getProduct, createProduct, updateProduct, deleteProduct, searchProductsWithAI } from "../controller/product.controller.js"

const productRoute = express.Router()

// Public product routes
productRoute.get("/search", searchProductsWithAI)
productRoute.get("/", getallProduct)
productRoute.get("/:id", getProduct)

// Admin product routes (supporting both REST standard and create/update/delete aliases)
productRoute.post("/", authAdmin, createProduct)
productRoute.post("/create", authAdmin, createProduct)

productRoute.put("/:id", authAdmin, updateProduct)
productRoute.put("/update/:id", authAdmin, updateProduct)

productRoute.delete("/:id", authAdmin, deleteProduct)
productRoute.delete("/delete/:id", authAdmin, deleteProduct)

export default productRoute