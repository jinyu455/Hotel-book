const mongoose=require('mongoose');

const hotelSchema=new mongoose.Schema({
    name:{type:String,required:true},
    address:{type:String,required:true},
    city:{type:String,required:true},
    star:{type:Number,min:1,max:5},
    intro:String,
    facilities:[String],
    images:[String],
    rooms:[{
        type:String,
        price:Number,
        stock:Number
    }],
    merchantId:{type:mongoose.Schema.Types.ObjectId,ref:'User'},//酒店商户id
    status:{type:String,enum:['pending','approved','rejected','offline'],default:'pending'},//酒店审核:待审，通过，拒绝，下线
    rejectReason:String
},{timestamps:true});

module.exports=mongoose.model('Hotel',hotelSchema);