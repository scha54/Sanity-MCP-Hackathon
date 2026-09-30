'use client';

import React from 'react';
import { RetrievedEvidence } from '../lib/canon/retriever';
import { ResolutionResult } from '../lib/canon/resolver';
import { AlertCircle, BookOpen, Clock, ShieldCheck, ArrowRight, ShieldAlert, Award, FileText } from 'lucide-react';

interface ConflictBreakdownProps {
  evidence: RetrievedEvidence;
  resolution: ResolutionResult;
}

export const ConflictBreakdown: React.FC<ConflictBreakdownProps> = ({ evidence, resolution }) => {
  return (
    <div className="space-y-6 mb-6">
      
      {/* Side-by-Side Claim & Retcon Matrix */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-4 h-4 text-purple-400" />
          <h2 className="text-sm font-semibold text-slate-200 font-heading">
            Retcon & Evidence Audit Matrix
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          
          {/* Active / Canon Claims */}
          <div className="bg-slate-900/80 p-4 rounded-xl border border-emerald-900/40">
            <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-mono uppercase font-bold text-emerald-300">
                  Active / Canon Evidence ({evidence.matchedClaims.filter(c => c.canonStatus === 'CANON').length})
                </h3>
              </div>
              <span className="text-[10px] font-mono bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800">
                Primary Canon
              </span>
            </div>

            <div className="space-y-3">
              {evidence.matchedClaims.filter(c => c.canonStatus === 'CANON').map((claim) => (
                <div key={claim._id} className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-mono text-slate-400">ID: {claim._id}</span>
                    <span className="text-[10px] font-mono bg-emerald-900/80 text-emerald-200 px-1.5 py-0.5 rounded">
                      Confidence: {claim.confidence}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-100 font-medium leading-relaxed">
                    "{claim.statement}"
                  </p>
                  <div className="mt-2 text-[10px] font-mono text-slate-400 flex items-center justify-between border-t border-slate-900 pt-1.5">
                    <span>Source: {claim.sourceLocation}</span>
                    <span className="text-amber-300">{claim.timeline}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

            {/* Retconned / Contradicted Claims */}
          <div className="bg-slate-900/80 p-4 rounded-xl border border-purple-900/40">
            {(() => {
              const invalidClaims = Array.from(
                new Map(
                  [...evidence.supersededClaims, ...evidence.contradictingClaims].map(c => [c._id, c])
                ).values()
              );
              return (
                <>
                  <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-purple-400" />
                      <h3 className="text-xs font-mono uppercase font-bold text-purple-300">
                        Retconned / Invalidated Claims ({invalidClaims.length})
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono bg-purple-950 text-purple-400 px-2 py-0.5 rounded border border-purple-800">
                      Superseded
                    </span>
                  </div>

                  <div className="space-y-3">
                    {invalidClaims.length > 0 ? (
                      invalidClaims.map((claim) => (
                        <div key={claim._id} className="bg-slate-950/70 p-3 rounded-lg border border-purple-900/40">
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span className="text-[10px] font-mono text-purple-400 font-semibold uppercase">
                              [{claim.canonStatus}]
                            </span>
                            <span className="text-[10px] font-mono text-slate-500">
                              {claim._id}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 italic leading-relaxed line-through decoration-purple-500/60">
                            "{claim.statement}"
                          </p>
                          <div className="mt-2 text-[10px] font-mono text-slate-400 flex items-center justify-between border-t border-slate-900 pt-1.5">
                            <span>{claim.notes}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-slate-500 italic p-4 text-center">
                        No superseded or retconned claims found for this query.
                      </div>
                    )}
                  </div>
                </>
              );
            })()}
          </div>

        </div>
      </div>

      {/* Source Document Hierarchy & Authority Weights */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-4 h-4 text-indigo-400" />
          <h2 className="text-sm font-semibold text-slate-200 font-heading">
            Source Authority & Canon Hierarchy
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-mono uppercase text-slate-400">
                <th className="py-2 px-3">Source Title</th>
                <th className="py-2 px-3">Author</th>
                <th className="py-2 px-3">Pub Date</th>
                <th className="py-2 px-3">Authority Level</th>
                <th className="py-2 px-3">Hierarchy Weight</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {resolution.authorityBreakdown.map((src, idx) => (
                <tr key={idx} className="hover:bg-slate-900/60 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-slate-100 flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-indigo-400" />
                    {src.sourceTitle}
                  </td>
                  <td className="py-2.5 px-3 text-slate-400 font-mono text-[11px]">
                    {evidence.referencedSources.find(s => s.title === src.sourceTitle)?.author || 'Imperial Archives'}
                  </td>
                  <td className="py-2.5 px-3 text-amber-300 font-mono text-[11px]">
                    Year {src.publicationDate}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                      src.authorityLevel === 'PRIMARY_CANON' 
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                        : src.authorityLevel === 'OFFICIAL_SECONDARY'
                        ? 'bg-indigo-950 text-indigo-300 border-indigo-700'
                        : 'bg-slate-900 text-slate-400 border-slate-700'
                    }`}>
                      {src.authorityLevel}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-purple-300 font-bold">
                    {src.weightScore} / 100
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
