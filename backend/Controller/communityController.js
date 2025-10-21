const User = require("../Model/userModel");
const Community = require("../Model/communityModel");

const createCommunity = async (req, res) => {
  const { name, description } = req.body;
  const username = req.user.username;

  try {
    const community = await Community.create({
      name,
      description,
      creator: username,
      admin: [username], 
      members: [username]
    });

    res.status(201).json(community);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const requestToJoinCommunity = async (req, res) => {
  const { communityId } = req.params;
  const username = req.user.username;

  try {
    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ error: 'Community not found' });
    }

    if (community.members.includes(username)) {
      return res.status(400).json({ error: 'You are already a member' });
    }

    const existingRequest = community.joinRequests.find(request => request.user === username);
    if (existingRequest) {
      return res.status(400).json({ error: 'You have already requested to join this community' });
    }

    community.joinRequests.push({ user: username, status: 'pending' });
    await community.save();

    res.status(200).json({ message: 'Join request sent successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const approveJoinRequest = async (req, res) => {
  const { communityId, username } = req.params;
  const adminUsername = req.user.username;

  try {
    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ error: 'Community not found' });
    }

    if (!community.admin.includes(adminUsername)) {
      return res.status(403).json({ error: 'You do not have permission to approve requests' });
    }

    const joinRequestIndex = community.joinRequests.findIndex(request => request.user === username && request.status === 'pending');
    if (joinRequestIndex === -1) {
      return res.status(404).json({ error: 'Join request not found' });
    }

    community.joinRequests[joinRequestIndex].status = 'approved';
    if (!community.members.includes(username)) {
      community.members.push(username);
    }
    await community.save();

    res.status(200).json({ message: 'Join request approved successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const leaveCommunity = async (req, res) => {
  const { communityId } = req.params;
  const username = req.user.username;

  try {
    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ error: 'Community not found' });
    }

    if (!community.members.includes(username)) {
      return res.status(400).json({ error: 'You are not a member of this community' });
    }

    community.members = community.members.filter(member => member !== username);
    await community.save();

    res.status(200).json({ message: 'Successfully left the community' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getCommunityDescription = async (req, res) => {
  const { communityId } = req.params;
  const username = req.user.username;

  try {
    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ error: 'Community not found' });
    }

    if (!community.members.includes(username)) {
      return res.status(403).json({ error: 'You are not a member of this community' });
    }

    res.status(200).json({ description: community.description });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateCommunityDescription = async (req, res) => {
  const { communityId } = req.params;
  const { description } = req.body;
  const username = req.user.username;

  try {
    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ error: 'Community not found' });
    }

    if (!community.admin.includes(username)) {
      return res.status(403).json({ error: 'You do not have permission to update this community' });
    }

    community.description = description;
    await community.save();

    res.status(200).json({ message: 'Community description updated successfully', community });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteCommunity = async (req, res) => {
  const { communityId } = req.params;
  const username = req.user.username;

  try {
    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ error: "Community not found" });
    }

    if (!community.admin.includes(username)) {
      return res.status(403).json({ error: "You do not have permission to delete this community" });
    }

    await Community.findByIdAndDelete(communityId);

    res.status(200).json({ message: "Community deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllCommunities = async (req, res) => {
  try {
    const communities = await Community.find(); 
    res.status(200).json(communities);
  } catch (error) {
    res.status(500).json({ error: "Error fetching communities" });
  }
};

const getCommunityMembers = async (req, res) => {
  try {
    const community = await Community.findOne({ _id: req.params.communityId });
    
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    // Check if the requesting user is an admin
    const username = req.user.username;
    if (!community.admin.includes(username)) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Map members directly from the members array
    const membersWithAdminStatus = community.members.map(memberUsername => ({
      username: memberUsername,
      isAdmin: community.admin.includes(memberUsername)
    }));

    res.json(membersWithAdminStatus);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getCommunityJoinRequests = async (req, res) => {
  try {
    const community = await Community.findById(req.params.communityId);
    
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    const username = req.user.username;
    if (!community.admin.includes(username)) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const pendingRequests = community.joinRequests.filter(
      request => request.status === 'pending'
    );

    res.json(pendingRequests);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const removeMemberFromCommunity = async (req, res) => {
  try {
    const { communityId } = req.params;
    const { username } = req.body;
    const currentUser = req.user.username;

    const community = await Community.findById(communityId);
    
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    if (!community.admin.includes(currentUser)) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (community.admin.includes(username)) {
      return res.status(400).json({ message: 'Cannot remove an admin' });
    }

    // Remove member
    community.members = community.members.filter(member => member !== username);

    // Remove any existing join requests from the user
    community.joinRequests = community.joinRequests.filter(request => request.user !== username);

    await community.save();

    res.json({ message: 'Member and their join request removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


const handleJoinRequest = async (req, res) => {
  try {
    const { communityId } = req.params;
    const { username, approved } = req.body;
    const currentUser = req.user.username;

    const community = await Community.findById(communityId);
    
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    // Check if current user is an admin
    if (!community.admin.includes(currentUser)) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Find the join request
    const joinRequestIndex = community.joinRequests.findIndex(
      request => request.user === username && request.status === 'pending'
    );

    if (joinRequestIndex === -1) {
      return res.status(404).json({ message: 'Join request not found' });
    }

    // Update join request status
    if (approved) {
      // Add user to members
      if (!community.members.includes(username)) {
        community.members.push(username);
      }
      community.joinRequests[joinRequestIndex].status = 'approved';
    } else {
      community.joinRequests[joinRequestIndex].status = 'rejected';
    }

    await community.save();

    res.json({ 
      message: approved ? 'Join request approved' : 'Join request declined',
      status: approved ? 'approved' : 'rejected'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


module.exports = {
  createCommunity,
  requestToJoinCommunity,
  approveJoinRequest,
  leaveCommunity,
  getCommunityDescription,
  updateCommunityDescription,
  deleteCommunity,
  getAllCommunities,
  getCommunityMembers,
  getCommunityJoinRequests,
  removeMemberFromCommunity,
  handleJoinRequest
};