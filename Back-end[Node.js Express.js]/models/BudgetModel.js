const sequelize=require('../config/db');
const {DataTypes,Op}=require('sequelize');
const User=require('./UserModel');
const Budget = sequelize.define('Budget',{
  id:{
    type:DataTypes.INTEGER,
    autoIncrement:true,
    allowNull:false,
    primaryKey:true,
  },
  userId:{
    type:DataTypes.INTEGER,
    allowNull:false,
    references:{
      model:User,
      key:'id',
    }
  },
  category:{
    type:DataTypes.ENUM('Travel','Entertainment','Food','Appliances','Education','Others'),
    allowNull:false,
  },
  limit:{
    type:DataTypes.DECIMAL(10,2),
    allowNull:false,

  },
  currentSpend:{
    type:DataTypes.DECIMAL(10,2),
    allowNull:false,
    defaultValue:0,

  },
  startDate:{
    type:DataTypes.DATEONLY,
    allowNull:false,
  },
  endDate:{
    type:DataTypes.DATEONLY,
    allowNull:false,
  }

},{
  hooks:{
    afterCreate :async (budget,options)=>{
      await budget.updateCurrentSpend();
    },
    afterUpdate:async (budget,options)=>{
      await budget.updateCurrentSpend();
    },
    afterDestroy:async (budget,options)=>{
      await budget.updateCurrentSpend();
    }
}});
Budget.prototype.updateCurrentSpend=async function(){
  const transaction=require('./TransactionModel');
  const transactions =await transaction.findAll({
   where:{
     userId:this.userId,
     category:this.category,
     date:{
       [Op.between]:[this.startDate,this.endDate]
     }
   }
  });
  const totalSpend=transactions.reduce((sum,transaction)=>{
   return sum+transaction.amount;
  },0);
  if(totalSpend !== this.currentSpend){

    this.currentSpend=totalSpend;
    await this.save();
  }

}


module.exports=Budget;