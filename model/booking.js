import mongoose from "mongoose";
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  userId: {
    type: String,
  },
  driverId:{
    type: String,
  },
  pickup: {
    type: String,
  },
  dropoff: {
    type: String,
  },
  service: {
    type: String,
  },
  fare: {
    type: Number,
  },
  declinedDrivers: {
    type: [String],
  },
  otp: {
    type: String
  },
  drivers:{
    type: [{
      driverId: {
        type: String,
      },
      distance: {
        type: Number,
      },
      status:{
        type:Boolean,
        default:false
      }
    }],
  },
  status: {
    type:String,
    default:'pending'
  },
  payment: {
    type:String,
  },
  rating: {
    type:Number,
  },
  description: {
    type:String,
  },
},{timestamps:true});
const bookingModel = mongoose.model("Booking", bookingSchema);
export default bookingModel;
