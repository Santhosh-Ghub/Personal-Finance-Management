const jwt=require('jsonwebtoken');
exports.authentication =function (req, res, next){
  const token=req.header('Authorization')?.split(' ')[1];
  if(!token){
    return res.status(401).json({message:' No token, authorization denied'});
  }
  try{
    const verify=jwt.verify(token,process.env.JWT_key);
    req.user=verify;
    next();
  }catch(err){
    res.status(401).json({error:'UnAuthorized'});
  }

}