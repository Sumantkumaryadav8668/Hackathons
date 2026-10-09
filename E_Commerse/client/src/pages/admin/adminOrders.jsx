import { useEffect, useState } from "react"
import api from "../../api/axios"
import "../../styles/adminDashbord.css"

function AdminOrders() {
    const [orders, setOrders] = useState([])
    const [statusFilter, setStatusFilter] = useState("ALL")
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState("")

    // Delivery OTP verification modal state
    const [otpModalOrderId, setOtpModalOrderId] = useState(null)
    const [otpInput, setOtpInput] = useState("")
    const [otpLoading, setOtpLoading] = useState(false)
    const [otpMessage, setOtpMessage] = useState("")

    async function fetchOrders() {
        try {
            setLoading(true)
            setMessage("")
            const res = await api.get(`/admin/orders?status=${statusFilter}`)
            setOrders(res.data.orders || [])
        } catch (err) {
            console.error("Fetch admin orders error:", err)
            setMessage(err.response?.data?.message || "Failed to fetch orders")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchOrders()
    }, [statusFilter])

    async function handleStatusChange(orderId, newStatus) {
        try {
            setMessage("")
            const res = await api.put(`/admin/orders/${orderId}/status`, {
                orderStatus: newStatus
            })
            setMessage("✓ " + (res.data.message || "Order status updated"))
            await fetchOrders()
        } catch (err) {
            console.error("Update status error:", err)
            setMessage("❌ " + (err.response?.data?.message || "Failed to update order status"))
        }
    }

    async function handleVerifyOtpSubmit(e) {
        e.preventDefault()
        if (!otpInput || otpInput.trim().length !== 6) {
            setOtpMessage("Please enter a valid 6-digit Delivery OTP.")
            return
        }

        try {
            setOtpLoading(true)
            setOtpMessage("")
            const res = await api.post(`/admin/orders/${otpModalOrderId}/verify-delivery-otp`, {
                otp: otpInput.trim()
            })
            setOtpMessage("✓ " + (res.data.message || "Delivery OTP verified! Order marked DELIVERED."))
            setTimeout(() => {
                setOtpModalOrderId(null)
                setOtpInput("")
                fetchOrders()
            }, 1200)
        } catch (err) {
            console.error("Verify OTP error:", err)
            setOtpMessage(err.response?.data?.message || "Invalid Delivery OTP")
        } finally {
            setOtpLoading(false)
        }
    }

    async function handleVerifyPaymentAdmin(paymentId) {
        try {
            setMessage("")
            const res = await api.post(`/admin/payments/${paymentId}/verify`)
            setMessage("✓ " + (res.data.message || "Payment verified by Admin! Order confirmed."))
            await fetchOrders()
        } catch (err) {
            console.error("Verify payment error:", err)
            setMessage("❌ " + (err.response?.data?.message || "Failed to verify payment"))
        }
    }

    return (
        <div className="admin-dashboard">
            <div className="admin-container">
                <div className="admin-header">
                    <div>
                        <h1>📦 Admin Orders Management</h1>
                        <p>Track store transactions, update delivery status, and verify customer delivery OTPs.</p>
                    </div>
                </div>

                {message && (
                    <div className={`admin-stats-error-alert ${message.includes("✓") ? "success" : "error"}`} style={{
                        background: message.includes("✓") ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
                        borderColor: message.includes("✓") ? "#10b981" : "#ef4444",
                        color: message.includes("✓") ? "#a7f3d0" : "#fca5a5"
                    }}>
                        {message}
                    </div>
                )}

                {/* Filter Toolbar */}
                <div className="admin-card" style={{ padding: '16px 24px', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <label style={{ fontWeight: '600', color: '#94a3b8' }}>Filter by Status:</label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    background: '#0f172a',
                                    color: '#f8fafc',
                                    border: '1px solid #334155',
                                    cursor: 'pointer'
                                }}
                            >
                                <option value="ALL">All Orders</option>
                                <option value="pending_payment">Pending Payment</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="out_for_delivery">Out for Delivery</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                        <button
                            className="stats-refresh-btn"
                            onClick={fetchOrders}
                            disabled={loading}
                        >
                            🔄 Refresh Orders
                        </button>
                    </div>
                </div>

                {/* Orders List */}
                {loading ? (
                    <div className="loading-spinner-box">
                        <div className="main-spinner"></div>
                        <p>Loading store orders...</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="admin-card" style={{ textAlign: 'center', padding: '40px' }}>
                        <h3>No Orders Found</h3>
                        <p style={{ color: '#94a3b8' }}>No customer orders match the selected status filter.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {orders.map((order) => {
                            const user = order.user || {}
                            const payment = order.payment || {}
                            const isPaid = order.paymentStatus === "success" || payment.paymentStatus === "success"

                            return (
                                <div className="admin-card" key={order._id} style={{ position: 'relative' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid #334155', paddingBottom: '12px', marginBottom: '16px' }}>
                                        <div>
                                            <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#f8fafc' }}>
                                                Order #{order._id}
                                            </h3>
                                            <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                                                Customer: <strong>{user.name || "Guest"}</strong> ({user.email || "No email"}) • {user.phone ? `📱 ${user.phone}` : "No phone"}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <span style={{
                                                padding: '4px 12px',
                                                borderRadius: '20px',
                                                fontSize: '0.8rem',
                                                fontWeight: '600',
                                                background: isPaid ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                                                color: isPaid ? '#10b981' : '#f59e0b',
                                                border: `1px solid ${isPaid ? '#10b981' : '#f59e0b'}`
                                            }}>
                                                Payment: {isPaid ? "SUCCESS" : "PENDING"}
                                            </span>
                                            <span style={{
                                                padding: '4px 12px',
                                                borderRadius: '20px',
                                                fontSize: '0.8rem',
                                                fontWeight: '600',
                                                background: order.orderStatus === 'delivered' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(99, 102, 241, 0.2)',
                                                color: order.orderStatus === 'delivered' ? '#10b981' : '#818cf8',
                                                border: `1px solid ${order.orderStatus === 'delivered' ? '#10b981' : '#818cf8'}`
                                            }}>
                                                Status: {String(order.orderStatus || 'pending_payment').toUpperCase()}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Items List */}
                                    <div style={{ margin: '12px 0' }}>
                                        <h4 style={{ color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '8px' }}>Ordered Items:</h4>
                                        {order.items && order.items.map((item, idx) => (
                                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#94a3b8', padding: '4px 0' }}>
                                                <span>{item.product?.name || item.name || "Item"} x{item.quantity}</span>
                                                <span>₹{Number((item.price || 0) * (item.quantity || 1)).toLocaleString("en-IN")}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Shipping Address */}
                                    {order.shippingAddress && (
                                        <div style={{ fontSize: '0.85rem', color: '#94a3b8', background: '#0f172a', padding: '10px', borderRadius: '8px', marginBottom: '14px' }}>
                                            📍 <strong>Shipping Address:</strong> {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                                        </div>
                                    )}

                                    {/* Actions Bar */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderTop: '1px solid #334155', paddingTop: '14px' }}>
                                        <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#10b981' }}>
                                            Total: ₹{Number(order.totalAmount || 0).toLocaleString("en-IN")}
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                                            {/* Verify Payment Button */}
                                            {!isPaid && payment._id && (
                                                <button
                                                    onClick={() => handleVerifyPaymentAdmin(payment._id)}
                                                    style={{
                                                        background: '#10b981',
                                                        color: '#fff',
                                                        border: 'none',
                                                        padding: '6px 14px',
                                                        borderRadius: '6px',
                                                        cursor: 'pointer',
                                                        fontWeight: '600'
                                                    }}
                                                >
                                                    ✓ Verify Payment
                                                </button>
                                            )}

                                            {/* Status Transition Dropdown */}
                                            <select
                                                value={order.orderStatus}
                                                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                style={{
                                                    padding: '6px 12px',
                                                    borderRadius: '6px',
                                                    background: '#1e293b',
                                                    color: '#f8fafc',
                                                    border: '1px solid #475569',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <option value="pending_payment">pending_payment</option>
                                                <option value="confirmed">confirmed</option>
                                                <option value="processing">processing</option>
                                                <option value="shipped">shipped</option>
                                                <option value="out_for_delivery">out_for_delivery</option>
                                                <option value="delivered">delivered</option>
                                                <option value="cancelled">cancelled</option>
                                            </select>

                                            {/* Verify Customer Delivery OTP Button */}
                                            {order.orderStatus !== 'delivered' && order.orderStatus !== 'cancelled' && (
                                                <button
                                                    onClick={() => {
                                                        setOtpModalOrderId(order._id)
                                                        setOtpInput("")
                                                        setOtpMessage("")
                                                    }}
                                                    style={{
                                                        background: '#6366f1',
                                                        color: '#fff',
                                                        border: 'none',
                                                        padding: '6px 14px',
                                                        borderRadius: '6px',
                                                        cursor: 'pointer',
                                                        fontWeight: '600'
                                                    }}
                                                >
                                                    🔐 Enter Delivery OTP
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* Delivery OTP Verification Modal */}
            {otpModalOrderId && (
                <div className="otp-modal-overlay" style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.75)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999
                }}>
                    <div style={{
                        background: '#1e293b',
                        padding: '24px',
                        borderRadius: '16px',
                        width: '90%',
                        maxWidth: '420px',
                        border: '1px solid #334155'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h3 style={{ margin: 0, color: '#f8fafc' }}>🔐 Enter Customer Delivery OTP</h3>
                            <button onClick={() => setOtpModalOrderId(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
                        </div>
                        <p style={{ fontSize: '0.88rem', color: '#94a3b8', marginBottom: '16px' }}>
                            Ask the customer for their 6-digit Delivery OTP to confirm package handover and complete delivery.
                        </p>

                        {otpMessage && (
                            <div style={{
                                padding: '10px 14px',
                                borderRadius: '8px',
                                marginBottom: '14px',
                                fontSize: '0.85rem',
                                background: otpMessage.includes("✓") ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                                color: otpMessage.includes("✓") ? '#10b981' : '#ef4444'
                            }}>
                                {otpMessage}
                            </div>
                        )}

                        <form onSubmit={handleVerifyOtpSubmit}>
                            <input
                                type="text"
                                maxLength="6"
                                placeholder="• • • • • •"
                                value={otpInput}
                                onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ""))}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    fontSize: '1.4rem',
                                    textAlign: 'center',
                                    letterSpacing: '4px',
                                    borderRadius: '8px',
                                    border: '1px solid #475569',
                                    background: '#0f172a',
                                    color: '#f8fafc',
                                    marginBottom: '16px'
                                }}
                                autoFocus
                            />
                            <button
                                type="submit"
                                disabled={otpLoading || otpInput.length !== 6}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    background: '#10b981',
                                    color: '#fff',
                                    border: 'none',
                                    fontWeight: 'bold',
                                    cursor: 'pointer'
                                }}
                            >
                                {otpLoading ? "Verifying OTP..." : "Confirm & Mark Delivered"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminOrders
