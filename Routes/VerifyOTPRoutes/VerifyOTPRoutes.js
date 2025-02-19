import express from "express";
import { requestOtp, validateOtp, resendOtp } from "../../Controllers/VerifyOTPControllers/VerifyOTPControllers.js"; // Corrected relative path

const router = express.Router();

// Route for requesting OTP
router.post("/request-otp", requestOtp);

// Route for validating OTP
router.post("/validate-otp", validateOtp);

// Route for resending OTP
router.post("/resend-otp", resendOtp);

export default router;
