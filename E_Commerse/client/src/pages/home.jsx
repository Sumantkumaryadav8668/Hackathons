import { useEffect, useState, useMemo } from "react"
import { useSearchParams } from "react-router-dom"
import ProductCard from "../components/productCard"
import api from "../api/axios"
import "../styles/home.css"

function Home() {
    const [products, setProducts] = useState([])
    const [offers, setOffers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [clothesSubTab, setClothesSubTab] = useState("ALL")

    const [searchParams] = useSearchParams()
    const searchQuery = searchParams.get("search") || ""

    async function fetchData() {
        try {
            setLoading(true)
            setError("")

            // Fetch products from MongoDB database via API
            const prodRes = await api.get("/product")
            const rawProducts = prodRes.data?.products || prodRes.data?.product || (Array.isArray(prodRes.data) ? prodRes.data : [])
            const fetched = Array.isArray(rawProducts) ? rawProducts : []

            setProducts(fetched)
            console.log(`[Home API Debug] Fetched ${fetched.length} products from MongoDB database. Status:`, prodRes.status)

            // Fetch active offers
            try {
                const offerRes = await api.get("/offer")
                const fetchedOffers = offerRes.data?.offers || (Array.isArray(offerRes.data) ? offerRes.data : [])
                setOffers(Array.isArray(fetchedOffers) ? fetchedOffers : [])
            } catch (err) {
                console.log("No offers endpoint or failed to fetch offers:", err)
            }
        } catch (err) {
            console.error("GET PRODUCTS ERROR:", err)
            setError(
                err.response?.data?.message ||
                "Failed to load products from database. Please check your network connection or server status."
            )
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    // AI Search state
    const [aiSearchResults, setAiSearchResults] = useState([])
    const [aiIntentSummary, setAiIntentSummary] = useState("")
    const [isAIPowered, setIsAIPowered] = useState(false)
    const [searchLoading, setSearchLoading] = useState(false)
    const [extractedKeywords, setExtractedKeywords] = useState([])

    useEffect(() => {
        if (!searchQuery.trim()) {
            setAiSearchResults([])
            setAiIntentSummary("")
            setIsAIPowered(false)
            setExtractedKeywords([])
            return
        }

        async function executeAISearch() {
            try {
                setSearchLoading(true)
                const res = await api.get(`/product/search?q=${encodeURIComponent(searchQuery)}`)
                const results = res.data?.products || res.data?.product || (Array.isArray(res.data) ? res.data : [])
                setAiSearchResults(Array.isArray(results) ? results : [])
                setAiIntentSummary(res.data.intentSummary || "")
                setIsAIPowered(res.data.isAIPowered || false)
                setExtractedKeywords(res.data.extractedKeywords || [])
            } catch (err) {
                console.error("AI Search frontend error:", err)
            } finally {
                setSearchLoading(false)
            }
        }

        executeAISearch()
    }, [searchQuery])

    // Helper function for case-insensitive matching
    const norm = (str) => (str ? str.toString().toLowerCase().trim() : "")

    // Electronics & Tech Products Matching (Electronics, Mobiles, Laptops, Earphones)
    const electronicsProducts = useMemo(() => {
        const keywords = ["electronics", "electronic", "laptop", "laptops", "mobile", "mobiles", "earphone", "earphones", "earbuds", "headphones", "smartwatch", "phone", "phones", "audio", "tech", "gadget", "tv", "camera"]
        return products.filter((p) => {
            const cat = norm(p.category)
            const name = norm(p.name)
            const desc = norm(p.description)
            return keywords.some((kw) => cat.includes(kw) || name.includes(kw) || desc.includes(kw))
        })
    }, [products])

    // Shoes & Footwear Section Matching
    const shoesProducts = useMemo(() => {
        const keywords = ["shoes", "shoe", "footwear", "sneaker", "sneakers", "boot", "boots", "sandal", "sandals"]
        return products.filter((p) => {
            const cat = norm(p.category)
            const name = norm(p.name)
            const desc = norm(p.description)
            return keywords.some((kw) => cat.includes(kw) || name.includes(kw) || desc.includes(kw))
        })
    }, [products])

    // Clothes & Fashion Section Matching
    const clothesProducts = useMemo(() => {
        const keywords = ["clothes", "clothing", "apparel", "wear", "shirt", "t-shirt", "tshirt", "jeans", "pant", "pants", "jacket", "dress", "fashion", "hoodie", "top", "kurti", "suit"]
        return products.filter((p) => {
            const cat = norm(p.category)
            const name = norm(p.name)
            const desc = norm(p.description)
            return keywords.some((kw) => cat.includes(kw) || name.includes(kw) || desc.includes(kw))
        })
    }, [products])

    // Bags Section Matching
    const bagsProducts = useMemo(() => {
        const keywords = ["bags", "bag", "backpack", "backpacks", "luggage", "tote", "duffel"]
        return products.filter((p) => {
            const cat = norm(p.category)
            const name = norm(p.name)
            const desc = norm(p.description)
            return keywords.some((kw) => cat.includes(kw) || name.includes(kw) || desc.includes(kw))
        })
    }, [products])

    // Grocery Section Matching
    const groceryProducts = useMemo(() => {
        const keywords = ["grocery", "groceries", "food", "rice", "atta", "pulse", "spices", "oil", "snacks", "tea", "coffee", "biscuit", "beverage"]
        return products.filter((p) => {
            const cat = norm(p.category)
            const name = norm(p.name)
            const desc = norm(p.description)
            return keywords.some((kw) => cat.includes(kw) || name.includes(kw) || desc.includes(kw))
        })
    }, [products])

    // Sub-filtered Clothes (Men, Women, Children)
    const filteredClothes = useMemo(() => {
        if (clothesSubTab === "MEN") {
            return clothesProducts.filter((p) => {
                const text = `${norm(p.category)} ${norm(p.subCategory)} ${norm(p.name)} ${norm(p.description)}`
                return (text.includes("men") || text.includes("male") || text.includes("man") || text.includes("boy")) && !text.includes("women")
            })
        }
        if (clothesSubTab === "WOMEN") {
            return clothesProducts.filter((p) => {
                const text = `${norm(p.category)} ${norm(p.subCategory)} ${norm(p.name)} ${norm(p.description)}`
                return text.includes("women") || text.includes("female") || text.includes("woman") || text.includes("lady") || text.includes("ladies") || text.includes("girl")
            })
        }
        if (clothesSubTab === "CHILDREN") {
            return clothesProducts.filter((p) => {
                const text = `${norm(p.category)} ${norm(p.subCategory)} ${norm(p.name)} ${norm(p.description)}`
                return text.includes("child") || text.includes("children") || text.includes("kid") || text.includes("kids") || text.includes("baby") || text.includes("toddler")
            })
        }
        return clothesProducts
    }, [clothesProducts, clothesSubTab])

    const scrollToSection = (id) => {
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ behavior: "smooth" })
    }

    return (
        <main className="home-page">
            {/* Hero Section */}
            <section className="home-hero">
                <div className="hero-content">
                    <span className="hero-badge">✨ Official Store Collection 2026</span>
                    <h1 className="hero-title">
                        Welcome to <span className="title-brand">DigitalMart</span>
                    </h1>
                    <p className="hero-subtitle">
                        Explore genuine products fetched directly from our official MongoDB database catalog with fast shipping & secure payments.
                    </p>
                    <div className="hero-cta-group">
                        <button className="cta-primary-btn" onClick={() => scrollToSection("all-products-section")}>
                            Browse Catalog ({products.length} Items) 🛍️
                        </button>
                        <button className="cta-secondary-btn" onClick={() => scrollToSection("electronics-section")}>
                            Explore Tech ⚡
                        </button>
                    </div>
                </div>
                <div className="hero-features">
                    <div className="feature-pill">
                        <span className="pill-icon">🚚</span> Free Shipping
                    </div>
                    <div className="feature-pill">
                        <span className="pill-icon">🔒</span> Secure Payments
                    </div>
                    <div className="feature-pill">
                        <span className="pill-icon">🛡️</span> Verified Quality
                    </div>
                </div>
            </section>

            <div className="home-container">
                {/* Error Banner */}
                {error && (
                    <div style={{
                        background: "#fef2f2",
                        border: "1px solid #fecaca",
                        color: "#991b1b",
                        padding: "16px 20px",
                        borderRadius: "12px",
                        margin: "20px 0",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}>
                        <div>
                            <strong>Error Loading Products: </strong>
                            <span>{error}</span>
                        </div>
                        <button
                            onClick={fetchData}
                            style={{
                                background: "#dc2626",
                                color: "#ffffff",
                                border: "none",
                                padding: "8px 16px",
                                borderRadius: "6px",
                                fontWeight: "700",
                                cursor: "pointer"
                            }}
                        >
                            Retry Loading
                        </button>
                    </div>
                )}

                {/* Special Offers Section */}
                {offers.length > 0 && (
                    <section className="special-offers-section" id="offers-section">
                        <div className="section-header">
                            <div className="header-title-box">
                                <span className="section-badge fire">🔥 Special Deals</span>
                                <h2>Limited Time Offers</h2>
                            </div>
                        </div>

                        <div className="offers-grid">
                            {offers.map((offer) => (
                                <div className="offer-card" key={offer._id}>
                                    {offer.bannerImage && (
                                        <div className="offer-banner-img-wrapper">
                                            <img src={offer.bannerImage} alt={offer.title} className="offer-banner-img" />
                                        </div>
                                    )}
                                    <div className="offer-content">
                                        {offer.discountPercentage > 0 && (
                                            <span className="discount-tag">UP TO {offer.discountPercentage}% OFF</span>
                                        )}
                                        <h3 className="offer-title">{offer.title}</h3>
                                        {offer.description && <p className="offer-desc">{offer.description}</p>}
                                        {offer.code && (
                                            <div className="offer-code-box">
                                                <span>Use Coupon:</span>
                                                <code className="coupon-code">{offer.code}</code>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Search Results Mode */}
                {searchQuery ? (
                    <section className="products-section">
                        <div className="products-header" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                                <h2>Search Results for "{searchQuery}"</h2>
                                <span className="products-count-text">Found {aiSearchResults.length} items</span>
                            </div>

                            {aiIntentSummary && (
                                <div className="ai-intent-badge" style={{
                                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.15))',
                                    border: '1px solid rgba(168, 85, 247, 0.3)',
                                    padding: '8px 16px',
                                    borderRadius: '20px',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    fontSize: '0.9rem',
                                    color: '#c084fc',
                                    marginTop: '4px'
                                }}>
                                    <span>{isAIPowered ? '✨ AI Intent Recognized:' : '🔍 Filter Intent:'}</span>
                                    <strong>{aiIntentSummary}</strong>
                                    {extractedKeywords.length > 0 && (
                                        <span style={{ opacity: 0.8, fontSize: '0.82rem' }}>
                                            (Extracted: {extractedKeywords.join(', ')})
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>

                        {searchLoading ? (
                            <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                                🧠 Querying MongoDB database for "{searchQuery}"...
                            </div>
                        ) : aiSearchResults.length === 0 ? (
                            <div className="no-products-box">
                                <h3>No products found</h3>
                                <p>No database items matched your search query "{searchQuery}".</p>
                            </div>
                        ) : (
                            <div className="products-grid">
                                {aiSearchResults.map((product) => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                            </div>
                        )}
                    </section>
                ) : (
                    <>
                        {/* Global Loading Spinner */}
                        {loading ? (
                            <div className="loading-spinner-box" style={{ padding: "80px 20px", textAlign: "center" }}>
                                <div className="main-spinner"></div>
                                <p style={{ marginTop: "16px", fontSize: "1.1rem", fontWeight: "600", color: "#64748b" }}>
                                    Fetching live catalog from MongoDB database...
                                </p>
                            </div>
                        ) : products.length === 0 ? (
                            <div className="no-products-box" style={{ padding: "60px 20px", textAlign: "center" }}>
                                <h3>No Products Available in Database</h3>
                                <p>The MongoDB database collection is currently empty.</p>
                            </div>
                        ) : (
                            <>
                                {/* Section 1: ALL CATALOG PRODUCTS (MAIN DEFAULT VIEW) */}
                                <section className="category-section" id="all-products-section">
                                    <div className="section-header">
                                        <div className="header-title-box">
                                            <span className="section-icon">🛍️</span>
                                            <h2>ALL PRODUCTS FROM MONGODB</h2>
                                        </div>
                                        <span className="section-count">{products.length} products total</span>
                                    </div>

                                    <div className="products-grid">
                                        {products.map((product) => (
                                            <ProductCard key={product._id} product={product} />
                                        ))}
                                    </div>
                                </section>

                                {/* Section 2: ELECTRONICS & TECH */}
                                {electronicsProducts.length > 0 && (
                                    <section className="category-section" id="electronics-section">
                                        <div className="section-header">
                                            <div className="header-title-box">
                                                <span className="section-icon">💻</span>
                                                <h2>ELECTRONICS & TECH</h2>
                                            </div>
                                            <span className="section-count">{electronicsProducts.length} items</span>
                                        </div>

                                        <div className="products-grid">
                                            {electronicsProducts.map((product) => (
                                                <ProductCard key={product._id} product={product} />
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {/* Section 3: CLOTHES & FASHION */}
                                {clothesProducts.length > 0 && (
                                    <section className="category-section" id="clothes-section">
                                        <div className="section-header">
                                            <div className="header-title-box">
                                                <span className="section-icon">👔</span>
                                                <h2>CLOTHES & FASHION</h2>
                                            </div>
                                            <div className="clothes-sub-tabs">
                                                <button
                                                    className={`sub-tab-btn ${clothesSubTab === "ALL" ? "active" : ""}`}
                                                    onClick={() => setClothesSubTab("ALL")}
                                                >
                                                    ALL ({clothesProducts.length})
                                                </button>
                                                <button
                                                    className={`sub-tab-btn ${clothesSubTab === "MEN" ? "active" : ""}`}
                                                    onClick={() => setClothesSubTab("MEN")}
                                                >
                                                    MEN
                                                </button>
                                                <button
                                                    className={`sub-tab-btn ${clothesSubTab === "WOMEN" ? "active" : ""}`}
                                                    onClick={() => setClothesSubTab("WOMEN")}
                                                >
                                                    WOMEN
                                                </button>
                                                <button
                                                    className={`sub-tab-btn ${clothesSubTab === "CHILDREN" ? "active" : ""}`}
                                                    onClick={() => setClothesSubTab("CHILDREN")}
                                                >
                                                    CHILDREN
                                                </button>
                                            </div>
                                        </div>

                                        <div className="products-grid">
                                            {filteredClothes.map((product) => (
                                                <ProductCard key={product._id} product={product} />
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {/* Section 4: SHOES & FOOTWEAR */}
                                {shoesProducts.length > 0 && (
                                    <section className="category-section" id="shoes-section">
                                        <div className="section-header">
                                            <div className="header-title-box">
                                                <span className="section-icon">👟</span>
                                                <h2>SHOES & FOOTWEAR</h2>
                                            </div>
                                            <span className="section-count">{shoesProducts.length} items</span>
                                        </div>

                                        <div className="products-grid">
                                            {shoesProducts.map((product) => (
                                                <ProductCard key={product._id} product={product} />
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {/* Section 5: BAGS & BACKPACKS */}
                                {bagsProducts.length > 0 && (
                                    <section className="category-section" id="bags-section">
                                        <div className="section-header">
                                            <div className="header-title-box">
                                                <span className="section-icon">🎒</span>
                                                <h2>BAGS & LUGGAGE</h2>
                                            </div>
                                            <span className="section-count">{bagsProducts.length} items</span>
                                        </div>

                                        <div className="products-grid">
                                            {bagsProducts.map((product) => (
                                                <ProductCard key={product._id} product={product} />
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {/* Section 6: GROCERY & ESSENTIALS */}
                                {groceryProducts.length > 0 && (
                                    <section className="category-section" id="grocery-section">
                                        <div className="section-header">
                                            <div className="header-title-box">
                                                <span className="section-icon">🛒</span>
                                                <h2>GROCERY & ESSENTIALS</h2>
                                            </div>
                                            <span className="section-count">{groceryProducts.length} items</span>
                                        </div>

                                        <div className="products-grid">
                                            {groceryProducts.map((product) => (
                                                <ProductCard key={product._id} product={product} />
                                            ))}
                                        </div>
                                    </section>
                                )}
                            </>
                        )}
                    </>
                )}
            </div>
        </main>
    )
}

export default Home