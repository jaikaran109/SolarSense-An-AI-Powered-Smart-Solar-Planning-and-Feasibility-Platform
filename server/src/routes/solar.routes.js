const express = require('express');
const router = express.Router();
const solarController = require('../controllers/solar.controller');

router.post('/consumption', solarController.processConsumption);
router.post('/sizing', solarController.calculateSizing);
router.post('/verify-roof', solarController.verifyRoof);
router.post('/refine-panel', solarController.refinePanel);
router.get('/panels', solarController.getPanelCatalog);

module.exports = router;
