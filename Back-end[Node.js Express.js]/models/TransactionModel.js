const sequelize=require('../config/db');
const {DataTypes,Op}=require('sequelize');
const User=require('./UserModel');
const Transaction=sequelize.define('Transaction',{
  userId:{
    type:DataTypes.INTEGER,
    allowNull:false,
    references:{
      model:User,
      key:'id'
    }
  },
  amount:{
    type:DataTypes.DECIMAL(10,2),
    allowNull:false
  },
  type:{
    type:DataTypes.ENUM('Income', 'Expense'),
    allowNull:false
  },
  category:{
    type:DataTypes.ENUM('Salary','Interest','Travel','Entertainment','Food','Appliances','Education','Others'),
    allowNull:false
  },
  date:{
    type:DataTypes.DATEONLY,
    allowNull:false,

  },
  description:{
    type:DataTypes.STRING,
    allowNull:true
  }

},{
  hooks:{
    afterCreate:async (transaction,options)=>{
      const budget=await findBudget(transaction);
      if(budget){
        await budget.updateCurrentSpend();
      }
    },
    afterUpdate:async (transaction,options)=>{
      const budget=await findBudget(transaction);
      if(budget){
        await budget.updateCurrentSpend();
      }
    },
    afterDestroy:async (transaction,options)=>{
      const budget=await findBudget(transaction);
      if(budget){
        await budget.updateCurrentSpend();
      }
    }
  }
}


);

const findBudget=async(transaction)=>{
  const Budget=require('./BudgetModel');
  return await Budget.findOne({
    where:{userId:transaction.userId,
          category:transaction.category,
          startDate:{[Op.lte]:transaction.date},
          endDate:{[Op.gte]:transaction.date}

    }
  });
}
module.exports=Transaction;
