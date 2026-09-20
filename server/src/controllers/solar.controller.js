const {
  PRESET_PANEL_SPECS,
  normalizeConsumption,
  generateCoveragePresets,
  calculateSystemSizing,
  verifyRoofArea,
  refineSystemWithPanelSpec,
  DEFAULT_TARIFF_INR_PER_KWH,
  DEFAULT_ANNUAL_IRRADIANCE_FACTOR,
  DEFAULT_PERFORMANCE_RATIO
} = require('../services/solarCalcEngine');

/**
 * Normalizes user consumption and provides immediate baseline comparisons
 * POST /api/solar/consumption
 */
exports.processConsumption = (req, res) => {
  try {
    const { inputType, inputValue, tariffPerKWh } = req.body;
    
    if (!inputValue || isNaN(inputValue) || Number(inputValue) <= 0) {
      return res.status(400).json({ error: 'Please enter a valid positive electricity consumption or bill value.' });
    }

    const normalized = normalizeConsumption({
      inputType: inputType || 'monthly_units',
      inputValue: Number(inputValue),
      tariffPerKWh: tariffPerKWh ? Number(tariffPerKWh) : DEFAULT_TARIFF_INR_PER_KWH
    });

    const presets = generateCoveragePresets(normalized.annualUnits);

    return res.json({
      success: true,
      data: {
        normalized,
        presets
      }
    });
  } catch (error) {
    console.error('Error processing consumption:', error);
    return res.status(500).json({ error: 'Internal error processing consumption parameters.' });
  }
};

/**
 * Calculates system sizing for a selected target percentage
 * POST /api/solar/sizing
 */
exports.calculateSizing = (req, res) => {
  try {
    const { annualConsumptionKWh, targetCoveragePercent, panelWattage, irradianceFactor } = req.body;

    if (!annualConsumptionKWh || isNaN(annualConsumptionKWh)) {
      return res.status(400).json({ error: 'annualConsumptionKWh is required.' });
    }

    const sizing = calculateSystemSizing({
      annualConsumptionKWh: Number(annualConsumptionKWh),
      targetCoveragePercent: Number(targetCoveragePercent) || 100,
      panelWattage: Number(panelWattage) || 400,
      irradianceFactor: irradianceFactor ? Number(irradianceFactor) : DEFAULT_ANNUAL_IRRADIANCE_FACTOR
    });

    return res.json({
      success: true,
      data: sizing
    });
  } catch (error) {
    console.error('Error calculating sizing:', error);
    return res.status(500).json({ error: 'Failed to calculate system sizing.' });
  }
};

/**
 * Verifies marked polygon area against required area
 * POST /api/solar/verify-roof
 */
exports.verifyRoof = (req, res) => {
  try {
    const { markedAreaM2, requiredAreaM2, panelWattage, annualConsumptionKWh, targetCoveragePercent } = req.body;

    if (markedAreaM2 === undefined || isNaN(markedAreaM2)) {
      return res.status(400).json({ error: 'markedAreaM2 is required.' });
    }

    const verification = verifyRoofArea({
      markedAreaM2: Number(markedAreaM2),
      requiredAreaM2: Number(requiredAreaM2) || 20,
      panelWattage: Number(panelWattage) || 400,
      annualConsumptionKWh: Number(annualConsumptionKWh) || 0,
      targetCoveragePercent: Number(targetCoveragePercent) || 100
    });

    return res.json({
      success: true,
      data: verification
    });
  } catch (error) {
    console.error('Error verifying roof area:', error);
    return res.status(500).json({ error: 'Failed to verify roof area.' });
  }
};

/**
 * Refines configuration with specific panel specifications
 * POST /api/solar/refine-panel
 */
exports.refinePanel = (req, res) => {
  try {
    const {
      panelId,
      markedAreaM2,
      requiredKW,
      annualConsumptionKWh,
      targetCoveragePercent
    } = req.body;

    const refined = refineSystemWithPanelSpec({
      panelId: panelId || 'mono-400',
      markedAreaM2: Number(markedAreaM2) || 0,
      requiredKW: Number(requiredKW) || 2.0,
      annualConsumptionKWh: Number(annualConsumptionKWh) || 3600,
      targetCoveragePercent: Number(targetCoveragePercent) || 100
    });

    return res.json({
      success: true,
      data: refined
    });
  } catch (error) {
    console.error('Error refining panel spec:', error);
    return res.status(500).json({ error: 'Failed to refine panel specification.' });
  }
};

/**
 * Returns available panel spec choices
 * GET /api/solar/panels
 */
exports.getPanelCatalog = (req, res) => {
  return res.json({
    success: true,
    data: PRESET_PANEL_SPECS
  });
};
