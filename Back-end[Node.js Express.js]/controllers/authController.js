const bcrypt= require('bcryptjs');
const jwt =require('jsonwebtoken');
const User=require('../models/UserModel');



exports.signup=async (req,res)=>{
try{
  const{username,password}=req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }
  const existingUser = await User.findOne({ where: { username } });
  if (existingUser) {
    return res.status(409).json({ message: 'Username already taken' });
  }

  const hashedPassword=await bcrypt.hash(password,10);
  const newUser=await User.create({username,password:hashedPassword});
  res.status(201).json({message:'user created',user:newUser});
}
catch(err){
  console.error('Error creating user:', err);
  res.status(500).json({message:'Error creating user',error:err.message});
}
};

exports.login=async (req,res)=>{
  try{
    const {username,password}=req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
    const user=await User.findOne({where:{username}});
    if(user&&await bcrypt.compare(password,user.password)){
      const token=jwt.sign({id:user.id},process.env.JWT_key ,{expiresIn: '2h'});
      res.json({message:'login successful',token});
    }else{
      res.status(401).json({message:'invalid credentials'});
    }
  }
  catch(err){
    console.error('Error during login:', err);
    res.status(500).json({message:'Error during login:',error:err.message});
  }
};

