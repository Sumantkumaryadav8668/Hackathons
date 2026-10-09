import { useEffect, useState } from "react"
import api from "../../api/axios"
import "../../styles/adminProduct.css"

function AdminProducts() {
    const [activeTab, setActiveTab] = useState("products") // "products" | "offers"

    // Product state
    const [products, setProducts] = useState([])
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        brand: "",
        image: "",
        stock: "",
        rating: ""
    })
    const [editingId, setEditingId] = useState(null)

    // Offer state
    const [offers, setOffers] = useState([])
    const [offerFormData, setOfferFormData] = useState({
        title: "",
        description: "",
        discountPercentage: "",
        code: "",
        bannerImage: "",
        isActive: true
    })
    const [editingOfferId, setEditingOfferId] = useState(null)

    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)

    // Admin Stats state
    const [adminStats, setAdminStats] = useState({
        totalUsers: 0,
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0
    })

    // Fetch Products
    async function getProducts() {
        try {
            const response = await api.get("/product")
            const raw = response.data.products || response.data.product || (Array.isArray(response.data) ? response.data : [])
            setProducts(Array.isArray(raw) ? raw : [])
        } catch (error) {
            console.log("Get products error:", error)
            setMessage(error.response?.data?.message || "Unable to fetch products")
        }
    }

    // Fetch Offers
    async function getOffers() {
        try {
            const response = await api.get("/offer/admin")
            setOffers(response.data.offers || [])
        } catch (error) {
            console.log("Get offers error:", error)
        }
    }

    // Fetch Admin Stats
    async function getAdminStats() {
        try {
            const response = await api.get("/admin/stats")
            if (response.data) {
                setAdminStats({
                    totalUsers: response.data.totalUsers ?? 0,
                    totalProducts: response.data.totalProducts ?? 0,
                    totalOrders: response.data.totalOrders ?? 0,
                    totalRevenue: response.data.totalRevenue ?? 0
                })
            }
        } catch (error) {
            console.log("Get admin stats error:", error)
        }
    }

    useEffect(() => {
        getProducts()
        getOffers()
        getAdminStats()
    }, [])

    // --- Product Handlers ---
    function handleChange(e) {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    async function handleSubmit(e) {
        e.preventDefault()

        try {
            setLoading(true)
            setMessage("")

            const data = {
                name: formData.name.trim(),
                description: formData.description.trim(),
                price: Number(formData.price),
                category: formData.category.trim(),
                brand: formData.brand.trim(),
                image: formData.image.trim(),
                stock: Number(formData.stock),
                rating: formData.rating === "" ? 0 : Number(formData.rating)
            }

            if (editingId) {
                const response = await api.put(`/product/${editingId}`, data)
                setMessage(response.data.message || "Product updated successfully!")
            } else {
                const response = await api.post("/product", data)
                setMessage(response.data.message || "Product created successfully!")
            }

            setFormData({
                name: "",
                description: "",
                price: "",
                category: "",
                brand: "",
                image: "",
                stock: "",
                rating: ""
            })
            setEditingId(null)
            await getProducts()
        } catch (error) {
            console.log("Product save error:", error)
            setMessage(error.response?.data?.message || "Something went wrong while saving product")
        } finally {
            setLoading(false)
        }
    }

    function handleEdit(product) {
        setEditingId(product._id)
        setFormData({
            name: product.name || "",
            description: product.description || "",
            price: product.price ?? "",
            category: product.category || "",
            brand: product.brand || "",
            image: Array.isArray(product.image) ? product.image[0] : (product.image || ""),
            stock: product.stock ?? "",
            rating: product.rating ?? ""
        })

        const formElement = document.getElementById("product-form-section")
        if (formElement) {
            formElement.scrollIntoView({ behavior: "smooth" })
        }
    }

    function handleCancelEdit() {
        setEditingId(null)
        setFormData({
            name: "",
            description: "",
            price: "",
            category: "",
            brand: "",
            image: "",
            stock: "",
            rating: ""
        })
        setMessage("")
    }

    async function handleDelete(id) {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this product? This action cannot be undone."
        )
        if (!confirmDelete) return

        try {
            const response = await api.delete(`/product/${id}`)
            setMessage(response.data.message || "Product deleted successfully")
            await getProducts()
        } catch (error) {
            console.log("Delete product error:", error)
            setMessage(error.response?.data?.message || "Unable to delete product")
        }
    }

    // --- Offer Handlers ---
    function handleOfferChange(e) {
        const { name, value, type, checked } = e.target
        setOfferFormData({
            ...offerFormData,
            [name]: type === "checkbox" ? checked : value
        })
    }

    async function handleOfferSubmit(e) {
        e.preventDefault()
        try {
            setLoading(true)
            setMessage("")

            const data = {
                title: offerFormData.title.trim(),
                description: offerFormData.description.trim(),
                discountPercentage: offerFormData.discountPercentage ? Number(offerFormData.discountPercentage) : 0,
                code: offerFormData.code.trim().toUpperCase(),
                bannerImage: offerFormData.bannerImage.trim(),
                isActive: offerFormData.isActive
            }

            if (editingOfferId) {
                const response = await api.put(`/offer/${editingOfferId}`, data)
                setMessage(response.data.message || "Offer updated successfully!")
            } else {
                const response = await api.post("/offer", data)
                setMessage(response.data.message || "Offer created successfully!")
            }

            setOfferFormData({
                title: "",
                description: "",
                discountPercentage: "",
                code: "",
                bannerImage: "",
                isActive: true
            })
            setEditingOfferId(null)
            await getOffers()
        } catch (error) {
            console.log("Offer save error:", error)
            setMessage(error.response?.data?.message || "Unable to save offer")
        } finally {
            setLoading(false)
        }
    }

    function handleEditOffer(offer) {
        setEditingOfferId(offer._id)
        setOfferFormData({
            title: offer.title || "",
            description: offer.description || "",
            discountPercentage: offer.discountPercentage ?? "",
            code: offer.code || "",
            bannerImage: offer.bannerImage || "",
            isActive: offer.isActive ?? true
        })
    }

    async function handleToggleOfferActive(offer) {
        try {
            await api.put(`/offer/${offer._id}`, { isActive: !offer.isActive })
            await getOffers()
        } catch (error) {
            console.log("Toggle offer error:", error)
        }
    }

    async function handleDeleteOffer(id) {
        if (!window.confirm("Are you sure you want to delete this offer?")) return
        try {
            await api.delete(`/offer/${id}`)
            setMessage("Offer deleted successfully")
            await getOffers()
        } catch (error) {
            console.log("Delete offer error:", error)
        }
    }

    // Stats calculations
    const totalProducts = products.length
    const totalStock = products.reduce((sum, p) => sum + (Number(p.stock) || 0), 0)
    const uniqueCategories = new Set(products.map((p) => p.category).filter(Boolean)).size

    return (
        <div className="admin-products-page">
            <div className="admin-products-container">
                {/* Header Section */}
                <div className="admin-products-header">
                    <div>
                        <h1>Admin Management Console</h1>
                        <p>Manage products catalog, store inventory, and special marketing offers.</p>
                    </div>
                    <span className="admin-badge">⚡ Admin Console</span>
                </div>

                {/* Tabs Selector */}
                <div className="admin-tabs-nav">
                    <button
                        className={`admin-tab-btn ${activeTab === "products" ? "active" : ""}`}
                        onClick={() => { setActiveTab("products"); setMessage("") }}
                    >
                        📦 Products Catalog ({products.length})
                    </button>
                    <button
                        className={`admin-tab-btn ${activeTab === "offers" ? "active" : ""}`}
                        onClick={() => { setActiveTab("offers"); setMessage("") }}
                    >
                        🏷️ Special Offers ({offers.length})
                    </button>
                </div>

                {message && (
                    <div className={`admin-message-alert ${message.toLowerCase().includes("success") ? "success" : "error"}`}>
                        {message}
                    </div>
                )}

                {/* PRODUCTS TAB */}
                {activeTab === "products" && (
                    <>
                        {/* Stats Bar */}
                        <div className="admin-stats-grid">
                            <div className="stat-card">
                                <div className="stat-icon">👥</div>
                                <div className="stat-info">
                                    <span className="stat-value">{adminStats.totalUsers.toLocaleString("en-IN")}</span>
                                    <span className="stat-label">Total Users</span>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">📦</div>
                                <div className="stat-info">
                                    <span className="stat-value">{adminStats.totalProducts.toLocaleString("en-IN")}</span>
                                    <span className="stat-label">Total Products</span>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">🛒</div>
                                <div className="stat-info">
                                    <span className="stat-value">{adminStats.totalOrders.toLocaleString("en-IN")}</span>
                                    <span className="stat-label">Total Orders</span>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">💰</div>
                                <div className="stat-info">
                                    <span className="stat-value" style={{ color: "#059669" }}>
                                        ₹{adminStats.totalRevenue.toLocaleString("en-IN")}
                                    </span>
                                    <span className="stat-label">Total Revenue</span>
                                </div>
                            </div>
                        </div>

                        {/* Form & List Layout */}
                        <div className="admin-content-grid">
                            <div className="admin-product-form-card" id="product-form-section">
                                <div className="form-card-header">
                                    <h2>{editingId ? "✏️ Update Product" : "➕ Add New Product"}</h2>
                                </div>

                                <form onSubmit={handleSubmit} className="admin-form">
                                    <div className="form-group">
                                        <label htmlFor="name">Product Name *</label>
                                        <input
                                            id="name"
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="e.g. Wireless Headphones"
                                            required
                                        />
                                    </div>

                                    <div className="form-row-grid">
                                        <div className="form-group">
                                            <label htmlFor="brand">Brand *</label>
                                            <input
                                                id="brand"
                                                type="text"
                                                name="brand"
                                                value={formData.brand}
                                                onChange={handleChange}
                                                placeholder="e.g. Sony"
                                                required
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="category">Category *</label>
                                            <input
                                                id="category"
                                                type="text"
                                                name="category"
                                                value={formData.category}
                                                onChange={handleChange}
                                                placeholder="e.g. Electronics / Shoes / Clothes"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="form-row-grid">
                                        <div className="form-group">
                                            <label htmlFor="price">Price (₹) *</label>
                                            <input
                                                id="price"
                                                type="number"
                                                name="price"
                                                value={formData.price}
                                                onChange={handleChange}
                                                placeholder="2999"
                                                min="0"
                                                required
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="stock">Stock Quantity *</label>
                                            <input
                                                id="stock"
                                                type="number"
                                                name="stock"
                                                value={formData.stock}
                                                onChange={handleChange}
                                                placeholder="50"
                                                min="0"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="rating">Rating (0.0 to 5.0)</label>
                                        <input
                                            id="rating"
                                            type="number"
                                            name="rating"
                                            value={formData.rating}
                                            onChange={handleChange}
                                            placeholder="4.5"
                                            min="0"
                                            max="5"
                                            step="0.1"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="image">Image URL *</label>
                                        <input
                                            id="image"
                                            type="text"
                                            name="image"
                                            value={formData.image}
                                            onChange={handleChange}
                                            placeholder="https://images.unsplash.com/..."
                                            required
                                        />
                                    </div>

                                    {formData.image && (
                                        <div className="image-preview-box">
                                            <span className="preview-label">Image Preview:</span>
                                            <img
                                                src={formData.image}
                                                alt="Preview"
                                                className="preview-img"
                                                onError={(e) => { e.target.style.display = 'none' }}
                                            />
                                        </div>
                                    )}

                                    <div className="form-group">
                                        <label htmlFor="description">Product Description *</label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            placeholder="Detailed specifications..."
                                            rows="3"
                                            required
                                        />
                                    </div>

                                    <div className="admin-form-buttons">
                                        <button type="submit" disabled={loading} className="save-product-btn">
                                            {loading ? "Saving..." : editingId ? "Update Product" : "Save Product"}
                                        </button>

                                        {editingId && (
                                            <button type="button" className="cancel-product-btn" onClick={handleCancelEdit}>
                                                Cancel Edit
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </div>

                            {/* Product Grid */}
                            <div className="admin-product-list">
                                <h2>Inventory Products ({products.length})</h2>
                                {products.length === 0 ? (
                                    <div className="no-products-admin">
                                        <p>No products in database. Add your first product.</p>
                                    </div>
                                ) : (
                                    <div className="admin-products-grid">
                                        {products.map((product) => {
                                            const img = Array.isArray(product.image) ? product.image[0] : product.image
                                            return (
                                                <div
                                                    className={`admin-product-card ${editingId === product._id ? "active-editing" : ""}`}
                                                    key={product._id}
                                                >
                                                    <div className="admin-card-image-box">
                                                        {img ? (
                                                            <img src={img} alt={product.name} className="admin-product-image" />
                                                        ) : (
                                                            <div className="admin-product-no-image">No Image</div>
                                                        )}
                                                        <span className="card-cat-badge">{product.category}</span>
                                                    </div>

                                                    <div className="admin-product-details">
                                                        <span className="card-brand">{product.brand}</span>
                                                        <h3 className="card-title">{product.name}</h3>

                                                        <div className="card-meta-row">
                                                            <span className="card-price">₹{Number(product.price).toLocaleString("en-IN")}</span>
                                                            <span className={`card-stock ${product.stock > 0 ? "in" : "out"}`}>
                                                                Stock: {product.stock}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="admin-product-actions">
                                                        <button className="edit-product-btn" onClick={() => handleEdit(product)}>
                                                            Edit
                                                        </button>
                                                        <button className="delete-product-btn" onClick={() => handleDelete(product._id)}>
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}

                {/* OFFERS TAB */}
                {activeTab === "offers" && (
                    <div className="admin-content-grid">
                        <div className="admin-product-form-card">
                            <h2>{editingOfferId ? "✏️ Edit Special Offer" : "➕ Add Special Offer"}</h2>
                            <form onSubmit={handleOfferSubmit} className="admin-form">
                                <div className="form-group">
                                    <label>Offer Title *</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={offerFormData.title}
                                        onChange={handleOfferChange}
                                        placeholder="e.g. Festive Electronics Super Sale"
                                        required
                                    />
                                </div>

                                <div className="form-row-grid">
                                    <div className="form-group">
                                        <label>Discount Percentage (%)</label>
                                        <input
                                            type="number"
                                            name="discountPercentage"
                                            value={offerFormData.discountPercentage}
                                            onChange={handleOfferChange}
                                            placeholder="25"
                                            min="0"
                                            max="100"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Coupon Code</label>
                                        <input
                                            type="text"
                                            name="code"
                                            value={offerFormData.code}
                                            onChange={handleOfferChange}
                                            placeholder="FESTIVE25"
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Banner Image URL</label>
                                    <input
                                        type="text"
                                        name="bannerImage"
                                        value={offerFormData.bannerImage}
                                        onChange={handleOfferChange}
                                        placeholder="https://images.unsplash.com/..."
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Offer Description</label>
                                    <textarea
                                        name="description"
                                        value={offerFormData.description}
                                        onChange={handleOfferChange}
                                        placeholder="Special deal valid for this week..."
                                        rows="3"
                                    />
                                </div>

                                <div className="form-group checkbox-group">
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            name="isActive"
                                            checked={offerFormData.isActive}
                                            onChange={handleOfferChange}
                                        />
                                        <span>Active (Visible on Home Page)</span>
                                    </label>
                                </div>

                                <div className="admin-form-buttons">
                                    <button type="submit" disabled={loading} className="save-product-btn">
                                        {loading ? "Saving..." : editingOfferId ? "Update Offer" : "Add Offer"}
                                    </button>

                                    {editingOfferId && (
                                        <button
                                            type="button"
                                            className="cancel-product-btn"
                                            onClick={() => {
                                                setEditingOfferId(null)
                                                setOfferFormData({
                                                    title: "",
                                                    description: "",
                                                    discountPercentage: "",
                                                    code: "",
                                                    bannerImage: "",
                                                    isActive: true
                                                })
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>

                        <div className="admin-product-list">
                            <h2>Active & Inactive Offers ({offers.length})</h2>
                            {offers.length === 0 ? (
                                <div className="no-products-admin">
                                    <p>No special offers created yet. Create one using the form.</p>
                                </div>
                            ) : (
                                <div className="admin-products-grid">
                                    {offers.map((offer) => (
                                        <div className="admin-product-card offer-card-admin" key={offer._id}>
                                            <div className="admin-product-details">
                                                <div className="offer-admin-header">
                                                    <h3 className="card-title">{offer.title}</h3>
                                                    <span className={`status-badge ${offer.isActive ? "active" : "inactive"}`}>
                                                        {offer.isActive ? "● Active" : "○ Disabled"}
                                                    </span>
                                                </div>

                                                {offer.discountPercentage > 0 && (
                                                    <span className="card-price">{offer.discountPercentage}% OFF</span>
                                                )}
                                                {offer.code && <div className="coupon-preview">Code: {offer.code}</div>}
                                                <p className="card-desc">{offer.description}</p>
                                            </div>

                                            <div className="admin-product-actions">
                                                <button
                                                    className="toggle-active-btn"
                                                    onClick={() => handleToggleOfferActive(offer)}
                                                >
                                                    {offer.isActive ? "Disable" : "Enable"}
                                                </button>

                                                <button className="edit-product-btn" onClick={() => handleEditOffer(offer)}>
                                                    Edit
                                                </button>

                                                <button className="delete-product-btn" onClick={() => handleDeleteOffer(offer._id)}>
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AdminProducts