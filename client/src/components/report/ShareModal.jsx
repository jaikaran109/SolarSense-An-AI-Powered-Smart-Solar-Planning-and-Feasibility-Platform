import React, { useState } from 'react';
import { X, Share2, Copy, Check, MessageSquare, Mail, Sun, Sparkles, ExternalLink } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function ShareModal({ isOpen, onClose, systemKW = 2.0, annualSavings = 25000, subsidy = 60000, paybackYears = '4.5' }) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentUrl = window.location.href;
  const shareText = `☀️ My Solar Feasibility Report on SolarSense:\n\n• Recommended System: ${systemKW} kW\n• Estimated Annual Bill Savings: ₹${Number(annualSavings).toLocaleString('en-IN')}/year\n• PM Surya Ghar Central Subsidy: ₹${Number(subsidy).toLocaleString('en-IN')}\n• Estimated Payback: ${paybackYears} Years\n\nCheck out the full customized breakdown here: ${currentUrl}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleWhatsAppShare = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(`Solar Feasibility Assessment Report - ${systemKW} kW System`);
    const body = encodeURIComponent(shareText);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">
              Share Feasibility Report
            </h3>
            <p className="text-xs text-slate-500">
              Share your customized solar estimate with family or installers
            </p>
          </div>
        </div>

        {/* Report Preview Card */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-6 text-xs text-slate-700 space-y-1.5 font-medium">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-sm mb-2 text-emerald-900">
            <Sun className="w-4 h-4 text-emerald-600" />
            <span>SolarSense Assessment Summary</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">System Capacity:</span>
            <span className="font-bold text-slate-900">{systemKW} kW</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Annual Electricity Savings:</span>
            <span className="font-bold text-emerald-700">₹{Number(annualSavings).toLocaleString('en-IN')}/yr</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Eligible PM Subsidy:</span>
            <span className="font-bold text-slate-900">₹{Number(subsidy).toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Estimated Payback:</span>
            <span className="font-bold text-slate-900">{paybackYears} Years</span>
          </div>
        </div>

        {/* 1-Click Action Buttons */}
        <div className="space-y-3">
          {/* WhatsApp Button */}
          <button
            onClick={handleWhatsAppShare}
            type="button"
            className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Share on WhatsApp</span>
          </button>

          {/* Email Button */}
          <button
            onClick={handleEmailShare}
            type="button"
            className="w-full py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Mail className="w-4 h-4" />
            <span>Send via Email</span>
          </button>

          {/* Copy Link Input */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="text"
              readOnly
              value={currentUrl}
              className="flex-1 bg-slate-100 border border-slate-200 px-3.5 py-2.5 rounded-xl text-xs text-slate-600 truncate select-all focus:outline-none"
            />
            <button
              onClick={handleCopyLink}
              type="button"
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-300 transition-colors flex items-center gap-1.5 flex-shrink-0"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
