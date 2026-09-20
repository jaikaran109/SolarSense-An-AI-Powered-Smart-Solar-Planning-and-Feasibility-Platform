const assert = require('assert');
const {
  normalizeConsumption,
  generateCoveragePresets,
  calculateSystemSizing,
  verifyRoofArea,
  refineSystemWithPanelSpec
} = require('../src/services/solarCalcEngine');
const { calculateFinancials } = require('../src/services/costEstimator');

console.log('🧪 Running SolarSense Engine Unit Tests...');

// Test 1: normalizeConsumption
const normMonthly = normalizeConsumption({ inputType: 'monthly_units', inputValue: 300, tariffPerKWh: 8.0 });
assert.strictEqual(normMonthly.monthlyUnits, 300);
assert.strictEqual(normMonthly.annualUnits, 3600);
assert.strictEqual(normMonthly.estimatedMonthlyBill, 2400);
console.log('✅ Test 1 Passed: normalizeConsumption for 300 units/mo');

// Test 2: calculateSystemSizing (50% target of 3600 kWh = 1800 kWh)
// Required KW = 1800 / (1650 * 0.80) = 1800 / 1320 = 1.36 kW
const sizing50 = calculateSystemSizing({
  annualConsumptionKWh: 3600,
  targetCoveragePercent: 50,
  panelWattage: 400
});
assert.strictEqual(sizing50.requiredGenerationKWh, 1800);
assert.strictEqual(sizing50.requiredKW, 1.36);
assert.strictEqual(sizing50.estimatedPanelCount, 4); // ceil(1360 / 400) = 4 panels
assert.strictEqual(sizing50.requiredRoofAreaM2, 7.6); // 4 * 1.9 = 7.6 m²
console.log('✅ Test 2 Passed: calculateSystemSizing for 50% target');

// Test 3: verifyRoofArea
const roofCheck = verifyRoofArea({
  markedAreaM2: 25.0,
  requiredAreaM2: 15.0,
  panelWattage: 400
});
assert.strictEqual(roofCheck.sufficient, true);
assert.strictEqual(roofCheck.status, 'surplus');
console.log('✅ Test 3 Passed: verifyRoofArea with sufficient roof');

// Test 4: Financial Calculations
const financials = calculateFinancials({
  systemCapacityKW: 2.0,
  annualGenerationKWh: 2640,
  annualConsumptionKWh: 3600,
  tariffPerKWh: 8.0
});
assert.strictEqual(financials.costRange.low, 90000); // 2 * 45000
assert.strictEqual(financials.costRange.high, 130000); // 2 * 65000
assert.strictEqual(financials.savings.annual, 21120); // 2640 * 8
assert.ok(financials.payback.yearsLow > 0);
assert.strictEqual(financials.chartProjections.length, 25);
console.log('✅ Test 4 Passed: calculateFinancials and 25-yr projections');

console.log('🎉 All 4 Engine Unit Tests Passed Perfectly!');
