import React, { useState } from 'react';
import { EstimationProvider } from './context/EstimationContext';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AuthModal from './components/common/AuthModal';
import Home from './pages/Home';
import Estimate from './pages/Estimate';
import ReportPage from './pages/Report';
import TopBrands from './pages/TopBrands';

export default function App() {
  const [activePage, setActivePage] = useState('home'); // 'home' | 'estimate' | 'report' | 'brands'

  const navigateTo = (page) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <LanguageProvider>
      <AuthProvider>
        <EstimationProvider>
          <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-500 selection:text-white">
            {/* Header Navigation */}
            <Navbar activePage={activePage} setActivePage={navigateTo} />

          {/* Page Routing */}
          <div className="flex-1">
            {activePage === 'home' && <Home onStartEstimate={() => navigateTo('estimate')} onExploreBrands={() => navigateTo('brands')} />}
            {activePage === 'estimate' && <Estimate />}
            {activePage === 'report' && <ReportPage />}
            {activePage === 'brands' && <TopBrands onStartEstimate={() => navigateTo('estimate')} />}
          </div>

          {/* Footer */}
          <Footer onNavigate={navigateTo} />

          {/* Optional Login / Signup Modal */}
          <AuthModal />
        </div>
      </EstimationProvider>
    </AuthProvider>
  </LanguageProvider>
  );
}
