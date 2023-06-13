import mongoose from "mongoose";
const Schema = mongoose.Schema

const requestSchema = new Schema({
    userName:{
        type:String
    },
    age:{
        type:String
    },
    email:{
        type:String
    },
    phone:{
        type:String
    },
    country:{
        type:String
    },
    registerNo:{
        type:String
    },
    vehicle:{
        type:String 
    },
    password:{
        type:String
    },
    license:{
        type:String
    },
    about:{
        type:String
    },
    profilePhoto:{
        type:String
    },
    approve:{
        type:Boolean,
        default:false
    },
    decline:{
        type:Boolean,
        default:false
    },
    
},{timestamps:true})
const requestModel = mongoose.model('Request',requestSchema)
export default requestModel;