import { useEffect, useState } from "react"
import api from "../../api/axios"
import "../../styles/adminDashbord.css"

function AdminCategories() {
    const [categories, setCategories] = useState([])
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [icon, setIcon] = useState("📦")
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")

    async function fetchCategories() {
        try {
            const res = await api.get("/category/admin")
            setCategories(res.data.categories || [])
        } catch (err) {
            console.error("Fetch categories error:", err)
        }
    }

    useEffect(() => {
        fetchCategories()
    }, [])

    async function handleSubmit(e) {
        e.preventDefault()
        if (!name.trim()) return

        try {
            setLoading(true)
            setMessage("")
            const res = await api.post("/category", {
                name: name.trim(),
                description: description.trim(),
                icon: icon.trim() || "📦"
            })
            setMessage("✓ " + (res.data.message || "Category created successfully"))
            setName("")
            setDescription("")
            setIcon("📦")
            await fetchCategories()
        } catch (err) {
            console.error("Create category error:", err)
            setMessage("❌ " + (err.response?.data?.message || "Failed to create category"))
        } finally {
            setLoading(false)
        }
    }

    async function handleDelete(id) {
        if (!window.confirm("Are you sure you want to delete this category?")) return
        try {
            await api.delete(`/category/${id}`)
            setMessage("✓ Category deleted successfully")
            await fetchCategories()
        } catch (err) {
            console.error("Delete category error:", err)
        }
    }

    return (
        <div className="admin-dashboard">
            <div className="admin-container">
                <div className="admin-header">
                    <div>
                        <h1>🏷️ Admin Category Management</h1>
                        <p>Create and manage product categories for store navigation.</p>
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

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', flexWrap: 'wrap' }}>
                    {/* Add Category Form */}
                    <div className="admin-card">
                        <h2>➕ Add New Category</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="admin-form-group">
                                <label>Category Name *</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Electronics"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="admin-form-group">
                                <label>Emoji Icon</label>
                                <input
                                    type="text"
                                    placeholder="💻"
                                    value={icon}
                                    onChange={(e) => setIcon(e.target.value)}
                                />
                            </div>

                            <div className="admin-form-group">
                                <label>Description</label>
                                <textarea
                                    placeholder="Gadgets & Tech..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows="3"
                                />
                            </div>

                            <button type="submit" className="admin-add-button" disabled={loading}>
                                {loading ? "Creating..." : "Save Category"}
                            </button>
                        </form>
                    </div>

                    {/* Category List */}
                    <div className="admin-card">
                        <h2>Store Categories ({categories.length})</h2>
                        {categories.length === 0 ? (
                            <p style={{ color: '#94a3b8' }}>No categories created yet.</p>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginTop: '16px' }}>
                                {categories.map((cat) => (
                                    <div key={cat._id} style={{ background: '#0f172a', padding: '16px', borderRadius: '12px', border: '1px solid #334155', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                        <div>
                                            <span style={{ fontSize: '2rem' }}>{cat.icon || "📦"}</span>
                                            <h3 style={{ margin: '8px 0 4px 0', color: '#f8fafc', fontSize: '1.1rem' }}>{cat.name}</h3>
                                            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Slug: {cat.slug}</span>
                                            {cat.description && <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '6px' }}>{cat.description}</p>}
                                        </div>

                                        <button
                                            onClick={() => handleDelete(cat._id)}
                                            style={{
                                                background: 'rgba(239, 68, 68, 0.2)',
                                                color: '#ef4444',
                                                border: '1px solid #ef4444',
                                                padding: '6px 12px',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                marginTop: '12px',
                                                fontWeight: '600'
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminCategories
