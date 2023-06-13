import express from "express";
import logger from "morgan";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import connection from "./database/config.js";
import { createServer } from "http";
import dotenv from "dotenv";
import initializeSocket from "./socketLogic/socket.js";

dotenv.config();

import adminRoute from "./routes/adminRouter.js";
import userRoute from "./routes/userRouter.js";
import driverRoute from "./routes/driverRouter.js";

const app = express();
const httpServer = createServer(app);

connection();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "100mb" }));
app.use(cookieParser());
app.use(express.json());
app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/api/admin", adminRoute);
app.use("/api/user", userRoute);
app.use("/api/driver", driverRoute);

initializeSocket(httpServer);

httpServer.listen(4000, () => {
  console.log("Server connected to port 4000");
});
