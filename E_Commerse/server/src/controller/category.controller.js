import Category from "../models/categorySchema.model.js"

export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({ isActive: true }).sort({ name: 1 })
        res.status(200).json({
            success: true,
            categories
        })
    } catch (error) {
        console.error("GET CATEGORIES ERROR:", error)
        res.status(500).json({ message: "Failed to fetch categories" })
    }
}

export const getAllCategoriesAdmin = async (req, res) => {
    try {
        const categories = await Category.find().sort({ createdAt: -1 })
        res.status(200).json({
            success: true,
            categories
        })
    } catch (error) {
        console.error("ADMIN GET CATEGORIES ERROR:", error)
        res.status(500).json({ message: "Failed to fetch categories" })
    }
}

export const createCategory = async (req, res) => {
    try {
        const { name, description, icon } = req.body

        if (!name || !name.trim()) {
            return res.status(400).json({ message: "Category name is required" })
        }

        const slug = name.trim().toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-")

        const existing = await Category.findOne({ slug })
        if (existing) {
            return res.status(400).json({ message: "Category already exists" })
        }

        const category = await Category.create({
            name: name.trim(),
            slug,
            description: description ? description.trim() : "",
            icon: icon || "📦"
        })

        res.status(201).json({
            success: true,
            message: "Category created successfully",
            category
        })
    } catch (error) {
        console.error("CREATE CATEGORY ERROR:", error)
        res.status(500).json({ message: "Failed to create category" })
    }
}

export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params
        const { name, description, icon, isActive } = req.body

        const category = await Category.findById(id)
        if (!category) {
            return res.status(404).json({ message: "Category not found" })
        }

        if (name && name.trim()) {
            category.name = name.trim()
            category.slug = name.trim().toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-")
        }

        if (description !== undefined) category.description = description.trim()
        if (icon !== undefined) category.icon = icon
        if (isActive !== undefined) category.isActive = isActive

        await category.save()

        res.status(200).json({
            success: true,
            message: "Category updated successfully",
            category
        })
    } catch (error) {
        console.error("UPDATE CATEGORY ERROR:", error)
        res.status(500).json({ message: "Failed to update category" })
    }
}

export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params
        const category = await Category.findByIdAndDelete(id)

        if (!category) {
            return res.status(404).json({ message: "Category not found" })
        }

        res.status(200).json({
            success: true,
            message: "Category deleted successfully"
        })
    } catch (error) {
        console.error("DELETE CATEGORY ERROR:", error)
        res.status(500).json({ message: "Failed to delete category" })
    }
}
