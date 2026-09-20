const express = require('express');
const router = express.Router();
const installerController = require('../controllers/installer.controller');

router.get('/', installerController.getInstallers);
router.post('/quote-request', installerController.submitQuoteRequest);

module.exports = router;
