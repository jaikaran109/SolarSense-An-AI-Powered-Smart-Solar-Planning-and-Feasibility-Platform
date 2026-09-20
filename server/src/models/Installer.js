const mongoose = require('mongoose');

const quoteRequestSchema = new mongoose.Schema({
  installerId: { type: String, required: true },
  installerName: { type: String, required: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  city: { type: String },
  systemSizeKW: { type: Number },
  estimatedCostRange: { type: String },
  comments: { type: String },
  reportId: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const installerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  rating: { type: Number, default: 4.8 },
  reviewCount: { type: Number, default: 50 },
  servicesOffered: [{ type: String }],
  contactInfo: { type: String, required: true },
  tier: { type: String, default: 'Certified Installer' },
  completedProjects: { type: String, default: '500+ installations' },
  warranty: { type: String, default: '25-Year Performance' },
  badge: { type: String }
});

const Installer = mongoose.model('Installer', installerSchema);
const QuoteRequest = mongoose.model('QuoteRequest', quoteRequestSchema);

module.exports = {
  Installer,
  QuoteRequest
};
