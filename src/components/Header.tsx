'use client';

import React from 'react';
import { BookOpen, ShieldCheck, Sparkles, Database, GitBranch, Layers } from 'lucide-react';

interface HeaderProps {
  activeTab: 'resolver' | 'explorer' | 'graph' | 'sanity';
  setActiveTab: (tab: 'resolver' | 'explorer' | 'graph' | 'sanity') => void;
  isSanityConnected: boolean;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, isSanityConnected }) => {
  return (
    <header className="border-b border-purple-900/40 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/20 border border-purple-400/30">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold font-heading bg-gradient-to-r from-amber-200 via-purple-200 to-indigo-100 bg-clip-text text-transparent">
                CANON KEEPER
              </h1>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-purple-950/80 text-purple-300 border border-purple-700/50">
                v1.0 Lore AI
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Sanity Knowledge Graph & Canon Verification Engine
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs font-medium">
          <button
            onClick={() => setActiveTab('resolver')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'resolver'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-900/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Resolution Engine</span>
          </button>

          <button
            onClick={() => setActiveTab('graph')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'graph'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-900/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>Evidence Graph</span>
          </button>

          <button
            onClick={() => setActiveTab('explorer')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'explorer'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-900/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Universe Explorer</span>
          </button>

          <button
            onClick={() => setActiveTab('sanity')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'sanity'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-900/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Sanity CMS & MCP</span>
          </button>
        </nav>

        {/* Connection status */}
        <div className="flex items-center gap-2 text-xs">
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${
            isSanityConnected 
              ? 'bg-emerald-950/60 text-emerald-300 border-emerald-700/50' 
              : 'bg-amber-950/60 text-amber-300 border-amber-700/50'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isSanityConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span className="font-mono text-[11px]">
              {isSanityConnected ? 'Sanity Live API' : 'Memory Knowledge Base'}
            </span>
          </div>
        </div>

      </div>
    </header>
  );
};
