import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputDir = path.join(__dirname, "../client/public/images/products");

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// 100 Product Color and Visual Blueprint Map
const productBlueprints = [
    // CLOTHES (1-20)
    { id: 1, name: "Men's Regular Fit Cotton T-Shirt", category: "Clothes", brand: "Puma", mainColor: "#2563eb", secondaryColor: "#1e40af", accentColor: "#ef4444", text: "PUMA SPORT" },
    { id: 2, name: "Women's Oversized Hoodie", category: "Clothes", brand: "H&M", mainColor: "#ec4899", secondaryColor: "#be185d", accentColor: "#f472b6", text: "COZY FLEECE" },
    { id: 3, name: "Men's Slim Fit Casual Shirt", category: "Clothes", brand: "Levi's", mainColor: "#0284c7", secondaryColor: "#0369a1", accentColor: "#e0f2fe", text: "DENIM CASUAL" },
    { id: 4, name: "Women's Floral Summer Dress", category: "Clothes", brand: "Zara", mainColor: "#f43f5e", secondaryColor: "#e11d48", accentColor: "#fb7185", text: "FLORAL DRESS" },
    { id: 5, name: "Men's Denim Jacket", category: "Clothes", brand: "Roadster", mainColor: "#1e3a8a", secondaryColor: "#172554", accentColor: "#93c5fd", text: "RUGGED DENIM" },
    { id: 6, name: "Women's Straight Fit Jeans", category: "Clothes", brand: "Levi's", mainColor: "#3b82f6", secondaryColor: "#1d4ed8", accentColor: "#bfdbfe", text: "LEVI STRAUSS" },
    { id: 7, name: "Kids Cotton Printed T-Shirt", category: "Clothes", brand: "FirstCry", mainColor: "#f59e0b", secondaryColor: "#d97706", accentColor: "#fef08a", text: "SUPER KIDS" },
    { id: 8, name: "Men's Polo T-Shirt", category: "Clothes", brand: "US Polo Assn", mainColor: "#047857", secondaryColor: "#065f46", accentColor: "#a7f3d0", text: "POLO ATHLETIC" },
    { id: 9, name: "Women's Casual Top", category: "Clothes", brand: "ONLY", mainColor: "#8b5cf6", secondaryColor: "#7c3aed", accentColor: "#ddd6fe", text: "ONLY CHIC" },
    { id: 10, name: "Men's Cargo Pants", category: "Clothes", brand: "Woodland", mainColor: "#4b5563", secondaryColor: "#374151", accentColor: "#9ca3af", text: "WOODLAND CARGO" },
    { id: 11, name: "Women's Cotton Kurti", category: "Clothes", brand: "Biba", mainColor: "#d97706", secondaryColor: "#b45309", accentColor: "#fde68a", text: "BIBA ETHNIC" },
    { id: 12, name: "Men's Formal Shirt", category: "Clothes", brand: "Peter England", mainColor: "#0284c7", secondaryColor: "#075985", accentColor: "#bae6fd", text: "PETER ENGLAND" },
    { id: 13, name: "Kids Hoodie", category: "Clothes", brand: "Allen Solly Kids", mainColor: "#0ea5e9", secondaryColor: "#0284c7", accentColor: "#7dd3fc", text: "SOLLY KIDS" },
    { id: 14, name: "Women's Denim Jacket", category: "Clothes", brand: "MANGO", mainColor: "#64748b", secondaryColor: "#475569", accentColor: "#cbd5e1", text: "MANGO DENIM" },
    { id: 15, name: "Men's Track Pants", category: "Clothes", brand: "Adidas", mainColor: "#111827", secondaryColor: "#000000", accentColor: "#ffffff", text: "ADIDAS 3-STRIPE" },
    { id: 16, name: "Women's Palazzo Pants", category: "Clothes", brand: "Aurelia", mainColor: "#9333ea", secondaryColor: "#7e22ce", accentColor: "#e9d5ff", text: "AURELIA ETHNIC" },
    { id: 17, name: "Men's Sweatshirt", category: "Clothes", brand: "Superdry", mainColor: "#ea580c", secondaryColor: "#c2410c", accentColor: "#ffedd5", text: "SUPERDRY JPN" },
    { id: 18, name: "Women's Party Dress", category: "Clothes", brand: "Forever New", mainColor: "#e11d48", secondaryColor: "#be123c", accentColor: "#fecdd3", text: "FOREVER NEW" },
    { id: 19, name: "Kids Casual Shirt", category: "Clothes", brand: "Mothercare", mainColor: "#0284c7", secondaryColor: "#0369a1", accentColor: "#e0f2fe", text: "MOTHERCARE" },
    { id: 20, name: "Men's Casual Jeans", category: "Clothes", brand: "Wrangler", mainColor: "#1e40af", secondaryColor: "#1e3a8a", accentColor: "#93c5fd", text: "WRANGLER DENIM" },

    // SHOES (21-35)
    { id: 21, name: "Men's Running Shoes", category: "Shoes", brand: "Nike", mainColor: "#dc2626", secondaryColor: "#991b1b", accentColor: "#ffffff", text: "NIKE AIR RUN" },
    { id: 22, name: "Women's Walking Shoes", category: "Shoes", brand: "Skechers", mainColor: "#0284c7", secondaryColor: "#0369a1", accentColor: "#e0f2fe", text: "SKECHERS WALK" },
    { id: 23, name: "Men's Casual Sneakers", category: "Shoes", brand: "Puma", mainColor: "#111827", secondaryColor: "#000000", accentColor: "#f59e0b", text: "PUMA STREET" },
    { id: 24, name: "Women's Sports Sneakers", category: "Shoes", brand: "Adidas", mainColor: "#ec4899", secondaryColor: "#be185d", accentColor: "#ffffff", text: "ADIDAS BOOST" },
    { id: 25, name: "Men's Formal Shoes", category: "Shoes", brand: "Bata", mainColor: "#451a03", secondaryColor: "#292524", accentColor: "#d97706", text: "BATA OXFORD" },
    { id: 26, name: "Women's Flat Sandals", category: "Shoes", brand: "Metro", mainColor: "#d97706", secondaryColor: "#92400e", accentColor: "#fef08a", text: "METRO FLATS" },
    { id: 27, name: "Men's Loafers", category: "Shoes", brand: "Red Tape", mainColor: "#78350f", secondaryColor: "#451a03", accentColor: "#fde68a", text: "RED TAPE LOAFER" },
    { id: 28, name: "Women's Running Shoes", category: "Shoes", brand: "Reebok", mainColor: "#8b5cf6", secondaryColor: "#6d28d9", accentColor: "#ffffff", text: "REEBOK RUN" },
    { id: 29, name: "Kids Sports Shoes", category: "Shoes", brand: "Crocs", mainColor: "#10b981", secondaryColor: "#047857", accentColor: "#a7f3d0", text: "CROCS KIDS" },
    { id: 30, name: "Men's Basketball Shoes", category: "Shoes", brand: "Under Armour", mainColor: "#2563eb", secondaryColor: "#1d4ed8", accentColor: "#f59e0b", text: "UA HOVR COURT" },
    { id: 31, name: "Women's Casual Shoes", category: "Shoes", brand: "Puma", mainColor: "#f43f5e", secondaryColor: "#e11d48", accentColor: "#ffffff", text: "PUMA CASUAL" },
    { id: 32, name: "Men's Trekking Shoes", category: "Shoes", brand: "Woodland", mainColor: "#365314", secondaryColor: "#1a2e05", accentColor: "#84cc16", text: "WOODLAND TREK" },
    { id: 33, name: "Women's Slip-On Shoes", category: "Shoes", brand: "Catwalk", mainColor: "#6366f1", secondaryColor: "#4338ca", accentColor: "#e0e7ff", text: "CATWALK SLIPON" },
    { id: 34, name: "Kids School Shoes", category: "Shoes", brand: "Liberty", mainColor: "#18181b", secondaryColor: "#09090b", accentColor: "#e4e4e7", text: "LIBERTY SCHOOL" },
    { id: 35, name: "Men's Canvas Sneakers", category: "Shoes", brand: "Converse", mainColor: "#b91c1c", secondaryColor: "#7f1d1d", accentColor: "#ffffff", text: "CONVERSE ALLSTAR" },

    // MOBILES (36-50)
    { id: 36, name: "Samsung Galaxy A Series", category: "Mobiles", brand: "Samsung", mainColor: "#2563eb", secondaryColor: "#1e3a8a", accentColor: "#60a5fa", text: "GALAXY A 5G" },
    { id: 37, name: "OnePlus Nord Series", category: "Mobiles", brand: "OnePlus", mainColor: "#0d9488", secondaryColor: "#115e59", accentColor: "#5eead4", text: "ONEPLUS NORD" },
    { id: 38, name: "Xiaomi Redmi Note Series", category: "Mobiles", brand: "Xiaomi", mainColor: "#ea580c", secondaryColor: "#9a3412", accentColor: "#ffedd5", text: "REDMI NOTE 108MP" },
    { id: 39, name: "Realme Number Series", category: "Mobiles", brand: "Realme", mainColor: "#eab308", secondaryColor: "#a16207", accentColor: "#fef08a", text: "REALME CURVED" },
    { id: 40, name: "Motorola G Series", category: "Mobiles", brand: "Motorola", mainColor: "#475569", secondaryColor: "#1e293b", accentColor: "#94a3b8", text: "MOTO G 50MP" },
    { id: 41, name: "Vivo Y Series", category: "Mobiles", brand: "Vivo", mainColor: "#7c3aed", secondaryColor: "#5b21b6", accentColor: "#ddd6fe", text: "VIVO Y NIGHT" },
    { id: 42, name: "Oppo A Series", category: "Mobiles", brand: "Oppo", mainColor: "#059669", secondaryColor: "#065f46", accentColor: "#6ee7b7", text: "OPPO A GLOW" },
    { id: 43, name: "iQOO Z Series", category: "Mobiles", brand: "iQOO", mainColor: "#dc2626", secondaryColor: "#991b1b", accentColor: "#fca5a5", text: "iQOO Z GAMING" },
    { id: 44, name: "Nothing Phone Series", category: "Mobiles", brand: "Nothing", mainColor: "#18181b", secondaryColor: "#09090b", accentColor: "#38bdf8", text: "NOTHING GLYPH" },
    { id: 45, name: "Poco X Series", category: "Mobiles", brand: "Poco", mainColor: "#ca8a04", secondaryColor: "#854d0e", accentColor: "#fef08a", text: "POCO X 120Hz" },
    { id: 46, name: "Samsung Galaxy M Series", category: "Mobiles", brand: "Samsung", mainColor: "#0284c7", secondaryColor: "#075985", accentColor: "#7dd3fc", text: "GALAXY M 6000mAh" },
    { id: 47, name: "OnePlus Number Series", category: "Mobiles", brand: "OnePlus", mainColor: "#b91c1c", secondaryColor: "#7f1d1d", accentColor: "#fca5a5", text: "ONEPLUS 100W" },
    { id: 48, name: "Realme Narzo Series", category: "Mobiles", brand: "Realme", mainColor: "#2563eb", secondaryColor: "#1d4ed8", accentColor: "#93c5fd", text: "NARZO GAMING" },
    { id: 49, name: "Redmi A Series", category: "Mobiles", brand: "Xiaomi", mainColor: "#64748b", secondaryColor: "#334155", accentColor: "#cbd5e1", text: "REDMI A GO" },
    { id: 50, name: "Motorola Edge Series", category: "Mobiles", brand: "Motorola", mainColor: "#0f766e", secondaryColor: "#115e59", accentColor: "#99f6e4", text: "MOTO EDGE 144Hz" },

    // EARPHONES (51-60)
    { id: 51, name: "Wireless Bluetooth Earbuds", category: "Earphones", brand: "boAt", mainColor: "#1e293b", secondaryColor: "#0f172a", accentColor: "#38bdf8", text: "boAt Airdopes" },
    { id: 52, name: "Noise Cancelling Earbuds", category: "Earphones", brand: "Sony", mainColor: "#18181b", secondaryColor: "#09090b", accentColor: "#f59e0b", text: "SONY ANC TWS" },
    { id: 53, name: "TWS Gaming Earbuds", category: "Earphones", brand: "Noise", mainColor: "#0284c7", secondaryColor: "#0369a1", accentColor: "#38bdf8", text: "NOISE GAMING 40ms" },
    { id: 54, name: "Wireless Neckband", category: "Earphones", brand: "Realme", mainColor: "#ca8a04", secondaryColor: "#854d0e", accentColor: "#fef08a", text: "REALME NECKBAND" },
    { id: 55, name: "Bluetooth Headphones", category: "Earphones", brand: "JBL", mainColor: "#ea580c", secondaryColor: "#9a3412", accentColor: "#ffedd5", text: "JBL PURE BASS" },
    { id: 56, name: "Over-Ear Wireless Headphones", category: "Earphones", brand: "Sony", mainColor: "#334155", secondaryColor: "#1e293b", accentColor: "#cbd5e1", text: "SONY OVER-EAR ANC" },
    { id: 57, name: "Sports Bluetooth Earphones", category: "Earphones", brand: "boAt", mainColor: "#dc2626", secondaryColor: "#991b1b", accentColor: "#ffffff", text: "boAt SPORT IPX7" },
    { id: 58, name: "Type-C Wired Earphones", category: "Earphones", brand: "Sennheiser", mainColor: "#059669", secondaryColor: "#065f46", accentColor: "#a7f3d0", text: "SENNHEISER TYPE-C" },
    { id: 59, name: "Premium TWS Earbuds", category: "Earphones", brand: "Bose", mainColor: "#0f172a", secondaryColor: "#020617", accentColor: "#94a3b8", text: "BOSE QUIETCOMFORT" },
    { id: 60, name: "Bass Boost Wireless Earphones", category: "Earphones", brand: "OnePlus", mainColor: "#b91c1c", secondaryColor: "#7f1d1d", accentColor: "#fca5a5", text: "ONEPLUS BASS" },

    // LAPTOPS (61-70)
    { id: 61, name: "Lenovo IdeaPad", category: "Laptops", brand: "Lenovo", mainColor: "#475569", secondaryColor: "#1e293b", accentColor: "#38bdf8", text: "LENOVO IDEAPAD i5" },
    { id: 62, name: "HP Pavilion", category: "Laptops", brand: "HP", mainColor: "#0284c7", secondaryColor: "#075985", accentColor: "#7dd3fc", text: "HP PAVILION 2-IN-1" },
    { id: 63, name: "Dell Inspiron", category: "Laptops", brand: "Dell", mainColor: "#2563eb", secondaryColor: "#1d4ed8", accentColor: "#93c5fd", text: "DELL INSPIRON RYZEN" },
    { id: 64, name: "ASUS VivoBook", category: "Laptops", brand: "ASUS", mainColor: "#7c3aed", secondaryColor: "#5b21b6", accentColor: "#ddd6fe", text: "ASUS VIVOBOOK OLED" },
    { id: 65, name: "Acer Aspire", category: "Laptops", brand: "Acer", mainColor: "#059669", secondaryColor: "#065f46", accentColor: "#a7f3d0", text: "ACER ASPIRE i3" },
    { id: 66, name: "HP 15 Series", category: "Laptops", brand: "HP", mainColor: "#64748b", secondaryColor: "#334155", accentColor: "#cbd5e1", text: "HP 15s THIN LIGHT" },
    { id: 67, name: "Lenovo V Series", category: "Laptops", brand: "Lenovo", mainColor: "#18181b", secondaryColor: "#09090b", accentColor: "#a1a1aa", text: "LENOVO V BUSINESS" },
    { id: 68, name: "ASUS TUF Gaming", category: "Laptops", brand: "ASUS", mainColor: "#b91c1c", secondaryColor: "#7f1d1d", accentColor: "#f59e0b", text: "ASUS TUF RTX3050" },
    { id: 69, name: "Acer Nitro Gaming Laptop", category: "Laptops", brand: "Acer", mainColor: "#c2410c", secondaryColor: "#7c2d12", accentColor: "#f97316", text: "ACER NITRO i7 RGB" },
    { id: 70, name: "Dell Vostro", category: "Laptops", brand: "Dell", mainColor: "#1e3a8a", secondaryColor: "#172554", accentColor: "#60a5fa", text: "DELL VOSTRO PRO" },

    // BAGS (71-85)
    { id: 71, name: "Laptop Backpack", category: "Bags", brand: "Wildcraft", mainColor: "#1e293b", secondaryColor: "#0f172a", accentColor: "#38bdf8", text: "WILDCRAFT 30L" },
    { id: 72, name: "College Backpack", category: "Bags", brand: "Skybags", mainColor: "#0284c7", secondaryColor: "#0369a1", accentColor: "#bae6fd", text: "SKYBAGS COLLEGE" },
    { id: 73, name: "Travel Backpack", category: "Bags", brand: "American Tourister", mainColor: "#b91c1c", secondaryColor: "#7f1d1d", accentColor: "#fca5a5", text: "AT TRAVEL 45L" },
    { id: 74, name: "Women's Handbag", category: "Bags", brand: "Lavie", mainColor: "#be185d", secondaryColor: "#9d174d", accentColor: "#fbcfe8", text: "LAVIE TOTE BAG" },
    { id: 75, name: "Men's Office Bag", category: "Bags", brand: "Hidesign", mainColor: "#451a03", secondaryColor: "#292524", accentColor: "#fde68a", text: "HIDESIGN LEATHER" },
    { id: 76, name: "Leather Laptop Bag", category: "Bags", brand: "Baggit", mainColor: "#78350f", secondaryColor: "#451a03", accentColor: "#fef08a", text: "BAGGIT LEATHERETTE" },
    { id: 77, name: "School Backpack", category: "Bags", brand: "Disney", mainColor: "#2563eb", secondaryColor: "#1d4ed8", accentColor: "#f59e0b", text: "DISNEY SCHOOL BAG" },
    { id: 78, name: "Gym Duffel Bag", category: "Bags", brand: "Puma", mainColor: "#111827", secondaryColor: "#000000", accentColor: "#ef4444", text: "PUMA GYM DUFFEL" },
    { id: 79, name: "Sling Bag", category: "Bags", brand: "Caprese", mainColor: "#7c3aed", secondaryColor: "#5b21b6", accentColor: "#ddd6fe", text: "CAPRESE SLING" },
    { id: 80, name: "Travel Duffle Bag", category: "Bags", brand: "VIP", mainColor: "#0369a1", secondaryColor: "#075985", accentColor: "#7dd3fc", text: "VIP ROLLING DUFFLE" },
    { id: 81, name: "Anti-Theft Backpack", category: "Bags", brand: "Mokobara", mainColor: "#334155", secondaryColor: "#1e293b", accentColor: "#38bdf8", text: "MOKOBARA ANTI-THEFT" },
    { id: 82, name: "Casual Shoulder Bag", category: "Bags", brand: "Zouk", mainColor: "#d97706", secondaryColor: "#92400e", accentColor: "#fef08a", text: "ZOUK ETHNIC TOTE" },
    { id: 83, name: "Camera Backpack", category: "Bags", brand: "Lowepro", mainColor: "#18181b", secondaryColor: "#09090b", accentColor: "#f97316", text: "LOWEPRO DSLR PRO" },
    { id: 84, name: "Messenger Bag", category: "Bags", brand: "Tommy Hilfiger", mainColor: "#1e3a8a", secondaryColor: "#172554", accentColor: "#ef4444", text: "TOMMY MESSENGER" },
    { id: 85, name: "Large Travel Backpack", category: "Bags", brand: "Safari", mainColor: "#15803d", secondaryColor: "#166534", accentColor: "#86efac", text: "SAFARI RUCKSACK 55L" },

    // GROCERY (86-100)
    { id: 86, name: "Basmati Rice (5kg)", category: "Grocery", brand: "India Gate", mainColor: "#d97706", secondaryColor: "#92400e", accentColor: "#ffffff", text: "INDIA GATE BASMATI 5kg" },
    { id: 87, name: "Wheat Flour (10kg)", category: "Grocery", brand: "Aashirvaad", mainColor: "#ca8a04", secondaryColor: "#854d0e", accentColor: "#ffffff", text: "AASHIRVAAD ATTA 10kg" },
    { id: 88, name: "Toor Dal (1kg)", category: "Grocery", brand: "Tata Sampann", mainColor: "#eab308", secondaryColor: "#a16207", accentColor: "#ffffff", text: "TATA TOOR DAL 1kg" },
    { id: 89, name: "Moong Dal (1kg)", category: "Grocery", brand: "Fortune", mainColor: "#84cc16", secondaryColor: "#4d7c0f", accentColor: "#ffffff", text: "FORTUNE MOONG 1kg" },
    { id: 90, name: "Sugar (5kg)", category: "Grocery", brand: "Madhur", mainColor: "#0284c7", secondaryColor: "#0369a1", accentColor: "#ffffff", text: "MADHUR SUGAR 5kg" },
    { id: 91, name: "Salt (1kg Pack of 3)", category: "Grocery", brand: "Tata Salt", mainColor: "#2563eb", secondaryColor: "#1d4ed8", accentColor: "#ffffff", text: "TATA IODIZED SALT" },
    { id: 92, name: "Cooking Oil (5L)", category: "Grocery", brand: "Fortune", mainColor: "#eab308", secondaryColor: "#ca8a04", accentColor: "#ffffff", text: "FORTUNE SUNFLOWER 5L" },
    { id: 93, name: "Tea (500g)", category: "Grocery", brand: "Red Label", mainColor: "#dc2626", secondaryColor: "#991b1b", accentColor: "#ffffff", text: "RED LABEL TEA 500g" },
    { id: 94, name: "Coffee (200g)", category: "Grocery", brand: "Nescafé", mainColor: "#451a03", secondaryColor: "#292524", accentColor: "#ffffff", text: "NESCAFE CLASSIC 200g" },
    { id: 95, name: "Biscuits", category: "Grocery", brand: "Britannia", mainColor: "#ea580c", secondaryColor: "#c2410c", accentColor: "#ffffff", text: "BRITANNIA COOKIES" },
    { id: 96, name: "Corn Flakes", category: "Grocery", brand: "Kellogg's", mainColor: "#dc2626", secondaryColor: "#991b1b", accentColor: "#fef08a", text: "KELLOGGS CORNFLAKES" },
    { id: 97, name: "Oats", category: "Grocery", brand: "Quaker", mainColor: "#0284c7", secondaryColor: "#0369a1", accentColor: "#ffffff", text: "QUAKER ROLLED OATS 1kg" },
    { id: 98, name: "Dry Fruits", category: "Grocery", brand: "Happilo", mainColor: "#78350f", secondaryColor: "#451a03", accentColor: "#fde68a", text: "HAPPILO DRY FRUITS" },
    { id: 99, name: "Spices Combo", category: "Grocery", brand: "Everest", mainColor: "#b91c1c", secondaryColor: "#7f1d1d", accentColor: "#fef08a", text: "EVEREST MASALA COMBO" },
    { id: 100, name: "Packaged Snacks", category: "Grocery", brand: "Haldiram's", mainColor: "#ca8a04", secondaryColor: "#854d0e", accentColor: "#ffffff", text: "HALDIRAMS NAMKEEN" }
];

function generateSVG(blueprint, angle) {
    const { name, category, brand, mainColor, secondaryColor, accentColor, text } = blueprint;

    const angleTitle = angle === "front" ? "FRONT VIEW" : angle === "back" ? "BACK VIEW" : angle === "side" ? "SIDE VIEW" : "DETAIL MACRO VIEW";

    // 3D Perspective Transformations & Structural Layouts based on Angle
    let viewGraphic = "";

    if (category === "Clothes") {
        if (angle === "front") {
            viewGraphic = `
                <!-- T-Shirt / Garment Front -->
                <path d="M 220 220 L 290 280 L 260 340 L 220 310 L 220 540 L 580 540 L 580 310 L 540 340 L 510 280 L 580 220 L 490 210 Q 400 280 310 210 Z" fill="${mainColor}" stroke="${secondaryColor}" stroke-width="8" />
                <path d="M 310 210 Q 400 280 490 210" fill="none" stroke="${secondaryColor}" stroke-width="12" />
                <!-- Front Brand Chest Logo & Print -->
                <rect x="340" y="320" width="120" height="40" rx="8" fill="${accentColor}" />
                <text x="400" y="346" font-size="16" font-weight="bold" fill="${mainColor}" text-anchor="middle">${brand}</text>
                <text x="400" y="440" font-size="22" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="2">${text}</text>
            `;
        } else if (angle === "back") {
            viewGraphic = `
                <!-- Garment Back View (Same Color & Cut, Back Neck Seam, Plain Back) -->
                <path d="M 220 220 L 290 280 L 260 340 L 220 310 L 220 540 L 580 540 L 580 310 L 540 340 L 510 280 L 580 220 L 490 210 Q 400 230 310 210 Z" fill="${mainColor}" stroke="${secondaryColor}" stroke-width="8" />
                <path d="M 310 210 Q 400 230 490 210" fill="none" stroke="${secondaryColor}" stroke-width="12" />
                <!-- Back Collar Seam & Hanger Loop -->
                <line x1="330" y1="230" x2="470" y2="230" stroke="${secondaryColor}" stroke-width="6" stroke-dasharray="8 6" />
                <rect x="380" y="240" width="40" height="20" rx="4" fill="${secondaryColor}" />
                <text x="400" y="254" font-size="10" font-weight="bold" fill="#ffffff" text-anchor="middle">BACK</text>
                <text x="400" y="420" font-size="20" font-weight="900" fill="${secondaryColor}" text-anchor="middle" opacity="0.6">${text}</text>
            `;
        } else if (angle === "side") {
            viewGraphic = `
                <!-- Garment Side Profile View -->
                <path d="M 330 210 L 440 250 L 430 360 L 390 340 L 390 540 L 470 540 L 470 340 L 500 360 L 480 250 L 450 210 Z" fill="${mainColor}" stroke="${secondaryColor}" stroke-width="8" />
                <!-- Side Sleeve Seam & Armhole -->
                <path d="M 440 250 Q 420 300 430 360" fill="none" stroke="${secondaryColor}" stroke-width="8" stroke-dasharray="6 4" />
                <text x="430" y="440" font-size="18" font-weight="bold" fill="#ffffff" text-anchor="middle">${brand} SIDE</text>
            `;
        } else {
            // Detail Macro Zoom View
            viewGraphic = `
                <!-- Micro Texture Fabric Zoom View -->
                <rect x="220" y="200" width="360" height="340" rx="16" fill="${mainColor}" stroke="${secondaryColor}" stroke-width="10" />
                <!-- Fabric Weave Lines -->
                <pattern id="weave" width="20" height="20" patternUnits="userSpaceOnUse">
                    <line x1="0" y1="0" x2="20" y2="20" stroke="${secondaryColor}" stroke-width="3" opacity="0.4"/>
                    <line x1="20" y1="0" x2="0" y2="20" stroke="${accentColor}" stroke-width="2" opacity="0.3"/>
                </pattern>
                <rect x="220" y="200" width="360" height="340" rx="16" fill="url(#weave)" />
                <!-- Embossed Brand Patch & Stitching -->
                <rect x="280" y="310" width="240" height="120" rx="12" fill="${secondaryColor}" stroke="${accentColor}" stroke-width="6" stroke-dasharray="10 6" />
                <text x="400" y="365" font-size="24" font-weight="900" fill="#ffffff" text-anchor="middle">${brand}</text>
                <text x="400" y="400" font-size="14" font-weight="bold" fill="${accentColor}" text-anchor="middle">AUTHENTIC FABRIC WEAVE</text>
            `;
        }
    } else if (category === "Shoes") {
        if (angle === "front") {
            viewGraphic = `
                <!-- Shoe Front / 3-Quarter Perspective -->
                <path d="M 280 440 Q 300 260 400 240 Q 500 260 520 440 L 540 490 Q 400 530 260 490 Z" fill="${mainColor}" stroke="${secondaryColor}" stroke-width="8" />
                <!-- Toe Cap & Laces -->
                <path d="M 330 380 Q 400 350 470 380 L 460 480 Q 400 500 340 480 Z" fill="${secondaryColor}" />
                <line x1="360" y1="310" x2="440" y2="310" stroke="${accentColor}" stroke-width="8" />
                <line x1="365" y1="340" x2="435" y2="340" stroke="${accentColor}" stroke-width="8" />
                <line x1="370" y1="370" x2="430" y2="370" stroke="${accentColor}" stroke-width="8" />
                <!-- Sole Front -->
                <path d="M 250 490 Q 400 540 550 490 L 550 530 Q 400 560 250 530 Z" fill="${accentColor}" stroke="${secondaryColor}" stroke-width="4" />
                <text x="400" y="290" font-size="18" font-weight="bold" fill="#ffffff" text-anchor="middle">${brand}</text>
            `;
        } else if (angle === "back") {
            viewGraphic = `
                <!-- Shoe Back Heel View -->
                <path d="M 320 230 Q 400 220 480 230 L 500 490 Q 400 520 300 490 Z" fill="${mainColor}" stroke="${secondaryColor}" stroke-width="8" />
                <!-- Heel Collar & Pull Tab -->
                <rect x="380" y="190" width="40" height="50" rx="8" fill="${accentColor}" stroke="${secondaryColor}" stroke-width="4" />
                <path d="M 350 320 Q 400 300 450 320 L 460 490 Q 400 510 340 490 Z" fill="${secondaryColor}" />
                <!-- Back Heel Brand Logo -->
                <circle cx="400" cy="380" r="30" fill="${accentColor}" />
                <text x="400" y="386" font-size="14" font-weight="900" fill="${mainColor}" text-anchor="middle">${brand[0]}</text>
                <!-- Sole Back -->
                <path d="M 290 490 Q 400 520 510 490 L 510 530 Q 400 550 290 530 Z" fill="${accentColor}" />
            `;
        } else if (angle === "side") {
            viewGraphic = `
                <!-- Shoe Full Lateral Side Profile -->
                <path d="M 200 420 Q 240 300 380 300 Q 500 320 580 430 L 590 480 L 190 480 Z" fill="${mainColor}" stroke="${secondaryColor}" stroke-width="8" />
                <!-- Side Swoosh / Stripe Motif -->
                <path d="M 260 400 Q 400 340 540 370 Q 420 430 300 430 Z" fill="${accentColor}" stroke="${secondaryColor}" stroke-width="4" />
                <!-- Thick Cushioned Midsole -->
                <path d="M 180 480 L 600 480 L 590 530 L 190 530 Z" fill="#ffffff" stroke="${secondaryColor}" stroke-width="6" />
                <path d="M 180 530 L 600 530 L 590 545 L 190 545 Z" fill="${secondaryColor}" />
                <text x="390" y="375" font-size="16" font-weight="900" fill="${secondaryColor}" text-anchor="middle">${brand}</text>
            `;
        } else {
            // Detail Tread / Material Macro View
            viewGraphic = `
                <!-- Macro View of Mesh Texture & Cushion Sole -->
                <rect x="220" y="200" width="360" height="340" rx="16" fill="${mainColor}" stroke="${secondaryColor}" stroke-width="10" />
                <circle cx="400" cy="370" r="110" fill="${secondaryColor}" stroke="${accentColor}" stroke-width="8" />
                <path d="M 330 370 Q 400 310 470 340 Q 400 410 330 400 Z" fill="${accentColor}" />
                <text x="400" y="376" font-size="20" font-weight="900" fill="${mainColor}" text-anchor="middle">${brand}</text>
                <text x="400" y="440" font-size="14" font-weight="bold" fill="#ffffff" text-anchor="middle">REINFORCED SOLE STITCH</text>
            `;
        }
    } else if (category === "Mobiles") {
        if (angle === "front") {
            viewGraphic = `
                <!-- Phone Front Bezel & Display Screen -->
                <rect x="270" y="170" width="260" height="420" rx="36" fill="#09090b" stroke="${secondaryColor}" stroke-width="8" />
                <rect x="282" y="185" width="236" height="390" rx="26" fill="url(#screenGrad)" />
                <linearGradient id="screenGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stop-color="${mainColor}" />
                    <stop offset="100%" stop-color="${secondaryColor}" />
                </linearGradient>
                <!-- Punch Hole Camera & Speaker Ear-piece -->
                <circle cx="400" cy="205" r="8" fill="#000000" stroke="#333333" stroke-width="2" />
                <rect x="370" y="180" width="60" height="4" rx="2" fill="#333333" />
                <text x="400" y="370" font-size="24" font-weight="900" fill="#ffffff" text-anchor="middle">${brand}</text>
                <text x="400" y="410" font-size="16" font-weight="bold" fill="${accentColor}" text-anchor="middle">120Hz AMOLED</text>
            `;
        } else if (angle === "back") {
            viewGraphic = `
                <!-- Phone Back Panel (Matching Color, Camera Island, Logo) -->
                <rect x="270" y="170" width="260" height="420" rx="36" fill="${mainColor}" stroke="${secondaryColor}" stroke-width="8" />
                <!-- Camera Island Bump -->
                <rect x="295" y="195" width="100" height="130" rx="20" fill="${secondaryColor}" stroke="#ffffff" stroke-width="2" />
                <circle cx="345" cy="235" r="22" fill="#000000" stroke="#666666" stroke-width="4" />
                <circle cx="345" cy="235" r="10" fill="#1e293b" />
                <circle cx="345" cy="290" r="18" fill="#000000" stroke="#666666" stroke-width="4" />
                <circle cx="380" cy="235" r="8" fill="#fef08a" /> <!-- LED Flash -->
                <!-- Rear Brand Emblem -->
                <text x="400" y="520" font-size="20" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="3">${brand.toUpperCase()}</text>
            `;
        } else if (angle === "side") {
            viewGraphic = `
                <!-- Phone Ultra-Slim Side Edge -->
                <rect x="385" y="170" width="30" height="420" rx="15" fill="${secondaryColor}" stroke="#ffffff" stroke-width="3" />
                <!-- Power & Volume Buttons -->
                <rect x="414" y="240" width="6" height="60" rx="3" fill="${accentColor}" />
                <rect x="414" y="320" width="6" height="35" rx="3" fill="${accentColor}" />
                <!-- Camera Protrusion Profile -->
                <rect x="375" y="195" width="10" height="130" rx="4" fill="#000000" />
                <text x="400" y="420" font-size="14" font-weight="bold" fill="#ffffff" text-anchor="middle" transform="rotate(-90 400 420)">${brand} SLIM PROFILE</text>
            `;
        } else {
            // Camera Module & Metallic Edge Macro Perspective
            viewGraphic = `
                <!-- Camera Lens Macro Close-up -->
                <rect x="220" y="200" width="360" height="340" rx="20" fill="${mainColor}" stroke="${secondaryColor}" stroke-width="10" />
                <circle cx="400" cy="370" r="120" fill="${secondaryColor}" stroke="#ffffff" stroke-width="8" />
                <circle cx="400" cy="370" r="90" fill="#000000" stroke="#444444" stroke-width="6" />
                <circle cx="400" cy="370" r="50" fill="#0f172a" stroke="#3b82f6" stroke-width="4" />
                <!-- Aperture Reflection -->
                <path d="M 370 340 A 40 40 0 0 1 430 350" fill="none" stroke="#ffffff" stroke-width="8" stroke-linecap="round" opacity="0.7" />
                <text x="400" y="500" font-size="16" font-weight="900" fill="#ffffff" text-anchor="middle">OIS SENSOR MACRO</text>
            `;
        }
    } else if (category === "Earphones") {
        if (angle === "front") {
            viewGraphic = `
                <!-- Earbuds Front View -->
                <circle cx="340" cy="320" r="50" fill="${mainColor}" stroke="${secondaryColor}" stroke-width="6" />
                <rect x="325" y="350" width="30" height="120" rx="15" fill="${secondaryColor}" />
                <circle cx="460" cy="320" r="50" fill="${mainColor}" stroke="${secondaryColor}" stroke-width="6" />
                <rect x="445" y="350" width="30" height="120" rx="15" fill="${secondaryColor}" />
                <!-- Touch Control & Silicone Tips -->
                <circle cx="340" cy="320" r="20" fill="${accentColor}" />
                <circle cx="460" cy="320" r="20" fill="${accentColor}" />
                <text x="400" y="520" font-size="22" font-weight="900" fill="${secondaryColor}" text-anchor="middle">${brand} TWS</text>
            `;
        } else if (angle === "back") {
            viewGraphic = `
                <!-- Earbuds Back View (Charging Contacts & Mic) -->
                <circle cx="340" cy="320" r="50" fill="${secondaryColor}" stroke="${mainColor}" stroke-width="6" />
                <rect x="325" y="350" width="30" height="120" rx="15" fill="${mainColor}" />
                <circle cx="460" cy="320" r="50" fill="${secondaryColor}" stroke="${mainColor}" stroke-width="6" />
                <rect x="445" y="350" width="30" height="120" rx="15" fill="${mainColor}" />
                <!-- Gold Charging Pins -->
                <circle cx="340" cy="450" r="4" fill="#f59e0b" />
                <circle cx="340" cy="460" r="4" fill="#f59e0b" />
                <circle cx="460" cy="450" r="4" fill="#f59e0b" />
                <circle cx="460" cy="460" r="4" fill="#f59e0b" />
                <text x="400" y="240" font-size="16" font-weight="bold" fill="${mainColor}" text-anchor="middle">CHARGING CONTACTS</text>
            `;
        } else if (angle === "side") {
            viewGraphic = `
                <!-- Open Charging Case Dock View -->
                <rect x="280" y="260" width="240" height="240" rx="40" fill="${mainColor}" stroke="${secondaryColor}" stroke-width="8" />
                <path d="M 280 340 L 520 340" stroke="${secondaryColor}" stroke-width="6" />
                <!-- Inner Docking Slots & LED -->
                <circle cx="350" cy="300" r="30" fill="${secondaryColor}" />
                <circle cx="450" cy="300" r="30" fill="${secondaryColor}" />
                <circle cx="400" cy="440" r="6" fill="#22c55e" />
                <text x="400" y="400" font-size="18" font-weight="900" fill="#ffffff" text-anchor="middle">${brand}</text>
            `;
        } else {
            // Driver Mesh Macro Zoom
            viewGraphic = `
                <!-- Driver Mesh Zoom View -->
                <rect x="220" y="200" width="360" height="340" rx="20" fill="${mainColor}" stroke="${secondaryColor}" stroke-width="10" />
                <circle cx="400" cy="370" r="110" fill="${secondaryColor}" stroke="${accentColor}" stroke-width="8" />
                <!-- Mesh Grid -->
                <pattern id="dotGrid" width="12" height="12" patternUnits="userSpaceOnUse">
                    <circle cx="6" cy="6" r="3" fill="${accentColor}" />
                </pattern>
                <circle cx="400" cy="370" r="90" fill="url(#dotGrid)" />
                <text x="400" y="510" font-size="16" font-weight="bold" fill="#ffffff" text-anchor="middle">ACOUSTIC DRIVER MESH</text>
            `;
        }
    } else if (category === "Laptops") {
        if (angle === "front") {
            viewGraphic = `
                <!-- Laptop Open Front Display View -->
                <rect x="220" y="180" width="360" height="240" rx="12" fill="#0f172a" stroke="${secondaryColor}" stroke-width="6" />
                <rect x="235" y="195" width="330" height="210" rx="6" fill="${mainColor}" />
                <circle cx="400" cy="188" r="4" fill="#ffffff" />
                <text x="400" y="300" font-size="26" font-weight="900" fill="#ffffff" text-anchor="middle">${brand}</text>
                <!-- Base Deck -->
                <path d="M 180 430 L 620 430 L 650 490 L 150 490 Z" fill="${secondaryColor}" stroke="#ffffff" stroke-width="3" />
                <rect x="340" y="440" width="120" height="35" rx="4" fill="${mainColor}" />
            `;
        } else if (angle === "back") {
            viewGraphic = `
                <!-- Laptop Top Lid Back View (Sleek Cover & Emblem) -->
                <rect x="220" y="190" width="360" height="270" rx="16" fill="${mainColor}" stroke="${secondaryColor}" stroke-width="8" />
                <circle cx="400" cy="325" r="50" fill="${secondaryColor}" stroke="${accentColor}" stroke-width="4" />
                <text x="400" y="334" font-size="22" font-weight="900" fill="#ffffff" text-anchor="middle">${brand[0]}</text>
                <text x="400" y="410" font-size="16" font-weight="bold" fill="${accentColor}" text-anchor="middle">${brand.toUpperCase()}</text>
            `;
        } else if (angle === "side") {
            viewGraphic = `
                <!-- Laptop Open Side Profile View -->
                <path d="M 450 180 L 470 410 L 180 430 L 170 445 L 610 445 L 480 180 Z" fill="${mainColor}" stroke="${secondaryColor}" stroke-width="6" />
                <circle cx="210" cy="438" r="4" fill="${accentColor}" />
                <rect x="230" y="434" width="20" height="8" rx="2" fill="#ffffff" />
                <text x="400" y="320" font-size="16" font-weight="bold" fill="#ffffff" text-anchor="middle" transform="rotate(-65 400 320)">SLIM SIDE PROFILE</text>
            `;
        } else {
            // Keyboard Deck Top-Down View
            viewGraphic = `
                <!-- Keyboard Deck Top-Down View -->
                <rect x="220" y="200" width="360" height="340" rx="16" fill="${secondaryColor}" stroke="#ffffff" stroke-width="6" />
                <!-- Key Grid -->
                <rect x="240" y="220" width="320" height="180" rx="8" fill="${mainColor}" stroke="#475569" stroke-width="4" />
                <text x="400" y="310" font-size="18" font-weight="bold" fill="#ffffff" text-anchor="middle">PRECISION KEYBOARD</text>
                <!-- Trackpad -->
                <rect x="330" y="420" width="140" height="90" rx="6" fill="#334155" stroke="${accentColor}" stroke-width="3" />
            `;
        }
    } else if (category === "Bags") {
        if (angle === "front") {
            viewGraphic = `
                <!-- Backpack Front View -->
                <path d="M 280 220 Q 400 160 520 220 L 540 520 L 260 520 Z" fill="${mainColor}" stroke="${secondaryColor}" stroke-width="8" />
                <!-- Front Zip Compartment & Brand Patch -->
                <rect x="300" y="340" width="200" height="150" rx="16" fill="${secondaryColor}" stroke="${accentColor}" stroke-width="4" />
                <rect x="350" y="240" width="100" height="35" rx="6" fill="${accentColor}" />
                <text x="400" y="263" font-size="14" font-weight="900" fill="${mainColor}" text-anchor="middle">${brand}</text>
                <text x="400" y="420" font-size="18" font-weight="bold" fill="#ffffff" text-anchor="middle">${text}</text>
            `;
        } else if (angle === "back") {
            viewGraphic = `
                <!-- Backpack Back View (Shoulder Straps & Mesh Padding) -->
                <path d="M 280 220 Q 400 160 520 220 L 540 520 L 260 520 Z" fill="${secondaryColor}" stroke="${mainColor}" stroke-width="8" />
                <!-- Dual Ergonomic Padded Straps -->
                <path d="M 320 210 Q 300 360 330 520" stroke="${mainColor}" stroke-width="28" stroke-linecap="round" fill="none" />
                <path d="M 480 210 Q 500 360 470 520" stroke="${mainColor}" stroke-width="28" stroke-linecap="round" fill="none" />
                <line x1="330" y1="360" x2="470" y2="360" stroke="${accentColor}" stroke-width="8" />
                <text x="400" y="440" font-size="16" font-weight="bold" fill="#ffffff" text-anchor="middle">AIRFLOW BACK PADDING</text>
            `;
        } else if (angle === "side") {
            viewGraphic = `
                <!-- Backpack Side Profile (Bottle Pocket & Compression Straps) -->
                <path d="M 330 220 Q 450 180 470 220 L 490 520 L 310 520 Z" fill="${mainColor}" stroke="${secondaryColor}" stroke-width="8" />
                <!-- Mesh Bottle Pocket -->
                <rect x="310" y="380" width="80" height="130" rx="10" fill="${secondaryColor}" stroke="${accentColor}" stroke-width="4" />
                <line x1="320" y1="300" x2="480" y2="300" stroke="${accentColor}" stroke-width="8" />
                <text x="400" y="440" font-size="14" font-weight="bold" fill="#ffffff" text-anchor="middle">SIDE BOTTLE POCKET</text>
            `;
        } else {
            // Zipper & Fabric Detail Macro View
            viewGraphic = `
                <!-- Zipper & Fabric Texture Close-up -->
                <rect x="220" y="200" width="360" height="340" rx="20" fill="${mainColor}" stroke="${secondaryColor}" stroke-width="10" />
                <line x1="400" y1="200" x2="400" y2="540" stroke="${secondaryColor}" stroke-width="36" />
                <!-- Zipper Teeth -->
                <line x1="400" y1="200" x2="400" y2="540" stroke="#ffffff" stroke-width="8" stroke-dasharray="12 10" />
                <!-- Heavy Pull Tab -->
                <rect x="375" y="320" width="50" height="90" rx="10" fill="${accentColor}" stroke="${secondaryColor}" stroke-width="4" />
                <text x="400" y="375" font-size="14" font-weight="900" fill="${mainColor}" text-anchor="middle">${brand[0]}</text>
                <text x="400" y="480" font-size="16" font-weight="bold" fill="#ffffff" text-anchor="middle">WATERPROOF FABRIC</text>
            `;
        }
    } else {
        // Grocery (86-100)
        if (angle === "front") {
            viewGraphic = `
                <!-- Grocery Pack Front View -->
                <rect x="260" y="190" width="280" height="400" rx="24" fill="${mainColor}" stroke="${secondaryColor}" stroke-width="8" />
                <rect x="280" y="230" width="240" height="140" rx="12" fill="#ffffff" />
                <text x="400" y="280" font-size="24" font-weight="900" fill="${secondaryColor}" text-anchor="middle">${brand}</text>
                <text x="400" y="320" font-size="16" font-weight="bold" fill="${mainColor}" text-anchor="middle">${text}</text>
                <!-- Green Veg / Quality Seal Badge -->
                <circle cx="480" cy="215" r="16" fill="#16a34a" />
                <rect x="472" y="207" width="16" height="16" fill="#ffffff" />
                <circle cx="480" cy="215" r="5" fill="#16a34a" />
            `;
        } else if (angle === "back") {
            viewGraphic = `
                <!-- Grocery Pack Back View (Nutrition Table & Barcode) -->
                <rect x="260" y="190" width="280" height="400" rx="24" fill="${mainColor}" stroke="${secondaryColor}" stroke-width="8" />
                <rect x="280" y="210" width="240" height="200" rx="8" fill="#ffffff" />
                <text x="400" y="235" font-size="14" font-weight="bold" fill="#000000" text-anchor="middle">NUTRITIONAL FACTS</text>
                <line x1="290" y1="250" x2="510" y2="250" stroke="#cccccc" stroke-width="2" />
                <line x1="290" y1="280" x2="510" y2="280" stroke="#cccccc" stroke-width="2" />
                <line x1="290" y1="310" x2="510" y2="310" stroke="#cccccc" stroke-width="2" />
                <!-- Barcode -->
                <rect x="330" y="440" width="140" height="50" fill="#ffffff" />
                <line x1="340" y1="440" x2="340" y2="490" stroke="#000000" stroke-width="4" />
                <line x1="350" y1="440" x2="350" y2="490" stroke="#000000" stroke-width="8" />
                <line x1="370" y1="440" x2="370" y2="490" stroke="#000000" stroke-width="6" />
                <line x1="390" y1="440" x2="390" y2="490" stroke="#000000" stroke-width="10" />
                <line x1="420" y1="440" x2="420" y2="490" stroke="#000000" stroke-width="4" />
                <line x1="440" y1="440" x2="440" y2="490" stroke="#000000" stroke-width="8" />
            `;
        } else if (angle === "side") {
            viewGraphic = `
                <!-- Grocery Pack Side Panel View -->
                <rect x="330" y="190" width="140" height="400" rx="16" fill="${secondaryColor}" stroke="#ffffff" stroke-width="4" />
                <text x="400" y="380" font-size="18" font-weight="bold" fill="#ffffff" text-anchor="middle" transform="rotate(-90 400 380)">${brand} NET WT. INFO</text>
            `;
        } else {
            // Quality Seal / Grain Macro Close-up View
            viewGraphic = `
                <!-- Quality Seal & Contents Window Close-up -->
                <rect x="220" y="200" width="360" height="340" rx="20" fill="${mainColor}" stroke="${secondaryColor}" stroke-width="10" />
                <circle cx="400" cy="370" r="100" fill="#ffffff" stroke="${accentColor}" stroke-width="8" />
                <text x="400" y="360" font-size="18" font-weight="900" fill="${secondaryColor}" text-anchor="middle">100% PURE</text>
                <text x="400" y="390" font-size="14" font-weight="bold" fill="${mainColor}" text-anchor="middle">GRADE A QUALITY</text>
            `;
        }
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f8fafc" />
      <stop offset="100%" stop-color="#e2e8f0" />
    </linearGradient>
    <filter id="dropShadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#0f172a" flood-opacity="0.15"/>
    </filter>
  </defs>

  <!-- Background Canvas Card -->
  <rect width="800" height="600" rx="24" fill="url(#bgGrad)"/>
  
  <!-- Outer Frame Boundary -->
  <rect x="20" y="20" width="760" height="560" rx="16" fill="none" stroke="#cbd5e1" stroke-width="2" stroke-dasharray="8 6"/>

  <!-- Angle View Tag Header Pill -->
  <g transform="translate(40, 40)">
    <rect x="0" y="0" width="220" height="42" rx="10" fill="${secondaryColor}"/>
    <text x="110" y="26" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="1.5">📷 ${angleTitle}</text>
  </g>

  <!-- Product Category Badge -->
  <g transform="translate(560, 40)">
    <rect x="0" y="0" width="200" height="42" rx="10" fill="#ffffff" stroke="${secondaryColor}" stroke-width="2"/>
    <text x="100" y="26" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="800" fill="${secondaryColor}" text-anchor="middle">${category.toUpperCase()}</text>
  </g>

  <!-- MAIN PRODUCT GRAPHIC (3D Rendered Perspective) -->
  <g filter="url(#dropShadow)">
    ${viewGraphic}
  </g>

  <!-- Footer Product Model Consistency Label -->
  <g transform="translate(40, 525)">
    <rect x="0" y="0" width="720" height="38" rx="8" fill="#ffffff" opacity="0.9" stroke="#cbd5e1" stroke-width="1.5"/>
    <text x="20" y="24" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="700" fill="#334155">Product #${blueprint.id}: ${name}</text>
    <text x="700" y="24" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="800" fill="${mainColor}" text-anchor="end">MATCHING MODEL VISUAL GUARANTEE ✓</text>
  </g>
</svg>`;
}

console.log("=================================================");
console.log("🎨 GENERATING 400 ANGLE-CONSISTENT PRODUCT SVG IMAGES");
console.log("=================================================\n");

let generatedCount = 0;
const angles = ["front", "back", "side", "detail"];

for (const blueprint of productBlueprints) {
    for (const angle of angles) {
        const svgContent = generateSVG(blueprint, angle);
        const filename = `prod_${blueprint.id}_${angle}.svg`;
        const filePath = path.join(outputDir, filename);
        fs.writeFileSync(filePath, svgContent, "utf8");
        generatedCount++;
    }
}

console.log(`🎉 Successfully generated ${generatedCount} multi-angle SVG images into client/public/images/products/\n`);
