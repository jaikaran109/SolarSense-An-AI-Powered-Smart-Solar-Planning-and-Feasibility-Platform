require('dotenv').config();
const app = require('./src/app');
const { connectDB } = require('./src/config/db');

const PORT = process.env.PORT || 5000;

async function startServer() {
  // Connect to Database or initialize in-memory store
  await connectDB();

  app.listen(PORT, () => {
    console.log(`===============================================`);
    console.log(`☀️  SolarSense Server running on http://localhost:${PORT}`);
    console.log(`📡 API Endpoints available at http://localhost:${PORT}/api`);
    console.log(`===============================================`);
  });
}

startServer();
