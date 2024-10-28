const transaction=require('../models/TransactionModel');
const {Op}=require('sequelize');
const Budget=require('../models/BudgetModel');
const Notification=require('../models/NotificationModel');
exports.createTransaction=async(req,res)=>{
  
  try{
    const userId=req.user.id;
    const {amount, type, category, date, description}=req.body;

     if(!userId||!amount||!type||!category||!date){
      return res.status(400).json({error:`Missing required fields ${amount},${type},${category},${date}`});
     }
     

     const newTransaction=await transaction.create({
      userId,
      amount,
      type,
      category,
      date,
      description,
     });
     const totalExpense=await transaction.sum('amount',{where:{userId:userId,type:'expense',category}});

     const budget=await Budget.findOne({where:{userId:userId,category}});
     if (budget&&totalExpense>budget.amount){
      await Notification.create({
        userId:userId,
        message:`You exceeds the budget for this category: ${category} `
      });
     }
    return res.status(201).json({message:'Transaction created successfully'});
  }catch(err){
    console.error('Error in creating transaction',err);
    return res.status(500).json({error:'Failed to create transaction'});
  }

}
exports.readTransaction=async(req,res)=>{
  try{
    const userId=req.user.id;
    const queryOptions={where:{userId},order: [['date', 'DESC']]};

    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1; 
    const offset = (page - 1) * limit;

    queryOptions.limit = limit;
    queryOptions.offset = offset;


    const startDate=req.query.startDate;
    if(startDate){
      queryOptions.where.date={
        [Op.gte]:new Date(startDate)
      };
    }
    const category=req.query.category;
    if(category){
      queryOptions.where.category=category;
    }
    const transactions=await transaction.findAndCountAll(queryOptions);
    return res.status(200).json({
      transactions: transactions.rows,
      total: transactions.count,
      totalPages: Math.ceil(transactions.count / limit),
      currentPage: page,
    });
    
  }
  catch(err){
    console.error('Error reading transactions:', err);
    return res.status(500).json({error:"Failed to retrieve transactions"});
  }
}

exports.getTransactionById = async (req, res) => {
  try {
    const transactionId = req.params.id;
    const userId = req.user.id;

    const transactions = await transaction.findOne({
      where: {
        id: transactionId,
        userId: userId,
      },
    });

    if (!transactions) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    return res.status(200).json({ transactions });
  } catch (err) {
    console.error('Error fetching transaction by ID:', err);
    return res.status(500).json({ error: 'Failed to retrieve transaction', details: err.message });
  }
};
exports.updateTransaction=async(req,res)=>{
  try{
    const transactionId=req.params.id;
    const userId=req.user.id;
    const editTransaction= await transaction.findOne({
      where:{
        id:transactionId,
        userId
      }
    });
    if(!editTransaction){
     return res.status(404).json({error:'THE MENTIONED TRANSACTION IS NOT FOUND'});
    }
    await editTransaction.update({...req.body});
    return res.status(201).json({editTransaction});

  }
  catch(err){
    console.error('Error updating transaction:', err);
    return res.status(500).json({error:'Failed to update transaction'});

  }

}
exports.deleteTransaction=async(req,res)=>{
  try{
    const transactionId=req.params.id;
    const userId=req.user.id;
    const delTransaction= await transaction.findOne({
      where:{id:transactionId, userId}
    });
    if(!delTransaction){
      return res.status(404).json({error:'The transaction is not found'});
    }
    await delTransaction.destroy();
    return res.status(200).json({message:'Transaction is deleted successfully'});

  }
  catch(err){
    console.error('Error deleting transaction:', err);
    return res.status(500).json({error:'Failed to delete transaction' });
  }
};