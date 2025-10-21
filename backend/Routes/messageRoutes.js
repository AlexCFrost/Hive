const express = require ('express');
const router = express.Router();
const { sendMessage, getMessages } = require('../Controller/messageController');
const auth = require('../Middleware/auth');

router.post('/', auth, sendMessage);
router.get('/:communityId', auth, getMessages);

module.exports = router;