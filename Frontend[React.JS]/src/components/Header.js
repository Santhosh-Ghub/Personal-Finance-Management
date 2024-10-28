import "../Header.css";
import {Link,useNavigate} from "react-router-dom";
import {logout} from "./services/authService";
import { useAuth } from '../AuthContext';
export default function Header(){
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const navigate=useNavigate();

  const handleLogout=()=>{
    logout();
    setIsAuthenticated(false);
    navigate('/login');
  }
  return(
    <>{isAuthenticated&&
    <header>
      <h3 className="title">Personal Finance</h3>
    </header>
    }
    <nav>
      
      <img className="logo" alt="logo" src="Main_logo.jpg" />
      {isAuthenticated ?(

      <ul className="navbar">
          <li><Link className="lii" to="/dashboard">Dashboard</Link></li> 
            <li><Link className="lii" to="/transactions">Transactions</Link></li>
            <li><Link className="lii"  to="/budgets">Budget</Link></li> 
            <li><Link className="lii" to="/profile">Profile</Link></li>
      </ul>
      ):( 
        <h1 className="titlee">Personal Finance</h1>
      )}
      <div className="button-container">
        {isAuthenticated ?(
          <button className="logout" onClick={handleLogout}>Logout</button>
        ):(<>
        <Link to ="/login">
      <button className="loginB">Login</button>
        </Link>
      <Link to="/signup">
      <button className="signupB">Sign-Up</button>
      </Link>
        </>)}

      </div>

    </nav>
    
    </>
  );
}