import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SimulatorHub } from './components/Simulator/SimulatorHub';
import { MechanismSection } from './components/MechanismSection';
import { ExperimentalData } from './components/ExperimentalData';
import { DocumentViewer } from './components/DocumentViewer';
import { DownloadHub } from './components/DownloadHub';
import { Footer } from './components/Footer';
import { Sliders, Layers, Activity, BookOpen, Download, ArrowRight, ArrowLeft } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('simulator');

  const mainTabs = [
    {
      id: 'simulator',
      label: 'Degradation Simulator',
      subtitle: 'Formulation Optimizer & ODE Solver',
      icon: Sliders,
      badge: 'Interactive Software'
    },
    {
      id: 'mechanisms',
      label: 'Reaction Mechanisms',
      subtitle: 'Bare PVC vs. HALS Denisov Cycle',
      icon: Layers,
      badge: 'Chemical Kinetics'
    },
    {
      id: 'experimental',
      label: 'Experimental Validation',
      subtitle: 'ASTM G154 Tensile, Hardness & TGA',
      icon: Activity,
      badge: 'Empirical Data'
    },
    {
      id: 'report',
      label: 'Thesis & Defense Deck',
      subtitle: '36-Page Report & 20-Slide Deck',
      icon: BookOpen,
      badge: 'Academic Reader'
    },
    {
      id: 'downloads',
      label: 'Software & Downloads',
      subtitle: 'Standalone Windows .EXE & PDFs',
      icon: Download,
      badge: 'Deliverables'
    }
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    const element = document.getElementById('workspace-hub');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const getNextTab = () => {
    const currentIndex = mainTabs.findIndex((t) => t.id === activeTab);
    return mainTabs[(currentIndex + 1) % mainTabs.length];
  };

  const getPrevTab = () => {
    const currentIndex = mainTabs.findIndex((t) => t.id === activeTab);
    return mainTabs[(currentIndex - 1 + mainTabs.length) % mainTabs.length];
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-sky-500/20">
      {/* Top Floating Glassmorphism Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={handleTabChange} />

      {/* Main Content */}
      <main className="flex-1">
        {/* Luxury Hero with Ambient Mesh Orbs and Dynamic Typewriter */}
        <Hero onSelectTab={handleTabChange} />

        {/* Central Executive Workspace Navigation Hub */}
        <section id="workspace-hub" className="py-6 sm:py-8 border-y border-slate-200/80 bg-slate-50/60 sticky top-16 z-40 backdrop-blur-md">
          <div className="container">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div>
                <span className="text-[11px] font-bold text-sky-700 uppercase tracking-wider">
                  Executive Workspace
                </span>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  Project Exploration &amp; Computational Engineering Hub
                </h2>
              </div>
              <div className="hidden md:flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Domain:</span>
                <span className="badge badge-blue text-xs font-bold">
                  {mainTabs.find((t) => t.id === activeTab)?.label}
                </span>
              </div>
            </div>

            {/* Segmented Domain Switcher (Matching 1_My_WebSite) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 bg-slate-200/70 p-1.5 rounded-2xl border border-slate-300/70 shadow-xs">
              {mainTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex flex-col items-start p-3 rounded-xl text-left transition-all ${
                      isActive
                        ? 'bg-white text-slate-900 shadow-md ring-1 ring-slate-900/5'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                        <span className="font-bold text-xs sm:text-sm tracking-tight">{tab.label}</span>
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-400 line-clamp-1 hidden sm:block">
                      {tab.subtitle}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Active Domain Workspace Viewport */}
        <div className="py-8 min-h-[600px] animate-tab-fade">
          {activeTab === 'simulator' && <SimulatorHub />}
          {activeTab === 'mechanisms' && <MechanismSection />}
          {activeTab === 'experimental' && <ExperimentalData />}
          {activeTab === 'report' && <DocumentViewer />}
          {activeTab === 'downloads' && <DownloadHub />}
        </div>

        {/* Comfortable Inter-Domain Quick Navigation Footer */}
        <section className="py-8 bg-slate-50 border-t border-slate-200">
          <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={() => handleTabChange(getPrevTab().id)}
              className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 px-4 py-2 rounded-xl bg-white border border-slate-200 shadow-xs hover-lift"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-sky-600" />
              <span>Previous: {getPrevTab().label}</span>
            </button>

            <div className="text-center">
              <div className="luxury-divider mx-auto mb-1.5" />
              <p className="text-[11px] text-slate-400">
                Premakumara H.P.S. • Department of Materials Science &amp; Engineering • University of Moratuwa
              </p>
            </div>

            <button
              onClick={() => handleTabChange(getNextTab().id)}
              className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 px-4 py-2 rounded-xl bg-white border border-slate-200 shadow-xs hover-lift"
            >
              <span>Next: {getNextTab().label}</span>
              <ArrowRight className="w-3.5 h-3.5 text-sky-600" />
            </button>
          </div>
        </section>
      </main>

      {/* Comprehensive Executive Footer */}
      <Footer />
    </div>
  );
};

export default App;
