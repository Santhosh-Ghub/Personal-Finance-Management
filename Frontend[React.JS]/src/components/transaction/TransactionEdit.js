import { useState,useEffect } from "react";
import { useParams,useNavigate } from "react-router-dom";
import { getTransaction,updateTransaction } from "../services/transactionService";
import "../../Dashboard.css";
import { useAuth } from "../../AuthContext";

export default function TransactionEdit(){
  const { isAuthenticated } = useAuth();
  const{id}=useParams();
  const navigate=useNavigate();
  const [amount, setAmount] = useState('100');
  const [type, setType] = useState('Income');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const response = await getTransaction(id); 
        const transaction = response.data.transactions;
        setAmount(transaction.amount);
        setType(transaction.type);
        setCategory(transaction.category);
        setDate(transaction.date);
        setDescription(transaction.description);
      } catch (error) {
        setError(`Error fetching transaction data.${error}`);
      }
    };

    fetchTransaction();
  },[id]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateTransaction(id, { amount, type, category, date, description });
      setSuccess(true);
      navigate('/transactions');
    } catch (error) {
      setError('Failed to update transaction. Please try again.');
    }
  };

  return (
    isAuthenticated?(<form className="add-transaction" onSubmit={handleSubmit}>
      <h1>Edit Transaction </h1>
      {error && <p className="error">{error}</p>}
      <div className="transaction-form">

      <label>Amount
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
      </label>
      <label>Type
        <select value={type} onChange={(e) => setType(e.target.value)} required>
          <option value="Income">Income</option>
          <option value="Expense">Expense</option>
        </select>
      </label>
      <label>Category

      <select value={category} onChange={(e) => setCategory(e.target.value)} required>
          <option value="Salary">Salary</option>
          <option value="Interest">Interest</option>
          <option value="Travel">Travel</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Food">Food</option>
          <option value="Appliances">Appliances</option>
          <option value="Education">Education</option>
          <option value="Others">Others</option>
        </select>
      </label>
      <label>Date
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      </label>
      <label>Description
        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required />
      </label>
      <button type="submit">Update Transaction</button>
      {success && <p>Transaction updated successfully!</p>}
      </div>
    </form>):(<h2 className="login-error">Please log in to access this page.</h2>)
    
  );
}
