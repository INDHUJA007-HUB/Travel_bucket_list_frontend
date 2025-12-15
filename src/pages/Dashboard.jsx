import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Plus, Map, Globe, CheckCircle, Plane, DollarSign, Loader, XCircle, Trash2, Edit, Save, Calendar, Clock } from 'lucide-react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import WorldMap from '../components/WorldMap'; // Keep the map component

// --- Helper Components for UI Clarity ---

// 1. Destination Card Component
const DestinationCard = ({ destination, onDelete, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedBudget, setEditedBudget] = useState(destination.totalBudget);

    const handleSave = () => {
        onUpdate(destination._id, { totalBudget: parseFloat(editedBudget) });
        setIsEditing(false);
    };

    const toggleVisited = () => {
        onUpdate(destination._id, { visited: !destination.visited });
    };

    const statusClass = destination.visited
        ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500' // Green for Visited
        : 'bg-purple-500/10 text-purple-700 border-purple-500'; // Purple for Planned
        
    const Icon = destination.visited ? CheckCircle : Plane;
    
    // Formatting the date to be more user-friendly
    const plannedDate = destination.plannedDate 
        ? new Date(destination.plannedDate).toLocaleDateString()
        : 'No date set';

    return (
        <div className={`
            p-6 rounded-2xl shadow-xl transition-all duration-300 transform 
            hover:scale-[1.02] hover:shadow-2xl 
            bg-white border-l-4 ${destination.visited ? 'border-l-emerald-500' : 'border-l-purple-500'}
        `}>
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                    <Icon className={`w-5 h-5 mr-2 ${destination.visited ? 'text-emerald-500' : 'text-purple-500'}`} />
                    {destination.name}
                </h3>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusClass}`}>
                    {destination.visited ? 'Visited' : 'Planned'}
                </span>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
                <p className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="font-medium">Date:</span> {plannedDate}
                </p>

                <div className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="font-medium">Budget:</span> 
                    {isEditing ? (
                        <input
                            type="number"
                            value={editedBudget}
                            onChange={(e) => setEditedBudget(e.target.value)}
                            className="ml-2 w-24 p-1 border rounded focus:ring-purple-500 focus:border-purple-500"
                        />
                    ) : (
                        <span className="ml-2 text-lg font-semibold text-indigo-600">
                            ${destination.totalBudget ? destination.totalBudget.toFixed(0) : 0}
                        </span>
                    )}
                </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end space-x-3">
                {isEditing ? (
                    <button 
                        onClick={handleSave} 
                        className="p-2 text-sm bg-indigo-500 text-white rounded-full hover:bg-indigo-600 transition"
                        title="Save Changes"
                    >
                        <Save className="w-4 h-4" />
                    </button>
                ) : (
                    <button 
                        onClick={() => setIsEditing(true)} 
                        className="p-2 text-sm text-gray-500 rounded-full hover:bg-gray-100 transition"
                        title="Edit Budget"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                )}
                
                <button 
                    onClick={toggleVisited} 
                    className={`p-2 text-sm rounded-full transition ${destination.visited ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-green-100 text-green-600 hover:bg-green-200'}`}
                    title={destination.visited ? 'Mark as Planned' : 'Mark as Visited'}
                >
                    <CheckCircle className="w-4 h-4" />
                </button>

                <button 
                    onClick={() => onDelete(destination._id)} 
                    className="p-2 text-sm text-red-500 rounded-full hover:bg-red-50 transition"
                    title="Delete Destination"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};


// 2. Statistics Card Component
const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className={`p-6 bg-white rounded-2xl shadow-lg border-b-4 ${color} transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}>
        <div className={`flex items-center justify-between`}>
            <p className="text-lg font-semibold text-gray-600">{title}</p>
            <Icon className={`w-8 h-8 ${color.replace('border-', 'text-')}`} />
        </div>
        <h2 className="text-4xl font-extrabold mt-2 text-gray-800">{value}</h2>
    </div>
);

// 3. Add Destination Modal (Kept Simple)
const AddDestinationModal = ({ onClose, onAdd }) => {
    const [name, setName] = useState('');
    const [totalBudget, setTotalBudget] = useState(0);
    const [plannedDate, setPlannedDate] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        // Simplified expense structure for initial creation
        await onAdd({
            name,
            totalBudget: parseFloat(totalBudget),
            plannedDate: plannedDate || undefined,
            expenses: {
                flights: 0,
                accommodation: 0,
                food: 0,
                activities: 0,
                transportation: 0,
                shopping: 0,
                others: 0,
            }
        });
        setLoading(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-xl shadow-2xl max-w-lg w-full transform transition-all duration-300 animate-zoom-in">
                <h3 className="text-2xl font-bold mb-6 text-gray-800">Add New Adventure</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Destination Name</label>
                        <input 
                            type="text" 
                            required 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-purple-500 focus:border-purple-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Estimated Budget ($)</label>
                        <input 
                            type="number" 
                            value={totalBudget} 
                            onChange={(e) => setTotalBudget(e.target.value)} 
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-purple-500 focus:border-purple-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Planned Date</label>
                        <input 
                            type="date" 
                            value={plannedDate} 
                            onChange={(e) => setPlannedDate(e.target.value)} 
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-purple-500 focus:border-purple-500"
                        />
                    </div>
                    
                    <div className="flex justify-end space-x-4 pt-4">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg shadow-md hover:from-purple-600 hover:to-pink-600 transition disabled:opacity-50 flex items-center"
                            disabled={loading}
                        >
                            {loading ? <Loader className="w-5 h-5 mr-2 animate-spin" /> : <Plus className="w-5 h-5 mr-2" />}
                            Add Destination
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


// --- MAIN DASHBOARD COMPONENT ---

const Dashboard = () => {
    const { user, handleLogout } = useAuth();
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [error, setError] = useState(null);

    const fetchDestinations = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/destinations');
            setDestinations(response.data);
        } catch (err) {
            console.error("Error fetching destinations:", err);
            setError("Failed to load destinations. Please try logging out and back in.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (user) {
            fetchDestinations();
        }
    }, [user, fetchDestinations]);

    const handleAddDestination = async (newDestination) => {
        try {
            await api.post('/destinations', newDestination);
            fetchDestinations(); // Refresh list
        } catch (err) {
            console.error("Error adding destination:", err);
        }
    };

    const handleDeleteDestination = async (id) => {
        if (!window.confirm("Are you sure you want to delete this destination?")) return;
        try {
            await api.delete(`/destinations/${id}`);
            fetchDestinations(); // Refresh list
        } catch (err) {
            console.error("Error deleting destination:", err);
        }
    };

    const handleUpdateDestination = async (id, updates) => {
        try {
            await api.put(`/destinations/${id}`, updates);
            // Optimistically update the state for smoother UI
            setDestinations(prev => prev.map(d => d._id === id ? { ...d, ...updates } : d));
        } catch (err) {
            console.error("Error updating destination:", err);
            fetchDestinations(); // Fallback to full refresh on error
        }
    };


    // --- MEMOIZED STATISTICS CALCULATION ---
    const stats = useMemo(() => {
        const total = destinations.length;
        const visited = destinations.filter(d => d.visited).length;
        const planned = total - visited;
        const totalBudget = destinations.reduce((sum, d) => sum + d.totalBudget, 0);

        return { total, visited, planned, totalBudget };
    }, [destinations]);
    // ----------------------------------------


    return (
        // New Vibrant Background Gradient and structure
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
            <Navbar onLogout={handleLogout} user={user} />
            
            <div className="container mx-auto px-4 py-12 max-w-7xl">
                
                {/* Header Section */}
                <header className="mb-10 text-center">
                    <h1 className="text-5xl font-extrabold text-gray-900 mb-2 leading-tight">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                            {user ? `${user.username}'s` : 'Your'} Travel Map
                        </span>
                    </h1>
                    <p className="text-xl text-gray-600">Track your progress and plan your next adventure.</p>
                </header>

                {/* Statistics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                    <StatCard 
                        title="Total Destinations" 
                        value={stats.total} 
                        icon={Globe} 
                        color="border-purple-500"
                    />
                    <StatCard 
                        title="Visited Places" 
                        value={stats.visited} 
                        icon={CheckCircle} 
                        color="border-emerald-500"
                    />
                    <StatCard 
                        title="Places to Go" 
                        value={stats.planned} 
                        icon={Plane} 
                        color="border-pink-500"
                    />
                    <StatCard 
                        title="Total Budget" 
                        value={`$${stats.totalBudget.toFixed(0)}`} 
                        icon={DollarSign} 
                        color="border-indigo-500"
                    />
                </div>

                {/* --- Map View Section --- */}
                <div className="mb-12 p-6 bg-white rounded-3xl shadow-2xl animate-fade-in-up">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4 flex items-center">
                        <Map className="w-6 h-6 mr-3 text-purple-600" />
                        World Map View
                    </h2>
                    {/* Render the map with the fetched destinations */}
                    <WorldMap destinations={destinations} />
                </div>
                {/*  */}

                {/* Destination List Header and Button */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-800">
                        {stats.total > 0 ? 'My Travel Bucket List' : 'Time to start your list!'}
                    </h2>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:from-purple-700 hover:to-pink-700 transition transform hover:-translate-y-0.5"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Add New Destination
                    </button>
                </div>

                {/* --- Destination List and Loading State --- */}
                {loading && (
                    <div className="text-center p-8 bg-white/50 rounded-xl shadow-inner">
                        <Loader className="w-8 h-8 mx-auto animate-spin text-purple-500" />
                        <p className="mt-4 text-gray-600">Loading your travel adventures...</p>
                    </div>
                )}
                
                {error && (
                    <div className="text-center p-8 bg-red-100 border border-red-400 text-red-700 rounded-xl shadow-inner flex items-center justify-center">
                        <XCircle className="w-6 h-6 mr-3" />
                        <p>{error}</p>
                    </div>
                )}

                {!loading && destinations.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {destinations.map(d => (
                            <DestinationCard
                                key={d._id}
                                destination={d}
                                onDelete={handleDeleteDestination}
                                onUpdate={handleUpdateDestination}
                            />
                        ))}
                    </div>
                )}
                
                {!loading && destinations.length === 0 && !error && (
                    <div className="text-center p-16 bg-white rounded-3xl shadow-lg border border-dashed border-gray-300">
                        <Plane className="w-12 h-12 mx-auto text-purple-400" />
                        <h3 className="mt-4 text-xl font-semibold text-gray-900">No Destinations Added</h3>
                        <p className="mt-2 text-gray-500">
                            Get started by clicking the "Add New Destination" button above.
                        </p>
                    </div>
                )}

                {/* Modal Renders Here */}
                {showAddModal && (
                    <AddDestinationModal 
                        onClose={() => setShowAddModal(false)} 
                        onAdd={handleAddDestination} 
                    />
                )}
            </div>
        </div>
    );
};

export default Dashboard;