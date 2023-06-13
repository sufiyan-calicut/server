import mongoose from "mongoose";
const Schema = mongoose.Schema;

const driverSchema = new Schema({
  userName: {
    type: String,
  },
  age: {
    type: String,
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  country: {
    type: String,
  },
  registerNo: {
    type: String,
  },
  vehicle: {
    type: String,
  },
  password: {
    type: String,
  },
  license: {
    type: String,
  },
  about: {
    type: String,
  },
  profilePhoto: {
    type: String,
    default: "0",
  },
  latitude: {
    type: Number,
  },
  longitude: {
    type: Number,
  },
  block: {
    type: Boolean,
    default: false,
  },
},{timestamps:true});
const driverModel = mongoose.model("Driver", driverSchema);
export default driverModel;
