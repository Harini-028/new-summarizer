import React, { useState, useEffect } from 'react';
import { GitCompare, Plus, X, Sparkles, ChevronRight, CheckCircle, AlertTriangle, Layers, Eye, Search } from 'lucide-react';
import { Article } from '../types';
import NewsCard from '../components/NewsCard';

interface CompareArticlesPageProps {
  articles: Article[];
  onOpenSummary: (article: Article) => void;
  onOpenVoice: (article: Article) => void;
  onInteract: (id: string, action: 'bookmark' | 'like') => void;
}

interface ComparisonResult {
  commonPoints: string[];
  differences: string[];
  viewpoints: { source: string; stance: string }[];
  importantFacts: string[];
  missingInfo: string[];
  sourceSummaryComparison: { source: string; summary: string }[];
  overallConclusion: string;
}

export default function CompareArticlesPage({ articles, onOpenSummary, onOpenVoice, onInteract }: CompareArticlesPageProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [comparison, setComparison] = useState<ComparisonResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');

  const selectedArticles = articles.filter(a => selectedIds.includes(a.id));
  const filtered = articles.filter(a =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) return prev.filter(i => i !== id);
      if (prev.length >= 4) return prev; // max 4
      return [...prev, id];
    });
    setComparison(null);
  };

  const handleCompare = async () => {
    if (selectedIds.length < 2) { setError('Select at least 2 articles to compare.'); return; }
    setIsLoading(true); setError(''); setComparison(null);
    try {
      const res = await fetch('/api/ai/compare', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleIds: selectedIds })
      });
      const data = await res.json();
      if (res.ok) setComparison(data);
      else setError(data.error || 'Comparison failed.');
    } catch { setError('Connection error. Please try again.'); }
    finally { setIsLoading(false); }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-violet-500/20 text-violet-400 flex items-center justify-center border border-violet-500/30">
            <GitCompare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">Multi-Article AI Comparison</h2>
            <p className="text-xs text-slate-400">Select 2–4 articles to get an AI-powered comparative analysis</p>
          </div>
        </div>

        {/* Selected articles strip */}
        <div className="mt-4 flex flex-wrap gap-2">
          {selectedArticles.map(a => (
            <div key={a.id} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-violet-500/15 border border-violet-500/30 text-xs text-violet-300 font-semibold">
              <span className="truncate max-w-[160px]">{a.title}</span>
              <button onClick={() => toggleSelect(a.id)} className="hover:text-white transition-colors shrink-0">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          {selectedIds.length === 0 && (
            <span className="text-xs text-slate-500 italic">No articles selected yet — pick from the list below</span>
          )}
        </div>

        {/* Compare Button */}
        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={handleCompare}
            disabled={selectedIds.length < 2 || isLoading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-bold disabled:opacity-50 transition-all shadow-lg shadow-violet-950/30"
          >
            {isLoading ? <><Sparkles className="w-4 h-4 animate-spin" /> Analyzing...</> : <><GitCompare className="w-4 h-4" /> Compare {selectedIds.length > 0 ? `${selectedIds.length} Articles` : 'Articles'}</>}
          </button>
          {selectedIds.length > 0 && (
            <button onClick={() => { setSelectedIds([]); setComparison(null); }} className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all">
              Clear Selection
            </button>
          )}
          <span className="text-xs text-slate-500">{selectedIds.length}/4 selected</span>
        </div>
        {error && <p className="mt-2 text-xs text-rose-400 flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" />{error}</p>}
      </div>

      {/* Comparison Result */}
      {comparison && (
        <div className="space-y-4 animate-in">
          {/* Header */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-violet-900/30 to-indigo-900/20 border border-violet-500/30">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span className="text-sm font-bold text-violet-300 uppercase tracking-wider">AI Comparison Analysis</span>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed">{comparison.overallConclusion}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Common Points */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> Common Information
              </h3>
              <ul className="space-y-2">
                {comparison.commonPoints.map((pt, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">{i+1}</span>
                    {pt}
                  </li>
                ))}
              </ul>
            </div>

            {/* Differences */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4" /> Key Differences
              </h3>
              <ul className="space-y-2">
                {comparison.differences.map((d, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">{i+1}</span>
                    {d}
                  </li>
                ))}
              </ul>
            </div>

            {/* Source Viewpoints */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                <Eye className="w-4 h-4" /> Source Viewpoints
              </h3>
              <div className="space-y-2">
                {comparison.viewpoints.map((v, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-[10px] font-bold text-indigo-400 mb-1">{v.source}</div>
                    <div className="text-xs text-slate-300">{v.stance}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Important Facts */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> Important Facts
              </h3>
              <ul className="space-y-1.5">
                {comparison.importantFacts.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                    <ChevronRight className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Missing Info */}
          {comparison.missingInfo.length > 0 && (
            <div className="p-5 rounded-2xl bg-rose-500/5 border border-rose-500/20 space-y-3">
              <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Missing Information (not covered by all sources)
              </h3>
              <div className="flex flex-wrap gap-2">
                {comparison.missingInfo.map((m, i) => (
                  <span key={i} className="px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">{m}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Article Selection Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-300">Select Articles to Compare</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <input
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              placeholder="Filter articles..."
              className="pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-violet-500 w-48"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map(a => {
            const isSelected = selectedIds.includes(a.id);
            return (
              <div
                key={a.id}
                onClick={() => toggleSelect(a.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                  isSelected
                    ? 'bg-violet-500/10 border-violet-500/40 shadow-lg shadow-violet-950/20'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-600'
                }`}
              >
                <img src={a.imageUrl} alt={a.title} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase">{a.category}</span>
                  <h4 className="text-xs font-bold text-slate-100 line-clamp-2 mt-0.5">{a.title}</h4>
                  <span className="text-[10px] text-slate-500 mt-1 block">{a.source.name}</span>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all ${
                  isSelected ? 'bg-violet-600 border-violet-400' : 'border-slate-600'
                }`}>
                  {isSelected && <CheckCircle className="w-3 h-3 text-white" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
