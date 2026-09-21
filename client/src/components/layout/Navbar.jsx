import React, { useState, useEffect, useCallback } from 'react';
import { Sun, Sparkles, Globe, Award, Home as HomeIcon, Compass, Menu, X, FileText } from 'lucide-react';
import { useEstimation } from '../../context/EstimationContext';
import { useLanguage } from '../../context/LanguageContext';

export default function Navbar({ activePage, setActivePage }) {
  const { resetFlow } = useEstimation();
  const { lang, toggleLanguage, t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setMobileOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  const go = useCallback((page) => { setMobileOpen(false); setActivePage(page); }, [setActivePage]);
  const goHome = useCallback(() => { resetFlow(); go('home'); }, [resetFlow, go]);
  const goEstimate = useCallback(() => { go('estimate'); }, [go]);
  const goHowItWorks = useCallback(() => {
    setMobileOpen(false);
    if (activePage !== 'home') {
      setActivePage('home');
      setTimeout(() => { document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 250);
    } else {
      document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [activePage, setActivePage]);

  const navLinkClass = (isActive) => `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors border focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-1 ${isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200/70' : 'bg-transparent text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-100/80'}`;

  const isEstimateActive = activePage === 'estimate' || activePage === 'report';

  const navItems = [
    { key: 'home', label: t('home'), icon: HomeIcon, active: activePage === 'home', action: goHome },
    { key: 'estimate', label: t('startEstimation'), icon: Sparkles, active: isEstimateActive, action: goEstimate },
    { key: 'brands', label: t('navBrands'), icon: Award, active: activePage === 'brands', action: () => go('brands') },
    { key: 'how-it-works', label: t('howItWorks'), icon: Compass, active: false, action: goHowItWorks },
  ];

  return (
    <header className={`sticky top-0 z-40 w-full border-b bg-white/90 backdrop-blur-md transition-shadow ${scrolled ? 'border-slate-200 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.25)]' : 'border-slate-200/80'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:gap-2">
          <button type="button" onClick={goHome} aria-label="SolarSense - go to home" className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group select-none shrink-0 justify-self-start rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:scale-105 transition-transform duration-200 shrink-0">
              <Sun className="w-6 h-6 text-white animate-spin-slow" />
            </div>
            <div className="hidden sm:block leading-tight text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 whitespace-nowrap">Solar<span className="text-emerald-600">Sense</span></span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">AI</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden xl:block whitespace-nowrap">{t('brandSub')}</p>
            </div>
          </button>
          <nav aria-label="Primary" className="hidden lg:flex items-center justify-center gap-1 lg:gap-1.5">
            {navItems.map((item) => (
              <button key={item.key} type="button" onClick={item.action} aria-current={item.active ? 'page' : undefined} className={navLinkClass(item.active)}>
                <item.icon className={`w-4 h-4 shrink-0 ${item.active ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
          <div className="flex items-center justify-end gap-1.5 sm:gap-2 shrink-0">
            <button onClick={toggleLanguage} type="button" aria-label={lang === 'en' ? 'Switch to Hindi' : 'Switch to English'} className="flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors shadow-sm shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500" title="Toggle Language">
              <Globe className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="hidden sm:inline whitespace-nowrap">{lang === 'en' ? 'हिंदी' : 'English'}</span>
            </button>
            <span className="hidden md:block w-px h-6 bg-slate-200" aria-hidden="true" />
            <button onClick={goEstimate} type="button" className="px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md shadow-emerald-600/20 hover:shadow-lg transition-all transform active:scale-95 flex items-center gap-2 whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2">
              <span>{t('calculateFeasibility')}</span>
              <span className="hidden sm:inline" aria-hidden="true">→</span>
            </button>
            <button onClick={() => setMobileOpen((o) => !o)} type="button" aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={mobileOpen} aria-controls="mobile-nav-menu" className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
      {mobileOpen && (
        <div id="mobile-nav-menu" className="lg:hidden border-t border-slate-200/80 bg-white/95 backdrop-blur-md shadow-lg animate-fade-in">
          <nav aria-label="Mobile" className="max-w-7xl mx-auto px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <button key={item.key} type="button" onClick={item.action} aria-current={item.active ? 'page' : undefined} className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${item.active ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700 hover:bg-slate-100'}`}>
                <item.icon className={`w-4 h-4 shrink-0 ${item.active ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            ))}
            <button type="button" onClick={() => go('report')} aria-current={activePage === 'report' ? 'page' : undefined} className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${activePage === 'report' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700 hover:bg-slate-100'}`}>
              <FileText className={`w-4 h-4 shrink-0 ${activePage === 'report' ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span>{t('reportTitle')}</span>
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
