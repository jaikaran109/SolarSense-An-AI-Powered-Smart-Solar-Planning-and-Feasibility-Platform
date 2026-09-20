# ☀️ SolarSense: AI-Powered Smart Solar Planning and Feasibility Platform

SolarSense is a full-stack web application designed for homeowners to calculate solar panel feasibility using a **consumption-first approach**. 

Instead of traditional "area-first" solar tools that assume the user wants to blindly fill their entire roof, SolarSense sizes the system based on the user's actual electricity offset goals (e.g., 50% vs 100% offset) before verifying physical roof fit on satellite maps with Turf.js.

---

## 🚀 Key Features & Core Flow

1. **Electricity Demand Input**: Enter monthly/annual units (kWh) or average electricity bill (₹) with dynamic tariff adjustments and residential presets.
2. **Target Coverage Goal Setting**: Side-by-side comparison of **Full Coverage (100%)**, **Partial Coverage (50%)**, or **Custom Target (%)** showing estimated system size, panels, and cost before selection.
3. **Consumption-Based System Sizing**: Automatic calculation of required generation (kWh), system capacity (kW), panel count, and clear roof space ($m^2$).
4. **Satellite Map Roof Verification**: Interactive map with Turf.js polygon calculations to measure clear usable roof space (excluding water tanks and shading) and compare against requirements.
5. **Panel Specification Selection**: Choose between 330W Poly, 400W Mono, 450W Mono PERC, and 550W Bifacial modules with instant live recalculations.
6. **Range-Based Financial Analysis**: Honest cost ranges (₹45,000–₹65,000/kW), annual savings, payback period ranges, and 25-year ROI forecasts.
7. **PM Surya Ghar Loan & EMI Calculator**: Interactive financing calculator modeling concessional PSU bank loans (7.0% p.a.), down payments, and comparing Monthly EMI vs Monthly Solar Savings to prove **Day 1 Cashflow Positivity**.
8. **1-Click WhatsApp & Email Share Suite**: Share full executive feasibility assessments instantly with friends, family, or contractors.
9. **Regional Climate & Solar PV Radiation Metrics**: Peak Sun Hours (PSH: 4.8–5.5 hrs/day), 12-month generation distribution curve modeling monsoon dips, and structural load ratings.
10. **Bilingual Localization (English & हिंदी)**: Seamless one-click language toggle across the entire application.
11. **Contextual AI Solar Assistant**: Built-in AI chat consultant that contextually explains sizing, PM Surya Ghar subsidies, and regional climate adaptations (powered by Google Gemini with smart local fallback).
12. **Recommended Local Installers**: Seeded directory of verified EPC solar contractors with a "Request Quote" lead generation modal.
13. **Enterprise Security & Live MongoDB Atlas**: Password hashing with `bcryptjs` (10 salt rounds), `helmet` CSP/HTTP headers, and `express-rate-limit` DDoS/brute-force defense.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Recharts, Turf.js, Leaflet / Mapbox, Canvas Confetti.
- **Backend**: Node.js, Express.js, MongoDB Atlas (with automated resilient in-memory fallback), Mongoose, bcryptjs, Helmet, Express-Rate-Limit.
- **AI Layer**: Isolated service supporting Google Gemini API with smart context-aware solar advisor fallback.

---

## 📂 Project Structure

```
solar-ai-platform/
├── client/                      # React frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/          # AuthModal, UI elements
│   │   │   ├── layout/          # Navbar, Footer, StepWizardBar
│   │   │   ├── consumption/     # Steps 1, 2, 3: Consumption & Target Sizing
│   │   │   ├── map/             # Step 4: Turf.js & Satellite Map Roof Check
│   │   │   ├── panels/          # Step 5: Hardware Spec Selection
│   │   │   ├── report/          # Step 6: 8 KPI Cards, Recharts, Solar Loan & Weather
│   │   │   ├── installers/      # Verified EPC Installers & Quote Modal
│   │   │   └── assistant/       # Context-Aware Solar AI Chatbot
│   │   ├── pages/
│   │   │   ├── Home.jsx         # Landing page with value proposition
│   │   │   └── Estimate.jsx     # Multi-step guided wizard
│   │   ├── context/
│   │   │   ├── EstimationContext.jsx
│   │   │   ├── AuthContext.jsx
│   │   │   └── LanguageContext.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   └── utils/
│   │       └── formatters.js
│   └── package.json
│
├── server/                      # Node + Express backend
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js            # MongoDB Atlas + In-Memory Fallback
│   │   ├── models/
│   │   │   ├── Report.js
│   │   │   ├── Installer.js
│   │   │   └── User.js
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/
│   │   │   ├── solarCalcEngine.js   # Pure formula engine
│   │   │   ├── costEstimator.js     # Range-based financial engine
│   │   │   └── aiService.js         # Isolated LLM service
│   │   └── app.js
│   ├── server.js
│   └── package.json
│
├── .env.example
├── .gitignore
└── README.md
```

---

## 🚦 Getting Started

### 1. Backend Setup

```bash
cd server
npm install
npm run dev
```
The server will start on **http://localhost:5000**.

### 2. Frontend Setup

In a new terminal window:
```bash
cd client
npm install
npm run dev
```
The client will start on **http://localhost:5173**.

---

## 📐 Formulas & Constants

- **Annual Irradiance Factor**: 1,650 kWh/kW/year
- **System Performance Ratio**: 80% (0.80)
- **Turnkey Cost per kW**: ₹45,000 to ₹65,000 / kW
- **Roof Space Footprint**: ~1.90 m² / 400W panel
- **Required Generation (kWh/yr)** = $\text{Annual Consumption (kWh)} \times \text{Target Coverage (\%)} $
- **Required System Size (kW)** = $\frac{\text{Required Generation (kWh)}}{\text{Irradiance} \times \text{Performance Ratio}}$
- **Payback (Years, Range)** = $\frac{\text{Installation Cost Range}}{\text{Annual Electricity Savings}}$

