import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SimulatorHub } from './components/Simulator/SimulatorHub';
import { MechanismSection } from './components/MechanismSection';
import { ExperimentalData } from './components/ExperimentalData';
import { DocumentViewer } from './components/DocumentViewer';
import { DownloadHub } from './components/DownloadHub';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('simulator');

  const scrollToSection = (id: string) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Sticky Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          scrollToSection(tab);
        }}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onStartSimulation={() => scrollToSection('simulator')}
          onExploreMechanisms={() => scrollToSection('mechanisms')}
        />

        {/* 1. Degradation Simulator Hub (Web Port of Desktop App + Comparison) */}
        <SimulatorHub />

        {/* 2. Chemical Mechanisms (Without Stabilizer vs With HALS) */}
        <MechanismSection />

        {/* 3. Experimental Laboratory Weathering Data */}
        <ExperimentalData />

        {/* 4. Native Academic Report Reader & Presentation Deck */}
        <DocumentViewer />

        {/* 5. Downloads & Desktop Software Suite */}
        <DownloadHub />
      </main>

      {/* Comprehensive Footer */}
      <Footer />
    </div>
  );
};

export default App;
