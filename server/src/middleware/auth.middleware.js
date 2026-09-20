const User = require('../models/User');
const { memoryStore, getDatabaseStatus } = require('../config/db');

// Optional auth token extractor / session identifier
exports.optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      req.user = null;
      return next();
    }

    const token = authHeader.replace('Bearer ', '');
    // Simple decoded user or token lookup
    if (token) {
      const { isConnected } = getDatabaseStatus();
      if (isConnected) {
        try {
          const user = await User.findById(token);
          req.user = user;
        } catch (e) {
          req.user = null;
        }
      } else {
        const user = memoryStore.users.find(u => u._id === token || u.id === token);
        req.user = user || null;
      }
    }
    next();
  } catch (err) {
    req.user = null;
    next();
  }
};
