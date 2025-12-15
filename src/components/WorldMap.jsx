// D:\TravelbucketList\travel_bucketlist\src\components\WorldMap.jsx

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import React from 'react';
import { Plane, CheckCircle, DollarSign, Calendar } from 'lucide-react';

// --- FIX LEAFLET ICON ISSUES ---
// React-Leaflet requires this manual fix to correctly load the marker icon images
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Custom Icon Logic for Visited vs. Planned
const getCustomIcon = (visited) => {
    // Green for Visited, Purple for Planned
    const color = visited ? '#059669' : '#9333ea'; 
    const IconComponent = visited ? CheckCircle : Plane;

    // Use a DivIcon for better styling integration with Tailwind/Lucide icons
    const iconHtml = `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-icon-component">
                            ${visited 
                                ? '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>' 
                                : '<path d="M17.8 19.2 20.5 17.1c.3-.2.5-.5.5-.9V5.1c0-.4-.2-.7-.5-.9L17.8 3.8l-1.6 1.6c-.6.6-1.5.6-2.1 0L12 3.5 9.9 5.4c-.6.6-1.5.6-2.1 0L6.2 3.8 3.5 5.9c-.3.2-.5.5-.5.9v10.1c0 .4.2.7.5.9L6.2 19.2l1.6-1.6c.6-.6 1.5-.6 2.1 0L12 20.5l2.1-1.9c.6-.6 1.5-.6 2.1 0z"/>'}
                        </svg>
                      </div>`;
    
    return L.divIcon({
        className: 'custom-map-icon',
        html: iconHtml,
        iconSize: [30, 30],
        iconAnchor: [15, 15], // Center the icon
    });
};

const WorldMap = ({ destinations }) => {
    // Center map on the world view by default
    const center = [20, 0]; 
    
    // Filter out destinations without valid coordinates (like the old default 0,0)
    const validDestinations = destinations.filter(d => 
        d.latitude !== undefined && d.longitude !== undefined && 
        (d.latitude !== 0 || d.longitude !== 0) // Ensures we skip markers at the center of the world
    );

    return (
        <div className="rounded-2xl shadow-xl overflow-hidden h-[500px] w-full border-4 border-gray-100">
            <MapContainer 
                center={center} 
                zoom={2} 
                minZoom={1}
                scrollWheelZoom={true} // Allow users to zoom with mouse wheel
                className="h-full w-full"
            >
                {/* TileLayer provides the actual map imagery (OpenStreetMap tiles) */}
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {validDestinations.map((d) => (
                    <Marker 
                        key={d._id} 
                        position={[d.latitude, d.longitude]}
                        icon={getCustomIcon(d.visited)}
                    >
                        <Popup>
                            <div className="font-bold text-lg text-gray-800 mb-1">{d.name}</div>
                            
                            {/* Status Label */}
                            <div className={`text-sm font-medium mb-2 ${d.visited ? 'text-emerald-600' : 'text-purple-600'}`}>
                                {d.visited ? <CheckCircle className="w-4 h-4 inline mr-1" /> : <Plane className="w-4 h-4 inline mr-1" />}
                                {d.visited ? 'Destination Visited' : 'Destination Planned'}
                            </div>

                            {/* Budget and Date */}
                            <p className="text-xs text-gray-600 flex items-center mb-1">
                                <DollarSign className="w-3 h-3 mr-1" />
                                Budget: ${d.totalBudget.toFixed(0)}
                            </p>
                            <p className="text-xs text-gray-600 flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                Date: {d.plannedDate ? new Date(d.plannedDate).toLocaleDateString() : 'N/A'}
                            </p>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default WorldMap;