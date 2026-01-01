import React from 'react';
import { MOCK_SYMBOLS } from '../constants';

const SymbolGallery: React.FC = () => {
  return (
    <div className="h-full overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Symbol Library</h2>
        <p className="text-slate-400">Validated SVG assets for circuit rendering and documentation.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {MOCK_SYMBOLS.map((symbol) => (
          <div
            key={symbol.id}
            className="group relative bg-circuit-panel border border-slate-700 rounded-xl overflow-hidden hover:border-circuit-accent/50 transition-all duration-300 hover:shadow-lg hover:shadow-circuit-accent/10"
          >
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="text-xs bg-circuit-accent text-slate-900 font-bold px-2 py-1 rounded hover:bg-white transition-colors">
                COPY SVG
              </button>
            </div>
            
            <div className="aspect-square bg-slate-900 p-8 flex items-center justify-center border-b border-slate-700/50">
              <div 
                className="w-full h-full text-slate-300 stroke-current"
                dangerouslySetInnerHTML={{ __html: symbol.svgContent }} 
              />
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold text-slate-200">{symbol.name}</h3>
              <p className="text-xs text-slate-500 mt-1 font-mono uppercase">{symbol.category}</p>
              <div className="mt-3 text-[10px] text-slate-600 font-mono truncate">
                ID: {symbol.id}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SymbolGallery;
