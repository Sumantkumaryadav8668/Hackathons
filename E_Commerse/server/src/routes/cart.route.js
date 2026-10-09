import express from "express"
import authUser from "../middlewares/authUser.middleware.js"
import { addtoCart,getCart,updateCart,removeCart } from "../controller/cart.controller.js"


const cartRoute = express.Router()

cartRoute.use(authUser)

cartRoute.post("/add", addtoCart)
cartRoute.get("/get", getCart)
cartRoute.put("/update/:id", updateCart)
cartRoute.delete("/remove/:id", removeCart)


export default cartRoute