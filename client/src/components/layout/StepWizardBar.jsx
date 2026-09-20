import React from 'react';
import { Zap, Target, Cpu, Map, Layers, FileText, Check } from 'lucide-react';
import { useEstimation } from '../../context/EstimationContext';
import { useLanguage } from '../../context/LanguageContext';

export default function StepWizardBar() {
  const { currentStep, setCurrentStep } = useEstimation();
  const { t } = useLanguage();

  const STEPS = [
    { id: 1, title: t('step1Name'), icon: Zap, desc: t('step1Sub') },
    { id: 2, title: t('step2Name'), icon: Target, desc: t('step2Sub') },
    { id: 3, title: t('step3Name'), icon: Cpu, desc: t('step3Sub') },
    { id: 4, title: t('step4Name'), icon: Map, desc: t('step4Sub') },
    { id: 5, title: t('step5Name'), icon: Layers, desc: t('step5Sub') },
    { id: 6, title: t('step6Name'), icon: FileText, desc: t('step6Sub') },
  ];

  return (
    <div className="w-full bg-white border-b border-slate-200/90 shadow-sm py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Desktop / Tablet Stepper */}
        <div className="hidden md:flex items-center justify-between relative">
          {/* Progress connecting line */}
          <div className="absolute top-1/2 left-6 right-6 -translate-y-1/2 h-1 bg-slate-200 -z-0">
            <div
              className="h-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-400 transition-all duration-500 ease-out"
              style={{
                width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%`
              }}
            />
          </div>

          {STEPS.map((step) => {
            const Icon = step.icon;
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;
            const isUpcoming = currentStep < step.id;

            return (
              <button
                key={step.id}
                onClick={() => {
                  // Allow jumping back to previous completed steps
                  if (step.id < currentStep) {
                    setCurrentStep(step.id);
                  }
                }}
                disabled={isUpcoming}
                className={`relative z-10 flex flex-col items-center group transition-all text-center focus:outline-none ${
                  isUpcoming ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                }`}
              >
                {/* Step Circle */}
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                    isCompleted
                      ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 shadow-md shadow-emerald-500/30'
                      : isCurrent
                      ? 'bg-gradient-to-tr from-emerald-600 to-teal-500 text-white ring-4 ring-emerald-200 scale-110 shadow-lg shadow-emerald-600/30'
                      : 'bg-white text-slate-400 border-2 border-slate-300 group-hover:border-slate-400'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 stroke-[2.5]" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>

                {/* Step Label */}
                <div className="mt-2">
                  <span
                    className={`block text-xs font-bold transition-colors ${
                      isCurrent
                        ? 'text-emerald-800'
                        : isCompleted
                        ? 'text-slate-800'
                        : 'text-slate-400'
                    }`}
                  >
                    {step.title}
                  </span>
                  <span className="block text-[10px] text-slate-400 font-medium">
                    {step.desc}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Mobile Stepper */}
        <div className="md:hidden flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
              {currentStep}
            </div>
            <div>
              <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
                {t('stepOf')} {currentStep} {t('of')} {STEPS.length}
              </p>
              <h3 className="text-sm font-bold text-slate-900">
                {STEPS[currentStep - 1]?.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {STEPS.map((s) => (
              <div
                key={s.id}
                className={`h-2 rounded-full transition-all ${
                  s.id === currentStep
                    ? 'w-6 bg-emerald-600'
                    : s.id < currentStep
                    ? 'w-2 bg-emerald-300'
                    : 'w-2 bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

