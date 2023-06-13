import express from "express";
import { forgotPasswordOtp, forgotPasswordOtpVerify, getDriverDetails, getDriverId, getVehicleData, login, otp, otpVerify, resendOtp, resetPassword, tokenVerify, tripHistory } from "../controllers/driverControllers.js";
const router = express.Router();

router.post('/login', login);
router.post('/otp', otp);
router.post('/otpVerify', otpVerify);
router.post('/forgotPasswordOtp',forgotPasswordOtp);
router.post('/forgotPasswordOtpVerify', forgotPasswordOtpVerify);
router.post('/resetPassword', resetPassword)
router.post('/getDriverId', getDriverId)
router.post('/getDriverDetails',getDriverDetails)
router.post('/tripHistory',tripHistory)


router.get('/verifyToken', tokenVerify);
router.get("/resendOtp", resendOtp);
router.get('/getVehicleData',getVehicleData)


export default router;