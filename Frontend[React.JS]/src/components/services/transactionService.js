import axios from 'axios';
const API_URL='/api/transactions/';

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

export const createTransaction=(amount,
  type,
  category,
  date,
  description)=>{
  return axios.post(API_URL,{amount,
    type,
    category,
    date,
    description},{headers:getAuthHeader()}).catch(handleErrors);
};


export const getTransactions=()=>{
  return axios.get(API_URL,{headers:getAuthHeader()}).catch(handleErrors);
};
export const getTransaction = (id) => {
  return axios.get(`${API_URL}/${id}`, { headers: getAuthHeader() }).catch(handleErrors);
};

export const updateTransaction=(id,transactionData)=>{
  return axios.put(`${API_URL}${id}`,transactionData,{ headers: getAuthHeader() }).catch(handleErrors);
};

export const deleteTransaction=(id)=>{
  return axios.delete(`${API_URL}${id}`,{ headers: getAuthHeader() }).catch(handleErrors);
};

