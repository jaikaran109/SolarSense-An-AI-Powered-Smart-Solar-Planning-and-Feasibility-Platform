/**
 * SolarSense - Range-Based Financial Estimation Engine
 * Calculates installation cost ranges, payback periods, ROI, and 25-year cashflow projections.
 * Pure functions with clear named constants.
 */

const { DEFAULT_TARIFF_INR_PER_KWH } = require('./solarCalcEngine');

// ==========================================
// NAMED FINANCIAL CONSTANTS & BENCHMARKS
// ==========================================

// Typical rooftop solar turnkey installation cost in India (INR per kW installed)
// Low range: Value tier string inverters + poly/standard mono
// High range: Premium tier microinverters / hybrid inverters + Mono PERC/Bifacial
const COST_PER_KW_LOW = 45000;
const COST_PER_KW_HIGH = 65000;

// Annual panel output degradation rate (typically 0.5% - 0.8%/year)
const ANNUAL_PANEL_DEGRADATION_RATE = 0.007; // 0.7%

// Annual grid electricity tariff escalation rate (historical 3% - 6%/year)
const ANNUAL_TARIFF_ESCALATION_RATE = 0.04; // 4.0%

// Maintenance / Inverter replacement reserve allowance per year (% of initial capex)
const ANNUAL_MAINTENANCE_RATE = 0.01; // 1%

// Environmental conversion factors (CEA India grid emission factor: ~0.82 kg CO2 / kWh)
const CO2_KG_PER_KWH = 0.82;
const TREES_PER_TON_CO2 = 45; // ~45 mature tree seedlings per metric ton of CO2 offset

/**
 * Calculates complete financial metrics, cost ranges, payback ranges, and ROI over 5, 10, 20, 25 years.
 * STEP 7 in Core Flow.
 *
 * @param {Object} params
 * @param {number} params.systemCapacityKW - Rated capacity in kW
 * @param {number} params.annualGenerationKWh - Annual output in kWh
 * @param {number} [params.annualConsumptionKWh] - Annual baseline consumption
 * @param {number} [params.tariffPerKWh=DEFAULT_TARIFF_INR_PER_KWH] - Grid tariff (₹/kWh)
 * @param {number} [params.costPerKWLow=COST_PER_KW_LOW]
 * @param {number} [params.costPerKWHigh=COST_PER_KW_HIGH]
 */
function calculateFinancials({
  systemCapacityKW,
  annualGenerationKWh,
  annualConsumptionKWh = 0,
  tariffPerKWh = DEFAULT_TARIFF_INR_PER_KWH,
  costPerKWLow = COST_PER_KW_LOW,
  costPerKWHigh = COST_PER_KW_HIGH
}) {
  const capacityKW = Math.max(0, Number(systemCapacityKW) || 0);
  const generationKWh = Math.max(0, Number(annualGenerationKWh) || 0);
  const tariff = Math.max(1, Number(tariffPerKWh) || DEFAULT_TARIFF_INR_PER_KWH);

  // 1. Installation Cost Range (₹)
  const costRangeLow = Math.round(capacityKW * costPerKWLow);
  const costRangeHigh = Math.round(capacityKW * costPerKWHigh);
  const costRangeMid = Math.round((costRangeLow + costRangeHigh) / 2);

  // 2. Year 1 Savings (₹)
  const annualSavings = Math.round(generationKWh * tariff);
  const monthlySavings = Math.round(annualSavings / 12);

  // 3. Payback Period (Years as a Range)
  // Payback = Cost / Annual Savings
  let paybackYearsLow = 0;
  let paybackYearsHigh = 0;
  let paybackYearsAvg = 0;

  if (annualSavings > 0) {
    paybackYearsLow = Number((costRangeLow / annualSavings).toFixed(1));
    paybackYearsHigh = Number((costRangeHigh / annualSavings).toFixed(1));
    paybackYearsAvg = Number((costRangeMid / annualSavings).toFixed(1));
  }

  // 4. Multi-Year Projections & Cumulative Cashflow (Year 1 to 25)
  const projections = [];
  let cumulativeSolarSavings = 0;
  let cumulativeBaselineCost = 0;
  let cumulativeWithSolarGridSpend = 0;

  let currentYearGen = generationKWh;
  let currentYearTariff = tariff;
  const baselineAnnualUnits = annualConsumptionKWh > 0 ? annualConsumptionKWh : generationKWh;

  const roiMilestones = {
    year5: 0,
    year10: 0,
    year15: 0,
    year20: 0,
    year25: 0
  };

  const cumulativeSavingsAtYear = {
    5: 0,
    10: 0,
    15: 0,
    20: 0,
    25: 0
  };

  for (let year = 1; year <= 25; year++) {
    // Degradation & inflation adjusted
    const yearGeneration = Math.round(generationKWh * Math.pow(1 - ANNUAL_PANEL_DEGRADATION_RATE, year - 1));
    const yearTariff = Number((tariff * Math.pow(1 + ANNUAL_TARIFF_ESCALATION_RATE, year - 1)).toFixed(2));
    
    // Without solar spend
    const yearBaselineSpend = Math.round(baselineAnnualUnits * yearTariff);
    cumulativeBaselineCost += yearBaselineSpend;

    // Direct savings from solar energy generated
    const yearSavings = Math.round(yearGeneration * yearTariff);
    cumulativeSolarSavings += yearSavings;

    // Remaining grid electricity needed
    const remainingGridUnits = Math.max(0, baselineAnnualUnits - yearGeneration);
    const yearGridSpendWithSolar = Math.round(remainingGridUnits * yearTariff);
    cumulativeWithSolarGridSpend += yearGridSpendWithSolar;

    // Track milestones
    if (roiMilestones[`year${year}`] !== undefined) {
      // ROI (%) = (Cumulative Savings - Capex) / Capex * 100
      const roiMid = costRangeMid > 0 
        ? Number((((cumulativeSolarSavings - costRangeMid) / costRangeMid) * 100).toFixed(1))
        : 0;
      roiMilestones[`year${year}`] = roiMid;
      cumulativeSavingsAtYear[year] = cumulativeSolarSavings;
    }

    // Push chart data points (every year or every 2-3 years)
    projections.push({
      year: `Yr ${year}`,
      yearNumber: year,
      cumulativeSavings: cumulativeSolarSavings,
      cumulativeWithoutSolarSpend: cumulativeBaselineCost,
      cumulativeSpendWithSolar: costRangeMid + cumulativeWithSolarGridSpend,
      annualSavings: yearSavings,
      effectiveTariff: yearTariff
    });
  }

  // 5. Environmental Impact
  const annualCO2Tons = Number(((generationKWh * CO2_KG_PER_KWH) / 1000).toFixed(2));
  const lifetimeCO2Tons = Number((annualCO2Tons * 25 * 0.92).toFixed(1)); // accounting for degradation
  const equivalentTreesPlanted = Math.round(lifetimeCO2Tons * (TREES_PER_TON_CO2 / 25));

  // 6. Net Lifetime Profit
  const netLifetimeSavingsLow = Math.round(cumulativeSolarSavings - costRangeHigh);
  const netLifetimeSavingsHigh = Math.round(cumulativeSolarSavings - costRangeLow);

  return {
    costRange: {
      low: costRangeLow,
      high: costRangeHigh,
      mid: costRangeMid,
      formattedRange: `₹${costRangeLow.toLocaleString('en-IN')} - ₹${costRangeHigh.toLocaleString('en-IN')}`
    },
    savings: {
      monthly: monthlySavings,
      annual: annualSavings,
      lifetimeGross: cumulativeSolarSavings,
      lifetimeNetLow: netLifetimeSavingsLow,
      lifetimeNetHigh: netLifetimeSavingsHigh
    },
    payback: {
      yearsLow: paybackYearsLow,
      yearsHigh: paybackYearsHigh,
      yearsAvg: paybackYearsAvg,
      formattedRange: `${paybackYearsLow} - ${paybackYearsHigh} years`
    },
    roi: {
      year5: roiMilestones.year5,
      year10: roiMilestones.year10,
      year15: roiMilestones.year15,
      year20: roiMilestones.year20,
      year25: roiMilestones.year25,
      cumulativeSavingsAtYear
    },
    environmental: {
      annualCO2Tons,
      lifetimeCO2Tons,
      equivalentTreesPlanted
    },
    chartProjections: projections,
    assumptions: {
      costPerKWLow,
      costPerKWHigh,
      degradationRate: ANNUAL_PANEL_DEGRADATION_RATE,
      tariffEscalationRate: ANNUAL_TARIFF_ESCALATION_RATE,
      tariffPerKWh: tariff
    }
  };
}

module.exports = {
  COST_PER_KW_LOW,
  COST_PER_KW_HIGH,
  ANNUAL_PANEL_DEGRADATION_RATE,
  ANNUAL_TARIFF_ESCALATION_RATE,
  CO2_KG_PER_KWH,
  calculateFinancials
};
