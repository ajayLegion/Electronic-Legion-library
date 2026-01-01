import React from 'react';
import { View } from '../types';
import { LayoutDashboard, Database, Cpu, Bot, FileCheck, Zap } from 'lucide-react';

interface SidebarProps {
  currentView: View;
  onChangeView: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView }) => {
  const menuItems = [
    { id: View.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: View.COMPONENTS, label: 'Components', icon: Database },
    { id: View.SYMBOLS, label: 'Symbol Library', icon: Cpu },
    { id: View.AI_DESIGNER, label: 'AI Designer', icon: Bot },
    { id: View.VALIDATOR, label: 'Validator', icon: FileCheck },
  ];

  return (
    <aside className="w-64 bg-circuit-panel border-r border-slate-700 flex flex-col h-screen fixed left-0 top-0 z-10">
      <div className="p-6 flex items-center gap-3 border-b border-slate-700">
        <div className="bg-circuit-accent/20 p-2 rounded-lg">
          <Zap className="w-6 h-6 text-circuit-accent" />
        </div>
        <div>
          <h1 className="font-bold text-slate-100 tracking-wider">LEGION</h1>
          <p className="text-xs text-slate-400 font-mono">LIBRARY v0.2</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                isActive
                  ? 'bg-circuit-accent/10 text-circuit-accent border border-circuit-accent/20'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-circuit-accent' : 'text-slate-500 group-hover:text-slate-300'}`} />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-6 border-t border-slate-700">
        <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50">
          <p className="text-xs text-slate-500 mb-1">SYSTEM STATUS</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-circuit-success animate-pulse"></span>
            <span className="text-xs text-circuit-success font-mono">ONLINE</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
