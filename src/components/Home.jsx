// travel_bucketlist/src/components/Home.jsx

import React from 'react';

const Home = () => {
  return (
    <div className="container mx-auto p-8 text-center">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-4">Welcome to Travel Tracker!</h1>
      <p className="text-xl text-gray-600 mb-8">Plan, track, and manage your dream destinations.</p>
      
      <div className="bg-indigo-100 p-6 rounded-lg shadow-inner inline-block">
        <p className="text-indigo-800 font-semibold">
          Please Register or Login to start managing your bucket list.
        </p>
      </div>
    </div>
  );
};

export default Home;