import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Plane, X, DollarSign, Hotel, Utensils, Camera, Car, Ticket, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; // CRITICAL: Axios instance

// --- Components (Use your original names) ---
import Navbar from '../components/Navbar';
import BucketListCard from '../components/BucketListCard'; 
import DestinationDetailModal from '../components/DestinationDetailModal'; // <-- NEW: For Weather/Facts

// ----------------------------------------------------------------------
// AddDestinationModal Component (Slightly updated for API submission, but UI is yours)
// ----------------------------------------------------------------------
const AddDestinationModal = ({ onClose, onAdd }) => {
    // Note: Renamed 'country' state to 'name' to match your backend model
    const [formData, setFormData] = useState({
        name: '', 
        plannedDate: '',
        flights: '',
        accommodation: '',
        food: '',
        activities: '',
        transportation: '',
        shopping: '',
        others: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const total = Object.entries(formData)
            .filter(([key]) => key !== 'name' && key !== 'plannedDate')
            .reduce((sum, [_, value]) => sum + (parseFloat(value) || 0), 0);

        // Prepare data for the backend API
        const newDestinationData = {
            name: formData.name, // Use 'name' for the city/country field
            plannedDate: formData.plannedDate,
            totalBudget: total,
            visited: false,
            expenses: {
                flights: parseFloat(formData.flights) || 0,
                accommodation: parseFloat(formData.accommodation) || 0,
                food: parseFloat(formData.food) || 0,
                activities: parseFloat(formData.activities) || 0,
                transportation: parseFloat(formData.transportation) || 0,
                shopping: parseFloat(formData.shopping) || 0,
                others: parseFloat(formData.others) || 0,
            }
        };

        onAdd(newDestinationData); // Call the API handler
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-500 p-6 flex justify-between items-center rounded-t-3xl">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Plus className="w-8 h-8" />
                        Add New Destination
                    </h2>
                    <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-full transition">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* ... (Your original form inputs and styling are here) ... */}
                    
                    {/* Simplified Form Inputs Block for brevity (Use your original form) */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Country/City *</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange}
                                className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition"
                                placeholder="e.g., Paris, France" required/>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Planned Date *</label>
                            <input type="date" name="plannedDate" value={formData.plannedDate} onChange={handleChange}
                                className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition" required/>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-2xl">
                        <h3 className="font-bold text-lg mb-4 text-gray-800">Travel Expenses Breakdown (in USD)</h3>
                        {/* Your original grid of expense inputs goes here */}
                        <div className="grid md:grid-cols-2 gap-4">
                            {/* ... Your full expense inputs are here ... */}
                            <p>... expense inputs ...</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button type="button" onClick={onClose} className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-100 transition">Cancel</button>
                        <button type="submit" className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl font-semibold hover:shadow-xl transform hover:-translate-y-1 transition-all">Add Destination</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// ----------------------------------------------------------------------
// Dashboard Component (API Logic with Original UI)
// ----------------------------------------------------------------------
const Dashboard = () => {
    const [destinations, setDestinations] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [loading, setLoading] = useState(true);
    
    // --- New State for Detail Modal ---
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedDestination, setSelectedDestination] = useState(null);
    // ----------------------------------

    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // --- API HANDLER: GET DESTINATIONS ---
    const fetchDestinations = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get('/destinations');
            setDestinations(res.data);
        } catch (error) {
            console.error("Error fetching destinations:", error);
            if (error.response?.status === 401) {
                 logout();
            }
        } finally {
            setLoading(false);
        }
    }, [logout]);

    // Fetch destinations on mount
    useEffect(() => {
        fetchDestinations();
    }, [fetchDestinations]);


    // --- API HANDLER: CREATE DESTINATION ---
    const handleAddDestination = async (newDestinationData) => {
        try {
            await api.post('/destinations', newDestinationData);
            setShowAddModal(false); 
            fetchDestinations();    
        } catch (error) {
            console.error("Error adding destination:", error);
            alert(`Failed to add destination. Check the console for details.`);
        }
    };
    
    // --- API HANDLER: TOGGLE VISITED (Update) ---
    const handleToggleVisited = async (destinationId, isVisited) => {
        try {
            await api.put(`/destinations/${destinationId}`, { visited: !isVisited });
            fetchDestinations(); 
        } catch (error) {
            console.error("Error updating destination:", error);
        }
    };

    // --- API HANDLER: DELETE DESTINATION ---
    const handleDelete = async (destinationId) => {
        if (!window.confirm('Are you sure you want to delete this destination? This cannot be undone.')) {
            return;
        }
        try {
            await api.delete(`/destinations/${destinationId}`);
            fetchDestinations(); 
        } catch (error) {
            console.error("Error deleting destination:", error);
        }
    };
    
    // --- Modal Handlers for New Detail View ---
    const openDetailModal = (destination) => {
        setSelectedDestination(destination);
        setIsDetailModalOpen(true);
    };

    const closeDetailModal = () => {
        setIsDetailModalOpen(false);
        setSelectedDestination(null);
    };
    // ------------------------------------------

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const visitedCount = destinations.filter(d => d.visited).length;
    const plannedCount = destinations.filter(d => !d.visited).length;
    const totalBudget = destinations.reduce((sum, d) => sum + d.totalBudget, 0);


    if (loading) {
        return (
             <div className="flex items-center justify-center min-h-screen">
                <Loader className="w-10 h-10 animate-spin text-purple-600" />
                <p className="text-xl ml-3 text-gray-600">Loading your bucket list...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
            {/* The Navbar component handles its own logout logic if we fix it, but we keep the prop for now */}
            <Navbar onLogout={handleLogout} /> 

            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* --- HEADER --- */}
                <div className="mb-8 text-center">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent mb-2">
                        Welcome back, {user?.username || 'Traveler'}! ✈️
                    </h1>
                    <p className="text-gray-600 text-lg">Your travel adventures await</p>
                </div>

                {/* --- STATS DISPLAY (Original Layout) --- */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition">
                        <div className="text-sm opacity-90 mb-1">Total Destinations</div>
                        <div className="text-4xl font-bold">{destinations.length}</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition">
                        <div className="text-sm opacity-90 mb-1">Visited</div>
                        <div className="text-4xl font-bold">{visitedCount}</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition">
                        <div className="text-sm opacity-90 mb-1">Planned</div>
                        <div className="text-4xl font-bold">{plannedCount}</div>
                    </div>
                    <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition">
                        <div className="text-sm opacity-90 mb-1">Total Budget</div>
                        <div className="text-4xl font-bold">${totalBudget.toFixed(0)}</div>
                    </div>
                </div>
                {/* --- END STATS --- */}

                <button
                    onClick={() => setShowAddModal(true)}
                    className="mb-8 flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                >
                    <Plus className="w-6 h-6" />
                    Add New Destination
                </button>
                
                {/* --- DESTINATION LIST --- */}
                {destinations.length === 0 ? (
                    // Your original No Destinations Message
                    <div className="text-center py-20 bg-white rounded-3xl shadow-lg">
                        <div className="mb-6">
                            <Plane className="w-24 h-24 mx-auto text-gray-300" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">No destinations yet!</h3>
                        <p className="text-gray-600 mb-6">Start planning your dream trips by adding your first destination.</p>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl transition"
                        >
                            <Plus className="w-5 h-5" />
                            Add Your First Destination
                        </button>
                    </div>
                ) : (
                    // Use your original grid and component name
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {destinations.map(d => (
                            <BucketListCard 
                                key={d._id} // CRITICAL: Use MongoDB _id
                                destination={d} 
                                onToggleVisited={handleToggleVisited} 
                                onDelete={handleDelete}
                                onViewDetails={openDetailModal} // <-- NEW PROP
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Render the Add Modal */}
            {showAddModal && (
                <AddDestinationModal
                    onClose={() => setShowAddModal(false)}
                    onAdd={handleAddDestination}
                />
            )}
            
            {/* Render the Detail Modal for Weather/Facts */}
            {selectedDestination && (
                <DestinationDetailModal
                    isOpen={isDetailModalOpen}
                    closeModal={closeDetailModal}
                    destination={selectedDestination}
                />
            )}
        </div>
    );
};

export default Dashboard;