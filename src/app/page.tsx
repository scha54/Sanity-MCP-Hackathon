'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { PresetQuerySelector, PRESET_QUERIES } from '@/components/PresetQuerySelector';
import { QueryInput } from '@/components/QueryInput';
import { VerdictBanner } from '@/components/VerdictBanner';
import { EvidenceGraphVisualizer } from '@/components/EvidenceGraphVisualizer';
import { ConflictBreakdown } from '@/components/ConflictBreakdown';
import { UniverseExplorer } from '@/components/UniverseExplorer';
import { SanitySchemaInspector } from '@/components/SanitySchemaInspector';

import { analyzeQuestion, AnalyzedQuestion } from '@/lib/canon/analyzer';
import { retrieveEvidence, retrieveEvidenceSync, RetrievedEvidence } from '@/lib/canon/retriever';
import { resolveCanon, ResolutionResult } from '@/lib/canon/resolver';
import { buildEvidenceGraph, EvidenceGraphData } from '@/lib/canon/graphBuilder';
import { kbService } from '@/lib/sanity/client';

// Initial synchronous state for perfect SSR & CSR hydration match
const defaultQuery = PRESET_QUERIES[0].query;
const initialAnalysis = analyzeQuestion(defaultQuery);
const initialEvidence = retrieveEvidenceSync(initialAnalysis);
const initialResolution = resolveCanon(initialAnalysis, initialEvidence);
const initialGraphData = buildEvidenceGraph(
  defaultQuery,
  initialEvidence.matchedClaims,
  initialEvidence.referencedSources,
  initialResolution.verdictStatus
);

export default function Home() {
  const [activeTab, setActiveTab] = useState<'resolver' | 'explorer' | 'graph' | 'sanity'>('resolver');
  const [query, setQuery] = useState<string>(defaultQuery);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  const [analysis, setAnalysis] = useState<AnalyzedQuestion>(initialAnalysis);
  const [evidence, setEvidence] = useState<RetrievedEvidence>(initialEvidence);
  const [resolution, setResolution] = useState<ResolutionResult>(initialResolution);
  const [graphData, setGraphData] = useState<EvidenceGraphData>(initialGraphData);

  // Evaluate query on user interaction
  const handleRunEvaluation = async (qText: string) => {
    setIsAnalyzing(true);
    setQuery(qText);

    try {
      const qAnalysis = analyzeQuestion(qText);
      setAnalysis(qAnalysis);

      const qEvidence = await retrieveEvidence(qAnalysis);
      setEvidence(qEvidence);

      const qResolution = resolveCanon(qAnalysis, qEvidence);
      setResolution(qResolution);

      const qGraph = buildEvidenceGraph(
        qText,
        qEvidence.matchedClaims,
        qEvidence.referencedSources,
        qResolution.verdictStatus
      );
      setGraphData(qGraph);
    } catch (err) {
      console.error('Resolution error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen text-slate-100 flex flex-col font-sans" suppressHydrationWarning>
      
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSanityConnected={false}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Scenario Quick Presets */}
        <PresetQuerySelector
          activeQuery={query}
          onSelectQuery={(q) => handleRunEvaluation(q)}
        />

        {/* Query Input */}
        <QueryInput
          currentQuery={query}
          onQuerySubmit={(q) => handleRunEvaluation(q)}
          analysis={analysis}
          isAnalyzing={isAnalyzing}
        />

        {/* Tab Content Views */}
        {activeTab === 'resolver' && (
          <div>
            {resolution && <VerdictBanner resolution={resolution} />}
            {graphData && <EvidenceGraphVisualizer graphData={graphData} />}
            {evidence && resolution && (
              <ConflictBreakdown evidence={evidence} resolution={resolution} />
            )}
          </div>
        )}

        {activeTab === 'graph' && (
          <div>
            {graphData && <EvidenceGraphVisualizer graphData={graphData} />}
            {resolution && <VerdictBanner resolution={resolution} />}
          </div>
        )}

        {activeTab === 'explorer' && (
          <UniverseExplorer universe={kbService.getUniverse()} />
        )}

        {activeTab === 'sanity' && (
          <SanitySchemaInspector />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 mt-12 text-xs text-slate-500 font-mono text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 CanonKeeper — Sanity MCP Hackathon Entry</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Built with Next.js 15</span>
            <span>•</span>
            <span>Sanity CMS & GROQ</span>
            <span>•</span>
            <span>TailwindCSS</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
