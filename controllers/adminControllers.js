import { doLogin } from "../helper/adminHelper.js";
import { generateToken } from "../helper/tokenHelper.js";
import adminModel from "../model/admin.js";
import jwt from "jsonwebtoken";
import userModel from "../model/user.js";
import driverModel from "../model/driver.js";
import requestModel from "../model/request.js";
import { approveMail, declineMail } from "../helper/requestHelper.js";
import vehicleModel from "../model/vehicle.js";
import cloudinary from "../cloudinary/cloudinary.js";

// ------------------------------------------------------------------LOGIN-----------------------------------------------------------------//

export const login = async (req, res) => {
  const admin = req.body.value;
  const adminDetails = await adminModel.findOne({ email: admin.email });
  if (!adminDetails) {
    return res.status(404).json({ message: "Email not found" });
  }
  try {
    const adminData = await doLogin(admin, adminDetails);
    if (adminData) {
      const token = await generateToken(adminData);
      res.status(200).json({ token, message: "Login successful!" });
    } else {
      res.status(404).json({ message: "Incorrect Password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// ----------------------------------------------------------------VERIFY TOKEN-------------------------------------------------------------------//

export const tokenVerify = async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  try {
    jwt.verify(token, process.env.TOKEN_SECRET);
    res.status(200).json({ message: "JWT Verified" });
  } catch (error) {
    res.status(404).json({ error });
  }
};

// ----------------------------------------------------------------GET USER-------------------------------------------------------------------//

export const getUsers = async (req, res) => {
  try {
    const users = await userModel.find();
    res.status(200).json({ users });
  } catch (error) {
    console.log(error);
  }
};

// ----------------------------------------------------------------BLOCK USER-------------------------------------------------------------------//

export const blockUser = async (req, res) => {
  const userId = req.body.userId;
  try {
    await userModel.updateOne({ _id: userId }, { $set: { block: true } });
    res.status(200).json({ message: "User Blocked Successfully" });
  } catch (error) {
    res.status(404).json({ message: "Unable to Block the User" });
  }
};

// ----------------------------------------------------------------UNBLOCK USER-------------------------------------------------------------------//

export const unBlockUser = async (req, res) => {
  const userId = req.body.userId;
  try {
    await userModel.updateOne({ _id: userId }, { $set: { block: false } });
    res.status(200).json({ message: "User unBlocked Successfully" });
  } catch (error) {
    res.status(404).json({ message: "Unable to unBlock the User" });
  }
};

// ----------------------------------------------------------------GET DRIVER-------------------------------------------------------------------//

export const getDrivers = async (req, res) => {
  try {
    const drivers = await driverModel.find();
    res.status(200).json({ drivers });
  } catch (error) {
    console.log(error);
  }
};

// ----------------------------------------------------------------BLOCK DRIVER-------------------------------------------------------------------//

export const blockDriver = async (req, res) => {
  const driverId = req.body.driverId;
  try {
    await driverModel.updateOne({ _id: driverId }, { $set: { block: true } });
    res.status(200).json({ message: "Driver Blocked Successfully" });
  } catch (error) {
    res.status(404).json({ message: "Unable to Block the Driver" });
  }
};

// ----------------------------------------------------------------UNBLOCK DRIVER-------------------------------------------------------------------//

export const unBlockDriver = async (req, res) => {
  const driverId = req.body.driverId;
  try {
    await driverModel.updateOne({ _id: driverId }, { $set: { block: false } });
    res.status(200).json({ message: "Driver unBlocked Successfully" });
  } catch (error) {
    res.status(404).json({ message: "Unable to unBlock the Driver" });
  }
};

// ----------------------------------------------------------------GET DRIVER-REQUESTS-------------------------------------------------------------------//

export const getRequests = async (req, res) => {
  try {
    const requests = await requestModel.find();
    res.status(200).json({ requests });
  } catch (error) {
    console.log(error);
  }
};

// ----------------------------------------------------------------APPROVE DRIVER-REQUESTS-------------------------------------------------------------------//

export const approveRequest = async (req, res) => {
  try {
    const requestId = req.body.requestId;
    const requestDocument = await requestModel.findOne({ _id: requestId });
    if (requestDocument) {
      const response = await approveMail(
        requestDocument.email,
        requestDocument.userName
      );
      if (response) {
        const newDriverDocument = new driverModel(requestDocument.toObject());
        await newDriverDocument.save();
        await requestModel.deleteOne({ _id: requestId });
        res.status(200).json({ message: "Request approved successfully" });
      } else {
        res.status(404).json({ message: "Failed to send approve mail" });
      }
    } else {
      res.status(404).json({ message: "Request not found" });
    }
  } catch (error) {
    console.error("Error in approveRequest:", error);
    res.status(500).json({ message: "An error occurred in approveRequest" });
  }
};

// ----------------------------------------------------------------DECLINE DRIVER-REQUESTS-------------------------------------------------------------------//

export const declineRequest = async (req, res) => {
  try {
    const requestId = req.body.requestId;
    const requestDocument = await requestModel.findOne({ _id: requestId });
    if (requestDocument) {
      requestDocument.decline = true;
      await requestDocument.save();
      const response = await declineMail(
        requestDocument.email,
        requestDocument.userName
      );
      if (response) {
        res.status(200).json({ message: "Request Declined" });
      } else {
        res
          .status(200)
          .json({ message: "Request Declined,Failed to send decline mail" });
      }
    } else {
      res.status(404).json({ message: "Request not found" });
    }
  } catch (error) {
    res.status(404).json({ message: "Unable to decline the request" });
  }
};

// ----------------------------------------------------------------GET VEHICLES-------------------------------------------------------------------//

export const getVehicles = async (req, res) => {
  try {
    const vehicles = await vehicleModel.find();
    res.status(200).json({ vehicles });
  } catch (error) {
    res.status(404).json({ message: "Error fetching data" });
  }
};

// ----------------------------------------------------------------HIDE VEHICLES-------------------------------------------------------------------//

export const hideVehicle = async (req, res) => {
  try {
    const vehicleId = req.body.vehicleId;
    await vehicleModel.updateOne({ _id: vehicleId }, { $set: { block: true } });
    res.status(200).json({ message: "Vehicle hided Successfully" });
  } catch (error) {
    res.status(404).json({ message: "Unable to hide the Vehicle" });
  }
};

// ----------------------------------------------------------------SHOW VEHICLES-------------------------------------------------------------------//

export const showVehicle = async (req, res) => {
  try {
    const vehicleId = req.body.vehicleId;
    await vehicleModel.updateOne(
      { _id: vehicleId },
      { $set: { block: false } }
    );
    res.status(200).json({ message: "Vehicle shown Successfully" });
  } catch (error) {
    res.status(404).json({ message: "Unable to show the Vehicle" });
  }
};

// ----------------------------------------------------------------ADD VEHICLES-------------------------------------------------------------------//

export const addVehicle = async (req, res) => {
  const {
    imageData,
    value: { service, persons, minCharge, price },
  } = req.body;
  try {
    const { secure_url: image } = await cloudinary.uploader.upload(imageData);
    const vehicleExist = await vehicleModel.findOne({
      service: { $regex: new RegExp(`^${service}$`, "i") },
    });
    if (vehicleExist) {
      return res.status(200).json({ message: "Cab Already Exists" });
    }
    await vehicleModel.create({ service, persons, minCharge, price, image });
    return res.status(200).json({ message: `${service} added Successfully` });
  } catch (error) {
    console.error("An error occurred:", error);
    return res.status(404).json({ message: "Internal Server Error" });
  }
};

// ----------------------------------------------------------------GET EDIT-VEHICLE-DATA-------------------------------------------------------------------//

export const getVehicleData = async (req, res) => {
  try {
    console.log(req.body);
    const vehicleId = req.body.vehicleId;
    const vehicle = await vehicleModel.findOne({ _id: vehicleId });
    res.status(200).json({ vehicle });
  } catch (error) {
    res.status(404).json({ message: "Error fetching data" });
  }
};

// ----------------------------------------------------------------UPDATE VEHICLE-DATA-------------------------------------------------------------------//

export const updateVehicleDetails = async (req, res) => {
  try {
    const { imageData, vehicleId, details } = req.body;
    const { secure_url: image } = await cloudinary.uploader.upload(imageData);
    const nonEmptyFields = Object.fromEntries(
      Object.entries(details).filter(([_, value]) => value !== '')
    );
    await vehicleModel.updateOne({ _id: vehicleId }, { image, ...nonEmptyFields });
    res.status(200).json({ message: 'updated successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error updating vehicle details' });
  }
};

// ----------------------------------------------------------------GET ACTIVE-USER-------------------------------------------------------------------//

export const getActiveUsers = async (req, res) => {
  try {
    const users = await userModel.countDocuments({ block: false });
    res.status(200).json({ users });
  } catch (error) {
    res.status(404).json({ message: "Error fetching data" });
  }
};

// ----------------------------------------------------------------GET ACTIVE-DRIVER-------------------------------------------------------------------//

export const getActiveDrivers = async (req, res) => {
  try {
    const drivers = await driverModel.countDocuments({ block: false });
    res.status(200).json({ drivers });
  } catch (error) {
    res.status(404).json({ message: "Error fetching data" });
  }
};

// ----------------------------------------------------------------GET ACTIVE-CAB-------------------------------------------------------------------//

export const getActiveCabs = async (req, res) => {
  try {
    const cabs = await vehicleModel.countDocuments({ block: false });
    res.status(200).json({ cabs });
  } catch (error) {
    res.status(404).json({ message: "Error fetching data" });
  }
};

// ----------------------------------------------------------------GET ACTIVE-REQUESTS-------------------------------------------------------------------//

export const getActiveRequests = async (req, res) => {
  try {
    const requests = await requestModel.countDocuments({ decline: false });
    res.status(200).json({ requests });
  } catch (error) {
    res.status(404).json({ message: "Error fetching data" });
  }
};

export const userData = async(req, res, next) => {
  try {
    const month = req.query.month;
    const startDate = new Date(`${month} 1, 2023`);
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0, 23, 59, 59, 999);
    const userCount = await userModel.countDocuments({
      createdAt: { $gte: startDate, $lte: endDate },
    });
    const driverCount = await driverModel.countDocuments({
      createdAt: { $gte: startDate, $lte: endDate },
    });

    res.json({ userCount, driverCount });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: 'Internal Server Error' });
  }
}