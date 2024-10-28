const express= require('express');
const router=express.Router();


const {authentication}=require('../middleware/authMiddleware');


const {viewProfile,updateUser}=require('../controllers/userController');
const {createBudget, readBudget, updateBudget, deleteBudget, getBudgetById}=require('../controllers/budgetController');
const {dashboardView}=require('../controllers/dashboardController');
const {createTransaction, readTransaction, updateTransaction, deleteTransaction,getTransactionById}=require('../controllers/transactionController');
const {report, getCategoryByMonth,savings}=require('../controllers/reportController');
const {exportPdf}=require('../controllers/exportController');


//user
router.get('/profile', authentication, viewProfile );
router.put('/profile', authentication, updateUser );

//budget
router.post('/budgets',authentication, createBudget);
router.get('/budgets',authentication, readBudget);
router.get('/budgets/:id',authentication, getBudgetById);
router.put('/budgets/:id',authentication, updateBudget);
router.delete('/budgets/:id',authentication, deleteBudget);


//dashboard
router.get('/dashboard',authentication, dashboardView);

//transaction
router.post('/transactions',authentication, createTransaction);
router.get('/transactions',authentication, readTransaction);
router.get('/transactions/:id',authentication, getTransactionById);
router.put('/transactions/:id',authentication, updateTransaction);
router.delete('/transactions/:id',authentication, deleteTransaction);

//report
router.get('/monthly-report',authentication,report);
router.get('/category-by-month',authentication,getCategoryByMonth);
router.get('/savings',authentication,savings);

//export
router.get('/export/pdf', authentication, exportPdf);



module.exports=router;