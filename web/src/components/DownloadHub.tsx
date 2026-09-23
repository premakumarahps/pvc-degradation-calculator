import React from 'react';
import { Download, Monitor, FileText, Presentation, Code2 } from 'lucide-react';

export const DownloadHub: React.FC = () => {
  const downloads = [
    {
      id: 'desktop-zip',
      title: 'Windows Desktop Software Suite',
      badge: 'Standalone Executable + Source',
      badgeColor: 'badge-green',
      icon: Monitor,
      format: 'ZIP Archive (47.1 KB)',
      url: '/downloads/PVC_Degradation_Calculator_Desktop_Suite.zip',
      desc: 'Includes compiled PVC_Degradation_Optimizer.exe (PyQt6 Fusion), batch launcher, full Python source code, and offline guides.'
    },
    {
      id: 'report-pdf',
      title: 'University Research Report',
      badge: 'Academic Thesis (36 Pages)',
      badgeColor: 'badge-blue',
      icon: FileText,
      format: 'Adobe PDF (983 KB)',
      url: '/docs/PVC_Photodegradation_Project_Report.pdf',
      desc: 'Complete 36-page report: introduction, photodegradation mechanisms, Denisov cycle ODE derivations, ASTM G154 data, and references.'
    },
    {
      id: 'report-docx',
      title: 'Project Report Manuscript',
      badge: 'Editable Word Document',
      badgeColor: 'badge-purple',
      icon: FileText,
      format: 'Microsoft Word (27.5 KB)',
      url: '/docs/PVC_Photodegradation_Project_Report.docx',
      desc: 'Original editable submission draft with tables, citations, and mathematical formulas.'
    },
    {
      id: 'slides-pdf',
      title: 'Project Defense Slide Deck',
      badge: 'Presentation Slides (20 Slides)',
      badgeColor: 'badge-amber',
      icon: Presentation,
      format: 'Presentation PDF (2.08 MB)',
      url: '/docs/PVC_Stabilization_Presentation_Slides.pdf',
      desc: 'High-resolution defense slides covering market relevance, kinetics flowcharts, accelerated testing data, and conclusion.'
    }
  ];

  return (
    <section id="downloads" className="py-12 bg-slate-50/50 border-b border-slate-200">
      <div className="container space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold">
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>Open Access Engineering Repository</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Download Project Deliverables & Software
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            All research materials, slide presentations, and the standalone desktop engineering software suite are available for direct offline download.
          </p>
        </div>

        {/* Downloads Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {downloads.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="card card-interactive flex flex-col justify-between p-5 space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`badge ${item.badgeColor} text-[10px]`}>{item.badge}</span>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{item.title}</h3>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">{item.format}</p>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                </div>

                <a
                  href={item.url}
                  download
                  className="btn btn-secondary w-full py-2 text-xs font-bold justify-between"
                >
                  <span>Download Deliverable</span>
                  <Download className="w-4 h-4 text-sky-600" />
                </a>
              </div>
            );
          })}
        </div>

        {/* GitHub Source Link Banner */}
        <div className="max-w-4xl mx-auto p-4 rounded-xl bg-white border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">
                Open-Source Git Repository
              </p>
              <p className="text-xs text-slate-500">
                Explore the complete Python desktop source code and Vite/React web platform on GitHub.
              </p>
            </div>
          </div>

          <a
            href="https://github.com/premakumarahps/pvc-degradation-calculator"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary text-xs py-2 px-4 whitespace-nowrap shadow-xs"
          >
            <span>View on GitHub</span>
          </a>
        </div>
      </div>
    </section>
  );
};
