import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import api from "../api/axios"
import { useCart } from "../content/cartContent"
import { useAuth } from "../content/authContent"
import PAYMENT_CONFIG from "../config/paymentConfig"
import "../styles/payment.css"

function Payment() {
    const location = useLocation()
    const navigate = useNavigate()
    const { getCart } = useCart()
    const { user } = useAuth()

    const initialOrder = location.state?.order

    // Category: "ONLINE" | "COD"
    const [paymentCategory, setPaymentCategory] = useState(
        initialOrder?.paymentMethod === "cod" ? "COD" : "ONLINE"
    )

    // Online Payment Sub-method: "QR" | "UPI" | "Card"
    const [onlineMethod, setOnlineMethod] = useState("QR")

    const [utrNumber, setUtrNumber] = useState("")
    const [loading, setLoading] = useState(false)
    const [verifyingStatus, setVerifyingStatus] = useState(false)
    const [message, setMessage] = useState("")

    // Verification & COD confirmation states
    const [isVerified, setIsVerified] = useState(
        initialOrder?.paymentStatus === "success"
    )
    const [isCodConfirmed, setIsCodConfirmed] = useState(
        initialOrder?.paymentMethod === "cod" && initialOrder?.orderStatus === "confirmed"
    )
    const [deliveryOtp, setDeliveryOtp] = useState(null)
    const [currentOrder, setCurrentOrder] = useState(initialOrder)

    // Config state for Payment QR
    const [paymentConfig, setPaymentConfig] = useState({
        upiId: PAYMENT_CONFIG.upiId,
        payeeName: PAYMENT_CONFIG.payeeName,
        paymentName: PAYMENT_CONFIG.merchantName,
        paymentQrImage: PAYMENT_CONFIG.phonePeQrImage
    })

    useEffect(() => {
        async function fetchConfig() {
            try {
                const res = await api.get("/payment/config")
                if (res.data) {
                    setPaymentConfig({
                        upiId: res.data.upiId || PAYMENT_CONFIG.upiId,
                        payeeName: res.data.payeeName || PAYMENT_CONFIG.payeeName,
                        paymentName: res.data.paymentName || PAYMENT_CONFIG.merchantName,
                        paymentQrImage: res.data.paymentQrImage || PAYMENT_CONFIG.phonePeQrImage
                    })
                }
            } catch (err) {
                console.log("Using default payment config:", err)
            }
        }
        fetchConfig()
    }, [])

    if (!currentOrder) {
        return (
            <main className="payment-page">
                <div className="payment-empty-card">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <h1>No Active Order Found</h1>
                    <p>Please select items from your cart and place an order first.</p>
                    <button className="go-home-btn" onClick={() => navigate("/cart")}>
                        Return to Cart
                    </button>
                </div>
            </main>
        )
    }

    /**
     * Submit online payment verification to backend
     * CRITICAL SECURITY RULE:
     * Clicking "I Have Paid" NEVER directly marks the order as paid or successful.
     * All verification logic runs on the backend.
     */
    async function handleVerifyPayment(e) {
        if (e) e.preventDefault()
        setMessage("")

        try {
            setLoading(true)

            const response = await api.post("/payment/verify", {
                orderId: currentOrder._id,
                paymentMethod: onlineMethod,
                utrNumber: utrNumber.trim()
            })

            const data = response.data

            if (data.verified && data.payment?.paymentStatus === "success") {
                setIsVerified(true)
                if (data.order) setCurrentOrder(data.order)
                setMessage("✓ Payment Verified & Order Confirmed!")
                if (data.deliveryOtp) {
                    setDeliveryOtp(data.deliveryOtp)
                }

                // Refresh cart state (cart is emptied ONLY on backend verification)
                await getCart()
            } else {
                setIsVerified(false)
                setMessage(
                    data.message ||
                    "Payment status: PENDING verification. If you have paid via PhonePe, please ensure your 12-digit UTR / Reference number is entered correctly."
                )
            }

        } catch (error) {
            console.error("Payment verification error:", error)
            setIsVerified(false)
            setMessage(
                error.response?.data?.message ||
                "Payment verification failed. Please verify your UTR / transaction reference number."
            )
        } finally {
            setLoading(false)
        }
    }

    /**
     * Confirm Cash on Delivery (COD) Order
     */
    async function handleConfirmCOD(e) {
        if (e) e.preventDefault()
        setMessage("")

        try {
            setLoading(true)

            const response = await api.post("/order/confirm-cod", {
                orderId: currentOrder._id
            })

            const data = response.data

            if (data.success && data.order) {
                setIsCodConfirmed(true)
                setCurrentOrder(data.order)
                setMessage("✓ Cash on Delivery Order Placed Successfully!")
                if (data.deliveryOtp) {
                    setDeliveryOtp(data.deliveryOtp)
                }

                // Empty cart after successful COD order confirmation
                await getCart()
            } else {
                setMessage(data.message || "Failed to confirm Cash on Delivery order.")
            }

        } catch (error) {
            console.error("COD confirmation error:", error)
            setMessage(
                error.response?.data?.message ||
                "Failed to place Cash on Delivery order. Please try again."
            )
        } finally {
            setLoading(false)
        }
    }

    /**
     * Check payment status explicitly from backend
     */
    async function handleCheckStatus() {
        try {
            setVerifyingStatus(true)
            const res = await api.get(`/payment/status/${currentOrder._id}`)
            if (res.data.verified && res.data.paymentStatus === "success") {
                setIsVerified(true)
                if (res.data.order) setCurrentOrder(res.data.order)
                setMessage("✓ Payment confirmed by store admin/system!")
                await getCart()
            } else {
                setIsVerified(false)
                setMessage(`Current Payment Status: ${res.data.paymentStatus.toUpperCase()}. Awaiting backend verification.`)
            }
        } catch (err) {
            console.error("Check status error:", err)
            setMessage("Failed to fetch payment status from server.")
        } finally {
            setVerifyingStatus(false)
        }
    }

    return (
        <main className="payment-page">
            <div className="payment-container">
                <div className="payment-header">
                    <h1>Checkout & Payment</h1>
                    <p className="payment-subtitle">
                        Select your preferred payment method for MiniShop Order #{currentOrder._id.slice(-8)}
                    </p>
                </div>

                <div className="payment-layout">
                    {/* Left Column: Payment Method Category Selector & Options */}
                    <div className="payment-methods-section">
                        <h2>Select Payment Method</h2>

                        {/* Top-Level Payment Method Cards */}
                        <div className="payment-category-grid">
                            {/* Card 1: Online Payment */}
                            <div
                                className={`payment-category-card ${paymentCategory === "ONLINE" ? "selected" : ""}`}
                                onClick={() => {
                                    if (!isCodConfirmed && !isVerified) setPaymentCategory("ONLINE")
                                }}
                            >
                                <div className="option-radio">
                                    <input
                                        type="radio"
                                        id="pay-online"
                                        name="paymentCategory"
                                        value="ONLINE"
                                        checked={paymentCategory === "ONLINE"}
                                        onChange={() => setPaymentCategory("ONLINE")}
                                        disabled={isCodConfirmed || isVerified}
                                    />
                                </div>
                                <div className="category-icon">💳</div>
                                <div className="category-info">
                                    <span className="category-title">Online Payment</span>
                                    <span className="category-desc">Pay securely using PhonePe QR, UPI, or Credit/Debit Card</span>
                                </div>
                            </div>

                            {/* Card 2: Cash on Delivery */}
                            <div
                                className={`payment-category-card ${paymentCategory === "COD" ? "selected" : ""}`}
                                onClick={() => {
                                    if (!isCodConfirmed && !isVerified) setPaymentCategory("COD")
                                }}
                            >
                                <div className="option-radio">
                                    <input
                                        type="radio"
                                        id="pay-cod"
                                        name="paymentCategory"
                                        value="COD"
                                        checked={paymentCategory === "COD"}
                                        onChange={() => setPaymentCategory("COD")}
                                        disabled={isCodConfirmed || isVerified}
                                    />
                                </div>
                                <div className="category-icon">💵</div>
                                <div className="category-info">
                                    <span className="category-title">Cash on Delivery</span>
                                    <span className="category-desc">Pay when your order is delivered to your address</span>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Box based on Selected Category */}
                        <div className="payment-details-box">
                            {/* ==================== ONLINE PAYMENT SECTION ==================== */}
                            {paymentCategory === "ONLINE" && (
                                <div>
                                    <div className="sub-methods-tabs">
                                        <button
                                            type="button"
                                            className={`tab-btn ${onlineMethod === "QR" ? "active" : ""}`}
                                            onClick={() => setOnlineMethod("QR")}
                                        >
                                            PhonePe QR
                                        </button>
                                        <button
                                            type="button"
                                            className={`tab-btn ${onlineMethod === "UPI" ? "active" : ""}`}
                                            onClick={() => setOnlineMethod("UPI")}
                                        >
                                            UPI ID
                                        </button>
                                        <button
                                            type="button"
                                            className={`tab-btn ${onlineMethod === "Card" ? "active" : ""}`}
                                            onClick={() => setOnlineMethod("Card")}
                                        >
                                            Card
                                        </button>
                                    </div>

                                    {(onlineMethod === "QR" || onlineMethod === "UPI") && (
                                        <div className="upi-section">
                                            <div className="phonepe-badge-header">
                                                <span className="phonepe-logo">पे</span>
                                                <div>
                                                    <div className="phonepe-name">PhonePe</div>
                                                    <div className="phonepe-sub">ACCEPTED HERE</div>
                                                </div>
                                            </div>

                                            <h3 className="upi-title">
                                                Scan & Pay Using PhonePe App
                                            </h3>
                                            <p className="upi-subtitle">
                                                Scan with PhonePe, GPay, Paytm, or any UPI app to pay ₹{Number(currentOrder.totalAmount || 0).toLocaleString("en-IN")}
                                            </p>

                                            {/* PhonePe QR Code Container */}
                                            <div className="phonepe-qr-card-wrapper">
                                                <img
                                                    src={paymentConfig.paymentQrImage}
                                                    alt="PhonePe QR Code"
                                                    className="phonepe-qr-image"
                                                    onError={(e) => {
                                                        e.target.src = PAYMENT_CONFIG.phonePeQrImage
                                                    }}
                                                />
                                                <div className="payee-name-tag">
                                                    {paymentConfig.payeeName}
                                                </div>
                                            </div>

                                            <div className="upi-merchant-info">
                                                <span className="merchant-name">
                                                    Payee: <strong>{paymentConfig.payeeName}</strong>
                                                </span>
                                                <span className="upi-id-badge">
                                                    UPI ID: <strong>{paymentConfig.upiId}</strong>
                                                </span>
                                            </div>

                                            <div className="upi-amount-box">
                                                <span className="amount-label">Total Amount:</span>
                                                <strong className="amount-value">
                                                    ₹{Number(currentOrder.totalAmount || 0).toLocaleString("en-IN")}
                                                </strong>
                                            </div>

                                            {/* UTR Input */}
                                            <div className="utr-input-box">
                                                <label htmlFor="utr-input">
                                                    Enter 12-Digit PhonePe UTR / Reference Number:
                                                </label>
                                                <input
                                                    id="utr-input"
                                                    type="text"
                                                    placeholder="e.g. 428190342156"
                                                    value={utrNumber}
                                                    onChange={(e) => setUtrNumber(e.target.value)}
                                                    disabled={isVerified}
                                                />
                                                <small>
                                                    Find this 12-digit Ref No. in your PhonePe transaction details after paying.
                                                </small>
                                            </div>

                                            <button
                                                type="button"
                                                className="upi-complete-btn"
                                                onClick={handleVerifyPayment}
                                                disabled={loading || isVerified}
                                            >
                                                {loading ? "Verifying Payment on Backend..." : isVerified ? "✓ Payment Verified" : "I Have Paid / Payment Completed"}
                                            </button>
                                        </div>
                                    )}

                                    {onlineMethod === "Card" && (
                                        <div className="card-simulation-box">
                                            <div className="simulated-card">
                                                <div className="card-chip"></div>
                                                <div className="card-number-demo">•••• •••• •••• 4242</div>
                                                <div className="card-holder-demo">SECURE CARD TRANSACTION</div>
                                            </div>
                                            <p className="card-note">
                                                Click button below to authorize payment of ₹{Number(currentOrder.totalAmount || 0).toLocaleString("en-IN")}.
                                            </p>
                                            <button
                                                type="button"
                                                className="upi-complete-btn"
                                                onClick={handleVerifyPayment}
                                                disabled={loading || isVerified}
                                            >
                                                {loading ? "Processing..." : isVerified ? "✓ Card Payment Verified" : "Submit Payment & Verify"}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* ==================== CASH ON DELIVERY SECTION ==================== */}
                            {paymentCategory === "COD" && (
                                <div className="cod-section">
                                    <div className="cod-badge-header">
                                        <span className="cod-icon">💵</span>
                                        <div>
                                            <div className="cod-badge-title">Cash on Delivery</div>
                                            <div className="cod-badge-sub">PAY ON DELIVERY</div>
                                        </div>
                                    </div>

                                    <h3 className="cod-title">
                                        Pay in Cash Upon Delivery
                                    </h3>
                                    <p className="cod-subtitle">
                                        You can pay ₹<strong>{Number(currentOrder.totalAmount || 0).toLocaleString("en-IN")}</strong> in cash directly to our delivery agent when your order arrives.
                                    </p>

                                    <div className="cod-steps-box">
                                        <div className="step-item">
                                            <span className="step-num">1</span>
                                            <span>Place COD Order now</span>
                                        </div>
                                        <div className="step-item">
                                            <span className="step-num">2</span>
                                            <span>Get your 6-digit Delivery OTP</span>
                                        </div>
                                        <div className="step-item">
                                            <span className="step-num">3</span>
                                            <span>Pay cash & provide OTP to delivery agent</span>
                                        </div>
                                    </div>

                                    {!isCodConfirmed ? (
                                        <button
                                            type="button"
                                            className="cod-place-btn"
                                            onClick={handleConfirmCOD}
                                            disabled={loading}
                                        >
                                            {loading ? "Placing COD Order..." : "Place Order (Cash on Delivery)"}
                                        </button>
                                    ) : (
                                        <div className="cod-success-notice">
                                            ✓ Cash on Delivery Order is Confirmed!
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Order Summary & Confirmation Screen */}
                    <div className="payment-summary-sidebar">
                        <div className="summary-box">
                            <h2>Order Summary</h2>

                            <div className="summary-info-row">
                                <span className="label">Order ID</span>
                                <span className="value order-id">#{currentOrder._id}</span>
                            </div>

                            <div className="summary-info-row">
                                <span className="label">Payment Method</span>
                                <span className="value payment-method-badge">
                                    {paymentCategory === "COD" ? "Cash on Delivery" : "Online Payment"}
                                </span>
                            </div>

                            {currentOrder.items && currentOrder.items.length > 0 && (
                                <div className="ordered-items-list">
                                    <div className="items-heading">Items ({currentOrder.items.length})</div>
                                    {currentOrder.items.map((item, i) => (
                                        <div className="ordered-item-row" key={i}>
                                            <span className="item-name-qty">{item.product?.name || item.name || "Item"} x{item.quantity || 1}</span>
                                            <span className="item-price">₹{Number((item.price || 0) * (item.quantity || 1)).toLocaleString("en-IN")}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {currentOrder.shippingAddress && (
                                <div className="shipping-address-summary">
                                    <div className="items-heading">Shipping To</div>
                                    <p className="address-text">
                                        {currentOrder.shippingAddress.street}, {currentOrder.shippingAddress.city}, {currentOrder.shippingAddress.state} - {currentOrder.shippingAddress.pincode}
                                    </p>
                                </div>
                            )}

                            <div className="summary-divider"></div>

                            <div className="summary-info-row total-row">
                                <span className="label">Total Amount</span>
                                <strong className="value total-amount">
                                    ₹{Number(currentOrder.totalAmount || 0).toLocaleString("en-IN")}
                                </strong>
                            </div>

                            {/* Status Alert Banner */}
                            {message && (
                                <div className={`payment-alert-msg ${isVerified || isCodConfirmed ? "success" : "error"}`}>
                                    {message}
                                </div>
                            )}

                            {/* ORDER CONFIRMED SCREEN (Rendered upon verified Online Payment or Confirmed COD) */}
                            {isVerified || isCodConfirmed ? (
                                <div className="order-confirmed-card">
                                    <div className="conf-icon">🎉</div>
                                    <h3>Order Confirmed!</h3>
                                    <p>
                                        {isCodConfirmed
                                            ? "Your Cash on Delivery order has been successfully placed."
                                            : "Your online payment was verified by the server and your order is confirmed."}
                                    </p>

                                    {deliveryOtp && (
                                        <div className="delivery-otp-box">
                                            <span className="otp-title">
                                                🔐 Customer Delivery Verification OTP:
                                            </span>
                                            <strong className="otp-code">
                                                {deliveryOtp}
                                            </strong>
                                            <small>
                                                Share this OTP with the agent upon delivery.
                                            </small>
                                        </div>
                                    )}

                                    <button
                                        className="view-orders-btn"
                                        onClick={() => navigate("/profile")}
                                    >
                                        View Orders in Profile →
                                    </button>
                                </div>
                            ) : (
                                <div className="actions-box">
                                    {paymentCategory === "ONLINE" && (
                                        <>
                                            <button
                                                type="button"
                                                className="confirm-payment-btn"
                                                onClick={handleVerifyPayment}
                                                disabled={loading}
                                            >
                                                {loading ? "Verifying..." : "Submit Payment & Verify"}
                                            </button>

                                            <button
                                                type="button"
                                                className="check-status-btn"
                                                onClick={handleCheckStatus}
                                                disabled={verifyingStatus}
                                            >
                                                {verifyingStatus ? "Checking..." : "🔄 Check Verification Status"}
                                            </button>
                                        </>
                                    )}

                                    {paymentCategory === "COD" && (
                                        <button
                                            type="button"
                                            className="confirm-payment-btn cod-theme"
                                            onClick={handleConfirmCOD}
                                            disabled={loading}
                                        >
                                            {loading ? "Placing Order..." : "Confirm COD Order"}
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Payment