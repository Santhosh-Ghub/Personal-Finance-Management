import axios from 'axios';
const API_URL='/api/budgets/';

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user || !user.token) {
    throw new Error('No user token found');
  }
  return { Authorization: `Bearer ${user?.token}` };
};
const handleErrors = (error) => {
  console.error('API Error:', error);
  throw error;
};

export const createBudget=(category,
  limit,
  startDate,
  endDate)=>{
  return axios.post(API_URL,{category,
    limit,
    startDate,
    endDate},{headers:getAuthHeader()}).catch(handleErrors);
};

export const getBudgets=()=>{
  return axios.get(API_URL,{headers:getAuthHeader()}).catch(handleErrors);
};
export const getBudget = (id) => {
  return axios.get(`${API_URL}${id}`, { headers: getAuthHeader() }).catch(handleErrors);
};


export const updateBudget=(id, budgetData)=>{
  return axios.put(`${API_URL}${id}`,budgetData,{headers:getAuthHeader()}).catch(handleErrors);
};

export const deleteBudget = (id) => {
  return axios.delete(`${API_URL}${id}`,{headers:getAuthHeader()}).catch(handleErrors);
};

