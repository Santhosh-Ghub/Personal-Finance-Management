const User=require('../models/UserModel');
const bcrypt=require('bcrypt');


exports.viewProfile=async (req,res)=>{
  try{
    const id=req.user.id;
    const userDetails=await User.findOne({where:{id:id}});
    if (!userDetails) {
      return res.status(404).json({ error: 'User not found' });
  }

    return res.status(200).json({userDetails});

  }catch(err){
    console.error('Error in viewProfile:', err);
    return res.status(500).json({error:'server error'});
  }
};
exports.updateUser=async (req, res)=>{
  try{
    const userId=req.user.id;
    const {name, oldPassword, newPassword, email }=req.body;

    
    const user=await User.findOne({where:{id:userId}

    });
    if(!user){
      return res.status(404).json({error:'THE MENTIONED USER IS NOT FOUND'});
     }
     if(name){
      user.name=name;

     }
     if(email){
      user.email=email;

     }
     if(oldPassword&& newPassword){
      const match=await bcrypt.compare(oldPassword,user.password);
      if(!match){
        return res.json({error:'Incorrect old password'});
      }
      const hashedPassword=await bcrypt.hash(newPassword,10);
      user.password=hashedPassword

     }
     await user.save();
     return res.status(200).json({message:'User Updated: ',user});


  }catch(err){
    console.error('Error in updateUser:', err);
    return res.status(500).json({error:'server error'});
  }
  
};


