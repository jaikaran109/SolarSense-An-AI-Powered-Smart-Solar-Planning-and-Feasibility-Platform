const express = require('express');
const router = express.Router();
const assistantController = require('../controllers/assistant.controller');

router.post('/chat', assistantController.handleChat);

module.exports = router;
