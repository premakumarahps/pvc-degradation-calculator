import React, { useState } from 'react';
import { BookOpen, Presentation, ChevronLeft, ChevronRight, Download, CheckCircle2, Bookmark, FileText, Maximize2, X } from 'lucide-react';
import { REPORT_CHAPTERS, PRESENTATION_SLIDES } from '../core/reportData';

export const DocumentViewer: React.FC = () => {
  const [docMode, setDocMode] = useState<'slides' | 'report'>('slides');
  const [selectedChapterId, setSelectedChapterId] = useState<string>(REPORT_CHAPTERS[0].id);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  const activeChapter =
    REPORT_CHAPTERS.find((c) => c.id === selectedChapterId) || REPORT_CHAPTERS[0];
  const currentSlide = PRESENTATION_SLIDES[currentSlideIndex];

  const handleNextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % PRESENTATION_SLIDES.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + PRESENTATION_SLIDES.length) % PRESENTATION_SLIDES.length);
  };

  const slideImagePath = `/slides/slide_${String(currentSlideIndex + 1).padStart(2, '0')}.png`;

  return (
    <section id="report" className="py-10 bg-white border-b border-slate-200">
      <div className="container space-y-6">
        {/* Header & Mode Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-800 text-xs font-semibold mb-1.5">
              <Bookmark className="w-3.5 h-3.5 text-purple-600" />
              <span>Authentic Academic Deliverables</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Presentation Slide Deck &amp; 36-Page Thesis Reader
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Review the original 20-slide defense presentation with full graphics and read the comprehensive research chapters.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200">
              <button
                onClick={() => setDocMode('slides')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  docMode === 'slides'
                    ? 'bg-white text-purple-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Presentation className="w-3.5 h-3.5" />
                <span>20-Slide Defense Deck</span>
              </button>

              <button
                onClick={() => setDocMode('report')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  docMode === 'report'
                    ? 'bg-white text-sky-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>36-Page Thesis Reader</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mode 1: Real Presentation Slide Viewer with High-Res Graphics */}
        {docMode === 'slides' && (
          <div className="space-y-4 animate-fade-in max-w-5xl mx-auto">
            {/* Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-100/90 border border-slate-200">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-purple-100 text-purple-800 font-mono text-xs font-bold border border-purple-200">
                  Slide {currentSlide.slideNumber} of {PRESENTATION_SLIDES.length}
                </span>
                <span className="text-xs font-bold text-slate-800 hidden sm:inline">
                  {currentSlide.title}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsFullScreen(true)}
                  className="btn btn-secondary text-xs py-1.5 px-2.5 flex items-center gap-1"
                  title="Expand to Fullscreen"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Zoom Slide</span>
                </button>

                <a
                  href="/docs/PVC_Stabilization_Presentation_Slides.pdf"
                  download
                  className="btn btn-primary text-xs py-1.5 px-3"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF Deck</span>
                </a>
              </div>
            </div>

            {/* Main Graphical Slide Display */}
            <div className="relative group rounded-2xl overflow-hidden bg-slate-900 border border-slate-300 shadow-xl flex items-center justify-center">
              <img
                src={slideImagePath}
                alt={`Slide ${currentSlide.slideNumber}: ${currentSlide.title}`}
                className="w-full h-auto max-h-[580px] object-contain cursor-pointer"
                onClick={() => setIsFullScreen(true)}
              />

              {/* Prev / Next Overlay Buttons */}
              <button
                onClick={handlePrevSlide}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 opacity-80 group-hover:opacity-100"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={handleNextSlide}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 opacity-80 group-hover:opacity-100"
                aria-label="Next Slide"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Presenter Notes & Takeaway Card */}
            <div className="card p-4 space-y-2 bg-slate-50/80 border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Slide Content &amp; Presenter Notes
                </span>
                <span className="badge badge-purple text-[10px]">{currentSlide.category}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                <strong>Presenter Takeaway: </strong> {currentSlide.takeaway}
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {currentSlide.bullets.map((b, i) => (
                  <span key={i} className="inline-flex items-center gap-1 text-[11px] text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                    <span className="w-1 h-1 rounded-full bg-purple-500" />
                    {b}
                  </span>
                ))}
              </div>
            </div>

            {/* 20-Slide Thumbnail Strip Carousel */}
            <div className="space-y-1.5 pt-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                Slide Navigator (Click to Jump)
              </span>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                {PRESENTATION_SLIDES.map((s, idx) => (
                  <button
                    key={s.slideNumber}
                    onClick={() => setCurrentSlideIndex(idx)}
                    className={`shrink-0 w-24 sm:w-28 rounded-lg overflow-hidden border-2 transition-all ${
                      currentSlideIndex === idx
                        ? 'border-purple-600 ring-2 ring-purple-300 shadow-md scale-105'
                        : 'border-slate-200 opacity-60 hover:opacity-100 hover:border-slate-400'
                    }`}
                  >
                    <img
                      src={`/slides/slide_${String(s.slideNumber).padStart(2, '0')}.png`}
                      alt={`Thumb ${s.slideNumber}`}
                      className="w-full h-auto object-cover"
                    />
                    <div className="bg-slate-900 text-white text-[10px] py-0.5 text-center font-mono">
                      #{s.slideNumber}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Fullscreen Modal Lightbox */}
            {isFullScreen && (
              <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-6xl flex justify-between items-center text-white mb-3">
                  <span className="font-bold text-sm">
                    Slide {currentSlide.slideNumber}: {currentSlide.title}
                  </span>
                  <button
                    onClick={() => setIsFullScreen(false)}
                    className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="relative max-w-6xl max-h-[85vh] flex items-center justify-center">
                  <img
                    src={slideImagePath}
                    alt={`Slide ${currentSlide.slideNumber}`}
                    className="max-w-full max-h-[85vh] object-contain rounded-xl"
                  />
                  <button
                    onClick={handlePrevSlide}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black/90"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={handleNextSlide}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black/90"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Mode 2: Interactive 36-Page Report Reader with Real Figures */}
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

              {/* Download Links */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 mt-4 space-y-2">
                <p className="text-xs font-bold text-slate-800">Download Official Thesis Files</p>
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

              {/* Highlights */}
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

              {/* Main Content */}
              <div className="space-y-3 text-sm text-slate-700 leading-relaxed">
                {activeChapter.content.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              {/* Embedded Real Figures for Chapter Context */}
              {selectedChapterId === 'abstract-intro' && (
                <div className="space-y-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-xs font-bold text-slate-700">Figure 05: UV Degraded PVC Pipes in Field Service</p>
                  <img
                    src="/images/fig_pvc_pipes.png"
                    alt="UV Degraded PVC Pipes"
                    className="w-full max-h-72 object-contain rounded-lg border border-slate-200"
                  />
                  <p className="text-[11px] text-slate-500 italic text-center">
                    Surface yellowing, embrittlement, and micro-cracking observed on uninhibited outdoor PVC pipes.
                  </p>
                </div>
              )}

              {selectedChapterId === 'experimental-validation' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div>
                    <p className="text-xs font-bold text-slate-700 mb-1">Figure 08: ASTM G154 Chamber</p>
                    <img
                      src="/images/fig_test_chamber.png"
                      alt="ASTM G154 Test Chamber"
                      className="w-full h-48 object-contain rounded-lg border border-slate-200 bg-white"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-700 mb-1">Figure 08: FTIR Spectra Analysis</p>
                    <img
                      src="/images/fig_ftir_spectra.png"
                      alt="FTIR Spectra of PVC"
                      className="w-full h-48 object-contain rounded-lg border border-slate-200 bg-white"
                    />
                  </div>
                </div>
              )}

              {/* Kinetic Equations */}
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
      </div>
    </section>
  );
};
