import { useState, useEffect } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { useAuth } from "../content/authContent"
import { useCart } from "../content/cartContent"
import api from "../api/axios"
import "../styles/navbar.css"

function Navbar() {
    const { user, logoutUser } = useAuth()
    const { cart } = useCart()
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()

    const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "")
    const [accountOpen, setAccountOpen] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    // Sync search input with URL search param
    useEffect(() => {
        setSearchQuery(searchParams.get("search") || "")
    }, [searchParams])

    const handleSearchChange = (e) => {
        const query = e.target.value
        setSearchQuery(query)

        if (window.location.pathname !== "/") {
            if (query.trim()) {
                navigate(`/?search=${encodeURIComponent(query)}`)
            } else {
                navigate("/")
            }
        } else {
            if (query.trim()) {
                setSearchParams({ search: query })
            } else {
                setSearchParams({})
            }
        }
    }

    const clearSearch = () => {
        setSearchQuery("")
        if (window.location.pathname === "/") {
            setSearchParams({})
        } else {
            navigate("/")
        }
    }

    async function handleDeleteAccount() {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete your account? This action cannot be undone."
        )

        if (!confirmDelete) return

        try {
            setDeleting(true)
            await api.delete("/user/account")
            logoutUser()
            setAccountOpen(false)
            navigate("/")
            alert("Account deleted successfully.")
        } catch (error) {
            console.log("Delete account error:", error)
            alert(
                error.response?.data?.message ||
                "Unable to delete account"
            )
        } finally {
            setDeleting(false)
        }
    }

    const totalCartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0)

    return (
        <nav className="navbar">
            <div className="navbar-container">
                {/* Left: Logo & Home Link (Home immediately beside Logo) */}
                <div className="navbar-left">
                    <Link
                        to="/"
                        className="navbar-logo"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <img
                            src="/minishop-logo.png"
                            alt="MiniShop"
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                            }}
                        />
                        <span className="logo-text-fallback" style={{ display: 'none' }}>
                            Mini<span className="logo-highlight">Shop</span>
                        </span>
                    </Link>

                    {/* Home Link immediately beside MiniShop Logo */}
                    <Link
                        to="/"
                        className="navbar-link navbar-home-left"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <img
                            src="/icons/home.svg"
                            alt="Home"
                            className="nav-icon"
                        />
                        <span>Home</span>
                    </Link>
                </div>

                {/* Center: Search Bar */}
                <div className="navbar-search-container">
                    <div className="search-wrapper">
                        <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <input
                            type="text"
                            placeholder="✨ Search (e.g. 'Shoe dhundho', 'shoe & book find karo')..."
                            className="navbar-search"
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                className="search-clear-btn"
                                onClick={clearSearch}
                                aria-label="Clear search"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </div>

                {/* Mobile Toggle Button */}
                <button
                    className="mobile-menu-toggle"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        {mobileMenuOpen ? (
                            <path d="M18 6L6 18M6 6l12 12" />
                        ) : (
                            <path d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>

                {/* Right: Nav Links */}
                <div className={`navbar-links ${mobileMenuOpen ? "active" : ""}`}>
                    {/* Admin Links - Only shown for admin */}
                    {user?.role === "admin" && (
                        <>
                            <Link
                                to="/admin/dashboard"
                                className="navbar-link admin-link"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <svg className="nav-icon-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="3" width="7" height="9" rx="1" />
                                    <rect x="14" y="3" width="7" height="5" rx="1" />
                                    <rect x="14" y="12" width="7" height="9" rx="1" />
                                    <rect x="3" y="16" width="7" height="5" rx="1" />
                                </svg>
                                <span>Dashboard</span>
                            </Link>

                            <Link
                                to="/admin/products"
                                className="navbar-link admin-link"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <svg className="nav-icon-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                                <span>Products</span>
                            </Link>

                            <Link
                                to="/admin/orders"
                                className="navbar-link admin-link"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <svg className="nav-icon-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                <span>Orders</span>
                            </Link>

                            <Link
                                to="/admin/users"
                                className="navbar-link admin-link"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <svg className="nav-icon-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                </svg>
                                <span>Users</span>
                            </Link>

                            <Link
                                to="/admin/payments"
                                className="navbar-link admin-link"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <svg className="nav-icon-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                                    <line x1="1" y1="10" x2="23" y2="10" />
                                </svg>
                                <span>Payments</span>
                            </Link>

                            <Link
                                to="/admin/categories"
                                className="navbar-link admin-link"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <svg className="nav-icon-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="8" y1="6" x2="21" y2="6" />
                                    <line x1="8" y1="12" x2="21" y2="12" />
                                    <line x1="8" y1="18" x2="21" y2="18" />
                                    <line x1="3" y1="6" x2="3.01" y2="6" />
                                    <line x1="3" y1="12" x2="3.01" y2="12" />
                                    <line x1="3" y1="18" x2="3.01" y2="18" />
                                </svg>
                                <span>Categories</span>
                            </Link>
                        </>
                    )}

                    {/* Cart */}
                    <Link
                        to="/cart"
                        className="navbar-link navbar-cart"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <div className="cart-icon-wrapper">
                            <img
                                src="/icons/cart.svg"
                                alt="Cart"
                                className="nav-icon"
                            />
                            {totalCartCount > 0 && (
                                <span className="cart-count">
                                    {totalCartCount}
                                </span>
                            )}
                        </div>
                        <span>Cart</span>
                    </Link>

                    {/* Account / Login */}
                    {!user ? (
                        <Link
                            to="/login"
                            className="navbar-link navbar-login"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <img
                                src="/icons/account.svg"
                                alt="Login"
                                className="nav-icon"
                            />
                            <span>Login</span>
                        </Link>
                    ) : (
                        <div className="account-container">
                            <button
                                className="account-button"
                                onClick={() => setAccountOpen(!accountOpen)}
                                aria-expanded={accountOpen}
                            >
                                <img
                                    src="/icons/account.svg"
                                    alt="Account"
                                    className="nav-icon"
                                />
                                <span>{user.name ? user.name.split(" ")[0] : "Account"}</span>
                                <svg className={`chevron-icon ${accountOpen ? "open" : ""}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M6 9l6 6 6-6" />
                                </svg>
                            </button>

                            {accountOpen && (
                                <div className="account-dropdown">
                                    <div className="dropdown-header">
                                        <div className="dropdown-user-name">{user.name}</div>
                                        <div className="dropdown-user-email">{user.email}</div>
                                    </div>
                                    <div className="dropdown-divider"></div>
                                    <Link
                                        to="/profile"
                                        className="dropdown-item"
                                        onClick={() => {
                                            setAccountOpen(false)
                                            setMobileMenuOpen(false)
                                        }}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                            <circle cx="12" cy="7" r="4" />
                                        </svg>
                                        Profile
                                    </Link>

                                    <button
                                        className="dropdown-item delete-account-dropdown"
                                        onClick={handleDeleteAccount}
                                        disabled={deleting}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                        </svg>
                                        {deleting ? "Deleting..." : "Delete Account"}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Main Categories Navigation Bar */}
            <div className="navbar-categories-bar">
                {[
                    { name: "Clothes", slug: "clothes", icon: "👕" },
                    { name: "Shoes", slug: "shoes", icon: "👟" },
                    { name: "Mobiles", slug: "mobiles", icon: "📱" },
                    { name: "Earphones", slug: "earphones", icon: "🎧" },
                    { name: "Laptops", slug: "laptops", icon: "💻" },
                    { name: "Bags", slug: "bags", icon: "🎒" },
                    { name: "Grocery", slug: "grocery", icon: "🛒" },
                ].map((cat) => (
                    <Link
                        key={cat.slug}
                        to={`/products/${cat.slug}`}
                        className="category-nav-item"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <span>{cat.icon}</span>
                        <span>{cat.name}</span>
                    </Link>
                ))}
            </div>
        </nav>
    )
}

export default Navbar