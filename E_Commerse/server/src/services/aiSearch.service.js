import { ai, getGeminiModel } from "../../ai/llm.config.js";

// Stopwords in English & Hinglish to remove in fallback mode
const HINGLISH_STOPWORDS = new Set([
    "dhundho", "dhundo", "find", "karo", "chahiye", "search", "show", "me", "dikhao",
    "bring", "get", "mangwao", "mangwa", "mangalwao", "a", "an", "the", "and", "or",
    "in", "for", "with", "please", "karna", "ke", "liye", "do", "de", "dona", "mujhe",
    "bhi", "aur", "ya", "par", "ko", "se", "hai", "hain", "sare", "sari", "sab", "all"
]);

/**
 * Fallback tokenizer for when LLM API key is absent or request fails.
 */
function fallbackParseIntent(query) {
    const rawTokens = query
        .toLowerCase()
        .replace(/[^\w\s]/gi, " ")
        .split(/\s+/)
        .filter(Boolean);

    const keywords = [];
    let maxPrice = null;
    let minPrice = null;

    for (let i = 0; i < rawTokens.length; i++) {
        const token = rawTokens[i];

        // Check for price cues like "under 500" or "below 1000"
        if ((token === "under" || token === "below" || token === "less") && i + 1 < rawTokens.length) {
            const nextNum = parseInt(rawTokens[i + 1], 10);
            if (!isNaN(nextNum)) {
                maxPrice = nextNum;
                i++; // skip next token
                continue;
            }
        }
        if ((token === "above" || token === "over" || token === "more") && i + 1 < rawTokens.length) {
            const nextNum = parseInt(rawTokens[i + 1], 10);
            if (!isNaN(nextNum)) {
                minPrice = nextNum;
                i++; // skip next token
                continue;
            }
        }

        if (!HINGLISH_STOPWORDS.has(token) && isNaN(token)) {
            keywords.push(token);
        }
    }

    const uniqueKeywords = [...new Set(keywords)];
    const intentSummary = uniqueKeywords.length > 0
        ? `Searching for: ${uniqueKeywords.join(", ")}`
        : `Search query: "${query}"`;

    return {
        keywords: uniqueKeywords,
        categories: [],
        brands: [],
        minPrice,
        maxPrice,
        intentSummary,
        isAIPowered: false
    };
}

/**
 * Parses user natural language query using LLM (Gemini API) with fallbacks.
 * Handles queries like "Shoe dhundho, shoe and book find karo", "cheap red sneakers for men", etc.
 */
export async function parseSearchIntent(userQuery) {
    if (!userQuery || typeof userQuery !== "string" || !userQuery.trim()) {
        return {
            keywords: [],
            categories: [],
            brands: [],
            minPrice: null,
            maxPrice: null,
            intentSummary: "Empty query",
            isAIPowered: false
        };
    }

    const trimmedQuery = userQuery.trim();

    if (!ai) {
        console.log("ℹ️ Gemini API key not set. Using smart fallback tokenizer.");
        return fallbackParseIntent(trimmedQuery);
    }

    try {
        const prompt = `
You are an e-commerce semantic search intent parser.
Analyze this user search query (which may be in English, Hinglish, Hindi in Latin script, or mixed language):
"${trimmedQuery}"

Extract search intent into strict JSON format with the following exact keys:
{
  "keywords": ["array", "of", "core", "product", "search", "terms"],
  "categories": ["array", "of", "target", "product", "categories"],
  "brands": ["array", "of", "brand", "names", "if", "mentioned"],
  "minPrice": number_or_null,
  "maxPrice": number_or_null,
  "intentSummary": "Short friendly user summary, e.g., 'Looking for shoes and books'"
}

Rules:
1. Strip out conversational filler and action verbs in any language (such as 'dhundho', 'find', 'karo', 'chahiye', 'dikhao', 'search', 'show me', 'please').
2. If multiple items are requested (e.g., 'shoe and book find karo'), extract all relevant item names into keywords (e.g. ["shoe", "book"]).
3. Infer categories if obvious (e.g., "shoes" -> "Footwear"/"Shoes", "laptop" -> "Electronics").
4. Output raw JSON ONLY. Do NOT add markdown code block wrappers or extra text.
`;

        const response = await ai.models.generateContent({
            model: getGeminiModel(),
            contents: prompt,
        });

        let responseText = response.text || "";
        
        // Clean JSON formatting wrappers if present
        responseText = responseText.replace(/```json/gi, "").replace(/```/g, "").trim();

        const parsed = JSON.parse(responseText);

        return {
            keywords: Array.isArray(parsed.keywords) ? parsed.keywords.map(k => k.toLowerCase().trim()) : [],
            categories: Array.isArray(parsed.categories) ? parsed.categories : [],
            brands: Array.isArray(parsed.brands) ? parsed.brands : [],
            minPrice: typeof parsed.minPrice === "number" ? parsed.minPrice : null,
            maxPrice: typeof parsed.maxPrice === "number" ? parsed.maxPrice : null,
            intentSummary: parsed.intentSummary || `Results for "${trimmedQuery}"`,
            isAIPowered: true
        };
    } catch (err) {
        console.error("⚠️ AI Search Intent parsing error (falling back to tokenizer):", err.message);
        return fallbackParseIntent(trimmedQuery);
    }
}
