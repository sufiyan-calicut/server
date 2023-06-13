import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
  userName: {
    type: String,
  },
  phone: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  block: {
    type: Boolean,
    default: false,
  },
},{timestamps:true});
const userModel = mongoose.model("User", userSchema);
export default userModel;
