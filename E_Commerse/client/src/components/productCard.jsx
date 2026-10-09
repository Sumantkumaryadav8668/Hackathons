import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useCart } from "../content/cartContent"
import "../styles/productCard.css"

function ProductCard({ product }) {
    const { addToCart } = useCart()
    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")
    const [isAuthError, setIsAuthError] = useState(false)
    const [addedSuccess, setAddedSuccess] = useState(false)

    if (!product) return null

    async function handleAddToCart() {
        try {
            setLoading(true)
            setMessage("")
            setIsAuthError(false)

            await addToCart(product._id, 1)

            setAddedSuccess(true)
            setMessage("Added to Cart")

            setTimeout(() => {
                setAddedSuccess(false)
                setMessage("")
            }, 2000)
        } catch (error) {
            console.log("Add to cart error:", error)

            if (error.response?.status === 401) {
                setIsAuthError(true)
                setMessage("Please login to add items to cart")
            } else {
                setMessage(
                    error.response?.data?.message ||
                    "Unable to add product"
                )
            }
        } finally {
            setLoading(false)
        }
    }

    // Safe field extractions from MongoDB document
    const productName = product.name || product.title || "Product"
    const productDesc = product.description || ""
    const mrpPrice = Number(product.price) || 0
    const finalPrice = product.discountPrice && Number(product.discountPrice) < mrpPrice ? Number(product.discountPrice) : mrpPrice
    const discountPct = product.discountPrice && Number(product.discountPrice) < mrpPrice
        ? Math.round(((mrpPrice - Number(product.discountPrice)) / mrpPrice) * 100)
        : 0
    const productBrand = product.brand || ""
    const productCategory = product.category || ""
    const ratingValue = product.rating ?? product.averageRating ?? 4.5
    const inStock = product.stock === undefined || product.stock > 0

    // Safe image extraction (supports array of strings, single string, images, or thumbnail)
    let productImage = null
    if (Array.isArray(product.image) && product.image.length > 0) {
        productImage = product.image[0]
    } else if (typeof product.image === "string" && product.image.trim() !== "") {
        productImage = product.image.trim()
    } else if (Array.isArray(product.images) && product.images.length > 0) {
        productImage = product.images[0]
    } else if (typeof product.images === "string" && product.images.trim() !== "") {
        productImage = product.images.trim()
    } else if (typeof product.thumbnail === "string" && product.thumbnail.trim() !== "") {
        productImage = product.thumbnail.trim()
    }

    // Format rating stars
    const renderStars = (rating) => {
        const numericRating = Number(rating) || 0
        const fullStars = Math.floor(numericRating)
        const hasHalfStar = numericRating % 1 >= 0.5
        return (
            <div className="product-card-rating" title={`Rating: ${numericRating} out of 5`}>
                <span className="stars">
                    {"★".repeat(Math.min(5, Math.max(0, fullStars)))}
                    {hasHalfStar ? "½" : ""}
                    {"☆".repeat(Math.max(0, 5 - fullStars - (hasHalfStar ? 1 : 0)))}
                </span>
                <span className="rating-number">({numericRating.toFixed(1)})</span>
            </div>
        )
    }

    return (
        <div className="product-card">
            {/* Product Image & Badges */}
            <div
                className="product-card-image-container"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/product/${product._id}`)}
            >
                {productImage ? (
                    <img
                        src={productImage}
                        alt={productName}
                        className="product-card-image"
                        loading="lazy"
                        onError={(e) => {
                            const secondary = (Array.isArray(product.image) && product.image[1]) || (Array.isArray(product.images) && product.images[1])
                            if (secondary && e.target.src !== secondary) {
                                e.target.src = secondary
                            } else {
                                e.target.style.display = 'none';
                                if (e.target.nextSibling) {
                                    e.target.nextSibling.style.display = 'flex';
                                }
                            }
                        }}
                    />
                ) : null}

                <div
                    className="product-card-no-image"
                    style={{ display: productImage ? 'none' : 'flex' }}
                >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                    </svg>
                    <span>No Image</span>
                </div>

                {/* Stock Status Badge */}
                <span className={`stock-badge ${inStock ? "in-stock" : "out-of-stock"}`}>
                    <span className="badge-dot"></span>
                    {inStock ? "In Stock" : "Out of Stock"}
                </span>

                {/* Discount Percentage Pill */}
                {discountPct > 0 && (
                    <span style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        backgroundColor: '#dc2626',
                        color: '#ffffff',
                        fontSize: '0.75rem',
                        fontWeight: '800',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                        zIndex: 2
                    }}>
                        {discountPct}% OFF
                    </span>
                )}

                {/* Category Pill */}
                {productCategory && (
                    <span className="category-badge">
                        {productCategory}
                    </span>
                )}
            </div>

            {/* Product Details */}
            <div className="product-card-content">
                {productBrand && (
                    <div className="product-card-brand">
                        {productBrand}
                    </div>
                )}

                <h3 className="product-card-name" title={productName}>
                    <Link to={`/product/${product._id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                        {productName}
                    </Link>
                </h3>

                {renderStars(ratingValue)}

                {productDesc && (
                    <p className="product-card-description">
                        {productDesc}
                    </p>
                )}

                <div className="product-card-footer" style={{ gap: '0.5rem', flexWrap: 'wrap' }}>
                    <div className="product-card-price" style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
                            <span className="currency">₹</span>
                            <span className="amount">{finalPrice.toLocaleString('en-IN')}</span>
                            {discountPct > 0 && (
                                <span style={{ textDecoration: 'line-through', fontSize: '0.82rem', color: '#94a3b8' }}>
                                    ₹{mrpPrice.toLocaleString('en-IN')}
                                </span>
                            )}
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', flex: 1, justifyContent: 'flex-end' }}>
                        <Link
                            to={`/product/${product._id}`}
                            className="product-card-button"
                            style={{ backgroundColor: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0.45rem 0.75rem' }}
                        >
                            Details
                        </Link>
                        <button
                            className={`product-card-button ${addedSuccess ? "success" : ""}`}
                            onClick={handleAddToCart}
                            disabled={loading || !inStock}
                        >
                            {loading ? (
                                <span className="btn-loading">
                                    <span className="spinner"></span> Adding...
                                </span>
                            ) : addedSuccess ? (
                                <span className="btn-success">
                                    ✓ Added
                                </span>
                            ) : !inStock ? (
                                "Out of Stock"
                            ) : (
                                "Add to Cart"
                            )}
                        </button>
                    </div>
                </div>

                {message && (
                    <div className={`product-card-message ${isAuthError ? "auth-error" : addedSuccess ? "success-msg" : "error-msg"}`}>
                        <span>{message}</span>
                        {isAuthError && (
                            <button
                                type="button"
                                className="login-link-btn"
                                onClick={() => navigate("/login")}
                            >
                                Login Now
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ProductCard