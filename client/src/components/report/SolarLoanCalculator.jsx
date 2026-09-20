import React, { useState, useMemo } from 'react';
import { IndianRupee, Calculator, CheckCircle2, TrendingUp, Sparkles, ShieldCheck, HelpCircle, ArrowRight, Wallet } from 'lucide-react';
import { formatINR } from '../../utils/formatters';
import { useLanguage } from '../../context/LanguageContext';

export default function SolarLoanCalculator({ systemKW = 2.0, costRange = { low: 90000, high: 130000, mid: 110000 }, annualSavings = 25000 }) {
  const { t } = useLanguage();

  // Government PM Surya Ghar Subsidy
  const subsidy = systemKW <= 1.2 ? 30000 : systemKW <= 2.2 ? 60000 : 78000;
  const netSystemCost = Math.max(10000, (costRange.mid || 100000) - subsidy);

  // State
  const [downPaymentPercent, setDownPaymentPercent] = useState(10); // 10% down payment
  const [interestRate, setInterestRate] = useState(7.0); // 7.0% p.a. PM Surya Ghar PSU bank rate
  const [tenureMonths, setTenureMonths] = useState(60); // 5 years (60 months)

  // Calculations
  const downPaymentAmount = Math.round(netSystemCost * (downPaymentPercent / 100));
  const loanPrincipal = Math.max(0, netSystemCost - downPaymentAmount);

  const { monthlyEMI, totalInterest, totalRepayment, monthlySavings, netMonthlyCashflow, isCashflowPositive } = useMemo(() => {
    const monthlyRate = interestRate / (12 * 100);
    const n = tenureMonths;

    let emi = 0;
    if (loanPrincipal > 0 && monthlyRate > 0) {
      emi = Math.round(
        (loanPrincipal * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1)
      );
    } else if (loanPrincipal > 0) {
      emi = Math.round(loanPrincipal / n);
    }

    const totalPaid = emi * n;
    const interest = Math.max(0, totalPaid - loanPrincipal);
    const mSavings = Math.round(annualSavings / 12);
    const netCashflow = mSavings - emi;

    return {
      monthlyEMI: emi,
      totalInterest: interest,
      totalRepayment: totalPaid + downPaymentAmount,
      monthlySavings: mSavings,
      netMonthlyCashflow: netCashflow,
      isCashflowPositive: netCashflow >= 0
    };
  }, [loanPrincipal, interestRate, tenureMonths, annualSavings, downPaymentAmount]);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md mb-8 overflow-hidden relative">
      {/* Decorative gradient header accent */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
            <Calculator className="w-4 h-4 text-emerald-600" />
            <span>PM Surya Ghar Collateral-Free Financing</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {t('financingTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            {t('financingSubtitle')}
          </p>
        </div>

        {/* Live Cashflow Positive Badge */}
        <div className={`px-4 py-3 rounded-2xl border flex items-center gap-3 ${
          isCashflowPositive 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-950' 
            : 'bg-amber-50 border-amber-200 text-amber-950'
        }`}>
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black ${
            isCashflowPositive ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'
          }`}>
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider block opacity-75">
              Monthly Cash Impact
            </span>
            <span className="text-sm font-black">
              {isCashflowPositive ? `+₹${Math.abs(netMonthlyCashflow).toLocaleString('en-IN')}/mo Surplus` : `-₹${Math.abs(netMonthlyCashflow).toLocaleString('en-IN')}/mo`}
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Interactive Controls & Live Outcome */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Sliders & Settings (7 cols) */}
        <div className="lg:col-span-7 space-y-5 bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200/80">
          {/* Net Investment Base */}
          <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-200">
            <span className="text-slate-500">Gross Turnkey Cost (~₹{costRange.mid?.toLocaleString('en-IN')}) - Subsidy (₹{subsidy.toLocaleString('en-IN')}):</span>
            <span className="font-bold text-slate-900 text-sm">₹{netSystemCost.toLocaleString('en-IN')} Net Cost</span>
          </div>

          {/* Slider 1: Down Payment */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5 font-bold">
              <span className="text-slate-700">{t('downPayment')}: {downPaymentPercent}%</span>
              <span className="text-emerald-700 font-extrabold text-sm">₹{downPaymentAmount.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="5"
              value={downPaymentPercent}
              onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-medium">
              <span>0% (Zero Down)</span>
              <span>20% (Recommended)</span>
              <span>50%</span>
            </div>
          </div>

          {/* Slider 2: Interest Rate */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5 font-bold">
              <span className="text-slate-700">{t('interestRate')}:</span>
              <span className="text-emerald-700 font-extrabold text-sm">{interestRate}% p.a.</span>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {[
                { label: 'PSU Bank (7.0%)', rate: 7.0 },
                { label: 'Private (8.5%)', rate: 8.5 },
                { label: 'NBFC (10.0%)', rate: 10.0 }
              ].map(p => (
                <button
                  key={p.rate}
                  type="button"
                  onClick={() => setInterestRate(p.rate)}
                  className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all border ${
                    interestRate === p.rate
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Slider 3: Tenure Months */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5 font-bold">
              <span className="text-slate-700">{t('tenure')}:</span>
              <span className="text-emerald-700 font-extrabold text-sm">{tenureMonths / 12} Years ({tenureMonths} Months)</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: '3 Yrs', months: 36 },
                { label: '5 Yrs', months: 60 },
                { label: '7 Yrs', months: 84 },
                { label: '10 Yrs', months: 120 }
              ].map(tObj => (
                <button
                  key={tObj.months}
                  type="button"
                  onClick={() => setTenureMonths(tObj.months)}
                  className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all border ${
                    tenureMonths === tObj.months
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {tObj.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Comparative Cashflow Card (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div>
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block mb-2">
              Monthly Cashflow Balance
            </span>

            {/* Comparison Row */}
            <div className="space-y-3 my-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-xs text-slate-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  {t('monthlySavings')}
                </span>
                <span className="text-base font-black text-emerald-400">
                  +₹{monthlySavings.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-xs text-slate-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-400" />
                  {t('monthlyEmi')}
                </span>
                <span className="text-base font-black text-rose-300">
                  -₹{monthlyEMI.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Net Outcome Banner */}
            <div className={`p-4 rounded-xl border text-center my-3 ${
              isCashflowPositive 
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-200' 
                : 'bg-amber-500/20 border-amber-500/40 text-amber-200'
            }`}>
              <span className="text-[11px] uppercase tracking-wider font-bold block opacity-80">
                {t('netMonthlyCashflow')}
              </span>
              <span className="text-2xl font-black tracking-tight block my-0.5 text-white">
                {netMonthlyCashflow >= 0 ? `+₹${netMonthlyCashflow.toLocaleString('en-IN')}/mo` : `-₹${Math.abs(netMonthlyCashflow).toLocaleString('en-IN')}/mo`}
              </span>
              <p className="text-[11px] font-medium text-emerald-300/90 leading-tight">
                {isCashflowPositive 
                  ? '✨ Solar electricity savings exceed your loan payment from month 1!'
                  : 'Minimal out-of-pocket investment during loan tenure.'}
              </p>
            </div>
          </div>

          {/* Loan Overview Mini Breakdown */}
          <div className="pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-xs text-slate-300">
            <div>
              <span className="text-slate-400 text-[10px] block">Loan Principal:</span>
              <span className="font-bold text-white">₹{loanPrincipal.toLocaleString('en-IN')}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">Total Interest ({interestRate}%):</span>
              <span className="font-bold text-white">₹{totalInterest.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
