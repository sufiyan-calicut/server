import express from "express";
import { forgotPasswordOtp, forgotPasswordOtpVerify, getDriverList, getUserData, getVehicleList, initializeRazorpay, login, otp, otpVerify, rating, resendOtp, resetPassword, tokenVerify, tripHistory, verifyPayment } from "../controllers/userControllers.js";
const router = express.Router();

router.post('/login', login );
router.post('/otp', otp);
router.post('/otpVerify', otpVerify);
router.post('/forgotPasswordOtp',forgotPasswordOtp);
router.post('/forgotPasswordOtpVerify', forgotPasswordOtpVerify);
router.post('/resetPassword', resetPassword);
router.post('/initializePayment',initializeRazorpay)
router.post('/verifyPayment',verifyPayment)
router.post('/rating',rating)
router.post('/getUserData',getUserData)
router.post('/tripHistory',tripHistory)

router.get("/tokenVerify", tokenVerify)
router.get("/resendOtp", resendOtp)
router.get("/getVehicleList", getVehicleList)
router.get("/getDriverList", getDriverList)

export default router;