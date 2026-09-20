import React, { useState } from 'react';
import { Layers, Check, ArrowRight, ArrowLeft, Zap, ShieldCheck, Sparkles, TrendingUp, Cpu, Info } from 'lucide-react';
import { useEstimation } from '../../context/EstimationContext';
import { useLanguage } from '../../context/LanguageContext';
import { formatKW, formatKWh, formatArea, formatINR, formatCostRange } from '../../utils/formatters';

const PANEL_CATALOG = [
  {
    id: 'poly-330',
    brand: 'Standard Poly Tier-1',
    wattage: 330,
    type: 'Polycrystalline',
    efficiency: '17.2%',
    areaM2: 1.95,
    description: 'Budget-friendly, highly durable, reliable for sunny unobstructed regions.',
    badge: 'Budget Option',
    color: 'border-blue-200 hover:border-blue-400'
  },
  {
    id: 'mono-400',
    brand: 'High-Efficiency Mono',
    wattage: 400,
    type: 'Monocrystalline',
    efficiency: '20.4%',
    areaM2: 1.90,
    description: 'Most popular residential choice. Excellent balance of capital cost and energy density.',
    badge: 'Most Popular',
    color: 'border-emerald-300 hover:border-emerald-500'
  },
  {
    id: 'mono-perc-450',
    brand: 'Ultra Mono PERC Half-Cut',
    wattage: 450,
    type: 'Mono PERC',
    efficiency: '21.5%',
    areaM2: 2.05,
    description: 'High power density and superior low-light/cloudy weather performance.',
    badge: 'Premium Efficiency',
    color: 'border-teal-300 hover:border-teal-500'
  },
  {
    id: 'bifacial-550',
    brand: 'Pro Bifacial TopCon',
    wattage: 550,
    type: 'Bifacial TopCon',
    efficiency: '22.8%',
    areaM2: 2.40,
    description: 'Dual-sided generation absorbing reflected sunlight. Maximum kWh output for high-energy homes.',
    badge: 'Maximum Output',
    color: 'border-purple-300 hover:purple-500'
  }
];

export default function PanelSpecSelector() {
  const {
    panelSpec,
    runPanelRefinement,
    systemSizing,
    roofVerification,
    generation,
    financials,
    consumption,
    targetCoverage,
    nextStep,
    prevStep
  } = useEstimation();
  const { t } = useLanguage();

  const [selectedPanelId, setSelectedPanelId] = useState(panelSpec.id || 'mono-400');

  const handleSelectPanel = (panelId) => {
    setSelectedPanelId(panelId);
    runPanelRefinement(panelId, roofVerification.markedAreaM2, systemSizing.requiredKW);
  };

  const selectedPanel = PANEL_CATALOG.find(p => p.id === selectedPanelId) || PANEL_CATALOG[1];

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-3 border border-emerald-200">
          <Layers className="w-3.5 h-3.5" /> {t('step5Badge')}
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {t('step5Header')}
        </h2>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto mt-2 leading-relaxed">
          {t('step5SubHeader')}
        </p>
      </div>

      {/* Panel Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {PANEL_CATALOG.map((panel) => {
          const isSelected = selectedPanelId === panel.id;
          // Calculate specific panel count for this wattage
          const targetWatts = systemSizing.requiredKW * 1000;
          const count = Math.max(1, Math.ceil(targetWatts / panel.wattage));
          const capacityKW = Number(((count * panel.wattage) / 1000).toFixed(2));
          const occupiedArea = Number((count * panel.areaM2).toFixed(1));

          return (
            <div
              key={panel.id}
              onClick={() => handleSelectPanel(panel.id)}
              className={`rounded-3xl p-5 cursor-pointer transition-all duration-300 border-2 flex flex-col justify-between relative ${
                isSelected
                  ? 'bg-emerald-50/50 border-emerald-500 shadow-xl ring-4 ring-emerald-500/20'
                  : 'bg-white border-slate-200 hover:border-emerald-300 hover:shadow-md'
              }`}
            >
              {/* Badge */}
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                    isSelected
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {panel.badge}
                </span>

                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors ${
                    isSelected
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'border-slate-300 bg-slate-50'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>

              {/* Panel Details */}
              <div>
                <span className="text-3xl font-black text-slate-900 block">
                  {panel.wattage} <span className="text-sm font-bold text-slate-500">Watts</span>
                </span>
                <h4 className="text-sm font-bold text-slate-800 mt-1">{panel.brand}</h4>
                <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[11px] font-semibold mt-1">
                  {panel.type} • {panel.efficiency}
                </span>

                <p className="text-xs text-slate-500 mt-3 leading-relaxed">
                  {panel.description}
                </p>

                {/* Micro Metrics */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">{t('panelCountLabel')}:</span>
                    <span className="font-bold text-slate-800">{count} modules</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">{t('systemCapacity')}:</span>
                    <span className="font-bold text-emerald-700">{formatKW(capacityKW)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">{t('minRoofAreaLabel')}:</span>
                    <span className="font-bold text-slate-800">{formatArea(occupiedArea)}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className={`w-full py-2 rounded-xl text-xs font-bold transition-colors mt-4 ${
                  isSelected
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700'
                }`}
              >
                {isSelected ? 'Active Model' : 'Select'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Recalculated Configuration Live Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Refined Hardware System
            </span>
            <h3 className="text-2xl font-black mt-0.5">
              {generation.actualCoveragePercent}% Bill Offset Achieved
            </h3>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
            <Check className="w-4 h-4" />
            <span>Target ({targetCoverage.percent}%) Fully Met</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 text-sm">
          <div>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block">
              {t('systemCapacity')}
            </span>
            <span className="text-2xl font-black text-white mt-1 block">
              {formatKW(systemSizing.roundedCapacityKW || systemSizing.requiredKW)}
            </span>
          </div>

          <div>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block">
              {t('annualGeneration')}
            </span>
            <span className="text-2xl font-black text-emerald-400 mt-1 block">
              {formatKWh(generation.annualKWh)}
            </span>
          </div>

          <div>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block">
              {t('annualSavings')}
            </span>
            <span className="text-2xl font-black text-amber-400 mt-1 block">
              {formatINR(financials.savings.annual)}
            </span>
          </div>

          <div>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block">
              {t('turnkeyCost')}
            </span>
            <span className="text-lg font-bold text-white mt-1 block">
              {financials.costRange.formattedRange}
            </span>
          </div>
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
          <span>{t('generateFinalReport')}</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}

