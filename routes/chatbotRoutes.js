const express = require('express');
const chatbotController = require('./../controllers/chatbotController');

const router = express.Router();

// Public endpoint - không cần auth
router.post('/ask', chatbotController.askChatbot);

module.exports = router;