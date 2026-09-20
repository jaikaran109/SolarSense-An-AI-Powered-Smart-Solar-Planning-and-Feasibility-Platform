import React from 'react';
import { Sun, CloudSun, Wind, ShieldCheck, Thermometer, Droplets, ArrowUpRight, Award, Compass } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function WeatherSolarMetrics({ systemKW = 2.0, annualGeneration = 3300 }) {
  const { t } = useLanguage();

  // Monthly Solar Generation Distribution (Jan to Dec) with Monsoon Dip
  const monthlyYieldData = [
    { month: 'Jan', percentage: 7.5, units: Math.round(annualGeneration * 0.075), weather: 'Sunny / Fog' },
    { month: 'Feb', percentage: 8.5, units: Math.round(annualGeneration * 0.085), weather: 'Clear' },
    { month: 'Mar', percentage: 10.0, units: Math.round(annualGeneration * 0.10), weather: 'Peak Sun' },
    { month: 'Apr', percentage: 10.5, units: Math.round(annualGeneration * 0.105), weather: 'High Irradiance' },
    { month: 'May', percentage: 11.0, units: Math.round(annualGeneration * 0.11), weather: 'Peak Sun' },
    { month: 'Jun', percentage: 8.0, units: Math.round(annualGeneration * 0.08), weather: 'Pre-Monsoon' },
    { month: 'Jul', percentage: 6.0, units: Math.round(annualGeneration * 0.06), weather: 'Monsoon Clouds' },
    { month: 'Aug', percentage: 6.5, units: Math.round(annualGeneration * 0.065), weather: 'Monsoon Rain' },
    { month: 'Sep', percentage: 8.0, units: Math.round(annualGeneration * 0.08), weather: 'Post-Monsoon' },
    { month: 'Oct', percentage: 9.5, units: Math.round(annualGeneration * 0.095), weather: 'Crisp Sun' },
    { month: 'Nov', percentage: 8.0, units: Math.round(annualGeneration * 0.08), weather: 'Clear' },
    { month: 'Dec', percentage: 6.5, units: Math.round(annualGeneration * 0.065), weather: 'Winter Sun' }
  ];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
            <Sun className="w-4 h-4 text-amber-500" />
            <span>Solar PV Meteorological & Performance Engineering</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {t('climateTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Modeled on annual solar irradiance factor of <strong>1,650 kWh/kW/yr</strong> with 80% Performance Ratio (PR).
          </p>
        </div>

        {/* Ideal Orientation Badge */}
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-bold self-start md:self-auto">
          <Compass className="w-4 h-4 text-amber-600" />
          <span>Optimal Orientation: True South (180° Azimuth)</span>
        </div>
      </div>

      {/* 4 Core Climate KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {/* Peak Sun Hours */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-1">
            <Sun className="w-4 h-4 text-amber-500" />
            <span>{t('peakSunHours')}</span>
          </div>
          <span className="text-xl font-black text-slate-900 block">4.8 – 5.5</span>
          <span className="text-[11px] text-slate-500 font-medium">hours of peak sun / day</span>
        </div>

        {/* Temperature Derating */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-1">
            <Thermometer className="w-4 h-4 text-rose-500" />
            <span>Thermal Coeff. (Pmax)</span>
          </div>
          <span className="text-xl font-black text-slate-900 block">-0.35%/°C</span>
          <span className="text-[11px] text-slate-500 font-medium">TopCon / Mono PERC standard</span>
        </div>

        {/* Mechanical Load Cert */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-1">
            <Wind className="w-4 h-4 text-cyan-500" />
            <span>Wind & Hail Load</span>
          </div>
          <span className="text-xl font-black text-slate-900 block">2400 Pa</span>
          <span className="text-[11px] text-slate-500 font-medium">Tested up to 160 km/h wind</span>
        </div>

        {/* Monsoon Rain Factor */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-1">
            <Droplets className="w-4 h-4 text-blue-500" />
            <span>Diffuse Light CUF</span>
          </div>
          <span className="text-xl font-black text-slate-900 block">25% – 40%</span>
          <span className="text-[11px] text-slate-500 font-medium">yield maintained on overcast days</span>
        </div>
      </div>

      {/* Monthly Generation Curve & Seasonal Breakdown */}
      <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Monthly Generation Distribution (kWh) with Monsoon & Winter Cycles
          </span>
          <span className="text-xs text-slate-500 font-medium">
            Total Annual: <strong>{annualGeneration.toLocaleString('en-IN')} kWh</strong>
          </span>
        </div>

        {/* 12-Month Bar Visualization */}
        <div className="grid grid-cols-6 sm:grid-cols-12 gap-2 text-center pt-2">
          {monthlyYieldData.map((m) => {
            const isMonsoon = m.month === 'Jul' || m.month === 'Aug';
            const isPeak = m.month === 'Mar' || m.month === 'Apr' || m.month === 'May';

            return (
              <div key={m.month} className="flex flex-col items-center group">
                <span className="text-[10px] font-bold text-slate-600 mb-1 group-hover:text-emerald-700 transition-colors">
                  {m.units}
                </span>

                {/* Progress Bar Container */}
                <div className="w-full bg-slate-200 rounded-t-lg h-24 flex items-end p-0.5 relative overflow-hidden">
                  <div
                    style={{ height: `${(m.percentage / 11) * 100}%` }}
                    className={`w-full rounded-t-md transition-all duration-500 group-hover:opacity-90 ${
                      isPeak
                        ? 'bg-gradient-to-t from-amber-500 to-yellow-400 shadow-sm'
                        : isMonsoon
                        ? 'bg-gradient-to-t from-blue-500 to-cyan-400'
                        : 'bg-gradient-to-t from-emerald-600 to-teal-400'
                    }`}
                  />
                </div>

                <span className={`text-xs font-black mt-1.5 ${
                  isPeak ? 'text-amber-700' : isMonsoon ? 'text-blue-700' : 'text-slate-700'
                }`}>
                  {m.month}
                </span>
                <span className="text-[9px] text-slate-400 font-medium truncate w-full hidden sm:block">
                  {m.percentage}%
                </span>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-5 pt-4 border-t border-slate-200 text-xs font-medium text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-gradient-to-tr from-amber-500 to-yellow-400" />
            <span>Peak Summer Sun (Mar–May)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-gradient-to-tr from-blue-500 to-cyan-400" />
            <span>Monsoon Rain & Cloud Dip (Jul–Aug)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-gradient-to-tr from-emerald-600 to-teal-400" />
            <span>Optimal Clear Days (Sep–Feb)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
