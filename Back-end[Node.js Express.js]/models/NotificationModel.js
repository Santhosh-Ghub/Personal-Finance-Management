const sequelize=require('../config/db');
const {DataTypes}=require('sequelize');
const Notification=sequelize.define('Notification',{
  userId:{
    type:DataTypes.INTEGER,
    allowNull:false,
  },
  message:{
    type:DataTypes.STRING,
    allowNull:false,
  }

});
module.exports=Notification;