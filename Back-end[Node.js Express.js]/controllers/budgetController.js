const budget=require('../models/BudgetModel');
const transaction=require('../models/TransactionModel');
const {Op}=require('sequelize');
exports.createBudget=async(req,res)=>{
  
  try{
    const userId=req.user.id;
    const { category, limit, startDate, endDate}=req.body;

     if(!category||!limit||!startDate||!endDate){
      return res.status(400).json({error:'Missing required fields'});
     }

     const newBudget=await budget.create({
      userId,
      category,
      limit,
      startDate,
      endDate,
     });
     res.status(201).json({message:'Budget created successfully',budget: newBudget });
  }catch(err){
    console.error('Error creating budget:', err);
    return res.status(500).json({error:`The record is not inserted${err}`,details: err.message });
  }

};
exports.readBudget=async(req,res)=>{
  try{
    const userId=req.user.id;
    const queryOptions={where:{userId},order: [['startDate', 'DESC']]};
    const startDate=req.query.startDate;
    if(startDate){
      queryOptions.where.date={ 
        [Op.gte]:startDate
      };
    }
    const category=req.query.category;
    if(category){
      queryOptions.where.category=category;
    }
    const  budgets=await budget.findAll(queryOptions);
    return res.status(200).json({budgets});
    
  }
  catch(err){
    console.error('Error reading transactions:', err);
    return res.status(500).json({error:"Can't read the selected transactions",details: err.message });
  }
};

exports.getBudgetById = async (req, res) => {
  try {
    const budgetId = req.params.id;
    const userId = req.user.id;

    const budgets = await budget.findOne({
      where: {
        id: budgetId,
        userId: userId,
      },
    });

    if (!budgets) {
      return res.status(404).json({ error: 'Budget not found' });
    }

    return res.status(200).json({ budgets });
  } catch (err) {
    console.error('Error fetching budget by ID:', err);
    return res.status(500).json({ error: 'Error fetching budget', details: err.message });
  }
};

exports.updateBudget=async(req,res)=>{
  try{
    const budgetId=req.params.id;
    const userId=req.user.id;
    const editBudget= await budget.findOne({
      where:{
        id:budgetId,
        userId
      }
    });
    if(!editBudget){
     return res.status(404).json({error:'THE MENTIONED BUDGET IS NOT FOUND'});
    }
    await editBudget.update({...req.body});
    return res.status(200).json({message: 'Transaction updated successfully', budget:editBudget});

  }
  catch{
    console.error('Error updating transaction:', err);
    return res.status(500).json({error:'Error updating transaction', details: err.message});

  }

};
exports.deleteBudget=async(req,res)=>{
  try{
    const budgetId=req.params.id;
    const userId=req.user.id;
    const delBudget= await budget.findOne({
      where:{id:budgetId, userId}
    });
    if(!delBudget){
      return res.status(404).json({error:'The transaction is not found'});
    }
    await delBudget.destroy();
    return res.status(200).json({message:'Transaction is deleted successfully'});

  }
  catch(err){
    console.error('Error deleting transaction:', err);
    return res.status(500).json({error:'Error deleting transaction', details: err.message});
  }
}