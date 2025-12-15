// travel_bucketlist/src/components/auth/Login.jsx

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
// Import useNavigate to redirect after successful login
import { useNavigate } from 'react-router-dom'; 

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    
    // If the user is already logged in, redirect them away from the login page
    if (isAuthenticated) {
        navigate('/');
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        setError('');

        setLoading(true);
        try {
            await login({ email, password });
            // Redirect to the dashboard on successful login
            navigate('/'); 
        } catch (err) {
            setError(err); // Display the error message from the backend
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-5 text-center text-indigo-600">Login to Your Account</h2>
            {error && <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>}
            
            <form onSubmit={submitHandler}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
                    >
                        {loading ? 'Logging In...' : 'Login'}
                    </button>
                    <span 
                        className="inline-block align-baseline font-bold text-sm text-indigo-600 hover:text-indigo-800 cursor-pointer"
                        onClick={() => navigate('/register')}
                    >
                        Register
                    </span>
                </div>
            </form>
        </div>
    );
};

export default Login;