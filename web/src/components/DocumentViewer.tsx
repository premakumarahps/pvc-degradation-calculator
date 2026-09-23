import React, { useState } from 'react';
import { BookOpen, Presentation, ChevronLeft, ChevronRight, Download, CheckCircle2, Bookmark, FileText } from 'lucide-react';
import { REPORT_CHAPTERS, PRESENTATION_SLIDES } from '../core/reportData';

export const DocumentViewer: React.FC = () => {
  const [docMode, setDocMode] = useState<'report' | 'slides'>('report');
  const [selectedChapterId, setSelectedChapterId] = useState<string>(REPORT_CHAPTERS[0].id);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);

  const activeChapter =
    REPORT_CHAPTERS.find((c) => c.id === selectedChapterId) || REPORT_CHAPTERS[0];
  const currentSlide = PRESENTATION_SLIDES[currentSlideIndex];

  const handleNextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % PRESENTATION_SLIDES.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + PRESENTATION_SLIDES.length) % PRESENTATION_SLIDES.length);
  };

  return (
    <section id="report" className="py-12 bg-white border-b border-slate-200">
      <div className="container space-y-8">
        {/* Header & Mode Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-800 text-xs font-semibold mb-2">
              <Bookmark className="w-3.5 h-3.5 text-purple-600" />
              <span>Native Academic Reader</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Interactive Research Report & Presentation Deck
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Explore the complete 36-page University Thesis and 20-slide defense presentation seamlessly integrated into the web experience.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200">
              <button
                onClick={() => setDocMode('report')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  docMode === 'report'
                    ? 'bg-white text-sky-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>36-Page Report Reader</span>
              </button>

              <button
                onClick={() => setDocMode('slides')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  docMode === 'slides'
                    ? 'bg-white text-purple-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Presentation className="w-3.5 h-3.5" />
                <span>20-Slide Slide Deck</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mode 1: Interactive Report Reader */}
        {docMode === 'report' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
            {/* Chapters Navigation Sidebar */}
            <div className="lg:col-span-4 space-y-2">
              <div className="flex items-center justify-between px-1 mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Thesis Chapters
                </span>
                <span className="text-[11px] text-slate-400">36 Pages Total</span>
              </div>

              <div className="space-y-1.5">
                {REPORT_CHAPTERS.map((chapter) => {
                  const isSelected = selectedChapterId === chapter.id;
                  return (
                    <button
                      key={chapter.id}
                      onClick={() => setSelectedChapterId(chapter.id)}
                      className={`w-full text-left p-3 rounded-xl border transition-all ${
                        isSelected
                          ? 'bg-sky-50/80 border-sky-300 shadow-xs'
                          : 'bg-white border-slate-200/80 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`font-mono text-xs font-bold ${
                            isSelected ? 'text-sky-700' : 'text-slate-400'
                          }`}
                        >
                          {chapter.number}
                        </span>
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-sky-600 animate-pulse" />
                        )}
                      </div>
                      <p
                        className={`text-sm font-bold mt-0.5 line-clamp-1 ${
                          isSelected ? 'text-sky-950' : 'text-slate-800'
                        }`}
                      >
                        {chapter.title}
                      </p>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                        {chapter.subtitle}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* Quick Download Box */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 mt-4 space-y-2">
                <p className="text-xs font-bold text-slate-800">Download Original Documents</p>
                <div className="flex flex-col gap-1.5">
                  <a
                    href="/docs/PVC_Photodegradation_Project_Report.pdf"
                    download
                    className="flex items-center justify-between text-xs text-sky-700 hover:text-sky-900 bg-white p-2 rounded-lg border border-slate-200 hover:border-sky-300 transition-colors"
                  >
                    <span className="font-semibold flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-red-500" />
                      Thesis Report (PDF, 983 KB)
                    </span>
                    <Download className="w-3 h-3" />
                  </a>
                  <a
                    href="/docs/PVC_Photodegradation_Project_Report.docx"
                    download
                    className="flex items-center justify-between text-xs text-sky-700 hover:text-sky-900 bg-white p-2 rounded-lg border border-slate-200 hover:border-sky-300 transition-colors"
                  >
                    <span className="font-semibold flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-blue-500" />
                      Manuscript (Word DOCX, 27.5 KB)
                    </span>
                    <Download className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Active Chapter Reading Body */}
            <div className="lg:col-span-8 card space-y-6">
              {/* Chapter Header */}
              <div className="border-b border-slate-100 pb-4 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                    Chapter {activeChapter.number}
                  </span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs text-slate-500">{activeChapter.subtitle}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {activeChapter.title}
                </h3>
              </div>

              {/* Executive Highlights */}
              <div className="p-4 rounded-xl bg-sky-50/50 border border-sky-100 space-y-2">
                <p className="text-xs font-bold text-sky-900 uppercase tracking-wide">
                  Core Highlights
                </p>
                <div className="grid grid-cols-1 gap-1.5">
                  {activeChapter.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Main Content Paragraphs */}
              <div className="space-y-3 text-sm text-slate-700 leading-relaxed">
                {activeChapter.content.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              {/* Formulas & Equations (if present) */}
              {activeChapter.equations && activeChapter.equations.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    Governing Kinetic Equations
                  </h4>
                  <div className="grid grid-cols-1 gap-3">
                    {activeChapter.equations.map((eq, i) => (
                      <div key={i} className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                        <p className="text-xs font-bold text-slate-800">{eq.title}</p>
                        <div className="math-block text-xs">{eq.latex}</div>
                        <p className="text-[11px] text-slate-500">{eq.explanation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mode 2: Interactive Slide Deck Viewer */}
        {docMode === 'slides' && (
          <div className="card space-y-6 max-w-4xl mx-auto bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-xl animate-fade-in">
            {/* Top Slide Meta Bar */}
            <div className="flex items-center justify-between border-b border-slate-700/80 pb-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-sky-500/20 text-sky-300 font-mono text-xs font-bold border border-sky-500/30">
                  Slide {currentSlide.slideNumber} of {PRESENTATION_SLIDES.length}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 text-[11px]">
                  {currentSlide.category}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="/docs/PVC_Stabilization_Presentation_Slides.pdf"
                  download
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF Deck (2.08 MB)</span>
                </a>
              </div>
            </div>

            {/* Slide Body */}
            <div className="min-h-[260px] flex flex-col justify-center space-y-4 py-4">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {currentSlide.title}
              </h3>

              <div className="space-y-2.5 pt-2">
                {currentSlide.bullets.map((b, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm sm:text-base text-slate-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0 mt-2" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Slide Notes / Key Takeaway */}
            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-start gap-2.5 text-xs text-sky-200">
              <span className="font-bold text-sky-400 shrink-0">Presenter Insight:</span>
              <span>{currentSlide.takeaway}</span>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-700/80">
              <button
                onClick={handlePrevSlide}
                className="flex items-center gap-1 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Slide</span>
              </button>

              {/* Slide Indicator Dots */}
              <div className="hidden sm:flex items-center gap-1">
                {PRESENTATION_SLIDES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlideIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      currentSlideIndex === idx
                        ? 'w-6 bg-sky-400'
                        : 'bg-slate-700 hover:bg-slate-500'
                    }`}
                    title={`Jump to slide ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={handleNextSlide}
                className="flex items-center gap-1 px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-xs font-bold transition-colors"
              >
                <span>Next Slide</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
