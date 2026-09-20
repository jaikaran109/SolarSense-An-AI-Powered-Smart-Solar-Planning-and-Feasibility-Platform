const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');
const { optionalAuth } = require('../middleware/auth.middleware');

router.post('/', optionalAuth, reportController.saveReport);
router.get('/', optionalAuth, reportController.listReports);
router.get('/:id', optionalAuth, reportController.getReportById);

module.exports = router;
