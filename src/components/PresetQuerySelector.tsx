'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

interface PresetQuerySelectorProps {
  onSelectQuery: (query: string) => void;
  activeQuery: string;
}

export interface PresetOption {
  id: string;
  title: string;
  query: string;
  category: 'Retcon' | 'Multi-Hop' | 'Disputed' | 'Canon';
  badgeColor: string;
  description: string;
}

export const PRESET_QUERIES: PresetOption[] = [
  {
    id: 'preset-valemont',
    title: 'Arin\'s Valemont Arrival (Timeline Retcon)',
    query: 'When did Arin Shadowstrider enter Valemont Citadel during the War of the Five Crowns?',
    category: 'Retcon',
    badgeColor: 'bg-purple-950/80 text-purple-300 border-purple-700/60',
    description: '1st Edition Chronicles claims Winter 734, but Garrison Ledgers & Revised Edition prove Autumn 735.'
  },
  {
    id: 'preset-lyra',
    title: 'Meeting Lyra Frostweaver (Ballad Retcon)',
    query: 'Did Arin Shadowstrider meet Lyra Frostweaver before the Siege of Valemont?',
    category: 'Retcon',
    badgeColor: 'bg-purple-950/80 text-purple-300 border-purple-700/60',
    description: 'Folklore ballad claims 732, but Arin\'s private journal proves they first met in late 734.'
  },
  {
    id: 'preset-starfire',
    title: 'Starfire Blade Custody (Multi-Hop Deduction)',
    query: 'Did Arin Shadowstrider possess the Starfire Blade during the Battle of Northreach?',
    category: 'Multi-Hop',
    badgeColor: 'bg-indigo-950/80 text-indigo-300 border-indigo-700/60',
    description: 'Combines 733 recovery journal, 735 battle command logs, and 738 treaty surrender codex.'
  },
  {
    id: 'preset-crown',
    title: 'Sunken Crown Forging (Disputed Canon)',
    query: 'Who forged the Sunken Crown of Eldoria?',
    category: 'Disputed',
    badgeColor: 'bg-amber-950/80 text-amber-300 border-amber-700/60',
    description: 'Ballad claims Archmage Morvath, Archives claim ancient Elven smiths. Conflicting metallurgy.'
  },
  {
    id: 'preset-treaty',
    title: 'Treaty Signatories (Verified Canon)',
    query: 'Who signed the Treaty of Eldoria in 738?',
    category: 'Canon',
    badgeColor: 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60',
    description: 'Straightforward verified primary canon from the Annals of Aethelgard.'
  }
];

export const PresetQuerySelector: React.FC<PresetQuerySelectorProps> = ({ onSelectQuery, activeQuery }) => {
  return (
    <div className="glass-panel p-4 rounded-2xl mb-6 border border-purple-900/30">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <h2 className="text-sm font-semibold text-slate-200 tracking-wide uppercase font-heading">
            Preset Lore Verification Scenarios
          </h2>
        </div>
        <span className="text-xs text-slate-400 font-mono">
          Click to load & verify evidence graph
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {PRESET_QUERIES.map((preset) => {
          const isSelected = activeQuery === preset.query;
          return (
            <button
              key={preset.id}
              onClick={() => onSelectQuery(preset.query)}
              className={`p-3 rounded-xl text-left transition-all relative overflow-hidden group flex flex-col justify-between ${
                isSelected
                  ? 'bg-purple-950/70 border-purple-500/80 shadow-lg shadow-purple-950/50 ring-1 ring-purple-500/50'
                  : 'bg-slate-900/60 hover:bg-slate-850 border-slate-800 hover:border-slate-700'
              } border`}
            >
              <span className="block">
                <span className="flex items-center justify-between gap-2 mb-1.5">
                  <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border ${preset.badgeColor}`}>
                    {preset.category}
                  </span>
                  {isSelected && (
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                    </span>
                  )}
                </span>
                <span className="block text-xs font-semibold text-slate-100 group-hover:text-purple-200 transition-colors">
                  {preset.title}
                </span>
                <span className="block text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {preset.description}
                </span>
              </span>

              <span className="block mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono text-slate-500 group-hover:text-slate-400">
                <span className="truncate max-w-[200px]">"{preset.query}"</span>
                <span className="text-purple-400 group-hover:translate-x-0.5 transition-transform">→</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
