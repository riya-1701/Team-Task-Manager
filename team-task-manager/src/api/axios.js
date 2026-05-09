import axios from 'axios';

// const API = axios.create({ baseURL: 'http://localhost:5000/' });
const API = axios.create({ baseURL: 'https://team-task-manager-8lzk.onrender.com' });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;