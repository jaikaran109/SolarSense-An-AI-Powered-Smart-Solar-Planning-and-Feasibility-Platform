import React, { useState } from 'react';
import { Target, Check, ArrowRight, ArrowLeft, Sliders, ShieldCheck, Sparkles, TrendingUp, Info } from 'lucide-react';
import { useEstimation } from '../../context/EstimationContext';
import { useLanguage } from '../../context/LanguageContext';
import { formatINR, formatKW, formatArea, formatCostRange } from '../../utils/formatters';

export default function TargetCoverageSelector() {
  const { targetCoverage, updateTargetCoverage, consumption, nextStep, prevStep } = useEstimation();
  const { t } = useLanguage();
  const [selectedPercent, setSelectedPercent] = useState(targetCoverage.percent || 50);
  const [isCustomMode, setIsCustomMode] = useState(targetCoverage.percent !== 50 && targetCoverage.percent !== 100);

  const annualKWh = consumption.annualUnits || 3600;
  const tariff = consumption.tariffPerKWh || 8.0;

  // Compute live side-by-side options
  const calculateOptionStats = (pct) => {
    const reqGen = annualKWh * (pct / 100);
    const reqKW = Number((reqGen / (1650 * 0.8)).toFixed(2));
    const panels = Math.max(1, Math.ceil((reqKW * 1000) / 400));
    const area = Number((panels * 1.9).toFixed(1));
    const costLow = Math.round(reqKW * 45000);
    const costHigh = Math.round(reqKW * 65000);
    const annualSav = Math.round(reqGen * tariff);
    return {
      pct,
      reqGen,
      reqKW,
      panels,
      area,
      costLow,
      costHigh,
      annualSav,
      monthlySav: Math.round(annualSav / 12)
    };
  };

  const partialOption = calculateOptionStats(50);
  const fullOption = calculateOptionStats(100);
  const customOption = calculateOptionStats(selectedPercent);

  const handleSelectOption = (pct) => {
    setSelectedPercent(pct);
    setIsCustomMode(pct !== 50 && pct !== 100);
    updateTargetCoverage(pct);
  };

  const handleSliderChange = (val) => {
    const num = Number(val);
    setSelectedPercent(num);
    setIsCustomMode(true);
    updateTargetCoverage(num);
  };

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-3 border border-emerald-200">
          <Target className="w-3.5 h-3.5" /> {t('step2Badge')}
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {t('step2Header')}
        </h2>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto mt-2 leading-relaxed">
          {t('step2SubHeader')}
        </p>
      </div>

      {/* Side-by-side comparison cards (Full vs Partial vs Custom) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Option 1: Partial Coverage 50% (Recommended for budget-conscious) */}
        <div
          onClick={() => handleSelectOption(50)}
          className={`relative rounded-3xl p-6 sm:p-7 cursor-pointer transition-all duration-300 border-2 flex flex-col justify-between ${
            selectedPercent === 50 && !isCustomMode
              ? 'bg-emerald-50/40 border-emerald-500 shadow-xl shadow-emerald-500/10 ring-4 ring-emerald-500/20'
              : 'bg-white border-slate-200 hover:border-emerald-300 hover:shadow-lg'
          }`}
        >
          {/* Badge */}
          <div className="flex items-center justify-between mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
              Optimal Budget Choice
            </span>
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center border transition-colors ${
                selectedPercent === 50 && !isCustomMode
                  ? 'bg-emerald-600 border-emerald-600 text-white'
                  : 'border-slate-300 bg-slate-50'
              }`}
            >
              {selectedPercent === 50 && !isCustomMode && <Check className="w-4 h-4 stroke-[3]" />}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-black text-slate-900">50% Partial Coverage</h3>
            <p className="text-xs text-slate-500 mt-1">
              Cuts your electricity bill in half while minimizing upfront capital investment.
            </p>

            {/* Metrics List */}
            <div className="my-6 space-y-3 pt-4 border-t border-slate-100">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">System Capacity:</span>
                <span className="font-bold text-slate-900">{formatKW(partialOption.reqKW)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Estimated Panels:</span>
                <span className="font-bold text-slate-900">~{partialOption.panels} panels (400W)</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Roof Area Needed:</span>
                <span className="font-bold text-emerald-700">{formatArea(partialOption.area)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Turnkey Cost Range:</span>
                <span className="font-extrabold text-slate-900 text-xs sm:text-sm">
                  {formatCostRange(partialOption.costLow, partialOption.costHigh)}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm pt-2 border-t border-dashed border-slate-200">
                <span className="text-slate-600 font-semibold">Annual Savings:</span>
                <span className="font-black text-emerald-600">{formatINR(partialOption.annualSav)}/yr</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            className={`w-full py-2.5 rounded-xl text-xs font-bold transition-colors ${
              selectedPercent === 50 && !isCustomMode
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700'
            }`}
          >
            {selectedPercent === 50 && !isCustomMode ? 'Selected' : 'Choose 50% Coverage'}
          </button>
        </div>

        {/* Option 2: Full Net-Zero 100% */}
        <div
          onClick={() => handleSelectOption(100)}
          className={`relative rounded-3xl p-6 sm:p-7 cursor-pointer transition-all duration-300 border-2 flex flex-col justify-between ${
            selectedPercent === 100 && !isCustomMode
              ? 'bg-emerald-50/40 border-emerald-500 shadow-xl shadow-emerald-500/10 ring-4 ring-emerald-500/20'
              : 'bg-white border-slate-200 hover:border-emerald-300 hover:shadow-lg'
          }`}
        >
          {/* Badge */}
          <div className="flex items-center justify-between mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-100 text-teal-800 border border-teal-200">
              Maximum Independence
            </span>
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center border transition-colors ${
                selectedPercent === 100 && !isCustomMode
                  ? 'bg-emerald-600 border-emerald-600 text-white'
                  : 'border-slate-300 bg-slate-50'
              }`}
            >
              {selectedPercent === 100 && !isCustomMode && <Check className="w-4 h-4 stroke-[3]" />}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-black text-slate-900">100% Full Net-Zero</h3>
            <p className="text-xs text-slate-500 mt-1">
              Completely offsets 100% of your annual electricity units via net metering.
            </p>

            {/* Metrics List */}
            <div className="my-6 space-y-3 pt-4 border-t border-slate-100">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">System Capacity:</span>
                <span className="font-bold text-slate-900">{formatKW(fullOption.reqKW)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Estimated Panels:</span>
                <span className="font-bold text-slate-900">~{fullOption.panels} panels (400W)</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Roof Area Needed:</span>
                <span className="font-bold text-teal-700">{formatArea(fullOption.area)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Turnkey Cost Range:</span>
                <span className="font-extrabold text-slate-900 text-xs sm:text-sm">
                  {formatCostRange(fullOption.costLow, fullOption.costHigh)}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm pt-2 border-t border-dashed border-slate-200">
                <span className="text-slate-600 font-semibold">Annual Savings:</span>
                <span className="font-black text-emerald-600">{formatINR(fullOption.annualSav)}/yr</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            className={`w-full py-2.5 rounded-xl text-xs font-bold transition-colors ${
              selectedPercent === 100 && !isCustomMode
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700'
            }`}
          >
            {selectedPercent === 100 && !isCustomMode ? 'Selected' : 'Choose 100% Coverage'}
          </button>
        </div>

        {/* Option 3: Custom Offset Percentage Slider */}
        <div
          onClick={() => setIsCustomMode(true)}
          className={`relative rounded-3xl p-6 sm:p-7 cursor-pointer transition-all duration-300 border-2 flex flex-col justify-between ${
            isCustomMode
              ? 'bg-emerald-50/40 border-emerald-500 shadow-xl shadow-emerald-500/10 ring-4 ring-emerald-500/20'
              : 'bg-white border-slate-200 hover:border-emerald-300 hover:shadow-lg'
          }`}
        >
          {/* Badge */}
          <div className="flex items-center justify-between mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">
              Custom Target
            </span>
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center border transition-colors ${
                isCustomMode
                  ? 'bg-emerald-600 border-emerald-600 text-white'
                  : 'border-slate-300 bg-slate-50'
              }`}
            >
              {isCustomMode && <Check className="w-4 h-4 stroke-[3]" />}
            </div>
          </div>

          <div>
            <div className="flex items-baseline justify-between">
              <h3 className="text-xl font-black text-slate-900">Custom Target</h3>
              <span className="text-2xl font-black text-emerald-600">{selectedPercent}%</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Select any custom offset between 10% and 150%.
            </p>

            {/* Slider Control */}
            <div className="my-4 pt-2">
              <input
                type="range"
                min="10"
                max="120"
                step="5"
                value={selectedPercent}
                onChange={(e) => handleSliderChange(e.target.value)}
                className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-1">
                <span>10% (Low)</span>
                <span>50%</span>
                <span>100% (Net-Zero)</span>
                <span>120% (Export)</span>
              </div>
            </div>

            {/* Metrics List */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">System Capacity:</span>
                <span className="font-bold text-slate-900">{formatKW(customOption.reqKW)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Roof Area Needed:</span>
                <span className="font-bold text-slate-900">{formatArea(customOption.area)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Turnkey Cost:</span>
                <span className="font-extrabold text-slate-900 text-xs sm:text-sm">
                  {formatCostRange(customOption.costLow, customOption.costHigh)}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm pt-2 border-t border-dashed border-slate-200">
                <span className="text-slate-600 font-semibold">Annual Savings:</span>
                <span className="font-black text-emerald-600">{formatINR(customOption.annualSav)}/yr</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            className={`w-full py-2.5 rounded-xl text-xs font-bold transition-colors mt-4 ${
              isCustomMode
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700'
            }`}
          >
            {isCustomMode ? `Set to ${selectedPercent}% Target` : 'Customize Percentage'}
          </button>
        </div>
      </div>

      {/* Rationale Callout */}
      <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-600 flex items-start gap-3 mb-8">
        <Info className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-900">Why does SolarSense offer 50% Partial Coverage?</strong>
          <p className="mt-0.5 leading-relaxed">
            Many middle-class households have large roofs but prefer lower initial investments. Sizing for a 50% offset yields maximum self-consumption efficiency and shorter payback periods before roof space is checked in Step 4.
          </p>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={prevStep}
          className="px-6 py-3.5 rounded-2xl font-bold text-slate-700 hover:bg-slate-200 transition-colors flex items-center gap-2 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('back')}</span>
        </button>

        <button
          type="button"
          onClick={nextStep}
          className="px-8 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-xl shadow-emerald-600/25 hover:shadow-2xl transition-all transform active:scale-98 flex items-center gap-3 text-base group"
        >
          <span>{t('proceedToSizing')} ({selectedPercent}%)</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
