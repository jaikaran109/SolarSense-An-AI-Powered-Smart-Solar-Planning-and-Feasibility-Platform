import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    // Navigation
    brandSub: 'Consumption-First Feasibility',
    home: 'Home',
    startEstimation: 'Start Estimation',
    howItWorks: 'How It Works',
    topBrands: 'Top Brands & Roadmap',
    navBrands: 'Top Brands',
    calculateFeasibility: 'Calculate Feasibility',

    // Top Brands & Roadmap Page
    brandsBadge: 'Ranked by 15,000+ Indian Homeowner & EPC Reviews',
    brandsPageTitle: 'Top 10 Solar Panel Companies in India',
    brandsPageSubtitle: 'Compare verified Tier-1 manufacturers by consumer ratings, module technology (TOPCon / Bifacial), warranty claims, and PM Surya Ghar subsidy eligibility.',
    filterAll: 'All Top 10 Brands',
    filterHighRated: 'Highest User Rating (4.7+ ★)',
    filterSmallRoof: 'Best for Small Roofs',
    filterBudget: 'Best Value for Money',
    filterPremium: 'Premium N-Type TOPCon',
    pricePerWattLabel: 'Estimated Panel Cost',
    warrantyLabel: 'Performance Warranty',
    efficiencyLabel: 'Module Efficiency',
    dcrBadge: '100% PM Surya Ghar DCR Eligible',
    requestQuoteBtn: 'Request Direct Quote & Survey',
    checkFeasibilityForBrand: 'Plan System with This Brand',
    userReviewsSummary: 'What Homeowners Say:',
    keyTechnology: 'Key Technology',
    headquarters: 'Headquarters',

    // Installation Roadmap Section
    roadmapTag: 'Actionable Buyer Roadmap',
    roadmapTitle: 'Your 6-Step Installation & Subsidy Roadmap',
    roadmapSubtitle: 'The exact step-by-step process to transition from planning to rooftop power generation and receiving your direct ₹78,000 DBT bank subsidy.',
    roadmapStep1Num: '01',
    roadmapStep1Title: 'Rooftop Feasibility Sizing',
    roadmapStep1Desc: 'Use SolarSense to determine your exact target kW offset, panel count, and satellite clear area before speaking to any salesperson.',
    roadmapStep2Num: '02',
    roadmapStep2Title: 'National Portal Registration',
    roadmapStep2Desc: 'Register on pmsuryaghar.gov.in using your electricity consumer account number and mobile number.',
    roadmapStep3Num: '03',
    roadmapStep3Title: 'DISCOM Technical Feasibility Approval',
    roadmapStep3Desc: 'Your local power distribution company inspects local transformer capacity and issues technical sanction (TFR) within 15 days.',
    roadmapStep4Num: '04',
    roadmapStep4Title: 'Brand & Registered Vendor Selection',
    roadmapStep4Desc: 'Select an ALMM-approved DCR panel brand from the directory and sign an agreement with an empanelled EPC installer.',
    roadmapStep5Num: '05',
    roadmapStep5Title: 'Installation & Net-Meter Setup',
    roadmapStep5Desc: 'The vendor installs structures, panels, inverters, and earthing pits. DISCOM replaces your regular meter with a bidirectional Net-Meter.',
    roadmapStep6Num: '06',
    roadmapStep6Title: 'Commissioning & Direct DBT Subsidy Credit',
    roadmapStep6Desc: 'Vendor uploads commissioning certificate and photos. Central subsidy (up to ₹78,000) is credited directly into your bank account within 30 days.',

    // Quote Modal
    quoteModalTitle: 'Connect with an Authorized EPC Installer for',
    quoteModalSubtitle: 'Receive transparent pricing, structural roof assessment, and full end-to-end subsidy assistance.',
    fullNameLabel: 'Full Name',
    phoneLabel: 'Mobile Phone Number',
    cityStateLabel: 'City & State',
    pincodeLabel: 'Pincode',
    submitQuoteBtn: 'Request Free Site Inspection',
    quoteSuccessMsg: 'Thank you! An authorized partner installer will contact you within 24 hours with a custom layout and price quote.',

    // Hero Section
    platformBadge: 'AI-Powered Smart Solar Planning & Feasibility Platform',
    heroHeadline1: 'Plan Your Solar Roof in ',
    heroHighlight: 'Minutes',
    heroHeadline2: ', Not Weeks.',
    heroSubhead: 'A consumption-first solar feasibility platform. Start with how much electricity you actually want to offset — size your system precisely — and verify your usable rooftop on satellite maps.',
    startFreeCheck: 'Start Free Feasibility Check',
    seeHowItWorks: 'See How It Works',
    badgeFree: '100% Free & Guest Friendly',
    badgeCosting: 'Range-Based Realistic Costing',
    badgeAI: 'Contextual AI Advisor',
    mockupDemand: 'Demand Sizing',
    mockupSystem: '3.2 kW System',
    mockupOffset: 'Offsetting 75% of 420 units/mo',
    mockupRoof: 'Roof Verified',
    mockupArea: '28.4 m² Usable',
    mockupExcluded: 'Excluded tanks & chhajjas',
    mockupPayback: 'Estimated Payback',
    mockupPaybackRange: '4.1 – 5.8 Years',
    mockupSavings: '₹35,200/yr bill savings',

    // Philosophy Section
    diffTag: 'The SolarSense Difference',
    diffTitle: 'Why Consumption-First Instead of Area-First?',
    diffDesc: 'Traditional tools make the mistake of measuring your roof first and assuming you want to cover every square inch. Here is why that fails homeowners:',
    areaFirstTitle: 'Traditional "Area-First" Calculators',
    areaFirst1: 'Assumes 100% roof filling: Forces large, unnecessarily expensive systems regardless of your actual electrical bills.',
    areaFirst2: 'Ignores partial budgets: Does not help homeowners who deliberately want a 50% partial offset to save money upfront.',
    areaFirst3: 'Misleading single price: Shows an unrealistic fixed price that ignores contractor and inverter market variations.',
    consFirstTitle: 'SolarSense "Consumption-First"',
    consFirst1: 'Goal-driven sizing: Starts from your monthly units or bill and computes the exact capacity required for your target offset.',
    consFirst2: 'Map as a feasibility check: Turf.js polygon checks whether your required system physically fits after excluding obstructions.',
    consFirst3: 'Range-based financial honesty: Provides realistic price ranges (₹45k–₹65k/kW) and payback timelines.',

    // Guided 6-Step Journey
    journeyTag: 'Guided 6-Step Journey',
    journeyTitle: 'How SolarSense Evaluates Your Property',
    step1Title: '1. Electricity Demand Input',
    step1Desc: 'Enter your monthly/annual kWh consumption or average electricity bill in ₹.',
    step2Title: '2. Target Coverage Selection',
    step2Desc: 'Compare Full (100%), Partial (50%), or custom offset percentages side-by-side.',
    step3Title: '3. Calculated System Sizing',
    step3Desc: 'Engine calculates required kW capacity, estimated panels, and needed clear roof area in m².',
    step4Title: '4. Satellite Roof Verification',
    step4Desc: 'Search your address, draw polygon over usable roof with Turf.js, excluding water tanks & shading.',
    step5Title: '5. Panel Hardware Selection',
    step5Desc: 'Pick between 330W Poly, 400W Mono, 450W Mono PERC, or 550W Bifacial modules with instant recalculations.',
    step6Title: '6. Report & AI Consultation',
    step6Desc: 'Explore 25-yr spend projections, payback ranges, and ask the AI Solar Assistant any question.',
    launchCTA: 'Launch Solar Estimator Now',

    // Wizard Steps Navigation
    step1Name: 'Consumption',
    step1Sub: 'Units or Monthly Bill',
    step2Name: 'Target Coverage',
    step2Sub: '50% vs 100% Offset',
    step3Name: 'System Sizing',
    step3Sub: 'Calculated kW & Area',
    step4Name: 'Roof Verification',
    step4Sub: 'Satellite Polygon Check',
    step5Name: 'Panel Specs',
    step5Sub: '330W to 550W Models',
    step6Name: 'Report & AI',
    step6Sub: 'Savings & AI Insights',
    stepOf: 'Step',
    of: 'of',
    nextStep: 'Next Step',
    back: 'Back',
    generateReport: 'Generate Final Feasibility Report',

    // Step 1: Consumption Input
    step1Badge: 'Step 1 of 6 • Electricity Demand',
    step1Header: 'How Much Electricity Do You Consume?',
    step1SubHeader: 'Enter your energy metrics below to calculate the exact solar capacity needed to eliminate or reduce your power bills.',
    monthlyUnitsTab: 'Monthly Units (kWh)',
    annualUnitsTab: 'Annual Units (kWh)',
    billAmountTab: 'Monthly Bill (₹)',
    enterUnitsLabel: 'Enter Average Monthly Consumption',
    enterAnnualLabel: 'Enter Annual Electricity Usage',
    enterBillLabel: 'Enter Average Monthly Electricity Bill',
    unitsUnit: 'kWh / month',
    annualUnit: 'kWh / year',
    billUnit: '₹ / month',
    quickPresetsTitle: 'Or select a quick residential profile:',
    preset1: 'Small Flat (1-2 BHK)',
    preset2: 'Standard Home (3 BHK)',
    preset3: 'Large Villa / High AC',
    preset4: 'Heavy Usage (ACs + EV)',
    tariffSettings: 'Advanced: Tariff Rate Settings',
    tariffLabel: 'Electricity Tariff Rate',
    perKWh: '₹ per kWh',

    // Step 2: Target Coverage
    step2Badge: 'Step 2 of 6 • Goal Setting',
    step2Header: 'Choose Your Target Solar Coverage',
    step2SubHeader: 'How much of your monthly power bill do you want to offset? Compare the side-by-side economics before deciding.',
    partial50: '50% Partial Offset',
    partial50Sub: 'Budget Friendly • Fast Payback',
    full100: '100% Net-Zero Offset',
    full100Sub: 'Maximum Bill Elimination',
    customOffset: 'Custom Target Offset',
    customOffsetSub: 'Set your exact percentage',
    recommendedBadge: 'Recommended for High ROI',
    maximumSavingsBadge: 'Maximum Independence',
    annualSavingsLabel: 'Annual Bill Savings',
    systemSizeLabel: 'System Capacity',
    estimatedCostLabel: 'Estimated Turnkey Cost',
    roofAreaLabel: 'Roof Space Needed',
    proceedToSizing: 'Proceed to Sizing',

    // Step 3: System Sizing
    step3Badge: 'Step 3 of 6 • Calculated Sizing',
    step3Header: 'Your Calculated Solar System Specification',
    step3SubHeader: 'Derived purely from your consumption metrics and offset target before measuring the roof.',
    recommendedCapacity: 'Recommended System Capacity',
    targetGenerationLabel: 'Target Annual Generation',
    panelCountLabel: 'Estimated Panel Count',
    minRoofAreaLabel: 'Minimum Usable Roof Required',
    estimatedTurnkeyCost: 'Turnkey Cost Range',
    sizingExplanation: 'This sizing ensures your panels generate enough kWh to meet your target offset without oversized equipment costs.',
    proceedToRoofCheck: 'Proceed to Satellite Roof Verification',

    // Step 4: Roof Verification Map
    step4Badge: 'Step 4 of 6 • Roof Feasibility Check',
    step4Header: 'Verify Usable Roof Area on Map',
    step4SubHeader: 'Search your rooftop and draw a polygon to confirm physical area suitability after excluding water tanks and chhajjas.',
    searchPlaceholder: 'Search address, city, landmark...',
    drawInstruction: 'Click the polygon tool on the map to trace your rooftop perimeter.',
    clearRoofArea: 'Clear Marked Roof Area',
    requiredRoofArea: 'Required Clear Roof Area',
    areaStatusFit: 'Rooftop Area is Sufficient! Your system will fit comfortably.',
    areaStatusShort: 'Marked area is less than required. System capacity may need slight adjustment.',
    proceedToPanels: 'Proceed to Panel Hardware',

    // Step 5: Panel Selection
    step5Badge: 'Step 5 of 6 • Hardware Selection',
    step5Header: 'Select Solar Panel Technology',
    step5SubHeader: 'Choose between standard poly, high-efficiency mono, mono PERC, or bifacial modules with real-time recalculations.',
    poly330: 'Standard Poly 330W',
    mono400: 'High-Efficiency Mono 400W',
    monoPerc450: 'Ultra Mono PERC 450W',
    bifacial550: 'Pro Bifacial TopCon 550W',
    efficiency: 'Efficiency',
    warranty: '25-Year Performance Warranty',
    generateFinalReport: 'Generate Final Feasibility Report',

    // Report Header & Actions
    verifiedAssessment: 'Verified Feasibility Assessment Completed',
    reportTitle: 'Solar Feasibility & Financial Report',
    demandLabel: 'demand',
    roofFootprint: 'roof footprint',
    shareReport: 'Share',
    printReport: 'Print Report',
    newEstimate: 'New Estimate',

    // KPIs
    systemCapacity: 'System Capacity',
    annualGeneration: 'Annual Generation',
    annualSavings: 'Annual Savings',
    turnkeyCost: 'Turnkey Cost Range',
    pmSubsidy: 'PM Surya Ghar Subsidy',
    paybackPeriod: 'Payback Period',
    co2Offset: 'CO₂ Offset',
    treesPlanted: 'Trees Planted',
    perYear: 'per year',
    years: 'years',
    unitsPerYear: 'kWh/year',
    metricTonsYear: 'metric tons/yr',
    treesPerYear: 'trees/year',

    // 25-Year Projection Chart
    projectionsTitle: '25-Year Cumulative Financial Projections',
    projectionsSubtitle: 'Solar Capex + reduced grid bills vs paying 100% utility tariffs escalating at 4% per year.',
    cumSavingsLegend: 'Cumulative Solar Savings (₹)',
    gridSpendLegend: 'Without Solar (Grid Bills)',
    solarSpendLegend: 'With Solar (Capex + Residual Bill)',

    // Loan Calculator
    financingTitle: 'Solar Loan & EMI Financing Calculator',
    financingSubtitle: 'Compare monthly loan payments against electricity bill savings — see why solar pays for itself from Day 1.',
    loanAmount: 'Loan Principal',
    downPayment: 'Down Payment',
    interestRate: 'Interest Rate (p.a.)',
    tenure: 'Loan Tenure',
    months: 'months',
    monthlyEmi: 'Monthly Loan EMI',
    monthlySavings: 'Monthly Solar Savings',
    netMonthlyCashflow: 'Net Monthly Cashflow',
    cashflowPositive: 'Cashflow Positive from Day 1! Your electricity savings exceed the loan installment.',
    totalInterest: 'Total Interest Payable',
    totalLoanCost: 'Total Loan Repayment',

    // Climate & Weather
    climateTitle: 'Regional Solar Climate & Radiation Metrics',
    peakSunHours: 'Peak Sun Hours (PSH)',
    irradianceFactor: 'Annual Irradiance',
    weatherResilience: 'Hail & Wind Certified',
    monsoonReady: 'Monsoon Self-Cleaning',

    // AI Consultant
    assistantTitle: 'SolarSense AI Consultant',
    askAnything: 'Ask any question about solar...',

    // Footer
    footerDesc: 'An AI-powered smart solar planning and feasibility platform built on a consumption-first architecture. Helping homeowners size solar systems to their actual electricity offset goals before verifying physical roof suitability.',
    cleanEnergyTag: 'Clean Energy Accelerator',
    freeSelfService: 'Free & Open Self-Service',
    workflowTitle: 'Platform Workflow',
    assumptionsTitle: 'Baseline Assumptions',
    irradianceAssumption: 'Solar Irradiance:',
    prAssumption: 'System Loss PR:',
    panelFootprintAssumption: 'Rooftop Footprint:',
    turnkeyAssumption: 'Turnkey Cost:',
    escalationAssumption: 'Grid Tariff Escalation:',
    disclaimer: 'Developed for preliminary feasibility estimation. A professional on-site engineering survey is recommended before physical installation.'
  },
  hi: {
    // Navigation
    brandSub: 'खपत-आधारित सौर व्यवहार्यता',
    home: 'मुख्य पृष्ठ',
    startEstimation: 'अनुमान शुरू करें',
    howItWorks: 'यह कैसे काम करता है',
    topBrands: 'शीर्ष कंपनियाँ एवं रोडमैप',
    navBrands: 'टॉप ब्रांड्स',
    calculateFeasibility: 'सोलर रिपोर्ट बनाएं',

    // Top Brands & Roadmap Page
    brandsBadge: '15,000+ भारतीय उपभोक्ताओं व EPC रिव्यूज पर आधारित रैंकिंग',
    brandsPageTitle: 'भारत की शीर्ष 10 सोलर पैनल कंपनियाँ',
    brandsPageSubtitle: 'उपभोक्ता रेटिंग्स, मॉड्यूल तकनीक (TOPCon / Bifacial), वारंटी और PM सूर्य घर योजना सब्सिडी पात्रता के आधार पर शीर्ष निर्माताओं की तुलना करें।',
    filterAll: 'सभी टॉप 10 कंपनियाँ',
    filterHighRated: 'उच्चतम रेटिंग (4.7+ ★)',
    filterSmallRoof: 'छोटी छत के लिए सर्वोत्तम',
    filterBudget: 'किफायती एवं सर्वोत्तम मूल्य',
    filterPremium: 'प्रीमियम N-Type TOPCon',
    pricePerWattLabel: 'अनुमानित पैनल दर',
    warrantyLabel: 'परफॉर्मेंस वारंटी',
    efficiencyLabel: 'मॉड्यूल दक्षता',
    dcrBadge: '100% PM सूर्य घर DCR सब्सिडी योग्य',
    requestQuoteBtn: 'डायरेक्ट कोट व सर्वे का अनुरोध करें',
    checkFeasibilityForBrand: 'इस कंपनी के साथ सिस्टम प्लान करें',
    userReviewsSummary: 'उपभोक्ताओं की समीक्षा:',
    keyTechnology: 'प्रमुख तकनीक',
    headquarters: 'मुख्यालय',

    // Installation Roadmap Section
    roadmapTag: 'सटीक गाइड व रोडमैप',
    roadmapTitle: 'सोलर स्थापना एवं सब्सिडी का 6-चरणीय रोडमैप',
    roadmapSubtitle: 'योजना से लेकर छत पर बिजली उत्पादन और सीधे बैंक खाते में ₹78,000 DBT सब्सिडी पाने की संपूर्ण आधिकारिक प्रक्रिया।',
    roadmapStep1Num: '01',
    roadmapStep1Title: 'छत की व्यवहार्यता व सटीक साइजिंग',
    roadmapStep1Desc: 'किसी भी सेल्सपर्सन से बात करने से पहले सोलर-सेंस द्वारा अपनी बिजली खपत, आवश्यक किलोवाट और उपयोगी क्षेत्रफल की निष्पक्ष जांच करें।',
    roadmapStep2Num: '02',
    roadmapStep2Title: 'राष्ट्रीय पोर्टल पर ऑनलाइन पंजीकरण',
    roadmapStep2Desc: 'अपने बिजली बिल उपभोक्ता क्रमांक और मोबाइल नंबर का उपयोग करके pmsuryaghar.gov.in पोर्टल पर आवेदन दर्ज करें।',
    roadmapStep3Num: '03',
    roadmapStep3Title: 'DISCOM तकनीकी व्यवहार्यता (TFR) स्वीकृति',
    roadmapStep3Desc: 'आपकी स्थानीय बिजली वितरण कंपनी (DISCOM) ट्रांसफार्मर क्षमता की जांच करती है और 15 दिनों में तकनीकी स्वीकृति जारी करती है।',
    roadmapStep4Num: '04',
    roadmapStep4Title: 'ब्रांड एवं पंजीकृत वेंडर (EPC) का चयन',
    roadmapStep4Desc: 'डायरेक्टरी से ALMM-स्वीकृत DCR सोलर पैनल चुनें और पोर्टल पर पंजीकृत अधिकृत EPC वेंडर के साथ अनुबंध करें।',
    roadmapStep5Num: '05',
    roadmapStep5Title: 'स्थापना एवं नेट-मीटर (Net-Meter) लगाना',
    roadmapStep5Desc: 'वेंडर द्वारा माउंटिंग स्ट्रक्चर, पैनल, इन्वर्टर और अर्थिंग लगाई जाती है। DISCOM सामान्य मीटर हटाकर द्विदिशीय (Net-Meter) लगाता है।',
    roadmapStep6Num: '06',
    roadmapStep6Title: 'कमीशनिंग एवं खाते में ₹78,000 DBT सब्सिडी',
    roadmapStep6Desc: 'वेंडर द्वारा कमीशनिंग प्रमाण पत्र अपलोड होने के 30 दिनों के भीतर केंद्र सरकार की सब्सिडी (₹78,000 तक) सीधे आपके बैंक खाते में आ जाती है।',

    // Quote Modal
    quoteModalTitle: 'साइट निरीक्षण एवं कोट प्राप्त करें -',
    quoteModalSubtitle: 'अपने क्षेत्र के अधिकृत EPC पार्टनर्स से वास्तविक ऑन-साइट सर्वे और बेस्ट प्राइस कोटेशन प्राप्त करें।',
    fullNameLabel: 'पूरा नाम',
    phoneLabel: 'मोबाइल नंबर',
    cityStateLabel: 'शहर व राज्य',
    pincodeLabel: 'पिन कोड',
    submitQuoteBtn: 'मुफ्त निरीक्षण कोट सबमिट करें',
    quoteSuccessMsg: 'धन्यवाद! अधिकृत सोलर पार्टनर 24 घंटे के भीतर विस्तृत कोटेशन के साथ आपसे संपर्क करेंगे।',

    // Hero Section
    platformBadge: 'AI-संचालित स्मार्ट सोलर प्लानिंग एवं व्यवहार्यता प्लेटफॉर्म',
    heroHeadline1: 'मिनटों में अपने घर की सोलर छत की योजना बनाएं, ',
    heroHighlight: 'हफ्तों में नहीं',
    heroHeadline2: '।',
    heroSubhead: 'खपत-आधारित आधुनिक सोलर व्यवहार्यता मंच। तय करें कि आप कितनी बिजली बचाना चाहते हैं — सटीक क्षमता चुनें — और सैटेलाइट मैप पर अपनी छत की जांच करें।',
    startFreeCheck: 'मुफ्त सोलर जांच शुरू करें',
    seeHowItWorks: 'यह कैसे काम करता है',
    badgeFree: '100% मुफ्त एवं बिना लॉगिन के उपलब्ध',
    badgeCosting: 'वास्तविक पारदर्शी लागत सीमा',
    badgeAI: 'संदर्भ-जागरूक AI सोलर सलाहकार',
    mockupDemand: 'मांग आधारित साइजिंग',
    mockupSystem: '3.2 kW सिस्टम',
    mockupOffset: '420 यूनिट/माह का 75% ऑफसेट',
    mockupRoof: 'छत सत्यापित',
    mockupArea: '28.4 वर्ग मीटर उपयोगी',
    mockupExcluded: 'पानी की टंकी और शेड छोड़ कर',
    mockupPayback: 'अनुमानित लागत वापसी',
    mockupPaybackRange: '4.1 – 5.8 वर्ष',
    mockupSavings: '₹35,200/वर्ष बिजली बचत',

    // Philosophy Section
    diffTag: 'सोलर-सेंस की विशेषता',
    diffTitle: 'क्षेत्रफल के बजाय खपत-आधारित दृष्टिकोण क्यों?',
    diffDesc: 'पारंपरिक टूल्स पहले पूरी छत को मापते हैं और मान लेते हैं कि आपको हर इंच ढंकना है। जानिए यह क्यों नुकसानदेह है:',
    areaFirstTitle: 'पारंपरिक "क्षेत्रफल-आधारित" कैलकुलेटर',
    areaFirst1: 'पूरी छत भरने की सिफारिश: बिजली की जरूरत के बिना अनावश्यक रूप से भारी और महंगा सिस्टम बनाता है।',
    areaFirst2: 'बजट की अनदेखी: 50% या बजट के अनुसार कम क्षमता लगाने के इच्छुक उपभोक्ताओं के लिए अनुपयुक्त।',
    areaFirst3: 'भ्रामक एकमुश्त कीमत: बाजार और इनवर्टर की वास्तविक कीमतों को नजरअंदाज कर अवास्तविक मूल्य दिखाता है।',
    consFirstTitle: 'सोलर-सेंस "खपत-आधारित" मॉडल',
    consFirst1: 'लक्ष्य-आधारित साइजिंग: आपके मासिक बिल या यूनिट के आधार पर सटीक आवश्यक क्षमता की गणना करता है।',
    consFirst2: 'सत्यापन के रूप में मैप: सैटेलाइट नक्शे पर पॉलीगॉन से जांचता है कि आवश्यक पैनल आपकी छत पर फिट आते हैं या नहीं।',
    consFirst3: 'वास्तविक वित्तीय पारदर्शिता: ₹45,000 - ₹65,000 प्रति किलोवाट की वास्तविक लागत सीमा और पेबैक अवधि दिखाता है।',

    // Guided 6-Step Journey
    journeyTag: '6-चरणीय निर्देशित प्रक्रिया',
    journeyTitle: 'सोलर-सेंस आपकी संपत्ति का मूल्यांकन कैसे करता है',
    step1Title: '1. बिजली खपत का विवरण',
    step1Desc: 'अपने मासिक/वार्षिक यूनिट (kWh) या औसत बिजली बिल (₹) दर्ज करें।',
    step2Title: '2. लक्ष्य कवरेज का चयन',
    step2Desc: '50%, 75% या 100% नेट-जीरो कवरेज की वित्तीय बचत की तुलना करें।',
    step3Title: '3. गणना की गई सिस्टम क्षमता',
    step3Desc: 'सटीक किलोवाट (kW), आवश्यक पैनल संख्या और आवश्यक छत क्षेत्र की गणना।',
    step4Title: '4. सैटेलाइट मैप छत सत्यापन',
    step4Desc: 'सैटेलाइट नक्शे पर अपनी छत मापें और पानी की टंकी या छायादार हिस्से अलग करें।',
    step5Title: '5. पैनल हार्डवेयर का चयन',
    step5Desc: '330W पॉली, 400W मोनो, 450W मोनो पर्क या 550W बाइफेशियल में से चुनें।',
    step6Title: '6. रिपोर्ट एवं AI मार्गदर्शन',
    step6Desc: '25 साल की बचत, पीएम सूर्य घर सब्सिडी और AI सलाहकार से त्वरित समाधान पाएं।',
    launchCTA: 'सोलर अनुमान कैलकुलेटर शुरू करें',

    // Wizard Steps Navigation
    step1Name: 'बिजली खपत',
    step1Sub: 'मासिक यूनिट या बिल',
    step2Name: 'लक्ष्य कवरेज',
    step2Sub: '50% बनाम 100% ऑफसेट',
    step3Name: 'सिस्टम साइजिंग',
    step3Sub: 'आवश्यक kW और क्षेत्रफल',
    step4Name: 'छत का नक्शा',
    step4Sub: 'सैटेलाइट पॉलीगॉन चेक',
    step5Name: 'सोलर पैनल',
    step5Sub: '330W से 550W मॉडल',
    step6Name: 'रिपोर्ट एवं AI',
    step6Sub: 'वित्तीय बचत और सलाह',
    stepOf: 'कदम',
    of: 'का',
    nextStep: 'अगला कदम',
    back: 'पीछे जाएं',
    generateReport: 'अंतिम सोलर रिपोर्ट बनाएं',

    // Step 1: Consumption Input
    step1Badge: 'चरण 1 / 6 • बिजली की मांग',
    step1Header: 'आप कितनी बिजली की खपत करते हैं?',
    step1SubHeader: 'अपने बिजली के आंकड़े दर्ज करें ताकि आपके बिजली बिल को खत्म या कम करने के लिए सटीक सोलर क्षमता की गणना की जा सके।',
    monthlyUnitsTab: 'मासिक यूनिट (kWh)',
    annualUnitsTab: 'वार्षिक यूनिट (kWh)',
    billAmountTab: 'मासिक बिल (₹)',
    enterUnitsLabel: 'औसत मासिक बिजली खपत दर्ज करें',
    enterAnnualLabel: 'वार्षिक बिजली खपत दर्ज करें',
    enterBillLabel: 'औसत मासिक बिजली बिल दर्ज करें',
    unitsUnit: 'यूनिट (kWh) / माह',
    annualUnit: 'यूनिट (kWh) / वर्ष',
    billUnit: '₹ / माह',
    quickPresetsTitle: 'या एक त्वरित आवासीय प्रोफाइल चुनें:',
    preset1: 'छोटा फ्लैट (1-2 BHK)',
    preset2: 'सामान्य घर (3 BHK)',
    preset3: 'बड़ा विला / ज्यादा AC',
    preset4: 'भारी उपयोग (ACs + EV)',
    tariffSettings: 'उन्नत विकल्प: बिजली दर (Tariff) सेटिंग्स',
    tariffLabel: 'बिजली दर (प्रति यूनिट)',
    perKWh: '₹ प्रति kWh',

    // Step 2: Target Coverage
    step2Badge: 'चरण 2 / 6 • लक्ष्य निर्धारण',
    step2Header: 'अपना लक्षित सोलर कवरेज चुनें',
    step2SubHeader: 'आप अपने मासिक बिजली बिल का कितना हिस्सा ऑफसेट करना चाहते हैं? निर्णय लेने से पहले दोनों विकल्पों के वित्तीय लाभ देखें।',
    partial50: '50% आंशिक ऑफसेट',
    partial50Sub: 'कम बजट • त्वरित लागत वापसी',
    full100: '100% नेट-जीरो ऑफसेट',
    full100Sub: 'बिजली बिल से पूर्ण मुक्ति',
    customOffset: 'कस्टम लक्ष्य कवरेज',
    customOffsetSub: 'अपनी पसंद का प्रतिशत चुनें',
    recommendedBadge: 'उच्च ROI के लिए अनुशंसित',
    maximumSavingsBadge: 'अधिकतम ऊर्जा स्वतंत्रता',
    annualSavingsLabel: 'वार्षिक बिजली बिल बचत',
    systemSizeLabel: 'सिस्टम क्षमता',
    estimatedCostLabel: 'अनुमानित कुल लागत',
    roofAreaLabel: 'आवश्यक छत का क्षेत्रफल',
    proceedToSizing: 'सिस्टम साइजिंग पर जाएं',

    // Step 3: System Sizing
    step3Badge: 'चरण 3 / 6 • सिस्टम साइजिंग',
    step3Header: 'आपकी गणना की गई सोलर सिस्टम विशिष्टता',
    step3SubHeader: 'यह विवरण पूरी तरह से आपकी बिजली खपत और चुने गए लक्ष्य ऑफसेट के आधार पर निर्धारित किया गया है।',
    recommendedCapacity: 'अनुशंसित सोलर क्षमता',
    targetGenerationLabel: 'लक्षित वार्षिक उत्पादन',
    panelCountLabel: 'अनुमानित सोलर पैनल संख्या',
    minRoofAreaLabel: 'न्यूनतम उपयोगी छत क्षेत्र',
    estimatedTurnkeyCost: 'अनुमानित लागत सीमा',
    sizingExplanation: 'यह साइजिंग सुनिश्चित करती है कि आपके सोलर पैनल आपके लक्ष्य के अनुसार बिजली पैदा करें और अनावश्यक लागत न आए।',
    proceedToRoofCheck: 'सैटेलाइट छत सत्यापन पर जाएं',

    // Step 4: Roof Verification Map
    step4Badge: 'चरण 4 / 6 • छत सत्यापन जांच',
    step4Header: 'मानचित्र पर उपयोगी छत क्षेत्र सत्यापित करें',
    step4SubHeader: 'अपने पते की खोज करें और छत पर पॉलीगॉन बनाकर सुनिश्चित करें कि पानी की टंकी और शेड छोड़ने के बाद भी पर्याप्त जगह है।',
    searchPlaceholder: 'पता, शहर, लैंडमार्क खोजें...',
    drawInstruction: 'मानचित्र पर पॉलीगॉन टूल पर क्लिक करके अपनी छत की सीमा रेखा बनाएं।',
    clearRoofArea: 'चिह्नित उपयोगी छत क्षेत्र',
    requiredRoofArea: 'आवश्यक छत का क्षेत्रफल',
    areaStatusFit: 'छत का क्षेत्रफल पूरी तरह पर्याप्त है! सोलर सिस्टम आसानी से लग जाएगा।',
    areaStatusShort: 'चिह्नित क्षेत्र आवश्यक क्षेत्रफल से कम है। सिस्टम क्षमता थोड़ी कम करनी पड़ सकती है।',
    proceedToPanels: 'पैनल हार्डवेयर चयन पर जाएं',

    // Step 5: Panel Selection
    step5Badge: 'चरण 5 / 6 • हार्डवेयर चयन',
    step5Header: 'सोलर पैनल तकनीक का चयन करें',
    step5SubHeader: 'पॉली, उच्च दक्षता मोनो, मोनो पर्क, या बाइफेशियल पैनल में से अपनी पसंद चुनें।',
    poly330: 'स्टैंडर्ड पॉली 330W',
    mono400: 'हाई-एफिशिएंसी मोनो 400W',
    monoPerc450: 'अल्ट्रा मोनो पर्क 450W',
    bifacial550: 'प्रो बाइफेशियल TopCon 550W',
    efficiency: 'दक्षता',
    warranty: '25 वर्ष की प्रदर्शन वारंटी',
    generateFinalReport: 'अंतिम सोलर रिपोर्ट बनाएं',

    // Report Header & Actions
    verifiedAssessment: 'सत्यापित सौर व्यवहार्यता मूल्यांकन पूर्ण',
    reportTitle: 'सोलर व्यवहार्यता एवं वित्तीय बचत रिपोर्ट',
    demandLabel: 'मासिक मांग',
    roofFootprint: 'छत का क्षेत्रफल',
    shareReport: 'साझा करें (Share)',
    printReport: 'प्रिंट रिपोर्ट',
    newEstimate: 'नया अनुमान',

    // KPIs
    systemCapacity: 'सिस्टम क्षमता',
    annualGeneration: 'वार्षिक उत्पादन',
    annualSavings: 'वार्षिक बिजली बचत',
    turnkeyCost: 'अनुमानित लागत सीमा',
    pmSubsidy: 'पीएम सूर्य घर सब्सिडी',
    paybackPeriod: 'लागत वापसी (Payback)',
    co2Offset: 'CO₂ प्रदूषण में कमी',
    treesPlanted: 'पेड़ों के बराबर प्रभाव',
    perYear: 'प्रति वर्ष',
    years: 'वर्ष',
    unitsPerYear: 'यूनिट/वर्ष',
    metricTonsYear: 'टन/वर्ष',
    treesPerYear: 'पेड़/वर्ष',

    // 25-Year Projection Chart
    projectionsTitle: '25-वर्षीय संचयी वित्तीय बचत अनुमान',
    projectionsSubtitle: 'सोलर लागत + बचा हुआ ग्रिड बिल बनाम बिना सोलर के 4% वार्षिक महंगाई पर बिजली बिल भुगतान।',
    cumSavingsLegend: 'कुल संचयी बचत (₹)',
    gridSpendLegend: 'बिना सोलर (ग्रिड बिल खर्च)',
    solarSpendLegend: 'सोलर के साथ (लागत + अवशेष बिल)',

    // Loan Calculator
    financingTitle: 'सोलर लोन एवं ईएमआई (EMI) कैलकुलेटर',
    financingSubtitle: 'मासिक ईएमआई की तुलना अपने बिजली बिल की बचत से करें — सोलर पहले ही दिन से अपने पैसे बचाता है।',
    loanAmount: 'ऋण राशि (Loan Principal)',
    downPayment: 'डाउन पेमेंट (Down Payment)',
    interestRate: 'ब्याज दर (प्रति वर्ष)',
    tenure: 'लोन की अवधि',
    months: 'महीने',
    monthlyEmi: 'मासिक ईएमआई (Monthly EMI)',
    monthlySavings: 'मासिक सोलर बचत',
    netMonthlyCashflow: 'शुद्ध मासिक मुनाफा (Net Cashflow)',
    cashflowPositive: 'पहले दिन से ही मुनाफा! आपकी मासिक बिजली बचत लोन ईएमआई से ज्यादा है।',
    totalInterest: 'कुल देय ब्याज',
    totalLoanCost: 'कुल लोन भुगतान',

    // Climate & Weather
    climateTitle: 'क्षेत्रीय सौर विकिरण एवं मौसम विश्लेषण',
    peakSunHours: 'दैनिक धूप के घंटे (Peak Sun Hours)',
    irradianceFactor: 'वार्षिक सौर विकिरण',
    weatherResilience: 'ओलावृष्टि एवं तूफान रोधी',
    monsoonReady: 'मानसून में स्वतः सफाई',

    // AI Consultant
    assistantTitle: 'सोलर एडवाइजर AI चैटबॉट',
    askAnything: 'सोलर से संबंधित कोई भी प्रश्न पूछें...',

    // Footer
    footerDesc: 'AI-संचालित स्मार्ट सोलर प्लानिंग एवं व्यवहार्यता प्लेटफॉर्म। जो छत नापने से पहले आपकी वास्तविक बिजली बचत और खपत के अनुसार सोलर सिस्टम की गणना करता है।',
    cleanEnergyTag: 'स्वच्छ ऊर्जा प्रोत्साहन',
    freeSelfService: 'निःशुल्क एवं पारदर्शी सेवा',
    workflowTitle: 'प्रक्रिया के चरण',
    assumptionsTitle: 'प्रमुख तकनीकी मानक',
    irradianceAssumption: 'सौर विकिरण:',
    prAssumption: 'सिस्टम दक्षता (PR):',
    panelFootprintAssumption: 'पैनल क्षेत्रफल:',
    turnkeyAssumption: 'टर्नकी लागत:',
    escalationAssumption: 'बिजली दर वृद्धि दर:',
    disclaimer: 'यह प्रारंभिक व्यवहार्यता विश्लेषण के लिए विकसित किया गया है। वास्तविक स्थापना से पूर्व ऑन-साइट इंजीनियरिंग सर्वे अनुशंसित है।'
  }
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('solarsense_lang') || 'en';
  });

  const toggleLanguage = () => {
    const nextLang = lang === 'en' ? 'hi' : 'en';
    setLang(nextLang);
    localStorage.setItem('solarsense_lang', nextLang);
  };

  const t = (key) => {
    return translations[lang]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
