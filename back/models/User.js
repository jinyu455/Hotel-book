const mongoose =require('mongoose');
const crypto=require('crypto');

const userSchema= new mongoose.Schema({
    username:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    role:{type:String,enum:['user','merchant','admin'],default:'user'},
    phone:String,
},{timestamps:true});

userSchema.pre('save',async function(){
    const user =this;
    if(user.isModified('password')){
        user.password=crypto.createHash('md5').update(user.password).digest('hex');
    }
})//加密

userSchema.methods.comparePassword=function(password){
    const cryptoPwd=crypto.createHash('md5').update(password).digest('hex');
    return cryptoPwd==this.password;
}//校验

module.exports=mongoose.model('User',userSchema);