import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ComponentViewer from './components/ComponentViewer';
import SymbolGallery from './components/SymbolGallery';
import AICircuitDesigner from './components/AICircuitDesigner';
import SchemaValidator from './components/SchemaValidator';
import { View } from './types';
import { Activity } from 'lucide-react';

interface DashboardProps {
  onChangeView: (v: View) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onChangeView }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div 
        onClick={() => onChangeView(View.COMPONENTS)}
        className="bg-circuit-panel p-6 rounded-xl border border-slate-700 hover:border-circuit-accent/50 cursor-pointer transition-all group"
      >
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
            <Activity className="w-6 h-6 text-blue-400" />
          </div>
          <span className="text-xs font-mono text-slate-500 bg-slate-900 px-2 py-1 rounded">24 ITEMS</span>
        </div>
        <h3 className="text-lg font-bold text-slate-200 mb-1">Component Library</h3>
        <p className="text-sm text-slate-400">Manage definitions for resistors, capacitors, and ICs.</p>
      </div>

      <div 
        onClick={() => onChangeView(View.AI_DESIGNER)}
        className="bg-gradient-to-br from-circuit-panel to-circuit-accent/5 p-6 rounded-xl border border-slate-700 hover:border-circuit-accent/50 cursor-pointer transition-all group relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-circuit-accent/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
        <div className="flex justify-between items-start mb-4">
           <div className="p-3 bg-circuit-accent/10 rounded-lg group-hover:bg-circuit-accent/20 transition-colors">
            <svg className="w-6 h-6 text-circuit-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-xs font-mono text-circuit-accent bg-circuit-accent/10 px-2 py-1 rounded border border-circuit-accent/20">BETA</span>
        </div>
        <h3 className="text-lg font-bold text-slate-200 mb-1">AI Circuit Designer</h3>
        <p className="text-sm text-slate-400">Generate netlists and schematics using Gemini 3.0.</p>
      </div>

      <div 
        onClick={() => onChangeView(View.VALIDATOR)}
        className="bg-circuit-panel p-6 rounded-xl border border-slate-700 hover:border-circuit-accent/50 cursor-pointer transition-all group"
      >
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20 transition-colors">
            <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <h3 className="text-lg font-bold text-slate-200 mb-1">Schema Validator</h3>
        <p className="text-sm text-slate-400">Verify component definitions against strict JSON schemas.</p>
      </div>
    </div>

    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 text-center">
        <h2 className="text-xl font-bold text-slate-300 mb-2">Welcome to Electronic Legion Hub</h2>
        <p className="text-slate-500 max-w-2xl mx-auto">
            This system serves as the structured backend reference for AI-assisted circuit generation. 
            All symbols and components are validated for machine readability.
        </p>
    </div>
  </div>
);

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);

  const renderContent = () => {
    switch (currentView) {
      case View.DASHBOARD:
        return <Dashboard onChangeView={setCurrentView} />;
      case View.COMPONENTS:
        return <ComponentViewer />;
      case View.SYMBOLS:
        return <SymbolGallery />;
      case View.AI_DESIGNER:
        return <AICircuitDesigner />;
      case View.VALIDATOR:
        return <SchemaValidator />;
      default:
        return <Dashboard onChangeView={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-circuit-dark font-sans text-slate-200 selection:bg-circuit-accent/30 selection:text-circuit-accent">
      <Sidebar currentView={currentView} onChangeView={setCurrentView} />
      
      <main className="ml-64 p-8 h-screen overflow-hidden flex flex-col">
        <header className="mb-8 flex items-center justify-between">
           <div>
             <h1 className="text-3xl font-bold text-white tracking-tight">
               {currentView === View.DASHBOARD && 'Mission Control'}
               {currentView === View.COMPONENTS && 'Component Database'}
               {currentView === View.SYMBOLS && 'Symbol Assets'}
               {currentView === View.AI_DESIGNER && 'AI Workbench'}
               {currentView === View.VALIDATOR && 'Validation Tool'}
             </h1>
             <p className="text-slate-500 mt-1">
                {currentView === View.DASHBOARD && 'System Overview & Quick Actions'}
                {currentView === View.COMPONENTS && 'View and manage component YAML definitions'}
                {currentView === View.SYMBOLS && 'Browse machine-readable SVG symbols'}
                {currentView === View.AI_DESIGNER && 'Assistive generation powered by Google Gemini'}
                {currentView === View.VALIDATOR && 'Ensure data consistency and reliability'}
             </p>
           </div>
           
           <div className="flex items-center gap-4">
              <div className="px-3 py-1 bg-slate-800 rounded-full border border-slate-700">
                  <span className="text-xs text-slate-400 font-mono">ENV: DEV</span>
              </div>
           </div>
        </header>

        <div className="flex-1 min-h-0">
            {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;