import { useState } from 'react';
import { MapPin, Calendar, CheckCircle, Trash2, Info } from 'lucide-react'; // <-- NEW: Info icon

// --- Modification: Added onViewDetails to props ---
const BucketListCard = ({ destination, onToggleVisited, onDelete, onViewDetails }) => {
  const [showDetails, setShowDetails] = useState(false);

  // Helper function to call the API handler for toggle
  const handleToggle = () => {
    // CRITICAL: Pass MongoDB _id and current visited status
    onToggleVisited(destination._id, destination.visited);
  };
  
  const handleDeleteClick = () => {
    // CRITICAL: Pass MongoDB _id
    onDelete(destination._id);
  };

  return (
    <div className={`bg-white rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300 ${
      destination.visited ? 'ring-4 ring-green-400' : ''
    }`}>
      <div className={`h-3 ${destination.visited ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-purple-500 to-pink-500'}`}></div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-full ${destination.visited ? 'bg-green-100' : 'bg-purple-100'}`}>
              <MapPin className={`w-6 h-6 ${destination.visited ? 'text-green-600' : 'text-purple-600'}`} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">{destination.name}</h3>
              <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                <Calendar className="w-4 h-4" />
                {/* Format date from MongoDB string */}
                {destination.plannedDate ? new Date(destination.plannedDate).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
          
          <button
            onClick={handleToggle} 
            className={`p-3 rounded-full transition transform hover:scale-110 ${
              destination.visited
                ? 'bg-green-500 text-white shadow-lg'
                : 'bg-gray-200 text-gray-400 hover:bg-green-100'
            }`}
          >
            <CheckCircle className="w-6 h-6" />
          </button>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-600">Total Budget</span>
            <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
              ${destination.totalBudget.toFixed(2)}
            </span>
          </div>
        </div>

        {/* --- NEW BUTTON FOR DETAIL MODAL (UI Integration) --- */}
        <button
            onClick={() => onViewDetails(destination)} // Pass the whole destination object
            className="w-full text-sm text-purple-600 font-semibold hover:text-pink-500 transition flex items-center justify-center gap-2 mb-3"
        >
            <Info className="w-4 h-4" /> View Insights & Details
        </button>
        {/* --------------------------------------------------- */}

        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full text-sm text-purple-600 font-semibold hover:text-pink-500 transition mb-3"
        >
          {showDetails ? '▲ Hide Expense Breakdown' : '▼ View Expense Breakdown'}
        </button>

        {showDetails && (
          <div className="space-y-2 mb-4">
            {/* Ensure expenses exists before mapping */}
            {destination.expenses && Object.entries(destination.expenses).map(([key, value]) => (
              value > 0 && (
                <div key={key} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                  <span className="text-sm capitalize text-gray-700 font-medium">{key}</span>
                  <span className="text-sm font-bold text-gray-800">${value.toFixed(2)}</span>
                </div>
              )
            ))}
          </div>
        )}

        <button
          onClick={handleDeleteClick}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      </div>
    </div>
  );
};

export default BucketListCard;