import { Link } from 'react-router-dom';
import { Plane, Map, Plus } from 'lucide-react';

// Tailwind CSS classes for the animated background (optional, but adds a nice effect)
const AnimatedBackground = () => (
    <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Subtle moving color waves in the background */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10 animate-pulse" style={{ animationDuration: '40s' }}></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-cyan-500/10 via-blue-500/10 to-green-500/10 animate-pulse" style={{ animationDuration: '30s' }}></div>
        
        {/* Decorative SVG/Shapes (Optional: Can add custom SVGs for clouds/globes) */}
        <div className="absolute w-64 h-64 bg-pink-300/30 rounded-full blur-3xl opacity-50 top-1/4 left-1/4 animate-float" style={{ animationDuration: '8s' }}></div>
        <div className="absolute w-48 h-48 bg-purple-300/30 rounded-full blur-3xl opacity-50 bottom-1/4 right-1/4 animate-float delay-1000" style={{ animationDuration: '10s' }}></div>
    </div>
);

const Home = () => {
    return (
        // Main container with a calming light background
        <div className="relative min-h-screen bg-white text-gray-800 flex flex-col justify-center items-center overflow-hidden p-4">
            
            <AnimatedBackground />

            {/* Content Container (Layered above the background) */}
            <div className="relative z-10 text-center max-w-4xl p-8 bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-100 animate-slide-in">
                
                {/* Logo/Icon */}
                <div className="flex justify-center mb-6">
                    <Plane className="w-16 h-16 text-white bg-gradient-to-r from-purple-600 to-pink-500 p-3 rounded-full shadow-lg" />
                </div>

                {/* Main Heading */}
                <h1 className="text-6xl font-extrabold mb-4 bg-gradient-to-r from-purple-700 via-pink-600 to-orange-500 bg-clip-text text-transparent animate-fade-in delay-500">
                    Your World Awaits. Plan It.
                </h1>

                {/* Subheading */}
                <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto animate-fade-in delay-700">
                    The ultimate tool to track your dream destinations, map your adventures, and manage your travel budget—all in one place.
                </p>

                {/* Dynamic Call-to-Action Buttons */}
                <div className="flex justify-center space-x-6 animate-fade-in delay-1000">
                    
                    <Link 
                        to="/register" 
                        className="flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                    >
                        <Plus className="w-6 h-6" />
                        Get Started
                    </Link>
                    
                    <Link 
                        to="/login" 
                        className="flex items-center gap-3 bg-white border-2 border-purple-500 text-purple-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-purple-50 transform hover:-translate-y-1 transition-all duration-300"
                    >
                        <Map className="w-6 h-6" />
                        I Already Have a Map
                    </Link>
                </div>
            </div>

            {/* Footer or credit area (optional) */}
            <div className="absolute bottom-4 text-xs text-gray-400 z-10">
                &copy; 2024 Travel Tracker. Designed for seamless adventure planning.
            </div>
        </div>
    );
};

export default Home;