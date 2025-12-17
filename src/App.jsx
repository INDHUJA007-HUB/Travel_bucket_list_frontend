// D:\TravelbucketList\travel_bucketlist\src\App.jsx

import React, { useEffect } from 'react'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios'; 

// Context and Components 
import { AuthProvider } from './context/AuthContext'; 
import ProtectedRoute from './components/ProtectedRoute'; 

// Page Components
import Home from './pages/Home';
import Login from './pages/Login'; 
import Register from './pages/Register';
import Dashboard from './pages/Dashboard'; 
import Profile from './pages/Profile';     

// Define the Backend URL - Ensure your .env.production has the correct IP
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function App() {
  // --- CONNECTION TEST EFFECT ---
  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log("Testing connection to backend at:", API_BASE_URL);
        // Use the variable we defined above
        await axios.get(`${API_BASE_URL}/test-connection`);
        console.log("--- BACKEND CONNECTION SUCCESSFUL! (200 OK) ---");
      } catch (error) {
        console.error("--- CONNECTION FAILED! ---", error.message);
      }
    };
    
    if (API_BASE_URL) {
      testConnection();
    } else {
      console.warn("VITE_API_BASE_URL is not defined in environment variables!");
    }
  }, []); 

  return (
    <Router> 
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
console.log("Connecting to:", import.meta.env.VITE_API_BASE_URL);

export default App;