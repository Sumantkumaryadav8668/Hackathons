import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useCart } from "../content/cartContent"
import { useAuth } from "../content/authContent"
import api from "../api/axios"
import "../styles/cart.css"

function Cart() {
    const { cart, loading: cartLoading, error: cartError, updateCart, removeFromCart, getCart } = useCart()
    const { user } = useAuth()
    const navigate = useNavigate()

    const [address, setAddress] = useState({
        street: "",
        city: "",
        state: "",
        pincode: ""
    })

    const [checkoutLoading, setCheckoutLoading] = useState(false)
    const [message, setMessage] = useState("")

    // Load saved user address
    useEffect(() => {
        if (user?.address) {
            setAddress({
                street: user.address.street || "",
                city: user.address.city || "",
                state: user.address.state || "",
                pincode: user.address.pincode ? String(user.address.pincode) : ""
            })
        }
    }, [user])

    // Update address field
    function handleAddressChange(e) {
        const { name, value } = e.target
        setAddress(prev => ({
            ...prev,
            [name]: value
        }))
        if (message) setMessage("")
    }

    // Calculate subtotal
    const subtotal = (cart || []).reduce((total, item) => {
        return total + (item.price || 0) * (item.quantity || 1)
    }, 0)

    const shippingFee = 0 // Free shipping
    const totalAmount = subtotal + shippingFee

    // Proceed to Checkout handler
    async function handleProceedToCheckout(e) {
        if (e) e.preventDefault()

        if (!user) {
            setMessage("Please login to proceed to checkout.")
            setTimeout(() => navigate("/login"), 1000)
            return
        }

        if (!cart || cart.length === 0) {
            setMessage("Your shopping cart is empty.")
            return
        }

        const street = address.street ? address.street.trim() : ""
        const city = address.city ? address.city.trim() : ""
        const state = address.state ? address.state.trim() : ""
        const pincode = address.pincode ? address.pincode.toString().trim() : ""

        if (!street || !city || !state || !pincode) {
            setMessage("Please fill in complete shipping address (street, city, state, pincode).")
            return
        }

        try {
            setCheckoutLoading(true)
            setMessage("")

            const response = await api.post("/order", {
                shippingAddress: {
                    street,
                    city,
                    state,
                    pincode
                }
            })

            if (response.data && response.data.order) {
                navigate("/payment", {
                    state: {
                        order: response.data.order
                    }
                })
            } else {
                setMessage("Order created but no details returned. Please try again.")
            }
        } catch (error) {
            console.error("Create order error:", error)
            setMessage(
                error.response?.data?.message ||
                "Unable to create order. Please try again."
            )
        } finally {
            setCheckoutLoading(false)
        }
    }

    // 1. Loading State
    if (cartLoading) {
        return (
            <main className="cart-page">
                <div className="cart-status-card">
                    <div className="spinner-lg"></div>
                    <h2>Loading your cart...</h2>
                    <p>Fetching the latest items in your shopping cart.</p>
                </div>
            </main>
        )
    }

    // 2. Error State
    if (cartError && (!cart || cart.length === 0)) {
        return (
            <main className="cart-page">
                <div className="cart-status-card error">
                    <div className="status-icon warning">⚠️</div>
                    <h2>Unable to load your cart.</h2>
                    <p>There was a problem communicating with the server.</p>
                    <button onClick={getCart} className="retry-btn">
                        Try Again
                    </button>
                </div>
            </main>
        )
    }

    // 3. Empty Cart State
    if (!cart || cart.length === 0) {
        return (
            <main className="cart-page">
                <div className="empty-cart-card">
                    <div className="empty-cart-icon">
                        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <circle cx="9" cy="21" r="1"></circle>
                            <circle cx="20" cy="21" r="1"></circle>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                    </div>
                    <h1>Your cart is empty</h1>
                    <p>Looks like you haven't added any products to your shopping cart yet.</p>
                    <button
                        onClick={() => navigate("/")}
                        className="continue-shopping-btn"
                    >
                        Continue Shopping
                    </button>
                </div>
            </main>
        )
    }

    return (
        <main className="cart-page">
            <div className="cart-container">
                <div className="cart-header">
                    <div className="cart-header-title">
                        <h1>Shopping Cart</h1>
                        <span className="cart-items-count">
                            ({cart.reduce((sum, i) => sum + (i.quantity || 1), 0)} items)
                        </span>
                    </div>
                    <button
                        className="back-to-shop-btn-link"
                        onClick={() => navigate("/")}
                    >
                        ← Continue Shopping
                    </button>
                </div>

                {message && (
                    <div className="cart-message-alert">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                        <span>{message}</span>
                    </div>
                )}

                <div className="cart-layout">
                    {/* LEFT SIDE: Cart Products List */}
                    <section className="cart-items-section">
                        <div className="cart-items-header-bar">
                            <span className="col-product">Product</span>
                            <span className="col-quantity">Quantity</span>
                            <span className="col-subtotal">Subtotal</span>
                            <span className="col-action"></span>
                        </div>

                        <div className="cart-items-list">
                            {cart.map((item) => {
                                const product = item.product
                                const productId = product?._id || item.product
                                const image = Array.isArray(product?.image)
                                    ? product.image[0]
                                    : product?.image

                                const itemSubtotal = (item.price || 0) * (item.quantity || 1)

                                return (
                                    <div className="cart-item-card" key={productId}>
                                        {/* Product Image */}
                                        <div className="cart-item-image-wrapper">
                                            {image ? (
                                                <img
                                                    src={image}
                                                    alt={product?.name || "Product"}
                                                    className="cart-item-image"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                        if (e.target.nextSibling) {
                                                            e.target.nextSibling.style.display = 'flex';
                                                        }
                                                    }}
                                                />
                                            ) : null}
                                            <div
                                                className="cart-item-no-image"
                                                style={{ display: image ? 'none' : 'flex' }}
                                            >
                                                <span>No Image</span>
                                            </div>
                                        </div>

                                        {/* Product Info */}
                                        <div className="cart-item-info">
                                            {product?.brand && (
                                                <span className="cart-item-brand">{product.brand}</span>
                                            )}
                                            <h3 className="cart-item-title">
                                                {product?.name || "Product"}
                                            </h3>
                                            {product?.category && (
                                                <span className="cart-item-category">{product.category}</span>
                                            )}
                                            <div className="cart-item-unit-price">
                                                ₹{Number(item.price || 0).toLocaleString("en-IN")}
                                            </div>
                                        </div>

                                        {/* Quantity Controls */}
                                        <div className="cart-item-quantity-control">
                                            <button
                                                type="button"
                                                className="qty-btn minus"
                                                onClick={() => updateCart(productId, item.quantity - 1)}
                                                disabled={item.quantity <= 1}
                                                aria-label="Decrease quantity"
                                            >
                                                −
                                            </button>
                                            <span className="qty-value">{item.quantity}</span>
                                            <button
                                                type="button"
                                                className="qty-btn plus"
                                                onClick={() => updateCart(productId, item.quantity + 1)}
                                                aria-label="Increase quantity"
                                            >
                                                +
                                            </button>
                                        </div>

                                        {/* Subtotal */}
                                        <div className="cart-item-subtotal">
                                            ₹{Number(itemSubtotal).toLocaleString("en-IN")}
                                        </div>

                                        {/* Remove Button */}
                                        <div className="cart-item-action">
                                            <button
                                                type="button"
                                                className="remove-item-btn"
                                                onClick={() => removeFromCart(productId)}
                                                title="Remove product"
                                                aria-label="Remove item"
                                            >
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="3 6 5 6 21 6"></polyline>
                                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                    <line x1="10" y1="11" x2="10" y2="17"></line>
                                                    <line x1="14" y1="11" x2="14" y2="17"></line>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </section>

                    {/* RIGHT SIDE: Order Summary & Shipping Address */}
                    <aside className="cart-summary-sidebar">
                        <div className="summary-card">
                            <h2 className="summary-title">Order Summary</h2>

                            <div className="summary-row">
                                <span className="summary-label">Subtotal</span>
                                <span className="summary-value">₹{Number(subtotal).toLocaleString("en-IN")}</span>
                            </div>

                            <div className="summary-row">
                                <span className="summary-label">Shipping</span>
                                <span className="free-shipping-tag">FREE</span>
                            </div>

                            <div className="summary-divider"></div>

                            <div className="summary-row summary-total">
                                <span className="total-label">Total</span>
                                <strong className="total-value">₹{Number(totalAmount).toLocaleString("en-IN")}</strong>
                            </div>

                            {/* Shipping Address Form */}
                            <form onSubmit={handleProceedToCheckout} className="shipping-address-form">
                                <h3 className="form-heading">Shipping Address</h3>

                                <div className="form-group">
                                    <label htmlFor="street">Street Address *</label>
                                    <input
                                        id="street"
                                        type="text"
                                        name="street"
                                        placeholder="Flat/House No., Building, Street Name"
                                        value={address.street}
                                        onChange={handleAddressChange}
                                        required
                                    />
                                </div>

                                <div className="form-row-grid">
                                    <div className="form-group">
                                        <label htmlFor="city">City *</label>
                                        <input
                                            id="city"
                                            type="text"
                                            name="city"
                                            placeholder="City"
                                            value={address.city}
                                            onChange={handleAddressChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="state">State *</label>
                                        <input
                                            id="state"
                                            type="text"
                                            name="state"
                                            placeholder="State"
                                            value={address.state}
                                            onChange={handleAddressChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="pincode">Pincode *</label>
                                    <input
                                        id="pincode"
                                        type="text"
                                        name="pincode"
                                        placeholder="6-digit Pincode"
                                        value={address.pincode}
                                        onChange={handleAddressChange}
                                        required
                                    />
                                </div>

                                {message && (
                                    <div className="form-inline-alert error">
                                        ⚠️ {message}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    className="place-order-btn"
                                    disabled={checkoutLoading}
                                >
                                    {checkoutLoading ? (
                                        <span className="btn-spinner-box">
                                            <span className="spinner"></span> Processing...
                                        </span>
                                    ) : (
                                        "Proceed to Checkout"
                                    )}
                                </button>
                            </form>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    )
}

export default Cart