const mongoose = require('mongoose');

let isConnected = false;
let memoryStore = {
  reports: [],
  installers: [
    {
      id: 'inst-1',
      name: 'SunPro Energy Solutions',
      tier: 'Premier EPC Partner',
      rating: 4.9,
      reviewCount: 142,
      location: 'Pan-India / Regional Hubs',
      completedProjects: '1,200+ homes',
      servicesOffered: ['Rooftop Grid-Tied Solar', 'Hybrid Inverters & Battery Storage', 'Net Metering Approvals', '25-Yr Maintenance'],
      warranty: '25-Year Performance / 10-Year Workmanship',
      contactInfo: 'support@sunproenergy.in | +91 98765 43210',
      badge: 'Top Rated'
    },
    {
      id: 'inst-2',
      name: 'GreenVolt CleanTech Systems',
      tier: 'Certified Mono-PERC Specialist',
      rating: 4.8,
      reviewCount: 98,
      location: 'Metro & Tier-1 Cities',
      completedProjects: '850+ homes',
      servicesOffered: ['Mono-PERC Solar Rooftops', 'Elevated High-Rise Mounting', 'DISCOM Paperwork', 'Mobile App Monitoring'],
      warranty: '25-Year Linear Output Guarantee',
      contactInfo: 'hello@greenvolt.co.in | +91 98123 45678',
      badge: 'Fast Installation'
    },
    {
      id: 'inst-3',
      name: 'SunPowerX Renewable Infra',
      tier: 'Industrial & Residential Solar',
      rating: 4.7,
      reviewCount: 76,
      location: 'North & Western Region',
      completedProjects: '650+ homes',
      servicesOffered: ['Standard & Premium Rooftops', 'Microinverter Systems', 'Zero-Export Devices', 'Comprehensive AMC'],
      warranty: '30-Year Bifacial Warranty',
      contactInfo: 'sales@sunpowerx.in | +91 98989 12345',
      badge: 'Best Value'
    },
    {
      id: 'inst-4',
      name: 'EcoRay Solar Technologies',
      tier: 'Smart Home Solar & EV Charging',
      rating: 4.9,
      reviewCount: 110,
      location: 'South & Central India',
      completedProjects: '950+ installations',
      servicesOffered: ['Solar + EV Charger Combo', 'Smart Load Diverters', 'Bifacial Solar Pergolas', 'Rapid 7-Day Commissioning'],
      warranty: '25-Year Linear Power Warranty',
      contactInfo: 'contact@ecoray.in | +91 97777 88899',
      badge: 'Tech Leader'
    }
  ],
  quotes: [],
  users: []
};

const dns = require('dns');

async function connectDB() {
  const uri = process.env.MONGODB_URI;

  // Set reliable public DNS for SRV record resolution on Windows
  try {
    dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
  } catch (e) {
    // Ignore if not supported in environment
  }

  if (!uri || uri.includes('example') || uri === 'mongodb://localhost:27017/solarsense') {
    // Try to connect to localhost if available, or fall back to resilient in-memory
    try {
      mongoose.set('strictQuery', false);
      const connUri = uri || 'mongodb://localhost:27017/solarsense';
      await mongoose.connect(connUri, { serverSelectionTimeoutMS: 2000 });
      isConnected = true;
      console.log('✅ MongoDB Connected successfully to local/remote instance.');
      return;
    } catch (err) {
      console.warn('⚠️  MongoDB connection skipped or unavailable (' + err.message + ').');
      console.log('🚀 Running in resilient in-memory datastore mode. All features will work seamlessly.');
      isConnected = false;
      return;
    }
  }

  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
    isConnected = true;
    console.log('✅ Connected to MongoDB Atlas cluster.');
  } catch (err) {
    console.warn('⚠️  MongoDB connection error (' + err.message + '). Falling back to in-memory store.');
    isConnected = false;
  }
}

function getDatabaseStatus() {
  return {
    isConnected,
    mode: isConnected ? 'mongodb' : 'in-memory'
  };
}

module.exports = {
  connectDB,
  getDatabaseStatus,
  memoryStore
};
