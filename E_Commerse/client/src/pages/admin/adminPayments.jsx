import { useEffect, useState } from "react"
import api from "../../api/axios"
import "../../styles/adminDashbord.css"

function AdminPayments() {
    const [payments, setPayments] = useState([])
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState("")

    async function fetchPayments() {
        try {
            setLoading(true)
            setMessage("")
            const res = await api.get("/admin/payments")
            setPayments(res.data.payments || [])
        } catch (err) {
            console.error("Fetch payments error:", err)
            setMessage(err.response?.data?.message || "Failed to fetch payments")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPayments()
    }, [])

    async function handleVerifyPayment(paymentId) {
        try {
            setMessage("")
            const res = await api.post(`/admin/payments/${paymentId}/verify`)
            setMessage("✓ " + (res.data.message || "Payment verified & Order confirmed"))
            await fetchPayments()
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
                        <h1>💳 Admin Payments Management</h1>
                        <p>View transaction logs, transaction IDs, UTR numbers, and manually verify customer QR payments.</p>
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

                <div className="admin-card" style={{ padding: '16px 24px', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2>Transaction History ({payments.length})</h2>
                        <button className="stats-refresh-btn" onClick={fetchPayments} disabled={loading}>
                            🔄 Refresh Payments
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="loading-spinner-box">
                        <div className="main-spinner"></div>
                        <p>Loading payments...</p>
                    </div>
                ) : payments.length === 0 ? (
                    <div className="admin-card" style={{ textAlign: 'center', padding: '40px' }}>
                        <h3>No Payment Records Found</h3>
                        <p style={{ color: '#94a3b8' }}>Payment records will appear when customers place online orders.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {payments.map((payment) => {
                            const user = payment.user || {}
                            const order = payment.order || {}
                            const isSuccess = payment.paymentStatus === "success"

                            return (
                                <div className="admin-card" key={payment._id}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid #334155', paddingBottom: '12px' }}>
                                        <div>
                                            <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '1.1rem' }}>
                                                Transaction: {payment.transactionId || payment._id}
                                            </h3>
                                            <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                                                Customer: <strong>{user.name || "User"}</strong> ({user.email}) • Method: <strong>{payment.paymentMethod}</strong>
                                            </span>
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <span style={{
                                                padding: '4px 12px',
                                                borderRadius: '20px',
                                                fontSize: '0.8rem',
                                                fontWeight: 'bold',
                                                background: isSuccess ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                                                color: isSuccess ? '#10b981' : '#f59e0b',
                                                border: `1px solid ${isSuccess ? '#10b981' : '#f59e0b'}`
                                            }}>
                                                {String(payment.paymentStatus).toUpperCase()}
                                            </span>

                                            {!isSuccess && (
                                                <button
                                                    onClick={() => handleVerifyPayment(payment._id)}
                                                    style={{
                                                        background: '#10b981',
                                                        color: '#fff',
                                                        border: 'none',
                                                        padding: '6px 14px',
                                                        borderRadius: '6px',
                                                        cursor: 'pointer',
                                                        fontWeight: 'bold',
                                                        fontSize: '0.85rem'
                                                    }}
                                                >
                                                    ✓ Verify & Approve
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: '0.9rem', color: '#cbd5e1' }}>
                                        <div>
                                            <span>Order ID: <strong>#{order._id || payment.order}</strong></span>
                                            {payment.utrNumber && <span style={{ marginLeft: '16px' }}>UTR: <strong>{payment.utrNumber}</strong></span>}
                                        </div>
                                        <div style={{ fontWeight: 'bold', color: '#10b981', fontSize: '1.1rem' }}>
                                            Amount: ₹{Number(payment.amount || 0).toLocaleString("en-IN")}
                                        </div>
                                    </div>

                                    <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '8px' }}>
                                        Payment Date: {payment.createdAt ? new Date(payment.createdAt).toLocaleString("en-IN") : "N/A"}
                                        {payment.verifiedAt && ` • Verified on ${new Date(payment.verifiedAt).toLocaleString("en-IN")}`}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}

export default AdminPayments
