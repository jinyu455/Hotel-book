const express=require('express');
const router=express.Router();
const Hotel=require('../models/Hotel');
const auth=require('../middleware/auth');

router.get('/',async(req,res)=>{
    const{city,star,minPrice,maxPrice}=req.query;
    let filter={status:'approved'};
    if(city)filter.city=city;
    if(star)filter.star=star;
    if(minPrice&&maxPrice){
        filter['rooms.price']={$gte:minPrice,$lte:maxPrice};
    }
    const hotels=await Hotel.find(filter);
    res.json(hotels);
});

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
    req.json(hotel);
})//审核
module.exports=router;