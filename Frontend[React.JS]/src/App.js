import './App.css';
import  {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Header from "./components/Header";
import Footer from "./components/Footer";
import Dashboard from './components/Dashboard';
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import TransactionList from "./components/transaction/TransactionList";
import TransactionForm from './components/transaction/TransactionForm';
import TransactionEdit from './components/transaction/TransactionEdit';
import BudgetList from './components/budget/BudgetList';
import BudgetForm from './components/budget/BudgetForm';
import EditBudget from './components/budget/BudgetEdit';
import ProfileView from './components/profile/ProfileView';
import ProfileEdit from './components/profile/ProfileEdit';
function App() {
  return (
    <Router>

    <div className="App">
     <Header/>
     <Routes>
      <Route path="/" element={<Login/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/signup" element={<Signup/>} />

      <Route path="/dashboard" element={<Dashboard/>}/>

      <Route path="/transactions" element={<TransactionList />} /> 
      <Route path="/transactions/new" element={<TransactionForm />} /> 
      <Route path="/transactions/edit/:id" element={<TransactionEdit />} /> 
      
      <Route path="/budgets" element={<BudgetList />} />
      <Route path="/budgets/new" element={<BudgetForm />} />
      <Route path="/budgets/edit/:id" element={<EditBudget />} />

      <Route path="/profile" element={<ProfileView/>}/>
      <Route path="/profile/edit" element={<ProfileEdit/>}/>
     </Routes>
     <Footer/>
    </div>
    </Router>
  );
}

export default App;
