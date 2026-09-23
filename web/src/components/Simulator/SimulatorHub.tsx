import React, { useState } from 'react';
import { Sliders, Activity, Scale, Table } from 'lucide-react';
import { OptimizerTab } from './OptimizerTab';
import { PlotterTab } from './PlotterTab';
import { ComparisonTab } from './ComparisonTab';
import { BatchTab } from './BatchTab';

export const SimulatorHub: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'optimizer' | 'plotter' | 'comparison' | 'batch'>('optimizer');

  const tabs = [
    {
      id: 'optimizer',
      label: 'Formulation Optimizer',
      desc: 'Predict minimum HALS dosage for target lifetime',
      icon: Sliders
    },
    {
      id: 'comparison',
      label: 'Bare vs. Stabilized Comparison',
      desc: 'Simulate degradation with & without HALS',
      icon: Scale
    },
    {
      id: 'plotter',
      label: '8-Species Kinetics Plotter',
      desc: 'Trace intermediate radicals & polymer matrix',
      icon: Activity
    },
    {
      id: 'batch',
      label: 'Batch Sensitivity & Export',
      desc: 'Dosage spectrum table with CSV export',
      icon: Table
    }
  ];

  return (
    <section id="simulator" className="py-12 bg-slate-50/50">
      <div className="container space-y-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 text-xs font-semibold mb-2">
              <span>Interactive Engineering Software</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Degradation Kinetic Simulator & HALS Optimizer
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              High-precision numerical integration engine running client-side stiff Ordinary
              Differential Equations (ODEs) to simulate photochemical cascades and catalytic Denisov radical trapping.
            </p>
          </div>
        </div>

        {/* Tab Switcher Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-slate-200/60 p-1.5 rounded-xl border border-slate-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex flex-col items-start p-3 rounded-lg text-left transition-all ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                  <span className="font-bold text-xs sm:text-sm tracking-tight">{tab.label}</span>
                </div>
                <span className="text-[11px] text-slate-400 line-clamp-1 hidden sm:block">
                  {tab.desc}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Tab Content */}
        <div className="animate-fade-in">
          {activeSubTab === 'optimizer' && <OptimizerTab />}
          {activeSubTab === 'comparison' && <ComparisonTab />}
          {activeSubTab === 'plotter' && <PlotterTab />}
          {activeSubTab === 'batch' && <BatchTab />}
        </div>
      </div>
    </section>
  );
};
