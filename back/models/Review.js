const mongoose=require('mongoose');

const reviewSchema=new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    hotelId:{type:mongoose.Schema.Types.ObjectId,ref:'Hotel'},
    score:Number,
    content:String
},{timestamps:true});

module.exports=mongoose.model('Review',reviewSchema);