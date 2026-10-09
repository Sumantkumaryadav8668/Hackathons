import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../content/authContent"
import api from "../api/axios"
import "../styles/profile.css"

function Profile() {
    const { user, logoutUser } = useAuth()
    const navigate = useNavigate()

    const [profile, setProfile] = useState(null)
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [ordersLoading, setOrdersLoading] = useState(true)
    const [message, setMessage] = useState("")

    // Get user profile
    async function getProfile() {
        try {
            setLoading(true)
            const response = await api.get("/user/profile")
            setProfile(response.data)
        } catch (error) {
            console.log("Profile error:", error)
            if (error.response?.status === 401) {
                logoutUser()
                navigate("/login")
                return
            }
            setMessage(
                error.response?.data?.message ||
                "Unable to load profile information"
            )
        } finally {
            setLoading(false)
        }
    }

    // Get user orders from backend API GET /order
    async function getOrders() {
        try {
            setOrdersLoading(true)
            const response = await api.get("/order")
            console.log("GET /order response data:", response.data)

            let ordersData = []
            if (Array.isArray(response.data)) {
                ordersData = response.data
            } else if (Array.isArray(response.data?.order)) {
                ordersData = response.data.order
            } else if (Array.isArray(response.data?.orders)) {
                ordersData = response.data.orders
            }

            setOrders(ordersData)
        } catch (error) {
            console.log("Orders fetch error:", error)
            setOrders([])
        } finally {
            setOrdersLoading(false)
        }
    }

    useEffect(() => {
        if (!user) {
            navigate("/login")
            return
        }
        getProfile()
        getOrders()
    }, [user])

    // Handle logout
    async function handleLogout() {
        try {
            await api.post("/user/logout")
        } catch (error) {
            console.log("Logout error:", error)
        } finally {
            logoutUser()
            navigate("/")
        }
    }

    // Account Deletion Handler
    async function handleDeleteAccount() {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete your account? This action is permanent and cannot be undone."
        )
        if (!confirmDelete) return

        try {
            await api.delete("/user/account")
            logoutUser()
            navigate("/")
            alert("Account deleted successfully.")
        } catch (error) {
            console.error("Delete account error:", error)
            setMessage(error.response?.data?.message || "Failed to delete account.")
        }
    }

    // Get badge CSS class by order status
    const getStatusBadgeClass = (status = "pending_payment") => {
        const s = String(status).toLowerCase()
        if (s.includes("deliver")) return "status-delivered"
        if (s.includes("ship")) return "status-shipped"
        if (s.includes("cancel")) return "status-cancelled"
        if (s.includes("confirm") || s.includes("process")) return "status-confirmed"
        return "status-processing"
    }

    if (loading) {
        return (
            <main className="profile-page">
                <div className="profile-loading-box">
                    <div className="main-spinner"></div>
                    <p>Loading account details...</p>
                </div>
            </main>
        )
    }

    return (
        <main className="profile-page">
            <div className="profile-container">
                {/* Profile Banner / Header */}
                <div className="profile-welcome-card">
                    <div className="avatar-circle">
                        {profile?.name ? profile.name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div className="welcome-text">
                        <h1>{profile?.name || "My Profile"}</h1>
                        <p>{profile?.email}</p>
                        <span className={`role-badge ${profile?.role === "admin" ? "admin-role" : ""}`}>
                            {profile?.role === "admin" ? "🛡️ Admin Account" : "👤 Customer"}
                        </span>
                    </div>
                    <div className="header-actions-group">
                        <button className="header-logout-btn" onClick={handleLogout}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                <polyline points="16 17 21 12 16 7"></polyline>
                                <line x1="21" y1="12" x2="9" y2="12"></line>
                            </svg>
                            Logout
                        </button>
                    </div>
                </div>

                {message && (
                    <div className="profile-message-alert">
                        {message}
                    </div>
                )}

                {profile && (
                    <div className="profile-grid-layout">
                        {/* Left Column: Personal Info & Address */}
                        <div className="profile-side-column">
                            {/* Personal Information */}
                            <section className="profile-section-card">
                                <h2 className="section-title">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="12" cy="7" r="4"></circle>
                                    </svg>
                                    Personal Details
                                </h2>

                                <div className="info-list">
                                    <div className="info-item">
                                        <span className="info-label">Full Name</span>
                                        <span className="info-value">{profile.name}</span>
                                    </div>

                                    <div className="info-item">
                                        <span className="info-label">Email Address</span>
                                        <span className="info-value">{profile.email}</span>
                                    </div>

                                    <div className="info-item">
                                        <span className="info-label">Phone Number</span>
                                        <span className="info-value">{profile.phone || "Not provided"}</span>
                                    </div>

                                    <div className="info-item">
                                        <span className="info-label">Account Role</span>
                                        <span className="info-value capitalize">{profile.role}</span>
                                    </div>
                                </div>
                            </section>

                            {/* Saved Address */}
                            <section className="profile-section-card">
                                <h2 className="section-title">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                        <circle cx="12" cy="10" r="3"></circle>
                                    </svg>
                                    Shipping Address
                                </h2>

                                {profile.address?.street ||
                                profile.address?.city ||
                                profile.address?.state ||
                                profile.address?.pincode ? (
                                    <div className="address-display-box">
                                        <p className="street-line">{profile.address.street}</p>
                                        <p>{profile.address.city}, {profile.address.state}</p>
                                        <p className="pincode-line">Pincode: <strong>{profile.address.pincode}</strong></p>
                                    </div>
                                ) : (
                                    <p className="no-address-text">
                                        No saved shipping address yet. Enter your address during cart checkout.
                                    </p>
                                )}
                            </section>

                            {/* Quick Navigation & Security Actions */}
                            <section className="profile-section-card">
                                <h2 className="section-title">Account Options</h2>
                                <div className="quick-buttons">
                                    <button
                                        className="action-btn secondary"
                                        onClick={() => navigate("/cart")}
                                    >
                                        🛒 View Shopping Cart
                                    </button>
                                    <button
                                        className="action-btn primary"
                                        onClick={() => navigate("/")}
                                    >
                                        🛍️ Continue Shopping
                                    </button>
                                    <button
                                        className="action-btn danger"
                                        onClick={handleDeleteAccount}
                                        style={{
                                            background: '#ef4444',
                                            color: '#ffffff',
                                            border: 'none',
                                            padding: '10px 16px',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            marginTop: '8px'
                                        }}
                                    >
                                        🗑️ Delete Account
                                    </button>
                                </div>
                            </section>
                        </div>

                        {/* Right Column: Order History */}
                        <div className="profile-main-column">
                            <section className="profile-section-card">
                                <h2 className="section-title">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                                        <line x1="3" y1="6" x2="21" y2="6"></line>
                                        <path d="M16 10a4 4 0 0 1-8 0"></path>
                                    </svg>
                                    Order History ({orders.length})
                                </h2>

                                {ordersLoading && (
                                    <div className="orders-loading-state">
                                        <div className="main-spinner"></div>
                                        <span>Fetching your order history...</span>
                                    </div>
                                )}

                                {!ordersLoading && orders.length === 0 && (
                                    <div className="no-orders-box">
                                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                                            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                                        </svg>
                                        <h3>No Orders Yet</h3>
                                        <p>When you place an order, it will show up here.</p>
                                        <button
                                            className="shop-now-small-btn"
                                            onClick={() => navigate("/")}
                                        >
                                            Start Shopping
                                        </button>
                                    </div>
                                )}

                                {!ordersLoading && orders.length > 0 && (
                                    <div className="orders-list">
                                        {orders.map((order) => {
                                            const orderDate = order.createdAt
                                                ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                                                      year: "numeric",
                                                      month: "short",
                                                      day: "numeric"
                                                  })
                                                : "Recent"

                                            const status = order.orderStatus || order.status || "pending_payment"

                                            return (
                                                <div className="order-card" key={order._id}>
                                                    <div className="order-card-header">
                                                        <div>
                                                            <span className="order-id-label">Order #{order._id}</span>
                                                            <span className="order-date">{orderDate}</span>
                                                        </div>

                                                        <span className={`status-badge ${getStatusBadgeClass(status)}`}>
                                                            {status.replace(/_/g, " ").toUpperCase()}
                                                        </span>
                                                    </div>

                                                    {/* Order Items */}
                                                    <div className="order-items-list">
                                                        {order.items && order.items.map((item, idx) => (
                                                            <div className="order-item-row" key={idx}>
                                                                <div className="order-item-detail">
                                                                    <span className="item-name">
                                                                        {item.product?.name || item.name || "Product Item"}
                                                                    </span>
                                                                    <span className="item-qty">x{item.quantity || 1}</span>
                                                                </div>
                                                                <span className="item-price">
                                                                    ₹{Number((item.price || 0) * (item.quantity || 1)).toLocaleString("en-IN")}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {order.shippingAddress && (
                                                        <div className="order-address-snippet">
                                                            📍 Deliver to: {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                                                        </div>
                                                    )}

                                                    {/* Customer Delivery OTP Snippet */}
                                                    {status !== "delivered" && status !== "cancelled" && status !== "pending_payment" && (
                                                        <div style={{
                                                            background: 'rgba(99, 102, 241, 0.1)',
                                                            border: '1px dashed #6366f1',
                                                            padding: '10px 14px',
                                                            borderRadius: '8px',
                                                            margin: '10px 0',
                                                            fontSize: '0.88rem',
                                                            color: '#a5b4fc',
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center'
                                                        }}>
                                                            <span>🔐 Delivery Verification OTP:</span>
                                                            <strong style={{ fontSize: '1.1rem', letterSpacing: '2px', color: '#6366f1' }}>
                                                                {order.otpVerified ? "✓ Verified" : "Provide to Delivery Agent"}
                                                            </strong>
                                                        </div>
                                                    )}

                                                    <div className="order-card-footer">
                                                        <div className="order-payment-info">
                                                            Payment Status: <strong style={{ color: order.paymentStatus === "success" ? "#10b981" : "#f59e0b" }}>{order.paymentStatus || "pending"}</strong>
                                                        </div>
                                                        <div className="order-total-amount">
                                                            Total: <span>₹{Number(order.totalAmount || 0).toLocaleString("en-IN")}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
                            </section>
                        </div>
                    </div>
                )}
            </div>
        </main>
    )
}

export default Profile