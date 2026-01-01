import React, { useState } from 'react';
import { MOCK_COMPONENTS } from '../constants';
import { ElectronicComponent } from '../types';
import { Search, Box, Copy, Check } from 'lucide-react';

const ComponentViewer: React.FC = () => {
  const [selectedComp, setSelectedComp] = useState<ElectronicComponent | null>(MOCK_COMPONENTS[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState(false);

  const filteredComponents = MOCK_COMPONENTS.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex h-full gap-6">
      {/* List */}
      <div className="w-1/3 flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search components..."
            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-circuit-accent focus:ring-1 focus:ring-circuit-accent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-2">
          {filteredComponents.map((comp) => (
            <div
              key={comp.id}
              onClick={() => {
                setSelectedComp(comp);
                setCopied(false);
              }}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                selectedComp?.id === comp.id
                  ? 'bg-slate-800 border-circuit-accent/50 shadow-lg shadow-circuit-accent/5'
                  : 'bg-circuit-panel border-slate-700 hover:border-slate-600'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-semibold text-slate-200">{comp.name}</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-700">
                  {comp.category}
                </span>
              </div>
              <p className="text-xs text-slate-500 line-clamp-2">{comp.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Details */}
      <div className="flex-1 bg-circuit-panel rounded-xl border border-slate-700 overflow-hidden flex flex-col">
        {selectedComp ? (
          <>
            <div className="p-6 border-b border-slate-700 bg-slate-800/50">
              <div className="flex items-center gap-3 mb-2">
                <Box className="w-6 h-6 text-circuit-accent" />
                <h2 className="text-2xl font-bold text-white">{selectedComp.name}</h2>
              </div>
              <p className="text-slate-400">{selectedComp.description}</p>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Symbol Preview */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-circuit-accent"></span>
                  Symbol Visualization
                </h3>
                <div className="w-full h-48 bg-slate-900 rounded-lg border border-slate-700 flex items-center justify-center p-8">
                  {selectedComp.symbolPath ? (
                    <svg
                      viewBox="0 0 100 100"
                      className="w-full h-full text-slate-200 stroke-current"
                      fill="none"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d={selectedComp.symbolPath} />
                    </svg>
                  ) : (
                    <span className="text-slate-600 italic">No symbol data available</span>
                  )}
                </div>
              </div>

              {/* YAML Definition */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                  YAML Definition
                </h3>
                <div className="relative group">
                  <div className="absolute top-2 right-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                     <span className="text-[10px] text-slate-500 bg-slate-900 px-2 py-1 rounded border border-slate-700 select-none">Read-Only</span>
                     <button
                        onClick={() => handleCopy(selectedComp.yamlDefinition)}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-md border border-slate-700 transition-colors"
                        title="Copy YAML"
                     >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                     </button>
                  </div>
                  <pre className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-sm font-mono text-emerald-400 overflow-x-auto">
                    <code>{selectedComp.yamlDefinition}</code>
                  </pre>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
            <Box className="w-12 h-12 mb-4 opacity-20" />
            <p>Select a component to view details</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComponentViewer;