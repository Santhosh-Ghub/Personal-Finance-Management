const Transaction=require('../models/TransactionModel');
const {Op} =require('sequelize');
exports.dashboardView=async (req,res)=>{
  try{
    const {year,month}=req.query;
    const selectedYear = parseInt(year, 10);
    const selectedMonth = parseInt(month, 10);
    if (!selectedYear || !selectedMonth) {
      return res.status(400).json({ message: 'Invalid year or month' });
    }
    const monthStart=new Date(selectedYear,selectedMonth-1,1);
    const monthEnd=new Date(selectedYear,selectedMonth,0);
    const transactions=await Transaction.findAll({
      where: {
        userId:req.user.id,
        date:{
          [Op.between]:[monthStart,monthEnd]
        }
      }
    });
    if (!transactions.length) {
      return res.json({
        totalIncome: 0,
        totalExpense: 0,
        savings: 0,
        expenseByCategory: {},
      });
    }
    const totalIncome = transactions
    .filter(tx => tx.type === 'Income')
    .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);

    const totalExpense = transactions
    .filter(tx => tx.type === 'Expense')
    .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);

    const savings=totalIncome-totalExpense;
    const expenseByCategory=transactions.reduce((acc,transaction)=>{
      if(transaction.type==='Expense'){
        acc[transaction.category]=(acc[transaction.category]||0)+transaction.amount;
      }
      return acc;
    },{});
    res.json({
      totalIncome, totalExpense, savings, expenseByCategory
    });

  }catch(err){
    console.error('Error fetching dashboard data:',err);
    res.status(500).json({message:'Error fetching dashboard data', error: err.message });
  }

};