import mongoose from "mongoose"
import Product from "../models/productSchema.model.js"
import { parseSearchIntent } from "../services/aiSearch.service.js"

// Helper to safely escape regex special characters
const escapeRegex = (str) => str ? String(str).replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&') : ""

/**
 * AI-powered Search Endpoint
 */
export const searchProductsWithAI = async (req, res) => {
    try {
        const query = req.query.q || req.query.query || req.query.search || ""

        if (!query.trim()) {
            const products = await Product.find().sort({ createdAt: -1 })
            return res.status(200).json({
                success: true,
                message: "No search term provided, returned all products",
                products: products || [],
                product: products || [],
                count: products.length,
                intentSummary: "Showing all products",
                extractedKeywords: [],
                extractedCategories: [],
                isAIPowered: false
            })
        }

        // 1. Understand semantic intent using LLM (with fallback parser)
        const intent = await parseSearchIntent(query)

        // 2. Build DB query dynamically from LLM extracted criteria
        const orConditions = []

        const allTerms = [
            ...intent.keywords,
            ...intent.categories,
            ...intent.brands,
            query.trim()
        ].filter(Boolean)

        const uniqueTerms = [...new Set(allTerms.map(t => t.toString().toLowerCase().trim()))]

        uniqueTerms.forEach((term) => {
            const regex = new RegExp(escapeRegex(term), "i")
            orConditions.push(
                { name: regex },
                { category: regex },
                { subCategory: regex },
                { description: regex },
                { brand: regex }
            )
        })

        const mongoQuery = {}
        if (orConditions.length > 0) {
            mongoQuery.$or = orConditions
        }

        if (intent.minPrice !== null || intent.maxPrice !== null) {
            mongoQuery.price = {}
            if (intent.minPrice !== null) mongoQuery.price.$gte = intent.minPrice
            if (intent.maxPrice !== null) mongoQuery.price.$lte = intent.maxPrice
        }

        // 3. Execute DB query
        const products = await Product.find(mongoQuery).sort({ createdAt: -1 })

        return res.status(200).json({
            success: true,
            message: "AI search executed successfully",
            query,
            products: products || [],
            product: products || [],
            count: products.length,
            intentSummary: intent.intentSummary,
            extractedKeywords: intent.keywords,
            extractedCategories: intent.categories,
            isAIPowered: intent.isAIPowered
        })
    } catch (err) {
        console.error("AI SEARCH CONTROLLER ERROR:", err)
        res.status(500).json({
            success: false,
            message: "Internal server error during search",
            products: [],
            product: []
        })
    }
}

/**
 * Fetch All Products (with optional Category & SubCategory filtering)
 * Standard public endpoint: GET /api/product or GET /api/products
 */
export const getallProduct = async (req, res) => {
    try {
        const { category, subCategory } = req.query
        const filter = {}

        if (category && category.trim() !== "" && category.toLowerCase() !== "all") {
            filter.category = new RegExp(`^${escapeRegex(category.trim())}$`, "i")
        }

        if (subCategory && subCategory.trim() !== "" && subCategory.toLowerCase() !== "all") {
            filter.subCategory = new RegExp(`^${escapeRegex(subCategory.trim())}$`, "i")
        }

        const products = await Product.find(filter).sort({ createdAt: -1 })

        console.log(`[GET /product] Fetched ${products.length} products (Filter: ${JSON.stringify(filter)})`)

        res.status(200).json({
            success: true,
            message: "Fetched products successfully",
            products: products || [],
            product: products || [], // compatibility alias for single/plural
            count: products ? products.length : 0
        })
    } catch (err) {
        console.error("GET ALL PRODUCTS ERROR:", err)
        res.status(500).json({
            success: false,
            message: "Internal server error: " + (err.message || "Failed to fetch products"),
            products: [],
            product: []
        })
    }
}

/**
 * Fetch Single Product Details by ID
 * Public endpoint: GET /api/product/:id
 */
export const getProduct = async (req, res) => {
    try {
        const { id } = req.params
        if (!id || id === "undefined" || id === "null") {
            return res.status(400).json({
                success: false,
                message: "Valid product ID is required"
            })
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }

        const product = await Product.findById(id)
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }

        res.status(200).json({
            success: true,
            message: "Fetched product successfully",
            product,
            products: [product]
        })
    } catch (err) {
        console.error("GET PRODUCT ERROR:", err)
        res.status(500).json({
            success: false,
            message: "Internal server error: " + (err.message || "Failed to fetch product")
        })
    }
}

/**
 * Admin: Create Product
 * Protected endpoint: POST /api/product
 */
export const createProduct = async (req, res) => {
    try {
        const { name, title, description, price, category, subCategory, brand, stock, rating, image, images } = req.body

        const productName = name || title
        if (!productName || !description || price === undefined || !brand) {
            return res.status(400).json({
                success: false,
                message: "Required product details (name, description, price, brand) are missing"
            })
        }

        // Format image into array of strings for MongoDB model compatibility
        const rawImages = image || images || []
        let imageArray = []
        if (Array.isArray(rawImages)) {
            imageArray = rawImages.filter(img => typeof img === "string" && img.trim() !== "")
        } else if (typeof rawImages === "string" && rawImages.trim() !== "") {
            imageArray = [rawImages.trim()]
        }

        if (imageArray.length === 0) {
            imageArray = ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80"]
        }

        const product = await Product.create({
            name: productName.trim(),
            description: description.trim(),
            price: Number(price),
            category: category || "General",
            subCategory: subCategory || "",
            brand: brand.trim(),
            stock: stock !== undefined ? Number(stock) : 10,
            rating: rating !== undefined ? Number(rating) : 4.5,
            image: imageArray
        })

        res.status(201).json({
            success: true,
            message: "Product created successfully",
            product
        })
    } catch (err) {
        console.error("CREATE PRODUCT ERROR:", err.message)
        res.status(500).json({
            success: false,
            message: "Internal server error: " + err.message
        })
    }
}

/**
 * Admin: Update Product
 * Protected endpoint: PUT /api/product/:id
 */
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }

        let updateData = { ...req.body }

        if (updateData.title && !updateData.name) {
            updateData.name = updateData.title
        }

        if (updateData.price !== undefined) {
            updateData.price = Number(updateData.price)
        }
        if (updateData.stock !== undefined) {
            updateData.stock = Number(updateData.stock)
        }
        if (updateData.rating !== undefined) {
            updateData.rating = Number(updateData.rating)
        }
        if (updateData.image !== undefined || updateData.images !== undefined) {
            const raw = updateData.image || updateData.images
            if (Array.isArray(raw)) {
                updateData.image = raw.filter(img => typeof img === "string" && img.trim() !== "")
            } else if (typeof raw === "string" && raw.trim() !== "") {
                updateData.image = [raw.trim()]
            }
        }

        const product = await Product.findByIdAndUpdate(
            id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        )

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product
        })
    } catch (err) {
        console.error("UPDATE PRODUCT ERROR:", err)
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

/**
 * Admin: Delete Product
 * Protected endpoint: DELETE /api/product/:id
 */
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }

        const product = await Product.findByIdAndDelete(id)
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }

        res.status(200).json({
            success: true,
            message: "Product deleted successfully",
            product
        })
    } catch (err) {
        console.error("DELETE PRODUCT ERROR:", err)
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}