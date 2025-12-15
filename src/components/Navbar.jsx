// D:\TravelbucketList\travel_bucketlist\src\components\Navbar.jsx

import { Map, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext'; // <-- Keep this import

// --- FIX: Remove the 'onLogout' prop from the signature ---
const Navbar = ({ user }) => { 
    // FIX: Get both 'user' and 'logout' directly from the context
    // NOTE: If you are passing 'user' from the parent, you should access it as { user }
    // If you want to rely purely on context, use: const { user, logout } = useAuth();
    
    const { user: authUser, logout } = useAuth(); // Destructure user and logout

    // Decide which user object to use (prefer the context version if available)
    const displayUser = user || authUser;

    return (
      // You may need to handle the case where displayUser is null (if not logged in)
      // We assume this component is only rendered on the Dashboard (protected route)
      <nav className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 shadow-xl sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 text-white">
            <Map className="w-8 h-8" />
            <span className="text-2xl font-bold">Travel Bucket List</span>
          </div>
          <div className="flex items-center gap-4 text-white">
            {/* Display username, safely handling null */}
            <span className="font-semibold">Welcome, {displayUser?.username || 'Traveler'}!</span> 
            
            {/* FIX: onClick now calls the function from useAuth() */}
            <button
              onClick={logout} // <-- THIS IS NOW THE FUNCTION FROM AUTHCONTEXT
              className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-6 py-2 rounded-xl font-semibold hover:bg-white/30 transition"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </nav>
    );
};

export default Navbar;