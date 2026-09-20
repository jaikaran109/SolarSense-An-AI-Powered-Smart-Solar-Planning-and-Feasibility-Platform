const Report = require('../models/Report');
const { memoryStore, getDatabaseStatus } = require('../config/db');

/**
 * Saves a new solar feasibility report
 * POST /api/reports
 */
exports.saveReport = async (req, res) => {
  try {
    const reportData = req.body;
    const { isConnected } = getDatabaseStatus();

    if (isConnected) {
      const newReport = new Report(reportData);
      const saved = await newReport.save();
      return res.status(201).json({
        success: true,
        reportId: saved._id,
        data: saved
      });
    } else {
      // In-memory fallback
      const reportId = 'rep_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
      const saved = {
        _id: reportId,
        id: reportId,
        ...reportData,
        createdAt: new Date().toISOString()
      };
      memoryStore.reports.unshift(saved);
      return res.status(201).json({
        success: true,
        reportId: saved._id,
        data: saved
      });
    }
  } catch (error) {
    console.error('Error saving report:', error);
    return res.status(500).json({ error: 'Failed to save report: ' + error.message });
  }
};

/**
 * Fetches a report by ID
 * GET /api/reports/:id
 */
exports.getReportById = async (req, res) => {
  try {
    const { id } = req.params;
    const { isConnected } = getDatabaseStatus();

    if (isConnected) {
      const report = await Report.findById(id);
      if (!report) {
        return res.status(404).json({ error: 'Report not found.' });
      }
      return res.json({ success: true, data: report });
    } else {
      const report = memoryStore.reports.find(r => r._id === id || r.id === id);
      if (!report) {
        return res.status(404).json({ error: 'Report not found in memory store.' });
      }
      return res.json({ success: true, data: report });
    }
  } catch (error) {
    console.error('Error fetching report:', error);
    return res.status(500).json({ error: 'Failed to fetch report.' });
  }
};

/**
 * Lists recent reports (for history or logged-in users)
 * GET /api/reports
 */
exports.listReports = async (req, res) => {
  try {
    const { isConnected } = getDatabaseStatus();
    const userId = req.user ? req.user._id : req.query.userId;

    if (isConnected) {
      const filter = userId ? { userId } : {};
      const reports = await Report.find(filter).sort({ createdAt: -1 }).limit(20);
      return res.json({ success: true, data: reports });
    } else {
      let reports = memoryStore.reports;
      if (userId) {
        reports = reports.filter(r => r.userId === userId);
      }
      return res.json({ success: true, data: reports });
    }
  } catch (error) {
    console.error('Error listing reports:', error);
    return res.status(500).json({ error: 'Failed to retrieve reports.' });
  }
};
