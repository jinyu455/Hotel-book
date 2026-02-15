const express=require('express');
const router=express.Router();
const User=require('../models/User');
const jwt=require('jsonwebtoken');

router.post('/register',async(req,res)=>{
    try{
        const{username,password,role}=req.body;
        const user=new User({username,password,role});
        await user.save();
        res.status(201).json({msg:'注册成功'});
    }catch(e){
        res.status(400).json({msg:'注册失败',e});
    }
});

router.post('/login',async(req,res)=>{
    try{
        const{username,password}=req.body;
        const user=awaitUser.findOne({username});
        if(!user)return res.status(400).json({msg:'用户不存在'});
        const isMarch=user.comparePassword(password);
        if(!isMarch)return res.status(400).json({msg:'密码错误'});
        const token=jwt.sign({id:user._id,role:user.role},'your-secret-key',{expiresIn:'7d'});
        res.json({
            token,
            user:{id:user._id,username:user.username,role:user.role}
        })
    }catch(e){
        res.status(400).json(e);
    }
});

module.exports=router;