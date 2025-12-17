import axios from 'axios';

// Change this line to use the Vite environment variable
// Note: It MUST start with VITE_ to be visible in your frontend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, 
});

// ... rest of your interceptor code remains the same
// --- CRITICAL FIX: Intercept every request to add the token ---
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Backend will look for this header to authenticate the user
      config.headers['x-auth-token'] = token; 
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;