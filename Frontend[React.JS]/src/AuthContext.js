import { createContext,useContext,useEffect,useState } from "react";
import {jwtDecode} from "jwt-decode";

export const AuthContext=createContext();

export const AuthProvider=({children})=>{
  const [isAuthenticated, setIsAuthenticated]=useState(false);
  useEffect(()=>{
    const user=localStorage.getItem('user');
    if(user){
      const token = JSON.parse(user).token; 
      if (token) {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp > currentTime) {
          setIsAuthenticated(true);  

        } else{
          setIsAuthenticated(false);
          localStorage.removeItem('user');
        }
      }
  }},[]);


  
  return(
    <AuthContext.Provider value={{isAuthenticated,setIsAuthenticated}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth=()=>{
  return useContext(AuthContext);
};

// isAuthenticated?():(<h2>Please log in to access this page.</h2>)
// const { isAuthenticated } = useAuth();
// import { useAuth } from "../../AuthContext";
