import { apiEndpoint } from "@/lib/api-config";
import { useState, useEffect, useCallback } from 'react';
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

interface Community {
  _id: string;
  name: string;
  description: string;
  admin: string[];
  members: string[];
  createdAt: string;
}

interface Member {
  username: string;
  isAdmin: boolean;
  key: string;
}

interface JoinRequest {
  user: string;
  createdAt: string;
}

const AdminCommunityManager = () => {
  const [adminCommunities, setAdminCommunities] = useState<Community[]>([]);
  const [filteredCommunities, setFilteredCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [editDescriptionDialog, setEditDescriptionDialog] = useState<boolean>(false);
  const [newDescription, setNewDescription] = useState<string>('');
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState<boolean>(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [communitiesPerPage] = useState<number>(6);
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterCriteria, setFilterCriteria] = useState<string>('name');

  // Member management state
  const [memberManagementDialog, setMemberManagementDialog] = useState<boolean>(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);
  const [selectedAction, setSelectedAction] = useState<string>('members');

  const navigate = useNavigate();

  // filterCommunities
  const filterCommunities = useCallback(() => {
    if (!adminCommunities.length) return;
    
    let result = adminCommunities;

    if (searchTerm && filterCriteria) {
      result = result.filter(community => {
        const value = community[filterCriteria as keyof Community];
        return typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }

    setFilteredCommunities(result);
    setCurrentPage(1); 
  }, [adminCommunities, filterCriteria, searchTerm]);

  // Fetch admin communities on mount
  useEffect(() => {
    fetchAdminCommunities();
  }, []);

  // Update filtered communities when dependencies change
  useEffect(() => {
    filterCommunities();
  }, [filterCommunities]);

  const fetchAdminCommunities = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(apiEndpoint('/bee/community/all'), {
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
      const adminCommunities = communities.filter((community: Community) => 
        community.admin.includes(username || '')
      );

      setAdminCommunities(adminCommunities);
      setFilteredCommunities(adminCommunities);
      setLoading(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  // Pagination logic
  const indexOfLastCommunity = currentPage * communitiesPerPage;
  const indexOfFirstCommunity = indexOfLastCommunity - communitiesPerPage;
  const currentCommunities = filteredCommunities.slice(
    indexOfFirstCommunity,
    indexOfLastCommunity
  );

  // Calculate page numbers
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredCommunities.length / communitiesPerPage); i++) {
    pageNumbers.push(i);
  }

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleUpdateDescription = async () => {
    if (!selectedCommunity) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(apiEndpoint(`/bee/community/${selectedCommunity._id}/description`), {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ description: newDescription })
      });

      if (!response.ok) {
        throw new Error('Failed to update description');
      }

      // Update the community in the state
      const updatedCommunities = adminCommunities.map(community =>
        community._id === selectedCommunity._id
          ? { ...community, description: newDescription }
          : community
      );

      setAdminCommunities(updatedCommunities);
      setFilteredCommunities(updatedCommunities);

      toast.success('Community description updated successfully');
      setEditDescriptionDialog(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update description';
      toast.error(errorMessage);
    }
  };

  const handleDeleteCommunity = async () => {
    if (!selectedCommunity) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(apiEndpoint(`/bee/community/${selectedCommunity._id}/delete`), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete community');
      }

      // Remove the community from state
      const updatedCommunities = adminCommunities.filter(
        community => community._id !== selectedCommunity._id
      );

      setAdminCommunities(updatedCommunities);
      setFilteredCommunities(updatedCommunities);
      setDeleteConfirmDialog(false);

      toast.success('Community deleted successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete community';
      toast.error(errorMessage);
    }
  };

  const openEditDescriptionDialog = (community: Community) => {
    setSelectedCommunity(community);
    setNewDescription(community.description || '');
    setEditDescriptionDialog(true);
  };

  const openDeleteConfirmDialog = (community: Community) => {
    setSelectedCommunity(community);
    setDeleteConfirmDialog(true);
  };

  // For member management
  const openMemberManagementDialog = async (community: Community) => {
    setSelectedCommunity(community);
    setMemberManagementDialog(true);
    await fetchCommunityMembers(community._id);
  };

  const fetchCommunityMembers = async (communityId: string) => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch members
      const membersResponse = await fetch(apiEndpoint(`/bee/community/${communityId}/members`), {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!membersResponse.ok) {
        throw new Error('Failed to fetch community members');
      }

      const membersData = await membersResponse.json();
      setMembers(membersData.map((username: string, index: number) => ({
        username,
        isAdmin: false, 
        key: `member-${index}`
      })));

      // Fetch join requests
      const requestsResponse = await fetch(apiEndpoint(`/bee/community/${communityId}/requests`), {
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
      const errorMessage = error instanceof Error ? error.message : 'Failed to load community details';
      toast.error(errorMessage);
    }
  };

  const handleMemberAction = async (username: string, action: string) => {
    if (!selectedCommunity) return;
    
    try {
      const token = localStorage.getItem('token');
      
      let method, body;
      
      if (action === 'remove') {
        method = 'DELETE';
        body = JSON.stringify({ username });
        
        const response = await fetch(apiEndpoint(`/bee/community/${selectedCommunity._id}/members`), {
          method,
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body
        });

        if (!response.ok) {
          throw new Error('Failed to remove member');
        }

        // Update members list in state
        const updatedMembers = members.filter(member => 
          member.username !== username
        );
        
        setMembers(updatedMembers);
        toast.success(`Member ${username} removed successfully`);
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to perform action';
      toast.error(errorMessage);
    }
  };

  const handleJoinRequestAction = async (username: string, approved: boolean) => {
    if (!selectedCommunity) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(apiEndpoint(`/bee/community/${selectedCommunity._id}/requests`), {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          username,
          approved
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to ${approved ? 'approve' : 'reject'} request`);
      }

      // Update join requests list in state
      setJoinRequests(joinRequests.filter(request => request.user !== username));
      
      // If approved, add to members list
      if (approved) {
        setMembers([...members, { 
          username, 
          isAdmin: false,
          key: `member-${members.length}`
        }]);
      }

      toast.success(`Request ${approved ? 'approved' : 'rejected'} successfully`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to perform action';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold mb-6 text-white text-center">Community Management</h1>

      <div className="mb-8 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 items-center justify-center">
        <div className="flex items-center space-x-2">
          <Select 
            value={filterCriteria}
            onValueChange={setFilterCriteria}
          >
            <SelectTrigger className="w-[120px] bg-black border-gray-700 text-white">
              <SelectValue placeholder="Filter by" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-700 text-white">
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="description">Description</SelectItem>
            </SelectContent>
          </Select>
          
          <Input
            type="text"
            placeholder="Search communities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-black border-gray-700 text-white max-w-xs"
          />
        </div>
        
        <Button 
          onClick={() => navigate('/createCommunity')}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          Create New Community
        </Button>
      </div>

      {loading ? (
        <div className="text-center p-8 text-white">
          Loading communities...
        </div>
      ) : adminCommunities.length === 0 ? (
        <div className="text-center bg-black border border-gray-800 rounded-lg p-8 max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold mb-4 text-white">No Communities Found</h2>
          <p className="text-gray-300 mb-6">You haven't created any communities yet.</p>
          <Button 
            onClick={() => navigate('/createCommunity')}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Create Your First Community
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto w-full">
            {currentCommunities.map((community) => (
              <Card key={community._id} className="bg-black border border-gray-800 text-white h-full hover:bg-gray-900 transition">
                <CardHeader className="border-b border-gray-800">
                  <CardTitle className="text-white text-xl">{community.name}</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 flex flex-col h-full">
                  <p className="text-gray-300 mb-6 flex-grow">
                    {community.description || 'No description'}
                  </p>
                  
                  <div className="space-y-4 mt-auto">
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        onClick={() => openEditDescriptionDialog(community)}
                        className="bg-gray-800 hover:bg-gray-700 text-white"
                      >
                        Edit Description
                      </Button>
                      <Button 
                        onClick={() => openMemberManagementDialog(community)}
                        className="bg-gray-800 hover:bg-gray-700 text-white"
                      >
                        Manage Members
                      </Button>
                    </div>
                    <Button 
                      onClick={() => openDeleteConfirmDialog(community)}
                      variant="destructive"
                      className="w-full"
                    >
                      Delete Community
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {pageNumbers.length > 1 && (
            <div className="flex justify-center mt-8">
              <ul className="flex space-x-2">
                {pageNumbers.map(number => (
                  <li key={number}>
                    <Button
                      onClick={() => paginate(number)}
                      variant={currentPage === number ? "default" : "outline"}
                      className={`${currentPage === number ? 'bg-red-600' : 'bg-gray-900 text-white border-gray-700'}`}
                    >
                      {number}
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}

      {/* Edit Description Dialog */}
      <Dialog open={editDescriptionDialog} onOpenChange={setEditDescriptionDialog}>
        <DialogContent className="bg-black border border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">
              Update the description for {selectedCommunity?.name}
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <Textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="bg-gray-900 border-gray-700 text-white"
              placeholder="Enter new description"
              rows={5}
            />
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditDescriptionDialog(false)}
              className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleUpdateDescription}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmDialog} onOpenChange={setDeleteConfirmDialog}>
        <DialogContent className="bg-black border border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Confirm Deletion</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you absolutely sure you want to delete {selectedCommunity?.name}?
              <br />This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteConfirmDialog(false)}
              className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleDeleteCommunity}
              variant="destructive"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Member Management Dialog */}
      <Dialog open={memberManagementDialog} onOpenChange={setMemberManagementDialog}>
        <DialogContent className="bg-black border border-gray-800 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">Manage {selectedCommunity?.name} Community</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            {/* Tab Navigation */}
            <div className="flex mb-4 border-b border-gray-800">
              <button
                className={`px-4 py-2 ${selectedAction === 'members' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-400'}`}
                onClick={() => setSelectedAction('members')}
              >
                Members
              </button>
              <button
                className={`px-4 py-2 ${selectedAction === 'joinRequests' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-400'}`}
                onClick={() => setSelectedAction('joinRequests')}
              >
                Join Requests
              </button>
            </div>
            
            {/* Members Tab */}
            {selectedAction === 'members' && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white">Members</h3>
                
                {members.length === 0 ? (
                  <p className="text-gray-400">No members in this community.</p>
                ) : (
                  <div className="space-y-3">
                    {members.map(member => (
                      <div 
                        key={member.key}
                        className="flex items-center justify-between p-3 bg-gray-900 rounded-md"
                      >
                        <span className="font-medium text-white">{member.username}</span>
                        {member.isAdmin ? (
                          <span className="text-xs bg-red-900 text-red-300 px-2 py-1 rounded">Admin</span>
                        ) : (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleMemberAction(member.username, 'remove')}
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
            
            {/* Join Requests Tab */}
            {selectedAction === 'joinRequests' && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white">Join Requests</h3>
                
                {joinRequests.length === 0 ? (
                  <p className="text-gray-400">No pending join requests.</p>
                ) : (
                  <div className="space-y-3">
                    {joinRequests.map(request => (
                      <div 
                        key={request.user}
                        className="flex items-center justify-between p-3 bg-gray-900 rounded-md"
                      >
                        <span className="text-white">{request.user}</span>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleJoinRequestAction(request.user, true)}
                          >
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleJoinRequestAction(request.user, false)}
                          >
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              onClick={() => setMemberManagementDialog(false)}
              className="bg-gray-800 text-white hover:bg-gray-700"
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
