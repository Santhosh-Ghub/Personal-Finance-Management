const Transaction=require('../models/TransactionModel');

exports.report=async (req,res)=>{
try{
  const userId=req.user.id;
  const { startDate, endDate } = req.query;
  if (!startDate || !endDate) {
    return res.status(400).json({ message: 'Start date and end date are required' });
  }
  const transactions=await Transaction.findAll({

    where:{userId:userId,
      date: {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      }
    } 
  });
  const totalIncome = transactions
      .filter(tx => tx.type === 'Income')
      .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);

    const totalExpense = transactions
      .filter(tx => tx.type === 'Expense')
      .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);
  return res.json({
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense
    
  });
}
catch(err){
  console.error('Error generating report:', err);
  return res.status(404).json({error:'Error generating report:',error: err.message });
}
};

exports.getCategoryByMonth=async (req,res)=>{
  try{
    const userId=req.user.id;
    const { month, year } = req.query;
    if (!month || !year) {
      return res.status(400).json({ message: 'Month and year are required' });
    }
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    const transactions=await Transaction.findAll(
      {
        where:{userId:userId,
          date: {
            [Op.between]: [startDate, endDate],
          },
        },
        
      }
    );
    const categories = transactions.reduce((acc, tx) => {
      if (!acc[tx.category]) {
        acc[tx.category] = 0;
      }
      acc[tx.category] += parseFloat(tx.amount);
      return acc;
    }, {});


    return res.status(200).json({categories});


  }catch(err){
    console.error('Error fetching category data:', err);
    return res.status(500).json({message: 'Error fetching category data', error: err.message });
  }
};


exports.savings=async (req,res)=>{
  try{
    const userId=req.user.id;
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required' });
    }
    const transactions = await Transaction.findAll({
      where: {
        userId,
        date: {
          [Op.between]: [new Date(startDate), new Date(endDate)],
        },
      },
    });
    const totalIncome = transactions
      .filter(tx => tx.type === 'Income')
      .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);

    const totalExpense = transactions
      .filter(tx => tx.type === 'Expense')
      .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);

    const savings = totalIncome - totalExpense;
    return res.status(200).json({totalIncome, totalExpense, savings });


  }
  catch(err){
    console.error('Error calculating savings:', err);
    res.status(500).json({ message: 'Error calculating savings', error: err.message });
  }
}