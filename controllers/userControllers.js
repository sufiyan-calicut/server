import { sendOtp } from "../helper/otp.js";
import { generateToken } from "../helper/tokenHelper.js";
import {
  doLogin,
  userStore,
  resetPasswordHelper,
} from "../helper/userHelper.js";
import userModel from "../model/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import vehicleModel from "../model/vehicle.js";
import driverModel from "../model/driver.js";
import bookingModel from "../model/booking.js";

let user;

// ------------------------------------------------------------------LOGIN-----------------------------------------------------------------//

export const login = async (req, res) => {
  const user = req.body.value;
  const userDatabase = await userModel.findOne({ email: user.email });
  if (!userDatabase) {
    res.status(404).json({ message: "Invalid Email" });
  } else {
    if (userDatabase.block) {
      res.status(404).json({ message: "You are blocked by the Admin" });
    } else {
      doLogin(user, userDatabase).then((response) => {
        if (response) {
          const userData = response;
          generateToken(userData).then((token) => {
            res.status(200).json({ token, message: "Login successful!" });
          });
        } else {
          res.status(404).json({ message: "Incorrect Password" });
        }
      });
    }
  }
};

// ------------------------------------------------------------------------Token Verification-----------------------------------------------------------//

export const tokenVerify = async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  try {
    const jwtVerify = jwt.verify(token, process.env.TOKEN_SECRET);
    const user = await userModel.findOne({ _id: jwtVerify.userId });
    if (user.block == false) {
      res.status(200).json({ message: "JWT Verified" });
    } else {
      res.status(404).json({ message: "userBlocked" });
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({ error });
  }
};

// ----------------------------------------------------------------OTP-------------------------------------------------------------------//

export const otp = async (req, res) => {
  user = req.body.value;
  const userExist = await userModel.findOne({ email: user.email });
  if (!userExist) {
    try {
      const OTP = await sendOtp(user.email);
      process.env.OTP = OTP;
      res.status(200).json({ message: `Otp send to ${user.email}` });
    } catch (error) {
      res.status(404).json({ message: "Failed to send OTP" });
    }
  } else {
    res.status(404).json({ message: "Email already exists" });
  }
};

// ------------------------------------------------------------OTP verification--------------------------------------------------------------------//
export const otpVerify = async (req, res) => {
  let userOTP = req.body.otp;
  let OTP = process.env.OTP;

  if (userOTP === OTP) {
    userStore(user).then((response) => {
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

// ---------------------------------------------------------------------Resend Otp--------------------------------------------------------------//

export const resendOtp = async (req, res) => {
  sendOtp(user.email)
    .then((OTP) => {
      process.env.OTP = OTP;
      res.status(200).json({ message: `Otp resend to ${user.email}` });
    })
    .catch(() => {
      res.status(500).json({ message: "We are sorry internal server error" });
    });
};

// -------------------------------------------------------------------Forgot Password----------------------------------------------------------------//

export const forgotPasswordOtp = async (req, res) => {
  user = req.body.value;
  console.log(user.email);
  const emailVerfied = await userModel.findOne({ email: user.email });
  if (emailVerfied) {
    sendOtp(user.email)
      .then((OTP) => {
        process.env.OTP = OTP;
        res.status(200).json({ message: `Otp resend to ${user.email}` });
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
  const userOTP = req.body.otp;
  if (userOTP === process.env.OTP) {
    res.status(200).json({ message: "Otp Verified Successfully" });
  } else {
    res.status(404).json({ message: "Incorrect Otp" });
  }
};

// ----------------------------------------------------------------------Reset Password-------------------------------------------------------------//

export const resetPassword = async (req, res) => {
  const newPassword = req.body.value.password;
  const userEmail = user.email;
  const userDetails = await userModel.findOne({ email: userEmail });
  const passwordMatch = await bcrypt.compare(newPassword, userDetails.password);

  if (passwordMatch) {
    res
      .status(404)
      .json({ message: "This is Your Previous Password Set a new Password" });
  } else {
    resetPasswordHelper(userEmail, newPassword).then((response) => {
      if (response) {
        res.status(200).json({ message: "Password Changed Successfully" });
      } else {
        res.status(404).json({ message: "Unable to Change the password" });
      }
    });
  }
};

export const getVehicleList = async (req, res) => {
  try {
    const carList = await vehicleModel.find({ block: false });
    res.status(200).json({ carList });
  } catch (error) {
    res.status(404).json({ message: "Unable to find vehiclelist" });
  }
};

export const getDriverList = async (req, res) => {
  try {
    const drivers = await driverModel.find(
      { block: false },
      { _id: 1, latitude: 1, longitude: 1, vehicle: 1 }
    );
    console.log(drivers)
    const driverList = drivers.map((driver) => [
      driver._id.toString(),
      driver.longitude,
      driver.latitude,
      driver.vehicle,
    ]);
    res.status(200).json({ driverList });
  } catch (error) {
    res.status(404).json({ message: "Unable to find driverlist" });
  }
};

export const initializeRazorpay = async (req, res) => {
  try {
    const order = req.body.amount;
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_ID,
      key_secret: process.env.KEY_SECRETE,
    });
    var options = {
      amount: order * 100,
      currency: "INR",
    };
    instance.orders.create(options, function (err, order) {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
      }
      res.status(200).json({ order: order });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "internal server error" });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { response } = req.body;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      response;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.KEY_SECRETE)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (razorpay_signature === expectedSignature) {
      const id = req.body.data.notificationId;
      await bookingModel.findByIdAndUpdate(id, {
        $set: { status: "completed", payment: "online" },
      });

      res.status(200).json({ message: "payment success" });
    } else {
      res.status(401).json({ message: "payment failed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "internal server error" });
  }
};

export const rating = async (req, res) => {
  const { rating, description, notificationId } = req.body;

  try {
    console.log(rating, typeof rating, description, typeof description);
    const updatedBooking = await bookingModel.findByIdAndUpdate(
      { _id: notificationId }, // Use the notificationId to find the specific booking
      { $set: { rating: rating, description: description } } // Set the rating and description fields
    );
    console.log(updatedBooking, "this is updated data");
    res.status(200).json(updatedBooking);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to update rating and description" });
  }
};

export const getUserData = async (req, res) => {
  const token = req.body.token;
  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, async (error, result) => {
      if (error) {
        console.log(error);
      }
      if (result) {
        const userId = result.userId;
        const userDetails = await userModel.findOne({ _id: userId });
        res.status(200).json({ userDetails });
      }
    });
  }
};

export const tripHistory = async (req, res) => {
  try {
    const userId = req.body.userId;
    const tripHistory = await bookingModel.find({
      status: "completed",
      userId: userId,
    });
    res.status(200).json({ tripHistory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "internal server error" });
  }
};