import express from "express"
import authUser from "../middlewares/authUser.middleware.js"
import authAdmin from "../middlewares/authAdmin.middleware.js"
import {
    getCategories,
    getAllCategoriesAdmin,
    createCategory,
    updateCategory,
    deleteCategory
} from "../controller/category.controller.js"

const categoryRoute = express.Router()

// Public route to view active categories
categoryRoute.get("/", getCategories)

// Admin protected routes
categoryRoute.get("/admin", authUser, authAdmin, getAllCategoriesAdmin)
categoryRoute.post("/", authUser, authAdmin, createCategory)
categoryRoute.put("/:id", authUser, authAdmin, updateCategory)
categoryRoute.delete("/:id", authUser, authAdmin, deleteCategory)

export default categoryRoute
