import { useState, useEffect } from "react";
import { useParams,Link ,useNavigate } from "react-router-dom";
import { getBudget, updateBudget } from "../services/budgetService"; 
import { useAuth } from "../../AuthContext";

export default function EditBudget() {
  const { isAuthenticated } = useAuth();
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [category, setCategory] = useState('');
  const [limit, setLimit] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchBudget = async () => {
      try {
        const response = await getBudget(id); 
        const budget = response.data.budgets;
        setCategory(budget.category);
        setLimit(budget.limit);
        setStartDate(budget.startDate);
        setEndDate(budget.endDate);
      } catch (error) {
        setError('Error fetching budget data.');
      }
    };

    fetchBudget();
  }, [id]);

  const validateForm = () => {
    let isValid = true;
    if (limit <= 0) {
      setError("Budget limit must be a positive number.");
      isValid = false;
    }
    if (new Date(startDate) > new Date(endDate)) {
      setError("End date must be later than start date.");
      isValid = false;
    }
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!validateForm()) return;

    try {
      await updateBudget(id, {
        category,
        limit,
        startDate,
        endDate,
      });
      setSuccess(true);
      navigate('/budgets');
    } catch (error) {
      console.error('Error updating budget', error);
      setError('Failed to update budget. Please try again.');
    }
  };

  return (
    isAuthenticated?(<form className="add-budget" onSubmit={handleSubmit}>
      <h1>Edit Budget</h1>
      <div className="budget-form">
        <label>Category
        <select value={category} onChange={(e) => setCategory(e.target.value)} required>
          <option value="Travel">Travel</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Food">Food</option>
          <option value="Appliances">Appliances</option>
          <option value="Education">Education</option>
          <option value="Others">Others</option>
        </select>
        </label>
        <label>Limit
          <input type="number" value={limit} onChange={(e) => setLimit(e.target.value)} required />
        </label>
        <label>Start Date
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
        </label>
        <label>End Date
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
        </label>
        <button type="submit">Update Budget</button>
        <Link to="/budgets">
          <button className="list">View List</button>
        </Link>
      </div>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">Budget updated successfully!</p>}
    </form>):(<h2>Please log in to access this page.</h2>)
    
  );
}
