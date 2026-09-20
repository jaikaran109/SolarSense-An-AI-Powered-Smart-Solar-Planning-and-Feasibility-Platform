import React from 'react';
import { Sun, Sparkles, User, Globe, Award } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useEstimation } from '../../context/EstimationContext';
import { useLanguage } from '../../context/LanguageContext';

export default function Navbar({ activePage, setActivePage }) {
  const { user, isAuthenticated, logout, setIsAuthModalOpen, setAuthMode } = useAuth();
  const { resetFlow } = useEstimation();
  const { lang, toggleLanguage, t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 w-full glass-card border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo */}
          <div 
            onClick={() => { resetFlow(); setActivePage('home'); }}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:scale-105 transition-transform duration-200">
              <Sun className="w-6 h-6 text-white animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                  Solar<span className="text-emerald-600">Sense</span>
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                {t('brandSub')}
              </p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => setActivePage('home')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                activePage === 'home'
                  ? 'bg-slate-100 text-emerald-700 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {t('home')}
            </button>

            <button
              onClick={() => setActivePage('estimate')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                activePage === 'estimate'
                  ? 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-200/70'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              {t('startEstimation')}
            </button>

            <button
              onClick={() => setActivePage('brands')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                activePage === 'brands'
                  ? 'bg-amber-50 text-amber-800 font-bold border border-amber-200/80 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Award className="w-4 h-4 text-amber-500" />
              <span>{t('topBrands')}</span>
            </button>

            <button
              onClick={() => {
                setActivePage('home');
                setTimeout(() => {
                  const el = document.getElementById('how-it-works');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="px-3.5 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            >
              {t('howItWorks')}
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher Toggle */}
            <button
              onClick={toggleLanguage}
              type="button"
              className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors shadow-sm"
              title="Toggle Language / भाषा बदलें"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
              <span className="uppercase tracking-wider">{lang === 'en' ? '🇮🇳 हिंदी' : '🇬🇧 EN'}</span>
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700">
                  <User className="w-4 h-4 text-emerald-600" />
                  <span className="max-w-[100px] truncate">{user?.name || 'Account'}</span>
                </div>
                <button
                  onClick={logout}
                  className="text-xs text-slate-500 hover:text-rose-600 font-medium px-2 py-1"
                >
                  {t('logout')}
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setAuthMode('login');
                  setIsAuthModalOpen(true);
                }}
                className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-emerald-700 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors hidden sm:block"
              >
                {t('signIn')} <span className="text-slate-400 font-normal text-xs">({t('optional')})</span>
              </button>
            )}

            <button
              onClick={() => setActivePage('estimate')}
              className="px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md shadow-emerald-600/20 hover:shadow-lg hover:shadow-emerald-600/30 transition-all transform active:scale-95 flex items-center gap-2"
            >
              <span>{t('calculateFeasibility')}</span>
              <span className="hidden sm:inline">→</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
