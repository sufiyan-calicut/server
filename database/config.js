import mongoose from "mongoose";

const connection = () => {
  mongoose
    .connect("mongodb+srv://city-cabs:0000@cluster0.21mmzsj.mongodb.net/city-cabs")
    .then(() => {
      console.log("connected to db");
    })
    // .connect('mongodb://0.0.0.0/city-cabs')
    .catch((error) => console.log(error));
};

export default connection;
