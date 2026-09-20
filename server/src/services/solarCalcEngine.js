/**
 * SolarSense - Pure Solar Calculation Engine
 * Contains all sizing, panel specification, and generation formulas.
 * All constants are named at top of file for easy tuning.
 */

// ==========================================
// NAMED CONSTANTS & ASSUMPTIONS
// ==========================================

// Average solar irradiance in kWh per kW peak per year (typical Indian conditions: 1500–1800 kWh/kW/yr)
const DEFAULT_ANNUAL_IRRADIANCE_FACTOR = 1650;

// System Performance Ratio (accounting for inverter losses, temperature, wiring, dust ~ 75-85%)
const DEFAULT_PERFORMANCE_RATIO = 0.80;

// Default physical footprint per panel in m² (including walkway & inter-row tilt spacing)
const DEFAULT_AREA_PER_PANEL_M2 = 1.90;

// Default average residential electricity tariff (INR per kWh)
const DEFAULT_TARIFF_INR_PER_KWH = 8.0;

// Preset panel catalog options with specs
const PRESET_PANEL_SPECS = [
  {
    id: 'poly-330',
    brand: 'Standard Poly Tier-1',
    wattage: 330,
    type: 'Polycrystalline',
    efficiency: '17.2%',
    areaM2: 1.95,
    description: 'Budget-friendly, durable, reliable for standard sunny areas',
    tier: 'Budget'
  },
  {
    id: 'mono-400',
    brand: 'High-Efficiency Mono',
    wattage: 400,
    type: 'Monocrystalline',
    efficiency: '20.4%',
    areaM2: 1.90,
    description: 'Popular residential choice, balanced cost and high output',
    tier: 'Mid-Range'
  },
  {
    id: 'mono-perc-450',
    brand: 'Ultra Mono PERC Half-Cut',
    wattage: 450,
    type: 'Mono PERC',
    efficiency: '21.5%',
    areaM2: 2.05,
    description: 'High power density, superior low-light performance',
    tier: 'Premium'
  },
  {
    id: 'bifacial-550',
    brand: 'Pro Bifacial TopCon',
    wattage: 550,
    type: 'Bifacial TopCon',
    efficiency: '22.8%',
    areaM2: 2.40,
    description: 'Dual-sided generation, maximum energy per square metre',
    tier: 'Enterprise / Large Roof'
  }
];

// ==========================================
// PURE CALCULATION FUNCTIONS
// ==========================================

/**
 * Normalizes user electricity input into annual and monthly kWh consumption.
 * @param {Object} params
 * @param {'monthly_units'|'annual_units'|'bill_amount'} params.inputType
 * @param {number} params.inputValue
 * @param {number} [params.tariffPerKWh=DEFAULT_TARIFF_INR_PER_KWH]
 * @returns {Object} normalized consumption values
 */
function normalizeConsumption({ inputType, inputValue, tariffPerKWh = DEFAULT_TARIFF_INR_PER_KWH }) {
  const val = Math.max(0, Number(inputValue) || 0);
  const tariff = Math.max(1, Number(tariffPerKWh) || DEFAULT_TARIFF_INR_PER_KWH);

  let monthlyUnits = 0;
  let annualUnits = 0;
  let estimatedMonthlyBill = 0;

  if (inputType === 'monthly_units') {
    monthlyUnits = val;
    annualUnits = Math.round(monthlyUnits * 12);
    estimatedMonthlyBill = Math.round(monthlyUnits * tariff);
  } else if (inputType === 'annual_units') {
    annualUnits = val;
    monthlyUnits = Math.round(annualUnits / 12);
    estimatedMonthlyBill = Math.round(monthlyUnits * tariff);
  } else if (inputType === 'bill_amount') {
    estimatedMonthlyBill = val;
    monthlyUnits = Math.round(val / tariff);
    annualUnits = Math.round(monthlyUnits * 12);
  } else {
    // Default fallback
    monthlyUnits = val;
    annualUnits = Math.round(monthlyUnits * 12);
    estimatedMonthlyBill = Math.round(monthlyUnits * tariff);
  }

  return {
    inputType,
    inputValue: val,
    tariffPerKWh: tariff,
    monthlyUnits,
    annualUnits,
    estimatedMonthlyBill,
    estimatedAnnualBill: estimatedMonthlyBill * 12
  };
}

/**
 * Calculates baseline comparisons (e.g. 50% vs 100%) for consumption input.
 * @param {number} annualUnits - Annual consumption in kWh
 * @param {number} [panelWattage=400]
 * @param {number} [irradiance=DEFAULT_ANNUAL_IRRADIANCE_FACTOR]
 * @param {number} [pr=DEFAULT_PERFORMANCE_RATIO]
 */
function generateCoveragePresets(annualUnits, panelWattage = 400, irradiance = DEFAULT_ANNUAL_IRRADIANCE_FACTOR, pr = DEFAULT_PERFORMANCE_RATIO) {
  const presets = [
    { targetPercent: 50, label: 'Partial Coverage (Budget Optimal)' },
    { targetPercent: 75, label: 'Balanced Coverage (High Savings)' },
    { targetPercent: 100, label: 'Full Net-Zero (Max Independence)' }
  ];

  return presets.map(p => {
    const sizing = calculateSystemSizing({
      annualConsumptionKWh: annualUnits,
      targetCoveragePercent: p.targetPercent,
      panelWattage,
      irradianceFactor: irradiance,
      performanceRatio: pr
    });

    return {
      targetPercent: p.targetPercent,
      label: p.label,
      ...sizing
    };
  });
}

/**
 * Calculates required system sizing based on consumption target.
 * STEP 3 in the Core Flow.
 *
 * @param {Object} params
 * @param {number} params.annualConsumptionKWh - Annual electricity usage (kWh)
 * @param {number} params.targetCoveragePercent - Target offset percentage (e.g., 50 or 100)
 * @param {number} [params.panelWattage=400] - Panel wattage in W
 * @param {number} [params.irradianceFactor=DEFAULT_ANNUAL_IRRADIANCE_FACTOR] - kWh/kW/yr
 * @param {number} [params.performanceRatio=DEFAULT_PERFORMANCE_RATIO] - 0.8
 * @param {number} [params.areaPerPanel=DEFAULT_AREA_PER_PANEL_M2] - m²
 */
function calculateSystemSizing({
  annualConsumptionKWh,
  targetCoveragePercent = 100,
  panelWattage = 400,
  irradianceFactor = DEFAULT_ANNUAL_IRRADIANCE_FACTOR,
  performanceRatio = DEFAULT_PERFORMANCE_RATIO,
  areaPerPanel = DEFAULT_AREA_PER_PANEL_M2
}) {
  const annualConsumption = Math.max(0, Number(annualConsumptionKWh) || 0);
  const targetCoverage = Math.max(1, Math.min(200, Number(targetCoveragePercent) || 100));
  const wattage = Math.max(100, Number(panelWattage) || 400);

  // 1. Required Annual Generation (kWh/year) = Annual Consumption (kWh) * Target Coverage (%)
  const requiredGenerationKWh = (annualConsumption * (targetCoverage / 100));

  // 2. Required System Size (kW) = Required Generation / (Annual Irradiance Factor * Performance Ratio)
  const effectiveYieldPerKW = irradianceFactor * performanceRatio; // e.g. 1650 * 0.8 = 1320 kWh/kW/yr
  const rawRequiredKW = effectiveYieldPerKW > 0 ? requiredGenerationKWh / effectiveYieldPerKW : 0;
  const requiredKW = Number(rawRequiredKW.toFixed(2));

  // 3. Estimated Panel Count = Required System Size (W) / Panel Wattage
  const requiredWatts = requiredKW * 1000;
  const estimatedPanelCount = Math.max(1, Math.ceil(requiredWatts / wattage));

  // Actual rounded system capacity from whole panels
  const roundedCapacityKW = Number(((estimatedPanelCount * wattage) / 1000).toFixed(2));

  // 4. Required Roof Area (m²) = Panel Count * Area per panel
  const requiredRoofAreaM2 = Number((estimatedPanelCount * areaPerPanel).toFixed(1));

  return {
    annualConsumptionKWh: annualConsumption,
    targetCoveragePercent: targetCoverage,
    requiredGenerationKWh: Math.round(requiredGenerationKWh),
    requiredKW,
    roundedCapacityKW,
    panelWattage: wattage,
    estimatedPanelCount,
    requiredRoofAreaM2,
    assumptions: {
      irradianceFactor,
      performanceRatio,
      areaPerPanel
    }
  };
}

/**
 * Compares user marked roof area from Map against required roof area.
 * STEP 4 in Core Flow.
 *
 * @param {Object} params
 * @param {number} params.markedAreaM2 - Usable roof area marked by user via Turf.js (m²)
 * @param {number} params.requiredAreaM2 - Required roof area from sizing step (m²)
 * @param {number} [params.panelWattage=400]
 * @param {number} [params.areaPerPanel=DEFAULT_AREA_PER_PANEL_M2]
 * @param {number} [params.annualConsumptionKWh=0]
 * @param {number} [params.targetCoveragePercent=100]
 */
function verifyRoofArea({
  markedAreaM2,
  requiredAreaM2,
  panelWattage = 400,
  areaPerPanel = DEFAULT_AREA_PER_PANEL_M2,
  annualConsumptionKWh = 0,
  targetCoveragePercent = 100,
  irradianceFactor = DEFAULT_ANNUAL_IRRADIANCE_FACTOR,
  performanceRatio = DEFAULT_PERFORMANCE_RATIO
}) {
  const marked = Math.max(0, Number(markedAreaM2) || 0);
  const required = Math.max(0.1, Number(requiredAreaM2) || 0);
  const wattage = Math.max(100, Number(panelWattage) || 400);

  const difference = Number((marked - required).toFixed(1));
  const isSufficient = marked >= (required * 0.95); // allow 5% margin
  const isSurplus = marked > (required * 1.25);

  let status = 'sufficient';
  let message = 'Your usable roof area is sufficient for your target system!';

  if (!isSufficient) {
    status = 'insufficient';
    message = `Marked area is ${(required - marked).toFixed(1)} m² smaller than the recommended ${required} m².`;
  } else if (isSurplus) {
    status = 'surplus';
    message = `You have abundant clear space (${marked} m² vs ${required} m² needed), leaving plenty of room for walkways & future expansion.`;
  }

  // Calculate maximum panels that can physically fit on the marked roof
  const maxPossiblePanels = Math.floor(marked / areaPerPanel);
  const maxPossibleKW = Number(((maxPossiblePanels * wattage) / 1000).toFixed(2));

  // Calculate achievable generation & coverage if constrained by roof
  const maxAchievableGenerationKWh = Math.round(maxPossibleKW * irradianceFactor * performanceRatio);
  const achievableCoveragePercent = annualConsumptionKWh > 0 
    ? Number(((maxAchievableGenerationKWh / annualConsumptionKWh) * 100).toFixed(1))
    : targetCoveragePercent;

  return {
    markedAreaM2: marked,
    requiredAreaM2: required,
    differenceM2: difference,
    sufficient: isSufficient,
    status,
    message,
    maxPossiblePanels,
    maxPossibleKW,
    maxAchievableGenerationKWh,
    achievableCoveragePercent: Math.min(achievableCoveragePercent, targetCoveragePercent)
  };
}

/**
 * Refines system specs when a specific panel is chosen.
 * STEP 5 & 6 in Core Flow.
 *
 * @param {Object} params
 */
function refineSystemWithPanelSpec({
  panelId,
  markedAreaM2,
  requiredKW,
  annualConsumptionKWh,
  targetCoveragePercent,
  irradianceFactor = DEFAULT_ANNUAL_IRRADIANCE_FACTOR,
  performanceRatio = DEFAULT_PERFORMANCE_RATIO
}) {
  const panel = PRESET_PANEL_SPECS.find(p => p.id === panelId) || PRESET_PANEL_SPECS[1];
  const areaPerPanel = panel.areaM2 || DEFAULT_AREA_PER_PANEL_M2;

  // Recalculate panel count needed for the desired kW
  const targetWatts = requiredKW * 1000;
  const panelCountForTarget = Math.max(1, Math.ceil(targetWatts / panel.wattage));
  const roofAreaNeededForTarget = Number((panelCountForTarget * areaPerPanel).toFixed(1));

  // Max panels physically fitting on marked roof
  const marked = Number(markedAreaM2) || 0;
  const maxPanelsOnRoof = marked > 0 ? Math.floor(marked / areaPerPanel) : panelCountForTarget;

  // Final installed panel count (cannot exceed roof capability unless user hasn't marked roof yet)
  const finalPanelCount = marked > 0 ? Math.min(panelCountForTarget, maxPanelsOnRoof) : panelCountForTarget;
  const finalSystemKW = Number(((finalPanelCount * panel.wattage) / 1000).toFixed(2));
  const finalOccupiedAreaM2 = Number((finalPanelCount * areaPerPanel).toFixed(1));

  // Annual Generation (kWh/year) = System Capacity (kW) * Irradiance * PR
  const estimatedAnnualGenerationKWh = Math.round(finalSystemKW * irradianceFactor * performanceRatio);
  const estimatedMonthlyGenerationKWh = Math.round(estimatedAnnualGenerationKWh / 12);

  // Compare against original target
  const targetGenerationKWh = Math.round(annualConsumptionKWh * (targetCoveragePercent / 100));
  const targetMet = estimatedAnnualGenerationKWh >= (targetGenerationKWh * 0.95);
  const gapKWh = targetGenerationKWh - estimatedAnnualGenerationKWh;
  const actualCoveragePercent = annualConsumptionKWh > 0 
    ? Number(((estimatedAnnualGenerationKWh / annualConsumptionKWh) * 100).toFixed(1))
    : targetCoveragePercent;

  return {
    selectedPanel: panel,
    panelCount: finalPanelCount,
    systemCapacityKW: finalSystemKW,
    occupiedAreaM2: finalOccupiedAreaM2,
    estimatedAnnualGenerationKWh,
    estimatedMonthlyGenerationKWh,
    targetGenerationKWh,
    targetMet,
    gapKWh: gapKWh > 0 ? gapKWh : 0,
    actualCoveragePercent,
    isRoofConstrained: marked > 0 && maxPanelsOnRoof < panelCountForTarget
  };
}

module.exports = {
  DEFAULT_ANNUAL_IRRADIANCE_FACTOR,
  DEFAULT_PERFORMANCE_RATIO,
  DEFAULT_AREA_PER_PANEL_M2,
  DEFAULT_TARIFF_INR_PER_KWH,
  PRESET_PANEL_SPECS,
  normalizeConsumption,
  generateCoveragePresets,
  calculateSystemSizing,
  verifyRoofArea,
  refineSystemWithPanelSpec
};
