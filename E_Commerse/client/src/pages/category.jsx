import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import ProductCard from "../components/productCard"
import api from "../api/axios"
import "../styles/category.css"

const categoryConfig = {
    clothes: {
        title: "Clothes",
        icon: "👕",
        subcategories: ["All", "Men", "Women", "Children"]
    },
    shoes: {
        title: "Shoes",
        icon: "👟",
        subcategories: ["All", "Men", "Women", "Children"]
    },
    mobiles: {
        title: "Mobiles",
        icon: "📱",
        subcategories: ["All", "Android Phones", "5G Phones", "Budget Phones", "Premium Phones"]
    },
    earphones: {
        title: "Earphones",
        icon: "🎧",
        subcategories: ["All", "Earbuds", "Earphones", "Neckbands"]
    },
    laptops: {
        title: "Laptops",
        icon: "💻",
        subcategories: ["All", "Student Laptops", "Gaming Laptops", "Business Laptops", "Premium Laptops"]
    },
    bags: {
        title: "Bags",
        icon: "🎒",
        subcategories: ["All", "Men", "Women", "Children", "Laptop Bags", "Travel Bags", "Backpacks"]
    },
    grocery: {
        title: "Grocery",
        icon: "🛒",
        subcategories: [
            "All", "Rice", "Atta & Flour", "Pulses", "Spices", "Cooking Oil",
            "Snacks", "Beverages", "Dry Fruits", "Biscuits", "Breakfast Items", "Household Grocery"
        ]
    }
}

function CategoryPage() {
    const { category: categorySlug } = useParams()
    const config = categoryConfig[categorySlug?.toLowerCase()] || {
        title: categorySlug ? categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1) : "Products",
        icon: "🛍️",
        subcategories: ["All"]
    }

    const [selectedSubCategory, setSelectedSubCategory] = useState("All")
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        setSelectedSubCategory("All")
    }, [categorySlug])

    useEffect(() => {
        async function fetchCategoryProducts() {
            try {
                setLoading(true)
                setError("")

                const params = { category: config.title }
                if (selectedSubCategory && selectedSubCategory !== "All") {
                    params.subCategory = selectedSubCategory
                }

                const res = await api.get("/product", { params })
                const raw = res.data?.products || res.data?.product || (Array.isArray(res.data) ? res.data : [])
                const fetched = Array.isArray(raw) ? raw : []
                setProducts(fetched)
                console.log(`[CategoryPage Debug] Loaded ${fetched.length} products for category "${config.title}" (Subcategory: ${selectedSubCategory})`)
            } catch (err) {
                console.error("Category fetch error:", err)
                setError("Unable to load category products from MongoDB database.")
            } finally {
                setLoading(false)
            }
        }

        fetchCategoryProducts()
    }, [categorySlug, selectedSubCategory, config.title])

    return (
        <main className="category-page">
            <div className="category-container">
                {/* Header Banner */}
                <div className="category-header-banner">
                    <div className="banner-title-group">
                        <span className="category-icon">{config.icon}</span>
                        <h1>{config.title}</h1>
                    </div>
                    <span className="category-product-count">
                        {products.length} Products Available
                    </span>
                </div>

                {/* Subcategory Filter Tabs */}
                {config.subcategories.length > 1 && (
                    <div className="subcategory-filter-wrapper">
                        <span className="filter-label">Filter Subcategory:</span>
                        <div className="subcategory-pills">
                            {config.subcategories.map((sub) => (
                                <button
                                    key={sub}
                                    className={`subcategory-pill ${selectedSubCategory === sub ? "active" : ""}`}
                                    onClick={() => setSelectedSubCategory(sub)}
                                >
                                    {sub}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Product Grid */}
                {loading ? (
                    <div className="category-loading-box">
                        <div className="spinner"></div>
                        <span>Loading {config.title} from MongoDB...</span>
                    </div>
                ) : error ? (
                    <div className="category-error-box">{error}</div>
                ) : products.length === 0 ? (
                    <div className="category-empty-box">
                        <h3>No Products Found</h3>
                        <p>No products found in database for category "{config.title}" {selectedSubCategory !== "All" ? `(${selectedSubCategory})` : ""}.</p>
                    </div>
                ) : (
                    <div className="products-grid">
                        {products.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </main>
    )
}

export default CategoryPage
