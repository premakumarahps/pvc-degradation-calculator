import React, { useState } from 'react';
import { Beaker, BookOpen, Layers, Download, Sliders, Menu, X, ArrowLeft, ExternalLink, Activity } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'simulator', label: 'Degradation Simulator', icon: Sliders },
    { id: 'mechanisms', label: 'Reaction Mechanisms', icon: Layers },
    { id: 'experimental', label: 'Experimental Testing', icon: Activity },
    { id: 'report', label: 'Thesis & Slide Deck', icon: BookOpen },
    { id: 'downloads', label: 'Downloads & Software', icon: Download }
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-200/80 shadow-xs">
      <div className="container flex items-center justify-between h-16">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 via-sky-500 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-sky-500/20 ring-1 ring-white/40">
            <Beaker className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base text-slate-900 tracking-tight">
                PVC UV-Stabilization Suite
              </span>
              <span className="badge badge-blue text-[10px] hidden sm:inline-flex">
                UoM • MT2230
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Kinetic Modeling &amp; HALS Tinuvin 770 Optimization
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1.5 p-1 rounded-xl bg-slate-100/80 border border-slate-200/60">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-white text-sky-700 shadow-xs border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Portfolio Return Link & External GitHub */}
        <div className="flex items-center gap-2">
          <a
            href="/"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-xs transition-colors hover-lift"
            title="Return to Sadun Premakumara's Main Portfolio"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-sky-600" />
            <span>Portfolio</span>
          </a>

          <a
            href="https://github.com/premakumarahps/pvc-degradation-calculator"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 shadow-xs transition-colors"
            title="View Project on GitHub"
          >
            <ExternalLink className="w-4 h-4" />
          </a>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 space-y-1 shadow-lg animate-fade-in">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-sky-50 text-sky-700 border border-sky-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-2 border-t border-slate-100 mt-2">
            <a
              href="/"
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Main Portfolio (Sadun Premakumara)</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
