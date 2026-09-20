const express = require('express');
const router = express.Router();
const financialController = require('../controllers/financial.controller');

router.post('/calculate', financialController.calculateFinancialMetrics);

module.exports = router;
