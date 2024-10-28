const Transaction=require('../models/TransactionModel');
const PDFdocument=require('pdfkit');

exports.exportPdf=async (req,res)=>{
  try{

    const userId=req.user.id;
    const transactions=Transaction.findAll({
      where:{userId:userId},
      attributes:['id','type','amount','category','createdAt'],
    });
    const doc=new PDFdocument();
    res.setHeader('Content-Type','application/pdf');
    res.setHeader('Content-disposition','attachment; filename=Transactions.pdf');

    doc.pipe(res);
    doc.fontSize(18).text('Transaction Report', {align:'center'});
    doc.moveDown(1);
    transactions.forEach(transaction=>{
      doc.fontSize(12).text(
       `Id=${transaction.id}, type=${transaction.type}, amount=${transaction.amount}, category=${transaction.category}, createdAt=${transaction.createdAt}`

      );
      doc.moveDown(0.5);


    });
    doc.end();



  }catch(err){
    console.error('Error exporting PDF:', err);
    return res.status.json({error:'Failed to export PDF'});
  }
}