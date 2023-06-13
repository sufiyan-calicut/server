import express from "express";
import {
  addVehicle,
  approveRequest,
  blockDriver,
  blockUser,
  declineRequest,
  getActiveCabs,
  getActiveDrivers,
  getActiveRequests,
  getActiveUsers,
  getDrivers,
  getRequests,
  getUsers,
  getVehicleData,
  getVehicles,
  hideVehicle,
  login,
  showVehicle,
  tokenVerify,
  unBlockDriver,
  unBlockUser,
  updateVehicleDetails,
  userData,
} from "../controllers/adminControllers.js";
const router = express.Router();

router.post("/login", login);
router.post("/blockUser", blockUser);
router.post("/unBlockUser", unBlockUser);
router.post("/blockDriver", blockDriver);
router.post("/unBlockDriver", unBlockDriver);
router.post("/approveRequest", approveRequest);
router.post("/declineRequest", declineRequest);
router.post("/hideVehicle", hideVehicle);
router.post("/showVehicle", showVehicle);
router.post("/addVehicle", addVehicle);
router.post("/getVehicleData", getVehicleData);

router.get("/tokenVerify", tokenVerify);
router.get("/getUsers", getUsers);
router.get("/getDrivers", getDrivers);
router.get("/getRequests", getRequests);
router.get("/getVehicles",getVehicles);
router.get("/getActiveUsers", getActiveUsers);
router.get("/getActiveDrivers", getActiveDrivers);
router.get("/getActiveCabs", getActiveCabs);
router.get("/getActiveRequests", getActiveRequests);
router.get("/userData", userData)

router.patch("/updateVehicleDetails", updateVehicleDetails)

export default router;
