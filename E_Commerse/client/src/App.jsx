import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom"

import Navbar from "./components/Navbar"

import Home from "./pages/home"
import CategoryPage from "./pages/category"
import ProductDetail from "./pages/productDetail"
import Cart from "./pages/cart"
import Profile from "./pages/profile"

import Login from "./pages/auth/Login"
import Signup from "./pages/auth/Signup"

import Payment from "./pages/payment"

import AdminProducts from "./pages/admin/adminProduct"
import AdminDashboard from "./pages/admin/adminDashbord"
import AdminOrders from "./pages/admin/adminOrders"
import AdminUsers from "./pages/admin/adminUsers"
import AdminPayments from "./pages/admin/adminPayments"
import AdminCategories from "./pages/admin/adminCategories"
import ProtectedAdminRoute from "./components/protectAdminRoute"

import { AuthProvider } from "./content/authContent"
import { CartProvider } from "./content/cartContent"

function App() {

    return (
        <AuthProvider>

            <CartProvider>

                <BrowserRouter>

                    <Navbar />

                    <Routes>

                        {/* Home - Everyone can see products */}
                        <Route
                            path="/"
                            element={<Home />}
                        />

                        {/* Category Product Listing Page */}
                        <Route
                            path="/products/:category"
                            element={<CategoryPage />}
                        />

                        {/* Product Detail Page (4-Image Gallery) */}
                        <Route
                            path="/product/:id"
                            element={<ProductDetail />}
                        />


                        {/* Authentication */}
                        <Route
                            path="/login"
                            element={<Login />}
                        />

                        <Route
                            path="/signup"
                            element={<Signup />}
                        />


                        {/* User Pages */}
                        <Route
                            path="/profile"
                            element={<Profile />}
                        />

                        <Route
                            path="/cart"
                            element={<Cart />}
                        />

                        <Route
                            path="/payment"
                            element={<Payment />}
                        />


                        {/* Admin Routes */}
                        <Route
                            path="/admin"
                            element={
                                <ProtectedAdminRoute>
                                    <AdminDashboard />
                                </ProtectedAdminRoute>
                            }
                        />

                        <Route
                            path="/admin/dashboard"
                            element={
                                <ProtectedAdminRoute>
                                    <AdminDashboard />
                                </ProtectedAdminRoute>
                            }
                        />

                        <Route
                            path="/admin/products"
                            element={
                                <ProtectedAdminRoute>
                                    <AdminProducts />
                                </ProtectedAdminRoute>
                            }
                        />

                        <Route
                            path="/admin/orders"
                            element={
                                <ProtectedAdminRoute>
                                    <AdminOrders />
                                </ProtectedAdminRoute>
                            }
                        />

                        <Route
                            path="/admin/users"
                            element={
                                <ProtectedAdminRoute>
                                    <AdminUsers />
                                </ProtectedAdminRoute>
                            }
                        />

                        <Route
                            path="/admin/payments"
                            element={
                                <ProtectedAdminRoute>
                                    <AdminPayments />
                                </ProtectedAdminRoute>
                            }
                        />

                        <Route
                            path="/admin/categories"
                            element={
                                <ProtectedAdminRoute>
                                    <AdminCategories />
                                </ProtectedAdminRoute>
                            }
                        />


                        {/* Unknown URL */}
                        <Route
                            path="*"
                            element={
                                <Navigate
                                    to="/"
                                    replace
                                />
                            }
                        />

                    </Routes>

                </BrowserRouter>

            </CartProvider>

        </AuthProvider>
    )
}

export default App