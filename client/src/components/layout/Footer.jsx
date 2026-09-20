import React from 'react';
import { Sun, Heart, ShieldCheck, HelpCircle, ExternalLink, Leaf } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function Footer({ onNavigate }) {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Platform info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md">
                <Sun className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Solar<span className="text-emerald-400">Sense</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              {t('footerDesc')}
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-400 pt-2">
              <span className="flex items-center gap-1.5 text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800/60">
                <Leaf className="w-3.5 h-3.5" /> {t('cleanEnergyTag')}
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400" /> {t('freeSelfService')}
              </span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100 mb-4">
              {t('workflowTitle')}
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <button onClick={() => onNavigate && onNavigate('brands')} className="text-amber-400 hover:text-amber-300 font-semibold transition-colors flex items-center gap-1.5">
                  ★ {t('topBrands')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate && onNavigate('estimate')} className="hover:text-emerald-400 transition-colors">
                  1. {t('step1Name')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate && onNavigate('estimate')} className="hover:text-emerald-400 transition-colors">
                  2. {t('step2Name')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate && onNavigate('estimate')} className="hover:text-emerald-400 transition-colors">
                  3. {t('step3Name')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate && onNavigate('estimate')} className="hover:text-emerald-400 transition-colors">
                  4. {t('step4Name')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate && onNavigate('estimate')} className="hover:text-emerald-400 transition-colors">
                  5. {t('step5Name')}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Key Constants & Technical Assumptions */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100 mb-4">
              {t('assumptionsTitle')}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex justify-between py-1 border-b border-slate-800">
                <span>{t('irradianceAssumption')}</span>
                <span className="font-semibold text-slate-200">1,650 kWh/kW/yr</span>
              </li>
              <li className="flex justify-between py-1 border-b border-slate-800">
                <span>{t('prAssumption')}</span>
                <span className="font-semibold text-slate-200">80.0%</span>
              </li>
              <li className="flex justify-between py-1 border-b border-slate-800">
                <span>{t('panelFootprintAssumption')}</span>
                <span className="font-semibold text-slate-200">~1.9 m² / panel</span>
              </li>
              <li className="flex justify-between py-1 border-b border-slate-800">
                <span>{t('turnkeyAssumption')}</span>
                <span className="font-semibold text-slate-200">₹45k - ₹65k / kW</span>
              </li>
              <li className="flex justify-between py-1">
                <span>{t('escalationAssumption')}</span>
                <span className="font-semibold text-slate-200">4.0% / yr</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Disclaimer & Copyright */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} SolarSense. {t('disclaimer')}
          </p>
          <div className="flex items-center gap-2">
            <span>Powered by</span>
            <span className="font-semibold text-emerald-400">Mapbox + Turf.js + Gemini AI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

