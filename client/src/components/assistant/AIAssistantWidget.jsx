import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, User, HelpCircle, MessageSquare, ChevronRight, CornerDownLeft, Loader2, RotateCcw, Zap, Shield, IndianRupee, SunMedium } from 'lucide-react';
import { useEstimation } from '../../context/EstimationContext';
import { solarAPI } from '../../services/api';

const QUICK_SUGGESTIONS = [
  { label: '💰 PM Surya Ghar Subsidy', query: 'How much government subsidy do I get under PM Surya Ghar?' },
  { label: '📈 10 & 25-Year Savings', query: 'How much money will I save over 10 and 25 years?' },
  { label: '🔄 Net Metering', query: 'How does net metering work with my electricity board?' },
  { label: '🏠 Roof Suitability', query: 'Is my marked roof area sufficient for this system?' },
  { label: '⚡ Running AC / Heavy Load', query: 'Can this solar system run a 1.5 Ton AC and heavy appliances?' },
  { label: '🔋 Batteries & Power Cuts', query: 'Will solar work during power cuts or do I need a battery?' },
  { label: '☀️ Why this kW size?', query: 'Why did the system recommend this kW size instead of a bigger one?' },
  { label: '🌧️ Monsoon Impact', query: 'How do cloudy monsoon days affect solar generation?' }
];

/**
 * Clean & beautiful markdown renderer component
 */
function FormattedMessage({ text, isUser }) {
  if (isUser) {
    return <div className="text-sm text-white font-medium leading-relaxed">{text}</div>;
  }

  // Helper to parse inline bolding and clean quotes
  const parseInline = (str) => {
    // Remove unwanted escaped quotes or wrapper quotes
    const clean = str.replace(/\\"/g, '"').replace(/^["'“”]+|["'“”]+$/g, '');
    const parts = clean.split(/(\*\*[^*]+\*\*)/g);

    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const inner = part.slice(2, -2);
        return (
          <strong key={i} className="font-semibold text-slate-900 bg-emerald-50 text-emerald-950 px-1 py-0.5 rounded border border-emerald-200/60">
            {inner}
          </strong>
        );
      }
      return part;
    });
  };

  const lines = text.split('\n');

  return (
    <div className="space-y-2 text-xs sm:text-sm text-slate-700 leading-relaxed">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} className="h-1.5" />;
        }

        // Heading 3
        if (trimmed.startsWith('### ')) {
          const title = trimmed.replace(/^###\s*/, '').replace(/\*\*/g, '');
          return (
            <div key={idx} className="font-bold text-slate-900 text-sm sm:text-base pt-1 pb-0.5 border-b border-slate-100 flex items-center gap-1.5 text-emerald-900">
              <span className="w-1.5 h-3.5 bg-emerald-500 rounded-full" />
              <span>{title}</span>
            </div>
          );
        }

        // Bullet points with dot or dash
        if (trimmed.startsWith('• ') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const content = trimmed.replace(/^[•\-*]\s*/, '');
          return (
            <div key={idx} className="flex items-start gap-2 pl-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
              <div className="flex-1">{parseInline(content)}</div>
            </div>
          );
        }

        // Numbered lists
        if (/^\d+\.\s/.test(trimmed)) {
          const num = trimmed.match(/^\d+/)[0];
          const content = trimmed.replace(/^\d+\.\s*/, '');
          return (
            <div key={idx} className="flex items-start gap-2 pl-1">
              <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5 border border-slate-200">
                {num}
              </span>
              <div className="flex-1">{parseInline(content)}</div>
            </div>
          );
        }

        // Regular paragraph text
        return <div key={idx}>{parseInline(trimmed)}</div>;
      })}
    </div>
  );
}

export default function AIAssistantWidget() {
  const {
    consumption,
    targetCoverage,
    systemSizing,
    roofVerification,
    panelSpec,
    generation,
    financials
  } = useEstimation();

  const getInitialGreeting = () => {
    const kw = systemSizing.roundedCapacityKW || systemSizing.requiredKW || 2.0;
    const units = consumption.monthlyUnits || 300;
    return `Hello! I am your SolarSense AI Consultant.\n\nI've analyzed your **${kw} kW** solar system for your **${units} units/month** demand. Ask me anything about subsidies, savings, net metering, or roof feasibility!`;
  };

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: getInitialGreeting()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleResetChat = () => {
    setMessages([
      {
        role: 'assistant',
        text: getInitialGreeting()
      }
    ]);
  };

  const handleSendMessage = async (customQuery) => {
    const query = (customQuery || inputText).trim();
    if (!query || isTyping) return;

    // Add user message to state
    const newMessages = [...messages, { role: 'user', text: query }];
    setMessages(newMessages);
    setInputText('');
    setIsTyping(true);

    // Build context object
    const reportContext = {
      consumption,
      systemSizing,
      roofVerification,
      panelSpec,
      generation,
      financial: {
        costRangeLow: financials.costRange.low,
        costRangeHigh: financials.costRange.high,
        costRangeMid: financials.costRange.mid,
        annualSavings: financials.savings.annual,
        monthlySavings: financials.savings.monthly,
        paybackYearsLow: financials.payback.yearsLow,
        paybackYearsHigh: financials.payback.yearsHigh,
        roi25yr: financials.roi.year25
      }
    };

    try {
      const res = await solarAPI.chatWithAssistant(
        query,
        reportContext,
        newMessages.slice(-6)
      );

      const replyText = res.message || 'I have analyzed your solar report. Feel free to ask more questions!';

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: replyText
        }
      ]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: 'I have analyzed your request. You can check the detailed numbers in the dashboard tabs above or ask another question.'
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 flex flex-col h-[600px] overflow-hidden">
      {/* Widget Header */}
      <div className="p-4 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">SolarSense AI Assistant</h3>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            <p className="text-[11px] text-slate-300">Context-Aware Feasibility & Subsidy Advisor</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetChat}
            type="button"
            title="Reset Chat"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700 text-xs flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">Reset</span>
          </button>
          <span className="px-2.5 py-1 rounded-full bg-emerald-900/60 text-emerald-300 text-[10px] font-semibold border border-emerald-700/50">
            Live Synced
          </span>
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/60">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-2.5 ${
              msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs shadow-sm ${
                msg.role === 'user'
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'bg-slate-900 text-emerald-400'
              }`}
            >
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-[88%] sm:max-w-[82%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-emerald-600 text-white rounded-tr-none shadow-md shadow-emerald-600/10'
                  : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-none shadow-sm'
              }`}
            >
              <FormattedMessage text={msg.text} isUser={msg.role === 'user'} />
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-slate-400 text-xs p-2">
            <div className="w-7 h-7 rounded-lg bg-slate-900 text-emerald-400 flex items-center justify-center">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="p-2.5 bg-white border-t border-slate-100 overflow-x-auto whitespace-nowrap scrollbar-none flex items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 pl-1 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-emerald-500" />
          Topics:
        </span>
        {QUICK_SUGGESTIONS.map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSendMessage(item.query)}
            className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 text-[11px] font-medium transition-colors border border-slate-200 hover:border-emerald-200 flex-shrink-0 flex items-center gap-1 shadow-2xs"
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Input Field */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask a question about your solar report, subsidy, or ROI..."
          disabled={isTyping}
          className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
        />
        <button
          type="submit"
          disabled={isTyping || !inputText.trim()}
          className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white transition-all shadow-md shadow-emerald-600/20 flex-shrink-0 flex items-center justify-center cursor-pointer"
        >
          {isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </form>
    </div>
  );
}
