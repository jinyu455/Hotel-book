const express =require('express');
const router=express.Router();
const multer=require('multer');
const path=require('path');
const fs=require('fs').promises

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads/');
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+path.extname(file.originalname));
    }
})

const upload=multer({storage:storage});

router.post('/',upload.single('image'),(req,res)=>{
    res.json({url:`/uploads/${req.file.filename}`});
})

router.delete('/:filename',async(req,res)=>{
    try{
        const {filename}=req.params;
        const filePath=path.join(__dirname,'../uploads',filename);
        await fs.unlink(filePath);
        res.json({success:true,message:'删除成功'});
    }catch(e){
        console.error('删除失败',e);
        res.status(500).json({success:false,message:'删除失败'});
    }
})

module.exports=router;