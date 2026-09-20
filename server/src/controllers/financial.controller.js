const { calculateFinancials } = require('../services/costEstimator');
const { DEFAULT_TARIFF_INR_PER_KWH } = require('../services/solarCalcEngine');

/**
 * Calculates complete financial metrics and 25-year projections
 * POST /api/financial/calculate
 */
exports.calculateFinancialMetrics = (req, res) => {
  try {
    const {
      systemCapacityKW,
      annualGenerationKWh,
      annualConsumptionKWh,
      tariffPerKWh,
      costPerKWLow,
      costPerKWHigh
    } = req.body;

    if (!systemCapacityKW || isNaN(systemCapacityKW)) {
      return res.status(400).json({ error: 'systemCapacityKW is required.' });
    }

    const financials = calculateFinancials({
      systemCapacityKW: Number(systemCapacityKW),
      annualGenerationKWh: Number(annualGenerationKWh) || (Number(systemCapacityKW) * 1650 * 0.8),
      annualConsumptionKWh: Number(annualConsumptionKWh) || 0,
      tariffPerKWh: tariffPerKWh ? Number(tariffPerKWh) : DEFAULT_TARIFF_INR_PER_KWH,
      costPerKWLow: costPerKWLow ? Number(costPerKWLow) : undefined,
      costPerKWHigh: costPerKWHigh ? Number(costPerKWHigh) : undefined
    });

    return res.json({
      success: true,
      data: financials
    });
  } catch (error) {
    console.error('Error calculating financials:', error);
    return res.status(500).json({ error: 'Failed to calculate financial analysis.' });
  }
};
