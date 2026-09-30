'use client';

import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, Layers, Award, CheckCircle, HelpCircle } from 'lucide-react';
import { ResolutionResult, VerdictStatus } from '../lib/canon/resolver';

interface VerdictBannerProps {
  resolution: ResolutionResult;
}

export const VerdictBanner: React.FC<VerdictBannerProps> = ({ resolution }) => {
  const getVerdictBadge = (status: VerdictStatus) => {
    switch (status) {
      case 'CANON_VERIFIED':
        return {
          label: 'VERIFIED CANON',
          bg: 'bg-emerald-950/90 text-emerald-300 border-emerald-500/80 shadow-emerald-950/40',
          icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
          glowClass: 'border-emerald-500/50 shadow-emerald-900/20'
        };
      case 'RETCON_OVERRIDDEN':
        return {
          label: 'RETCON DETECTED & RESOLVED',
          bg: 'bg-purple-950/90 text-purple-300 border-purple-500/80 shadow-purple-950/40',
          icon: <ShieldAlert className="w-5 h-5 text-purple-400" />,
          glowClass: 'border-purple-500/50 shadow-purple-900/20'
        };
      case 'MULTI_HOP_VALIDATED':
        return {
          label: 'MULTI-HOP CANON DEDUCTION',
          bg: 'bg-indigo-950/90 text-indigo-300 border-indigo-500/80 shadow-indigo-950/40',
          icon: <Layers className="w-5 h-5 text-indigo-400" />,
          glowClass: 'border-indigo-500/50 shadow-indigo-900/20'
        };
      case 'DISPUTED_UNRESOLVED':
        return {
          label: 'GENUINELY DISPUTED / UNRESOLVED',
          bg: 'bg-amber-950/90 text-amber-300 border-amber-500/80 shadow-amber-950/40',
          icon: <AlertTriangle className="w-5 h-5 text-amber-400" />,
          glowClass: 'border-amber-500/50 shadow-amber-900/20'
        };
      case 'NOT_CANON':
      default:
        return {
          label: 'NO CANON EVIDENCE',
          bg: 'bg-slate-900 text-slate-400 border-slate-700 shadow-slate-950/40',
          icon: <HelpCircle className="w-5 h-5 text-slate-400" />,
          glowClass: 'border-slate-800'
        };
    }
  };

  const badge = getVerdictBadge(resolution.verdictStatus);

  return (
    <div className={`glass-panel p-6 rounded-2xl mb-6 border transition-all shadow-xl ${badge.glowClass}`}>
      
      {/* Top Banner Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
            {badge.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full border shadow-md ${badge.bg}`}>
                {badge.label}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Evaluated against primary canon manuscripts, ledgers & revised editions
            </p>
          </div>
        </div>

        {/* Confidence Gauge */}
        <div className="flex items-center gap-3 bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-800">
          <div className="text-right">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Confidence</div>
            <div className="text-lg font-bold font-mono text-purple-300">
              {resolution.confidence}%
            </div>
          </div>
          <div className="w-12 bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700">
            <div
              className={`h-full rounded-full ${
                resolution.confidence > 80 ? 'bg-emerald-400' : resolution.confidence > 60 ? 'bg-indigo-400' : 'bg-amber-400'
              }`}
              style={{ width: `${resolution.confidence}%` }}
            />
          </div>
        </div>
      </div>

      {/* Primary Answer Box */}
      <div className="bg-slate-900/90 p-4 rounded-xl border border-purple-900/40 mb-4 shadow-inner">
        <h3 className="text-xs font-mono uppercase text-slate-400 mb-1.5 flex items-center gap-1.5">
          <Award className="w-3.5 h-3.5 text-purple-400" />
          <span>Definitive Answer</span>
        </h3>
        <p className="text-base sm:text-lg font-semibold text-slate-100 leading-relaxed font-sans">
          {resolution.primaryAnswer}
        </p>
      </div>

      {/* Step-by-Step Reasoning */}
      <div>
        <h4 className="text-xs font-mono uppercase text-slate-400 mb-2.5 tracking-wider">
          Evidence Resolution Steps:
        </h4>
        <div className="space-y-2">
          {resolution.detailedReasoning.map((step, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2.5 text-xs text-slate-300 bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/80"
            >
              <span className="font-mono text-[10px] text-purple-400 font-bold bg-purple-950/80 px-1.5 py-0.5 rounded border border-purple-800/50 mt-0.5">
                0{idx + 1}
              </span>
              <p className="leading-relaxed font-sans">{step}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
