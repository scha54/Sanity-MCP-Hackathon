'use client';

import React, { useState } from 'react';
import { EvidenceGraphData, GraphNode, GraphEdge } from '../lib/canon/graphBuilder';
import { GitBranch, Info, Sparkles, Filter, Maximize2, ShieldCheck, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';

interface EvidenceGraphVisualizerProps {
  graphData: EvidenceGraphData;
}

export const EvidenceGraphVisualizer: React.FC<EvidenceGraphVisualizerProps> = ({ graphData }) => {
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'claim' | 'source'>('all');

  const filteredNodes = graphData.nodes.filter(n => {
    if (filterType === 'all') return true;
    if (filterType === 'claim') return n.type === 'claim' || n.type === 'question' || n.type === 'verdict';
    if (filterType === 'source') return n.type === 'source' || n.type === 'claim';
    return true;
  });

  const filteredEdges = graphData.edges.filter(e => {
    return filteredNodes.some(n => n.id === e.source) && filteredNodes.some(n => n.id === e.target);
  });

  // Calculate coordinates for nodes in a nice hierarchical layout
  const questionNodes = filteredNodes.filter(n => n.type === 'question');
  const claimNodes = filteredNodes.filter(n => n.type === 'claim');
  const sourceNodes = filteredNodes.filter(n => n.type === 'source');
  const verdictNodes = filteredNodes.filter(n => n.type === 'verdict');

  const width = 800;
  const height = 480;

  const getPos = (node: GraphNode): { x: number; y: number } => {
    if (node.type === 'question') {
      return { x: 100, y: height / 2 };
    }
    if (node.type === 'claim') {
      const idx = claimNodes.findIndex(n => n.id === node.id);
      const total = Math.max(1, claimNodes.length);
      const startY = height / 2 - ((total - 1) * 75) / 2;
      return { x: 380, y: startY + idx * 75 };
    }
    if (node.type === 'source') {
      const idx = sourceNodes.findIndex(n => n.id === node.id);
      const total = Math.max(1, sourceNodes.length);
      const startY = height / 2 - ((total - 1) * 70) / 2;
      return { x: 620, y: startY + idx * 70 };
    }
    if (node.type === 'verdict') {
      return { x: 380, y: height - 55 };
    }
    return { x: 200, y: 200 };
  };

  const getNodeColor = (node: GraphNode) => {
    if (node.type === 'question') return { bg: '#3b82f6', border: '#60a5fa', text: '#ffffff' };
    if (node.type === 'verdict') return { bg: '#8b5cf6', border: '#c084fc', text: '#ffffff' };
    if (node.type === 'source') return { bg: '#0f766e', border: '#2dd4bf', text: '#f0fdf4' };
    if (node.type === 'claim') {
      if (node.status === 'CANON') return { bg: '#15803d', border: '#4ade80', text: '#f0fdf4' };
      if (node.status === 'RETCONNED') return { bg: '#7e22ce', border: '#c084fc', text: '#faf5ff' };
      if (node.status === 'DISPUTED' || node.status === 'AMBIGUOUS') return { bg: '#c2410c', border: '#fb923c', text: '#fff7ed' };
    }
    return { bg: '#334155', border: '#94a3b8', text: '#f8fafc' };
  };

  const getEdgeStyle = (edge: GraphEdge) => {
    if (edge.label === 'supersedes' || edge.status === 'retconned') {
      return { stroke: '#c084fc', strokeDasharray: '4 4', strokeWidth: 2 };
    }
    if (edge.label === 'contradicts' || edge.status === 'disputed') {
      return { stroke: '#f97316', strokeDasharray: '6 3', strokeWidth: 2 };
    }
    if (edge.label === 'supported_by') {
      return { stroke: '#2dd4bf', strokeWidth: 1.8 };
    }
    if (edge.label === 'resolves_to') {
      return { stroke: '#a855f7', strokeWidth: 2.5 };
    }
    return { stroke: '#64748b', strokeWidth: 1.5 };
  };

  return (
    <div className="glass-panel p-5 rounded-2xl mb-6 border border-slate-800">
      
      {/* Top Graph Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-purple-400" />
            <h2 className="text-sm font-semibold text-slate-200 font-heading">
              Evidence Knowledge Graph
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Interactive node network mapping question, claims, sources, and canon resolutions
          </p>
        </div>

        {/* Filters & Legend */}
        <div className="flex items-center gap-2 text-xs">
          <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800 font-mono text-[11px]">
            <button
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded-md transition-all ${filterType === 'all' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'}`}
            >
              All Nodes
            </button>
            <button
              onClick={() => setFilterType('claim')}
              className={`px-2.5 py-1 rounded-md transition-all ${filterType === 'claim' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Claims
            </button>
            <button
              onClick={() => setFilterType('source')}
              className={`px-2.5 py-1 rounded-md transition-all ${filterType === 'source' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Sources
            </button>
          </div>
        </div>
      </div>

      {/* SVG Canvas Container */}
      <div className="relative bg-slate-950/90 rounded-xl border border-slate-800/80 overflow-hidden shadow-inner">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto min-h-[380px] max-h-[500px]"
        >
          {/* Background grid */}
          <defs>
            <pattern id="graph-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            </pattern>
            <marker id="arrow" viewBox="0 0 10 10" refX="16" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
            </marker>
            <marker id="arrow-retcon" viewBox="0 0 10 10" refX="16" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#c084fc" />
            </marker>
            <marker id="arrow-contradict" viewBox="0 0 10 10" refX="16" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#fb923c" />
            </marker>
          </defs>

          <rect width="100%" height="100%" fill="url(#graph-grid)" />

          {/* Render Edges */}
          {filteredEdges.map((edge) => {
            const sourceNode = filteredNodes.find(n => n.id === edge.source);
            const targetNode = filteredNodes.find(n => n.id === edge.target);
            if (!sourceNode || !targetNode) return null;

            const p1 = getPos(sourceNode);
            const p2 = getPos(targetNode);
            const style = getEdgeStyle(edge);

            // Curve mid point calculation
            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const cx = p1.x + dx / 2;
            const cy = p1.y + dy / 2 - (dx === 0 ? 0 : 15);

            let marker = "url(#arrow)";
            if (edge.label === 'supersedes') marker = "url(#arrow-retcon)";
            if (edge.label === 'contradicts') marker = "url(#arrow-contradict)";

            return (
              <g key={edge.id} className="group">
                <path
                  d={`M ${p1.x} ${p1.y} Q ${cx} ${cy} ${p2.x} ${p2.y}`}
                  fill="none"
                  stroke={style.stroke}
                  strokeWidth={style.strokeWidth}
                  strokeDasharray={style.strokeDasharray}
                  markerEnd={marker}
                  className="transition-all hover:stroke-purple-300 opacity-80 hover:opacity-100"
                />
                {/* Edge Label text */}
                <text
                  x={cx}
                  y={cy - 4}
                  fill="#94a3b8"
                  fontSize="9"
                  fontFamily="monospace"
                  textAnchor="middle"
                  className="pointer-events-none select-none drop-shadow"
                >
                  {edge.label}
                </text>
              </g>
            );
          })}

          {/* Render Nodes */}
          {filteredNodes.map((node) => {
            const pos = getPos(node);
            const color = getNodeColor(node);
            const isSelected = selectedNode?.id === node.id;

            return (
              <g
                key={node.id}
                transform={`translate(${pos.x}, ${pos.y})`}
                onClick={() => setSelectedNode(node)}
                className="cursor-pointer group"
              >
                {/* Outer Glow on Hover/Selection */}
                <rect
                  x="-75"
                  y="-22"
                  width="150"
                  height="44"
                  rx="10"
                  fill={color.bg}
                  stroke={isSelected ? '#ffffff' : color.border}
                  strokeWidth={isSelected ? 3 : 1.5}
                  className="transition-all duration-200 shadow-lg group-hover:scale-105"
                  filter={isSelected ? "drop-shadow(0 0 10px rgba(168, 85, 247, 0.8))" : undefined}
                />

                {/* Node Label */}
                <text
                  x="0"
                  y="-4"
                  fill={color.text}
                  fontSize="11"
                  fontWeight="bold"
                  fontFamily="sans-serif"
                  textAnchor="middle"
                  className="pointer-events-none select-none"
                >
                  {node.label.length > 22 ? node.label.substring(0, 22) + '...' : node.label}
                </text>

                {/* Node Subtitle */}
                {node.subtitle && (
                  <text
                    x="0"
                    y="12"
                    fill="rgba(255,255,255,0.7)"
                    fontSize="9"
                    fontFamily="sans-serif"
                    textAnchor="middle"
                    className="pointer-events-none select-none"
                  >
                    {node.subtitle.length > 24 ? node.subtitle.substring(0, 24) + '...' : node.subtitle}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Legend Overlay */}
        <div className="absolute bottom-3 left-3 bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 text-[10px] font-mono flex flex-wrap gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-emerald-600 border border-emerald-400 inline-block" />
            <span className="text-slate-300">Canon Claim</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-purple-600 border border-purple-400 inline-block" />
            <span className="text-slate-300">Retconned</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-amber-600 border border-amber-400 inline-block" />
            <span className="text-slate-300">Disputed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-teal-600 border border-teal-400 inline-block" />
            <span className="text-slate-300">Source Doc</span>
          </div>
        </div>
      </div>

      {/* Selected Node Details Drawer */}
      {selectedNode && (
        <div className="mt-4 bg-slate-900/90 p-4 rounded-xl border border-purple-900/50 flex flex-col sm:flex-row items-start justify-between gap-4 animate-fadeIn">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                {selectedNode.type}
              </span>
              <h4 className="text-sm font-bold text-slate-100">{selectedNode.label}</h4>
            </div>
            {selectedNode.details ? (
              <div className="mt-2 text-xs text-slate-300 space-y-1">
                {selectedNode.details.statement && (
                  <p className="italic bg-slate-950/60 p-2 rounded border border-slate-800">
                    "{selectedNode.details.statement}"
                  </p>
                )}
                {selectedNode.details.sourceLocation && (
                  <p className="text-[11px] font-mono text-slate-400">
                    Location: {selectedNode.details.sourceLocation}
                  </p>
                )}
                {selectedNode.details.author && (
                  <p className="text-[11px] font-mono text-slate-400">
                    Author: {selectedNode.details.author} ({selectedNode.details.publicationDate})
                  </p>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-400 mt-1">{selectedNode.subtitle}</p>
            )}
          </div>
          <button
            onClick={() => setSelectedNode(null)}
            className="text-xs text-slate-400 hover:text-slate-200 font-mono px-2 py-1 bg-slate-800 rounded border border-slate-700"
          >
            Close
          </button>
        </div>
      )}

    </div>
  );
};
