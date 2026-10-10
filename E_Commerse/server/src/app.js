import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

import userRouter from "./routes/user.route.js"
import productRoute from "./routes/product.route.js"
import cartRoute from "./routes/cart.route.js"
import orderRoute from "./routes/order.route.js"
import paymentRoute from "./routes/payment.route.js"
import offerRoute from "./routes/offer.route.js"
import adminRoute from "./routes/admin.route.js"
import categoryRoute from "./routes/category.route.js"

const app = express()

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.ORIGIN,
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "http://127.0.0.1:5175"
].filter(Boolean)

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true)
    if (
      allowedOrigins.includes(origin) ||
      /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin) ||
      /\.vercel\.app$/.test(origin)
    ) {
      return callback(null, origin)
    }
    return callback(null, origin)
  },
  credentials: true
}))

app.use(cookieParser())
app.use(express.json())

// Production Health Check Endpoints
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "DigitalMart / MiniShop Server is healthy"
  })
})

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "DigitalMart / MiniShop Server is healthy"
  })
})

// Route Mounting (supports both /api/* standard and legacy endpoints)
app.use("/api/user", userRouter)
app.use("/user", userRouter)

app.use("/api/product", productRoute)
app.use("/api/products", productRoute)
app.use("/product", productRoute)
app.use("/products", productRoute)

app.use("/api/cart", cartRoute)
app.use("/cart", cartRoute)

app.use("/api/order", orderRoute)
app.use("/order", orderRoute)

app.use("/api/payment", paymentRoute)
app.use("/payment", paymentRoute)

app.use("/api/offer", offerRoute)
app.use("/offer", offerRoute)

app.use("/api/admin", adminRoute)
app.use("/admin", adminRoute)

app.use("/api/category", categoryRoute)
app.use("/category", categoryRoute)

export default app
