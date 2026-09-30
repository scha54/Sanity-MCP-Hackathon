'use client';

import React, { useState } from 'react';
import { Database, Code, Terminal, Server, CheckCircle2, Play, Copy } from 'lucide-react';
import { schemaTypes } from '../lib/sanity/schemas';

export const SanitySchemaInspector: React.FC = () => {
  const [selectedSchema, setSelectedSchema] = useState<string>('claim');
  const [groqQuery, setGroqQuery] = useState<string>(
    `*[_type == "claim" && canonStatus == "CANON"]{\n  _id,\n  statement,\n  canonStatus,\n  confidence,\n  "sourceTitle": source->title\n}`
  );
  const [queryOutput, setQueryOutput] = useState<string | null>(null);

  const activeSchemaObj = schemaTypes.find(s => s.name === selectedSchema);

  const handleSimulateGroq = () => {
    setQueryOutput(
      JSON.stringify([
        {
          _id: "clm-arin-northreach-735-true",
          statement: "Arin Shadowstrider remained in active command at Northreach Keep throughout winter 734 and spring 735, entering Valemont only in autumn 735.",
          canonStatus: "CANON",
          confidence: 98,
          sourceTitle: "Chronicles of Valemont (Revised & Restored Edition)"
        },
        {
          _id: "clm-northreach-ledger-signature",
          statement: "Commander Arin Shadowstrider personally signed daily garrison logs at Northreach Keep from November 734 until May 735.",
          canonStatus: "CANON",
          confidence: 100,
          sourceTitle: "The Imperial Garrison Ledger of Northreach"
        }
      ], null, 2)
    );
  };

  return (
    <div className="space-y-6 mb-6">
      
      {/* MCP Connection Banner */}
      <div className="glass-panel p-5 rounded-2xl border border-purple-900/50 bg-slate-950/80">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-950 border border-purple-800">
              <Server className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-100 font-heading">
                  Sanity Model Context Protocol (MCP) Integration
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700">
                  Ready
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Connected via MCP server: <code className="text-purple-300 font-mono">https://mcp.sanity.io</code>
              </p>
            </div>
          </div>

          <div className="text-right text-xs font-mono text-slate-400">
            <div>Project ID: <span className="text-slate-200">demo-universe</span></div>
            <div>Dataset: <span className="text-slate-200">production</span></div>
          </div>
        </div>
      </div>

      {/* Sanity Schema Inspector */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2 mb-4">
          <Database className="w-4 h-4 text-purple-400" />
          <h2 className="text-sm font-semibold text-slate-200 font-heading">
            Sanity Studio Schema Inspector
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          
          {/* Schema Selector */}
          <div className="space-y-1">
            <div className="text-[10px] font-mono uppercase text-slate-400 mb-2">Select Schema Document:</div>
            {schemaTypes.map((schema) => (
              <button
                key={schema.name}
                onClick={() => setSelectedSchema(schema.name)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-mono transition-all flex items-center justify-between ${
                  selectedSchema === schema.name
                    ? 'bg-purple-600 text-white font-bold shadow'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-850'
                }`}
              >
                <span>{schema.title} ({schema.name})</span>
                <span className="text-[10px] opacity-75">{schema.fields.length} fields</span>
              </button>
            ))}
          </div>

          {/* Schema Definition JSON View */}
          <div className="lg:col-span-2 bg-slate-950 p-4 rounded-xl border border-slate-800 overflow-x-auto">
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-800">
              <span className="text-xs font-mono text-purple-300">
                schema: {selectedSchema}.ts
              </span>
              <span className="text-[10px] font-mono text-slate-500">Sanity Studio v3</span>
            </div>
            <pre className="text-[11px] font-mono text-slate-300 leading-relaxed">
              {JSON.stringify(activeSchemaObj, null, 2)}
            </pre>
          </div>

        </div>
      </div>

      {/* GROQ Query Simulator */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-semibold text-slate-200 font-heading">
              Sanity GROQ Query Console & Simulator
            </h2>
          </div>
          <button
            onClick={handleSimulateGroq}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold font-mono flex items-center gap-1.5 transition-all shadow"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Execute GROQ Query</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1.5">
              GROQ Input Query:
            </label>
            <textarea
              value={groqQuery}
              onChange={(e) => setGroqQuery(e.target.value)}
              rows={6}
              className="w-full bg-slate-950 text-xs font-mono text-indigo-300 p-3 rounded-xl border border-slate-800 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1.5">
              GROQ JSON Output:
            </label>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 min-h-[140px] max-h-[180px] overflow-y-auto">
              {queryOutput ? (
                <pre className="text-[11px] font-mono text-emerald-400">{queryOutput}</pre>
              ) : (
                <div className="text-xs text-slate-500 italic p-4 text-center">
                  Click 'Execute GROQ Query' to simulate live Sanity response
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
