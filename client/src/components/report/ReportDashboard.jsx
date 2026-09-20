import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import {
  Sun,
  Zap,
  TrendingUp,
  IndianRupee,
  Layers,
  MapPin,
  Leaf,
  Clock,
  CheckCircle2,
  Share2,
  Printer,
  ShieldCheck,
  Award,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useEstimation } from '../../context/EstimationContext';
import { useLanguage } from '../../context/LanguageContext';
import { formatINR, formatCostRange, formatKW, formatKWh, formatArea, formatPaybackRange } from '../../utils/formatters';
import AIAssistantWidget from '../assistant/AIAssistantWidget';
import InstallerGrid from '../installers/InstallerGrid';
import SolarLoanCalculator from './SolarLoanCalculator';
import ShareModal from './ShareModal';
import WeatherSolarMetrics from './WeatherSolarMetrics';

export default function ReportDashboard() {
  const {
    consumption,
    targetCoverage,
    systemSizing,
    roofVerification,
    panelSpec,
    generation,
    financials,
    finalizeReport,
    resetFlow
  } = useEstimation();

  const { t } = useLanguage();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Trigger celebration confetti on mount
  useEffect(() => {
    finalizeReport();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  const handleShare = () => {
    setIsShareModalOpen(true);
  };

  const handlePrint = () => {
    window.print();
  };

  // 25-Year Projection Chart Data
  const chartData = financials.chartProjections && financials.chartProjections.length > 0
    ? financials.chartProjections
    : Array.from({ length: 25 }, (_, i) => {
        const yr = i + 1;
        const cumSavings = Math.round(financials.savings.annual * yr * Math.pow(1.035, yr - 1));
        const gridSpendNoSolar = Math.round(consumption.estimatedAnnualBill * yr * Math.pow(1.04, yr - 1));
        const solarCapex = financials.costRange.mid || 85000;
        const residualGrid = Math.round(consumption.estimatedAnnualBill * (1 - targetCoverage.percent / 100) * yr * Math.pow(1.04, yr - 1));
        return {
          year: `Yr ${yr}`,
          yearNumber: yr,
          cumulativeSavings: cumSavings,
          cumulativeWithoutSolarSpend: gridSpendNoSolar,
          cumulativeSpendWithSolar: solarCapex + residualGrid
        };
      });

  const sysKW = Number(systemSizing.roundedCapacityKW || systemSizing.requiredKW || 2.0);
  const subsidyAmount = sysKW <= 1.2 ? 30000 : sysKW <= 2.2 ? 60000 : 78000;

  return (
    <div className="max-w-7xl mx-auto animate-fade-in pb-16">
      {/* Top Action & Report Title Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 bg-white p-6 rounded-3xl shadow-md border border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>{t('verifiedAssessment')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t('reportTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {consumption.monthlyUnits} {t('demandLabel')} • {roofVerification.markedAreaM2} m² {t('roofFootprint')}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={handleShare}
            type="button"
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-slate-200 bg-emerald-50 hover:bg-emerald-100 text-xs font-bold text-emerald-800 transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <Share2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t('shareReport')}</span>
          </button>

          <button
            onClick={handlePrint}
            type="button"
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{t('printReport')}</span>
          </button>

          <button
            onClick={resetFlow}
            type="button"
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 border border-slate-300 transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t('newEstimate')}</span>
          </button>
        </div>
      </div>

      {/* 8 Core Stat KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {/* KPI 1: System Size */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-emerald-300 transition-all">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
            <Sun className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            {t('systemCapacity')}
          </span>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 block">
            {formatKW(systemSizing.roundedCapacityKW || systemSizing.requiredKW)}
          </span>
          <p className="text-[11px] text-emerald-700 font-semibold mt-2">
            {systemSizing.estimatedPanelCount} × {panelSpec.wattage}W Panels
          </p>
        </div>

        {/* KPI 2: Installation Cost Range (Range-based) */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-emerald-300 transition-all">
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
            <IndianRupee className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            {t('turnkeyCost')}
          </span>
          <span className="text-lg sm:text-xl font-black text-slate-900 mt-1 block truncate">
            {financials.costRange.formattedRange}
          </span>
          <p className="text-[11px] text-slate-500 mt-2">
            Standard to Premium tier
          </p>
        </div>

        {/* KPI 3: Annual Electricity Generation */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-emerald-300 transition-all">
          <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-3">
            <Zap className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            {t('annualGeneration')}
          </span>
          <span className="text-2xl sm:text-3xl font-black text-emerald-700 mt-1 block">
            {formatKWh(generation.annualKWh)}
          </span>
          <p className="text-[11px] text-slate-500 mt-2">
            ~{Math.round(generation.annualKWh / 12)} {t('unitsUnit')}
          </p>
        </div>

        {/* KPI 4: Payback Period Range */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-emerald-300 transition-all">
          <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-3">
            <Clock className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            {t('paybackPeriod')}
          </span>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 block">
            {financials.payback.formattedRange}
          </span>
          <p className="text-[11px] text-indigo-700 font-semibold mt-2">
            Fast capital recovery
          </p>
        </div>

        {/* KPI 5: Annual Bill Savings */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-emerald-300 transition-all">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
            <TrendingUp className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            {t('annualSavings')}
          </span>
          <span className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1 block">
            {formatINR(financials.savings.annual)}
          </span>
          <p className="text-[11px] text-slate-500 mt-2">
            ~{formatINR(financials.savings.monthly)} / month
          </p>
        </div>

        {/* KPI 6: PM Surya Ghar Subsidy */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-emerald-300 transition-all">
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
            <Award className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            {t('pmSubsidy')}
          </span>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 block">
            {formatINR(subsidyAmount)}
          </span>
          <p className="text-[11px] text-amber-700 font-semibold mt-2">
            Direct Central DBT Benefit
          </p>
        </div>

        {/* KPI 7: Roof Space Verification */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-emerald-300 transition-all">
          <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-3">
            <MapPin className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            {t('clearRoofArea')}
          </span>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 block">
            {formatArea(roofVerification.markedAreaM2)}
          </span>
          <p className="text-[11px] text-emerald-700 font-semibold mt-2 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{roofVerification.markedAreaM2 >= systemSizing.requiredRoofAreaM2 ? 'Fully Sufficient' : 'Slight Shortfall'}</span>
          </p>
        </div>

        {/* KPI 8: Environmental Carbon Offset */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-emerald-300 transition-all">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
            <Leaf className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            {t('co2Offset')}
          </span>
          <span className="text-2xl sm:text-3xl font-black text-emerald-700 mt-1 block">
            {financials.environmental?.lifetimeCO2Tons || 38.5} <span className="text-sm font-semibold text-slate-500">Tons</span>
          </span>
          <p className="text-[11px] text-emerald-700 font-semibold mt-2">
            = {financials.environmental?.equivalentTreesPlanted || 70} {t('treesPlanted')}
          </p>
        </div>
      </div>

      {/* Main Chart Section: 25-Year Spend Projections */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-200 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-200">
              <TrendingUp className="w-3.5 h-3.5" /> Financial Forecasting Model
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              Cumulative Electricity Spend: Without Solar vs. With Solar
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Simulating a 4% annual grid tariff escalation and 0.7% panel degradation over 25 years.
            </p>
          </div>

          {/* ROI Milestones Badge */}
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs font-semibold">
            <span className="px-2.5 py-1 bg-white text-emerald-800 rounded-xl shadow-sm">
              10-Yr ROI: +{financials.roi.year10 || 120}%
            </span>
            <span className="px-2.5 py-1 text-slate-600">
              25-Yr ROI: +{financials.roi.year25 || 340}%
            </span>
          </div>
        </div>

        {/* Recharts Area Chart */}
        <div className="w-full h-[340px] sm:h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorNoSolar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorWithSolar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} tickLine={false} />
              <YAxis
                stroke="#94a3b8"
                fontSize={12}
                tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
                tickLine={false}
              />
              <Tooltip
                formatter={(val, name) => [
                  `₹${Number(val).toLocaleString('en-IN')}`,
                  name === 'cumulativeWithoutSolarSpend'
                    ? 'Total Paid to Grid (No Solar)'
                    : 'Total Out-of-Pocket Spend (With Solar)'
                ]}
                labelFormatter={(label) => `Projection: ${label}`}
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderRadius: '16px',
                  color: '#fff',
                  border: '1px solid #334155',
                  padding: '12px'
                }}
              />
              <Legend
                formatter={(value) =>
                  value === 'cumulativeWithoutSolarSpend'
                    ? 'Cumulative Cost Without Solar (Rising Grid Spend)'
                    : 'Cumulative Cost With Solar (Capex + Residual Bill)'
                }
                wrapperStyle={{ paddingTop: '16px', fontSize: '12px', fontWeight: 'bold' }}
              />
              <Area
                type="monotone"
                dataKey="cumulativeWithoutSolarSpend"
                stroke="#f43f5e"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorNoSolar)"
              />
              <Area
                type="monotone"
                dataKey="cumulativeSpendWithSolar"
                stroke="#10b981"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorWithSolar)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Solar Financing & Loan EMI Calculator */}
      <SolarLoanCalculator
        systemKW={sysKW}
        costRange={financials.costRange}
        annualSavings={financials.savings.annual}
      />

      {/* Regional Solar Climate & Meteorological Metrics */}
      <WeatherSolarMetrics
        systemKW={sysKW}
        annualGeneration={generation.annualKWh}
      />

      {/* Two Column Section: Step 9 AI Solar Assistant + Step 10 Recommended Installers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        {/* Left Col (5 cols): AI Solar Assistant Chat Widget */}
        <div className="lg:col-span-5 flex flex-col">
          <AIAssistantWidget />
        </div>

        {/* Right Col (7 cols): Recommended Solar Installers */}
        <div className="lg:col-span-7 flex flex-col">
          <InstallerGrid />
        </div>
      </div>

      {/* 1-Click WhatsApp & Email Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        systemKW={sysKW}
        annualSavings={financials.savings.annual}
        subsidy={subsidyAmount}
        paybackYears={financials.payback.formattedRange}
      />
    </div>
  );
}
