import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Product from "./src/models/productSchema.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

const MONGO_URL = process.env.MONGO_URL;

async function verifyCatalog() {
    console.log("=================================================");
    console.log("🔍 RUNNING COMPREHENSIVE MONGODB CATALOG VALIDATION");
    console.log("=================================================\n");

    try {
        await mongoose.connect(MONGO_URL);
        console.log("✅ Database Connected.");

        // 1. Total Product Count
        const count = await Product.countDocuments();
        console.log(`📌 TOTAL PRODUCTS COUNT: ${count}`);
        if (count !== 100) {
            console.error(`❌ FAILURE: Expected 100 products, found ${count}!`);
            process.exit(1);
        } else {
            console.log("✅ PASSED: Count is EXACTLY 100.\n");
        }

        // 2. Category Distribution
        const categories = ["Clothes", "Shoes", "Mobiles", "Earphones", "Laptops", "Bags", "Grocery"];
        const expectedCounts = {
            "Clothes": 20,
            "Shoes": 15,
            "Mobiles": 15,
            "Earphones": 10,
            "Laptops": 10,
            "Bags": 15,
            "Grocery": 15
        };

        let categoryPassed = true;
        console.log("📊 AUDITING CATEGORY DISTRIBUTION:");
        for (const cat of categories) {
            const catCount = await Product.countDocuments({ category: cat });
            const expected = expectedCounts[cat];
            const status = catCount === expected ? "✅ MATCH" : "❌ MISMATCH";
            console.log(`  - ${cat.padEnd(12)}: Found ${catCount} (Expected ${expected}) -> ${status}`);
            if (catCount !== expected) categoryPassed = false;
        }

        if (!categoryPassed) {
            console.error("\n❌ FAILURE: Category breakdown did not match target distribution!");
            process.exit(1);
        }
        console.log("✅ PASSED: All category distributions match target exact numbers.\n");

        // 3. Image Count & Quality Verification
        const allProducts = await Product.find({});
        let imageErrors = 0;
        let priceErrors = 0;
        let ratingErrors = 0;
        let sellerErrors = 0;

        allProducts.forEach((p, idx) => {
            // Check images
            const imgs = p.image || p.images || [];
            if (!Array.isArray(imgs) || imgs.length < 4) {
                console.error(`❌ Image error on "${p.name}": contains ${imgs.length} images (min 4 required)`);
                imageErrors++;
            }

            // Check price & discountPrice
            if (p.price <= 0) {
                console.error(`❌ Price error on "${p.name}": price = ${p.price}`);
                priceErrors++;
            }
            if (p.discountPrice && p.discountPrice > p.price) {
                console.error(`❌ Discount error on "${p.name}": discountPrice (${p.discountPrice}) > price (${p.price})`);
                priceErrors++;
            }

            // Check rating
            const rating = p.rating || p.averageRating;
            if (rating < 0 || rating > 5) {
                console.error(`❌ Rating error on "${p.name}": rating = ${rating}`);
                ratingErrors++;
            }

            // Check seller reference
            if (!p.seller || !mongoose.Types.ObjectId.isValid(p.seller)) {
                console.error(`❌ Seller error on "${p.name}": invalid seller ObjectId ${p.seller}`);
                sellerErrors++;
            }
        });

        console.log("📊 DETAILED AUDIT SUMMARY:");
        console.log(`  - 4-Image Guarantee Errors : ${imageErrors}`);
        console.log(`  - Price & Discount Errors  : ${priceErrors}`);
        console.error(`  - Rating Range Errors      : ${ratingErrors}`);
        console.log(`  - Seller ObjectId Errors   : ${sellerErrors}`);

        if (imageErrors > 0 || priceErrors > 0 || ratingErrors > 0 || sellerErrors > 0) {
            console.error("\n❌ VALIDATION FAILED WITH ERRORS!");
            process.exit(1);
        }

        console.log("\n=================================================");
        console.log("🎉 ALL VALIDATION CHECKS PASSED PERFECTLY!");
        console.log("=================================================\n");

        process.exit(0);
    } catch (err) {
        console.error("❌ VALIDATION EXCEPTION:", err);
        process.exit(1);
    }
}

verifyCatalog();
