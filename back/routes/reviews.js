const express=require('express');
const router=express.Router();
const Review=require('../models/Review');
const auth=require('../middleware/auth');

router.post('/',auth,async(req,res)=>{
    try{
        const{hotelId,score,content}=req.body;
        const review=new Review({
            userId:req.user.id,
            hotelId,
            score,
            content
        });
        await review.save();
        res.status(201).json(review);
    }catch(e){
        res.status(400).json({msg:'发评论失败',e});
    }
});//发评论

router.get('/:hotelId',async(req,res)=>{
    try{
        const reviews=await Review.find({hotelId:req.params.hotelId}).populate('userId');
        res.json(reviews);
    }catch(e){
        res.status(400).json({msg:'查评论失败',e});
    }
});//查某个酒店评论

module.exports=router;
