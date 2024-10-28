import axios from "axios";

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

export const getDashboard=(year,month)=>{
  return axios.get(`/api/dashboard?year=${year}&month=${month}`,{
    headers:getAuthHeader()
  }).catch(handleErrors);
}