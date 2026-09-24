import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, AlertTriangle, Clock, Sliders, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { findOptimumStabilizer } from '../../core/solver';
import type { OptimizationResult } from '../../core/solver';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const OptimizerTab: React.FC = () => {
  const [targetHours, setTargetHours] = useState<number>(1500);
  const [maxBound, setMaxBound] = useState<number>(0.80);
  const [retentionThreshold, setRetentionThreshold] = useState<number>(80);
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  const presets = [
    { label: '500h (Indoor/Sheltered)', hours: 500 },
    { label: '1000h (Standard Cable)', hours: 1000 },
    { label: '1500h (Standard Exterior)', hours: 1500 },
    { label: '1800h (Architectural Cladding)', hours: 1800 },
    { label: '2000h (Heavy Outdoor Pipe)', hours: 2000 }
  ];

  const handleCalculate = () => {
    setIsCalculating(true);
    setTimeout(() => {
      const res = findOptimumStabilizer(targetHours, maxBound / 4.0, retentionThreshold / 100.0);
      setResult(res);
      setIsCalculating(false);

      if (res.isSuccess && res.recommendedWtPercent > 0) {
        try {
          confetti({
            particleCount: 45,
            spread: 60,
            origin: { y: 0.7 }
          });
        } catch {
          // ignore in headless environments
        }
      }
    }, 50);
  };

  useEffect(() => {
    handleCalculate();
  }, []);

  // Prepare chart data for preview
  const chartData = {
    labels: result?.simulation ? result.simulation.times.map((t) => Math.round(t)) : [],
    datasets: [
      {
        label: 'PVC Matrix Retention Fraction',
        data: result?.simulation ? result.simulation.pvc : [],
        borderColor: '#0284c7',
        backgroundColor: 'rgba(2, 132, 199, 0.08)',
        fill: true,
        tension: 0.2,
        pointRadius: 0,
        borderWidth: 2.5
      },
      {
        label: `Critical Retention Threshold (${retentionThreshold}%)`,
        data: result?.simulation
          ? result.simulation.times.map(() => retentionThreshold / 100.0)
          : [],
        borderColor: '#dc2626',
        borderDash: [6, 4],
        pointRadius: 0,
        borderWidth: 1.8,
        fill: false
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: { boxWidth: 10, font: { size: 10 }, padding: 8 }
      },
      tooltip: {
        callbacks: {
          label: (context: any) =>
            `${context.dataset.label}: ${(context.parsed.y * 100).toFixed(2)}%`
        }
      }
    },
    scales: {
      x: {
        title: { display: true, text: 'Simulated Outdoor Exposure (Hours)', font: { size: 10 } },
        grid: { color: '#f1f5f9' },
        ticks: {
          maxTicksLimit: 6,
          maxRotation: 0,
          autoSkip: true,
          font: { size: 10 }
        }
      },
      y: {
        title: { display: true, text: 'PVC Retention (Fraction)', font: { size: 10 } },
        min: 0.65,
        max: 1.02,
        grid: { color: '#f1f5f9' },
        ticks: {
          font: { size: 10 }
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls and Calculation Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form & Sliders */}
        <div className="lg:col-span-5 space-y-5">
          <div className="card space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-sky-600" />
                <h3 className="font-bold text-slate-900 text-base">Target Parameters</h3>
              </div>
              <button
                onClick={() => {
                  setTargetHours(1500);
                  setMaxBound(0.80);
                  setRetentionThreshold(80);
                }}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1"
                title="Reset to project defaults"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            </div>

            {/* Target Lifespan Slider & Input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm font-medium">
                <label className="text-slate-700">Expected Outdoor Lifetime</label>
                <span className="font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded text-xs">
                  {targetHours.toLocaleString()} Hours
                </span>
              </div>
              <input
                type="range"
                min="100"
                max="3000"
                step="25"
                value={targetHours}
                onChange={(e) => setTargetHours(Number(e.target.value))}
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  min="50"
                  max="4000"
                  value={targetHours}
                  onChange={(e) => setTargetHours(Math.max(10, Number(e.target.value)))}
                  className="input-control text-sm font-mono py-1.5"
                />
                <span className="text-xs text-slate-400 self-center">hours</span>
              </div>
            </div>

            {/* Presets */}
            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Quick Presets
              </label>
              <div className="flex flex-wrap gap-1.5">
                {presets.map((p) => (
                  <button
                    key={p.hours}
                    onClick={() => setTargetHours(p.hours)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                      targetHours === p.hours
                        ? 'bg-sky-600 text-white font-semibold shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {p.hours}h
                  </button>
                ))}
              </div>
            </div>

            {/* Max Dosage Bound */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex justify-between items-center text-sm font-medium">
                <label className="text-slate-700">Max Stabilizer Limit</label>
                <span className="font-semibold text-slate-800 text-xs">
                  {maxBound.toFixed(2)} wt.%
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="2.0"
                step="0.05"
                value={maxBound}
                onChange={(e) => setMaxBound(Number(e.target.value))}
              />
              <p className="text-[11px] text-slate-400">
                Industry standard limits dosage between 0.2% and 1.0% wt. to prevent additive blooming.
              </p>
            </div>

            {/* Retention Threshold */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex justify-between items-center text-sm font-medium">
                <label className="text-slate-700">Target PVC Retention</label>
                <span className="font-semibold text-emerald-700 text-xs">
                  {retentionThreshold}%
                </span>
              </div>
              <input
                type="range"
                min="70"
                max="95"
                step="1"
                value={retentionThreshold}
                onChange={(e) => setRetentionThreshold(Number(e.target.value))}
              />
              <p className="text-[11px] text-slate-400">
                Critical threshold in University Thesis is 80% (0.80) remaining polymer fraction.
              </p>
            </div>

            {/* Run Button */}
            <button
              onClick={handleCalculate}
              disabled={isCalculating}
              className="btn btn-primary w-full py-2.5 text-sm mt-3"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isCalculating ? 'Solving Stiff ODEs...' : 'Compute Optimal Formulation'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Formulation Results & Live Chart */}
        <div className="lg:col-span-7 space-y-5">
          {result && (
            <div className="card space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  {result.isSuccess ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                  )}
                  <h3 className="font-bold text-slate-900 text-base">Optimization Outcome</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {result.executionTimeMs} ms
                  </span>
                  <span
                    className={`badge ${
                      result.status === 'OPTIMUM_FOUND'
                        ? 'badge-green'
                        : result.status === 'SAFE_WITHOUT_STABILIZER'
                        ? 'badge-blue'
                        : 'badge-amber'
                    }`}
                  >
                    {result.status.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>

              {/* Metric Highlight Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200">
                  <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wide">
                    Optimal HALS Dosage
                  </p>
                  <p className="text-2xl font-black text-emerald-700 mt-1">
                    {result.recommendedWtPercent >= 0 ? `${result.recommendedWtPercent} wt.%` : 'N/A'}
                  </p>
                  <p className="text-[11px] text-emerald-600 mt-0.5">
                    Tinuvin 770 (Denisov cycle)
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-sky-50/80 border border-sky-200">
                  <p className="text-xs font-semibold text-sky-800 uppercase tracking-wide">
                    Compounding Rate
                  </p>
                  <p className="text-2xl font-black text-sky-700 mt-1">
                    {result.compoundingGPerKg >= 0 ? `${result.compoundingGPerKg} g/kg` : 'N/A'}
                  </p>
                  <p className="text-[11px] text-sky-600 mt-0.5">
                    Grams additive per kg PVC
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                    Final PVC Retention
                  </p>
                  <p className="text-2xl font-black text-slate-800 mt-1">
                    {result.finalPvcRetention}%
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Target: ≥ {result.targetThreshold * 100}%
                  </p>
                </div>
              </div>

              {/* Message Banner */}
              <div
                className={`p-3 rounded-lg text-xs leading-relaxed ${
                  result.isSuccess
                    ? 'bg-slate-50 text-slate-700 border border-slate-200'
                    : 'bg-amber-50 text-amber-900 border border-amber-200'
                }`}
              >
                <strong>Scientific Finding: </strong> {result.message}
              </div>

              {/* Embedded Interactive Chart */}
              <div className="space-y-1 pt-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-700">
                    Degradation Trajectory Preview
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Predicted via 8-Species Stiff Solver
                  </span>
                </div>
                <div className="h-64 w-full bg-slate-50/50 rounded-xl p-2 border border-slate-100">
                  <Line data={chartData} options={chartOptions} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
