import axios from 'axios';

const API = axios.create({
  baseURL: 'https://localhost:5001/api',
  //httpsAgent: new https.Agent({ rejectUnauthorized: false })
});

// Automatically attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── AUTH ────────────────────────────────────────────────────
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);

// ─── TRANSFER ────────────────────────────────────────────────
export const sendMoney = (data) => API.post('/transfer/send', data);
export const getHistory = () => API.get('/transfer/history');
export const getBalance = () => API.get('/transfer/balance');