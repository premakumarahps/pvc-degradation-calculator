import React, { useState } from 'react';
import { BookOpen, Layers, Download, Sliders, Menu, X, Activity } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'simulator', label: 'Simulator', icon: Sliders },
    { id: 'mechanisms', label: 'Mechanisms', icon: Layers },
    { id: 'experimental', label: 'Testing Data', icon: Activity },
    { id: 'report', label: 'Thesis & Slides', icon: BookOpen },
    { id: 'downloads', label: 'Downloads', icon: Download }
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-200/80 shadow-xs h-16">
      <div className="container h-full flex items-center justify-between">
        {/* Brand with Dedicated PVC Calculator Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white p-0.5 border border-slate-200 shadow-xs flex items-center justify-center shrink-0 overflow-hidden">
            <img
              src="/images/calculator_logo.png"
              alt="PVC UV Degradation Calculator Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight whitespace-nowrap">
                PVC UV-Stabilization Suite
              </span>
              <span className="badge badge-blue text-[10px] hidden md:inline-flex">
                UoM Materials Engineering
              </span>
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links - Fits cleanly in single line */}
        <nav className="hidden md:flex items-center gap-1 p-1 rounded-xl bg-slate-100/80 border border-slate-200/70">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
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

        {/* Mobile Hamburger Toggle */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 space-y-1 shadow-lg animate-fade-in">
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
        </div>
      )}
    </header>
  );
};
