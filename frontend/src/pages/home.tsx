import React from "react";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const username = localStorage.getItem("username") || "User";
  const navigate = useNavigate();

  return (
    <div className="flex flex-col w-full">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Welcome to Hive, {username}!</h1>
        <p className="text-lg mb-6">
          Your community hub for sharing news and connecting with others.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {/* Activity Card */}
        <div className="bg-black rounded-lg p-6 border border-gray-800 h-full">
          <h2 className="text-xl font-semibold mb-4 text-white">Recent Activity</h2>
          <div className="space-y-4">
            <p className="text-gray-300">No recent activity to display.</p>
            <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
              <p className="text-sm text-gray-400">Activity will appear here as you interact with communities</p>
            </div>
          </div>
        </div>
        
        {/* Communities Card */}
        <div className="bg-black rounded-lg p-6 border border-gray-800 h-full">
          <h2 className="text-xl font-semibold mb-4 text-white">Your Communities</h2>
          <div className="space-y-4">
            <p className="text-gray-300">Join communities to see them here.</p>
            <button 
              onClick={() => navigate("/community")}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white p-3 rounded-lg border border-gray-700 transition"
            >
              Browse Communities
            </button>
          </div>
        </div>
        
        {/* Quick Actions Card */}
        <div className="bg-black rounded-lg p-6 border border-gray-800 h-full">
          <h2 className="text-xl font-semibold mb-4 text-white">Quick Actions</h2>
          <div className="space-y-3">
            <button 
              onClick={() => navigate("/createCommunity")}
              className="w-full bg-red-600 hover:bg-red-700 text-white p-3 rounded-lg transition mb-3"
            >
              Create New Community
            </button>
            <button 
              onClick={() => navigate("/joinCommunity")}
              className="w-full bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-lg transition"
            >
              Join a Community
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;