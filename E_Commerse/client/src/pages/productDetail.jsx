import { useEffect, useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { useCart } from "../content/cartContent"
import ProductCard from "../components/productCard"
import api from "../api/axios"
import "../styles/productDetail.css"

function ProductDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { addToCart } = useCart()

    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [suggestedProducts, setSuggestedProducts] = useState([])
    const [selectedImageIndex, setSelectedImageIndex] = useState(0)
    const [quantity, setQuantity] = useState(1)
    const [adding, setAdding] = useState(false)
    const [addSuccess, setAddSuccess] = useState(false)
    const [addMessage, setAddMessage] = useState("")

    useEffect(() => {
        let isCancelled = false

        async function fetchProductDetails() {
            if (!id || id === "undefined" || id === "null") {
                if (!isCancelled) {
                    setError("Product not found or failed to load.")
                    setLoading(false)
                }
                return
            }

            try {
                setLoading(true)
                setError("")
                const res = await api.get(`/product/${id}`)
                
                const fetchedProduct = res.data?.product || 
                    (Array.isArray(res.data?.products) && res.data.products.length > 0 ? res.data.products[0] : null) || 
                    (res.data?._id ? res.data : null)

                if (!isCancelled) {
                    if (fetchedProduct && fetchedProduct._id) {
                        setProduct(fetchedProduct)
                        setSelectedImageIndex(0)
                    } else {
                        setError("Product not found or failed to load.")
                    }
                }
            } catch (err) {
                if (!isCancelled) {
                    console.log("[ProductDetail Debug] Fetch product error:", err.response?.status || err.message)
                    if (err.response?.status === 404 || err.response?.status === 400) {
                        setError("Product not found or failed to load.")
                    } else {
                        setError(err.response?.data?.message || "Product not found or failed to load.")
                    }
                }
            } finally {
                if (!isCancelled) {
                    setLoading(false)
                }
            }
        }

        fetchProductDetails()

        return () => {
            isCancelled = true
        }
    }, [id])

    useEffect(() => {
        let isCancelled = false
        if (error || (!loading && !product)) {
            api.get("/product")
                .then(res => {
                    if (!isCancelled) {
                        const list = res.data?.products || res.data?.product || []
                        if (Array.isArray(list)) {
                            setSuggestedProducts(list.slice(0, 4))
                        }
                    }
                })
                .catch(() => {})
        }
        return () => {
            isCancelled = true
        }
    }, [error, loading, product])

    if (loading) {
        return (
            <main className="product-detail-page">
                <div className="product-detail-loading">
                    <div className="spinner"></div>
                    <span>Loading product details...</span>
                </div>
            </main>
        )
    }

    if (error || !product) {
        const firstValidId = suggestedProducts[0]?._id
        return (
            <main className="product-detail-page">
                <div className="product-detail-error" style={{ textAlign: 'center', padding: '40px 20px', maxWidth: '1100px', margin: '0 auto' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🛍️</div>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Product Not Found</h2>
                    <p style={{ color: '#64748b', marginBottom: '24px' }}>
                        The requested product ID <code style={{ background: '#f1f5f9', padding: '2px 8px', borderRadius: '4px', color: '#e11d48' }}>{id}</code> was deleted or not found in MongoDB.
                    </p>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '40px', flexWrap: 'wrap' }}>
                        <button className="back-home-btn" onClick={() => navigate("/")} style={{ cursor: 'pointer' }}>
                            ← Browse All Products
                        </button>
                        {firstValidId && (
                            <button
                                className="back-home-btn"
                                onClick={() => navigate(`/product/${firstValidId}`)}
                                style={{ cursor: 'pointer', background: '#2563eb', color: '#ffffff' }}
                            >
                                ✨ View Live Product ({suggestedProducts[0]?.name || "Sample Product"})
                            </button>
                        )}
                    </div>

                    {suggestedProducts.length > 0 && (
                        <div style={{ marginTop: '40px', textAlign: 'left' }}>
                            <h3 style={{ fontSize: '1.3rem', marginBottom: '20px', color: '#1e293b', borderBottom: '2px solid #e2e8f0', pb: '10px' }}>
                                Available Products in MongoDB Catalog:
                            </h3>
                            <div className="products-grid">
                                {suggestedProducts.map(p => (
                                    <ProductCard key={p._id} product={p} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        )
    }

    // Prepare 4 images list
    const rawImages = (Array.isArray(product.images) && product.images.length > 0)
        ? product.images
        : (Array.isArray(product.image) && product.image.length > 0)
            ? product.image
            : typeof product.thumbnail === "string" && product.thumbnail.trim() !== ""
                ? [product.thumbnail]
                : typeof product.image === "string" && product.image.trim() !== ""
                    ? [product.image]
                    : ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80"]

    const imagesList = Array.isArray(rawImages) ? rawImages : [rawImages]
    const currentImage = imagesList[selectedImageIndex] || imagesList[0]
    const inStock = product.stock === undefined || product.stock > 0
    const ratingValue = product.rating ? Number(product.rating) : (product.averageRating ? Number(product.averageRating) : 4.5)

    const mrpPrice = Number(product.price) || 0
    const finalPrice = product.discountPrice && Number(product.discountPrice) < mrpPrice ? Number(product.discountPrice) : mrpPrice
    const discountPct = product.discountPrice && Number(product.discountPrice) < mrpPrice
        ? Math.round(((mrpPrice - Number(product.discountPrice)) / mrpPrice) * 100)
        : 0

    const imageLabels = ["Front View", "Back View", "Side View", "Detail View"]

    async function handleAddToCart() {
        try {
            setAdding(true)
            setAddMessage("")
            await addToCart(product._id, quantity)
            setAddSuccess(true)
            setAddMessage("Successfully added to cart!")
            setTimeout(() => setAddSuccess(false), 3000)
        } catch (err) {
            console.error("Add to cart error:", err)
            if (err.response?.status === 401) {
                setAddMessage("Please login to add items to cart.")
            } else {
                setAddMessage(err.response?.data?.message || "Failed to add product to cart.")
            }
        } finally {
            setAdding(false)
        }
    }

    return (
        <main className="product-detail-page">
            <div className="product-detail-container">
                {/* Breadcrumb Navigation */}
                <div className="detail-breadcrumb">
                    <Link to="/">Home</Link>
                    <span>/</span>
                    {product.category && (
                        <>
                            <Link to={`/products/${product.category.toLowerCase()}`}>{product.category}</Link>
                            <span>/</span>
                        </>
                    )}
                    <span className="current-crumb">{product.name || product.title}</span>
                </div>

                <div className="product-detail-layout">
                    {/* LEFT: 4-IMAGE GALLERY VIEWER */}
                    <div className="product-gallery-section">
                        {/* Main Featured Image */}
                        <div className="main-image-stage">
                            <img
                                src={currentImage}
                                alt={`${product.name || product.title} view ${selectedImageIndex + 1}`}
                                className="main-featured-image"
                            />
                            {product.category && (
                                <span className="gallery-category-pill">{product.category}</span>
                            )}
                        </div>

                        {/* 4 Thumbnails Gallery */}
                        <div className="thumbnails-grid">
                            {imagesList.map((imgUrl, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    className={`thumbnail-card ${selectedImageIndex === idx ? "active" : ""}`}
                                    onClick={() => setSelectedImageIndex(idx)}
                                >
                                    <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} />
                                    <span className="thumb-label">
                                        {imageLabels[idx] || `View ${idx + 1}`}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT: PRODUCT DETAILS & ACTIONS */}
                    <div className="product-info-section">
                        {product.brand && (
                            <span className="product-brand-tag">{product.brand}</span>
                        )}

                        <h1 className="product-detail-title">{product.name || product.title}</h1>

                        {/* Rating & Stock Status */}
                        <div className="product-meta-row">
                            <div className="product-rating-box">
                                <span className="stars">{"★".repeat(Math.floor(ratingValue))}</span>
                                <span className="rating-score">{ratingValue.toFixed(1)} / 5.0</span>
                            </div>

                            <div className={`stock-status-pill ${inStock ? "in-stock" : "out-of-stock"}`}>
                                <span className="dot"></span>
                                {inStock ? `In Stock (${product.stock} units)` : "Out of Stock"}
                            </div>
                        </div>

                        {/* Price & Discount */}
                        <div className="product-price-box" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                                <span className="currency-symbol">₹</span>
                                <span className="price-amount">{finalPrice.toLocaleString("en-IN")}</span>
                                {discountPct > 0 && (
                                    <span style={{ textDecoration: 'line-through', fontSize: '1.2rem', color: '#94a3b8' }}>
                                        ₹{mrpPrice.toLocaleString("en-IN")}
                                    </span>
                                )}
                                {discountPct > 0 && (
                                    <span style={{
                                        backgroundColor: '#dc2626',
                                        color: '#ffffff',
                                        fontSize: '0.85rem',
                                        fontWeight: '800',
                                        padding: '4px 10px',
                                        borderRadius: '8px'
                                    }}>
                                        {discountPct}% OFF
                                    </span>
                                )}
                            </div>
                            <span className="tax-inclusive-text">Inclusive of all taxes</span>
                        </div>

                        {/* Category & SubCategory Badges */}
                        <div className="category-tags-group">
                            {product.category && (
                                <span className="tag-pill category">Category: {product.category}</span>
                            )}
                            {product.subCategory && (
                                <span className="tag-pill subcategory">Subcategory: {product.subCategory}</span>
                            )}
                        </div>

                        {/* Description */}
                        <div className="product-description-box">
                            <h3>Product Overview</h3>
                            <p>{product.description}</p>
                        </div>

                        {/* Quantity & Add to Cart Action */}
                        <div className="product-actions-card">
                            <div className="quantity-selector">
                                <label>Quantity:</label>
                                <div className="qty-counter">
                                    <button
                                        type="button"
                                        onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                        disabled={quantity <= 1}
                                    >
                                        -
                                    </button>
                                    <span>{quantity}</span>
                                    <button
                                        type="button"
                                        onClick={() => setQuantity(prev => prev + 1)}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <button
                                type="button"
                                className={`add-to-cart-large-btn ${addSuccess ? "success" : ""}`}
                                onClick={handleAddToCart}
                                disabled={adding || !inStock}
                            >
                                {adding ? (
                                    <span>Adding to Cart...</span>
                                ) : addSuccess ? (
                                    <span>✓ Added to Cart!</span>
                                ) : !inStock ? (
                                    <span>Out of Stock</span>
                                ) : (
                                    <span>🛒 Add to Cart</span>
                                )}
                            </button>

                            {addMessage && (
                                <div className={`add-cart-message ${addSuccess ? "success" : "error"}`}>
                                    {addMessage}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default ProductDetail
