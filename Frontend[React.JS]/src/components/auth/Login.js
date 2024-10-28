import { useState } from "react";
import {useNavigate, Link} from 'react-router-dom';
import {login} from "../services/authService";
import { useAuth } from "../../AuthContext";
import "../../auth.css";

export default function Login(){
  const [username,setUsername]=useState('');
  const [password,setPassword]=useState('');
  const [error,setError]=useState('');
  const [isLoading, setIsLoading] = useState(false);
 const {isAuthenticated ,setIsAuthenticated}=useAuth();
  const navigate=useNavigate();
  if(isAuthenticated){
    navigate('/dashboard');
  }

  const handleLogin=async (e)=>{
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try{
      await login({username,password});
      setIsAuthenticated(true);
      navigate('/dashboard');

    }catch(err){
      setError(`Invalid Username or Password ${err}`);
    }finally {
      setIsLoading(false);
    }

  };
  return(
    <div className="login">
      <h1>LOGIN</h1>
      <form onSubmit={handleLogin} >
        <label>
          Username
          <input type="text" className="inp" value={username} onChange={(e)=>setUsername(e.target.value)} required />
        </label><br/>
        <label>
          Password
          <input type="password" className="inp" value={password} onChange={(e)=>setPassword(e.target.value)} required />
        </label><br/>
        {error &&<p className="error">{error}</p> }
        <button type="submit" className="loginBu" disabled={isLoading}>{isLoading ? 'Logging in...' : 'Login'}</button>
        <br/>
        <label>
          New User??    
           <Link  className="signupBu" to="/signup"> Sign up </Link>
        </label>
      </form>
    </div>
  )
}