import {
  doLogin,
  driverStore,
  resetPasswordHelperDriver,
} from "../helper/driverHelper.js";
import { generateToken } from "../helper/tokenHelper.js";
import driverModel from "../model/driver.js";
import jwt from "jsonwebtoken";
import requestModel from "../model/request.js";
import { sendOtp } from "../helper/otp.js";
import cloudinary from "../cloudinary/cloudinary.js";
import bcrypt from "bcrypt";
import vehicleModel from "../model/vehicle.js";
import bookingModel from "../model/booking.js";


// ----------------------------------------------------------------Login-------------------------------------------------------------------//

export const login = async (req, res) => {
  const { email, password } = req.body.value;

  try {
    const requestDatabase = await requestModel.findOne({ email });
    if (!requestDatabase) {
      const driverDatabase = await driverModel.findOne({ email });
      if (!driverDatabase) {
        return res.status(404).json({ message: "Email does not exist" });
      }
      if (driverDatabase.block) {
        return res
          .status(404)
          .json({ message: "You are blocked by the admin" });
      }
      const driverData = await doLogin({ email, password }, driverDatabase);
      if (driverData) {
        const token = await generateToken(driverData);
        console.log(driverData);
        return res.status(200).json({ token, message: "Login successful!" });
      }
      return res.status(404).json({ message: "Incorrect password" });
    } else {
      if (
        requestDatabase.approve === false &&
        requestDatabase.decline === false
      ) {
        return res.status(200).json({ message: "Pending" });
      }
      if (requestDatabase.decline === true) {
        return res.status(200).json({ message: "Declined" });
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// --------------------------------------------------------------TOKEN VERIFY-------------------------------------------------------------------//

export const tokenVerify = async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  try {
    jwt.verify(token, process.env.TOKEN_SECRET);
    res.status(200).json({ message: "JWT Verified" });
  } catch (error) {
    console.log(error);
    res.status(404).json({ error });
  }
};

// ----------------------------------------------------------------OTP SEND-------------------------------------------------------------------//

let driver;
let license;

export const otp = async (req, res) => {
  driver = req.body.value;
  license = req.body.licenseData;
  const driverExist = await driverModel.findOne({ email: driver.email });
  const requestExist = await requestModel.findOne(
    { email: driver.email },
    { decline: false }
  );
  if (driverExist || requestExist) {
    res.status(404).json({ message: "Email Already Exist" });
  }
  try {
    await sendOtp(driver.email).then((OTP) => {
      process.env.OTP = OTP;
      res.status(200).json({ message: `Otp send to ${driver.email}` });
    });
  } catch (error) {
    res.status(500).json({ message: "Unable to send Otp" });
  }
};

export const otpVerify = async (req, res) => {
  let driverOTP = req.body.otp;
  let OTP = process.env.OTP;
  if (driverOTP === OTP) {
    await cloudinary.uploader.upload(license).then((result, err) => {
      if (err) {
        console.log("error uploading");
        console.log(err);
        res
          .status(404)
          .json({ message: "An error occured on uploading license" });
      } else {
        license = result.secure_url;
      }
    });
    driverStore({ driver, license }).then((response) => {
      if (response) {
        res.status(200).json({ message: "Successfully registered" });
      } else {
        res.status(404).json({ message: "An error occured" });
      }
    });
  } else {
    res.status(401).json({ message: "Incorrect Otp" });
  }
};

// -------------------------------------------------------------------Forgot Password----------------------------------------------------------------//

export const forgotPasswordOtp = async (req, res) => {
  driver = req.body.value;
  console.log(driver.email);
  const emailVerfied = await driverModel.findOne({ email: driver.email });
  if (emailVerfied) {
    sendOtp(driver.email)
      .then((OTP) => {
        process.env.OTP = OTP;
        res.status(200).json({ message: `Otp resend to ${driver.email}` });
      })
      .catch(() => {
        res.status(500).json({ message: "Internal server error" });
      });
  } else {
    res.status(404).json({ message: "Email Doesnot Exist" });
  }
};

// ----------------------------------------------------------------------Forgot password Otp verification------------------------------------------------//

export const forgotPasswordOtpVerify = async (req, res) => {
  const driverOTP = req.body.otp;
  if (driverOTP === process.env.OTP) {
    res.status(200).json({ message: "Otp Verified Successfully" });
  } else {
    res.status(404).json({ message: "Incorrect Otp" });
  }
};

// ----------------------------------------------------------------------Reset Password-------------------------------------------------------------//

export const resetPassword = async (req, res) => {
  const newPassword = req.body.value.password;
  const driverEmail = driver.email;
  const driverDetails = await driverModel.findOne({ email: driverEmail });
  const passwordMatch = await bcrypt.compare(
    newPassword,
    driverDetails.password
  );

  if (passwordMatch) {
    res
      .status(404)
      .json({ message: "This is Your Previous Password Set a new Password" });
  } else {
    resetPasswordHelperDriver(driverEmail, newPassword).then((response) => {
      if (response) {
        res.status(200).json({ message: "Password Changed Successfully" });
      } else {
        res.status(404).json({ message: "Unable to Change the password" });
      }
    });
  }
};

// ---------------------------------------------------------------------Resend Otp--------------------------------------------------------------//

export const resendOtp = async (req, res) => {
  sendOtp(driver.email)
    .then((OTP) => {
      process.env.OTP = OTP;
      res.status(200).json({ message: `Otp resend to ${driver.email}` });
    })
    .catch(() => {
      res.status(500).json({ message: "We are sorry internal server error" });
    });
};

// ---------------------------------------------------------------------GET  VEHICLES--------------------------------------------------------------//

export const getVehicleData = async (req, res) => {
  try {
    const vehicles = await vehicleModel.find({ block: false });
    res.status(200).json({ vehicles });
  } catch (error) {
    res.status(404).json({ message: "Error fetching cab-data" });
  }
};

export const getDriverId = async (req, res) => {
  const token = req.body.token;
  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, async (error, result) => {
      if (error) {
        console.log(error);
      }
      if (result) {
        const driverId = result.driverId;
        res.status(200).json({ driverId });
      }
    });
  }
};

export const getDriverDetails = async (req, res) => {
  const token = req.body.token;
  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, async (error, result) => {
      if (error) {
        console.log(error);
      }
      if (result) {
        const driverId = result.driverId;
        const driverDetails = await driverModel.findOne({ _id: driverId });
        res.status(200).json({ driverDetails });
      }
    });
  }
};

export const tripHistory = async (req, res) => {
  try {
    const driverId = req.body.driverId;
    const tripHistory = await bookingModel.find({
      status: "completed",
      driverId: driverId,
    });
    res.status(200).json({ tripHistory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "internal server error" });
  }
};
