import React from 'react';
import { useEstimation } from '../context/EstimationContext';
import StepWizardBar from '../components/layout/StepWizardBar';
import ConsumptionInput from '../components/consumption/ConsumptionInput';
import TargetCoverageSelector from '../components/consumption/TargetCoverageSelector';
import SystemSizingSummary from '../components/consumption/SystemSizingSummary';
import RoofVerificationMap from '../components/map/RoofVerificationMap';
import PanelSpecSelector from '../components/panels/PanelSpecSelector';
import ReportDashboard from '../components/report/ReportDashboard';

export default function Estimate() {
  const { currentStep } = useEstimation();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Stepper Indicator */}
      <StepWizardBar />

      {/* Main Wizard Step Container */}
      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {currentStep === 1 && <ConsumptionInput />}
          {currentStep === 2 && <TargetCoverageSelector />}
          {currentStep === 3 && <SystemSizingSummary />}
          {currentStep === 4 && <RoofVerificationMap />}
          {currentStep === 5 && <PanelSpecSelector />}
          {currentStep === 6 && <ReportDashboard />}
        </div>
      </main>
    </div>
  );
}
