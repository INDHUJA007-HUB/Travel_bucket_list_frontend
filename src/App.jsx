// D:\TravelbucketList\travel_bucketlist\src\App.jsx

import React, { useEffect } from 'react'; 
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios'; 

// Context and Components 
import { AuthProvider, useAuth } from './context/AuthContext'; 
import ProtectedRoute from './components/ProtectedRoute'; 

// Page Components
import Home from './pages/Home';
import Login from './pages/Login'; 
import Register from './pages/Register';
import Dashboard from './pages/Dashboard'; 
import Profile from './pages/Profile';     

// Define the Backend URL
const API_BASE_URL = 'http://localhost:5000/api'; 

function App() {
  // --- CONNECTION TEST EFFECT ---
  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log("Testing connection to backend...");
        await axios.get(`${API_BASE_URL}/test-connection`);
        console.log("--- BACKEND CONNECTION SUCCESSFUL! (200 OK) ---");
      } catch (error) {
        console.error("--- CONNECTION FAILED! --- Network Error:", error.message);
      }
    };
    testConnection();
  }, []); 

  return (
    // --- CRITICAL FIX: Router must be the outermost component here ---
    <Router> 
      {/* AuthProvider is now nested inside the Router, allowing it to use useNavigate() */}
      <AuthProvider>
        <Routes>
          
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard /> 
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          
        </Routes>
      </AuthProvider>
    </Router>
  );
} 

export default App;