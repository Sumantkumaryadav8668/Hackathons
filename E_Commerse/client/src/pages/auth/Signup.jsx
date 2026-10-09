import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../../api/axios"
import "../../styles/signup.css"

function Signup() {
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: ""
    })

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)

    function handleChange(e) {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value
        })
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setMessage("")

        // Check password match
        if (formData.password !== formData.confirmPassword) {
            setMessage("Password and Confirm Password do not match")
            return
        }

        try {
            setLoading(true)

            // Do not send confirmPassword to backend
            const signupData = {
                name: formData.name.trim(),
                email: formData.email.trim(),
                phone: formData.phone.trim(),
                password: formData.password
            }

            const response = await api.post("/user/signup", signupData)

            setMessage(
                response.data.message ||
                "Account created successfully! Redirecting to login..."
            )

            setFormData({
                name: "",
                email: "",
                phone: "",
                password: "",
                confirmPassword: ""
            })

            setTimeout(() => {
                navigate("/login")
            }, 1200)
        } catch (error) {
            console.log("Signup error:", error)
            setMessage(
                error.response?.data?.message ||
                "Signup failed. Please try again."
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="signup-page">
            <div className="signup-card">
                <div className="signup-header">
                    <div className="auth-brand-logo">
                        <span>Mini</span>
                        <span className="highlight">Shop</span>
                    </div>
                    <h1>Create Account</h1>
                    <p className="signup-subtitle">
                        Join MiniShop today for fast checkout and easy order tracking
                    </p>
                </div>

                {message && (
                    <div className={`signup-message-box ${message.includes("success") || message.includes("Redirecting") ? "success" : "error"}`}>
                        <span>{message}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="signup-form">
                    {/* Name */}
                    <div className="signup-form-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div className="signup-form-group">
                        <label htmlFor="email">Email Address</label>
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

                    {/* Phone */}
                    <div className="signup-form-group">
                        <label htmlFor="phone">Phone Number</label>
                        <input
                            id="phone"
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="9876543210"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div className="signup-form-group">
                        <label htmlFor="password">Password</label>
                        <div className="password-input-container">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Create password"
                                required
                            />
                            <button
                                type="button"
                                className="password-eye-button"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? "👁️" : "🙈"}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="signup-form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <div className="password-input-container">
                            <input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm password"
                                required
                            />
                            <button
                                type="button"
                                className="password-eye-button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                            >
                                {showConfirmPassword ? "👁️" : "🙈"}
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="signup-button"
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="btn-spinner-box">
                                <span className="spinner"></span> Creating Account...
                            </span>
                        ) : (
                            "Create Account"
                        )}
                    </button>
                </form>

                <div className="signup-footer">
                    <p className="signup-login-text">
                        Already have an account?{" "}
                        <button
                            type="button"
                            className="login-redirect-link"
                            onClick={() => navigate("/login")}
                        >
                            Sign In
                        </button>
                    </p>
                </div>
            </div>
        </main>
    )
}

export default Signup