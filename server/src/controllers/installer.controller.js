const { memoryStore, getDatabaseStatus } = require('../config/db');
const { Installer, QuoteRequest } = require('../models/Installer');

/**
 * Returns seeded list of verified recommended solar installers
 * GET /api/installers
 */
exports.getInstallers = async (req, res) => {
  try {
    const { isConnected } = getDatabaseStatus();

    if (isConnected) {
      let installers = await Installer.find();
      if (!installers || installers.length === 0) {
        // Seed initial data
        installers = await Installer.insertMany(memoryStore.installers);
      }
      return res.json({ success: true, data: installers });
    } else {
      return res.json({ success: true, data: memoryStore.installers });
    }
  } catch (error) {
    console.error('Error fetching installers:', error);
    return res.json({ success: true, data: memoryStore.installers });
  }
};

/**
 * Stores a user quote request for a specific installer
 * POST /api/installers/quote-request
 */
exports.submitQuoteRequest = async (req, res) => {
  try {
    const {
      installerId,
      installerName,
      fullName,
      email,
      phone,
      city,
      systemSizeKW,
      estimatedCostRange,
      comments,
      reportId
    } = req.body;

    if (!fullName || !email || !phone) {
      return res.status(400).json({ error: 'Name, email, and phone number are required.' });
    }

    const quoteData = {
      installerId: installerId || 'inst-1',
      installerName: installerName || 'SunPro Energy Solutions',
      fullName,
      email,
      phone,
      city: city || 'Local Area',
      systemSizeKW: Number(systemSizeKW) || 0,
      estimatedCostRange: estimatedCostRange || '₹45,000 - ₹65,000',
      comments: comments || '',
      reportId: reportId || '',
      createdAt: new Date()
    };

    const { isConnected } = getDatabaseStatus();

    if (isConnected) {
      const quote = new QuoteRequest(quoteData);
      await quote.save();
    } else {
      memoryStore.quotes.push({ id: 'quote_' + Date.now(), ...quoteData });
    }

    return res.status(201).json({
      success: true,
      message: `Quote request submitted successfully to ${quoteData.installerName}! An advisor will contact you shortly.`,
      data: quoteData
    });
  } catch (error) {
    console.error('Error submitting quote request:', error);
    return res.status(500).json({ error: 'Failed to submit quote request.' });
  }
};
