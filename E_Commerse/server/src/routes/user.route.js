import express from "express"
import authUser from "../middlewares/authUser.middleware.js"
import { signup,login,logout,profile,account } from "../controller/user.controller.js"

const userRouter = express.Router()

userRouter.post("/signup", signup)
userRouter.post("/login", login)
userRouter.post("/logout", authUser, logout)
userRouter.get("/profile", authUser, profile)
userRouter.get("/me", authUser, profile)
userRouter.delete("/account", authUser, account)
userRouter.delete("/delete-account", authUser, account)

export default userRouter