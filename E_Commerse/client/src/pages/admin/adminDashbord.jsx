import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import "../../styles/adminDashbord.css"
import api from "../../api/axios"

function AdminDashboard() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0
    })
    const [statsLoading, setStatsLoading] = useState(true)
    const [statsError, setStatsError] = useState("")

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        brand: "",
        stock: "",
        rating: "",
        images: ""
    })

    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)

    // Auto-refresh statistics on mount & revisit
    const fetchStats = async () => {
        try {
            setStatsLoading(true)
            setStatsError("")
            const response = await api.get("/admin/stats")
            if (response.data) {
                setStats({
                    totalUsers: response.data.totalUsers ?? 0,
                    totalProducts: response.data.totalProducts ?? 0,
                    totalOrders: response.data.totalOrders ?? 0,
                    totalRevenue: response.data.totalRevenue ?? 0
                })
            }
        } catch (error) {
            console.error("GET ADMIN STATS ERROR:", error)
            setStatsError(
                error.response?.data?.message ||
                "Failed to fetch live admin statistics"
            )
        } finally {
            setStatsLoading(false)
        }
    }

    useEffect(() => {
        fetchStats()
    }, [])

    function handleChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setMessage("")

        try {
            setLoading(true)

            const productData = {
                name: formData.name,
                description: formData.description,
                price: Number(formData.price),
                category: formData.category,
                brand: formData.brand,
                stock: Number(formData.stock),
                rating: Number(formData.rating) || 0,
                images: formData.images
                    .split(",")
                    .map(image => image.trim())
                    .filter(image => image !== "")
            }

            const response = await api.post("/product", productData)

            setMessage(response.data.message || "Product added successfully")

            setFormData({
                name: "",
                description: "",
                price: "",
                category: "",
                brand: "",
                stock: "",
                rating: "",
                images: ""
            })

            // Auto refresh live stats after adding product
            await fetchStats()
        } catch (error) {
            console.log("ADD PRODUCT ERROR:", error)

            setMessage(
                error.response?.data?.message ||
                "Product could not be added"
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="admin-dashboard">
            <div className="admin-container">
                {/* Header Section */}
                <div className="admin-header">
                    <div>
                        <h1>Admin Dashboard</h1>
                        <p>Real-time MiniShop store statistics & product management</p>
                    </div>
                    <div className="admin-header-actions" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <Link to="/admin/products" className="admin-nav-btn">📦 Products</Link>
                        <Link to="/admin/orders" className="admin-nav-btn">🛒 Orders & OTP</Link>
                        <Link to="/admin/users" className="admin-nav-btn">👥 Users</Link>
                        <Link to="/admin/payments" className="admin-nav-btn">💳 Payments</Link>
                        <Link to="/admin/categories" className="admin-nav-btn">🏷️ Categories</Link>
                    </div>
                </div>

                {/* Live MongoDB Admin Statistics Section */}
                <div className="admin-stats-section">
                    <div className="admin-stats-title-bar">
                        <h2>📊 Store Statistics</h2>
                        <button
                            type="button"
                            className="stats-refresh-btn"
                            onClick={fetchStats}
                            disabled={statsLoading}
                        >
                            🔄 {statsLoading ? "Refreshing..." : "Refresh Stats"}
                        </button>
                    </div>

                    {statsError && (
                        <div className="admin-stats-error-alert">
                            {statsError}
                        </div>
                    )}

                    <div className="admin-stats-grid">
                        {/* 1. Total Users */}
                        <div className="admin-stat-card card-users">
                            <div className="stat-icon-wrapper">
                                <span className="stat-emoji">👥</span>
                            </div>
                            <div className="stat-details">
                                <span className="stat-title">Total Users</span>
                                <h3 className="stat-number">
                                    {statsLoading ? (
                                        <span className="stat-loading-pulse">...</span>
                                    ) : (
                                        stats.totalUsers.toLocaleString("en-IN")
                                    )}
                                </h3>
                                <span className="stat-subtext">Registered customers</span>
                            </div>
                        </div>

                        {/* 2. Total Products */}
                        <div className="admin-stat-card card-products">
                            <div className="stat-icon-wrapper">
                                <span className="stat-emoji">📦</span>
                            </div>
                            <div className="stat-details">
                                <span className="stat-title">Total Products</span>
                                <h3 className="stat-number">
                                    {statsLoading ? (
                                        <span className="stat-loading-pulse">...</span>
                                    ) : (
                                        stats.totalProducts.toLocaleString("en-IN")
                                    )}
                                </h3>
                                <span className="stat-subtext">Active store catalog</span>
                            </div>
                        </div>

                        {/* 3. Total Orders */}
                        <div className="admin-stat-card card-orders">
                            <div className="stat-icon-wrapper">
                                <span className="stat-emoji">🛒</span>
                            </div>
                            <div className="stat-details">
                                <span className="stat-title">Total Orders</span>
                                <h3 className="stat-number">
                                    {statsLoading ? (
                                        <span className="stat-loading-pulse">...</span>
                                    ) : (
                                        stats.totalOrders.toLocaleString("en-IN")
                                    )}
                                </h3>
                                <span className="stat-subtext">Customer transactions</span>
                            </div>
                        </div>

                        {/* 4. Total Revenue */}
                        <div className="admin-stat-card card-revenue">
                            <div className="stat-icon-wrapper">
                                <span className="stat-emoji">💰</span>
                            </div>
                            <div className="stat-details">
                                <span className="stat-title">Total Revenue</span>
                                <h3 className="stat-number revenue-text">
                                    {statsLoading ? (
                                        <span className="stat-loading-pulse">...</span>
                                    ) : (
                                        `₹${stats.totalRevenue.toLocaleString("en-IN")}`
                                    )}
                                </h3>
                                <span className="stat-subtext">Paid & successful orders</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Add Product Card */}
                <div className="admin-card">
                    <h2>➕ Quick Add Product</h2>

                    <form onSubmit={handleSubmit}>
                        <div className="admin-form-group">
                            <label>Product Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter product name"
                                required
                            />
                        </div>

                        <div className="admin-form-group">
                            <label>Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Enter product description"
                                required
                            />
                        </div>

                        <div className="admin-row">
                            <div className="admin-form-group">
                                <label>Price (₹)</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    placeholder="Enter price"
                                    min="0"
                                    required
                                />
                            </div>

                            <div className="admin-form-group">
                                <label>Stock</label>
                                <input
                                    type="number"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    placeholder="Enter stock"
                                    min="0"
                                    required
                                />
                            </div>
                        </div>

                        <div className="admin-row">
                            <div className="admin-form-group">
                                <label>Category</label>
                                <input
                                    type="text"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    placeholder="Electronics"
                                    required
                                />
                            </div>

                            <div className="admin-form-group">
                                <label>Brand</label>
                                <input
                                    type="text"
                                    name="brand"
                                    value={formData.brand}
                                    onChange={handleChange}
                                    placeholder="Enter brand"
                                    required
                                />
                            </div>
                        </div>

                        <div className="admin-form-group">
                            <label>Rating (0.0 to 5.0)</label>
                            <input
                                type="number"
                                name="rating"
                                value={formData.rating}
                                onChange={handleChange}
                                placeholder="0 - 5"
                                min="0"
                                max="5"
                                step="0.1"
                            />
                        </div>

                        <div className="admin-form-group">
                            <label>Product Images</label>
                            <input
                                type="text"
                                name="images"
                                value={formData.images}
                                onChange={handleChange}
                                placeholder="Image URL 1, Image URL 2"
                                required
                            />
                            <small>
                                Add multiple image URLs separated by commas.
                            </small>
                        </div>

                        {message && (
                            <p className={`admin-message ${message.toLowerCase().includes("success") ? "success" : "error"}`}>
                                {message}
                            </p>
                        )}

                        <button
                            type="submit"
                            className="admin-add-button"
                            disabled={loading}
                        >
                            {loading ? "Adding Product..." : "Add Product"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard