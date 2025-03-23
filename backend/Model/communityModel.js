const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const communitySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  creator: {
    type: String,
    required: true,
  },
  admin: [{
    type: String,
  }],
  members: [{
    type: String,
  }],
  joinRequests: [{
    user: {
      type: String,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Community', communitySchema);