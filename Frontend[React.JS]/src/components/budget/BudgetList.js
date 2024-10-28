import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../../budget.css";
import { getBudgets,deleteBudget } from "../services/budgetService";
import { useAuth } from "../../AuthContext";

export default function BudgetList() {
  const { isAuthenticated } = useAuth();
  const [budgets, setBudgets] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const response = await getBudgets();
      setBudgets(response.data.budgets||[]);
    } catch (error) {
      console.error('Error fetching budgets', error);
      setError('Error fetching budgets. Please try again later.');
    }finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this budget?");
    if (confirmDelete) {
      try {
        await deleteBudget(id);
        setBudgets(budgets.filter(budget => budget.id !== id));
      } catch (error) {
        console.error('Error deleting budget', error);
        setError('Failed to delete budget. Please try again.');
      }
    }
  };



  return (
    isAuthenticated?(<div>

      {loading ? <p>Loading budgets...</p> :
        <div className="budget">
          <div className="budget-header">
            <h1>Budgets</h1>
            <Link to="/budgets/new">
              <button >Add Budget</button>
            </Link>
          </div>
    
          {error && <p className="error">{error}</p>}
    
          {budgets.length > 0 ? (
            <ul>
              {budgets.map((budget) => (
                <li className="each-budget" key={budget.id}>
                  <div className="entry-data">

                  <strong>{budget.category}</strong>: Limit - {budget.limit}<strong> Current Spend - </strong> {budget.currentSpend} <b>[</b> From <b>{budget.startDate}</b> to <b>{budget.endDate}]</b>
                  </div>
                  <div className="butt">

                  <Link to={`/budgets/edit/${budget.id}`}>
                  <button>Edit</button>
                  </Link>
                  <button className="del-button" onClick={() => handleDelete(budget.id)}>Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            !error && <p>No budgets available.</p>
          )}
        </div>
}
    </div>):(<h2>Please log in to access this page.</h2>)
         
  );
}
