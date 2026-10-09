import Cart from "../models/cartSchema.model.js"
import Product from "../models/productSchema.model.js"


export const addtoCart = async (req, res) => {
    try {

        const { productId, quantity } = req.body

        // Check product exists
        const product = await Product.findById(productId)

        if (!product) {
            return res.status(404).json({
                message: "product not found"
            })
        }

        const addQuantity = Number(quantity) || 1

        if (addQuantity < 1) {
            return res.status(400).json({
                message: "quantity must be at least 1"
            })
        }

        // Find user's cart
        let cart = await Cart.findOne({
            user: req.user._id
        })

        // If cart does not exist, create new cart
        if (!cart) {

            cart = await Cart.create({
                user: req.user._id,
                items: [
                    {
                        product: productId,
                        quantity: addQuantity,
                        price: product.price
                    }
                ]
            })

            return res.status(201).json({
                message: "product added to the cart",
                cart
            })
        }

        // Check product already exists in cart
        const existItem = cart.items.find(
            item => item.product.toString() === productId
        )

        if (existItem) {

            existItem.quantity += addQuantity

        }
        else {

            cart.items.push({
                product: productId,
                quantity: addQuantity,
                price: product.price
            })

        }

        await cart.save()

        res.status(200).json({
            message: "product added to the cart",
            cart
        })

    }
    catch (err) {

        console.log(err)

        res.status(500).json({
            message: "Internal server error"
        })

    }
}


export const getCart = async (req, res) => {
    try {

        const cart = await Cart.findOne({
            user: req.user._id
        }).populate("items.product")

        // No cart
        if (!cart) {
            return res.status(200).json({
                message: "your cart is empty",
                cart: {
                    items: []
                }
            })
        }

        res.status(200).json({
            message: "fetch cart successfully",
            cart
        })

    }
    catch (err) {

        console.log(err)

        res.status(500).json({
            message: "Internal server error"
        })

    }
}


export const updateCart = async (req, res) => {
    try {

        const { id: productId } = req.params
        const { quantity } = req.body

        const newQuantity = Number(quantity)

        if (!newQuantity || newQuantity < 1) {
            return res.status(400).json({
                message: "quantity must be at least 1"
            })
        }

        // Find user's cart
        const cart = await Cart.findOne({
            user: req.user._id
        })

        if (!cart) {
            return res.status(404).json({
                message: "cart not found"
            })
        }

        // Find product inside cart
        const item = cart.items.find(
            item => item.product.toString() === productId
        )

        if (!item) {
            return res.status(404).json({
                message: "product not found in cart"
            })
        }

        // Update quantity
        item.quantity = newQuantity

        await cart.save()

        res.status(200).json({
            message: "cart updated successfully",
            quantity: newQuantity
        })

    }
    catch (err) {

        console.log(err)

        res.status(500).json({
            message: "Internal server error"
        })

    }
}


export const removeCart = async (req, res) => {
    try {

        const { id: productId } = req.params

        // Find user's cart
        const cart = await Cart.findOne({
            user: req.user._id
        })

        if (!cart) {
            return res.status(404).json({
                message: "cart not found"
            })
        }

        // Find product index
        const itemIndex = cart.items.findIndex(
            item => item.product.toString() === productId
        )

        // Product not found
        if (itemIndex === -1) {
            return res.status(404).json({
                message: "product not found in the cart"
            })
        }

        // Remove product
        cart.items.splice(itemIndex, 1)

        await cart.save()

        res.status(200).json({
            message: "product removed from cart",
            cart
        })

    }
    catch (err) {

        console.log(err)

        res.status(500).json({
            message: "Internal server error"
        })

    }
}