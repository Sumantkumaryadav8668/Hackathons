import { createContext, useContext, useEffect, useState } from "react"
import api from "../api/axios"

const AuthContext = createContext()


export function AuthProvider({ children }) {

    const [user, setUser] = useState(() => {

        const savedUser = localStorage.getItem("user")

        if (savedUser) {
            return JSON.parse(savedUser)
        }

        return null
    })


    const [checkingAuth, setCheckingAuth] = useState(true)


    // Check authentication when app starts
    useEffect(() => {
        async function checkAuth() {
            const savedUser = localStorage.getItem("user")
            if (!savedUser) {
                setUser(null)
                setCheckingAuth(false)
                return
            }

            try {
                const response = await api.get("/user/profile")
                const userData = {
                    name: response.data.name,
                    email: response.data.email,
                    phone: response.data.phone,
                    role: response.data.role,
                    address: response.data.address
                }
                setUser(userData)
                localStorage.setItem("user", JSON.stringify(userData))
            } catch (error) {
                if (error.response?.status === 401) {
                    // Normal unauthenticated session
                    setUser(null)
                    localStorage.removeItem("user")
                } else {
                    console.log("Auth check error:", error)
                }
            } finally {
                setCheckingAuth(false)
            }
        }

        checkAuth()
    }, [])


    // Login
    function loginUser(userData) {

        setUser(userData)

        localStorage.setItem(
            "user",
            JSON.stringify(userData)
        )
    }


    // Logout
    function logoutUser() {

        setUser(null)

        localStorage.removeItem("user")
    }


    // Wait until authentication check is complete
    if (checkingAuth) {
        return null
    }


    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                loginUser,
                logoutUser
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}


export function useAuth() {

    return useContext(AuthContext)
}