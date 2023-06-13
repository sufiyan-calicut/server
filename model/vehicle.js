import mongoose from "mongoose";
const Schema = mongoose.Schema

const vehicleSchema = new Schema({
    service:{
        type:String
    },
    persons:{
        type:String
    },
    image:{
        type:String
    },
    minCharge:{
        type:Number
    },
    price:{
        type:Number
    },
    block:{
        type:Boolean,
        default:false
    }
})
const vehicleModel = mongoose.model('Vehicle',vehicleSchema)
export default vehicleModel;