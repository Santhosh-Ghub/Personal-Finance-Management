import { useState,useEffect } from "react";
import {deleteTransaction, getTransactions} from "../services/transactionService";
import { Link } from "react-router-dom";
import "../../transaction.css";
import { useAuth } from "../../AuthContext";

export default function TransactionList(){
  const { isAuthenticated } = useAuth();
  const [transactions,setTransactions]=useState([]);
  const [error, setError] = useState('');

  const fetchTransactions=async()=>{
    try {
      const response=await getTransactions();
      setTransactions(response.data.transactions);
      
    } catch (error) {
      console.error('Error fetching transactions', error);
      setError('Error fetching transactions. Please try again later.');
      
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTransaction(id);
      setTransactions(transactions.filter(transaction => transaction.id !== id));
    } catch (error) {
      console.error('Error deleting transaction', error);
      setError('Failed to delete transaction. Please try again.');
    }
  };

  useEffect(()=>{
    fetchTransactions();
  },[]);


  return(
    isAuthenticated?(<div className="transaction">
      <div className="transaction-header">
      <h1>Transaction</h1>
      <Link to="/transactions/new">
      <button>Add Transaction</button>
      </Link>

      </div>
      {error && <p className="error">{error}</p>} 
      {transactions.length>0 ?(

      <ul>
        {transactions.map((transaction)=>
          (

          <li className="each-transaction" key={transaction.id}>
            <div className="entry-data">
            <strong className="type">[{transaction.type}] </strong>
            <strong>Date -</strong>
             {transaction.date} <strong> {transaction.category} -</strong>  {transaction.amount} 
             
            </div>
            <p className="des"> <b>Description - </b>{transaction.description}</p>

             <div className="butt">

             <Link to={`/transactions/edit/${transaction.id}`}>
             <button>Edit</button>
             </Link>

             <button className="del-button"onClick={()=>handleDelete(transaction.id)}>Delete</button>
             </div>
             </li>
          )

        )}
      </ul>
      ):(!error && <p className="error">No Transactions available</p>)}

    </div>):(<h2 className="login-error">Please log in to access this page.</h2>)
    
  );
}