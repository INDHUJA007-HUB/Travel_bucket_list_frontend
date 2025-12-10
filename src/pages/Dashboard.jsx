import { useState } from 'react';
import { Plus } from 'lucide-react';
import BucketListCard from '../components/BucketListCard';

const Dashboard = () => {
  const [bucketList, setBucketList] = useState([
    {
      id: 1,
      name: 'Japan',
      plannedDate: 'March 2025',
      totalBudget: 5000,
      visited: false,
      activities: [
        { name: 'Visit Tokyo Tower', cost: 150 },
        { name: 'Stay at Ryokan', cost: 800 },
        { name: 'Try Authentic Sushi', cost: 200 },
        { name: 'Explore Kyoto Temples', cost: 100 },
      ],
    },
    {
      id: 2,
      name: 'Italy',
      plannedDate: 'June 2025',
      totalBudget: 4500,
      visited: false,
      activities: [
        { name: 'Colosseum Tour', cost: 120 },
        { name: 'Venice Gondola Ride', cost: 300 },
        { name: 'Tuscany Wine Tasting', cost: 250 },
        { name: 'Visit Vatican City', cost: 80 },
      ],
    },
    {
      id: 3,
      name: 'Iceland',
      plannedDate: 'September 2024',
      totalBudget: 6000,
      visited: true,
      activities: [
        { name: 'Blue Lagoon Visit', cost: 200 },
        { name: 'Northern Lights Tour', cost: 400 },
        { name: 'Golden Circle Tour', cost: 350 },
        { name: 'Glacier Hiking', cost: 500 },
      ],
    },
  ]);

  const handleToggleVisited = (id) => {
    setBucketList(bucketList.map(item =>
      item.id === id ? { ...item, visited: !item.visited } : item
    ));
  };

  const visitedCount = bucketList.filter(item => item.visited).length;
  const plannedCount = bucketList.filter(item => !item.visited).length;
  const totalBudget = bucketList.reduce((sum, item) => sum + item.totalBudget, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">My Travel Bucket List</h1>
          <p className="text-gray-600">Plan your dream destinations and track your adventures</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-sm text-gray-600 mb-1">Total Countries</div>
            <div className="text-3xl font-bold text-blue-600">{bucketList.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-sm text-gray-600 mb-1">Visited</div>
            <div className="text-3xl font-bold text-green-600">{visitedCount}</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-sm text-gray-600 mb-1">Planned</div>
            <div className="text-3xl font-bold text-purple-600">{plannedCount}</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-sm text-gray-600 mb-1">Total Budget</div>
            <div className="text-3xl font-bold text-orange-600">${totalBudget}</div>
          </div>
        </div>

        {/* Add New Button */}
        <button className="mb-6 flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition shadow-lg">
          <Plus className="w-5 h-5" />
          <span>Add New Destination</span>
        </button>

        {/* Bucket List Grid */}
        {bucketList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bucketList.map((country) => (
              <BucketListCard
                key={country.id}
                country={country}
                visited={country.visited}
                onToggleVisited={handleToggleVisited}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-500 text-lg">No destinations yet. Start adding your dream travel locations!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;