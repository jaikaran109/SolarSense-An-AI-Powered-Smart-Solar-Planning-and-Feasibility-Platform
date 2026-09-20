const { generateSolarAssistantResponse } = require('../services/aiService');

/**
 * AI Assistant Chat Endpoint
 * POST /api/assistant/chat
 * Accepts message, reportContext, and optional conversation history
 */
exports.handleChat = async (req, res) => {
  try {
    const { message, reportContext, history } = req.body;

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return res.status(400).json({ error: 'A valid message string is required.' });
    }

    const reply = await generateSolarAssistantResponse({
      message: message.trim(),
      reportContext: reportContext || {},
      history: history || []
    });

    return res.json({
      success: true,
      message: reply
    });
  } catch (error) {
    console.error('Error handling AI assistant chat:', error);
    return res.status(500).json({
      success: false,
      error: 'AI Assistant temporarily unavailable. Please try again.',
      message: 'I encountered an issue processing your question. Please try asking again or check your network connection.'
    });
  }
};
