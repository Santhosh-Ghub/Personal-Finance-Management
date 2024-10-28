import { useEffect,useState } from "react";
import { Pie} from "react-chartjs-2";
import {Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js';
import "../Dashboard.css";
import { getDashboard } from "./services/dashboardService";
import { useAuth } from '../AuthContext';
ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard(){
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error,setError]=useState('');
  const [year,setYear]=useState(new Date().getFullYear());
  const [month,setMonth]=useState(new Date().getMonth()+1);
  const [incomeExpense,setIncomeExpense]=useState(null);
  const [expenseByCategory,setExpenseByCategory]=useState(null);
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


  const handleSetYear=(event)=>{
    setYear(event.target.value);
  }
  const handleSetMonth=(event)=>{
    setMonth(event.target.value);
  }
  const fetchData=async (year,month)=>{
    setLoading(true);
  setError('');
    try {
      const response=await getDashboard(year,month);
      console.log(response.data);
      const {totalIncome=0, totalExpense=0, savings=0, expenseByCategory={}}=response.data||{};

      setIncomeExpense({
        labels:["Income","Expense","Savings"],
        datasets:[
          {
            label:'Income vs Expense vs Savings',
            data:[totalIncome,totalExpense,savings],
            backgroundColor:['#4CAF50', '#F44336', '#FFEB3B'],
            hoverOffset:4,
          }
        ]
      });
      const categoryLabels=Object.keys(expenseByCategory);
      const categoryAmounts=Object.values(expenseByCategory);
      setExpenseByCategory({
        labels:categoryLabels,
        datasets:[
          {
            label:'Expense By Category',
            data:categoryAmounts,
            backgroundColor: [
              '#FF6384', '#36A2EB', '#FFCE56', '#FF9F40', '#4BC0C0', '#9966FF', '#FF6384'
            ],
            hoverOffset: 4,
          }
        ]
      });
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError(`Error fetching dashboard data: ${error}`);
      setExpenseByCategory(null);
      setIncomeExpense(null);
    }finally{
      setLoading(false);
    }

  }
  useEffect(()=>{
    fetchData(year,month);

  },[year,month]);



  return(
    isAuthenticated ? (
      <div className="dashboard">
    <h1>Dashboard OverView</h1>
   <div className="date-select">
    <label>Year</label>
    <input type="number" value={year} onChange={handleSetYear} min="2023" max={new Date().getFullYear()} />

    <label>Month</label>
    <select value={month} onChange={handleSetMonth}>
      {months.map((month,index)=>(
        <option key={index+1} value={index+1} >{month}</option>
      ))

      }

    </select>
   </div>
   {error &&<p className="error">{error}</p> }
    {loading?(<p>Fetching.....</p>):(
      <>
    <div className="chart">
      <h2>Income Expense Savings</h2>
      {
        incomeExpense ?(<div className="chart-pie">
        <Pie  data={incomeExpense}/></div>):(
        <p className="error">No data available for Income, Expense, and Savings.</p>
      )

      }
    </div>
    <div className="chart">
      <h2>Expense By Category</h2>
      {expenseByCategory  ?(
        <div className="chart-pie">
      <Pie  data={expenseByCategory}/></div>):(
        <p className="error">No data available for Expenses By Category.</p>
      )
      }
    </div>
      </>
    )}
  
  </div>):(<h2>Please log in to access this page.</h2>)
  
  
  );
}