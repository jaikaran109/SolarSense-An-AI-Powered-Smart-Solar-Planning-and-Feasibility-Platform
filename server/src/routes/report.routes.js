const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');

router.post('/', reportController.saveReport);
router.get('/', reportController.listReports);
router.get('/:id', reportController.getReportById);

module.exports = router;
