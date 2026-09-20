import React from 'react';
import { Cpu, ArrowRight, ArrowLeft, Sun, Zap, CheckCircle2, ShieldCheck, MapPin, Layers, LayoutGrid } from 'lucide-react';
import { useEstimation } from '../../context/EstimationContext';
import { useLanguage } from '../../context/LanguageContext';
import { formatKW, formatKWh, formatArea } from '../../utils/formatters';

export default function SystemSizingSummary() {
  const { consumption, targetCoverage, systemSizing, nextStep, prevStep } = useEstimation();
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-3 border border-emerald-200">
          <Cpu className="w-3.5 h-3.5" /> {t('step3Badge')}
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {t('step3Header')}
        </h2>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto mt-2 leading-relaxed">
          {t('step3SubHeader')}
        </p>
      </div>

      {/* Main Sizing Specification Card */}
      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-200 p-6 sm:p-10 mb-8 relative overflow-hidden">
        {/* Top Highlight Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-bold text-xl">
              <Sun className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-emerald-100">
                {t('recommendedCapacity')}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black">
                {formatKW(systemSizing.requiredKW)}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs bg-black/20 px-3.5 py-2 rounded-xl backdrop-blur-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>Targeting <strong>{targetCoverage.percent}%</strong> of your annual {consumption.annualUnits} kWh</span>
          </div>
        </div>

        {/* 4 Core Calculation Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Tile 1: Required Annual Generation */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                <Zap className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                {t('targetGenerationLabel')}
              </span>
              <span className="text-2xl font-black text-slate-900 mt-1 block">
                {formatKWh(systemSizing.requiredGenerationKWh)}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-3 pt-2 border-t border-slate-200">
              ~{Math.round(systemSizing.requiredGenerationKWh / 12)} units / month
            </p>
          </div>

          {/* Tile 2: System Capacity */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
                <Cpu className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                {t('systemCapacity')}
              </span>
              <span className="text-2xl font-black text-slate-900 mt-1 block">
                {formatKW(systemSizing.requiredKW)}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-3 pt-2 border-t border-slate-200">
              at ~1,650 kWh/kW/yr yield
            </p>
          </div>

          {/* Tile 3: Estimated Panel Count */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center mb-3">
                <LayoutGrid className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                {t('panelCountLabel')}
              </span>
              <span className="text-2xl font-black text-slate-900 mt-1 block">
                {systemSizing.estimatedPanelCount} <span className="text-sm font-semibold text-slate-500">panels</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-3 pt-2 border-t border-slate-200">
              at 400W standard spec
            </p>
          </div>

          {/* Tile 4: Minimum Roof Area Needed */}
          <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-300 flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center mb-3 shadow-sm">
                <Layers className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
                {t('minRoofAreaLabel')}
              </span>
              <span className="text-2xl font-black text-emerald-700 mt-1 block">
                {formatArea(systemSizing.requiredRoofAreaM2)}
              </span>
            </div>
            <p className="text-[11px] text-emerald-700 mt-3 pt-2 border-t border-emerald-200 font-semibold">
              including ~1.9 m²/panel walkway space
            </p>
          </div>
        </div>

        {/* Synopsis Style Summary Box */}
        <div className="p-5 rounded-2xl bg-slate-900 text-slate-100 font-mono text-xs sm:text-sm space-y-2 border border-slate-800">
          <div className="text-emerald-400 font-bold tracking-wider text-xs pb-1 border-b border-slate-800 flex items-center justify-between">
            <span>[ SYSTEM SIZING SPECIFICATION SUMMARY ]</span>
            <span>STATUS: READY FOR MAP VERIFICATION</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">{t('step1Name')}:</span>
            <span className="font-semibold text-white">{consumption.monthlyUnits} units</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">{t('step2Name')}:</span>
            <span className="font-semibold text-emerald-400">{targetCoverage.percent}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">{t('targetGenerationLabel')}:</span>
            <span className="font-semibold text-white">~{Math.round(systemSizing.requiredGenerationKWh / 12)} units/mo (~{systemSizing.requiredGenerationKWh.toLocaleString()} kWh/yr)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">{t('systemCapacity')}:</span>
            <span className="font-semibold text-amber-400">~{systemSizing.requiredKW} kW</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">{t('panelCountLabel')}:</span>
            <span className="font-semibold text-white">~{systemSizing.estimatedPanelCount} panels</span>
          </div>
          <div className="flex justify-between text-emerald-300 font-bold pt-1 border-t border-slate-800">
            <span>{t('minRoofAreaLabel')}:</span>
            <span>~{systemSizing.requiredRoofAreaM2} m²</span>
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
          <span>{t('proceedToRoofCheck')}</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}

