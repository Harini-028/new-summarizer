import React, { useState, useEffect } from 'react';
import { Clock, Sparkles, Search, AlertCircle, ChevronDown, ChevronUp, ArrowDown, Radio } from 'lucide-react';
import { Article } from '../types';

interface TimelineEvent {
  date: string;
  time?: string;
  title: string;
  description: string;
  source: string;
  importance: 'high' | 'medium' | 'low';
  type: 'event' | 'response' | 'development' | 'update';
}

interface TimelineData {
  topic: string;
  summary: string;
  events: TimelineEvent[];
  lastUpdated: string;
}

interface NewsTimelinePageProps {
  articles: Article[];
}

const PRESET_TOPICS = ['AI Regulation', 'Quantum Computing', 'Climate Policy', 'Space Exploration', 'Cryptocurrency', 'Healthcare Reform'];

const typeConfig = {
  event: { label: 'Event', color: 'bg-rose-500/20 text-rose-400 border-rose-500/30' },
  response: { label: 'Response', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  development: { label: 'Development', color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' },
  update: { label: 'Update', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
};

const importanceConfig = {
  high: { lineColor: 'border-rose-500', dotColor: 'bg-rose-500', dotSize: 'w-4 h-4' },
  medium: { lineColor: 'border-indigo-500', dotColor: 'bg-indigo-500', dotSize: 'w-3 h-3' },
  low: { lineColor: 'border-slate-600', dotColor: 'bg-slate-500', dotSize: 'w-2.5 h-2.5' },
};

export default function NewsTimelinePage({ articles }: NewsTimelinePageProps) {
  const [topic, setTopic] = useState('');
  const [inputTopic, setInputTopic] = useState('');
  const [timeline, setTimeline] = useState<TimelineData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [expandedEvents, setExpandedEvents] = useState<Set<number>>(new Set([0]));

  const handleSearch = async (searchTopic?: string) => {
    const t = searchTopic || inputTopic.trim();
    if (!t) return;
    setTopic(t); setIsLoading(true); setError(''); setTimeline(null); setExpandedEvents(new Set([0]));
    try {
      const res = await fetch('/api/ai/timeline', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: t })
      });
      const data = await res.json();
      if (res.ok) setTimeline(data);
      else setError(data.error || 'Failed to generate timeline.');
    } catch { setError('Connection error.'); }
    finally { setIsLoading(false); }
  };

  const toggleExpand = (idx: number) => {
    setExpandedEvents(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx); else next.add(idx);
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">News Story Timeline</h2>
            <p className="text-xs text-slate-400">AI-generated chronological timeline for any news topic or story</p>
          </div>
        </div>

        {/* Search */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              value={inputTopic} onChange={e => setInputTopic(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="Enter a topic, story, or event (e.g. 'AI Regulation')"
              className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-2xl text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30"
            />
          </div>
          <button
            onClick={() => handleSearch()}
            disabled={!inputTopic.trim() || isLoading}
            className="px-5 py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold disabled:opacity-50 transition-all flex items-center gap-2"
          >
            {isLoading ? <Sparkles className="w-4 h-4 animate-spin" /> : <Clock className="w-4 h-4" />}
            {isLoading ? 'Building...' : 'Build Timeline'}
          </button>
        </div>

        {/* Preset topics */}
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mr-1 self-center">Try:</span>
          {PRESET_TOPICS.map(t => (
            <button
              key={t} onClick={() => { setInputTopic(t); handleSearch(t); }}
              className="px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 hover:text-white border border-slate-700 transition-all"
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-2 text-rose-400 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-4 border-cyan-600/30 border-t-cyan-400 animate-spin" />
          <div className="text-center">
            <p className="text-sm font-bold text-slate-200">Building Timeline for "{topic}"</p>
            <p className="text-xs text-slate-400 mt-1">AI is analyzing articles and extracting events...</p>
          </div>
        </div>
      )}

      {/* Timeline Result */}
      {timeline && !isLoading && (
        <div className="space-y-4 animate-in">
          {/* Summary */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-cyan-900/20 to-slate-900 border border-cyan-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Story Arc Summary</span>
            </div>
            <h3 className="text-base font-bold text-slate-100 mb-1">{timeline.topic}</h3>
            <p className="text-sm text-slate-300 leading-relaxed">{timeline.summary}</p>
            <p className="text-[10px] text-slate-500 mt-2 font-mono">Last updated: {new Date(timeline.lastUpdated).toLocaleString()}</p>
          </div>

          {/* Timeline events */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
            <h3 className="text-sm font-bold text-slate-300 mb-6 flex items-center gap-2">
              <Radio className="w-4 h-4 text-cyan-400" /> Chronological Events ({timeline.events.length})
            </h3>
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-[18px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500/60 via-indigo-500/30 to-transparent" />
              
              <div className="space-y-4 ml-10">
                {timeline.events.map((event, idx) => {
                  const imp = importanceConfig[event.importance] || importanceConfig.medium;
                  const tp = typeConfig[event.type] || typeConfig.update;
                  const isExpanded = expandedEvents.has(idx);
                  return (
                    <div key={idx} className="relative animate-in" style={{ animationDelay: `${idx * 80}ms` }}>
                      {/* Timeline dot */}
                      <div className={`absolute -left-[30px] top-3 ${imp.dotSize} rounded-full ${imp.dotColor} border-2 border-[#080808] shadow-lg`} />
                      
                      <div className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                        event.importance === 'high' ? 'bg-slate-900 border-slate-700 hover:border-slate-600' : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                      }`} onClick={() => toggleExpand(idx)}>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-mono text-slate-500">
                                {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                {event.time && ` · ${event.time}`}
                              </span>
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${tp.color}`}>{tp.label}</span>
                              {event.importance === 'high' && (
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold border bg-rose-500/20 text-rose-400 border-rose-500/30">KEY EVENT</span>
                              )}
                            </div>
                            <h4 className="text-sm font-bold text-slate-100">{event.title}</h4>
                            {isExpanded && (
                              <p className="text-xs text-slate-300 mt-2 leading-relaxed">{event.description}</p>
                            )}
                            <span className="text-[10px] text-indigo-400 font-semibold mt-1 block">via {event.source}</span>
                          </div>
                          <div className="shrink-0 text-slate-500">
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </div>
                        </div>
                      </div>
                      {idx < timeline.events.length - 1 && (
                        <div className="flex justify-center my-1">
                          <ArrowDown className="w-3 h-3 text-slate-700" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!timeline && !isLoading && !error && (
        <div className="p-12 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
            <Clock className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-200">Build a Story Timeline</h3>
            <p className="text-sm text-slate-400 mt-1 max-w-sm">Enter any news topic above and AI will automatically construct a chronological timeline of events from available articles.</p>
          </div>
        </div>
      )}
    </div>
  );
}
