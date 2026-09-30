'use client';

import React, { useState } from 'react';
import { Search, ShieldAlert, ArrowRight, RefreshCw, UserCheck } from 'lucide-react';
import { AnalyzedQuestion } from '../lib/canon/analyzer';

interface QueryInputProps {
  currentQuery: string;
  onQuerySubmit: (query: string) => void;
  analysis: AnalyzedQuestion;
  isAnalyzing: boolean;
}

export const QueryInput: React.FC<QueryInputProps> = ({
  currentQuery,
  onQuerySubmit,
  analysis,
  isAnalyzing
}) => {
  const [inputVal, setInputVal] = useState(currentQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      onQuerySubmit(inputVal.trim());
    }
  };

  // Sync if currentQuery changes from preset
  React.useEffect(() => {
    setInputVal(currentQuery);
  }, [currentQuery]);

  return (
    <div className="glass-panel p-5 rounded-2xl mb-6 border border-slate-800">
      <form onSubmit={handleSubmit} className="relative mb-3">
        <div className="relative flex items-center">
          <div className="absolute left-4 text-purple-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Ask a canon lore question (e.g., 'When did Arin enter Valemont Citadel?')..."
            className="w-full bg-slate-900/90 text-slate-100 placeholder-slate-500 pl-12 pr-32 py-3.5 rounded-xl border border-purple-900/50 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 text-sm font-sans transition-all shadow-inner"
          />
          <button
            type="submit"
            disabled={isAnalyzing}
            className="absolute right-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-purple-900/40 disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <span>Resolve Canon</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Entity & Keyword Extraction Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-slate-400 font-mono text-[11px] uppercase tracking-wider">
            Recognized Entities:
          </span>
          {analysis.entities.length > 0 ? (
            analysis.entities.map((entity, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 rounded-md bg-purple-950/60 text-purple-300 border border-purple-800/50 font-medium text-[11px] flex items-center gap-1"
              >
                <UserCheck className="w-3 h-3 text-purple-400" />
                {entity}
              </span>
            ))
          ) : (
            <span className="text-slate-500 italic text-[11px]">None detected</span>
          )}
        </div>

        <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
          {analysis.relationship && (
            <span>
              Predicate: <strong className="text-slate-200">{analysis.relationship}</strong>
            </span>
          )}
          {analysis.timeConstraint && (
            <span>
              Timeframe: <strong className="text-amber-300">{analysis.timeConstraint}</strong>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
