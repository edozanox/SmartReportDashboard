const express = require('express');
const reportsController = require('./reports-controller');

const router = express.Router();

router.get('/api/reports/send', reportsController.postReport);
router.get('/api/reports/getAll', reportsController.allReports);

module.exports = router;