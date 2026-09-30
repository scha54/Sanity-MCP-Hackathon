'use client';

import React, { useState } from 'react';
import { FictionalUniverse, ClaimData, SourceData, CharacterData, EventData, LocationData } from '../lib/sanity/universeData';
import { Layers, BookOpen, Users, Calendar, MapPin, Search, Filter, Tag, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';

interface UniverseExplorerProps {
  universe: FictionalUniverse;
}

export const UniverseExplorer: React.FC<UniverseExplorerProps> = ({ universe }) => {
  const [activeSubTab, setActiveSubTab] = useState<'claims' | 'sources' | 'characters' | 'events' | 'locations'>('claims');
  const [searchFilter, setSearchFilter] = useState('');

  const filterItem = (text: string) => {
    if (!searchFilter.trim()) return true;
    return text.toLowerCase().includes(searchFilter.toLowerCase());
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 mb-6">
      
      {/* Header & Sub-Tabs */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-purple-400" />
            <h2 className="text-base font-bold text-slate-100 font-heading">
              Lore Universe Knowledge Base
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Browse all structured Sanity schema documents across characters, events, sources, locations, and claims
          </p>
        </div>

        {/* Search & Filter */}
        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search universe data..."
            className="w-full bg-slate-900 text-xs text-slate-200 pl-9 pr-3 py-2 rounded-lg border border-slate-800 focus:border-purple-500 focus:outline-none font-sans"
          />
        </div>
      </div>

      {/* Sub-Navigation Pills */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-800 pb-3 font-mono text-xs">
        <button
          onClick={() => setActiveSubTab('claims')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
            activeSubTab === 'claims'
              ? 'bg-purple-600 text-white font-bold shadow'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Tag className="w-3.5 h-3.5" />
          <span>Claims ({universe.claims.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('sources')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
            activeSubTab === 'sources'
              ? 'bg-purple-600 text-white font-bold shadow'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Sources ({universe.sources.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('characters')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
            activeSubTab === 'characters'
              ? 'bg-purple-600 text-white font-bold shadow'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Characters ({universe.characters.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('events')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
            activeSubTab === 'events'
              ? 'bg-purple-600 text-white font-bold shadow'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Events ({universe.events.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('locations')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
            activeSubTab === 'locations'
              ? 'bg-purple-600 text-white font-bold shadow'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>Locations ({universe.locations.length})</span>
        </button>
      </div>

      {/* Claims Tab */}
      {activeSubTab === 'claims' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {universe.claims.filter(c => filterItem(c.statement + c.subject + c.object)).map((claim) => (
            <div key={claim._id} className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 hover:border-purple-800/60 transition-all">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                  claim.canonStatus === 'CANON' 
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                    : claim.canonStatus === 'RETCONNED'
                    ? 'bg-purple-950 text-purple-300 border-purple-700'
                    : 'bg-amber-950 text-amber-300 border-amber-700'
                }`}>
                  {claim.canonStatus}
                </span>
                <span className="text-[10px] font-mono text-slate-500">{claim._id}</span>
              </div>
              <p className="text-xs font-semibold text-slate-100 mb-2 leading-relaxed">
                "{claim.statement}"
              </p>
              <div className="text-[11px] text-slate-400 space-y-1 font-sans border-t border-slate-800/80 pt-2">
                <div className="flex justify-between">
                  <span>Subject: <strong className="text-slate-200">{claim.subject}</strong></span>
                  <span className="font-mono text-amber-300">{claim.timeline}</span>
                </div>
                <div>Source: <span className="font-mono text-slate-300">{claim.sourceLocation}</span></div>
                {claim.notes && <div className="text-[10px] text-slate-500 italic mt-1">{claim.notes}</div>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sources Tab */}
      {activeSubTab === 'sources' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {universe.sources.filter(s => filterItem(s.title + s.author)).map((source) => (
            <div key={source._id} className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 hover:border-indigo-800/60 transition-all">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                  source.authorityLevel === 'PRIMARY_CANON'
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                    : source.authorityLevel === 'OFFICIAL_SECONDARY'
                    ? 'bg-indigo-950 text-indigo-300 border-indigo-700'
                    : 'bg-slate-900 text-slate-400 border-slate-700'
                }`}>
                  {source.authorityLevel}
                </span>
                <span className="text-[10px] font-mono text-amber-300">Year {source.publicationDate}</span>
              </div>
              <h3 className="text-xs font-bold text-slate-100 font-heading mb-1">{source.title}</h3>
              <p className="text-[11px] text-slate-400 font-mono mb-2">Author: {source.author} ({source.edition})</p>
              {source.notes && <p className="text-[11px] text-slate-400 bg-slate-950/60 p-2 rounded border border-slate-800/80">{source.notes}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Characters Tab */}
      {activeSubTab === 'characters' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {universe.characters.filter(c => filterItem(c.name + c.description)).map((char) => (
            <div key={char._id} className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 hover:border-purple-800/60 transition-all">
              <div className="flex items-center justify-between gap-2 mb-1">
                <h3 className="text-sm font-bold text-slate-100 font-heading">{char.name}</h3>
                <span className="text-[10px] font-mono text-slate-500">{char._id}</span>
              </div>
              <p className="text-[11px] text-purple-300 font-mono mb-2">
                Aliases: {char.aliases.join(', ')}
              </p>
              <p className="text-xs text-slate-300 mb-3 leading-relaxed">{char.description}</p>
              {char.relationships && (
                <div className="border-t border-slate-800 pt-2 space-y-1">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Relationships:</div>
                  {char.relationships.map((rel, idx) => (
                    <div key={idx} className="text-[11px] text-slate-300 bg-slate-950/60 px-2 py-1 rounded border border-slate-800">
                      <strong>{rel.relationType}</strong>: {rel.details}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Events Tab */}
      {activeSubTab === 'events' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {universe.events.filter(e => filterItem(e.title + e.description)).map((evt) => (
            <div key={evt._id} className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between gap-2 mb-1">
                <h3 className="text-xs font-bold text-slate-100 font-heading">{evt.title}</h3>
                <span className="text-[10px] font-mono text-amber-300">{evt.chronology}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mt-2">{evt.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Locations Tab */}
      {activeSubTab === 'locations' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {universe.locations.filter(l => filterItem(l.name + l.description)).map((loc) => (
            <div key={loc._id} className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <h3 className="text-xs font-bold text-slate-100 font-heading mb-1">{loc.name}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{loc.description}</p>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
