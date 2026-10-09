import { Navigate } from "react-router-dom"
import { useAuth } from "../content/authContent"

function ProtectedAdminRoute({ children }) {

    const { user } = useAuth()

    // User is not logged in
    if (!user) {
        return <Navigate to="/login" replace />
    }

    // User is logged in but not admin
    if (user.role !== "admin") {
        return <Navigate to="/" replace />
    }

    // User is admin
    return children
}

export default ProtectedAdminRoute