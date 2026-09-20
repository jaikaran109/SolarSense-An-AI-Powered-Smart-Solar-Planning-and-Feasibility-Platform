import React, { useState } from 'react';
import {
  MapPin,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Info,
  Check,
  Zap,
  ShieldCheck,
  Layers
} from 'lucide-react';
import { useEstimation } from '../../context/EstimationContext';
import { useLanguage } from '../../context/LanguageContext';
import { formatArea, formatKW } from '../../utils/formatters';
import RoofMap from './RoofMap';

export default function RoofVerificationMap() {
  const {
    systemSizing,
    roofVerification,
    runRoofVerification,
    nextStep,
    prevStep
  } = useEstimation();
  const { t } = useLanguage();

  const [markedArea, setMarkedArea] = useState(roofVerification.markedAreaM2 || 0);

  const handleAreaCalculated = (areaInM2) => {
    setMarkedArea(areaInM2);
    runRoofVerification(areaInM2);
  };

  const requiredArea = systemSizing.requiredRoofAreaM2 || 12.0;
  const currentMarkedArea = markedArea > 0 ? markedArea : (roofVerification.markedAreaM2 || 0);
  const isSufficient = currentMarkedArea >= requiredArea * 0.95;
  const shortfallAmount = Number((requiredArea - currentMarkedArea).toFixed(1));
  const excessAmount = Number((currentMarkedArea - requiredArea).toFixed(1));

  return (
    <div className="max-w-6xl mx-auto animate-fade-in space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-3 border border-emerald-200 shadow-sm">
          <MapPin className="w-3.5 h-3.5 text-emerald-600" /> {t('step4Badge')}
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {t('step4Header')}
        </h2>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto mt-2 leading-relaxed">
          {t('step4SubHeader')}
        </p>
      </div>

      {/* Main Map & Feasibility Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Leaflet Satellite Map with Polygon Draw */}
        <div className="lg:col-span-2 flex flex-col">
          <RoofMap
            onAreaCalculated={handleAreaCalculated}
            initialArea={roofVerification.markedAreaM2 || 0}
          />
        </div>

        {/* Right Col: Feasibility Status & Analysis Sidebar */}
        <div className="flex flex-col justify-between space-y-4">
          {/* Feasibility Verdict Card */}
          <div
            className={`rounded-3xl p-6 border-2 transition-all shadow-lg ${
              currentMarkedArea === 0
                ? 'bg-slate-50 border-slate-200'
                : isSufficient
                ? 'bg-emerald-50/80 border-emerald-400'
                : 'bg-amber-50/80 border-amber-300'
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center text-white font-bold shadow-md ${
                  currentMarkedArea === 0
                    ? 'bg-slate-400'
                    : isSufficient
                    ? 'bg-emerald-600'
                    : 'bg-amber-500'
                }`}
              >
                {currentMarkedArea === 0 ? (
                  <Layers className="w-6 h-6" />
                ) : isSufficient ? (
                  <Check className="w-6 h-6 stroke-[3]" />
                ) : (
                  <AlertTriangle className="w-6 h-6" />
                )}
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500 block">
                  {t('step4Name')}
                </span>
                <h3
                  className={`text-lg font-black ${
                    currentMarkedArea === 0
                      ? 'text-slate-700'
                      : isSufficient
                      ? 'text-emerald-900'
                      : 'text-amber-900'
                  }`}
                >
                  {currentMarkedArea === 0
                    ? 'Awaiting Roof Boundary'
                    : isSufficient
                    ? t('areaStatusFit')
                    : t('areaStatusShort')}
                </h3>
              </div>
            </div>

            {/* Metrics Breakdown */}
            <div className="space-y-3 pt-3 border-t border-slate-200/80 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-slate-600 font-medium">{t('clearRoofArea')}:</span>
                <span className="font-bold text-slate-900">
                  {currentMarkedArea > 0 ? formatArea(currentMarkedArea) : '—'}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-600 font-medium">
                  {t('requiredRoofArea')} ({systemSizing.requiredKW} kW):
                </span>
                <span className="font-bold text-slate-900">{formatArea(requiredArea)}</span>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-dashed border-slate-300">
                <span className="text-slate-700 font-semibold">Margin / Difference:</span>
                <span
                  className={`font-black ${
                    currentMarkedArea === 0
                      ? 'text-slate-500'
                      : isSufficient
                      ? 'text-emerald-700'
                      : 'text-amber-700'
                  }`}
                >
                  {currentMarkedArea === 0
                    ? '—'
                    : currentMarkedArea >= requiredArea
                    ? `+${excessAmount} m² excess space`
                    : `-${shortfallAmount} m² shortfall`}
                </span>
              </div>
            </div>

            {/* Dynamic Advice / Explanation */}
            <div className="mt-4 p-3.5 rounded-2xl bg-white/80 border border-slate-200/80 text-xs text-slate-600 leading-relaxed shadow-sm">
              {currentMarkedArea === 0 ? (
                <span>
                  {t('drawInstruction')}
                </span>
              ) : isSufficient ? (
                <div className="flex items-start gap-2 text-emerald-800 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>
                    {t('areaStatusFit')}
                  </span>
                </div>
              ) : (
                <div className="flex items-start gap-2 text-amber-800">
                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span>
                    {t('areaStatusShort')}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Sizing Summary Reference Box */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-md">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" /> {t('step3Name')}
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">{t('systemCapacity')}</span>
                <span className="text-sm font-extrabold text-slate-800">{systemSizing.requiredKW} kW</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">{t('panelCountLabel')}</span>
                <span className="text-sm font-extrabold text-slate-800">{systemSizing.estimatedPanelCount} Units</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Step Navigation Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
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
          <span>{t('proceedToPanels')}</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}

