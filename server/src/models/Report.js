const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    consumption: {
      units: { type: Number, required: true },
      monthlyUnits: { type: Number },
      annualUnits: { type: Number },
      targetCoveragePercent: { type: Number, required: true },
      inputType: { type: String, default: 'monthly_units' },
      tariffPerKWh: { type: Number, default: 8.0 },
      estimatedMonthlyBill: { type: Number }
    },
    systemSizing: {
      requiredKW: { type: Number, required: true },
      roundedCapacityKW: { type: Number },
      panelCount: { type: Number, required: true },
      requiredAreaM2: { type: Number, required: true },
      requiredGenerationKWh: { type: Number }
    },
    roofVerification: {
      markedAreaM2: { type: Number, default: 0 },
      sufficient: { type: Boolean, default: true },
      status: { type: String, default: 'sufficient' },
      differenceM2: { type: Number, default: 0 },
      polygonGeoJson: { type: Object }
    },
    panelSpec: {
      id: { type: String, default: 'mono-400' },
      wattage: { type: Number, required: true },
      brand: { type: String, required: true },
      type: { type: String, default: 'Monocrystalline' },
      efficiency: { type: String },
      areaM2: { type: Number }
    },
    generation: {
      annualKWh: { type: Number, required: true },
      monthlyKWh: { type: Number },
      targetGenerationKWh: { type: Number },
      targetMet: { type: Boolean, default: true },
      actualCoveragePercent: { type: Number },
      gapKWh: { type: Number, default: 0 }
    },
    financial: {
      costRangeLow: { type: Number, required: true },
      costRangeHigh: { type: Number, required: true },
      costRangeMid: { type: Number },
      annualSavings: { type: Number, required: true },
      monthlySavings: { type: Number },
      paybackYearsLow: { type: Number, required: true },
      paybackYearsHigh: { type: Number, required: true },
      paybackYearsAvg: { type: Number },
      roi5yr: { type: Number },
      roi10yr: { type: Number },
      roi20yr: { type: Number },
      roi25yr: { type: Number },
      lifetimeNetSavings: { type: Number },
      chartProjections: [{
        year: String,
        yearNumber: Number,
        cumulativeSavings: Number,
        cumulativeWithoutSolarSpend: Number,
        cumulativeSpendWithSolar: Number,
        annualSavings: Number
      }],
      environmental: {
        annualCO2Tons: Number,
        lifetimeCO2Tons: Number,
        equivalentTreesPlanted: Number
      }
    },
    location: {
      lat: { type: Number },
      lng: { type: Number },
      address: { type: String, default: 'Rooftop Site Location' }
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Report', reportSchema);
