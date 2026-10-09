import { useEffect, useState } from "react"
import api from "../../api/axios"
import "../../styles/adminDashbord.css"

function AdminUsers() {
    const [users, setUsers] = useState([])
    const [search, setSearch] = useState("")
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState("")

    async function fetchUsers() {
        try {
            setLoading(true)
            setMessage("")
            const res = await api.get("/admin/users")
            setUsers(res.data.users || [])
        } catch (err) {
            console.error("Fetch users error:", err)
            setMessage(err.response?.data?.message || "Failed to fetch users")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    async function handleToggleStatus(userId) {
        try {
            setMessage("")
            const res = await api.put(`/admin/users/${userId}/status`)
            setMessage("✓ " + (res.data.message || "User status updated"))
            await fetchUsers()
        } catch (err) {
            console.error("Toggle status error:", err)
            setMessage("❌ " + (err.response?.data?.message || "Failed to toggle user status"))
        }
    }

    async function handleRoleChange(userId, newRole) {
        try {
            setMessage("")
            const res = await api.put(`/admin/users/${userId}/role`, { role: newRole })
            setMessage("✓ " + (res.data.message || "User role updated"))
            await fetchUsers()
        } catch (err) {
            console.error("Update role error:", err)
            setMessage("❌ " + (err.response?.data?.message || "Failed to update user role"))
        }
    }

    const filteredUsers = users.filter((u) => {
        const q = search.toLowerCase()
        return (
            (u.name && u.name.toLowerCase().includes(q)) ||
            (u.email && u.email.toLowerCase().includes(q)) ||
            (u.phone && u.phone.includes(q))
        )
    })

    return (
        <div className="admin-dashboard">
            <div className="admin-container">
                <div className="admin-header">
                    <div>
                        <h1>👥 Admin Users Management</h1>
                        <p>Manage registered accounts, toggle active/disabled states, and grant admin roles.</p>
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

                {/* Search Bar */}
                <div className="admin-card" style={{ padding: '16px 24px', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                        <input
                            type="text"
                            placeholder="🔍 Search user by name, email, or phone..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{
                                width: '100%',
                                maxWidth: '400px',
                                padding: '10px 16px',
                                borderRadius: '8px',
                                background: '#0f172a',
                                color: '#f8fafc',
                                border: '1px solid #334155'
                            }}
                        />
                        <button className="stats-refresh-btn" onClick={fetchUsers} disabled={loading}>
                            🔄 Refresh Users ({filteredUsers.length})
                        </button>
                    </div>
                </div>

                {/* Users List */}
                {loading ? (
                    <div className="loading-spinner-box">
                        <div className="main-spinner"></div>
                        <p>Loading registered users...</p>
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="admin-card" style={{ textAlign: 'center', padding: '40px' }}>
                        <h3>No Users Found</h3>
                        <p style={{ color: '#94a3b8' }}>No accounts match your search query.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
                        {filteredUsers.map((user) => (
                            <div className="admin-card" key={user._id} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                        <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '1.1rem' }}>{user.name}</h3>
                                        <span style={{
                                            padding: '2px 10px',
                                            borderRadius: '12px',
                                            fontSize: '0.75rem',
                                            fontWeight: 'bold',
                                            background: user.isActive !== false ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                            color: user.isActive !== false ? '#10b981' : '#ef4444',
                                            border: `1px solid ${user.isActive !== false ? '#10b981' : '#ef4444'}`
                                        }}>
                                            {user.isActive !== false ? "● Active" : "○ Disabled"}
                                        </span>
                                    </div>

                                    <p style={{ fontSize: '0.9rem', color: '#94a3b8', margin: '4px 0' }}>✉️ {user.email}</p>
                                    <p style={{ fontSize: '0.9rem', color: '#94a3b8', margin: '4px 0' }}>📱 Phone: {user.phone || "Not provided"}</p>
                                    <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '4px 0' }}>
                                        Joined: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                                    </p>
                                </div>

                                <div style={{ borderTop: '1px solid #334155', paddingTop: '12px', marginTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block' }}>Role:</label>
                                        <select
                                            value={user.role || "user"}
                                            onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                            style={{
                                                padding: '4px 8px',
                                                borderRadius: '6px',
                                                background: '#0f172a',
                                                color: '#f8fafc',
                                                border: '1px solid #475569',
                                                fontSize: '0.85rem'
                                            }}
                                        >
                                            <option value="user">User</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </div>

                                    <button
                                        onClick={() => handleToggleStatus(user._id)}
                                        style={{
                                            background: user.isActive !== false ? '#ef4444' : '#10b981',
                                            color: '#fff',
                                            border: 'none',
                                            padding: '6px 12px',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            fontSize: '0.85rem',
                                            fontWeight: '600'
                                        }}
                                    >
                                        {user.isActive !== false ? "Deactivate" : "Activate"}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default AdminUsers
