const express = require('express');
const router = express.Router();
const { 
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
} = require('../Controller/communityController');
const auth = require('../Middleware/auth');

router.post('/', auth, createCommunity);
router.post('/:communityId/join', auth, requestToJoinCommunity);
router.post('/:communityId/approve/:username', auth, approveJoinRequest);
router.get('/:communityId/description', auth, getCommunityDescription);
router.delete('/:communityId', auth, leaveCommunity);
router.put('/:communityId/description', auth, updateCommunityDescription);
router.delete('/:communityId/delete', auth, deleteCommunity);
router.get('/all', auth, getAllCommunities);
router.get('/:communityId/members', auth, getCommunityMembers);
router.get('/:communityId/requests', auth, getCommunityJoinRequests);
router.delete('/:communityId/members', auth, removeMemberFromCommunity);
router.put('/:communityId/requests', auth, handleJoinRequest);


module.exports = router;