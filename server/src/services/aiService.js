/**
 * SolarSense - AI Solar Assistant Service
 * Provides intelligent, natural-language analysis of the user's solar feasibility report.
 * Supports Google Gemini API with smart context-aware conversational engine fallback.
 */

const https = require('https');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });

/**
 * Strips surrounding quotes, unwanted markdown escaping, and cleans text.
 */
function cleanOutput(text) {
  if (!text || typeof text !== 'string') return '';
  let cleaned = text.trim();
  // Remove outer quotes if wrapped like "..." or '...' or “...”
  cleaned = cleaned.replace(/^["'“”«»]+|["'“”«»]+$/g, '').trim();
  // Remove awkward quote patterns
  cleaned = cleaned.replace(/\\"/g, '"').replace(/\\'/g, "'");
  return cleaned;
}

/**
 * Helper: Compound savings calculator with 0.7% degradation and 4% tariff inflation.
 */
function calculateCompoundSavings(annualGen, tariff, years) {
  let totalSavings = 0;
  let totalUnits = 0;
  const yearlyBreakdown = [];

  for (let y = 1; y <= years; y++) {
    const degradationFactor = Math.pow(0.993, y - 1);
    const inflationFactor = Math.pow(1.04, y - 1);
    const yrGen = annualGen * degradationFactor;
    const yrTariff = tariff * inflationFactor;
    const yrSavings = yrGen * yrTariff;

    totalSavings += yrSavings;
    totalUnits += yrGen;
    yearlyBreakdown.push({
      year: y,
      generationKWh: Math.round(yrGen),
      effectiveTariff: Number(yrTariff.toFixed(2)),
      yearSavings: Math.round(yrSavings),
      cumulativeSavings: Math.round(totalSavings)
    });
  }

  return {
    totalSavings: Math.round(totalSavings),
    totalUnits: Math.round(totalUnits),
    yearlyBreakdown
  };
}

/**
 * Main AI generation entry point.
 */
async function generateSolarAssistantResponse({ message, reportContext = {}, history = [] }) {
  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (geminiApiKey && geminiApiKey.trim() !== '' && geminiApiKey !== 'your_gemini_api_key_here') {
    try {
      const response = await callGeminiAPI(geminiApiKey, message, reportContext, history);
      if (response && response.trim().length > 0) {
        return cleanOutput(response);
      }
    } catch (err) {
      console.warn('Gemini API call failed, using smart contextual assistant fallback:', err.message);
    }
  }

  // Smart Context-Aware Natural Language Expert Engine
  return cleanOutput(generateContextualAnalysis(message, reportContext));
}

/**
 * Calls Google Gemini REST API
 */
async function callGeminiAPI(apiKey, userMessage, reportContext, history) {
  const systemPrompt = `You are "SolarSense AI", an expert solar engineering and financial advisor.
You are helping a homeowner understand their customized solar feasibility report.
User report context:
${JSON.stringify(reportContext, null, 2)}

Strict Guidelines:
1. Emphasize the "Consumption-First" philosophy (sizing to meet their bill offset target rather than blindly covering the whole roof).
2. Always calculate savings dynamically for whatever duration (e.g., 30 years, 10 years, 5 years) the user asks about!
3. Always refer to costs and paybacks as realistic RANGES (not single fixed numbers).
4. If their marked roof area has a shortfall, clearly explain why and suggest adjustments.
5. Keep explanations conversational, crystal clear, encouraging, and technically sound.
6. Use bullet points and clean formatting when breaking down numbers.
7. NEVER enclose your entire response in quotation marks. Avoid unnecessary quotes around terms.`;

  const contents = [];

  // Add previous conversational turns if any
  if (Array.isArray(history)) {
    for (const item of history.slice(-6)) {
      if (item && item.text) {
        contents.push({
          role: item.role === 'user' ? 'user' : 'model',
          parts: [{ text: item.text }]
        });
      }
    }
  }

  // Add the current user query with report context attached
  contents.push({
    role: 'user',
    parts: [{ text: `[SYSTEM CONTEXT: ${systemPrompt}]\n\nUser Question: ${userMessage}` }]
  });

  const postData = JSON.stringify({
    contents,
    generationConfig: {
      temperature: 0.4,
      maxOutputTokens: 950
    }
  });

  return new Promise((resolve, reject) => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const req = https.request(
      url,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            if (json.candidates && json.candidates[0]?.content?.parts?.[0]?.text) {
              resolve(json.candidates[0].content.parts[0].text);
            } else if (json.error) {
              reject(new Error(json.error.message || 'Gemini API error'));
            } else {
              reject(new Error('Unexpected Gemini response format'));
            }
          } catch (e) {
            reject(e);
          }
        });
      }
    );

    req.on('error', (e) => reject(e));
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Gemini API request timeout'));
    });

    req.write(postData);
    req.end();
  });
}

/**
 * Smart Contextual Solar Expert Engine
 * Formulates precise, deeply tailored answers using the user's live calculation state.
 */
/**
 * Location Database & Regional Solar Climate Intelligence
 */
const REGIONAL_KNOWLEDGE_BASE = [
  {
    id: 'cold_mountain',
    names: [
      'jammu', 'kashmir', 'ladakh', 'leh', 'srinagar', 'j&k', 'himachal', 'shimla', 'manali',
      'dharamshala', 'kullu', 'mandi', 'solan', 'uttarakhand', 'dehradun', 'nainital', 'mussoorie',
      'rishikesh', 'haridwar', 'almora', 'sikkim', 'gangtok', 'arunachal', 'itangar', 'meghalaya',
      'shillong', 'nagaland', 'kohima', 'mizoram', 'aizawl', 'manipur', 'imphal', 'tripura', 'agartala',
      'assam', 'guwahati', 'silchar', 'darjeeling'
    ],
    zone: 'Himalayan / Cold & Mountainous Region',
    avgSunnyDays: '280–310 days (with seasonal snow in winter)',
    irradiance: '4.8 – 6.2 kWh/m²/day (Ladakh >6.0)',
    tiltRecommendation: '32° to 45° South-facing (steep tilt enables natural snow sliding)',
    temperatureBonus: 'High cold-weather efficiency boost (+10% to +15% higher voltage output vs hot plains)',
    subsidyCategory: 'Special Category State/UT (Eligible for additional State/UT nodal subsidies via JAKEDA/HIMURJA/UREDA + PM Surya Ghar)',
    specialConsiderations: [
      'Bifacial TopCon modules yield up to +20% bonus winter generation due to high snow ground albedo reflection.',
      'Heavy-duty hot-dip Galvanized Iron (GI) mounting structures certified for high snow and mountain wind loads are required.',
      'Bank solar energy via Net Metering during high-sun spring/summer to offset heavy winter heating (geysers, blowers, radiators).'
    ]
  },
  {
    id: 'arid_desert',
    names: [
      'rajasthan', 'jaipur', 'jodhpur', 'udaipur', 'bikaner', 'jaisalmer', 'kota', 'ajmer', 'alwar', 'bhilwara',
      'sikar', 'pali', 'barmer', 'gujarat', 'ahmedabad', 'surat', 'vadodara', 'rajkot', 'bhavnagar', 'jamnagar',
      'junagadh', 'gandhinagar', 'kutch', 'bhuj', 'anand', 'morbi', 'gwalior', 'morena'
    ],
    zone: 'Arid / High-Irradiance Western Zone',
    avgSunnyDays: '320–340 clear sunny days/year',
    irradiance: '5.6 – 6.4 kWh/m²/day (Among the highest in India)',
    tiltRecommendation: '22° to 26° South-facing',
    temperatureBonus: 'High ambient summer temperatures require modules with low Temperature Coefficient (Pmax < -0.35%/°C) like TopCon or Mono PERC',
    subsidyCategory: 'Standard Central Subsidy (PM Surya Ghar up to ₹78,000) + fast-track state DISCOM approvals (e.g. Surya Gujarat)',
    specialConsiderations: [
      'High dust and sand accumulation requires bi-weekly rinsing or automated sprinkler cleaning systems.',
      'Elevated structures improve natural rear ventilation, cooling panels to maximize summer generation.',
      'Extremely rapid financial payback (typically 3.2 to 4.5 years).'
    ]
  },
  {
    id: 'coastal_saline',
    names: [
      'mumbai', 'navi mumbai', 'thane', 'ratnagiri', 'sindhudurg', 'goa', 'panaji', 'margao', 'vasco',
      'kerala', 'kochi', 'cochin', 'thiruvananthapuram', 'trivandrum', 'kozhikode', 'calicut', 'thrissur',
      'kollam', 'alappuzha', 'palakkad', 'kannur', 'chennai', 'kanchipuram', 'cuddalore', 'nagapattinam',
      'puducherry', 'pondicherry', 'visakhapatnam', 'vizag', 'kakinada', 'machilipatnam', 'odisha',
      'puri', 'bhubaneswar', 'cuttack', 'balasore', 'kolkata', 'howrah', 'daman', 'diu'
    ],
    zone: 'Coastal / High-Humidity & Saline Marine Zone',
    avgSunnyDays: '280–300 sunny days/year (monsoon rain dip in June–August)',
    irradiance: '5.0 – 5.6 kWh/m²/day',
    tiltRecommendation: '12° to 18° South-facing',
    temperatureBonus: 'Moderate year-round temperatures provide consistent baseline generation',
    subsidyCategory: 'PM Surya Ghar Central Subsidy + State Net Metering',
    specialConsiderations: [
      'Marine saline air demands corrosion-resistant materials: Anodized Aluminum 6063-T6 or Hot-Dip GI (minimum 80 microns) with SS304/SS316 fasteners.',
      'Inverters and AC/DC junction boxes must carry IP65 / IP67 weatherproof protection ratings.',
      'Mounting frames must be engineered to withstand coastal cyclonic wind speeds (up to 160–180 km/h).'
    ]
  },
  {
    id: 'southern_tropical',
    names: [
      'karnataka', 'bengaluru', 'bangalore', 'mysuru', 'mysore', 'hubballi', 'hubli', 'mangaluru', 'mangalore',
      'belagavi', 'tamil nadu', 'coimbatore', 'madurai', 'tiruchirappalli', 'trichy', 'salem', 'tirunelveli',
      'vellore', 'erode', 'telangana', 'hyderabad', 'secunderabad', 'warangal', 'nizamabad', 'karimnagar',
      'andhra pradesh', 'vijayawada', 'guntur', 'nellore', 'kurnool', 'tirupati', 'rajahmundry'
    ],
    zone: 'Southern Tropical / Year-Round High-Yield Zone',
    avgSunnyDays: '300–320 sunny days/year',
    irradiance: '5.2 – 5.8 kWh/m²/day',
    tiltRecommendation: '13° to 18° South-facing (optimized for equatorial latitude)',
    temperatureBonus: 'Equable tropical climate provides consistent month-over-month energy yield throughout the year',
    subsidyCategory: 'PM Surya Ghar Central Subsidy + BESCOM / TSSPDCL / TANGEDCO Net Metering',
    specialConsiderations: [
      'High electricity tariffs in metropolitan zones (₹8–₹11/unit) drive accelerated return on investment.',
      'TopCon and Mono-PERC modules are ideal for high roof space efficiency on compact urban villas.',
      'Bi-directional net meters enable seamless settlement with DISCOMs.'
    ]
  },
  {
    id: 'gangetic_central',
    names: [
      'delhi', 'new delhi', 'ncr', 'noida', 'greater noida', 'gurgaon', 'gurugram', 'faridabad', 'ghaziabad',
      'uttar pradesh', 'up', 'lucknow', 'kanpur', 'agra', 'varanasi', 'prayagraj', 'allahabad', 'meerut',
      'bareilly', 'aligarh', 'moradabad', 'gorakhpur', 'punjab', 'ludhiana', 'amritsar', 'jalandhar', 'patiala',
      'bathinda', 'chandigarh', 'haryana', 'ambala', 'karnal', 'panipat', 'rohtak', 'hisar', 'sonipat',
      'bihar', 'patna', 'gaya', 'bhagalpur', 'muzaffarpur', 'darbhanga', 'jharkhand', 'ranchi', 'jamshedpur',
      'dhanbad', 'bokaro', 'madhya pradesh', 'mp', 'indore', 'bhopal', 'jabalpur', 'ujjain', 'chhattisgarh',
      'raipur', 'bilaspur', 'durg', 'west bengal', 'asansol', 'siliguri', 'durgapur'
    ],
    zone: 'Northern / Central Indo-Gangetic Plains',
    avgSunnyDays: '290–310 sunny days/year (winter fog in Dec–Jan factored in)',
    irradiance: '5.1 – 5.7 kWh/m²/day',
    tiltRecommendation: '25° to 30° South-facing',
    temperatureBonus: 'High summer generation offsets massive air conditioning bills (April to October)',
    subsidyCategory: 'PM Surya Ghar Central Subsidy (up to ₹78,000) + State Portal Integration (e.g. UPNEDA)',
    specialConsiderations: [
      'Winter morning fog (Dec–Jan) causes temporary generation dip, but heavy summer solar output balances the annual average.',
      'Elevated pergola rooftop structures (8–9 ft) are popular to preserve recreational terrace usage.',
      'Significant protection against recurring utility tariff hikes (historically 4%–7% annually).'
    ]
  }
];

/**
 * Extracts and categorizes location from user text
 */
function detectLocationInfo(text) {
  const clean = text.toLowerCase();

  for (const region of REGIONAL_KNOWLEDGE_BASE) {
    for (const name of region.names) {
      // Word boundary match
      const regex = new RegExp(`\\b${name}\\b`, 'i');
      if (regex.test(clean)) {
        return {
          matchedName: name.charAt(0).toUpperCase() + name.slice(1),
          region
        };
      }
    }
  }

  // Generic location extractor (e.g. "in London", "for California", "at Pune", "in Dubai")
  const genericMatch = clean.match(/\b(?:in|at|for|around|near|across)\s+([a-z\s]{3,25})(?:\?|\.|\,|$|\s+beneficial|\s+good|\s+solar)/i);
  if (genericMatch && genericMatch[1]) {
    const rawLoc = genericMatch[1].trim();
    // Exclude common stop words
    const stopWords = ['my home', 'my roof', 'my house', 'this area', 'india', 'my city', 'my state', 'winter', 'summer', 'monsoon'];
    if (!stopWords.includes(rawLoc) && rawLoc.length >= 3) {
      return {
        matchedName: rawLoc.charAt(0).toUpperCase() + rawLoc.slice(1),
        region: {
          id: 'custom_location',
          zone: `${rawLoc.charAt(0).toUpperCase() + rawLoc.slice(1)} Region`,
          avgSunnyDays: '280–320 days/year',
          irradiance: '4.8 – 5.8 kWh/m²/day',
          tiltRecommendation: 'Equal to location latitude ± 5° facing the Equator (South in Northern Hemisphere)',
          temperatureBonus: 'Standard PV efficiency curves apply (optimal at lower cell temperatures)',
          subsidyCategory: 'Eligible for standard residential rooftop solar schemes & Net Metering',
          specialConsiderations: [
            'System sized accurately to match your monthly bill offset target.',
            'South-facing orientation maximizes total annual kilowatt-hour harvest.',
            'Net metering enables credit accumulation during peak sunny hours.'
          ]
        }
      };
    }
  }

  return null;
}

/**
 * Smart Universal Solar Expert Engine
 * Handles any location, financial inquiry, structural condition, appliances, or policy question.
 */
function generateContextualAnalysis(userMessage, reportContext = {}) {
  const query = (userMessage || '').toLowerCase().trim();

  // Extract Context Data
  const consumption = reportContext.consumption || {};
  const sizing = reportContext.systemSizing || {};
  const roof = reportContext.roofVerification || {};
  const financial = reportContext.financial || {};
  const panel = reportContext.panelSpec || {};
  const generation = reportContext.generation || {};

  const monthlyUnits = Number(consumption.monthlyUnits) || 300;
  const annualUnits = Number(consumption.annualUnits) || (monthlyUnits * 12);
  const tariff = Number(consumption.tariffPerKWh) || 8.0;
  const targetPercent = Number(consumption.targetCoveragePercent || consumption.percent) || 50;

  const systemKW = Number(sizing.roundedCapacityKW || sizing.requiredKW || 2.0);
  const panelCount = Number(sizing.panelCount || sizing.estimatedPanelCount || 5);
  const panelWatt = Number(panel.wattage) || 400;

  const requiredArea = Number(sizing.requiredRoofAreaM2 || (panelCount * 1.9)).toFixed(1);
  const markedArea = Number(roof.markedAreaM2 || requiredArea).toFixed(1);
  const isSufficient = roof.sufficient !== false && Number(markedArea) >= (Number(requiredArea) * 0.95);

  const costRangeLow = Number(financial.costRangeLow || Math.round(systemKW * 45000));
  const costRangeHigh = Number(financial.costRangeHigh || Math.round(systemKW * 65000));
  const costMid = Math.round((costRangeLow + costRangeHigh) / 2);

  const annualGen = Number(generation.annualKWh || Math.round(systemKW * 1650 * 0.8));
  const monthlyGen = Math.round(annualGen / 12);
  const dailyGen = (annualGen / 365).toFixed(1);

  const annualSavings = Number(financial.annualSavings || Math.round(annualGen * tariff));
  const monthlySavings = Math.round(annualSavings / 12);
  const paybackLow = Number(financial.paybackYearsLow || (costRangeLow / annualSavings)).toFixed(1);
  const paybackHigh = Number(financial.paybackYearsHigh || (costRangeHigh / annualSavings)).toFixed(1);

  // Government Subsidy (PM Surya Ghar: Muft Bijli Yojana)
  let subsidyAmount = 0;
  if (systemKW <= 1.2) {
    subsidyAmount = 30000;
  } else if (systemKW <= 2.2) {
    subsidyAmount = 60000;
  } else {
    subsidyAmount = 78000; // Capped at ₹78,000 for 3kW+
  }
  const netCostLow = Math.max(0, costRangeLow - subsidyAmount);
  const netCostHigh = Math.max(0, costRangeHigh - subsidyAmount);
  const netPaybackLow = (netCostLow / annualSavings).toFixed(1);
  const netPaybackHigh = (netCostHigh / annualSavings).toFixed(1);

  // Environmental Impact
  const co2AvoidedTonnes = (annualGen * 0.00082).toFixed(1);
  const treesEquivalent = Math.round(annualGen * 0.00082 * 45);

  // =========================================================================
  // 1. UNFAVORABLE LOCATIONS, DISADVANTAGES & WHEN SOLAR IS NOT BENEFICIAL
  // =========================================================================
  const isNotBeneficialQuery = (
    /not\s+(?:beneficial|feasible|viable|good|recommended|profitable|worth|advisable)/i.test(query) ||
    /where\s+(?:not|to avoid|is bad|should not|is poor)/i.test(query) ||
    /(?:bad|worst|unfavorable|unsuitable|poor|challenging)\s+(?:locations?|places?|regions?|cities|states?|areas?)/i.test(query) ||
    /(?:disadvantages?|drawbacks?|limitations?|cons|problems?|pitfalls?)\s+of\s+solar/i.test(query) ||
    /when\s+(?:should i not|to avoid|is it bad to)\s+solar/i.test(query) ||
    /who\s+should\s+not\s+install/i.test(query)
  );

  if (isNotBeneficialQuery) {
    return `### Locations and Scenarios in India Where Solar is NOT Beneficial

While India enjoys ~300 sunny days on average, **rooftop solar is NOT recommended or has poor financial viability in the following specific locations and scenarios**:

1. **Perpetual Cloud & Extreme Rainfall Belts (e.g. Cherrapunji / Mawsynram, Meghalaya)**:
   • Areas receiving >9,000 mm annual rainfall with persistent cloud cover and dense fog for 6–8 months a year.
   • The Capacity Utilization Factor (**CUF**) drops below **9%–11%** (vs the normal 17%–20%), doubling the payback period to **10–14+ years**.

2. **Heavily Shaded Dense Urban Canyons (e.g., Congested Old City Walled Districts)**:
   • Independent houses closely surrounded by 4–6 story multi-story buildings that receive **less than 3 hours of direct sunlight per day** (especially between 10:00 AM and 3:00 PM).
   • Severe inter-building shading triggers inverter bypass diode losses and drastically curtails energy output.

3. **Weak, Temporary, or Asbestos Sheet Roofs**:
   • **Asbestos / Cement Sheet Roofs**: Drilling into asbestos releases carcinogenic fibers and causes catastrophic water leakage during monsoons.
   • **Weak Tin Sheds**: Cannot safely withstand the **15–25 kg/m² deadweight + 150 km/h wind uplift forces** without expensive substructure retrofitting.

4. **100% Subsidized / Free Grid Electricity Zones (e.g., Agricultural Feeders)**:
   • If your household/farm already receives free or heavily subsidized electricity (e.g., flat ₹0 to ₹1.50/unit), the **monetary ROI of a grid-tied system is negligible** since there are no electricity bills to offset.

5. **High-Rise Apartment Flats with Tiny Terrace Entitlement**:
   • In a 15-story building with 80 apartments sharing a 250 m² terrace, allocating solar capacity per individual flat yields only **~0.2 kW per family** (insufficient to power heavy loads, though common-area society solar remains viable).

6. **Temporary / Rented Accommodations**:
   • If you plan to relocate within 3–4 years, the capital expenditure and DISCOM net-meter relocation paperwork make solar uneconomical unless the property owner funds it.

---
**Summary for Your Property**:
For your property assessment (**${systemKW} kW** system, **${markedArea} m²** terrace, **₹${tariff}/unit** tariff), as long as your terrace has unshaded South exposure and an RCC flat roof, you are in an **optimal viability zone** with an estimated **${netPaybackLow} to ${netPaybackHigh} year payback**!`;
  }

  // =========================================================================
  // 2. TOP / BEST LOCATIONS FOR SOLAR IN INDIA
  // =========================================================================
  const isTopLocationsQuery = (
    /best\s+(?:locations?|places?|states?|cities|regions?)/i.test(query) ||
    /top\s+(?:locations?|states?|cities|regions?)/i.test(query) ||
    /highest\s+(?:sunshine|solar|irradiance|subsidy|generation)/i.test(query) ||
    /which\s+state\s+is\s+best/i.test(query)
  );

  if (isTopLocationsQuery) {
    return `### Top Locations and States in India for Rooftop Solar

1. **Rajasthan & Gujarat (Highest Irradiance & Fastest Payback)**:
   • 320–340 clear sunny days per year with irradiance >5.8 kWh/m²/day. Payback occurs in **3.0 to 4.2 years**.
2. **Ladakh & Jammu (Highest Solar Radiance & Cold Efficiency)**:
   • Thin atmosphere and high altitude provide exceptional solar irradiance (>6.0 kWh/m²/day) with cold temperature efficiency boosts.
3. **Maharashtra, Delhi NCR & Karnataka (Highest Grid Tariff Savings)**:
   • High domestic grid tariffs (₹8–₹12/unit) make every generated solar kilowatt-hour extremely valuable, resulting in massive annual savings.
4. **Tamil Nadu, Telangana & Andhra Pradesh (Year-Round Consistent Yield)**:
   • Steady equatorial sunshine throughout the year with minimal seasonal fluctuations.`;
  }

  // =========================================================================
  // 3. LOCATION-SPECIFIC INQUIRIES (Dynamic for ANY specific location/state/city)
  // =========================================================================
  const locInfo = detectLocationInfo(query);
  if (locInfo) {
    const { matchedName, region } = locInfo;
    return `### Solar Feasibility & Regional Analysis: ${matchedName} (${region.zone})

**Yes, installing rooftop solar in ${matchedName} is highly feasible and financially beneficial!** Here is the location-tailored engineering and financial assessment:

1. **Solar Climate & Irradiance in ${matchedName}**:
   • **Sunny Days**: **~${region.avgSunnyDays}**
   • **Solar Irradiance**: **${region.irradiance}**
   • **Temperature & Generation**: ${region.temperatureBonus}

2. **Tailored Financial Return for Your Home**:
   • **Recommended Capacity**: **${systemKW} kW** (${panelCount} panels) targeting **${targetPercent}% offset** (${monthlyUnits} units/month).
   • **Gross Cost Range**: ₹${costRangeLow.toLocaleString('en-IN')} – ₹${costRangeHigh.toLocaleString('en-IN')}
   • **Eligible Subsidy**: **₹${subsidyAmount.toLocaleString('en-IN')}** (${region.subsidyCategory})
   • **Effective Net Investment**: **₹${netCostLow.toLocaleString('en-IN')} – ₹${netCostHigh.toLocaleString('en-IN')}**
   • **Estimated Payback Period in ${matchedName}**: **${netPaybackLow} to ${netPaybackHigh} years** (Annual bill savings: **₹${annualSavings.toLocaleString('en-IN')}/year**)

3. **Engineering & Installation Recommendations for ${matchedName}**:
   • **Recommended Tilt Angle**: **${region.tiltRecommendation}**
${region.specialConsiderations.map(sc => `   • ${sc}`).join('\n')}

4. **Roof Space Verification**:
   • **Required Clear Area**: **${requiredArea} m²**
   • **Your Usable Marked Area**: **${markedArea} m²** (${isSufficient ? 'Fully Sufficient ✅' : 'Area Shortfall ⚠️'})`;
  }

  // =========================================================================
  // 4. GREETINGS & INTRODUCTIONS
  // =========================================================================
  if (/^(hi|hello|hey|greetings|namaste|good morning|good afternoon|good evening|who are you|help|start)\b/i.test(query)) {
    return `Hello! I am your SolarSense AI Consultant.

I have analyzed your customized solar feasibility assessment:
• System Capacity: **${systemKW} kW** (${panelCount} panels)
• Electricity Demand: **${monthlyUnits} units/month** (targeting **${targetPercent}% offset**)
• Estimated Annual Savings: **₹${annualSavings.toLocaleString('en-IN')}/year**
• Usable Roof Status: ${isSufficient ? `✅ Sufficient (${markedArea} m² available)` : `⚠️ Constrained (${markedArea} m² marked vs ${requiredArea} m² required)`}

How can I assist you? You can ask me about:
1. Feasibility in your specific city, state, or climate (e.g. "Is solar good in Kashmir / Mumbai / Jaipur?")
2. Government Subsidies (PM Surya Ghar)
3. Savings over 5, 10, 20, 25, or 30 Years
4. Rooftop structures, flat vs sloped roof, or shading
5. Net Metering, DISCOM approvals, and battery storage`;
  }

  // 3. SAVINGS, DYNAMIC NUMBER OF YEARS (e.g. 30 years, 15 years, 10 years, 5 years) & FINANCIAL FORECAST
  const yearMatch = query.match(/(\d+)\s*(?:years?|yrs?|yr|saal|sal)/i);
  const isSavingsQuery = query.includes('save') || query.includes('saving') || query.includes('earning') || query.includes('benefit') || query.includes('profit') || query.includes('long term') || query.includes('lifetime') || query.includes('bill reduction') || yearMatch;

  if (isSavingsQuery) {
    const requestedYears = yearMatch ? parseInt(yearMatch[1], 10) : 25;
    const validYears = Math.min(Math.max(requestedYears, 1), 50); // clamp 1 to 50

    const customCalc = calculateCompoundSavings(annualGen, tariff, validYears);
    const netProfitCustom = customCalc.totalSavings - costMid;
    const netProfitWithSubsidy = netProfitCustom + subsidyAmount;

    // Milestones
    const calc5 = calculateCompoundSavings(annualGen, tariff, 5);
    const calc10 = calculateCompoundSavings(annualGen, tariff, 10);
    const calc20 = calculateCompoundSavings(annualGen, tariff, 20);
    const calc25 = calculateCompoundSavings(annualGen, tariff, 25);
    const calc30 = calculateCompoundSavings(annualGen, tariff, 30);

    if (yearMatch) {
      return `### ${validYears}-Year Financial Savings & Return Forecast

Based on your **${systemKW} kW** system, your tariff of **₹${tariff}/kWh**, an assumed 4% annual grid tariff inflation, and 0.7%/year panel degradation:

• **Total ${validYears}-Year Cumulative Savings**: **₹${customCalc.totalSavings.toLocaleString('en-IN')}**
• **Estimated Clean Solar Units Generated**: **${customCalc.totalUnits.toLocaleString('en-IN')} kWh**
• **Initial Turnkey Investment**: ~₹${costMid.toLocaleString('en-IN')} (Gross: ₹${costRangeLow.toLocaleString('en-IN')} – ₹${costRangeHigh.toLocaleString('en-IN')})
• **Net Financial Profit Over ${validYears} Years**: **₹${netProfitCustom.toLocaleString('en-IN')}** (in pure electricity cost avoidance)
• **Net Profit with PM Surya Ghar Subsidy**: **₹${netProfitWithSubsidy.toLocaleString('en-IN')}** (after ₹${subsidyAmount.toLocaleString('en-IN')} central grant)

**Savings Milestone Progression:**
• **Year 1**: ₹${annualSavings.toLocaleString('en-IN')}
• **Year 5**: ₹${calc5.totalSavings.toLocaleString('en-IN')}
• **Year 10**: ₹${calc10.totalSavings.toLocaleString('en-IN')}
• **Year 20**: ₹${calc20.totalSavings.toLocaleString('en-IN')}
• **Year 25**: ₹${calc25.totalSavings.toLocaleString('en-IN')}
• **Year 30**: ₹${calc30.totalSavings.toLocaleString('en-IN')}
${validYears !== 1 && validYears !== 5 && validYears !== 10 && validYears !== 20 && validYears !== 25 && validYears !== 30 ? `• **Year ${validYears}**: **₹${customCalc.totalSavings.toLocaleString('en-IN')}**` : ''}`;
    }

    return `### Electricity Bill Savings & Lifetime Forecast

Based on your **${systemKW} kW** system with tariff of **₹${tariff}/kWh** (4% annual grid inflation):

• **Monthly Bill Savings**: **~₹${monthlySavings.toLocaleString('en-IN')}/month**
• **Year 1 Annual Savings**: **₹${annualSavings.toLocaleString('en-IN')}**
• **5-Year Cumulative Savings**: **₹${calc5.totalSavings.toLocaleString('en-IN')}**
• **10-Year Cumulative Savings**: **₹${calc10.totalSavings.toLocaleString('en-IN')}**
• **20-Year Cumulative Savings**: **₹${calc20.totalSavings.toLocaleString('en-IN')}**
• **25-Year Lifetime Savings**: **₹${calc25.totalSavings.toLocaleString('en-IN')}**
• **30-Year Extended Savings**: **₹${calc30.totalSavings.toLocaleString('en-IN')}**

**Net Profit Over 25 Years**:
After recovering your initial installation cost (~₹${costMid.toLocaleString('en-IN')}), your net financial benefit is approximately **₹${(calc25.totalSavings - costMid).toLocaleString('en-IN')}** in pure electricity cost avoidance (or **₹${(calc25.totalSavings - costMid + subsidyAmount).toLocaleString('en-IN')}** with PM Surya Ghar subsidy).`;
  }

  // 4. GOVERNMENT SUBSIDY & PM SURYA GHAR SCHEME
  if (query.includes('subsidy') || query.includes('pm surya') || query.includes('surya ghar') || query.includes('government') || query.includes('scheme') || query.includes('grant') || query.includes('discount')) {
    return `### PM Surya Ghar: Muft Bijli Yojana Subsidy Breakdown

Under the Central Government solar subsidy scheme for residential homes:

• **Subsidy for 1 kW**: ₹30,000
• **Subsidy for 2 kW**: ₹60,000
• **Subsidy for 3 kW and above**: ₹78,000 (maximum cap)

**For your ${systemKW} kW system:**
• **Eligible Central Subsidy**: **₹${subsidyAmount.toLocaleString('en-IN')}**
• **Estimated Gross Cost**: ₹${costRangeLow.toLocaleString('en-IN')} – ₹${costRangeHigh.toLocaleString('en-IN')}
• **Effective Net Cost (After Subsidy)**: **₹${netCostLow.toLocaleString('en-IN')} – ₹${netCostHigh.toLocaleString('en-IN')}**
• **Accelerated Payback Period**: **${netPaybackLow} to ${netPaybackHigh} years**

To claim this subsidy, installation must be completed by a registered vendor through the National Portal with ALMM-approved DCR solar modules and net metering.`;
  }

  // 5. WHY THIS SIZE / WHY NOT BIGGER (Consumption-First Principle)
  if (query.includes('why') && (query.includes('recommend') || query.includes('size') || query.includes('capacity') || query.includes('kw') || query.includes('bigger') || query.includes('small'))) {
    return `### Why We Recommend a ${systemKW} kW System

1. **Consumption-First Sizing**: Instead of covering your entire roof arbitrarily, SolarSense sizes your system to meet your selected **${targetPercent}% bill offset target** (${Math.round(annualUnits * (targetPercent / 100)).toLocaleString('en-IN')} kWh/year).
2. **Avoiding Low Feed-in Tariffs**: In most DISCOM regions, consuming your own solar power saves you the full grid retail rate (~₹${tariff}/kWh), whereas exporting surplus power often yields a much lower feed-in credit (~₹2.5 to ₹3.5/kWh). Sizing for self-consumption yields the highest return.
3. **Optimized Payback**: A ${systemKW} kW system (${panelCount} panels, ${requiredArea} m²) delivers an optimal payback period of **${paybackLow} to ${paybackHigh} years** without unnecessary capital expenditure.`;
  }

  // 6. TARGET ADJUSTMENTS (50% vs 75% vs 100% Net Zero)
  if (query.includes('75%') || query.includes('100%') || query.includes('50%') || query.includes('net zero') || query.includes('full coverage') || query.includes('change target') || query.includes('different target')) {
    const kw100 = ((annualUnits / (1650 * 0.8))).toFixed(2);
    const panels100 = Math.ceil((kw100 * 1000) / panelWatt);
    const area100 = (panels100 * 1.9).toFixed(1);
    const cost100Low = Math.round(kw100 * 45000);
    const cost100High = Math.round(kw100 * 65000);

    return `### Coverage Target Comparison

• **Your Selected Target (${targetPercent}% Offset)**:
  - System Size: **${systemKW} kW** (${panelCount} panels)
  - Required Roof Space: **${requiredArea} m²**
  - Estimated Cost Range: **₹${costRangeLow.toLocaleString('en-IN')} – ₹${costRangeHigh.toLocaleString('en-IN')}**
  - Annual Savings: **₹${annualSavings.toLocaleString('en-IN')}**

• **Full Net-Zero (100% Offset)**:
  - System Size: **~${kw100} kW** (${panels100} panels)
  - Required Roof Space: **~${area100} m²**
  - Estimated Cost Range: **₹${cost100Low.toLocaleString('en-IN')} – ₹${cost100High.toLocaleString('en-IN')}**
  - Roof Fit Status: ${Number(markedArea) >= Number(area100) ? `✅ Fits on your marked roof (${markedArea} m² available)` : `⚠️ Requires ${area100} m², which exceeds your marked area of ${markedArea} m²`}

You can easily adjust your target coverage anytime in the estimation flow.`;
  }

  // 7. ROOF FEASIBILITY, SHORTFALL & OBSTRUCTIONS
  if (query.includes('roof') || query.includes('area') || query.includes('space') || query.includes('fit') || query.includes('shortfall') || query.includes('terrace') || query.includes('shadow') || query.includes('water tank') || query.includes('structure') || query.includes('pergola') || query.includes('elevated') || query.includes('tin') || query.includes('sheet')) {
    if (isSufficient) {
      return `### Roof Feasibility & Physical Fit

• **Required Clear Roof Area**: **${requiredArea} m²** (for ${panelCount} × ${panelWatt}W modules)
• **Your Usable Marked Roof**: **${markedArea} m²**
• **Feasibility Status**: **Fully Sufficient ✅**

**Key Structural & Layout Recommendations**:
1. **Clearance & Walkways**: Maintain at least a 0.5m perimeter walkway for safe maintenance and module washing.
2. **Shadow Avoidance**: Position arrays to avoid shadows cast by overhead water tanks, staircases (mumty), or parapet walls between 9:00 AM and 4:00 PM.
3. **Elevated Super-Structures**: If you wish to use the terrace for gardening, drying clothes, or recreation, install an elevated Galvanized Iron (GI) frame (8–9 ft clearance).
4. **Tin / Metal Sheet Roofs**: Use specialized mini-rail or non-penetrating standing seam clamps to prevent water leakage.`;
    } else {
      const shortfall = (Number(requiredArea) - Number(markedArea)).toFixed(1);
      const achievableKW = ((Number(markedArea) / 1.9) * (panelWatt / 1000)).toFixed(1);
      return `### Roof Space Shortfall Notice

• **Required Area for Target**: **${requiredArea} m²**
• **Your Marked Usable Area**: **${markedArea} m²**
• **Space Shortfall**: **${shortfall} m²**

**How to Proceed**:
1. **Downsize Capacity**: With your available ${markedArea} m², you can comfortably fit **~${achievableKW} kW**, which still offsets significant power.
2. **High-Efficiency Panels**: Switching to 550W Bifacial or TopCon modules produces more power per square metre.
3. **Elevated Structure**: Installing panels on a raised frame over your rooftop water tank or mumty unlocks additional usable space.`;
    }
  }

  // 8. COST, PRICING & WHY IT IS A RANGE
  if (query.includes('cost') || query.includes('price') || query.includes('range') || query.includes('quotation') || query.includes('budget') || query.includes('expensive') || query.includes('investment') || query.includes('capex')) {
    return `### System Cost Breakdown & Why Costs Are Shown as a Range

• **Estimated Turnkey Cost Range**: **₹${costRangeLow.toLocaleString('en-IN')} – ₹${costRangeHigh.toLocaleString('en-IN')}** (₹45,000 to ₹65,000 per kW).

**Why is cost shown as a range?**
1. **Module & Inverter Selection**: Standard Poly/Mono panels with string inverters represent the budget tier (~₹45k/kW), whereas Mono-PERC or Bifacial TopCon modules with microinverters represent the premium tier (~₹65k/kW).
2. **Mounting Structures**: Standard ground/roof flush clamps are economical, whereas elevated galvanized iron (GI) structures designed to withstand high wind loads cost slightly more.
3. **Wiring, Protection & Approvals**: Variations in AC/DC surge protection devices (SPDs), earthing pits, bi-directional net meter procurement, and DISCOM liaisoning fees across different states.

You can request binding, itemized quotes from verified regional installers directly from the report dashboard.`;
  }

  // 9. PAYBACK PERIOD & RETURN ON INVESTMENT
  if (query.includes('payback') || query.includes('recover') || query.includes('roi') || query.includes('break even') || query.includes('breakeven') || query.includes('return') || query.includes('worth it')) {
    return `### Payback Period and ROI Analysis

• **Turnkey Investment**: **₹${costRangeLow.toLocaleString('en-IN')} – ₹${costRangeHigh.toLocaleString('en-IN')}**
• **Annual Electricity Bill Reduction**: **~₹${annualSavings.toLocaleString('en-IN')}/year**
• **Estimated Payback Period**: **${paybackLow} to ${paybackHigh} years** (or **${netPaybackLow} to ${netPaybackHigh} years** with PM Surya Ghar subsidy).
• **25-Year Return on Investment (ROI)**: Over **320%**.

Solar provides an inflation-proof internal rate of return (IRR) typically exceeding 18% to 24% per annum, drastically outperforming conventional fixed deposits and mutual fund benchmarks.`;
  }

  // 10. NET METERING, DISCOM & GRID EXPORT
  if (query.includes('net meter') || query.includes('net-meter') || query.includes('grid') || query.includes('export') || query.includes('discom') || query.includes('feed in') || query.includes('surplus') || query.includes('meter')) {
    return `### How Net Metering Works

1. **Bi-Directional Meter**: Your utility (DISCOM) replaces your standard meter with a bidirectional meter that records both power imported from the grid and solar energy exported to the grid.
2. **Daytime Generation**: During peak sunny hours, your solar system powers your home appliances. Any extra electricity flows into the utility grid, turning your meter backward.
3. **Nighttime & Overcast Consumption**: At night, you seamlessly draw power from the grid.
4. **Billing & Settlement**: At the end of each billing cycle, you are billed only for the net units (Imported Units minus Exported Units). Excess credits roll over to subsequent months according to state DISCOM regulations.`;
  }

  // 11. POWER CUTS, BATTERIES & NIGHT USAGE
  if (query.includes('power cut') || query.includes('blackout') || query.includes('load shedding') || query.includes('battery') || query.includes('night') || query.includes('hybrid') || query.includes('off grid') || query.includes('backup') || query.includes('inverter')) {
    return `### Power Outages, Night Usage & Battery Storage

• **Standard Grid-Tied Systems**: For safety reasons (anti-islanding regulations), standard grid-tied solar systems automatically shut down during grid power cuts so linemen can safely repair grid lines.
• **Night Usage**: Without batteries, solar panels do not generate power at night; your home uses grid power, which is offset by net-metered energy credits generated during the day.
• **Need Power Backup?**: If your locality experiences frequent power cuts, you can opt for a **Hybrid Inverter with Lithium Battery Storage**. This allows daytime solar power to charge your batteries and power critical loads (lights, fans, refrigerator, router) during outages.`;
  }

  // 12. RUNNING HEAVY APPLIANCES & AIR CONDITIONERS & EV CHARGING
  if (query.includes('ac') || query.includes('air conditioner') || query.includes('geyser') || query.includes('heavy') || query.includes('motor') || query.includes('refrigerator') || query.includes('ev') || query.includes('car') || query.includes('electric vehicle') || query.includes('pump')) {
    const acUnits = (systemKW / 1.5).toFixed(1);
    return `### Running Heavy Loads, ACs and EV Charging

• **Daily Solar Generation**: Your **${systemKW} kW** system produces approximately **${dailyGen} kWh (units) per day**.
• **Air Conditioners (1.5 Ton Inverter AC)**: A modern 5-star 1.5 Ton inverter AC consumes roughly 1.0 to 1.4 units per hour of continuous running.
• **Appliances Capacity**: Your system generates enough daily energy to run **${Math.floor(acUnits) || 1} to 2 inverter ACs** for 5–7 hours or easily offset water heaters, refrigerators, and washing machines.
• **Electric Vehicle (EV) Charging**: A 3.3 kW home AC slow charger can add ~15–20 kWh (approx. 100–120 km of driving range) purely on solar electricity every sunny day!
• **Seamless Grid Backup**: Because the system operates in sync with the grid, if appliance load momentarily exceeds solar generation, the difference is drawn from the grid automatically.`;
  }

  // 13. PANEL TYPES & HARDWARE COMPARISON
  if (query.includes('panel type') || query.includes('poly') || query.includes('mono') || query.includes('perc') || query.includes('bifacial') || query.includes('which panel') || query.includes('best panel') || query.includes('efficiency') || query.includes('topcon')) {
    return `### Solar Panel Technology Comparison

• **330W Polycrystalline**: Budget-friendly, lower efficiency (~17%), requires ~25% more roof area.
• **400W Monocrystalline** *(Your Current Selection)*: High efficiency (~20.4%), excellent performance-to-cost ratio, sleek black appearance.
• **450W Mono PERC Half-Cut**: Enhanced low-light and shade tolerance, efficiency (~21.5%), ideal for compact roofs.
• **550W Bifacial TopCon**: Enterprise grade (~22.8% efficiency), captures reflected sunlight from the rear on white or reflective roof tiles, generating up to 10–20% bonus energy.

For residential terraces, **400W Mono or 450W Mono PERC** modules provide the best balance of efficiency, space savings, and longevity.`;
  }

  // 14. WEATHER, MONSOON, CLOUDS & RAIN
  if (query.includes('cloud') || query.includes('rain') || query.includes('monsoon') || query.includes('winter') || query.includes('weather') || query.includes('season') || query.includes('cyclone') || query.includes('hail')) {
    return `### Performance During Weather Variations & Monsoons

• **Diffuse Sunlight**: Solar PV panels do not require direct sunlight to generate electricity; they operate on diffuse light and typically produce **20% to 40%** of their rated capacity on overcast or rainy days.
• **Seasonal Irradiance Factored In**: Our calculation uses an annual solar irradiance factor of **1,650 kWh/kW/year**, which already factors in rainy monsoon months and shorter winter daylight hours.
• **Natural Cleaning**: Rain showers naturally clean accumulated dust and pollen from panel glass, restoring peak efficiency.
• **Hail & Wind Resistance**: Tier-1 modules use 3.2mm tempered toughened glass tested to resist 25mm hailstones striking at 80 km/h and wind loads of up to 2400 Pascals.`;
  }

  // 15. MAINTENANCE, CLEANING & LIFESPAN
  if (query.includes('maintenance') || query.includes('clean') || query.includes('dust') || query.includes('warranty') || query.includes('life') || query.includes('durability') || query.includes('degradation')) {
    return `### Maintenance, Cleaning and Warranties

1. **Panel Lifespan & Warranty**: Tier-1 solar modules come with a **25-year linear performance warranty** (guaranteed >80% power output at Year 25) and a 10–12 year product warranty.
2. **Inverter Lifespan**: String inverters typically last 10–15 years and come with a 5–10 year warranty. Microinverters offer 20–25 year warranties.
3. **Routine Maintenance**: Solar panels have zero moving parts. Rinsing them with plain water every 2–3 weeks in the morning or evening is all that is required to prevent dust buildup.`;
  }

  // 16. ENVIRONMENTAL & CARBON IMPACT
  if (query.includes('carbon') || query.includes('co2') || query.includes('environment') || query.includes('tree') || query.includes('green') || query.includes('pollution')) {
    return `### Environmental and Carbon Offset

By switching to your **${systemKW} kW** solar system:

• **Annual Clean Energy**: **${annualGen.toLocaleString('en-IN')} kWh/year**
• **CO₂ Emissions Avoided**: **~${co2AvoidedTonnes} metric tons/year**
• **Equivalent Trees Planted**: Equal to planting **~${treesEquivalent} mature trees** annually
• **25-Year Clean Energy Output**: Over **${Math.round(annualGen * 23).toLocaleString('en-IN')} kWh** of green power produced on your own roof!`;
  }

  // 17. INSTALLERS & NEXT STEPS
  if (query.includes('installer') || query.includes('quote') || query.includes('contact') || query.includes('vendor') || query.includes('company') || query.includes('next step') || query.includes('how to buy')) {
    return `### Recommended Next Steps to Install Solar

1. **Explore Verified EPC Partners**: Review the Recommended Solar Installers directory on your dashboard to see ratings, completed installations, and warranties.
2. **Request Site Survey & Quote**: Click "Request Free Quote" on any installer card to submit your feasibility report.
3. **DISCOM Feasibility & Net Metering**: The EPC installer will conduct a physical shadow test and manage all DISCOM paperwork and net meter installation on your behalf.`;
  }

  // 18. DAILY & MONTHLY GENERATION
  if (query.includes('daily') || query.includes('units per day') || query.includes('how many units') || query.includes('generation')) {
    return `### Expected Electricity Generation

• **Average Daily Generation**: **~${dailyGen} kWh (units)/day**
• **Average Monthly Generation**: **~${monthlyGen} kWh (units)/month**
• **Annual Solar Generation**: **~${annualGen.toLocaleString('en-IN')} kWh/year**
• **Household Target Offset**: Offsets **${targetPercent}%** of your monthly electricity consumption.`;
  }

  // 19. DYNAMIC GENERAL FALLBACK (Tailored with complete property details)
  return `### Solar Assessment & Advisory for Your Property

• **Recommended System Size**: **${systemKW} kW** (${panelCount} × ${panelWatt}W modules)
• **Target Electricity Offset**: **${targetPercent}%** (${monthlyUnits} units/month demand)
• **Clear Roof Space Needed**: **${requiredArea} m²** (Your marked area: **${markedArea} m²** — ${isSufficient ? 'Sufficient ✅' : 'Constrained ⚠️'})
• **Estimated Turnkey Cost**: **₹${costRangeLow.toLocaleString('en-IN')} – ₹${costRangeHigh.toLocaleString('en-IN')}**
• **Central Subsidy (PM Surya Ghar)**: **₹${subsidyAmount.toLocaleString('en-IN')}**
• **Annual Electricity Savings**: **~₹${annualSavings.toLocaleString('en-IN')}/year**
• **Estimated Payback**: **${paybackLow} to ${paybackHigh} years**

You can ask me questions about:
• **Any Location / State / City**: (e.g., "Is solar good in Kashmir / Mumbai / Jaipur / Kerala / Bengaluru?")
• **Financials & Subsidies**: (e.g., "How much do I save in 15 years?", "PM Surya Ghar subsidy")
• **Technical & Roof Sizing**: (e.g., "Can I run 2 ACs?", "How does net metering work?", "What if my roof is small?")`;
}

module.exports = {
  generateSolarAssistantResponse,
  generateContextualAnalysis,
  cleanOutput,
  calculateCompoundSavings
};
