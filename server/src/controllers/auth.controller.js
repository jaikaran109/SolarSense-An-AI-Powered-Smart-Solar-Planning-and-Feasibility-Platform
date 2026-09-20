const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { memoryStore, getDatabaseStatus } = require('../config/db');

const SALT_ROUNDS = 10;

/**
 * Register user (optional for saving report history)
 * POST /api/auth/register
 */
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    if (typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const { isConnected } = getDatabaseStatus();
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    if (isConnected) {
      const existing = await User.findOne({ email: email.toLowerCase() });
      if (existing) {
        return res.status(400).json({ error: 'Account already exists with this email.' });
      }

      const newUser = new User({
        name: name ? name.trim() : 'Solar Explorer',
        email: email.toLowerCase().trim(),
        passwordHash: hashedPassword
      });
      const saved = await newUser.save();

      return res.status(201).json({
        success: true,
        user: { _id: saved._id, name: saved.name, email: saved.email },
        token: saved._id.toString()
      });
    } else {
      const existing = memoryStore.users.find(u => u.email === email.toLowerCase().trim());
      if (existing) {
        return res.status(400).json({ error: 'Account already exists with this email.' });
      }

      const userId = 'usr_' + Date.now();
      const newUser = {
        _id: userId,
        id: userId,
        name: name ? name.trim() : 'Solar Explorer',
        email: email.toLowerCase().trim(),
        passwordHash: hashedPassword,
        savedReports: []
      };
      memoryStore.users.push(newUser);

      return res.status(201).json({
        success: true,
        user: { _id: newUser._id, name: newUser.name, email: newUser.email },
        token: userId
      });
    }
  } catch (err) {
    console.error('Error in user registration:', err);
    return res.status(500).json({ error: 'Registration failed.' });
  }
};

/**
 * Login user
 * POST /api/auth/login
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const { isConnected } = getDatabaseStatus();

    let user = null;
    if (isConnected) {
      user = await User.findOne({ email: email.toLowerCase().trim() });
    } else {
      user = memoryStore.users.find(u => u.email === email.toLowerCase().trim());
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Verify password with bcrypt, with graceful fallback for legacy hashes
    let isMatch = false;
    if (user.passwordHash.startsWith('$2a$') || user.passwordHash.startsWith('$2b$') || user.passwordHash.startsWith('$2y$')) {
      isMatch = await bcrypt.compare(password, user.passwordHash);
    } else {
      isMatch = user.passwordHash === 'hash_' + password || user.passwordHash === password;
    }

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    return res.json({
      success: true,
      user: { _id: user._id, name: user.name, email: user.email },
      token: user._id.toString()
    });
  } catch (err) {
    console.error('Error in login:', err);
    return res.status(500).json({ error: 'Login failed.' });
  }
};

/**
 * Get current session user info
 * GET /api/auth/me
 */
exports.getMe = async (req, res) => {
  if (!req.user) {
    return res.json({ success: true, user: null });
  }
  return res.json({
    success: true,
    user: {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email
    }
  });
};
