// D:\TravelbucketList\travel_bucketlist\src\components\DestinationDetailModal.jsx

import React, { useState, useEffect } from 'react';
import Modal from 'react-modal'; // <-- REQUIRED IMPORT
import axios from 'axios';
import { Cloud, MapPin, Loader, X, Info, ChevronRight } from 'lucide-react';

// Set the root element for accessibility purposes (REQUIRED by react-modal)
Modal.setAppElement('#root'); 

// Define the Backend URL (or import it from your services/api.js file if you use one)
const API_BASE_URL = 'import.meta.env.VITE_API_BASE_URL'; 

const DestinationDetailModal = ({ isOpen, closeModal, destination }) => {
    const [weather, setWeather] = useState(null);
    const [facts, setFacts] = useState(null);
    const [loading, setLoading] = useState(true);

    // Assuming destination.name is the full location string (e.g., "Paris, France")
    const cityName = destination?.name; 

    useEffect(() => {
        if (!isOpen || !cityName) {
            setLoading(true); // Reset loading state when closed or no city
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            try {
                // --- FIX 1: Use absolute URL with API_BASE_URL ---
                // 1. Fetch Weather Data (from /api/weather/:cityName)
                const weatherRes = await axios.get(`${API_BASE_URL}/weather/${encodeURIComponent(cityName)}`);
                setWeather(weatherRes.data);

                // 2. Fetch City Facts/Recommendations (from /api/facts/:cityName)
                const factsRes = await axios.get(`${API_BASE_URL}/facts/${encodeURIComponent(cityName)}`);
                setFacts(factsRes.data);
                // ----------------------------------------------------

            } catch (error) {
                console.error("Error fetching city insights:", error);
                setWeather(null); 
                setFacts(null);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        // Cleanup function for useEffect (optional but good practice)
        return () => {
            setWeather(null);
            setFacts(null);
        };
    }, [isOpen, cityName]); 

    // Handle case where modal is open but city name is somehow missing
    if (!destination) return null;

    return (
        // --- FIX 2: WRAP THE CONTENT IN THE <Modal> COMPONENT ---
        <Modal
            isOpen={isOpen}
            onRequestClose={closeModal} // Allows closing via Escape key or overlay click
            contentLabel={`Details for ${cityName}`}
            className="Modal bg-white p-8 rounded-xl shadow-2xl max-w-2xl mx-auto my-12 relative overflow-y-auto"
            overlayClassName="Overlay fixed inset-0 bg-black bg-opacity-70 flex justify-center items-start z-50"
        >
            <button 
                onClick={closeModal} 
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-900"
            >
                <X className="w-6 h-6" />
            </button>

            <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 mb-6 border-b pb-2">
                {cityName} Insights
            </h2>

            {loading ? (
                <div className="flex items-center justify-center p-10 text-gray-500">
                    <Loader className="w-6 h-6 animate-spin mr-3" />
                    Loading weather and travel facts...
                </div>
            ) : (
                <div className="space-y-8">
                    
                    {/* A. Weather Display Section */}
                    <div className="bg-purple-50 p-6 rounded-lg border-l-4 border-purple-400 shadow-md">
                        <h3 className="text-xl font-semibold mb-3 flex items-center gap-2 text-purple-700">
                            <Cloud className="w-5 h-5" /> Current Weather
                        </h3>
                        {weather ? (
                            <div className="flex justify-between items-center">
                                <p className="text-5xl font-light text-gray-800">
                                    {Math.round(weather.temperature)}°C
                                </p>
                                <div>
                                    <p className="font-medium capitalize text-gray-700">{weather.description}</p>
                                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                        <MapPin className="w-4 h-4" /> {weather.city}, {weather.country}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">Weather data is unavailable for this location.</p>
                        )}
                    </div>

                    {/* B. Facts & Recommendations Section */}
                    <div className="bg-white p-6 rounded-lg border-l-4 border-pink-400 shadow-md">
                        <h3 className="text-xl font-semibold mb-3 flex items-center gap-2 text-pink-700">
                            <Info className="w-5 h-5" /> Travel Facts & Recommendations
                        </h3>
                        {facts ? (
                            <div className="space-y-4">
                                <p className="text-gray-700 italic border-l-4 border-gray-200 pl-4">
                                    {facts.fact}
                                </p>
                                <p className="font-semibold text-sm mt-4 text-gray-600">Top Attractions:</p>
                                <ul className="list-none space-y-2 ml-2 text-sm text-gray-700">
                                    {facts.attractions?.map((attraction, index) => (
                                        <li key={index} className="flex items-center gap-2">
                                            <ChevronRight className="w-4 h-4 text-pink-500 flex-shrink-0" />
                                            {attraction}
                                        </li>
                                    ))}
                                </ul>
                                {facts.link && (
                                    <a 
                                        href={facts.link} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="text-purple-500 hover:text-purple-700 text-sm font-medium inline-block mt-3"
                                    >
                                        View more details online
                                    </a>
                                )}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">No specific recommendations found for this city.</p>
                        )}
                    </div>
                </div>
            )}
        </Modal>
        // -----------------------------------------------------
    );
};

export default DestinationDetailModal;