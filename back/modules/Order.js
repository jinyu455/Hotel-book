const mongoose=require('mongoose');

const orderSchema=new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    hotelId:{type:mongoose.Schema.Types.ObjectId,ref:'Hotel'},
    roomType:String,
    checkIn:Date,
    checkOut:Date,
    totalPrice:Number,
    status:{type:String,enum:['pending','paid','canceled','completed'],default:'pending'}
},{timestamps:true});

module.exports=mongoose.model('Order',orderSchema);