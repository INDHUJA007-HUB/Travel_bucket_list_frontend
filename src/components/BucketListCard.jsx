import { MapPin, DollarSign, Calendar, CheckCircle } from 'lucide-react';

const BucketListCard = ({ country, visited, onToggleVisited }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 border-2 transition-all hover:shadow-xl ${
      visited ? 'border-green-500 bg-green-50' : 'border-gray-200'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <MapPin className={`w-6 h-6 ${visited ? 'text-green-600' : 'text-blue-600'}`} />
          <h3 className="text-xl font-bold text-gray-800">{country.name}</h3>
        </div>
        <button
          onClick={() => onToggleVisited(country.id)}
          className={`p-2 rounded-full transition ${
            visited
              ? 'bg-green-100 text-green-600 hover:bg-green-200'
              : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
          }`}
        >
          <CheckCircle className="w-6 h-6" />
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center text-gray-600">
          <Calendar className="w-4 h-4 mr-2" />
          <span className="text-sm">Planned: {country.plannedDate}</span>
        </div>

        <div className="flex items-center text-gray-600">
          <DollarSign className="w-4 h-4 mr-2" />
          <span className="text-sm font-semibold">Total Budget: ${country.totalBudget}</span>
        </div>

        <div className="mt-4">
          <h4 className="font-semibold text-gray-700 mb-2">Things to Do:</h4>
          <ul className="space-y-2">
            {country.activities.map((activity, index) => (
              <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                <span className="text-sm text-gray-700">{activity.name}</span>
                <span className="text-sm font-semibold text-blue-600">${activity.cost}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BucketListCard;