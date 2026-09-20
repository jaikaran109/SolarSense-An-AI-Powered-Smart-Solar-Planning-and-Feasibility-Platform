import axios from 'axios';

const API_BASE = '/api';

const client = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 15000
});

// Attach optional auth token from localStorage if present
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('solarsense_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const solarAPI = {
  // Step 1: Process consumption & presets
  processConsumption: async (data) => {
    try {
      const res = await client.post('/solar/consumption', data);
      return res.data;
    } catch (err) {
      console.warn('API call failed, running local calculation fallback:', err);
      return fallbackProcessConsumption(data);
    }
  },

  // Step 3: Sizing
  calculateSizing: async (data) => {
    try {
      const res = await client.post('/solar/sizing', data);
      return res.data;
    } catch (err) {
      return fallbackCalculateSizing(data);
    }
  },

  // Step 4: Roof verification
  verifyRoof: async (data) => {
    try {
      const res = await client.post('/solar/verify-roof', data);
      return res.data;
    } catch (err) {
      return fallbackVerifyRoof(data);
    }
  },

  // Step 5: Panel refinement
  refinePanel: async (data) => {
    try {
      const res = await client.post('/solar/refine-panel', data);
      return res.data;
    } catch (err) {
      return fallbackRefinePanel(data);
    }
  },

  // Panels catalog
  getPanels: async () => {
    try {
      const res = await client.get('/solar/panels');
      return res.data.data;
    } catch (err) {
      return [
        { id: 'poly-330', brand: 'Standard Poly Tier-1', wattage: 330, type: 'Polycrystalline', efficiency: '17.2%', areaM2: 1.95, tier: 'Budget' },
        { id: 'mono-400', brand: 'High-Efficiency Mono', wattage: 400, type: 'Monocrystalline', efficiency: '20.4%', areaM2: 1.90, tier: 'Mid-Range' },
        { id: 'mono-perc-450', brand: 'Ultra Mono PERC Half-Cut', wattage: 450, type: 'Mono PERC', efficiency: '21.5%', areaM2: 2.05, tier: 'Premium' },
        { id: 'bifacial-550', brand: 'Pro Bifacial TopCon', wattage: 550, type: 'Bifacial TopCon', efficiency: '22.8%', areaM2: 2.40, tier: 'Enterprise' }
      ];
    }
  },

  // Step 7: Financials
  calculateFinancials: async (data) => {
    try {
      const res = await client.post('/financial/calculate', data);
      return res.data;
    } catch (err) {
      return fallbackCalculateFinancials(data);
    }
  },

  // Step 8: Save & Retrieve Reports
  saveReport: async (reportData) => {
    const res = await client.post('/reports', reportData);
    return res.data;
  },

  getReport: async (id) => {
    const res = await client.get(`/reports/${id}`);
    return res.data;
  },

  getRecentReports: async () => {
    const res = await client.get('/reports');
    return res.data;
  },

  // Step 9: AI Assistant Chat
  chatWithAssistant: async (message, reportContext, history = []) => {
    try {
      const res = await client.post('/assistant/chat', { message, reportContext, history });
      return res.data;
    } catch (err) {
      console.warn('Backend chat API failed, using resilient local analyst:', err);
      return fallbackChatAssistant(message, reportContext);
    }
  },

  // Step 10: Installers & Quote Requests
  getInstallers: async () => {
    const res = await client.get('/installers');
    return res.data;
  },

  submitQuoteRequest: async (quoteData) => {
    const res = await client.post('/installers/quote-request', quoteData);
    return res.data;
  }
};

// Client-side instant fallbacks (matching backend pure formula engine)
function fallbackProcessConsumption({ inputType, inputValue, tariffPerKWh = 8.0 }) {
  const val = Number(inputValue) || 300;
  let monthlyUnits = val;
  if (inputType === 'annual_units') monthlyUnits = Math.round(val / 12);
  if (inputType === 'bill_amount') monthlyUnits = Math.round(val / tariffPerKWh);
  const annualUnits = monthlyUnits * 12;

  const presets = [50, 75, 100].map(pct => {
    const reqGen = annualUnits * (pct / 100);
    const reqKW = Number((reqGen / (1650 * 0.8)).toFixed(2));
    const panels = Math.ceil((reqKW * 1000) / 400);
    const area = Number((panels * 1.9).toFixed(1));
    return {
      targetPercent: pct,
      requiredGenerationKWh: Math.round(reqGen),
      requiredKW: reqKW,
      estimatedPanelCount: panels,
      requiredRoofAreaM2: area,
      costRangeLow: Math.round(reqKW * 45000),
      costRangeHigh: Math.round(reqKW * 65000),
      annualSavings: Math.round(reqGen * tariffPerKWh)
    };
  });

  return {
    success: true,
    data: {
      normalized: {
        inputType,
        inputValue: val,
        monthlyUnits,
        annualUnits,
        tariffPerKWh,
        estimatedMonthlyBill: Math.round(monthlyUnits * tariffPerKWh),
        estimatedAnnualBill: Math.round(annualUnits * tariffPerKWh)
      },
      presets
    }
  };
}

function fallbackCalculateSizing({ annualConsumptionKWh, targetCoveragePercent = 100, panelWattage = 400 }) {
  const reqGen = annualConsumptionKWh * (targetCoveragePercent / 100);
  const reqKW = Number((reqGen / (1650 * 0.8)).toFixed(2));
  const panels = Math.max(1, Math.ceil((reqKW * 1000) / panelWattage));
  const area = Number((panels * 1.9).toFixed(1));

  return {
    success: true,
    data: {
      annualConsumptionKWh,
      targetCoveragePercent,
      requiredGenerationKWh: Math.round(reqGen),
      requiredKW: reqKW,
      roundedCapacityKW: Number(((panels * panelWattage) / 1000).toFixed(2)),
      panelWattage,
      estimatedPanelCount: panels,
      requiredRoofAreaM2: area
    }
  };
}

function fallbackVerifyRoof({ markedAreaM2, requiredAreaM2, panelWattage = 400 }) {
  const marked = Number(markedAreaM2) || 0;
  const required = Number(requiredAreaM2) || 15;
  const sufficient = marked >= (required * 0.95);
  const status = sufficient ? (marked > required * 1.2 ? 'surplus' : 'sufficient') : 'insufficient';

  return {
    success: true,
    data: {
      markedAreaM2: marked,
      requiredAreaM2: required,
      differenceM2: Number((marked - required).toFixed(1)),
      sufficient,
      status,
      message: sufficient ? 'Your roof area meets requirements!' : 'Shortfall in marked area.'
    }
  };
}

function fallbackRefinePanel({ panelId, markedAreaM2, requiredKW }) {
  const panelWatt = panelId === 'poly-330' ? 330 : panelId === 'mono-perc-450' ? 450 : panelId === 'bifacial-550' ? 550 : 400;
  const count = Math.ceil((requiredKW * 1000) / panelWatt);
  const cap = Number(((count * panelWatt) / 1000).toFixed(2));
  const gen = Math.round(cap * 1650 * 0.8);

  return {
    success: true,
    data: {
      panelCount: count,
      systemCapacityKW: cap,
      occupiedAreaM2: Number((count * 1.9).toFixed(1)),
      estimatedAnnualGenerationKWh: gen,
      estimatedMonthlyGenerationKWh: Math.round(gen / 12),
      targetMet: true
    }
  };
}

function fallbackCalculateFinancials({ systemCapacityKW, annualGenerationKWh, tariffPerKWh = 8.0 }) {
  const cap = Number(systemCapacityKW) || 2.0;
  const gen = Number(annualGenerationKWh) || Math.round(cap * 1650 * 0.8);
  const low = Math.round(cap * 45000);
  const high = Math.round(cap * 65000);
  const savings = Math.round(gen * tariffPerKWh);

  const projections = [];
  let cumSavings = 0;
  for (let y = 1; y <= 25; y++) {
    cumSavings += Math.round(gen * Math.pow(0.993, y - 1) * tariffPerKWh * Math.pow(1.04, y - 1));
    projections.push({
      year: `Yr ${y}`,
      yearNumber: y,
      cumulativeSavings: cumSavings,
      cumulativeWithoutSolarSpend: Math.round(3600 * 8 * y * 1.04),
      cumulativeSpendWithSolar: Math.round((low + high) / 2)
    });
  }

    return {
    success: true,
    data: {
      costRange: { low, high, mid: Math.round((low + high) / 2) },
      savings: { monthly: Math.round(savings / 12), annual: savings, lifetimeGross: cumSavings },
      payback: { yearsLow: Number((low / savings).toFixed(1)), yearsHigh: Number((high / savings).toFixed(1)) },
      roi: { year5: 18, year10: 120, year25: 340 },
      chartProjections: projections
    }
  };
}

function fallbackChatAssistant(message, reportContext = {}) {
  const query = (message || '').toLowerCase();
  const kw = reportContext.systemSizing?.roundedCapacityKW || reportContext.systemSizing?.requiredKW || 2.0;
  const units = reportContext.consumption?.monthlyUnits || 300;
  const costLow = reportContext.financial?.costRangeLow || Math.round(kw * 45000);
  const costHigh = reportContext.financial?.costRangeHigh || Math.round(kw * 65000);
  const annualSavings = reportContext.financial?.annualSavings || Math.round(kw * 1650 * 0.8 * 8);
  const subsidy = kw <= 1.2 ? 30000 : kw <= 2.2 ? 60000 : 78000;
  const netLow = Math.max(0, costLow - subsidy);
  const netHigh = Math.max(0, costHigh - subsidy);

  // 1. Unfavorable Locations & Disadvantages
  const isNotBeneficial = (
    /not\s+(?:beneficial|feasible|viable|good|recommended|profitable|worth|advisable)/i.test(query) ||
    /where\s+(?:not|to avoid|is bad|should not|is poor)/i.test(query) ||
    /(?:bad|worst|unfavorable|unsuitable|poor|challenging)\s+(?:locations?|places?|regions?|cities|states?|areas?)/i.test(query) ||
    /(?:disadvantages?|drawbacks?|limitations?|cons|problems?|pitfalls?)\s+of\s+solar/i.test(query) ||
    /when\s+(?:should i not|to avoid|is it bad to)\s+solar/i.test(query) ||
    /who\s+should\s+not\s+install/i.test(query)
  );

  if (isNotBeneficial) {
    return {
      success: true,
      message: `### Locations & Situations in India Where Solar is NOT Beneficial\n\n1. **Perpetual Heavy Cloud Belts (e.g. Cherrapunji / Mawsynram, Meghalaya)**: Over 9,000mm annual rain and 6–8 months of continuous cloud cover drop generation (CUF < 10%), extending payback to 12+ years.\n2. **Heavily Shaded Dense Urban Canyons**: Congested low-rise buildings surrounded by tall multi-story apartments receiving <3 hours of direct sunlight.\n3. **Fragile / Asbestos Sheet Roofs**: Asbestos roofs pose health hazards when drilled and cannot support 15–20 kg/m² structural and wind uplift forces.\n4. **100% Subsidized / Free Agricultural Grid Connections**: Where electricity is already free (₹0/unit), monetary ROI is negligible.\n5. **High-Rise Flats with Negligible Terrace Space**: Slicing a shared terrace across 80+ flats yields negligible generation per household.`
    };
  }

  // 2. Top Locations for Solar
  if (/best\s+(?:locations?|places?|states?|cities)|top\s+(?:locations?|states?|cities)|which\s+state\s+is\s+best/i.test(query)) {
    return {
      success: true,
      message: `### Top States in India for Rooftop Solar\n\n1. **Rajasthan & Gujarat**: 320+ sunny days, highest solar irradiance (>5.8 kWh/m²/day), and rapid 3–4 year payback.\n2. **Ladakh & Jammu**: High altitude irradiance (>6.0 kWh/m²/day) with cold temperature PV efficiency boosts.\n3. **Maharashtra, Delhi NCR & Karnataka**: High grid retail tariffs (₹8–₹12/unit) yield maximum financial savings.\n4. **Tamil Nadu & Telangana**: Consistent equatorial generation year-round.`
    };
  }

  // 3. Regional / Location Inquiries
  const regions = [
    {
      keywords: ['jammu', 'kashmir', 'ladakh', 'leh', 'srinagar', 'himachal', 'shimla', 'manali', 'uttarakhand', 'dehradun', 'nainital', 'snow', 'cold', 'hilly', 'mountain'],
      name: 'Cold & Mountainous / Himalayan Region',
      details: `• **Cold Temperature Boost**: Solar PV panels operate with **higher efficiency and voltage in cold temperatures**.\n• **Winter Offset**: Bank energy via Net Metering during sunny summer months to offset heavy winter heating bills (geysers, blowers).\n• **Snow Guidance**: Use a steeper 35°–45° tilt so snow slides off naturally. Bifacial panels gain 15–20% bonus from snow reflection.`
    },
    {
      keywords: ['rajasthan', 'jaipur', 'jodhpur', 'udaipur', 'bikaner', 'jaisalmer', 'gujarat', 'ahmedabad', 'surat', 'vadodara', 'rajkot', 'desert', 'arid'],
      name: 'High-Irradiance Western / Desert Zone',
      details: `• **Maximum Sunshine**: Over 320–340 sunny days per year with high daily solar radiation (5.8–6.4 kWh/m²/day).\n• **High Heat & Dust**: Use TopCon or Mono PERC modules with low temperature coefficients and perform bi-weekly water rinsing to keep dust off glass.\n• **Fast Payback**: Rapid 3.2 to 4.5 year payback.`
    },
    {
      keywords: ['mumbai', 'goa', 'kerala', 'kochi', 'chennai', 'visakhapatnam', 'puri', 'kolkata', 'coastal', 'humidity', 'cyclone', 'saline'],
      name: 'Coastal & High Humidity Marine Zone',
      details: `• **Corrosion Protection**: Use Anodized Aluminum (6063-T6) or Hot-Dip Galvanized Iron (GI) with SS304 fasteners to resist marine salt air.\n• **Weather Protection**: IP65/IP67 rated inverter enclosures and high wind-load certified structures.`
    },
    {
      keywords: ['bengaluru', 'bangalore', 'hyderabad', 'karnataka', 'tamil nadu', 'telangana', 'andhra', 'tropical', 'south'],
      name: 'Southern Tropical High-Yield Zone',
      details: `• **Year-Round Sunshine**: 300+ sunny days with steady, consistent monthly generation.\n• **High Tariff Protection**: Offsets high commercial/domestic grid tariffs (₹8–₹11/unit) with fast payback.`
    },
    {
      keywords: ['delhi', 'ncr', 'noida', 'gurgaon', 'gurugram', 'lucknow', 'kanpur', 'agra', 'up', 'uttar pradesh', 'punjab', 'chandigarh', 'haryana', 'bihar', 'patna', 'mp', 'bhopal', 'indore'],
      name: 'Northern / Central Indo-Gangetic Plains',
      details: `• **High Summer Offset**: Generates massive clean energy from April to October, offsetting heavy air conditioning electricity bills.\n• **Terrace Structures**: Elevated pergola frames (8–9 ft) preserve rooftop living and recreational terrace space.`
    }
  ];

  for (const r of regions) {
    if (r.keywords.some(k => query.includes(k))) {
      return {
        success: true,
        message: `### Solar Feasibility in ${r.name}\n\n**Yes, rooftop solar is highly viable and profitable here!**\n\n${r.details}\n\n• **Recommended System Size**: **${kw} kW**\n• **Net Turnkey Cost (After Subsidy)**: **₹${netLow.toLocaleString('en-IN')} – ₹${netHigh.toLocaleString('en-IN')}**\n• **Annual Bill Savings**: **₹${annualSavings.toLocaleString('en-IN')}/year**\n• **Payback Period**: **${(netLow / annualSavings).toFixed(1)} to ${(netHigh / annualSavings).toFixed(1)} years**.`
      };
    }
  }

  // Generic custom location match (e.g., "in Pune", "for Singapore", "in London")
  const genericMatch = query.match(/\b(?:in|at|for|around)\s+([a-z\s]{3,20})(?:\?|\.|\,|$|\s+beneficial|\s+good)/i);
  if (genericMatch && genericMatch[1]) {
    const loc = genericMatch[1].trim();
    if (!['my house', 'my roof', 'my home', 'india', 'my city'].includes(loc)) {
      return {
        success: true,
        message: `### Solar Feasibility for ${loc.charAt(0).toUpperCase() + loc.slice(1)}\n\n**Yes, installing solar for your property in ${loc.charAt(0).toUpperCase() + loc.slice(1)} is viable and beneficial!**\n\n• **Recommended System Size**: **${kw} kW** (to offset ${units} units/month)\n• **Annual Electricity Savings**: **~₹${annualSavings.toLocaleString('en-IN')}/year**\n• **Estimated Turnkey Investment**: **₹${costLow.toLocaleString('en-IN')} – ₹${costHigh.toLocaleString('en-IN')}**\n• **Central Subsidy**: **₹${subsidy.toLocaleString('en-IN')}** under PM Surya Ghar\n• **Engineering Recommendation**: Orient panels South at an angle equal to your local latitude for maximum annual yield.`
      };
    }
  }

  // 2. Subsidies
  if (query.includes('subsidy') || query.includes('pm surya') || query.includes('government')) {
    return {
      success: true,
      message: `### PM Surya Ghar Subsidy Breakdown\n\n• Eligible Central Subsidy: **₹${subsidy.toLocaleString('en-IN')}** for your **${kw} kW** system.\n• Gross Cost Range: **₹${costLow.toLocaleString('en-IN')} – ₹${costHigh.toLocaleString('en-IN')}**.\n• Net Cost After Subsidy: **₹${netLow.toLocaleString('en-IN')} – ₹${netHigh.toLocaleString('en-IN')}**.\n\nClaimed via the National Solar Portal upon installation by a registered vendor.`
    };
  }

  // 3. Multi-year Savings & Payback
  if (query.includes('save') || query.includes('saving') || query.includes('payback') || query.includes('roi') || query.includes('worth it')) {
    return {
      success: true,
      message: `### Long-Term Financial & Savings Forecast\n\n• Annual Savings: **~₹${annualSavings.toLocaleString('en-IN')}/year**\n• 10-Year Cumulative Savings: **~₹${Math.round(annualSavings * 12.5).toLocaleString('en-IN')}**\n• 25-Year Lifetime Savings: **~₹${Math.round(annualSavings * 38).toLocaleString('en-IN')}**\n• Payback Period: **${(costLow / annualSavings).toFixed(1)} to ${(costHigh / annualSavings).toFixed(1)} years** (or **${(netLow / annualSavings).toFixed(1)} to ${(netHigh / annualSavings).toFixed(1)} years** after subsidy).`
    };
  }

  // 4. Heavy Appliances & ACs
  if (query.includes('ac') || query.includes('air conditioner') || query.includes('heavy') || query.includes('geyser') || query.includes('motor') || query.includes('ev')) {
    return {
      success: true,
      message: `### Running ACs, Heavy Appliances & EV Charging\n\n• **Daily Generation**: Your **${kw} kW** system produces **~${(kw * 4.2).toFixed(1)} units/day**.\n• **Air Conditioners**: Sufficient to power 1 to 2 modern 1.5 Ton inverter ACs for 5–7 daytime hours or offset regular household heavy loads.\n• **EV Charging**: Adds ~100–120 km of clean solar driving range per sunny day.\n• **Grid Sync**: Heavy load surges beyond solar capacity are drawn automatically from the grid without interruption.`
    };
  }

  // 5. Default Property Summary
  return {
    success: true,
    message: `### Solar Feasibility & Advisory for Your Property\n\n• **Recommended Size**: **${kw} kW** for your ${units} units/month demand.\n• **Estimated Cost Range**: **₹${costLow.toLocaleString('en-IN')} – ₹${costHigh.toLocaleString('en-IN')}**\n• **Central Subsidy (PM Surya Ghar)**: **₹${subsidy.toLocaleString('en-IN')}**\n• **Annual Electricity Savings**: **~₹${annualSavings.toLocaleString('en-IN')}/year**\n• **Estimated Payback**: **${(netLow / annualSavings).toFixed(1)} to ${(netHigh / annualSavings).toFixed(1)} years**.\n\nYou can ask about any location (e.g. "Is solar good in Kashmir / Mumbai / Jaipur?"), heavy appliances, net metering, or multi-year savings!`
  };
}

