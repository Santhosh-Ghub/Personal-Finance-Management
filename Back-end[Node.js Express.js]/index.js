const sequelize=require('./config/db');
const User=require('./models/UserModel');
const Budget=require('./models/BudgetModel');
const express=require('express');
const bodyparser=require('body-parser');
const cors=require('cors');
const auroutes=require('./routes/authRoutes');
const apiroutes=require('./routes/apiRoutes');
const {errorHandler}=require('./middleware/errorHandleMiddleware');
const app=express();


app.use(cors());
app.use(bodyparser.json());
app.use('/auth',auroutes);
app.use('/api',apiroutes);
app.use(errorHandler);
sequelize.sync({force:false}).then(()=>{
  app.listen(5000,()=>{console.log('server is listening to 5000')});

}).catch(err=>{console.error('error in server listening',err)});
