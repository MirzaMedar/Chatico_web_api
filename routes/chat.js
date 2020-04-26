var express = require('express');
var router = express.Router();
const { getUsers, getRecentChats, getOnlineUsers, getChatMessages } = require('../controllers/chat.controller');
const auth = require('../middlewares/auth');

// add auth middleware
router.get('/getUsers', getUsers);

router.get('/getRecentChats/:userId', getRecentChats);

router.get('/getChatMessages/:userId', getChatMessages);

router.get('/getOnlineUsers', getOnlineUsers);

module.exports = router;