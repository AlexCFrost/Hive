import { apiEndpoint } from "@/lib/api-config";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import toast, { Toaster } from 'react-hot-toast';

interface Community {
  _id: string;
  name: string;
  description: string;
  creator: string;
  members: string[];
  joinRequests: { user: string }[];
}

const JoinCommunity = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  useEffect(() => {
    fetchCommunities();
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  const fetchCommunities = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(apiEndpoint('/bee/community/all'), {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch communities');
      }

      const data = await response.json();

      // Filtering out communities created or already joined by the user
      const availableCommunities = data.filter(
        (community: Community) => 
          community.creator !== username && 
          !community.members.includes(username || '')
      );

      setCommunities(availableCommunities);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch communities");
      setLoading(false);
    }
  };

  const handleJoinRequest = async (communityId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(apiEndpoint(`/bee/community/${communityId}/join`), {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send join request');
      }

      // Remove the community from the list after sending request
      setCommunities(prevCommunities => 
        prevCommunities.filter(comm => comm._id !== communityId)
      );

      toast.success('Join request sent successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send join request';
      toast.error(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 text-white text-lg">
        Loading communities...
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold mb-8 text-white">
        Join a Community
      </h1>

      {communities.length === 0 ? (
        <div className="bg-black rounded-lg p-6 border border-gray-800">
          <h2 className="text-xl font-semibold mb-4 text-white">Join Communities</h2>
          <div className="space-y-4">
            <p className="text-gray-300">No communities available to join at the moment.</p>
            <Button 
              onClick={() => navigate('/createCommunity')}
              className="w-full bg-red-600 hover:bg-red-700 text-white p-3 rounded-lg transition"
            >
              Create a Community
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {communities.map(community => (
            <div className="bg-black rounded-lg p-6 border border-gray-800 h-full">
              <h2 className="text-xl font-semibold mb-4 text-white">{community.name}</h2>
              <div className="space-y-4">
                <p className="text-gray-300">{community.description || 'No description provided'}</p>
                <div className="flex flex-col space-y-3">
                  <p className="text-gray-400">Members: {community.members.length}</p>
                  <Button 
                    onClick={() => handleJoinRequest(community._id)}
                    className="w-full bg-red-600 hover:bg-red-700 text-white p-3 rounded-lg transition"
                  >
                    Request to Join
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JoinCommunity;