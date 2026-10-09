import bcrypt from "bcrypt"

/**
 * Send SMS message to a phone number.
 * Reuses Twilio configuration if TWILIO_ACCOUNT_SID & TWILIO_AUTH_TOKEN are present in env,
 * otherwise logs the SMS message securely on the server console.
 */
export const sendSMS = async (phone, textMessage) => {
  try {
    const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER } = process.env

    if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && TWILIO_PHONE_NUMBER) {
      const twilioModule = await import("twilio")
      const client = twilioModule.default(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
      
      const res = await client.messages.create({
        body: textMessage,
        from: TWILIO_PHONE_NUMBER,
        to: phone.startsWith("+") ? phone : `+91${phone.replace(/\D/g, "")}`
      })
      console.log(`[TWILIO SMS SENT] SID: ${res.sid} to ${phone}`)
      return { success: true, sid: res.sid }
    } else {
      console.log(`\n==================================================`)
      console.log(`[SMS NOTIFICATION SENT]`)
      console.log(`To: ${phone}`)
      console.log(`Message: ${textMessage}`)
      console.log(`==================================================\n`)
      return { success: true, simulated: true }
    }
  } catch (error) {
    console.error("[SMS SERVICE ERROR]:", error.message)
    return { success: false, error: error.message }
  }
}

/**
 * Generate a 6-digit Delivery OTP and returns hashed OTP and plain OTP.
 * Plain OTP is sent to the customer via SMS / displayed in profile.
 * Hashed OTP is stored on the Order document in MongoDB.
 */
export const generateDeliveryOTP = async () => {
  // Generate random 6-digit numeric OTP
  const rawOtp = Math.floor(100000 + Math.random() * 900000).toString()
  const otpHash = await bcrypt.hash(rawOtp, 10)
  const otpExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // Valid for 24 hours until delivery

  return {
    rawOtp,
    otpHash,
    otpExpiresAt
  }
}

/**
 * Verify a customer Delivery OTP input against order's stored hashed OTP.
 */
export const verifyDeliveryOTP = async (inputOtp, order) => {
  if (!order || !order.otpHash) {
    return { valid: false, message: "No Delivery OTP generated for this order." }
  }

  if (order.otpVerified) {
    return { valid: false, message: "Delivery OTP has already been verified." }
  }

  if (order.otpAttempts >= 5) {
    return { valid: false, message: "Maximum OTP verification attempts exceeded. Please regenerate OTP." }
  }

  if (order.otpExpiresAt && new Date() > new Date(order.otpExpiresAt)) {
    return { valid: false, message: "Delivery OTP has expired. Please regenerate a new OTP." }
  }

  const isMatch = await bcrypt.compare(inputOtp.toString().trim(), order.otpHash)
  if (!isMatch) {
    return { valid: false, message: "Invalid Delivery OTP. Please double-check with the customer." }
  }

  return { valid: true }
}
