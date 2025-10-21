import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import toast, { Toaster } from 'react-hot-toast';

const AdminCommunityManager = () => {
  const [adminCommunities, setAdminCommunities] = useState([]);
  const [filteredCommunities, setFilteredCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [editDescriptionDialog, setEditDescriptionDialog] = useState(false);
  const [newDescription, setNewDescription] = useState('');
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [communitiesPerPage] = useState(6);
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCriteria, setFilterCriteria] = useState('name');

  // Member management state
  const [memberManagementDialog, setMemberManagementDialog] = useState(false);
  const [members, setMembers] = useState([]);
  const [joinRequests, setJoinRequests] = useState([]);
  const [selectedAction, setSelectedAction] = useState('members');

  const navigate = useNavigate();

  useEffect(() => {
    fetchAdminCommunities();
  }, []);

  // Update filtered communities when search term or filter changes
  useEffect(() => {
    filterCommunities();
  }, [searchTerm, filterCriteria, adminCommunities]);

  const fetchAdminCommunities = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:3000/bee/community/all', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch communities. Please check your network connection.');
      }

      const communities = await response.json();
      
      // Filter communities where the current user is an admin
      const username = localStorage.getItem('username');
      const adminCommunities = communities.filter(community => 
        community.admin.includes(username)
      );

      setAdminCommunities(adminCommunities);
      setFilteredCommunities(adminCommunities);
      setLoading(false);
    } catch (error) {
      toast.error(error.message || 'An unexpected error occurred');
      setLoading(false);
    }
  };

  const filterCommunities = () => {
    let result = adminCommunities;

    if (searchTerm) {
      result = result.filter(community => 
        community[filterCriteria]
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCommunities(result);
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Pagination logic
  const indexOfLastCommunity = currentPage * communitiesPerPage;
  const indexOfFirstCommunity = indexOfLastCommunity - communitiesPerPage;
  const currentCommunities = filteredCommunities.slice(
    indexOfFirstCommunity, 
    indexOfLastCommunity
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleManageCommunity = (community) => {
    navigate(`/admin/community/${community._id}`);
  };

  const handleEditDescription = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:3000/bee/community/${selectedCommunity._id}/description`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ description: newDescription })
      });

      if (!response.ok) {
        throw new Error('Failed to update description. Please try again.');
      }

      // Update local state
      const updatedCommunities = adminCommunities.map(community => 
        community._id === selectedCommunity._id 
          ? { ...community, description: newDescription } 
          : community
      );

      setAdminCommunities(updatedCommunities);
      
      toast.success('Description updated successfully');
      setEditDescriptionDialog(false);
    } catch (error) {
      toast.error(error.message || 'Failed to update description');
    }
  };

  const handleDeleteCommunity = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:3000/bee/community/${selectedCommunity._id}/delete`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete community. Please try again.');
      }

      // Remove from local state
      const updatedCommunities = adminCommunities.filter(
        community => community._id !== selectedCommunity._id
      );

      setAdminCommunities(updatedCommunities);
      
      toast.success('Community deleted successfully');
      setDeleteConfirmDialog(false);
    } catch (error) {
      toast.error(error.message || 'Failed to delete community');
    }
  };

  const openEditDescriptionDialog = (community) => {
    setSelectedCommunity(community);
    setNewDescription(community.description);
    setEditDescriptionDialog(true);
  };

  const openDeleteConfirmDialog = (community) => {
    setSelectedCommunity(community);
    setDeleteConfirmDialog(true);
  };



  const openMemberManagementDialog = async (community) => {
    setSelectedCommunity(community);
    setMemberManagementDialog(true);
    
    try {
      const token = localStorage.getItem('token');
      
      const membersResponse = await fetch(`http://localhost:3000/bee/community/${community._id}/members`, {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      if (!membersResponse.ok) {
        throw new Error('Failed to fetch members');
      }
  
      const membersData = await membersResponse.json();
      
      // Directly set members with the backend-processed data
      setMembers(membersData);
  
      // Fetch join requests
      const requestsResponse = await fetch(`http://localhost:3000/bee/community/${community._id}/requests`, {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      if (!requestsResponse.ok) {
        throw new Error('Failed to fetch join requests');
      }
  
      const requestsData = await requestsResponse.json();
      setJoinRequests(requestsData);
  
    } catch (error) {
      console.error('Error in Member Management:', error);
      toast.error(error.message || 'Failed to load community details');
      setMembers([]);
      setJoinRequests([]);
    }
  };
  
  const handleMemberAction = async (username, action) => {
    try {
      const token = localStorage.getItem('token');
      
      if (action === 'remove') {
        // Log the details before removal
        console.log('Attempting to remove member:', username);
        console.log('Current members:', members);
        
        const response = await fetch(`http://localhost:3000/bee/community/${selectedCommunity._id}/members`, {
          method: 'DELETE',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username })
        });

        if (!response.ok) {
          throw new Error('Failed to remove member');
        }

        // Log the filtering process
        const updatedMembers = members.filter(member => {
          console.log('Member:', member, 'Username to match:', username);
          return member.username !== username;
        });

        console.log('Updated members after filtering:', updatedMembers);
        
        setMembers(updatedMembers);
        toast.success('Member removed successfully');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to perform action');
    }
  };

  const handleJoinRequestAction = async (username, approved) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:3000/bee/community/${selectedCommunity._id}/requests`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, approved })
      });

      if (!response.ok) {
        throw new Error('Failed to process join request');
      }

      // Update local state
      setJoinRequests(joinRequests.filter(request => request.user !== username));
      
      if (approved) {
        // Optionally fetch updated members if needed
        toast.success('Join request approved');
      } else {
        toast.success('Join request declined');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to perform action');
    }
  };

  // Pagination component
  const Pagination = () => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredCommunities.length / communitiesPerPage); i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex justify-center items-center space-x-2 mt-4">
        {pageNumbers.map(number => (
          <Button
            key={number}
            onClick={() => paginate(number)}
            variant={currentPage === number ? 'default' : 'outline'}
            size="sm"
          >
            {number}
          </Button>
        ))}
      </div>
    );
  };

  if (loading) {
    return <div className="p-8 text-white text-lg">Loading communities...</div>;
  }

  return (
    <div className="flex flex-col w-full items-center">
      <Toaster position="top-right" />
      
      <h1 className="text-3xl font-bold mb-8 text-center text-white">Communities You Manage</h1>

      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 w-full max-w-4xl">
        <Input 
          placeholder="Search communities..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-gray-900 border-gray-700 flex-grow text-white"
        />
        <Select 
          value={filterCriteria} 
          onValueChange={setFilterCriteria}
        >
          <SelectTrigger className="w-full md:w-[180px] bg-gray-900 border-gray-700 text-white">
            <SelectValue placeholder="Filter by" />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 border-gray-700 text-white">
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="description">Description</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredCommunities.length === 0 ? (
        <div className="bg-black border border-gray-800 p-8 rounded-lg text-center max-w-4xl mx-auto w-full">
          <p className="text-gray-300 text-lg">
            {adminCommunities.length === 0 
              ? "You are not an admin of any communities" 
              : "No communities match your search criteria"}
          </p>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto w-full">
            {currentCommunities.map(community => (
              <Card key={community._id} className="bg-black border border-gray-800 text-white h-full hover:bg-gray-900 transition">
                <CardHeader className="border-b border-gray-800 pb-4">
                  <CardTitle className="text-white text-xl">{community.name}</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 p-6 flex flex-col h-full">
                  <p className="text-base text-gray-300 mb-6 flex-grow min-h-[80px]">
                    {community.description || 'No description'}
                  </p>
                  <div className="flex flex-col space-y-3 mt-auto">
                    <Button 
                      onClick={() => openMemberManagementDialog(community)}
                      className="bg-gray-800 hover:bg-gray-700 text-white py-2.5"
                    >
                      Manage Members
                    </Button>
                    <Button 
                      variant="secondary"
                      onClick={() => openEditDescriptionDialog(community)}
                      className="bg-gray-900 hover:bg-gray-800 text-white border border-gray-700 py-2.5"
                    >
                      Edit Description
                    </Button>
                    <Button 
                      variant="destructive"
                      onClick={() => openDeleteConfirmDialog(community)}
                      className="bg-red-600 hover:bg-red-700 text-white py-2.5"
                    >
                      Delete Community
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Pagination */}
          <div className="mt-8 flex justify-center w-full">
            <Pagination />
          </div>
        </>
      )}

      {/* Edit Description Dialog */}
      <Dialog 
        open={editDescriptionDialog} 
        onOpenChange={setEditDescriptionDialog}
      >
        <DialogContent className="bg-black border border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Community Description</DialogTitle>
            <DialogDescription className="text-gray-400">
              Update the description for {selectedCommunity?.name}
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Enter new description"
            className="bg-gray-900 border-gray-800 text-white"
          />
          <DialogFooter>
            <Button 
              variant="secondary" 
              onClick={() => setEditDescriptionDialog(false)}
              className="bg-gray-800 hover:bg-gray-700 text-white"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleEditDescription}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog 
        open={deleteConfirmDialog} 
        onOpenChange={setDeleteConfirmDialog}
      >
        <DialogContent className="bg-black border border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Delete Community</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you absolutely sure you want to delete {selectedCommunity?.name}? 
              This action cannot be undone and will permanently remove:
              <ul className="list-disc pl-5 mt-2 text-gray-300">
                <li>All community members</li>
                <li>All posts and discussions</li>
                <li>Community settings</li>
              </ul>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="secondary" 
              onClick={() => setDeleteConfirmDialog(false)}
              className="bg-gray-800 hover:bg-gray-700 text-white"
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDeleteCommunity}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              I Understand, Delete Community
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Member Management Dialog */}
      <Dialog 
        open={memberManagementDialog} 
        onOpenChange={setMemberManagementDialog}
      >
        <DialogContent className="max-w-2xl bg-black border border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Manage {selectedCommunity?.name} Community</DialogTitle>
            <DialogDescription className="text-gray-400">
              Manage members and join requests
            </DialogDescription>
          </DialogHeader>

          {/* Action Selector */}
          <div className="flex space-x-2 mb-6">
            <Button 
              variant={selectedAction === 'members' ? 'default' : 'outline'}
              onClick={() => setSelectedAction('members')}
              className={selectedAction === 'members' 
                ? "bg-red-600 hover:bg-red-700 text-white" 
                : "bg-gray-900 border-gray-700 text-gray-300 hover:text-white"}
            >
              Members
            </Button>
            <Button 
              variant={selectedAction === 'requests' ? 'default' : 'outline'}
              onClick={() => setSelectedAction('requests')}
              className={selectedAction === 'requests' 
                ? "bg-red-600 hover:bg-red-700 text-white" 
                : "bg-gray-900 border-gray-700 text-gray-300 hover:text-white"}
            >
              Join Requests
            </Button>
          </div>

          {/* Members Section */}
          {selectedAction === 'members' && (
            <div>
              <h3 className="text-lg font-semibold mb-3 text-white">Community Members</h3>
              {members.length === 0 ? (
                <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 text-center">
                  <p className="text-gray-400">No members in this community</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {members.map((member) => (
                    <div 
                      key={member.key}
                      className="flex justify-between items-center p-3 rounded-lg bg-gray-900 border border-gray-800"
                    >
                      <span className="font-medium text-white">{member.username}</span>
                      {member.isAdmin ? (
                        <span className="text-sm text-gray-400 bg-gray-800 px-2 py-1 rounded">Admin</span>
                      ) : (
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleMemberAction(member.username, 'remove')}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Join Requests Section */}
          {selectedAction === 'requests' && (
            <div>
              <h3 className="text-lg font-semibold mb-3 text-white">Join Requests</h3>
              {joinRequests.length === 0 ? (
                <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 text-center">
                  <p className="text-gray-400">No pending join requests</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {joinRequests.map(request => (
                    <div 
                      key={request.user} 
                      className="flex justify-between items-center p-3 rounded-lg bg-gray-900 border border-gray-800"
                    >
                      <span className="text-white">{request.user}</span>
                      <div className="space-x-2">
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={() => handleJoinRequestAction(request.user, true)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          Approve
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleJoinRequestAction(request.user, false)}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          Decline
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button 
              variant="secondary" 
              onClick={() => setMemberManagementDialog(false)}
              className="bg-gray-800 hover:bg-gray-700 text-white"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCommunityManager;