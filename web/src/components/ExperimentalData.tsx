import React, { useState } from 'react';
import { Beaker, TrendingDown, FileText } from 'lucide-react';
import { EXPERIMENTAL_DATASETS } from '../core/reportData';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
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
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const ExperimentalData: React.FC = () => {
  const [activeDataset, setActiveDataset] = useState<'tensile' | 'elongation' | 'hardness' | 'weightLoss'>('tensile');

  // Tensile Chart
  const tensileData = {
    labels: EXPERIMENTAL_DATASETS.tensileStrength.samples.map((s) => s.label),
    datasets: [
      {
        label: 'Tensile Strength (MPa)',
        data: EXPERIMENTAL_DATASETS.tensileStrength.samples.map((s) => s.value),
        borderColor: '#0284c7',
        backgroundColor: 'rgba(2, 132, 199, 0.1)',
        borderWidth: 2.5,
        pointBackgroundColor: '#0284c7',
        pointRadius: 5,
        fill: true,
        tension: 0.2
      }
    ]
  };

  // Elongation Chart
  const elongationData = {
    labels: EXPERIMENTAL_DATASETS.elongationAtBreak.samples.map((s) => s.label),
    datasets: [
      {
        label: 'Elongation at Break (%)',
        data: EXPERIMENTAL_DATASETS.elongationAtBreak.samples.map((s) => s.value),
        borderColor: '#059669',
        backgroundColor: 'rgba(5, 150, 105, 0.1)',
        borderWidth: 2.5,
        pointBackgroundColor: '#059669',
        pointRadius: 5,
        fill: true,
        tension: 0.2
      }
    ]
  };

  // Hardness Chart
  const hardnessData = {
    labels: EXPERIMENTAL_DATASETS.hardnessShoreD.samples.map((s) => s.label),
    datasets: [
      {
        label: 'Shore D Hardness',
        data: EXPERIMENTAL_DATASETS.hardnessShoreD.samples.map((s) => s.value),
        backgroundColor: '#7c3aed',
        borderRadius: 6
      }
    ]
  };

  // Weight Loss Chart
  const weightLossData = {
    labels: EXPERIMENTAL_DATASETS.weightLossComparison.timeDays.map((d) => `${d} Days`),
    datasets: EXPERIMENTAL_DATASETS.weightLossComparison.curves.map((curve) => ({
      label: curve.name,
      data: curve.values,
      borderColor: curve.color,
      backgroundColor: 'transparent',
      borderWidth: 2,
      pointRadius: 4,
      tension: 0.2
    }))
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const, labels: { boxWidth: 12, font: { size: 11 } } },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.dataset.label}: ${context.parsed.y}`
        }
      }
    },
    scales: {
      x: { grid: { color: '#f1f5f9' } },
      y: { grid: { color: '#f1f5f9' } }
    }
  };

  return (
    <section id="experimental" className="py-12 bg-slate-50/70 border-b border-slate-200">
      <div className="container space-y-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-semibold">
            <Beaker className="w-3.5 h-3.5 text-sky-600" />
            <span>Empirical Laboratory Characterization</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Experimental Weathering & Material Testing Data
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Direct measurements from ASTM G154 accelerated chamber testing (168-hour continuous cycle)
            measuring tensile scission, elongation loss, surface hardness, and mass loss.
          </p>

          {/* Dataset Switcher */}
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            <button
              onClick={() => setActiveDataset('tensile')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeDataset === 'tensile'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              Tensile Strength (Graph 02)
            </button>
            <button
              onClick={() => setActiveDataset('elongation')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeDataset === 'elongation'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              Elongation at Break (Graph 03)
            </button>
            <button
              onClick={() => setActiveDataset('hardness')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeDataset === 'hardness'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              Shore D Hardness (Graph 04)
            </button>
            <button
              onClick={() => setActiveDataset('weightLoss')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeDataset === 'weightLoss'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              Weight Loss Comparison (Graph 07)
            </button>
          </div>
        </div>

        {/* Chart Card & Analytical Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 card space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">
                {activeDataset === 'tensile' && EXPERIMENTAL_DATASETS.tensileStrength.title}
                {activeDataset === 'elongation' && EXPERIMENTAL_DATASETS.elongationAtBreak.title}
                {activeDataset === 'hardness' && EXPERIMENTAL_DATASETS.hardnessShoreD.title}
                {activeDataset === 'weightLoss' && EXPERIMENTAL_DATASETS.weightLossComparison.title}
              </h3>
              <span className="badge badge-blue text-xs">Accelerated Testing</span>
            </div>

            <div className="h-[340px] w-full p-2">
              {activeDataset === 'tensile' && <Line data={tensileData} options={chartOptions} />}
              {activeDataset === 'elongation' && <Line data={elongationData} options={chartOptions} />}
              {activeDataset === 'hardness' && <Bar data={hardnessData} options={chartOptions} />}
              {activeDataset === 'weightLoss' && <Line data={weightLossData} options={chartOptions} />}
            </div>

            <p className="text-xs text-slate-500 italic pt-1 border-t border-slate-100">
              {activeDataset === 'tensile' && EXPERIMENTAL_DATASETS.tensileStrength.insight}
              {activeDataset === 'elongation' && EXPERIMENTAL_DATASETS.elongationAtBreak.insight}
              {activeDataset === 'hardness' && EXPERIMENTAL_DATASETS.hardnessShoreD.insight}
              {activeDataset === 'weightLoss' && EXPERIMENTAL_DATASETS.weightLossComparison.insight}
            </p>
          </div>

          {/* Right Insights Column */}
          <div className="lg:col-span-4 space-y-4">
            <div className="card space-y-3">
              <div className="flex items-center gap-2 text-slate-900">
                <FileText className="w-5 h-5 text-sky-600" />
                <h4 className="font-bold text-sm">Spectroscopic Characterization</h4>
              </div>

              <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
                <p>
                  <strong>FTIR Spectroscopy:</strong> Monitored the emergence of the carbonyl (C=O)
                  stretching band at 1720 cm⁻¹. Unstabilized samples demonstrated exponential peak
                  growth, while Tinuvin 770 formulations flattened the oxidation curve.
                </p>
                <p>
                  <strong>UV-Vis Spectroscopy:</strong> Quantified absorption shifts across 200–800 nm.
                  The formation of polyene sequences shifted absorbance toward the visible region,
                  directly correlating with the yellowing index ($YI$).
                </p>
              </div>
            </div>

            <div className="card space-y-3">
              <div className="flex items-center gap-2 text-slate-900">
                <TrendingDown className="w-5 h-5 text-purple-600" />
                <h4 className="font-bold text-sm">Thermal Kinetics (TGA & DSC)</h4>
              </div>

              <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
                <p>
                  <strong>TGA Analysis:</strong> Verified that stabilized PVC exhibits delayed onset
                  of dehydrochlorination (T_onset shifted upward by 18°C), proving suppression of
                  radical initiation.
                </p>
                <p>
                  <strong>DSC Glass Transition:</strong> Monitored shifts in Tg. Severe degradation
                  causes chain cleavage that drops Tg, followed by cross-linking that causes
                  brittleness.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
