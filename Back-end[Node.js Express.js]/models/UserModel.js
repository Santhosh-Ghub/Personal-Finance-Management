const {DataTypes}=require('sequelize');
const sequelize=require('../config/db');
const bcrypt=require('bcrypt');
const User=sequelize.define(
  'User',{
    id:{
      type:DataTypes.INTEGER,
      autoIncrement:true,
      primaryKey:true,
     
    },
    username:{
      type:DataTypes.STRING,
      allowNull:false,
      unique:true,
    },
    name:{
      type:DataTypes.STRING,
      allowNull:true,
      
    },email:{
      type:DataTypes.STRING,
      allowNull:true,
      unique:true,
      validate:{
        isEmail:true,
      }

    },
    password:{
      type:DataTypes.STRING,
      allowNull:false,

    }
  }
);

module.exports=User;
const Transaction =require('./TransactionModel');
User.hasMany(Transaction,{foreignKey:'userId'});
Transaction.belongsTo(User,{foreignKey:'userId'});
const Budget=require('./BudgetModel');
User.hasMany(Budget, {foreignKey:'userId'});
Budget.belongsTo(User,{foreignKey:'userId'});