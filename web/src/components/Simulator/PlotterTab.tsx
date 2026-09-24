import React, { useState, useMemo, useRef } from 'react';
import { Download, RotateCcw, Activity } from 'lucide-react';
import { solvePVCDegradation } from '../../core/solver';
import { SPECIES_METADATA, SPECIES_KEYS } from '../../core/constants';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
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
  LogarithmicScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const PlotterTab: React.FC = () => {
  const [wtPercent, setWtPercent] = useState<number>(0.11);
  const [exposureHours, setExposureHours] = useState<number>(1500);
  const [useLogScale, setUseLogScale] = useState<boolean>(false);
  const [showThreshold, setShowThreshold] = useState<boolean>(true);
  const chartRef = useRef<any>(null);

  // Active species toggles
  const [activeSpecies, setActiveSpecies] = useState<Record<string, boolean>>({
    PVC: true,
    R_N_H: true,
    Cl_rad: false,
    R_N_OH: false,
    R_N_O_R: false,
    R_NO_rad: true,
    R_rad: false,
    R_OO_rad: false
  });

  const toggleSpecies = (key: string) => {
    setActiveSpecies((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const selectAll = () => {
    const all: Record<string, boolean> = {};
    SPECIES_KEYS.forEach((k) => (all[k] = true));
    setActiveSpecies(all);
  };

  const selectDefaults = () => {
    setActiveSpecies({
      PVC: true,
      R_N_H: true,
      Cl_rad: false,
      R_N_OH: false,
      R_N_O_R: false,
      R_NO_rad: true,
      R_rad: false,
      R_OO_rad: false
    });
  };

  // Run simulation
  const simulation = useMemo(() => {
    const rawConc = wtPercent / 4.0;
    const scaledHours = exposureHours / 2800.0;
    return solvePVCDegradation(rawConc, scaledHours);
  }, [wtPercent, exposureHours]);

  const handleDownloadImage = () => {
    if (chartRef.current) {
      const url = chartRef.current.toBase64Image();
      const link = document.createElement('a');
      link.download = `PVC_Kinetics_${wtPercent}wtPct_${exposureHours}h.png`;
      link.href = url;
      link.click();
    }
  };

  // Build chart dataset
  const chartData = useMemo(() => {
    const datasets: any[] = [];

    // Add selected species
    SPECIES_KEYS.forEach((key) => {
      if (activeSpecies[key] && simulation.species[key]) {
        const meta = SPECIES_METADATA[key];
        datasets.push({
          label: meta.name,
          data: simulation.species[key],
          borderColor: meta.color,
          backgroundColor: meta.bgLight,
          borderWidth: key === 'PVC' ? 2.5 : 1.8,
          pointRadius: 0,
          tension: 0.2
        });
      }
    });

    // Add 80% threshold line if PVC is shown and threshold enabled
    if (showThreshold && activeSpecies['PVC']) {
      datasets.push({
        label: 'Critical 80% Retention Limit',
        data: simulation.times.map(() => 0.8),
        borderColor: '#dc2626',
        borderDash: [6, 4],
        borderWidth: 1.5,
        pointRadius: 0,
        fill: false
      });
    }

    return {
      labels: simulation.times.map((t) => Math.round(t)),
      datasets
    };
  }, [simulation, activeSpecies, showThreshold]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: { boxWidth: 10, font: { size: 10 }, padding: 6 }
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const val = context.parsed.y;
            return `${context.dataset.label}: ${
              val < 0.001 ? val.toExponential(4) : val.toFixed(4)
            }`;
          }
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
        type: useLogScale ? ('logarithmic' as const) : ('linear' as const),
        title: {
          display: true,
          text: useLogScale ? 'Concentration (Log)' : 'Concentration (Fraction)',
          font: { size: 10 }
        },
        min: useLogScale ? 1e-15 : 0.0,
        max: useLogScale ? 2.0 : 1.05,
        grid: { color: '#f1f5f9' },
        ticks: {
          font: { size: 10 }
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Upper Control Bar */}
      <div className="card space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-sky-600" />
            <h3 className="font-bold text-slate-900 text-base">Kinetic Evolution & Species Traces</h3>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setUseLogScale(!useLogScale)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold border transition-all ${
                useLogScale
                  ? 'bg-purple-50 text-purple-700 border-purple-300'
                  : 'bg-slate-50 text-slate-600 border-slate-200'
              }`}
            >
              {useLogScale ? 'Logarithmic Scale (Active)' : 'Linear Scale'}
            </button>

            <button
              onClick={() => setShowThreshold(!showThreshold)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold border transition-all ${
                showThreshold
                  ? 'bg-red-50 text-red-700 border-red-300'
                  : 'bg-slate-50 text-slate-600 border-slate-200'
              }`}
            >
              {showThreshold ? 'Threshold (On)' : 'Threshold (Off)'}
            </button>

            <button onClick={handleDownloadImage} className="btn btn-secondary text-xs py-1.5 px-3">
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export PNG</span>
            </button>
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-medium">
              <label className="text-slate-700 font-semibold">Stabilizer Dosage (wt.%)</label>
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                {wtPercent.toFixed(3)} wt.% ({ (wtPercent * 10).toFixed(1) } g/kg)
              </span>
            </div>
            <input
              type="range"
              min="0.00"
              max="1.00"
              step="0.005"
              value={wtPercent}
              onChange={(e) => setWtPercent(Number(e.target.value))}
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-medium">
              <label className="text-slate-700 font-semibold">Simulation Exposure Time</label>
              <span className="font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                {exposureHours.toLocaleString()} Hours
              </span>
            </div>
            <input
              type="range"
              min="100"
              max="3500"
              step="50"
              value={exposureHours}
              onChange={(e) => setExposureHours(Number(e.target.value))}
            />
          </div>
        </div>

        {/* Chemical Species Badges & Toggle Pills */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Select Visible Reactive Species (8 Stiff Variables)
            </span>
            <div className="flex gap-2 text-xs">
              <button onClick={selectAll} className="text-sky-600 hover:underline">
                Show All
              </button>
              <span className="text-slate-300">|</span>
              <button onClick={selectDefaults} className="text-slate-500 hover:underline flex items-center gap-1">
                <RotateCcw className="w-3 h-3" />
                Defaults
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {SPECIES_KEYS.map((key) => {
              const meta = SPECIES_METADATA[key];
              const isActive = activeSpecies[key];
              return (
                <button
                  key={key}
                  onClick={() => toggleSpecies(key)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                    isActive
                      ? 'shadow-xs border-transparent'
                      : 'opacity-40 bg-slate-100 border-slate-200 text-slate-500 hover:opacity-75'
                  }`}
                  style={
                    isActive
                      ? {
                          backgroundColor: meta.bgLight,
                          borderColor: meta.color,
                          color: meta.color
                        }
                      : {}
                  }
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: meta.color }}
                  />
                  <span>{meta.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Chart Card */}
      <div className="card space-y-3 p-3 sm:p-6">
        <div className="h-[300px] sm:h-[420px] w-full p-0 sm:p-2">
          <Line ref={chartRef} data={chartData} options={chartOptions} />
        </div>

        {/* Real-time Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100">
          <div className="p-2.5 rounded-lg bg-sky-50/70 border border-sky-100 text-center">
            <p className="text-[11px] text-sky-800 font-medium">Final PVC Retention</p>
            <p className="text-lg font-bold text-sky-700">
              {simulation.retentionPercent}%
            </p>
          </div>

          <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-100 text-center">
            <p className="text-[11px] text-emerald-800 font-medium">Active HALS Remaining</p>
            <p className="text-lg font-bold text-emerald-700">
              {simulation.species['R_N_H']
                ? (simulation.species['R_N_H'][simulation.species['R_N_H'].length - 1] * 4).toFixed(3)
                : '0.000'} wt.%
            </p>
          </div>

          <div className="p-2.5 rounded-lg bg-purple-50/70 border border-purple-100 text-center">
            <p className="text-[11px] text-purple-800 font-medium">Nitroxyl Radical (&gt;NO•)</p>
            <p className="text-lg font-bold text-purple-700">
              {simulation.species['R_NO_rad']
                ? simulation.species['R_NO_rad'][simulation.species['R_NO_rad'].length - 1].toExponential(2)
                : '0.0'}
            </p>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-center">
            <p className="text-[11px] text-slate-600 font-medium">Retention Status</p>
            <p
              className={`text-lg font-bold ${
                simulation.isPassed ? 'text-emerald-600' : 'text-red-600'
              }`}
            >
              {simulation.isPassed ? 'PASSED (≥80%)' : 'DEGRADED (<80%)'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
