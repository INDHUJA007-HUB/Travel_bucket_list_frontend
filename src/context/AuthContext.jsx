// D:\TravelbucketList\travel_bucketlist\src\context\AuthContext.jsx

import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // <-- FIX: Import useNavigate
import api from '../services/api'; 

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // <-- FIX: Initialize useNavigate

  // Check if user is logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Set the token in the headers
      api.defaults.headers.common['x-auth-token'] = token; // Use 'x-auth-token'
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  // Load user data (This will now correctly return a 401 if the token is invalid)
  const loadUser = async () => {
    try {
      // NOTE: Assuming you have a /auth/user endpoint that returns the logged-in user details
      // If this route is missing, you can remove this function entirely and rely only on login/register data
      const res = await api.get('/auth/user');
      setUser(res.data);
      setIsAuthenticated(true);
    } catch (err) {
      console.error('Load user error:', err);
      localStorage.removeItem('token');
      delete api.defaults.headers.common['x-auth-token']; 
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  // Register user
  const register = async (userData) => {
    try {
      const res = await api.post('/auth/register', userData);
      
      localStorage.setItem('token', res.data.token);
      api.defaults.headers.common['x-auth-token'] = res.data.token; 
      
      setUser({ _id: res.data._id, username: res.data.username, email: res.data.email }); // Set user details
      setIsAuthenticated(true);
      navigate('/dashboard'); // Direct to dashboard on success
      return { success: true, message: 'Registration successful!' };
      
    } catch (err) {
      console.error('Register error:', err.response?.data?.message || err);
      return { 
        success: false, 
        message: err.response?.data?.message || 'Registration failed! Check network/console.' 
      };
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      
      localStorage.setItem('token', res.data.token);
      api.defaults.headers.common['x-auth-token'] = res.data.token; 
      
      setUser({ _id: res.data._id, username: res.data.username, email: res.data.email }); 
      setIsAuthenticated(true);
      navigate('/dashboard'); // Direct to dashboard on success
      return { success: true, message: 'Login successful!' };
    } catch (err) {
      console.error('Login error:', err.response?.data?.message || err);
      return { 
        success: false, 
        message: err.response?.data?.message || 'Login failed!' 
      };
    }
  };

  // Logout user
  const logout = () => {
    console.log("Logout initiated. Clearing storage and state.");
    localStorage.removeItem('token');
    delete api.defaults.headers.common['x-auth-token'];
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login'); // <-- FIX: Redirect to the login page
  };

  const contextValue = { user, isAuthenticated, loading, login, register, logout };

  return (
    <AuthContext.Provider value={contextValue}>
      {!loading && children} 
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};