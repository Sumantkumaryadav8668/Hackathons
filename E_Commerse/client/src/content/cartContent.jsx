import { createContext, useContext, useEffect, useState } from "react"
import api from "../api/axios"
import { useAuth } from "./authContent"

const CartContext = createContext()

export function CartProvider({ children }) {

    const { user } = useAuth()

    const [cart, setCart] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Get cart from backend
    async function getCart() {
        if (!user) {
            setCart([])
            setLoading(false)
            return
        }

        try {
            setLoading(true)
            setError(null)
            const response = await api.get("/cart/get")
            setCart(response.data.cart?.items || [])
        } catch (err) {
            console.log("Get cart error:", err)
            setError("Unable to load your cart.")
            setCart([])
        } finally {
            setLoading(false)
        }
    }

    // Get cart when user logs in
    useEffect(() => {
        getCart()
    }, [user])

    // Add product to cart
    async function addToCart(productId, quantity = 1) {
        try {
            const response = await api.post(
                "/cart/add",
                {
                    productId,
                    quantity
                }
            )
            setCart(response.data.cart?.items || [])
            return response.data
        } catch (error) {
            console.log("Add to cart error:", error)
            throw error
        }
    }

    // Update cart quantity
    async function updateCart(productId, quantity) {
        try {
            await api.put(
                `/cart/update/${productId}`,
                {
                    quantity
                }
            )
            await getCart()
        } catch (error) {
            console.log("Update cart error:", error)
            throw error
        }
    }

    // Remove product from cart
    async function removeFromCart(productId) {
        try {
            await api.delete(
                `/cart/remove/${productId}`
            )
            await getCart()
        } catch (error) {
            console.log("Remove cart error:", error)
            throw error
        }
    }

    return (
        <CartContext.Provider
            value={{
                cart,
                setCart,
                loading,
                error,
                getCart,
                addToCart,
                updateCart,
                removeFromCart
            }}
        >
            {children}
        </CartContext.Provider>
    )
}


export function useCart() {
    return useContext(CartContext)
}