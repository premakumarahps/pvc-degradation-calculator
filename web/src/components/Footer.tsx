import React from 'react';
import { Beaker, ExternalLink, ArrowUp } from 'lucide-react';
import { TEAM_MEMBERS } from '../core/reportData';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
      <div className="container space-y-10">
        {/* Main Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Brand & Project Info */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-emerald-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                <Beaker className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-white font-bold text-base tracking-tight">
                  PVC Photodegradation Kinetics Platform
                </h3>
                <p className="text-xs text-slate-400">
                  University of Moratuwa • Materials Science & Engineering
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Computational research project developing stiff ordinary differential equation solvers
              and predicting optimal Tinuvin 770 HALS stabilizer formulations to protect outdoor PVC
              infrastructure against ultraviolet photodegradation.
            </p>

            <div className="pt-2">
              <span className="badge badge-green text-[10px]">
                Module: MT2230 Kinetics of Materials • Grade B+
              </span>
            </div>
          </div>

          {/* Academic Team Members */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Project Research Group (Group 1)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-1.5 text-xs text-slate-400">
              {TEAM_MEMBERS.map((member) => (
                <div key={member.index} className="flex items-center gap-1.5">
                  <span className="font-mono text-slate-500 text-[11px]">{member.index}</span>
                  <span
                    className={
                      member.isLeadAuthor ? 'text-sky-300 font-semibold' : 'text-slate-300'
                    }
                  >
                    {member.name.split(' ')[0]}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-sky-400 pt-1">
              ★ Premakumara H.P.S. (210494D) - Lead Software Developer & Kinetics Analyst
            </p>
          </div>

          {/* Quick Links & Back to Top */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>
                <a href="#simulator" className="hover:text-white transition-colors">
                  Degradation Simulator & Optimizer
                </a>
              </li>
              <li>
                <a href="#mechanisms" className="hover:text-white transition-colors">
                  Chemical Degradation Mechanisms
                </a>
              </li>
              <li>
                <a href="#experimental" className="hover:text-white transition-colors">
                  Experimental ASTM G154 Data
                </a>
              </li>
              <li>
                <a href="#report" className="hover:text-white transition-colors">
                  36-Page Report & 20-Slide Deck
                </a>
              </li>
              <li>
                <a href="#downloads" className="hover:text-white transition-colors">
                  Software Suite ZIP & PDFs
                </a>
              </li>
            </ul>

            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 pt-2 transition-colors"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>Back to Top</span>
            </button>
          </div>
        </div>

        {/* Bottom Attribution Line */}
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© 2024–2026 Department of Materials Science & Engineering, University of Moratuwa.</p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/premakumarahps/pvc-degradation-calculator"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-300 flex items-center gap-1"
            >
              <span>GitHub Repository</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a href="/" className="hover:text-slate-300 flex items-center gap-1">
              <span>Main Portfolio</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
