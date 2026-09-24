import React, { useState, useMemo } from 'react';
import { ShieldAlert, ShieldCheck, Zap } from 'lucide-react';
import { solvePVCDegradation, solveUnstabilizedDegradation } from '../../core/solver';
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

export const ComparisonTab: React.FC = () => {
  const [customDosage, setCustomDosage] = useState<number>(0.15);
  const [simulationHours, setSimulationHours] = useState<number>(2000);

  const scaledHours = simulationHours / 2800.0;

  // 1. Unstabilized (Bare) PVC
  const unstabilized = useMemo(() => {
    return solveUnstabilizedDegradation(scaledHours);
  }, [scaledHours]);

  // 2. Reference Benchmark: 0.5% wt. HALS (from Thesis Report Graph 06)
  const benchmark05 = useMemo(() => {
    return solvePVCDegradation(0.5 / 4.0, scaledHours);
  }, [scaledHours]);

  // 3. User's Custom Formulation
  const customSim = useMemo(() => {
    return solvePVCDegradation(customDosage / 4.0, scaledHours);
  }, [customDosage, scaledHours]);

  // Find approximate time when unstabilized crosses 80%
  const unstabilizedFailureHour = useMemo(() => {
    for (let i = 0; i < unstabilized.pvc.length; i++) {
      if (unstabilized.pvc[i] <= 0.8) {
        return Math.round(unstabilized.times[i]);
      }
    }
    return null;
  }, [unstabilized]);

  // Prepare comparison chart
  const chartData = {
    labels: benchmark05.times.map((t) => Math.round(t)),
    datasets: [
      {
        label: 'Without Stabilizer (Bare PVC - Rapid Degradation)',
        data: unstabilized.pvc,
        borderColor: '#dc2626',
        backgroundColor: 'rgba(220, 38, 38, 0.05)',
        borderWidth: 2.5,
        pointRadius: 0,
        tension: 0.2
      },
      {
        label: `Custom Formulation (${customDosage.toFixed(2)} wt.% HALS)`,
        data: customSim.pvc,
        borderColor: '#0284c7',
        backgroundColor: 'rgba(2, 132, 199, 0.05)',
        borderWidth: 2.5,
        pointRadius: 0,
        tension: 0.2
      },
      {
        label: 'Thesis Reference Benchmark (0.50 wt.% Tinuvin 770)',
        data: benchmark05.pvc,
        borderColor: '#059669',
        backgroundColor: 'rgba(5, 150, 105, 0.05)',
        borderWidth: 2,
        borderDash: [4, 4],
        pointRadius: 0,
        tension: 0.2
      },
      {
        label: 'Critical 80% Retention Limit',
        data: benchmark05.times.map(() => 0.8),
        borderColor: '#64748b',
        borderDash: [6, 4],
        borderWidth: 1.5,
        pointRadius: 0,
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
            `${context.dataset.label}: ${(context.parsed.y * 100).toFixed(2)}% retention`
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
        min: 0.45,
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
      {/* Top Controls & Dosage Slider */}
      <div className="card space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Stabilized vs. Unstabilized Degradation Dynamics
              </h3>
              <p className="text-xs text-slate-500">
                Direct simulation of polymer fate with and without HALS radical scavenger
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Test Duration:</span>
            <select
              value={simulationHours}
              onChange={(e) => setSimulationHours(Number(e.target.value))}
              className="input-control text-xs py-1 px-2.5 w-auto"
            >
              <option value={1000}>1,000 Hours</option>
              <option value={1500}>1,500 Hours</option>
              <option value={2000}>2,000 Hours</option>
              <option value={2500}>2,500 Hours</option>
            </select>
          </div>
        </div>

        {/* Custom Formulation Slider */}
        <div className="space-y-1.5">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1.5 text-xs font-medium">
            <label className="text-slate-700 font-semibold">
              Adjust Custom Formulation Dosage:
            </label>
            <span className="font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded self-start sm:self-auto">
              {customDosage.toFixed(2)} wt.% ({ (customDosage * 10).toFixed(1) } g/kg PVC)
            </span>
          </div>
          <input
            type="range"
            min="0.01"
            max="0.80"
            step="0.01"
            value={customDosage}
            onChange={(e) => setCustomDosage(Number(e.target.value))}
          />
        </div>
      </div>

      {/* Main Comparative Graph */}
      <div className="card space-y-3 p-3 sm:p-6">
        <div className="h-[300px] sm:h-[400px] w-full p-0 sm:p-2">
          <Line data={chartData} options={chartOptions} />
        </div>

        {/* 3-Column Comparative Insight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-slate-100">
          {/* Card 1: Bare PVC */}
          <div className="p-4 rounded-xl bg-red-50/80 border border-red-200 space-y-2">
            <div className="flex items-center gap-2 text-red-800">
              <ShieldAlert className="w-5 h-5 text-red-600" />
              <h4 className="font-bold text-sm">Without Stabilizer (Bare)</h4>
            </div>
            <div className="space-y-1 text-xs text-red-950">
              <p>
                <strong>Final Integrity:</strong>{' '}
                <span className="font-bold text-red-700">{unstabilized.retentionPercent}%</span>
              </p>
              <p>
                <strong>Critical Threshold (80%):</strong>{' '}
                Breached at{' '}
                <span className="font-bold underline">
                  ~{unstabilizedFailureHour || '<500'} hours
                </span>
              </p>
              <p className="text-[11px] text-red-800 pt-1 leading-relaxed">
                Suffers uninhibited radical zip-elimination. Chlorine radicals (Cl•) catalyze
                continuous dehydrochlorination, releasing HCl gas and forming brittle polyenes.
              </p>
            </div>
          </div>

          {/* Card 2: Custom Formulation */}
          <div className="p-4 rounded-xl bg-sky-50/80 border border-sky-200 space-y-2">
            <div className="flex items-center gap-2 text-sky-800">
              <ShieldCheck className="w-5 h-5 text-sky-600" />
              <h4 className="font-bold text-sm">Custom ({customDosage.toFixed(2)} wt.%)</h4>
            </div>
            <div className="space-y-1 text-xs text-sky-950">
              <p>
                <strong>Final Integrity:</strong>{' '}
                <span className="font-bold text-sky-700">{customSim.retentionPercent}%</span>
              </p>
              <p>
                <strong>Status at {simulationHours}h:</strong>{' '}
                <span
                  className={`font-bold ${
                    customSim.isPassed ? 'text-emerald-700' : 'text-amber-700'
                  }`}
                >
                  {customSim.isPassed ? 'Within Safe 80% Bound' : 'Breached Threshold'}
                </span>
              </p>
              <p className="text-[11px] text-sky-800 pt-1 leading-relaxed">
                Active &gt;NH interrupts peroxy radical (R'OO•) formation. Nitroxyl radicals (&gt;NO•)
                trap carbon-centered radicals at 1.2×10⁹ M⁻¹s⁻¹.
              </p>
            </div>
          </div>

          {/* Card 3: 0.5% Thesis Benchmark */}
          <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 space-y-2">
            <div className="flex items-center gap-2 text-emerald-800">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h4 className="font-bold text-sm">Thesis Benchmark (0.50 wt.%)</h4>
            </div>
            <div className="space-y-1 text-xs text-emerald-950">
              <p>
                <strong>Final Integrity:</strong>{' '}
                <span className="font-bold text-emerald-700">{benchmark05.retentionPercent}%</span>
              </p>
              <p>
                <strong>Lifespan Extension:</strong>{' '}
                <span className="font-bold text-emerald-700">+450% over bare PVC</span>
              </p>
              <p className="text-[11px] text-emerald-800 pt-1 leading-relaxed">
                Matches the validated baseline from report Page 29 (Graph 06). Complete suppression of
                autocatalytic dehydrochlorination and long-term mechanical stability.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
