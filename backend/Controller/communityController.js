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



module.exports = {
  createCommunity,
  requestToJoinCommunity,
  approveJoinRequest,
  leaveCommunity,
  getCommunityDescription,
  updateCommunityDescription,
  deleteCommunity,
  getAllCommunities
};