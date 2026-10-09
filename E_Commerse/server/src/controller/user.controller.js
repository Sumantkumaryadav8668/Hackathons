import User from "../models/userSchema.model.js"
import Cart from "../models/cartSchema.model.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import {
    signupValidator,
    loginValidator
} from "../validators/user.validator.js"

const createToken = (_id, email) => {
    const secret = process.env.JWT_SECRET || process.env.JWT_SIGNATURE || "default_secret"
    const token = jwt.sign(
        { _id, email },
        secret,
        { expiresIn: "7d" }
    )
    return token
}

const makecookie = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000
}

export const signup = async (req, res) => {
    try {
        const valiedUser = signupValidator.safeParse(req.body)

        if (!valiedUser.success) {
            return res.status(400).json({
                message: valiedUser.error.issues[0].message
            })
        }

        const { name, email, password, phone } = valiedUser.data

        const userexist = await User.findOne({ email })
        if (userexist) {
            return res.status(409).json({
                message: "User already exists with this email address"
            })
        }

        const passhash = await bcrypt.hash(password, 10)

        const user = await User.create({
            name,
            email,
            password: passhash,
            phone
        })

        const token = createToken(user._id, email)

        res.cookie("Token", token, makecookie)

        res.status(201).json({
            message: "User created successfully",
            token,
            name: user.name,
            email: user.email,
            role: user.role
        })

    } catch (err) {
        console.error("SIGNUP ERROR:", err)
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

export const login = async (req, res) => {
    try {
        const valiedUser = loginValidator.safeParse(req.body)

        if (!valiedUser.success) {
            return res.status(400).json({
                message: valiedUser.error.issues[0].message
            })
        }

        const { email, password } = valiedUser.data

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            })
        }

        if (user.isActive === false) {
            return res.status(403).json({
                message: "Your account has been deactivated by the administrator."
            })
        }

        const tokenvarify = await bcrypt.compare(password, user.password)
        if (!tokenvarify) {
            return res.status(401).json({
                message: "Invalid email or password"
            })
        }

        const token = createToken(user._id, email)

        res.cookie("Token", token, makecookie)

        res.status(200).json({
            message: "User logged in successfully",
            token,
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone
            }
        })

    } catch (err) {
        console.error("LOGIN ERROR:", err)
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie("Token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax"
        })

        res.status(200).json({
            message: "User logged out successfully"
        })

    } catch (err) {
        console.error("LOGOUT ERROR:", err)
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

export const profile = async (req, res) => {
    try {
        res.status(200).json({
            _id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            phone: req.user.phone,
            role: req.user.role,
            address: req.user.address,
            isActive: req.user.isActive
        })

    } catch (err) {
        console.error("PROFILE ERROR:", err)
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

export const account = async (req, res) => {
    try {
        const userId = req.user._id

        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        // Delete user's active cart
        await Cart.findOneAndDelete({ user: userId })

        // Delete user profile
        await User.findByIdAndDelete(userId)

        res.clearCookie("Token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax"
        })

        res.status(200).json({
            message: "Account deleted successfully"
        })

    } catch (err) {
        console.error("DELETE ACCOUNT ERROR:", err)
        res.status(500).json({
            message: "Internal server error"
        })
    }
}