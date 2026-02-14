const jwt=require('jsonwebtoken')
module.exports=(req,res,next)=>{
    const token=req.header('x-auth-token');
    if(!token)return res.status(401).json({msg:'请先登录'});
    try{
        const decoded=jwt.verify(token,'your-secret-key');
        req.user=decoded;
        next();
    }catch(e){
        res.status(401).json({msg:'无效token'});
    }
}