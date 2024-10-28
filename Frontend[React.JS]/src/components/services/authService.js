import axios from 'axios';
const API_URL='/auth/';

export const register=(userData)=>{
  return axios.post(API_URL + 'signup',userData).catch(error=>{
    throw error;
  });
};

export const login=(userData)=>{
  return axios.post(API_URL+'login',userData)
  .then(response=>{
    if(response.data.token){
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  }).catch(error=>{
    throw error;
  });
};
export const logout=()=>{
  localStorage.removeItem('user');
};

