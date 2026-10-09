import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Product from "../src/models/productSchema.model.js";
import Category from "../src/models/categorySchema.model.js";
import User from "../src/models/userSchema.model.js";
import bcrypt from "bcrypt";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

const MONGO_URL = process.env.MONGO_URL;

// Reference categories list
const REFERENCE_CATEGORIES = [
    { name: "Clothes", slug: "clothes", icon: "👕", description: "Men's, Women's, and Kids' apparel and fashion" },
    { name: "Shoes", slug: "shoes", icon: "👟", description: "Sports, casual, formal, and outdoor footwear" },
    { name: "Mobiles", slug: "mobiles", icon: "📱", description: "5G smartphones, Android, and budget mobiles" },
    { name: "Earphones", slug: "earphones", icon: "🎧", description: "Wireless earbuds, neckbands, and headphones" },
    { name: "Laptops", slug: "laptops", icon: "💻", description: "Gaming, student, business, and ultrabook laptops" },
    { name: "Bags", slug: "bags", icon: "🎒", description: "Backpacks, handbags, travel duffels, and laptop bags" },
    { name: "Grocery", slug: "grocery", icon: "🛒", description: "Daily essentials, staples, beverages, and snacks" }
];

// Definition of EXACTLY 100 Products matching user specification
const catalog100 = [
    // ==========================================
    // CLOTHES (20 Products: 1 - 20)
    // ==========================================
    { id: 1, name: "Men's Regular Fit Cotton T-Shirt", brand: "Puma", category: "Clothes", subCategory: "Men", price: 799, discountPrice: 499, description: "Classic round neck 100% combed cotton t-shirt with breathable fabric, ideal for everyday casual wear.", tags: ["clothes", "clothing", "men", "casual", "cotton", "tshirt", "fashion"], rating: 4.5, stock: 85, totalSales: 142 },
    { id: 2, name: "Women's Oversized Hoodie", brand: "H&M", category: "Clothes", subCategory: "Women", price: 1999, discountPrice: 1499, description: "Cozy fleece-lined oversized hoodie with kangaroo pocket and rib-knit cuffs for winter warmth.", tags: ["clothes", "women", "hoodie", "winter", "oversized", "fashion"], rating: 4.7, stock: 50, totalSales: 98 },
    { id: 3, name: "Men's Slim Fit Casual Shirt", brand: "Levi's", category: "Clothes", subCategory: "Men", price: 1699, discountPrice: 1299, description: "Stylish button-down casual denim shirt crafted with premium cotton blend fabric.", tags: ["clothes", "men", "shirt", "slimfit", "casual", "denim"], rating: 4.4, stock: 64, totalSales: 115 },
    { id: 4, name: "Women's Floral Summer Dress", brand: "Zara", category: "Clothes", subCategory: "Women", price: 2499, discountPrice: 1799, description: "Vibrant floral print maxi dress featuring lightweight viscose fabric and flowy silhouette.", tags: ["clothes", "women", "dress", "summer", "floral", "fashion"], rating: 4.6, stock: 40, totalSales: 87 },
    { id: 5, name: "Men's Denim Jacket", brand: "Roadster", category: "Clothes", subCategory: "Men", price: 2999, discountPrice: 2199, description: "Rugged blue washed cotton denim jacket with twin chest flap pockets and adjustable button waist.", tags: ["clothes", "men", "jacket", "denim", "outerwear"], rating: 4.5, stock: 35, totalSales: 63 },
    { id: 6, name: "Women's Straight Fit Jeans", brand: "Levi's", category: "Clothes", subCategory: "Women", price: 2299, discountPrice: 1699, description: "High-waist classic straight-leg denim jeans with stretch fabric for flexible everyday comfort.", tags: ["clothes", "women", "jeans", "denim", "straightfit"], rating: 4.6, stock: 58, totalSales: 130 },
    { id: 7, name: "Kids Cotton Printed T-Shirt", brand: "FirstCry", category: "Clothes", subCategory: "Children", price: 499, discountPrice: 349, description: "Soft bio-washed 100% cotton crewneck t-shirt with playful cartoon character print.", tags: ["clothes", "kids", "children", "tshirt", "cotton"], rating: 4.3, stock: 90, totalSales: 175 },
    { id: 8, name: "Men's Polo T-Shirt", brand: "US Polo Assn", category: "Clothes", subCategory: "Men", price: 1299, discountPrice: 899, description: "Pique knit cotton polo shirt with signature embroidered chest logo and ribbed collar.", tags: ["clothes", "men", "polo", "tshirt", "smartcasual"], rating: 4.5, stock: 72, totalSales: 110 },
    { id: 9, name: "Women's Casual Top", brand: "ONLY", category: "Clothes", subCategory: "Women", price: 999, discountPrice: 699, description: "Chic puff sleeve casual blouse with breathable rayon fabric and sweetheart neckline.", tags: ["clothes", "women", "top", "casual", "blouse"], rating: 4.4, stock: 60, totalSales: 92 },
    { id: 10, name: "Men's Cargo Pants", brand: "Woodland", category: "Clothes", subCategory: "Men", price: 2199, discountPrice: 1599, description: "Heavy-duty multi-pocket tactical cargo trousers made from durable cotton twill.", tags: ["clothes", "men", "cargopants", "trousers", "outdoor"], rating: 4.5, stock: 45, totalSales: 78 },
    { id: 11, name: "Women's Cotton Kurti", brand: "Biba", category: "Clothes", subCategory: "Women", price: 1499, discountPrice: 999, description: "Traditional straight-fit ethnic cotton kurti featuring delicate embroidery work.", tags: ["clothes", "women", "kurti", "ethnic", "cotton"], rating: 4.7, stock: 65, totalSales: 160 },
    { id: 12, name: "Men's Formal Shirt", brand: "Peter England", category: "Clothes", subCategory: "Men", price: 1599, discountPrice: 1199, description: "Crisp wrinkle-resistant formal cotton dress shirt designed for executive professional wear.", tags: ["clothes", "men", "formal", "shirt", "office"], rating: 4.4, stock: 55, totalSales: 104 },
    { id: 13, name: "Kids Hoodie", brand: "Allen Solly Kids", category: "Clothes", subCategory: "Children", price: 1199, discountPrice: 799, description: "Warm fleece kids zipper hooded jacket with elastic waistband and cozy side pockets.", tags: ["clothes", "kids", "hoodie", "children", "jacket"], rating: 4.6, stock: 48, totalSales: 82 },
    { id: 14, name: "Women's Denim Jacket", brand: "MANGO", category: "Clothes", subCategory: "Women", price: 2799, discountPrice: 1999, description: "Cropped fit stylish light-wash women's denim jacket with metal button fasteners.", tags: ["clothes", "women", "jacket", "denim", "fashion"], rating: 4.6, stock: 38, totalSales: 67 },
    { id: 15, name: "Men's Track Pants", brand: "Adidas", category: "Clothes", subCategory: "Men", price: 1499, discountPrice: 999, description: "Moisture-wicking athletic joggers featuring elastic drawstring waistband and zip pockets.", tags: ["clothes", "men", "trackpants", "joggers", "sports"], rating: 4.4, stock: 80, totalSales: 145 },
    { id: 16, name: "Women's Palazzo Pants", brand: "Aurelia", category: "Clothes", subCategory: "Women", price: 899, discountPrice: 599, description: "Wide-leg fluid rayon palazzo pants with elasticized waistband for ethnic pairing.", tags: ["clothes", "women", "palazzo", "ethnic", "bottomwear"], rating: 4.3, stock: 70, totalSales: 112 },
    { id: 17, name: "Men's Sweatshirt", brand: "Superdry", category: "Clothes", subCategory: "Men", price: 2199, discountPrice: 1499, description: "Crewneck fleece pullover sweatshirt featuring ribbed hem and soft cotton interior.", tags: ["clothes", "men", "sweatshirt", "winter", "pullover"], rating: 4.6, stock: 42, totalSales: 89 },
    { id: 18, name: "Women's Party Dress", brand: "Forever New", category: "Clothes", subCategory: "Women", price: 3499, discountPrice: 2499, description: "Elegant satin cocktail dress featuring sweetheart neck and side split hemline.", tags: ["clothes", "women", "partydress", "eveningwear", "satin"], rating: 4.8, stock: 30, totalSales: 54 },
    { id: 19, name: "Kids Casual Shirt", brand: "Mothercare", category: "Clothes", subCategory: "Children", price: 799, discountPrice: 499, description: "Pure cotton buttoned checked casual shirt designed for comfort during play.", tags: ["clothes", "kids", "shirt", "children", "cotton"], rating: 4.4, stock: 75, totalSales: 101 },
    { id: 20, name: "Men's Casual Jeans", brand: "Wrangler", category: "Clothes", subCategory: "Men", price: 2499, discountPrice: 1799, description: "Durable mid-rise slim fit dark blue wash denim jeans with classic 5-pocket styling.", tags: ["clothes", "men", "jeans", "casual", "denim"], rating: 4.5, stock: 62, totalSales: 138 },

    // ==========================================
    // SHOES (15 Products: 21 - 35)
    // ==========================================
    { id: 21, name: "Men's Running Shoes", brand: "Nike", category: "Shoes", subCategory: "Men", price: 4999, discountPrice: 3499, description: "Lightweight performance running shoes with breathable mesh upper and cushioned foam midsole.", tags: ["shoes", "running", "sports", "men", "footwear", "nike"], rating: 4.7, stock: 50, totalSales: 190 },
    { id: 22, name: "Women's Walking Shoes", brand: "Skechers", category: "Shoes", subCategory: "Women", price: 3499, discountPrice: 2499, description: "Air-cooled memory foam cushioned walking sneakers designed for all-day comfort.", tags: ["shoes", "walking", "women", "sneakers", "skechers"], rating: 4.6, stock: 55, totalSales: 140 },
    { id: 23, name: "Men's Casual Sneakers", brand: "Puma", category: "Shoes", subCategory: "Men", price: 3999, discountPrice: 2799, description: "Low-top classic streetwear leather sneakers with padded collar and grip rubber outsole.", tags: ["shoes", "sneakers", "men", "casual", "puma"], rating: 4.5, stock: 65, totalSales: 165 },
    { id: 24, name: "Women's Sports Sneakers", brand: "Adidas", category: "Shoes", subCategory: "Women", price: 4299, discountPrice: 2999, description: "Flexible knit athletic shoes featuring responsive boost cushioning for gym training.", tags: ["shoes", "sports", "women", "sneakers", "adidas"], rating: 4.7, stock: 45, totalSales: 118 },
    { id: 25, name: "Men's Formal Shoes", brand: "Bata", category: "Shoes", subCategory: "Men", price: 2999, discountPrice: 1999, description: "Handcrafted genuine leather Oxford dress shoes with sleek cap-toe design.", tags: ["shoes", "formal", "men", "leather", "bata"], rating: 4.4, stock: 40, totalSales: 95 },
    { id: 26, name: "Women's Flat Sandals", brand: "Metro", category: "Shoes", subCategory: "Women", price: 1299, discountPrice: 899, description: "Open-toe casual slip-on sandals with cushioned footbed and gold metallic accents.", tags: ["shoes", "sandals", "women", "flats", "footwear"], rating: 4.3, stock: 70, totalSales: 152 },
    { id: 27, name: "Men's Loafers", brand: "Red Tape", category: "Shoes", subCategory: "Men", price: 2499, discountPrice: 1699, description: "Slip-on casual suede loafers featuring comfortable TPR sole and horsebit detail.", tags: ["shoes", "loafers", "men", "casual", "suede"], rating: 4.5, stock: 48, totalSales: 108 },
    { id: 28, name: "Women's Running Shoes", brand: "Reebok", category: "Shoes", subCategory: "Women", price: 3899, discountPrice: 2799, description: "Ultralight marathon running shoes engineered with high-traction carbon rubber outsole.", tags: ["shoes", "running", "women", "sports", "reebok"], rating: 4.6, stock: 36, totalSales: 84 },
    { id: 29, name: "Kids Sports Shoes", brand: "Crocs", category: "Shoes", subCategory: "Children", price: 1799, discountPrice: 1199, description: "Durable velcro-closure athletic shoes featuring non-marking rubber sole.", tags: ["shoes", "kids", "sports", "children", "footwear"], rating: 4.4, stock: 62, totalSales: 135 },
    { id: 30, name: "Men's Basketball Shoes", brand: "Under Armour", category: "Shoes", subCategory: "Men", price: 5999, discountPrice: 4499, description: "High-top basketball sneakers with lateral stability court grip and shock absorption.", tags: ["shoes", "basketball", "men", "high-top", "sports"], rating: 4.8, stock: 25, totalSales: 60 },
    { id: 31, name: "Women's Casual Shoes", brand: "Puma", category: "Shoes", subCategory: "Women", price: 2799, discountPrice: 1899, description: "Versatile canvas lace-up shoes built for comfortable everyday city walking.", tags: ["shoes", "casual", "women", "sneakers", "canvas"], rating: 4.5, stock: 50, totalSales: 110 },
    { id: 32, name: "Men's Trekking Shoes", brand: "Woodland", category: "Shoes", subCategory: "Men", price: 4999, discountPrice: 3899, description: "Waterproof leather outdoor hiking boots with deep lugs for mountain trails.", tags: ["shoes", "trekking", "men", "outdoor", "boots"], rating: 4.7, stock: 30, totalSales: 72 },
    { id: 33, name: "Women's Slip-On Shoes", brand: "Catwalk", category: "Shoes", subCategory: "Women", price: 1599, discountPrice: 1099, description: "Breathable knit slip-on sneakers with elastic collar and supportive memory foam insole.", tags: ["shoes", "slipon", "women", "sneakers", "comfortable"], rating: 4.4, stock: 65, totalSales: 128 },
    { id: 34, name: "Kids School Shoes", brand: "Liberty", category: "Shoes", subCategory: "Children", price: 999, discountPrice: 699, description: "Sturdy black synthetic leather uniform school shoes with buckle strap closure.", tags: ["shoes", "kids", "school", "children", "blackshoes"], rating: 4.3, stock: 85, totalSales: 210 },
    { id: 35, name: "Men's Canvas Sneakers", brand: "Converse", category: "Shoes", subCategory: "Men", price: 2999, discountPrice: 2199, description: "High-top iconic canvas sneakers with vulcanized rubber sole and metal eyelets.", tags: ["shoes", "canvas", "men", "converse", "sneakers"], rating: 4.6, stock: 52, totalSales: 155 },

    // ==========================================
    // MOBILES (15 Products: 36 - 50)
    // ==========================================
    { id: 36, name: "Samsung Galaxy A Series", brand: "Samsung", category: "Mobiles", subCategory: "5G Phones", price: 21999, discountPrice: 17999, description: "5G smartphone with 6.6-inch FHD+ 120Hz Super AMOLED display, 50MP OIS triple camera, and 5000mAh battery.", tags: ["smartphone", "android", "5g", "mobile", "electronics", "samsung"], rating: 4.5, stock: 40, totalSales: 160 },
    { id: 37, name: "OnePlus Nord Series", brand: "OnePlus", category: "Mobiles", subCategory: "5G Phones", price: 29999, discountPrice: 24999, description: "5G smartphone powered by Snapdragon processor, 80W SUPERVOOC fast charging, and Fluid AMOLED display.", tags: ["smartphone", "android", "5g", "oneplus", "electronics"], rating: 4.6, stock: 35, totalSales: 175 },
    { id: 38, name: "Xiaomi Redmi Note Series", brand: "Xiaomi", category: "Mobiles", subCategory: "Android Phones", price: 16999, discountPrice: 13999, description: "Feature-packed smartphone with 108MP main camera, AMOLED display, and dual stereo speakers.", tags: ["smartphone", "android", "xiaomi", "redmi", "electronics"], rating: 4.4, stock: 60, totalSales: 210 },
    { id: 39, name: "Realme Number Series", brand: "Realme", category: "Mobiles", subCategory: "5G Phones", price: 18999, discountPrice: 14999, description: "Curved Vision Display smartphone with Sony IMX camera sensor and 67W flash charging.", tags: ["smartphone", "android", "5g", "realme", "electronics"], rating: 4.5, stock: 50, totalSales: 130 },
    { id: 40, name: "Motorola G Series", brand: "Motorola", category: "Mobiles", subCategory: "Budget Phones", price: 14999, discountPrice: 11999, description: "Clean Stock Android OS experience with 50MP quad pixel camera system and Dolby Atmos stereo speakers.", tags: ["smartphone", "android", "motorola", "stockandroid", "electronics"], rating: 4.4, stock: 45, totalSales: 95 },
    { id: 41, name: "Vivo Y Series", brand: "Vivo", category: "Mobiles", subCategory: "Android Phones", price: 17999, discountPrice: 14499, description: "Sleek glass design phone featuring 64MP night camera and extended RAM expansion technology.", tags: ["smartphone", "android", "vivo", "camera", "electronics"], rating: 4.3, stock: 55, totalSales: 120 },
    { id: 42, name: "Oppo A Series", brand: "Oppo", category: "Mobiles", subCategory: "Android Phones", price: 16999, discountPrice: 13499, description: "Oppo Glow design 5G phone with AI portrait camera and 5000mAh long-lasting battery.", tags: ["smartphone", "android", "oppo", "electronics"], rating: 4.4, stock: 40, totalSales: 105 },
    { id: 43, name: "iQOO Z Series", brand: "iQOO", category: "Mobiles", subCategory: "5G Phones", price: 23999, discountPrice: 19999, description: "Gaming-focused 5G smartphone with MediaTek Dimensity processor and motion control cooling system.", tags: ["smartphone", "gaming", "5g", "iqoo", "electronics"], rating: 4.6, stock: 35, totalSales: 140 },
    { id: 44, name: "Nothing Phone Series", brand: "Nothing", category: "Mobiles", subCategory: "Premium Phones", price: 39999, discountPrice: 32999, description: "Innovative Glyph Interface transparent back smartphone with dual 50MP Sony cameras and Nothing OS.", tags: ["smartphone", "5g", "nothing", "premium", "glyph", "electronics"], rating: 4.7, stock: 25, totalSales: 98 },
    { id: 45, name: "Poco X Series", brand: "Poco", category: "Mobiles", subCategory: "5G Phones", price: 21999, discountPrice: 17999, description: "Performance beast smartphone with 120Hz AMOLED panel, Snapdragon 5G chip, and turbo charging.", tags: ["smartphone", "android", "5g", "poco", "electronics"], rating: 4.5, stock: 45, totalSales: 165 },
    { id: 46, name: "Samsung Galaxy M Series", brand: "Samsung", category: "Mobiles", subCategory: "Budget Phones", price: 14999, discountPrice: 11999, description: "Monster 6000mAh battery smartphone with sAMOLED display and Knox security vault.", tags: ["smartphone", "android", "samsung", "battery", "electronics"], rating: 4.4, stock: 65, totalSales: 220 },
    { id: 47, name: "OnePlus Number Series", brand: "OnePlus", category: "Mobiles", subCategory: "Premium Phones", price: 54999, discountPrice: 47999, description: "Flagship smartphone featuring Hasselblad camera calibration, 100W fast charging, and 2K 120Hz display.", tags: ["smartphone", "flagship", "5g", "oneplus", "hasselblad", "electronics"], rating: 4.8, stock: 20, totalSales: 85 },
    { id: 48, name: "Realme Narzo Series", brand: "Realme", category: "Mobiles", subCategory: "Budget Phones", price: 12999, discountPrice: 9999, description: "Budget gaming phone equipped with Helio processor, 90Hz refresh display, and 33W fast charger.", tags: ["smartphone", "android", "budget", "realme", "electronics"], rating: 4.3, stock: 75, totalSales: 195 },
    { id: 49, name: "Redmi A Series", brand: "Xiaomi", category: "Mobiles", subCategory: "Budget Phones", price: 8999, discountPrice: 6999, description: "Entry-level reliable Android Go smartphone with large HD+ display and 5000mAh battery.", tags: ["smartphone", "budget", "androidgo", "redmi", "electronics"], rating: 4.2, stock: 90, totalSales: 240 },
    { id: 50, name: "Motorola Edge Series", brand: "Motorola", category: "Mobiles", subCategory: "Premium Phones", price: 34999, discountPrice: 28999, description: "Ultra-slim 144Hz curved pOLED display smartphone with 50MP camera and IP68 underwater protection.", tags: ["smartphone", "5g", "motorola", "curveddisplay", "electronics"], rating: 4.7, stock: 30, totalSales: 76 },

    // ==========================================
    // EARPHONES (10 Products: 51 - 60)
    // ==========================================
    { id: 51, name: "Wireless Bluetooth Earbuds", brand: "boAt", category: "Earphones", subCategory: "Earbuds", price: 2999, discountPrice: 1499, description: "True wireless earbuds with ENx technology, 13mm dynamic drivers, and 42-hour total playback.", tags: ["earphones", "earbuds", "tws", "bluetooth", "wireless", "electronics"], rating: 4.5, stock: 80, totalSales: 290 },
    { id: 52, name: "Noise Cancelling Earbuds", brand: "Sony", category: "Earphones", subCategory: "Earbuds", price: 9999, discountPrice: 6999, description: "Industry-leading Active Noise Cancellation (ANC) wireless earbuds with LDAC high-res audio codec.", tags: ["earphones", "anc", "sony", "earbuds", "noise-cancelling", "electronics"], rating: 4.8, stock: 30, totalSales: 110 },
    { id: 53, name: "TWS Gaming Earbuds", brand: "Noise", category: "Earphones", subCategory: "Earbuds", price: 2499, discountPrice: 1399, description: "Low-latency 40ms ultra gaming mode TWS earbuds with cool RGB breathing lights.", tags: ["earphones", "gaming", "tws", "lowlatency", "noise", "electronics"], rating: 4.4, stock: 65, totalSales: 180 },
    { id: 54, name: "Wireless Neckband", brand: "Realme", category: "Earphones", subCategory: "Neckbands", price: 1999, discountPrice: 1199, description: "Flexible magnetic neckband Bluetooth earphones with 11.2mm bass boost driver and quick charge.", tags: ["earphones", "neckband", "wireless", "realme", "bluetooth", "electronics"], rating: 4.5, stock: 85, totalSales: 240 },
    { id: 55, name: "Bluetooth Headphones", brand: "JBL", category: "Earphones", subCategory: "Earphones", price: 4499, discountPrice: 2999, description: "On-ear wireless Bluetooth headphones delivering famous JBL Pure Bass sound with 40h battery.", tags: ["earphones", "headphones", "bluetooth", "jbl", "purebass", "electronics"], rating: 4.6, stock: 50, totalSales: 160 },
    { id: 56, name: "Over-Ear Wireless Headphones", brand: "Sony", category: "Earphones", subCategory: "Earphones", price: 11999, discountPrice: 7999, description: "Premium over-ear wireless noise cancelling headphones with touch controls and multipoint connection.", tags: ["earphones", "overear", "headphones", "sony", "anc", "electronics"], rating: 4.8, stock: 25, totalSales: 95 },
    { id: 57, name: "Sports Bluetooth Earphones", brand: "boAt", category: "Earphones", subCategory: "Neckbands", price: 2499, discountPrice: 1299, description: "IPX7 sweat & water resistant sports neckband with secure fit ear-hooks for intense workouts.", tags: ["earphones", "sports", "waterproof", "boat", "workout", "electronics"], rating: 4.4, stock: 70, totalSales: 175 },
    { id: 58, name: "Type-C Wired Earphones", brand: "Sennheiser", category: "Earphones", subCategory: "Earphones", price: 999, discountPrice: 599, description: "High-fidelity wired in-ear earphones with digital Type-C connector and inline HD microphone.", tags: ["earphones", "typec", "wired", "sennheiser", "electronics"], rating: 4.3, stock: 95, totalSales: 210 },
    { id: 59, name: "Premium TWS Earbuds", brand: "Bose", category: "Earphones", subCategory: "Earbuds", price: 6999, discountPrice: 4999, description: "Acoustic noise cancelling true wireless earbuds with CustomTune audio calibration.", tags: ["earphones", "bose", "tws", "premium", "anc", "electronics"], rating: 4.8, stock: 20, totalSales: 70 },
    { id: 60, name: "Bass Boost Wireless Earphones", brand: "OnePlus", category: "Earphones", subCategory: "Neckbands", price: 2199, discountPrice: 1499, description: "12.4mm extra bass dynamic drivers neckband providing 30 hours non-stop audio playback.", tags: ["earphones", "oneplus", "bassboost", "neckband", "electronics"], rating: 4.6, stock: 60, totalSales: 195 },

    // ==========================================
    // LAPTOPS (10 Products: 61 - 70)
    // ==========================================
    { id: 61, name: "Lenovo IdeaPad", brand: "Lenovo", category: "Laptops", subCategory: "Student Laptops", price: 49999, discountPrice: 38999, description: "Thin & light laptop with 15.6-inch FHD anti-glare screen, Core i5 processor, 16GB RAM, and 512GB SSD.", tags: ["laptops", "student", "lenovo", "thinandlight", "electronics"], rating: 4.5, stock: 35, totalSales: 140 },
    { id: 62, name: "HP Pavilion", brand: "HP", category: "Laptops", subCategory: "Student Laptops", price: 64999, discountPrice: 52999, description: "Versatile 14-inch touchscreen convertible 2-in-1 laptop powered by Intel Core i5 with B&O audio.", tags: ["laptops", "hp", "pavilion", "2in1", "touchscreen", "electronics"], rating: 4.6, stock: 30, totalSales: 115 },
    { id: 63, name: "Dell Inspiron", brand: "Dell", category: "Laptops", subCategory: "Student Laptops", price: 54999, discountPrice: 44999, description: "Reliable 15.6-inch laptop with AMD Ryzen 5 6-core processor, 120Hz display refresh, and lift-hinge design.", tags: ["laptops", "dell", "inspiron", "ryzen", "electronics"], rating: 4.5, stock: 40, totalSales: 130 },
    { id: 64, name: "ASUS VivoBook", brand: "ASUS", category: "Laptops", subCategory: "Student Laptops", price: 44999, discountPrice: 35999, description: "Vibrant 15.6-inch OLED laptop featuring NanoEdge bezel, ErgoSense keyboard, and fast charging.", tags: ["laptops", "asus", "vivobook", "oled", "electronics"], rating: 4.6, stock: 45, totalSales: 155 },
    { id: 65, name: "Acer Aspire", brand: "Acer", category: "Laptops", subCategory: "Student Laptops", price: 38999, discountPrice: 29999, description: "Budget-friendly everyday laptop with Core i3 processor, full numeric keypad, and Wi-Fi 6 connectivity.", tags: ["laptops", "acer", "aspire", "budget", "electronics"], rating: 4.3, stock: 50, totalSales: 180 },
    { id: 66, name: "HP 15 Series", brand: "HP", category: "Laptops", subCategory: "Student Laptops", price: 42999, discountPrice: 33999, description: "Lightweight 15.6-inch laptop with micro-edge anti-glare display, long battery life, and fast storage.", tags: ["laptops", "hp", "student", "everyday", "electronics"], rating: 4.4, stock: 55, totalSales: 160 },
    { id: 67, name: "Lenovo V Series", brand: "Lenovo", category: "Laptops", subCategory: "Business Laptops", price: 37999, discountPrice: 28999, description: "Business essential laptop with spill-resistant keyboard, TPM 2.0 security chip, and durable chassis.", tags: ["laptops", "lenovo", "business", "security", "electronics"], rating: 4.4, stock: 40, totalSales: 105 },
    { id: 68, name: "ASUS TUF Gaming", brand: "ASUS", category: "Laptops", subCategory: "Gaming Laptops", price: 84999, discountPrice: 69999, description: "Heavy-duty gaming laptop with NVIDIA GeForce RTX 3050 graphics, 144Hz display, and dual fans.", tags: ["laptops", "gaming", "asus", "rtx", "electronics"], rating: 4.7, stock: 25, totalSales: 90 },
    { id: 69, name: "Acer Nitro Gaming Laptop", brand: "Acer", category: "Laptops", subCategory: "Gaming Laptops", price: 79999, discountPrice: 64999, description: "High performance gaming rig with Intel Core i7, 4-zone RGB backlit keyboard, and NitroSense cooling.", tags: ["laptops", "gaming", "acer", "nitro", "electronics"], rating: 4.6, stock: 20, totalSales: 80 },
    { id: 70, name: "Dell Vostro", brand: "Dell", category: "Laptops", subCategory: "Business Laptops", price: 52999, discountPrice: 42999, description: "Durable business laptop featuring 3-side narrow border FHD display, hardware TPM, and ExpressCharge.", tags: ["laptops", "dell", "vostro", "business", "electronics"], rating: 4.5, stock: 35, totalSales: 110 },

    // ==========================================
    // BAGS (15 Products: 71 - 85)
    // ==========================================
    { id: 71, name: "Laptop Backpack", brand: "Wildcraft", category: "Bags", subCategory: "Laptop Bags", price: 2499, discountPrice: 1599, description: "Ergonomic 30-liter water-resistant laptop backpack with padded 15.6-inch device compartment.", tags: ["bags", "laptop", "backpack", "wildcraft", "travel"], rating: 4.6, stock: 65, totalSales: 210 },
    { id: 72, name: "College Backpack", brand: "Skybags", category: "Bags", subCategory: "Backpacks", price: 1899, discountPrice: 1199, description: "Trendy multi-compartment printed daypack with built-in rain cover and bottle holders.", tags: ["bags", "college", "backpack", "skybags", "fashion"], rating: 4.5, stock: 75, totalSales: 185 },
    { id: 73, name: "Travel Backpack", brand: "American Tourister", category: "Bags", subCategory: "Travel Bags", price: 3999, discountPrice: 2699, description: "Large 45L expandable trekking travel rucksack with chest harness strap and shoe pocket.", tags: ["bags", "travel", "rucksack", "americantourister", "outdoor"], rating: 4.7, stock: 40, totalSales: 130 },
    { id: 74, name: "Women's Handbag", brand: "Lavie", category: "Bags", subCategory: "Women", price: 3499, discountPrice: 2199, description: "Stylish faux-leather tote handbag with dual shoulder straps and matching zip pouch.", tags: ["bags", "women", "handbag", "lavie", "tote", "fashion"], rating: 4.6, stock: 50, totalSales: 160 },
    { id: 75, name: "Men's Office Bag", brand: "Hidesign", category: "Bags", subCategory: "Men", price: 4999, discountPrice: 3499, description: "Handcrafted genuine leather messenger briefcase with padded tablet sleeve and brass hardware.", tags: ["bags", "office", "men", "leather", "briefcase"], rating: 4.8, stock: 25, totalSales: 75 },
    { id: 76, name: "Leather Laptop Bag", brand: "Baggit", category: "Bags", subCategory: "Laptop Bags", price: 3899, discountPrice: 2699, description: "Executive brown leatherette laptop messenger featuring detachable padded shoulder strap.", tags: ["bags", "laptop", "leather", "executive", "baggit"], rating: 4.5, stock: 35, totalSales: 98 },
    { id: 77, name: "School Backpack", brand: "Disney", category: "Bags", subCategory: "Children", price: 1499, discountPrice: 899, description: "Lightweight kids school bag featuring ergonomic shoulder straps and reflective safety strips.", tags: ["bags", "school", "kids", "children", "backpack"], rating: 4.4, stock: 80, totalSales: 220 },
    { id: 78, name: "Gym Duffel Bag", brand: "Puma", category: "Bags", subCategory: "Men", price: 2199, discountPrice: 1399, description: "Compact sports workout duffel with ventilated wet laundry / shoe compartment.", tags: ["bags", "gym", "duffel", "puma", "sports"], rating: 4.6, stock: 60, totalSales: 145 },
    { id: 79, name: "Sling Bag", brand: "Caprese", category: "Bags", subCategory: "Women", price: 1699, discountPrice: 999, description: "Compact women's crossbody sling purse with adjustable chain strap and twist lock.", tags: ["bags", "sling", "women", "crossbody", "fashion"], rating: 4.4, stock: 70, totalSales: 130 },
    { id: 80, name: "Travel Duffle Bag", brand: "VIP", category: "Bags", subCategory: "Travel Bags", price: 3299, discountPrice: 2199, description: "Rolling travel duffel bag with corner wheels and retractable push-button trolley handle.", tags: ["bags", "travel", "duffel", "trolley", "vip"], rating: 4.6, stock: 30, totalSales: 90 },
    { id: 81, name: "Anti-Theft Backpack", brand: "Mokobara", category: "Bags", subCategory: "Laptop Bags", price: 3499, discountPrice: 2399, description: "Smart anti-theft laptop backpack with hidden zippers, secret card pockets, and external USB port.", tags: ["bags", "antitheft", "laptop", "smartbag", "mokobara"], rating: 4.7, stock: 45, totalSales: 115 },
    { id: 82, name: "Casual Shoulder Bag", brand: "Zouk", category: "Bags", subCategory: "Women", price: 2199, discountPrice: 1499, description: "Vegan handcrafted Indian printed canvas shoulder tote with sturdy leather handles.", tags: ["bags", "casual", "women", "shoulderbag", "zouk"], rating: 4.5, stock: 55, totalSales: 140 },
    { id: 83, name: "Camera Backpack", brand: "Lowepro", category: "Bags", subCategory: "Backpacks", price: 4999, discountPrice: 3699, description: "Professional DSLR camera backpack with customizable padded dividers and tripod attachment.", tags: ["bags", "camera", "dslr", "backpack", "photography"], rating: 4.8, stock: 20, totalSales: 65 },
    { id: 84, name: "Messenger Bag", brand: "Tommy Hilfiger", category: "Bags", subCategory: "Men", price: 2999, discountPrice: 1999, description: "Compact canvas crossbody messenger bag with magnetic flap closure and internal organization slots.", tags: ["bags", "messenger", "men", "crossbody", "tommy"], rating: 4.5, stock: 45, totalSales: 110 },
    { id: 85, name: "Large Travel Backpack", brand: "Safari", category: "Bags", subCategory: "Travel Bags", price: 4499, discountPrice: 3199, description: "Heavy-duty 55L luggage backpack featuring rain cover, hydration sleeve, and lumbar support.", tags: ["bags", "travel", "large", "backpack", "safari"], rating: 4.7, stock: 30, totalSales: 88 },

    // ==========================================
    // GROCERY (15 Products: 86 - 100)
    // ==========================================
    { id: 86, name: "Basmati Rice (5kg)", brand: "India Gate", category: "Grocery", subCategory: "Rice", price: 899, discountPrice: 749, description: "Aromatic long-grain extra fine aged Basmati rice ideal for biryani and special festive meals.", tags: ["grocery", "rice", "basmati", "staples", "food"], rating: 4.7, stock: 120, totalSales: 310 },
    { id: 87, name: "Wheat Flour (10kg)", brand: "Aashirvaad", category: "Grocery", subCategory: "Atta & Flour", price: 499, discountPrice: 429, description: "100% pure whole wheat chakki fresh flour rich in dietary fiber for soft rotis.", tags: ["grocery", "wheat", "atta", "flour", "staples"], rating: 4.8, stock: 150, totalSales: 450 },
    { id: 88, name: "Toor Dal (1kg)", brand: "Tata Sampann", category: "Grocery", subCategory: "Pulses", price: 199, discountPrice: 169, description: "Unpolished high protein Toor Arhar dal sourced from farm-fresh pulses.", tags: ["grocery", "pulses", "toordal", "dal", "food"], rating: 4.6, stock: 110, totalSales: 280 },
    { id: 89, name: "Moong Dal (1kg)", brand: "Fortune", category: "Grocery", subCategory: "Pulses", price: 179, discountPrice: 149, description: "Cleaned unpolished yellow split Moong Dal easy to digest and packed with natural goodness.", tags: ["grocery", "pulses", "moongdal", "dal", "health"], rating: 4.5, stock: 100, totalSales: 240 },
    { id: 90, name: "Sugar (5kg)", brand: "Madhur", category: "Grocery", subCategory: "Household Grocery", price: 259, discountPrice: 229, description: "Sulphur-free pure refined white crystal sugar processed under hygienic standards.", tags: ["grocery", "sugar", "sweetener", "kitchen", "essentials"], rating: 4.5, stock: 140, totalSales: 350 },
    { id: 91, name: "Salt (1kg Pack of 3)", brand: "Tata Salt", category: "Grocery", subCategory: "Household Grocery", price: 85, discountPrice: 69, description: "Vacuum evaporated iodized salt essential for daily health and cooking flavor.", tags: ["grocery", "salt", "iodized", "tata", "essentials"], rating: 4.8, stock: 200, totalSales: 600 },
    { id: 92, name: "Cooking Oil (5L)", brand: "Fortune", category: "Grocery", subCategory: "Cooking Oil", price: 999, discountPrice: 849, description: "Refined sunflower cooking oil light for digestion and enriched with Vitamin A & D.", tags: ["grocery", "oil", "cookingoil", "sunflower", "health"], rating: 4.6, stock: 90, totalSales: 320 },
    { id: 93, name: "Tea (500g)", brand: "Red Label", category: "Grocery", subCategory: "Beverages", price: 329, discountPrice: 269, description: "High quality CTC black tea leaves offering rich aroma, strong taste, and deep amber color.", tags: ["grocery", "tea", "beverages", "redlabel", "chai"], rating: 4.7, stock: 130, totalSales: 380 },
    { id: 94, name: "Coffee (200g)", brand: "Nescafé", category: "Grocery", subCategory: "Beverages", price: 449, discountPrice: 369, description: "100% pure instant coffee powder blended with roasted Robusta coffee beans.", tags: ["grocery", "coffee", "beverages", "nescafe", "instantcoffee"], rating: 4.7, stock: 110, totalSales: 290 },
    { id: 95, name: "Biscuits", brand: "Britannia", category: "Grocery", subCategory: "Biscuits", price: 180, discountPrice: 139, description: "Crispy butter cookies and digestive wheat biscuits family combo pack.", tags: ["grocery", "biscuits", "snacks", "britannia", "cookies"], rating: 4.5, stock: 160, totalSales: 410 },
    { id: 96, name: "Corn Flakes", brand: "Kellogg's", category: "Grocery", subCategory: "Breakfast Items", price: 399, discountPrice: 319, description: "Original golden crunchy corn flakes enriched with 8 essential vitamins and iron.", tags: ["grocery", "cornflakes", "breakfast", "kelloggs", "health"], rating: 4.6, stock: 85, totalSales: 210 },
    { id: 97, name: "Oats", brand: "Quaker", category: "Grocery", subCategory: "Breakfast Items", price: 229, discountPrice: 179, description: "100% natural whole grain rolled oats ideal for high-fiber nutritious breakfast porridge.", tags: ["grocery", "oats", "breakfast", "quaker", "fiber"], rating: 4.7, stock: 95, totalSales: 260 },
    { id: 98, name: "Dry Fruits", brand: "Happilo", category: "Grocery", subCategory: "Dry Fruits", price: 1399, discountPrice: 999, description: "Premium dry fruits mix containing California almonds, whole cashews, walnuts, and raisins.", tags: ["grocery", "dryfruits", "nuts", "happilo", "health"], rating: 4.8, stock: 70, totalSales: 195 },
    { id: 99, name: "Spices Combo", brand: "Everest", category: "Grocery", subCategory: "Spices", price: 549, discountPrice: 429, description: "Essential authentic spice combo set including Red Chilli, Turmeric, Coriander, and Garam Masala.", tags: ["grocery", "spices", "everest", "masala", "cooking"], rating: 4.7, stock: 110, totalSales: 340 },
    { id: 100, name: "Packaged Snacks", brand: "Haldiram's", category: "Grocery", subCategory: "Snacks", price: 349, discountPrice: 269, description: "Assorted classic Indian savory namkeen snacks pack perfect for tea time sharing.", tags: ["grocery", "snacks", "namkeen", "haldirams", "food"], rating: 4.6, stock: 140, totalSales: 390 }
];

async function seed100Products() {
    console.log("=================================================");
    console.log("🌱 STARTING DIGITALMART 100-PRODUCT SEED SCRIPT");
    console.log("=================================================\n");

    if (!MONGO_URL) {
        console.error("❌ ERROR: MONGO_URL environment variable is missing!");
        process.exit(1);
    }

    try {
        console.log("⏳ Connecting to MongoDB database...");
        await mongoose.connect(MONGO_URL);
        console.log("✅ Connected to MongoDB.\n");

        // 1. Seed or retrieve Category collection
        console.log("⏳ Syncing Categories collection...");
        for (const cat of REFERENCE_CATEGORIES) {
            await Category.findOneAndUpdate(
                { name: cat.name },
                {
                    name: cat.name,
                    slug: cat.slug,
                    icon: cat.icon,
                    description: cat.description,
                    isActive: true
                },
                { upsert: true, returnDocument: 'after' }
            );
        }
        console.log(`✅ ${REFERENCE_CATEGORIES.length} reference categories synced.\n`);

        // 2. Fetch or create a default Admin/Seller user for valid ObjectId reference
        console.log("⏳ Fetching valid Seller reference...");
        let sellerUser = await User.findOne({ role: "admin" });
        if (!sellerUser) {
            sellerUser = await User.findOne({});
        }
        if (!sellerUser) {
            const passhash = await bcrypt.hash("Admin@12345", 10);
            sellerUser = await User.create({
                name: "DigitalMart Official Admin",
                email: "admin@digitalmart.com",
                password: passhash,
                phone: "9999999999",
                role: "admin",
                isActive: true
            });
            console.log("  ➡️ Created default Admin user:", sellerUser._id);
        } else {
            console.log("  ➡️ Found existing user for seller field:", sellerUser._id, `(${sellerUser.email})`);
        }

        // 3. Prepare high-quality realistic product images per product
        console.log(`\n📦 Validating catalog dataset... Total items: ${catalog100.length}`);

        const categoryPhotoMap = {
            "Clothes": [
                "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80"
            ],
            "Shoes": [
                "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=800&auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=800&auto=format&fit=crop&q=80"
            ],
            "Mobiles": [
                "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1534536281715-e28d76741401?w=800&auto=format&fit=crop&q=80"
            ],
            "Earphones": [
                "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80"
            ],
            "Laptops": [
                "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&auto=format&fit=crop&q=80"
            ],
            "Bags": [
                "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&auto=format&fit=crop&q=80"
            ],
            "Grocery": [
                "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop&q=80"
            ]
        };

        const preparedProducts = catalog100.map((p, idx) => {
            const photos = categoryPhotoMap[p.category] || categoryPhotoMap["Clothes"];
            const primaryPhoto = photos[idx % photos.length];
            const secondaryPhoto = photos[(idx + 1) % photos.length];

            const productImages = [
                primaryPhoto,
                `/images/products/prod_${p.id}_front.svg`,
                secondaryPhoto,
                `/images/products/prod_${p.id}_detail.svg`
            ];
            const thumbnail = primaryPhoto;

            return {
                name: p.name,
                title: p.name,
                description: p.description,
                price: p.price,
                discountPrice: p.discountPrice,
                category: p.category,
                subCategory: p.subCategory || "",
                brand: p.brand,
                image: productImages,
                images: productImages,
                thumbnail: thumbnail,
                seller: sellerUser._id,
                tags: p.tags || [],
                isPublished: true,
                totalSales: p.totalSales || 10,
                averageRating: p.rating || 4.5,
                rating: p.rating || 4.5,
                stock: p.stock || 20,
                createdAt: new Date(),
                updatedAt: new Date()
            };
        });

        // 4. Clear old products collection and insert fresh exact 100 catalog products
        console.log("⏳ Clearing existing product catalog...");
        await Product.deleteMany({});
        console.log("✅ Cleared old product entries.");

        console.log("⏳ Inserting 100 physical products with 400 angle-consistent images into MongoDB...");
        const inserted = await Product.insertMany(preparedProducts);
        console.log(`🎉 Successfully inserted ${inserted.length} products into MongoDB!\n`);

        // 5. Audit Database Count & Distribution
        const dbCount = await Product.countDocuments();
        console.log(`📊 DATABASE COUNT CHECK: Product.countDocuments() = ${dbCount}`);

        const breakdown = await Product.aggregate([
            { $group: { _id: "$category", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        console.log("\n=================================================");
        console.log("📊 CATEGORY DISTRIBUTION AUDIT");
        console.log("=================================================");
        console.table(
            breakdown.map((b) => ({
                "Category": b._id,
                "Count": b.count
            }))
        );

        console.log("=================================================");
        console.log("✅ 100-PRODUCT MULTI-ANGLE SEEDING COMPLETED SUCCESSFULLY!");
        console.log("=================================================\n");

        process.exit(0);
    } catch (err) {
        console.error("❌ SEEDING ERROR:", err);
        process.exit(1);
    }
}

seed100Products();
