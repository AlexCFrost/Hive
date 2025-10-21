import React, { useEffect, useState } from "react";
import CommunityChatComponent from "./communityChat";
import toast, { Toaster } from 'react-hot-toast';

interface Community {
  _id: string;
  name: string;
  description: string;
  creator: string;
  createdAt: string;
  members: string[];
  joinRequests: { user: string }[];
}

const CommunityComponent: React.FC = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [username, setUsername] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const token = localStorage.getItem("token");
    
    if (!storedUsername || !token) {
      window.location.href = "/bee/user/login";
      return;
    }

    setUsername(storedUsername);
    fetchCommunities();
  }, []);

  const fetchCommunities = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No authentication token found");
      setLoading(false);
      return;
    }

    fetch("http://localhost:3000/bee/community/all", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch communities");
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setCommunities(data);
        } else {
          setError("Invalid data format");
        }
      })
      .catch((err) => {
        console.error("Community fetch error:", err);
        setError(err.message || "An error occurred while fetching communities");
      })
      .finally(() => setLoading(false));
  };

  const handleJoinRequest = (communityId: string) => {
    const token = localStorage.getItem("token");
    toast.loading('Sending join request...', { id: 'join-request' });
    
    fetch(`http://localhost:3000/bee/community/${communityId}/join`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username })
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to send join request");
        }
        return res.json();
      })
      .then(() => {
        toast.success('Join request sent successfully!', { id: 'join-request' });
        fetchCommunities();
      })
      .catch((err) => {
        console.error("Join request error:", err);
        toast.error(err.message || 'Failed to send join request', { id: 'join-request' });
      });
  };

  const categorizedCommunities = {
    created: communities.filter((comm) => comm.creator === username),
    joined: communities.filter(
      (comm) => comm.members.includes(username) && comm.creator !== username
    ),
    available: communities.filter(
      (comm) =>
        !comm.members.includes(username) &&
        !comm.joinRequests.some((req) => req.user === username)
    ),
  };

  if (loading) return <div className="p-4 text-center">Loading communities...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="flex flex-col w-full">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold mb-8 text-white">Communities</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
        {/* Communities List - Left Side */}
        <div className="lg:col-span-1">
          {/* Created Communities Section */}
          {categorizedCommunities.created.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-4 text-white">Created Communities</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                {categorizedCommunities.created.map((comm) => (
                  <div
                    key={comm._id}
                    onClick={() => setSelectedCommunity(comm)}
                    className={`bg-black p-6 rounded-lg border border-gray-800 h-full cursor-pointer ${
                      selectedCommunity?._id === comm._id ? 'border-red-500' : 'hover:border-gray-700'
                    }`}
                  >
                    <h2 className="text-xl font-semibold mb-4 text-white">{comm.name}</h2>
                    <div className="space-y-4">
                      <p className="text-gray-300">{comm.description || 'No description provided'}</p>
                      <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
                        <p className="text-sm text-gray-400">Created: {new Date(comm.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Joined Communities Section */}
          {categorizedCommunities.joined.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-4 text-white">Joined Communities</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                {categorizedCommunities.joined.map((comm) => (
                  <div
                    key={comm._id}
                    onClick={() => setSelectedCommunity(comm)}
                    className={`bg-black p-6 rounded-lg border border-gray-800 h-full cursor-pointer ${
                      selectedCommunity?._id === comm._id ? 'border-red-500' : 'hover:border-gray-700'
                    }`}
                  >
                    <h2 className="text-xl font-semibold mb-4 text-white">{comm.name}</h2>
                    <div className="space-y-4">
                      <p className="text-gray-300">{comm.description || 'No description provided'}</p>
                      <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
                        <p className="text-sm text-gray-400">Members: {comm.members.length}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Available Communities Section */}
          {categorizedCommunities.available.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-4 text-white">Available Communities</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                {categorizedCommunities.available.map((comm) => (
                  <div
                    key={comm._id}
                    onClick={() => setSelectedCommunity(comm)}
                    className={`bg-black p-6 rounded-lg border border-gray-800 h-full cursor-pointer ${
                      selectedCommunity?._id === comm._id ? 'border-red-500' : 'hover:border-gray-700'
                    }`}
                  >
                    <h2 className="text-xl font-semibold mb-4 text-white">{comm.name}</h2>
                    <div className="space-y-4">
                      <p className="text-gray-300">{comm.description || 'No description provided'}</p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleJoinRequest(comm._id);
                        }}
                        className="w-full bg-red-600 hover:bg-red-700 text-white p-3 rounded-lg transition"
                      >
                        Request to Join
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {Object.values(categorizedCommunities).every(arr => arr.length === 0) && (
            <div className="bg-black rounded-lg p-6 border border-gray-800">
              <h2 className="text-xl font-semibold mb-4 text-white">Communities</h2>
              <div className="space-y-4">
                <p className="text-gray-300">No communities found.</p>
                <button 
                  onClick={() => window.location.href = '/createCommunity'}
                  className="w-full bg-red-600 hover:bg-red-700 text-white p-3 rounded-lg transition"
                >
                  Create a Community
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Community Chat or Details Area - Right Side */}
        <div className="lg:col-span-1 h-[75vh] flex flex-col items-center justify-center">
          {selectedCommunity ? (
            categorizedCommunities.joined.some(comm => comm._id === selectedCommunity._id) || 
            categorizedCommunities.created.some(comm => comm._id === selectedCommunity._id) ? (
              <div className="flex-grow h-full w-full max-w-md mx-auto">
                <CommunityChatComponent community={selectedCommunity} username={username} />
              </div>
            ) : (
              <div className="bg-black rounded-lg border border-gray-800 p-6 h-full flex flex-col max-w-md w-full mx-auto">
                <h2 className="text-2xl font-bold mb-6 text-white">{selectedCommunity.name}</h2>
                <p className="text-xl text-gray-300 mb-6">{selectedCommunity.description || 'No description provided'}</p>
                <div className="mb-8 text-gray-300 text-lg">
                  <p className="mb-2"><strong>Admin:</strong> {selectedCommunity.creator}</p>
                  <p>
                    <strong>Created:</strong> {new Date(selectedCommunity.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleJoinRequest(selectedCommunity._id)}
                  className="bg-red-600 text-white px-6 py-3 rounded hover:bg-red-700 transition text-lg mt-auto"
                >
                  Request to Join
                </button>
              </div>
            )
          ) : (
            <div className="bg-black rounded-lg border border-gray-800 p-6 h-full flex items-center justify-center max-w-md w-full mx-auto">
              <p className="text-2xl text-gray-300 text-center">Select a community to view details or chat</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunityComponent;