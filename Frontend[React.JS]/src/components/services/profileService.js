import axios from 'axios';

const API_URL = '/api/profile';

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

export const getProfile = () => {
  return axios.get(API_URL, { headers: getAuthHeader() }).catch(handleErrors);
};

export const updateProfile = (profileData) => {
  return axios.put(API_URL, profileData, { headers: getAuthHeader() }).catch(handleErrors);
};
