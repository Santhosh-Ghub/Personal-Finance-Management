import { useState } from "react";
import { useNavigate,Link } from "react-router-dom";
import "../../Dashboard.css";
import {createTransaction} from "../services/transactionService";
import { useAuth } from "../../AuthContext";

export default function TransactionForm(){
  const { isAuthenticated } = useAuth();
  const navigate=useNavigate();
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Income');
  const [category, setCategory] = useState('Food');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  
  const validateForm=()=>{
    let isValid = true;
    const errors = {};
    if (isNaN(amount) || parseFloat(amount) <= 0) {
      errors.amount = "Amount must be a positive number.";
      isValid = false;
    }
    if (category.trim() === '') {
      errors.category = "Category cannot be empty.";
      isValid = false;
    }
    if (new Date(date) > new Date()) {
      errors.date = "Date cannot be in the future.";
      isValid = false;
    }
    if (description.length < 3) {
      errors.description = "Description must be at least 3 characters.";
      isValid = false;
    }
    setValidationErrors(errors);
    return isValid;

  }

  const handleSubmit=async (e)=>{
    e.preventDefault();
    setError(''); 
    setSuccess(false);
    if (!validateForm()) return;
    try {
      await createTransaction(amount,
        type,
        category,
        date,
        description);
        setSuccess(true);
        navigate('/transactions');
    } catch (error) {
      console.error('Error adding transaction', error);
      setError(`Failed to add transaction. Please try again.${error.response.data.error}`);
      
    }
  }

  
  return(
    isAuthenticated?(<form className="add-transaction" onSubmit={handleSubmit}>
      <h1>Transaction Register</h1>
      <div className="transaction-form">
  
        <label>Amount <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        {validationErrors.amount && <p className="error">{validationErrors.amount}</p>}
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
          
          {validationErrors.category && <p className="error">{validationErrors.category}</p>}
        </label>
        <label>Date <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />{validationErrors.date && <p className="error">{validationErrors.date}</p>}
        </label>
        <label>Description <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required/> {validationErrors.description && <p className="error">{validationErrors.description}</p>}
        </label>
        <button type="submit">Add Transaction</button>
        <Link to="/transactions">
            <button className="list">View List</button>
              </Link>
      </div>
      {error && <p className="error">{error}</p>}  
      {success && <p className="success">Transaction added successfully!</p>} 
    </form>):(<h2 className="login-error">Please log in to access this page.</h2>)
    
  );
}