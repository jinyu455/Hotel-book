const express=require('express');
const router=express.Router();
const Hotel=require('../models/Hotel');
const auth=require('../middleware/auth');
const {ObjectId}=require('mongoose').Types

router.get('/',async(req,res)=>{
    const{city,star,minPrice,maxPrice,facilities,keyword,page=1,pageSize=10}=req.query;
    let filter={status:'approved'};
    if(city)filter.city=city;
    if(star){
        const starArray=star.split(',').map(Number);
        filter.star={$in:starArray};
    }
    if(minPrice&&maxPrice){
        const min=Number(minPrice);
        const max=Number(maxPrice);
        filter.rooms={
            $elemMatch:{
                price:{$gte:min,$lte:max}
            }
        }
    }
    if(facilities){
        const facilitiesArray=facilities.split(',');
        filter.facilities={$all:facilitiesArray};
    }
    if(keyword){
        filter.name={$regex:keyword,$options:'i'};
    }
    try{
        const currentPage=Number(page);
        const limit=Number(pageSize);
        const skip=(currentPage-1)*limit;
        const hotels=await Hotel.find(filter).skip(skip).limit(limit);//分页
        const hotelsWithPrice=hotels.map(hotel=>{
            const hotelObj=hotel.toObject();
            hotelObj.price=hotel.rooms?.[0]?.price||0;
            return hotelObj;
        });
        res.json(hotelsWithPrice);
    }catch(e){
        res.status(500).json({msg:'查询失败',e});
    }
});//筛查全部酒店

router.get('/merchant',auth,async(req,res)=>{
    try{
        console.log('开始获取');
        const hotels=await Hotel.find({merchantId:req.user.id});
        res.json(hotels||[]);
    }catch(e){
        console.error('查询失败',e);
        res.status(200).json([]);
    }
});//商户查询自己酒店

router.get('/:id',async(req,res)=>{
    try{
        const hotel=await Hotel.findById(req.params.id);
        if(!hotel){
            return res.status(404).json({msg:'酒店不存在'});
        }
        hotel.rooms.sort((a,b)=>a.price-b.price);
        res.json(hotel);
    }catch(e){
        res.status(500).json({msg:'查询失败',e});
    }
});//查某个酒店详情

router.post('/',auth,async(req,res)=>{
    if(req.user.role!=='merchant'&&req.user.role!=='admin'){
        return res.status(403).json({msg:'无权限'});
    }
    const hotel=new Hotel({
        ...req.body,
        merchantId:req.user.id
    });
    await hotel.save();
    res.status(201).json(hotel);
});//商户创建酒店


router.put('/:id',auth,async(req,res)=>{
    try{
        const hotel=await Hotel.findById(req.params.id);
        if(!hotel)return res.status(404).json({msg:'酒店不存在'});
        if(hotel.merchantId.toString()!==req.user.id&&req.user.role!=='admin'){
            return res.status(403).json({msg:'无权限'});
        }
        const updateHotel= await Hotel.findByIdAndUpdate(req.params.id,req.body,{new:true});
        res.json(updateHotel);
    }catch(e){
        res.status(500).json({msg:'更新失败'});
    }
});//商户更新酒店信息

router.put('/:id/audit',auth,async(req,res)=>{
    if(req.user.role!=='admin'){
        return res.status(403).json({msg:'仅管理员可以审核'});
    }
    const{status,rejectReason}=req.body;
    const hotel=await Hotel.findByIdAndUpdate(
        req.params.id,
        {status,rejectReason},
        {new:true}
    );
    res.json(hotel);
})//审核

module.exports=router;