import React, { createContext, useContext, useState, useEffect } from 'react';
import { solarAPI } from '../services/api';

const EstimationContext = createContext();

export function EstimationProvider({ children }) {
  // Navigation Step (1: Consumption, 2: Target Selection, 3: Sizing Calculation, 4: Map Roof Verification, 5: Panel Selection, 6: Report Dashboard)
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // STEP 1: Electricity Consumption
  const [consumption, setConsumption] = useState({
    inputType: 'monthly_units',
    inputValue: 300,
    monthlyUnits: 300,
    annualUnits: 3600,
    tariffPerKWh: 8.0,
    estimatedMonthlyBill: 2400,
    estimatedAnnualBill: 28800
  });

  // STEP 2: Target Coverage & Baseline Comparisons
  const [targetCoverage, setTargetCoverage] = useState({
    percent: 50, // Default 50% partial coverage as recommended in synopsis
    presets: []
  });

  // STEP 3: System Sizing (calculated, not user input)
  const [systemSizing, setSystemSizing] = useState({
    requiredKW: 1.36,
    roundedCapacityKW: 1.6,
    estimatedPanelCount: 4,
    requiredRoofAreaM2: 7.6,
    requiredGenerationKWh: 1800
  });

  // STEP 4: Roof Verification (Map + Turf.js polygon)
  const [roofVerification, setRoofVerification] = useState({
    markedAreaM2: 0,
    requiredAreaM2: 7.6,
    differenceM2: 0,
    sufficient: false,
    status: 'pending',
    message: 'Draw rooftop boundary on map to verify space',
    address: 'Agra, Uttar Pradesh, India',
    coordinates: [78.02, 27.18], // [lng, lat]
    polygonGeoJson: null,
    isManualDrawMode: false
  });

  // STEP 5: Panel Specification Selection
  const [panelSpec, setPanelSpec] = useState({
    id: 'mono-400',
    brand: 'High-Efficiency Mono',
    wattage: 400,
    type: 'Monocrystalline',
    efficiency: '20.4%',
    areaM2: 1.90,
    description: 'Popular residential choice, balanced cost and high output',
    tier: 'Mid-Range'
  });

  // STEP 6: Generation Estimate
  const [generation, setGeneration] = useState({
    annualKWh: 2112,
    monthlyKWh: 176,
    targetGenerationKWh: 1800,
    targetMet: true,
    gapKWh: 0,
    actualCoveragePercent: 58.6
  });

  // STEP 7: Range-Based Financial Analysis
  const [financials, setFinancials] = useState({
    costRange: {
      low: 72000,
      high: 104000,
      mid: 88000,
      formattedRange: '₹72,000 – ₹1,04,000'
    },
    savings: {
      monthly: 1408,
      annual: 16896,
      lifetimeGross: 520000,
      lifetimeNetLow: 416000,
      lifetimeNetHigh: 448000
    },
    payback: {
      yearsLow: 4.2,
      yearsHigh: 6.1,
      yearsAvg: 5.2,
      formattedRange: '4.2 – 6.1 years'
    },
    roi: {
      year5: 15.2,
      year10: 110.5,
      year20: 285.0,
      year25: 395.0,
      cumulativeSavingsAtYear: { 5: 90000, 10: 195000, 15: 310000, 20: 440000, 25: 580000 }
    },
    environmental: {
      annualCO2Tons: 1.73,
      lifetimeCO2Tons: 39.8,
      equivalentTreesPlanted: 72
    },
    chartProjections: []
  });

  // Final saved report info
  const [activeReportId, setActiveReportId] = useState(null);
  const [savedReports, setSavedReports] = useState([]);

  // Initialize presets on first load
  useEffect(() => {
    recalculateFromConsumption(consumption.inputType, consumption.inputValue, consumption.tariffPerKWh);
  }, []);

  /**
   * Recalculates full sizing and baseline options when consumption changes
   */
  const recalculateFromConsumption = async (inputType, inputValue, tariff = 8.0) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await solarAPI.processConsumption({ inputType, inputValue, tariffPerKWh: tariff });
      if (res.success) {
        const norm = res.data.normalized;
        setConsumption(norm);
        setTargetCoverage(prev => ({
          ...prev,
          presets: res.data.presets
        }));

        // Calculate initial sizing with current target coverage
        await calculateSizingStep(norm.annualUnits, targetCoverage.percent, panelSpec.wattage);
      }
    } catch (err) {
      console.error('Error recalculating from consumption:', err);
      setError('Unable to update consumption metrics.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Calculates Step 3 System Sizing
   */
  const calculateSizingStep = async (annualUnits, targetPct, panelWatt = panelSpec.wattage) => {
    try {
      const res = await solarAPI.calculateSizing({
        annualConsumptionKWh: annualUnits || consumption.annualUnits,
        targetCoveragePercent: targetPct,
        panelWattage: panelWatt
      });

      if (res.success) {
        const sizing = res.data;
        setSystemSizing(sizing);

        // Update roof verification against new required area
        await runRoofVerification(roofVerification.markedAreaM2, sizing.requiredRoofAreaM2, panelWatt, annualUnits, targetPct);
      }
    } catch (err) {
      console.error('Error in calculateSizingStep:', err);
    }
  };

  /**
   * Updates Target Coverage (50%, 100%, or custom)
   */
  const updateTargetCoverage = async (percent) => {
    setTargetCoverage(prev => ({ ...prev, percent }));
    await calculateSizingStep(consumption.annualUnits, percent, panelSpec.wattage);
  };

  /**
   * Step 4: Runs Turf/geometric verification when user marks roof polygon
   */
  const runRoofVerification = async (markedArea, reqArea = systemSizing.requiredRoofAreaM2, panelWatt = panelSpec.wattage, annualUnits = consumption.annualUnits, targetPct = targetCoverage.percent) => {
    try {
      const res = await solarAPI.verifyRoof({
        markedAreaM2: markedArea,
        requiredAreaM2: reqArea,
        panelWattage: panelWatt,
        annualConsumptionKWh: annualUnits,
        targetCoveragePercent: targetPct
      });

      if (res.success) {
        setRoofVerification(prev => ({
          ...prev,
          ...res.data,
          markedAreaM2: markedArea,
          requiredAreaM2: reqArea
        }));

        // Run panel refinement and financial recalculation
        await runPanelRefinement(panelSpec.id, markedArea, systemSizing.requiredKW);
      }
    } catch (err) {
      console.error('Error verifying roof:', err);
    }
  };

  /**
   * Step 5: Refines panel choice and recalculates generation & financials
   */
  const runPanelRefinement = async (panelId, markedArea = roofVerification.markedAreaM2, reqKW = systemSizing.requiredKW) => {
    try {
      const panels = await solarAPI.getPanels();
      const chosenPanel = panels.find(p => p.id === panelId) || panels[1];
      setPanelSpec(chosenPanel);

      const refineRes = await solarAPI.refinePanel({
        panelId,
        markedAreaM2: markedArea,
        requiredKW: reqKW,
        annualConsumptionKWh: consumption.annualUnits,
        targetCoveragePercent: targetCoverage.percent
      });

      if (refineRes.success) {
        const rData = refineRes.data;
        setGeneration({
          annualKWh: rData.estimatedAnnualGenerationKWh,
          monthlyKWh: rData.estimatedMonthlyGenerationKWh,
          targetGenerationKWh: rData.targetGenerationKWh,
          targetMet: rData.targetMet,
          gapKWh: rData.gapKWh,
          actualCoveragePercent: rData.actualCoveragePercent
        });

        // Run Step 7 Financials
        await runFinancialCalculation(rData.systemCapacityKW, rData.estimatedAnnualGenerationKWh);
      }
    } catch (err) {
      console.error('Error in runPanelRefinement:', err);
    }
  };

  /**
   * Step 7: Runs range-based cost, payback, and ROI calculations
   */
  const runFinancialCalculation = async (capacityKW, annualGen) => {
    try {
      const finRes = await solarAPI.calculateFinancials({
        systemCapacityKW: capacityKW,
        annualGenerationKWh: annualGen,
        annualConsumptionKWh: consumption.annualUnits,
        tariffPerKWh: consumption.tariffPerKWh
      });

      if (finRes.success) {
        setFinancials(finRes.data);
      }
    } catch (err) {
      console.error('Error calculating financials:', err);
    }
  };

  /**
   * Step 8: Finalizes and saves report to backend / local storage
   */
  const finalizeReport = async () => {
    setIsLoading(true);
    try {
      const fullReportData = {
        consumption: {
          units: consumption.monthlyUnits,
          monthlyUnits: consumption.monthlyUnits,
          annualUnits: consumption.annualUnits,
          targetCoveragePercent: targetCoverage.percent,
          inputType: consumption.inputType,
          tariffPerKWh: consumption.tariffPerKWh,
          estimatedMonthlyBill: consumption.estimatedMonthlyBill
        },
        systemSizing: {
          requiredKW: systemSizing.requiredKW,
          roundedCapacityKW: systemSizing.roundedCapacityKW || (panelSpec.wattage * systemSizing.estimatedPanelCount / 1000),
          panelCount: systemSizing.estimatedPanelCount,
          requiredAreaM2: systemSizing.requiredRoofAreaM2,
          requiredGenerationKWh: systemSizing.requiredGenerationKWh
        },
        roofVerification: {
          markedAreaM2: roofVerification.markedAreaM2,
          sufficient: roofVerification.sufficient,
          status: roofVerification.status,
          differenceM2: roofVerification.differenceM2,
          polygonGeoJson: roofVerification.polygonGeoJson
        },
        panelSpec: {
          id: panelSpec.id,
          wattage: panelSpec.wattage,
          brand: panelSpec.brand,
          type: panelSpec.type,
          efficiency: panelSpec.efficiency,
          areaM2: panelSpec.areaM2
        },
        generation: {
          annualKWh: generation.annualKWh,
          monthlyKWh: generation.monthlyKWh,
          targetGenerationKWh: generation.targetGenerationKWh,
          targetMet: generation.targetMet,
          actualCoveragePercent: generation.actualCoveragePercent,
          gapKWh: generation.gapKWh
        },
        financial: {
          costRangeLow: financials.costRange.low,
          costRangeHigh: financials.costRange.high,
          costRangeMid: financials.costRange.mid,
          annualSavings: financials.savings.annual,
          monthlySavings: financials.savings.monthly,
          paybackYearsLow: financials.payback.yearsLow,
          paybackYearsHigh: financials.payback.yearsHigh,
          paybackYearsAvg: financials.payback.yearsAvg,
          roi5yr: financials.roi.year5,
          roi10yr: financials.roi.year10,
          roi20yr: financials.roi.year20,
          roi25yr: financials.roi.year25,
          lifetimeNetSavings: financials.savings.lifetimeNetHigh,
          chartProjections: financials.chartProjections,
          environmental: financials.environmental
        },
        location: {
          lat: roofVerification.coordinates ? roofVerification.coordinates[1] : 28.6139,
          lng: roofVerification.coordinates ? roofVerification.coordinates[0] : 77.2090,
          address: roofVerification.address || 'Rooftop Site Location'
        }
      };

      const res = await solarAPI.saveReport(fullReportData);
      if (res.success) {
        setActiveReportId(res.reportId);
        // Save to local report history list
        setSavedReports(prev => [res.data, ...prev.filter(r => r._id !== res.reportId)]);
        return res.reportId;
      }
    } catch (err) {
      console.warn('Backend save failed, using local report ID:', err);
      const localId = 'local_' + Date.now();
      setActiveReportId(localId);
      return localId;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Reset flow back to start
   */
  const resetFlow = () => {
    setCurrentStep(1);
    setActiveReportId(null);
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(6, prev + 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <EstimationContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        nextStep,
        prevStep,
        isLoading,
        error,
        // State
        consumption,
        targetCoverage,
        systemSizing,
        roofVerification,
        panelSpec,
        generation,
        financials,
        activeReportId,
        savedReports,
        // Actions
        recalculateFromConsumption,
        updateTargetCoverage,
        runRoofVerification,
        setRoofVerification,
        runPanelRefinement,
        runFinancialCalculation,
        finalizeReport,
        resetFlow
      }}
    >
      {children}
    </EstimationContext.Provider>
  );
}

export function useEstimation() {
  const context = useContext(EstimationContext);
  if (!context) {
    throw new Error('useEstimation must be used within an EstimationProvider');
  }
  return context;
}
