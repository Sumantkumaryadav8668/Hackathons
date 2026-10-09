import jwt from "jsonwebtoken"
import User from "../models/userSchema.model.js"

const authUser = async (req, res, next) => {
    try {
        let token = req.cookies?.Token || req.cookies?.token

        if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1]
        }

        if (!token) {
            return res.status(401).json({
                message: "Authentication required. Please log in."
            })
        }

        let verifyToken
        try {
            verifyToken = jwt.verify(token, process.env.JWT_SECRET || process.env.JWT_SIGNATURE || "default_secret")
        } catch (jwtErr) {
            return res.status(401).json({
                message: "Invalid or expired session. Please log in again."
            })
        }

        const user = await User.findById(verifyToken._id)
        if (!user) {
            return res.status(401).json({
                message: "User account no longer exists."
            })
        }

        if (user.isActive === false) {
            return res.status(403).json({
                message: "Your account has been deactivated. Please contact support."
            })
        }

        req.user = user
        next()
    } catch (err) {
        console.error("AUTH USER MIDDLEWARE ERROR:", err)
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

export default authUser