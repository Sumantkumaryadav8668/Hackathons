// Centralized Payment & PhonePe QR Configuration for DigitalMart / MiniShop
export const PAYMENT_CONFIG = {
    // Official PhonePe QR Image path (located in client/public/payment-assets/phonepe-qr.png)
    phonePeQrImage: "/payment-assets/phonepe-qr.png",
    
    // UI Display Headings & Subtitles
    headerTitle: "Scan & Pay Using PhonePe",
    headerSubtitle: "Scan the official PhonePe QR code using PhonePe App or any UPI App",
    
    // Payee & Merchant Information
    payeeName: "SUMANT KUMAR YADAV",
    merchantName: "DigitalMart Store",
    upiId: "sumantkumar@upi",

    // Supported UPI Apps
    supportedApps: [
        { name: "PhonePe", icon: "🟣", primary: true },
        { name: "Google Pay", icon: "🔵" },
        { name: "Paytm", icon: "🔷" },
        { name: "BHIM UPI", icon: "🇮🇳" },
        { name: "Any UPI App", icon: "📱" }
    ]
}

export default PAYMENT_CONFIG
