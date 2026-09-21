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

// Disconnect with a hard cap: if the initial mongoose.connect() is still
// stuck (e.g. an Atlas SRV/DNS stall), a plain `await mongoose.disconnect()`
// waits for that pending connection forever and the server never starts
// listening. The race guarantees connectDB() always resolves so the server
// boots into resilient in-memory mode.
async function safeDisconnect() {
  try {
    await Promise.race([
      mongoose.disconnect(),
      new Promise((resolve) => setTimeout(resolve, 2000)),
    ]);
  } catch (e) { /* ignore */ }
}

async function connectDB() {
  const uri = process.env.MONGODB_URI;

  // Guard against the whole boot hanging: cap TOTAL time spent here.
  // Render kills the deploy if the port isn't listening in time, and
  // Atlas SRV/DNS stalls are the #1 cause. Fail fast -> in-memory mode.
  const withTimeout = (promise, ms, label) =>
    Promise.race([
      promise,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms)
      ),
    ]);

  const tryConnect = async (connUri, timeoutMs) => {
    mongoose.set('strictQuery', false);
    await withTimeout(
      mongoose.connect(connUri, { serverSelectionTimeoutMS: timeoutMs }),
      timeoutMs + 2000,
      `MongoDB connect (${connUri.split('@')[1] || 'local'})`
    );
  };

  // Set reliable public DNS for SRV record resolution on local Windows dev only.
  // NEVER override DNS on Render/Heroku/etc — it breaks the platform resolver
  // and can take down Atlas SRV lookups + health checks.
  if (process.env.NODE_ENV !== 'production') {
    try {
      dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
    } catch (e) {
      // Ignore if not supported in environment
    }
  }

  if (!uri || uri.includes('example') || uri === 'mongodb://localhost:27017/solarsense') {
    // No real URI configured — try localhost FAST, then in-memory.
    // (Render has no local mongo, so this must fail in ~2s, not hang.)
    try {
      const connUri = uri && !uri.includes('example') ? uri : 'mongodb://localhost:27017/solarsense';
      await tryConnect(connUri, 2000);
      isConnected = true;
      console.log('✅ MongoDB Connected successfully to local/remote instance.');
      return;
    } catch (err) {
      console.warn('⚠️  MongoDB connection skipped or unavailable (' + err.message + ').');
      console.log('🚀 Running in resilient in-memory datastore mode. All features will work seamlessly.');
      // Make extra sure no half-open connection keeps retrying in background
      await safeDisconnect();
      isConnected = false;
      return;
    }
  }

  try {
    await tryConnect(uri, 8000);
    isConnected = true;
    console.log('✅ Connected to MongoDB Atlas cluster.');
  } catch (err) {
    console.warn('⚠️  MongoDB connection error (' + err.message + '). Falling back to in-memory store.');
    await safeDisconnect();
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
