import dotenv from "dotenv/config"
import app from "./src/app.js"
import Database from "./src/config/database.config.js"

const PORT = process.env.PORT || process.env.TOKEN || 3000

const startServer = async () => {
    try {
        await Database()
        app.listen(PORT, () => {
            console.log(`🚀 DigitalMart Express Server listening at http://localhost:${PORT}`)
        })
    } catch (err) {
        console.error("❌ SERVER STARTUP ERROR:", err.message)
        process.exit(1)
    }
}

startServer()