import React, { useState, useMemo } from 'react';
import { Download, Copy, Check, Table } from 'lucide-react';
import { generateBatchSensitivity } from '../../core/solver';

export const BatchTab: React.FC = () => {
  const [exposureHours, setExposureHours] = useState<number>(1500);
  const [pointsCount, setPointsCount] = useState<number>(15);
  const [copied, setCopied] = useState<boolean>(false);

  const batchData = useMemo(() => {
    return generateBatchSensitivity(exposureHours, pointsCount, 0.8);
  }, [exposureHours, pointsCount]);

  const handleExportCSV = () => {
    const headers = [
      'ID',
      'Stabilizer (wt.%)',
      'Raw Concentration',
      'Compounding Rate (g/kg PVC)',
      'Final Retention (%)',
      'Degradation (%)',
      'Loss Reduction vs Blank (%)',
      'Status'
    ];

    const rows = batchData.map((item) => [
      item.id,
      item.wtPercent,
      item.rawConc,
      item.compoundingGPerKg,
      item.finalRetentionPct,
      item.degradationPct,
      item.lossReductionPct,
      item.status
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `PVC_Sensitivity_Batch_${exposureHours}h.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopy = () => {
    const text = batchData
      .map(
        (i) =>
          `${i.wtPercent}\t${i.compoundingGPerKg} g/kg\t${i.finalRetentionPct}%\t${i.degradationPct}%\t${i.status}`
      )
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Filter & Export Bar */}
      <div className="card space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Table className="w-5 h-5 text-sky-600" />
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Formulation Sensitivity & Batch Analysis
              </h3>
              <p className="text-xs text-slate-500">
                Multi-dosage sweep evaluating HALS protective efficiency across the concentration gradient
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={handleCopy} className="btn btn-secondary text-xs py-1.5 px-3">
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button onClick={handleExportCSV} className="btn btn-primary text-xs py-1.5 px-3">
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Configuration Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Target Outdoor Exposure</label>
            <select
              value={exposureHours}
              onChange={(e) => setExposureHours(Number(e.target.value))}
              className="input-control text-xs py-1.5"
            >
              <option value={500}>500 Hours (Short Outdoor Test)</option>
              <option value={1000}>1,000 Hours (Moderate Weathering)</option>
              <option value={1500}>1,500 Hours (Standard University Benchmark)</option>
              <option value={1800}>1,800 Hours (Heavy Sunlight Exposure)</option>
              <option value={2000}>2,000 Hours (Extended Structural Service)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Sweep Resolution</label>
            <select
              value={pointsCount}
              onChange={(e) => setPointsCount(Number(e.target.value))}
              className="input-control text-xs py-1.5"
            >
              <option value={10}>10 Discrete Formulations</option>
              <option value={15}>15 Discrete Formulations</option>
              <option value={25}>25 Discrete Formulations (High Density)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="card p-0 overflow-hidden">
        <div className="table-container border-0">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Stabilizer (wt.%)</th>
                <th>Compounding Ratio</th>
                <th>Final Retention</th>
                <th>Degradation</th>
                <th>Loss Reduction vs Blank</th>
                <th>Quality Status</th>
              </tr>
            </thead>
            <tbody>
              {batchData.map((item) => (
                <tr key={item.id} className="transition-colors">
                  <td className="font-mono text-slate-400 text-xs">{item.id}</td>
                  <td className="font-semibold text-slate-800 font-mono">
                    {item.wtPercent.toFixed(4)} %
                  </td>
                  <td className="text-slate-600 text-xs font-mono">
                    {item.compoundingGPerKg} g/kg
                  </td>
                  <td className="font-bold text-slate-900 font-mono">
                    {item.finalRetentionPct} %
                  </td>
                  <td className="text-slate-600 font-mono text-xs">
                    {item.degradationPct} %
                  </td>
                  <td className="text-emerald-700 font-semibold font-mono text-xs">
                    +{item.lossReductionPct} %
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        item.status === 'SAFE'
                          ? 'badge-green'
                          : item.status === 'MARGINAL'
                          ? 'badge-amber'
                          : 'badge-red'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
