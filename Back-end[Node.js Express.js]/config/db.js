require('dotenv').config();
const {Sequelize}=require('sequelize');
const sequelize=new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host:process.env.DB_HOST,
    dialect:'mysql',
    port:process.env.DB_PORT,
    pool:{
      max:5,
      min:1,
      acquire:30000,
      idle:10000,

    },
  }
);
async function testConnection(){
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}
testConnection();
module.exports=sequelize;