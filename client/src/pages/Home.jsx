import React from 'react';
import {
  Sun,
  Zap,
  Target,
  MapPin,
  TrendingUp,
  Bot,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Layers,
  Award,
  ChevronRight,
  Leaf,
  Clock,
  Compass
} from 'lucide-react';
import { useEstimation } from '../context/EstimationContext';
import { useLanguage } from '../context/LanguageContext';

export default function Home({ onStartEstimate }) {
  const { resetFlow } = useEstimation();
  const { t, lang } = useLanguage();

  const journeySteps = [
    {
      step: '01',
      title: t('step1Title'),
      desc: t('step1Desc'),
      icon: Zap
    },
    {
      step: '02',
      title: t('step2Title'),
      desc: t('step2Desc'),
      icon: Target
    },
    {
      step: '03',
      title: t('step3Title'),
      desc: t('step3Desc'),
      icon: Sun
    },
    {
      step: '04',
      title: t('step4Title'),
      desc: t('step4Desc'),
      icon: MapPin
    },
    {
      step: '05',
      title: t('step5Title'),
      desc: t('step5Desc'),
      icon: Layers
    },
    {
      step: '06',
      title: t('step6Title'),
      desc: t('step6Desc'),
      icon: Bot
    }
  ];

  return (
    <div className="animate-fade-in overflow-hidden">
      {/* 1. Hero Section */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-32 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50">
        {/* Background ambient lighting effects */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-emerald-200/30 blur-[130px] rounded-full pointer-events-none -z-0" />
        <div className="absolute top-40 right-10 w-[400px] h-[300px] bg-teal-200/20 blur-[100px] rounded-full pointer-events-none -z-0" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-extrabold uppercase tracking-wider mb-6 shadow-sm">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>{t('platformBadge')}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
              {t('heroHeadline1')}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-700">
                {t('heroHighlight')}
              </span>
              {t('heroHeadline2')}
            </h1>

            {/* Subhead */}
            <p className="text-base sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal mb-8">
              {t('heroSubhead')}
            </p>

            {/* CTA Group */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => {
                  resetFlow();
                  onStartEstimate();
                }}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-xl shadow-emerald-600/30 hover:shadow-2xl transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-3 group"
              >
                <span>{t('startFreeCheck')}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('how-it-works');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-6 py-4 rounded-2xl text-base font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-colors shadow-sm"
              >
                {t('seeHowItWorks')}
              </button>
            </div>

            {/* Trust Markers */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 mt-8 pt-6 border-t border-slate-200/60 max-w-xl mx-auto">
              <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {t('badgeFree')}
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {t('badgeCosting')}
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {t('badgeAI')}
              </span>
            </div>
          </div>

          {/* 2. Interactive Mockup Showcase Hero Graphic */}
          <div className="max-w-5xl mx-auto rounded-3xl p-3 sm:p-5 bg-gradient-to-b from-slate-200/60 to-slate-300/30 backdrop-blur-md shadow-2xl border border-slate-200">
            <div className="rounded-2xl bg-white overflow-hidden border border-slate-200 shadow-inner">
              {/* Fake Browser Toolbar */}
              <div className="px-4 py-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <div className="px-4 py-1 rounded-full bg-white text-[11px] font-mono text-slate-500 border border-slate-200">
                  solarsense.ai/feasibility-report/sample
                </div>
                <div className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> AI Engine Live
                </div>
              </div>

              {/* Preview Dashboard Snapshot */}
              <div className="p-6 sm:p-8 bg-slate-50 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">{t('mockupDemand')}</span>
                  <span className="text-2xl font-black text-slate-900 block mt-1">{t('mockupSystem')}</span>
                  <span className="text-xs text-emerald-600 font-semibold block mt-1">{t('mockupOffset')}</span>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">{t('mockupRoof')}</span>
                  <span className="text-2xl font-black text-emerald-700 block mt-1">{t('mockupArea')}</span>
                  <span className="text-xs text-slate-500 font-medium block mt-1">{t('mockupExcluded')}</span>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">{t('mockupPayback')}</span>
                  <span className="text-2xl font-black text-amber-600 block mt-1">{t('mockupPaybackRange')}</span>
                  <span className="text-xs text-slate-500 font-medium block mt-1">{t('mockupSavings')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Core Philosophy: Why Consumption-First? */}
      <section className="py-16 sm:py-24 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              {t('diffTag')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
              {t('diffTitle')}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              {t('diffDesc')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* The Flawed Area-First Model */}
            <div className="p-6 sm:p-8 rounded-3xl bg-rose-50/50 border-2 border-rose-200 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-lg">
                  ✕
                </div>
                <h3 className="text-xl font-black text-rose-900">{t('areaFirstTitle')}</h3>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">•</span>
                  <span>{t('areaFirst1')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">•</span>
                  <span>{t('areaFirst2')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">•</span>
                  <span>{t('areaFirst3')}</span>
                </li>
              </ul>
            </div>

            {/* The SolarSense Consumption-First Model */}
            <div className="p-6 sm:p-8 rounded-3xl bg-emerald-50/70 border-2 border-emerald-500 shadow-lg shadow-emerald-500/10 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg">
                  ✓
                </div>
                <h3 className="text-xl font-black text-emerald-950">{t('consFirstTitle')}</h3>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>{t('consFirst1')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>{t('consFirst2')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>{t('consFirst3')}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Step-by-Step Flow: How It Works */}
      <section id="how-it-works" className="py-16 sm:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-extrabold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              {t('journeyTag')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
              {t('journeyTitle')}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {journeySteps.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-black text-slate-300 font-mono">
                        {item.step}
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h4>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <div className="mt-12 text-center">
            <button
              onClick={() => {
                resetFlow();
                onStartEstimate();
              }}
              className="px-8 py-4 rounded-2xl text-base font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-xl shadow-emerald-600/25 transition-all inline-flex items-center gap-3"
            >
              <span>{t('launchCTA')}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* 5. Feature Banner: Top Solar Panel Brands & Installation Roadmap */}
      <section className="py-16 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white relative overflow-hidden border-t border-slate-800">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 bg-white/5 border border-white/10 rounded-3xl p-8 sm:p-12 backdrop-blur-md">
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
                <Award className="w-4 h-4" />
                <span>{lang === 'hi' ? 'विशेष गाइड और रैंकिंग' : 'Buyer Guide & Brand Rankings'}</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                {lang === 'hi'
                  ? 'सोलर लगाने का फैसला कर लिया? जानिए भारत की शीर्ष 10 कंपनियाँ'
                  : 'Decided to Go Solar? Explore India’s Top 10 Rated Brands & Roadmap'}
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {lang === 'hi'
                  ? 'टाटा सोलर, वारी, अडानी सहित टॉप निर्माताओं की रेटिंग्स, DCR/ALMM सब्सिडी पात्रता और राष्ट्रीय पोर्टल से ₹78,000 डायरेक्ट सब्सिडी पाने का 6-चरणीय रोडमैप देखें।'
                  : 'Compare real user ratings, TOPCon / Bifacial efficiencies, warranty terms, and follow our actionable 6-Step National Portal & DISCOM Roadmap for direct ₹78,000 PM Surya Ghar subsidy.'}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-2">
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  {lang === 'hi' ? 'सत्यापित यूजर रिव्यूज' : 'Verified Reviews & Specs'}
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-teal-400" />
                  {lang === 'hi' ? '6-चरणीय स्थापना रोडमैप' : '6-Step Direct DBT Roadmap'}
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  {lang === 'hi' ? 'मुफ्त साइट निरीक्षण कोट' : 'Free EPC Site Inspection'}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full sm:w-auto shrink-0">
              <button
                onClick={() => onExploreBrands && onExploreBrands()}
                className="px-8 py-4 rounded-2xl font-black text-sm text-slate-900 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2 group transform active:scale-95"
              >
                <Award className="w-5 h-5 text-slate-900" />
                <span>{lang === 'hi' ? 'टॉप कंपनियाँ और रोडमैप देखें' : 'Explore Top Brands & Roadmap'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onStartEstimate()}
                className="px-8 py-4 rounded-2xl font-bold text-sm text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all flex items-center justify-center gap-2"
              >
                <span>{lang === 'hi' ? 'पहले छत का विश्लेषण करें' : 'Calculate Feasibility First'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
