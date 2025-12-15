// travel_bucketlist/src/components/PrivateRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
    // Get the authentication status from your context
    const { isAuthenticated } = useAuth(); 

    // If the user is authenticated, render the children (the Dashboard component)
    if (isAuthenticated) {
        return children;
    }

    // If the user is NOT authenticated, redirect them to the /login page
    return <Navigate to="/login" replace />;
};

export default PrivateRoute;