import React, { useState } from 'react';
import {
  Award,
  Star,
  ShieldCheck,
  Zap,
  TrendingUp,
  ExternalLink,
  PhoneCall,
  CheckCircle2,
  Filter,
  ArrowRight,
  Sun,
  Compass,
  FileCheck,
  Building,
  Layers,
  MapPin,
  Sparkles,
  Info,
  X,
  Send,
  HelpCircle
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const TOP_SOLAR_BRANDS = [
  {
    id: 'tata-power',
    rank: 1,
    name: 'Tata Power Solar',
    rating: 4.8,
    reviewsCount: '4,850+ reviews',
    badge: '#1 Most Trusted Brand',
    tier: 'Tier-1 Legacy Leader',
    hq: 'Mumbai, Maharashtra',
    topModels: 'TP Series Mono PERC & Polycrystalline',
    efficiency: '20.8% – 21.6%',
    pricePerWatt: '₹32 – ₹42 / Watt',
    warranty: '12 Yr Product • 25 Yr Performance (85%)',
    dcrCompliant: true,
    bestFor: 'High reliability, long-term peace of mind, seamless warranty claims',
    pros: [
      'Largest service and technician network across all Indian states',
      'Extremely high brand trust and reliable 25-year warranty fulfillment',
      'Official partner for major DISCOM utility programs & rapid net-metering'
    ],
    cons: 'Slightly higher initial investment compared to smaller regional players.',
    userReviewQuote: '“Installed a 5kW Tata system in Pune. Generation is 22-25 units daily. Zero maintenance issues over 3 years.”',
    category: ['all', 'high-rated', 'budget', 'premium']
  },
  {
    id: 'waaree',
    rank: 2,
    name: 'Waaree Energies',
    rating: 4.7,
    reviewsCount: '5,200+ reviews',
    badge: 'India’s Largest Manufacturer',
    tier: 'Tier-1 High Volume',
    hq: 'Mumbai, Maharashtra',
    topModels: 'Arka & Elite Series (N-Type TOPCon / Bifacial)',
    efficiency: '21.5% – 22.8%',
    pricePerWatt: '₹28 – ₹36 / Watt',
    warranty: '12 Yr Product • 30 Yr Performance (Bifacial)',
    dcrCompliant: true,
    bestFor: 'Best balance of modern TOPCon efficiency, price, and instant availability',
    pros: [
      'Huge 12 GW+ annual manufacturing capacity with modules up to 670W',
      'Fastest subsidy registration on the PM Surya Ghar national portal',
      'High temperature tolerance for hot northern & western Indian summers'
    ],
    cons: 'High market demand can lead to occasional lead times on specific TOPCon models.',
    userReviewQuote: '“Got Waaree Bifacial panels for my 3kW Delhi setup. Generates solid units even during dusty summer days.”',
    category: ['all', 'high-rated', 'premium', 'budget']
  },
  {
    id: 'adani-solar',
    rank: 3,
    name: 'Adani Solar (Mundra Solar)',
    rating: 4.6,
    reviewsCount: '3,400+ reviews',
    badge: 'Heavy-Duty Climate Durability',
    tier: 'Tier-1 Vertically Integrated',
    hq: 'Ahmedabad, Gujarat',
    topModels: 'Elan & Eternal Series (Bifacial Glass-Glass)',
    efficiency: '21.2% – 22.3%',
    pricePerWatt: '₹30 – ₹38 / Watt',
    warranty: '12 Yr Product • 25 Yr Performance (84.8%)',
    dcrCompliant: true,
    bestFor: 'Hot desert, coastal, and high wind velocity regions',
    pros: [
      'India’s first vertically integrated GW-scale cell & module plant',
      'Superior PID (Potential Induced Degradation) resistance & low degradation rate',
      'Heavy-duty frames certified for 5400 Pa mechanical and wind loads'
    ],
    cons: 'Focuses primarily on large residential & commercial projects through authorized EPCs.',
    userReviewQuote: '“Heavy-duty build. Withstood severe Gujarat monsoon storms without a scratch. Excellent generation.”',
    category: ['all', 'high-rated', 'premium']
  },
  {
    id: 'loom-solar',
    rank: 4,
    name: 'Loom Solar',
    rating: 4.7,
    reviewsCount: '3,900+ reviews',
    badge: 'Best for Small & Shaded Roofs',
    tier: 'D2C Residential Pioneer',
    hq: 'Faridabad, Haryana',
    topModels: 'Shark 450W / 550W (Bifacial Mono PERC)',
    efficiency: '21.8% – 22.5%',
    pricePerWatt: '₹36 – ₹46 / Watt',
    warranty: '10 Yr Product • 25 Yr Performance',
    dcrCompliant: true,
    bestFor: 'Urban homes, villas with limited roof space, and low-light areas',
    pros: [
      'Pioneered super high-efficiency residential bifacial modules in India',
      'Generates up to 25% extra power from rear reflection on white rooftops',
      'Direct doorstep delivery and excellent digital customer support'
    ],
    cons: 'Slight price premium per watt due to high-efficiency bifacial technology.',
    userReviewQuote: '“My roof was small with a water tank shadow. Loom Shark panels still give full 4 units/kW daily.”',
    category: ['all', 'high-rated', 'small-roof', 'premium']
  },
  {
    id: 'vikram-solar',
    rank: 5,
    name: 'Vikram Solar',
    rating: 4.6,
    reviewsCount: '2,800+ reviews',
    badge: 'Proven Longevity & Low Degradation',
    tier: 'Tier-1 International Exporter',
    hq: 'Kolkata, West Bengal',
    topModels: 'Somera & Preva Series (Half-Cut Mono PERC)',
    efficiency: '21.0% – 21.9%',
    pricePerWatt: '₹30 – ₹37 / Watt',
    warranty: '12 Yr Product • 25 Yr Performance',
    dcrCompliant: true,
    bestFor: 'High humidity, coastal areas, and long-term durability',
    pros: [
      'PVEL top performer for 5 consecutive years in global reliability testing',
      'Superior anti-reflective and self-cleaning coating reducing dust losses',
      'Strong distributor network across eastern and southern India'
    ],
    cons: 'Fewer direct retail stores; mainly available through registered EPC partners.',
    userReviewQuote: '“Installer recommended Vikram Solar Somera 450W. Running 2 years with zero degradation.”',
    category: ['all', 'high-rated', 'budget']
  },
  {
    id: 'goldi-solar',
    rank: 6,
    name: 'Goldi Solar',
    rating: 4.5,
    reviewsCount: '2,100+ reviews',
    badge: 'Best Value for Money',
    tier: 'Tier-1 Cost Leader',
    hq: 'Surat, Gujarat',
    topModels: 'Goldi HELOC Plus Series (Mono PERC)',
    efficiency: '20.6% – 21.4%',
    pricePerWatt: '₹27 – ₹34 / Watt',
    warranty: '12 Yr Product • 25 Yr Performance (83.5%)',
    dcrCompliant: true,
    bestFor: 'Cost-conscious homeowners wanting solid tier-1 engineering without paying brand premiums',
    pros: [
      'Very competitive pricing per watt with solid German engineering standards',
      'Fast delivery and easy availability of DCR panels for subsidy claiming',
      'Robust IP68 junction boxes with high bypass diode protection'
    ],
    cons: 'Lower brand recall among retail users compared to Tata or Adani.',
    userReviewQuote: '“Very economical yet high performance. My 3.3 kW setup cost was ₹30k lower with identical output.”',
    category: ['all', 'budget']
  },
  {
    id: 'premier-energies',
    rank: 7,
    name: 'Premier Energies',
    rating: 4.6,
    reviewsCount: '1,950+ reviews',
    badge: 'Next-Gen N-Type TOPCon Cells',
    tier: 'State-of-the-Art Technology',
    hq: 'Hyderabad, Telangana',
    topModels: 'Premier N-Type TOPCon Bi-Glass Series',
    efficiency: '22.4% – 23.0%',
    pricePerWatt: '₹29 – ₹36 / Watt',
    warranty: '12 Yr Product • 30 Yr Performance',
    dcrCompliant: true,
    bestFor: 'Modern villas and homeowners wanting maximum kWh generation per square foot',
    pros: [
      'Advanced 22.8%+ conversion efficiency TOPCon cells manufactured in Hyderabad',
      'Exceptional performance under cloudy skies and diffused morning light',
      'Aesthetic all-black frames available for modern architectural rooftops'
    ],
    cons: 'Brand is expanding retail awareness rapidly, primarily strong in South/West India.',
    userReviewQuote: '“Premier TOPCon modules look gorgeous on our terrace and start generating power from 6:30 AM.”',
    category: ['all', 'high-rated', 'premium', 'small-roof']
  },
  {
    id: 'renewsys-solar',
    rank: 8,
    name: 'RenewSys Solar',
    rating: 4.5,
    reviewsCount: '1,600+ reviews',
    badge: 'Total Component Reliability',
    tier: 'Integrated Component Specialist',
    hq: 'Mumbai, Maharashtra (Plant in Hyderabad & Bengaluru)',
    topModels: 'DESERV Series (Mono PERC & Poly)',
    efficiency: '20.4% – 21.3%',
    pricePerWatt: '₹28 – ₹35 / Watt',
    warranty: '10 Yr Product • 25 Yr Performance',
    dcrCompliant: true,
    bestFor: 'Zero delamination risk and industrial-grade encapsulant reliability',
    pros: [
      'Only Indian manufacturer producing cells, EVA encapsulant sheets, and backsheets in-house',
      'Zero risk of cell delamination or yellowing over 25+ years of intense sun exposure',
      'Strict quality controls certified by UL and TUV Rheinland'
    ],
    cons: 'Smaller consumer advertising presence; primarily sold through engineering contractors.',
    userReviewQuote: '“Installed in coastal Visakhapatnam. No corrosion or moisture ingress even after heavy monsoons.”',
    category: ['all', 'budget']
  },
  {
    id: 'saatvik-green',
    rank: 9,
    name: 'Saatvik Green Energy',
    rating: 4.4,
    reviewsCount: '1,450+ reviews',
    badge: 'North India Leader',
    tier: 'High Power Density',
    hq: 'Gurugram, Haryana (Plant in Ambala)',
    topModels: 'Saatvik Mono PERC 540W / 550W',
    efficiency: '20.8% – 21.6%',
    pricePerWatt: '₹27 – ₹33 / Watt',
    warranty: '12 Yr Product • 25 Yr Performance',
    dcrCompliant: true,
    bestFor: 'Residential & commercial setups in Delhi-NCR, Haryana, Punjab, and UP',
    pros: [
      'High power density modules requiring fewer mounting clamps and structures',
      'Strong presence in northern India with fast local delivery',
      'Competitive turnkey pricing with certified local EPC installers'
    ],
    cons: 'Relatively newer brand compared to 30-year legacy players.',
    userReviewQuote: '“Great output in Haryana heat. 4kW setup easily powers 2 ACs all day during summer.”',
    category: ['all', 'budget']
  },
  {
    id: 'servotech',
    rank: 10,
    name: 'Servotech Power Systems',
    rating: 4.4,
    reviewsCount: '1,800+ reviews',
    badge: 'Complete Inverter + Panel Ecosystem',
    tier: 'Integrated Power Solutions',
    hq: 'New Delhi',
    topModels: 'Servotech High-Efficiency Mono Series',
    efficiency: '20.2% – 21.1%',
    pricePerWatt: '₹26 – ₹32 / Watt',
    warranty: '10 Yr Product • 25 Yr Performance',
    dcrCompliant: true,
    bestFor: 'Homeowners looking for seamless single-brand solar panel + hybrid inverter combo',
    pros: [
      'One-stop solution for panels, on-grid inverters, and battery storage setups',
      'Extensive service coverage in Tier-2 and Tier-3 towns',
      'Affordable entry price for first-time solar adopters'
    ],
    cons: 'Module efficiency is slightly lower than cutting-edge N-Type TOPCon options.',
    userReviewQuote: '“Combined Servotech 3kW inverter and panels. Single technician handled everything smoothly.”',
    category: ['all', 'budget']
  }
];

export default function TopBrands({ onStartEstimate }) {
  const { t, lang } = useLanguage();
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedBrandForQuote, setSelectedBrandForQuote] = useState(null);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);
  const [quoteForm, setQuoteForm] = useState({
    name: '',
    phone: '',
    city: '',
    pincode: '',
    systemKW: '3.0'
  });

  const filteredBrands = TOP_SOLAR_BRANDS.filter(brand => {
    if (activeFilter === 'all') return true;
    return brand.category.includes(activeFilter);
  });

  const handleOpenQuoteModal = (brand) => {
    setSelectedBrandForQuote(brand);
    setQuoteSubmitted(false);
    setIsQuoteModalOpen(true);
  };

  const handleQuoteSubmit = (e) => {
    e.preventDefault();
    setQuoteSubmitted(true);
    setTimeout(() => {
      setIsQuoteModalOpen(false);
      setQuoteSubmitted(false);
    }, 2500);
  };

  const roadmapSteps = [
    {
      num: t('roadmapStep1Num'),
      title: t('roadmapStep1Title'),
      desc: t('roadmapStep1Desc'),
      icon: Zap,
      actionText: t('startFreeCheck'),
      action: onStartEstimate
    },
    {
      num: t('roadmapStep2Num'),
      title: t('roadmapStep2Title'),
      desc: t('roadmapStep2Desc'),
      icon: Building,
      badge: 'pm-suryaghar.gov.in'
    },
    {
      num: t('roadmapStep3Num'),
      title: t('roadmapStep3Title'),
      desc: t('roadmapStep3Desc'),
      icon: FileCheck,
      badge: 'Within 15 Days'
    },
    {
      num: t('roadmapStep4Num'),
      title: t('roadmapStep4Title'),
      desc: t('roadmapStep4Desc'),
      icon: ShieldCheck,
      badge: 'ALMM & DCR Approved'
    },
    {
      num: t('roadmapStep5Num'),
      title: t('roadmapStep5Title'),
      desc: t('roadmapStep5Desc'),
      icon: Sun,
      badge: 'Net-Meter Sync'
    },
    {
      num: t('roadmapStep6Num'),
      title: t('roadmapStep6Title'),
      desc: t('roadmapStep6Desc'),
      icon: TrendingUp,
      badge: '₹78,000 Direct DBT Credit'
    }
  ];

  return (
    <div className="animate-fade-in bg-slate-50 min-h-screen pb-20">
      {/* 1. Header Banner */}
      <section className="relative pt-10 pb-16 lg:pt-16 lg:pb-24 bg-gradient-to-b from-emerald-950 via-slate-900 to-slate-900 text-white overflow-hidden">
        {/* Glow accents */}
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-900/60 border border-emerald-700/60 text-emerald-300 text-xs font-extrabold uppercase tracking-wider mb-4 shadow-sm">
            <Award className="w-4 h-4 text-emerald-400" />
            <span>{t('brandsBadge')}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight max-w-4xl mx-auto">
            {t('brandsPageTitle')}
          </h1>

          <p className="text-sm sm:text-lg text-slate-300 max-w-3xl mx-auto mt-4 leading-relaxed">
            {t('brandsPageSubtitle')}
          </p>

          {/* Quick Stats Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto mt-10 pt-8 border-t border-slate-800 text-left">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Central Subsidy</span>
              <span className="text-xl sm:text-2xl font-black text-emerald-400 mt-0.5 block">Up to ₹78,000</span>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Direct Bank DBT Credit</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Warranty Standard</span>
              <span className="text-xl sm:text-2xl font-black text-white mt-0.5 block">25 – 30 Years</span>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Linear Power Output</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">DCR Compliance</span>
              <span className="text-xl sm:text-2xl font-black text-teal-300 mt-0.5 block">100% ALMM</span>
              <span className="text-[10px] text-slate-400 mt-0.5 block">MNRE Approved</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Average Payback</span>
              <span className="text-xl sm:text-2xl font-black text-amber-400 mt-0.5 block">3.2 – 4.8 Yrs</span>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Accelerated ROI</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Filter Bar */}
      <section className="sticky top-16 sm:top-20 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 py-3 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 overflow-x-auto no-scrollbar py-1">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Filter className="w-4 h-4 text-slate-400 hidden sm:inline" />
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeFilter === 'all'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {t('filterAll')}
              </button>

              <button
                onClick={() => setActiveFilter('high-rated')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeFilter === 'high-rated'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {t('filterHighRated')}
              </button>

              <button
                onClick={() => setActiveFilter('small-roof')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeFilter === 'small-roof'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {t('filterSmallRoof')}
              </button>

              <button
                onClick={() => setActiveFilter('budget')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeFilter === 'budget'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {t('filterBudget')}
              </button>

              <button
                onClick={() => setActiveFilter('premium')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeFilter === 'premium'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {t('filterPremium')}
              </button>
            </div>

            <button
              onClick={onStartEstimate}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-sm transition-all whitespace-nowrap flex items-center gap-1.5"
            >
              <span>{t('calculateFeasibility')}</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </section>

      {/* 3. Top 10 Ranked Companies Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="space-y-6">
          {filteredBrands.map((brand) => (
            <div
              key={brand.id}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all group"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
                {/* Brand Header & Rank */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex flex-col items-center justify-center font-black shadow-md shrink-0">
                    <span className="text-[10px] uppercase font-bold text-emerald-200">RANK</span>
                    <span className="text-xl leading-none">#{brand.rank}</span>
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {brand.name}
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {brand.badge}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1 text-amber-600 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        {brand.rating} / 5.0
                      </span>
                      <span>•</span>
                      <span>{brand.reviewsCount}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-slate-600">
                        <MapPin className="w-3 h-3 text-slate-400" /> {brand.hq}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Quick Badges */}
                <div className="flex flex-wrap items-center gap-2 self-start lg:self-center">
                  <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{t('dcrBadge')}</span>
                  </div>
                </div>
              </div>

              {/* Specs & Performance Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-5 border-b border-slate-100 text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 font-semibold block uppercase tracking-wider text-[10px]">
                    {t('keyTechnology')}
                  </span>
                  <span className="font-bold text-slate-800 mt-1 block">
                    {brand.topModels}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 font-semibold block uppercase tracking-wider text-[10px]">
                    {t('efficiencyLabel')}
                  </span>
                  <span className="font-bold text-emerald-700 mt-1 block text-sm">
                    {brand.efficiency}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 font-semibold block uppercase tracking-wider text-[10px]">
                    {t('pricePerWattLabel')}
                  </span>
                  <span className="font-black text-slate-900 mt-1 block text-sm">
                    {brand.pricePerWatt}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 font-semibold block uppercase tracking-wider text-[10px]">
                    {t('warrantyLabel')}
                  </span>
                  <span className="font-bold text-slate-800 mt-1 block">
                    {brand.warranty}
                  </span>
                </div>
              </div>

              {/* Review Highlights & Pros */}
              <div className="pt-5 grid grid-cols-1 lg:grid-cols-3 gap-5 items-center">
                <div className="lg:col-span-2 space-y-2 text-xs">
                  <span className="font-bold text-slate-700 block uppercase tracking-wider text-[11px]">
                    {t('userReviewsSummary')}
                  </span>
                  <ul className="space-y-1.5 text-slate-600">
                    {brand.pros.map((pro, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>

                  <p className="italic text-slate-500 pt-1 text-[11px] bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                    {brand.userReviewQuote}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 justify-center">
                  <button
                    onClick={() => handleOpenQuoteModal(brand)}
                    className="w-full px-5 py-3 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>{t('requestQuoteBtn')}</span>
                  </button>

                  <button
                    onClick={onStartEstimate}
                    className="w-full px-5 py-3 rounded-xl font-bold text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{t('checkFeasibilityForBrand')}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Actionable 6-Step Installation Roadmap Guide */}
      <section className="bg-slate-900 text-white py-16 sm:py-24 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 bg-emerald-950 px-3.5 py-1.5 rounded-full border border-emerald-800">
              {t('roadmapTag')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mt-3">
              {t('roadmapTitle')}
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2">
              {t('roadmapSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roadmapSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={idx}
                  className="bg-slate-800/80 p-6 sm:p-7 rounded-3xl border border-slate-700/80 shadow-lg flex flex-col justify-between relative overflow-hidden group hover:border-emerald-500/60 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-3xl font-black text-slate-600 font-mono">
                        {step.num}
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>

                    <h4 className="text-lg font-bold text-white mb-2">{step.title}</h4>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{step.desc}</p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-700/60 flex items-center justify-between">
                    {step.badge && (
                      <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-800">
                        {step.badge}
                      </span>
                    )}
                    {step.actionText && (
                      <button
                        onClick={step.action}
                        className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 underline"
                      >
                        {step.actionText} →
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Launch Banner */}
          <div className="mt-14 p-8 rounded-3xl bg-gradient-to-r from-emerald-900 to-teal-900 border border-emerald-700/50 text-center max-w-3xl mx-auto shadow-2xl">
            <h3 className="text-2xl font-black text-white">Ready to Start Step 1?</h3>
            <p className="text-slate-300 text-sm mt-1 max-w-xl mx-auto">
              Size your rooftop system accurately with SolarSense before reaching out to any contractor.
            </p>
            <button
              onClick={onStartEstimate}
              className="mt-6 px-8 py-3.5 rounded-2xl font-bold text-slate-900 bg-white hover:bg-emerald-50 shadow-xl transition-all inline-flex items-center gap-2 text-sm"
            >
              <span>{t('startFreeCheck')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 5. Request Quote / Site Inspection Modal */}
      {isQuoteModalOpen && selectedBrandForQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setIsQuoteModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {quoteSubmitted ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-slate-900">Request Received!</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {t('quoteSuccessMsg')}
                </p>
              </div>
            ) : (
              <form onSubmit={handleQuoteSubmit} className="space-y-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                    Official EPC Lead Connect
                  </span>
                  <h3 className="text-xl font-black text-slate-900 mt-0.5">
                    {t('quoteModalTitle')} {selectedBrandForQuote.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {t('quoteModalSubtitle')}
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">{t('fullNameLabel')}</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rajesh Sharma"
                      value={quoteForm.name}
                      onChange={e => setQuoteForm({ ...quoteForm, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">{t('phoneLabel')}</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={quoteForm.phone}
                      onChange={e => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">{t('cityStateLabel')}</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Pune, MH"
                        value={quoteForm.city}
                        onChange={e => setQuoteForm({ ...quoteForm, city: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">{t('pincodeLabel')}</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 411001"
                        value={quoteForm.pincode}
                        onChange={e => setQuoteForm({ ...quoteForm, pincode: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{t('submitQuoteBtn')}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
