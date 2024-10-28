import { useState } from "react";
import {useNavigate, Link} from 'react-router-dom';
import "../../auth.css";
import {register} from "../services/authService";

export default function Signup(){
  const [username,setUsername]=useState('');
  const [password,setPassword]=useState('');
  const [confirmPassword,setConfirmPassword]=useState('');
  const [error,setError]=useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate=useNavigate();

  const handleSignup=async (e)=>{
    e.preventDefault();
    setError('');
    if(password!==confirmPassword){
      setError('Passwords do not match');
      return;
    }
    setIsLoading(true);
    try{
      await register({username,password});
      navigate('/login');

    }catch(err){
      setError(`Error creating account ${err}`);
    } finally {
      setIsLoading(false);
    }

  }

  return(
    <div className="signup">
      <h1>SIGN UP</h1>
      <form onSubmit={handleSignup} >
        <label>
          Username
          <input type="text" className="inp" value={username} onChange={(e)=>setUsername(e.target.value)} required />
        </label><br/>
        <label>
          Password
          <input type="password" className="inp" value={password} onChange={(e)=>setPassword(e.target.value)} required />
        </label><br/>
        <label>
          Confirm Password
          <input type="password" className="inp" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} required />
        </label><br/>
        {error &&<p className="error">{error}</p> }
        <button type="submit" className="signB" disabled={isLoading}> {isLoading ? 'Registering...' : 'Register'}</button>
        <br/>
        <label>
          Already have an account?? <Link className="log-in" to="/login">
        Login
          </Link>
        </label>
      </form>
    </div>
  )
}