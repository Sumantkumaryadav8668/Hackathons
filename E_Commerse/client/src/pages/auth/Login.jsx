import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../../api/axios"
import { useAuth } from "../../content/authContent"
import "../../styles/login.css"

function Login() {
    const navigate = useNavigate()
    const { loginUser } = useAuth()

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })

    const [showPassword, setShowPassword] = useState(false)
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)
    const [loginSuccess, setLoginSuccess] = useState(false)

    function handleChange(e) {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value
        })
    }

    async function handleSubmit(e) {
        e.preventDefault()

        try {
            setLoading(true)
            setMessage("")

            // Login API call
            const loginRes = await api.post("/user/login", formData)
            if (loginRes.data?.token) {
                localStorage.setItem("token", loginRes.data.token)
            }

            // Get logged-in user profile
            const profileResponse = await api.get("/user/profile")

            const userData = {
                name: profileResponse.data.name,
                email: profileResponse.data.email,
                phone: profileResponse.data.phone,
                role: profileResponse.data.role,
                address: profileResponse.data.address
            }

            // Save user in AuthContext
            loginUser(userData)

            // Trigger success celebration screen
            setLoginSuccess(true)

            // Redirect after 1.5 seconds celebration
            setTimeout(() => {
                if (userData.role === "admin") {
                    navigate("/admin/products")
                } else {
                    navigate("/")
                }
            }, 1500)
        } catch (error) {
            console.log("Login error:", error)

            setMessage(
                error.response?.data?.message ||
                "Login failed. Please check your credentials."
            )
        } finally {
            setLoading(false)
        }
    }

    // Celebration Overlay Screen
    if (loginSuccess) {
        return (
            <main className="login-page">
                <div className="login-success-overlay">
                    <div className="login-success-card">
                        <div className="celebration-icon">🎉</div>
                        <h1>Login Successful!</h1>
                        <p>Welcome back to MiniShop</p>
                        <div className="celebration-confetti">
                            🎊 ✨ 🎉 ✨ 🎊
                        </div>
                    </div>
                </div>
            </main>
        )
    }

    return (
        <main className="login-page">
            <div className="login-card">
                <div className="login-header">
                    <div className="auth-brand-logo">
                        <span>Mini</span>
                        <span className="highlight">Shop</span>
                    </div>
                    <h1>Welcome Back</h1>
                    <p className="login-subtitle">
                        Enter your credentials to access your account
                    </p>
                </div>

                {message && (
                    <div className="login-message-box error">
                        <span>{message}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="login-form">
                    {/* Email Input */}
                    <div className="login-form-group">
                        <label htmlFor="email">Email Address</label>
                        <div className="input-wrapper">
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="name@example.com"
                                required
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div className="login-form-group">
                        <div className="label-flex">
                            <label htmlFor="password">Password</label>
                        </div>
                        <div className="login-password-container">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                required
                            />
                            <button
                                type="button"
                                className="login-password-eye"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? "👁️" : "🙈"}
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="btn-spinner-box">
                                <span className="spinner"></span> Signing in...
                            </span>
                        ) : (
                            "Sign In"
                        )}
                    </button>
                </form>

                <div className="login-footer">
                    <p className="login-signup-text">
                        Don't have an account?{" "}
                        <button
                            type="button"
                            className="signup-redirect-link"
                            onClick={() => navigate("/signup")}
                        >
                            Create Account
                        </button>
                    </p>
                </div>
            </div>
        </main>
    )
}

export default Login