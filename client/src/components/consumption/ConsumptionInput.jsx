import React, { useState } from 'react';
import { Zap, IndianRupee, Calendar, HelpCircle, ArrowRight, Sparkles, TrendingUp, Info } from 'lucide-react';
import { useEstimation } from '../../context/EstimationContext';
import { useLanguage } from '../../context/LanguageContext';
import { formatINR } from '../../utils/formatters';

export default function ConsumptionInput() {
  const { consumption, recalculateFromConsumption, nextStep, isLoading } = useEstimation();
  const { t } = useLanguage();
  
  const [inputType, setInputType] = useState(consumption.inputType || 'monthly_units');
  const [inputValue, setInputValue] = useState(consumption.inputValue || 300);
  const [tariff, setTariff] = useState(consumption.tariffPerKWh || 8.0);
  const [showTariffSettings, setShowTariffSettings] = useState(false);

  // Quick preset pills for typical Indian homes
  const quickPresets = [
    { label: t('preset1'), units: 180, bill: 1440 },
    { label: t('preset2'), units: 300, bill: 2400 },
    { label: t('preset3'), units: 600, bill: 4800 },
    { label: t('preset4'), units: 1000, bill: 8000 }
  ];

  const handleInputChange = (val) => {
    const num = Math.max(1, Number(val) || 0);
    setInputValue(num);
    recalculateFromConsumption(inputType, num, tariff);
  };

  const handleTypeChange = (type) => {
    setInputType(type);
    let newVal = inputValue;
    if (type === 'monthly_units') {
      newVal = consumption.monthlyUnits || 300;
    } else if (type === 'annual_units') {
      newVal = consumption.annualUnits || 3600;
    } else if (type === 'bill_amount') {
      newVal = consumption.estimatedMonthlyBill || 2400;
    }
    setInputValue(newVal);
    recalculateFromConsumption(type, newVal, tariff);
  };

  const handleTariffChange = (newTariff) => {
    const tVal = Math.max(1, Number(newTariff) || 8.0);
    setTariff(tVal);
    recalculateFromConsumption(inputType, inputValue, tVal);
  };

  const applyPreset = (preset) => {
    if (inputType === 'bill_amount') {
      setInputValue(preset.bill);
      recalculateFromConsumption('bill_amount', preset.bill, tariff);
    } else if (inputType === 'annual_units') {
      const ann = preset.units * 12;
      setInputValue(ann);
      recalculateFromConsumption('annual_units', ann, tariff);
    } else {
      setInputValue(preset.units);
      recalculateFromConsumption('monthly_units', preset.units, tariff);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Step Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-3 border border-emerald-200">
          <Zap className="w-3.5 h-3.5" /> {t('step1Badge')}
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {t('step1Header')}
        </h2>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto mt-2 leading-relaxed">
          {t('step1SubHeader')}
        </p>
      </div>

      {/* Main Input Container Card */}
      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-200 p-6 sm:p-10 mb-8 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-100/50 rounded-full blur-3xl pointer-events-none" />

        {/* Input Mode Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center p-1.5 rounded-2xl bg-slate-100/90 border border-slate-200 mb-8 max-w-xl mx-auto">
          <button
            type="button"
            onClick={() => handleTypeChange('monthly_units')}
            className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              inputType === 'monthly_units'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Zap className="w-4 h-4 text-emerald-600" />
            {t('monthlyUnitsTab')}
          </button>

          <button
            type="button"
            onClick={() => handleTypeChange('bill_amount')}
            className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              inputType === 'bill_amount'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <IndianRupee className="w-4 h-4 text-amber-500" />
            {t('billAmountTab')}
          </button>

          <button
            type="button"
            onClick={() => handleTypeChange('annual_units')}
            className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              inputType === 'annual_units'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-4 h-4 text-teal-600" />
            {t('annualUnitsTab')}
          </button>
        </div>

        {/* Big Number Input Field */}
        <div className="max-w-md mx-auto text-center mb-8">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            {inputType === 'monthly_units' && t('enterUnitsLabel')}
            {inputType === 'bill_amount' && t('enterBillLabel')}
            {inputType === 'annual_units' && t('enterAnnualLabel')}
          </label>

          <div className="relative inline-block w-full">
            {inputType === 'bill_amount' && (
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-400">
                ₹
              </span>
            )}
            <input
              type="number"
              min="1"
              max="50000"
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              className={`w-full py-4 text-center font-extrabold text-3xl sm:text-4xl text-slate-900 bg-slate-50 border-2 rounded-2xl focus:outline-none transition-all shadow-inner ${
                inputType === 'bill_amount' ? 'pl-10 pr-6' : 'px-6'
              } border-emerald-300 focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-500/10`}
            />
            {inputType !== 'bill_amount' && (
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                kWh
              </span>
            )}
          </div>

          <p className="text-xs text-slate-500 mt-2 flex items-center justify-center gap-1">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            Check your latest electricity bill or select a preset below
          </p>
        </div>

        {/* Quick Typical Household Presets */}
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 text-center mb-3">
            {t('quickPresetsTitle')}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-2xl mx-auto">
            {quickPresets.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => applyPreset(p)}
                className="p-3 rounded-xl border border-slate-200 bg-white hover:border-emerald-400 hover:bg-emerald-50/50 transition-all text-left group"
              >
                <span className="block text-xs font-bold text-slate-800 group-hover:text-emerald-700">
                  {p.label}
                </span>
                <span className="text-[11px] text-slate-500">
                  ~{p.units} units/mo (₹{p.bill})
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Calculated Normalization Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-100 bg-slate-50/70 p-4 rounded-2xl">
          <div className="text-center p-3">
            <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {t('step1Name')}
            </span>
            <span className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
              {consumption.monthlyUnits} <span className="text-xs font-semibold text-slate-500">{t('unitsUnit')}</span>
            </span>
          </div>

          <div className="text-center p-3 border-y sm:border-y-0 sm:border-x border-slate-200">
            <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {t('annualGeneration')}
            </span>
            <span className="text-xl sm:text-2xl font-black text-emerald-700 mt-0.5">
              {consumption.annualUnits.toLocaleString('en-IN')} <span className="text-xs font-semibold text-slate-500">{t('annualUnit')}</span>
            </span>
          </div>

          <div className="text-center p-3">
            <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {t('monthlySavings')}
            </span>
            <span className="text-xl sm:text-2xl font-black text-amber-600 mt-0.5">
              {formatINR(consumption.estimatedMonthlyBill)}
            </span>
          </div>
        </div>

        {/* Advanced Tariff Settings Toggle */}
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setShowTariffSettings(!showTariffSettings)}
            className="text-xs text-slate-500 hover:text-emerald-700 font-semibold underline inline-flex items-center gap-1"
          >
            {showTariffSettings ? 'Hide custom tariff setting' : `${t('tariffSettings')} (${t('tariffLabel')}: ₹${tariff}/kWh)`}
          </button>

          {showTariffSettings && (
            <div className="mt-3 p-4 rounded-2xl bg-white border border-slate-200 max-w-sm mx-auto animate-fade-in shadow-sm">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('tariffLabel')} ({t('perKWh')})
              </label>
              <div className="flex items-center gap-2 justify-center">
                <input
                  type="number"
                  step="0.5"
                  min="3"
                  max="20"
                  value={tariff}
                  onChange={(e) => handleTariffChange(e.target.value)}
                  className="w-24 px-3 py-1.5 rounded-lg border border-slate-300 text-center font-bold text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
                <span className="text-xs text-slate-500 font-medium">{t('perKWh')}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Next Step Action Button */}
      <div className="flex items-center justify-end">
        <button
          type="button"
          onClick={nextStep}
          disabled={isLoading || !inputValue}
          className="px-8 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-xl shadow-emerald-600/25 hover:shadow-2xl transition-all transform active:scale-98 flex items-center gap-3 text-base group"
        >
          <span>{t('nextStep')}: {t('step2Name')}</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}

