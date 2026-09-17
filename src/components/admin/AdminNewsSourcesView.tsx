import React, { useState } from 'react';
import { Radio, Plus, RefreshCw, CheckCircle2, AlertTriangle, Shield, Globe } from 'lucide-react';

interface NewsSourceItem {
  id: string;
  name: string;
  url: string;
  domain: string;
  category: string;
  status: 'active' | 'paused' | 'error';
  type: string;
  articlesCollected: number;
  lastSync: string;
  apiStatus: 'online' | 'degraded' | 'offline';
  credibilityScore: number;
}

interface AdminNewsSourcesViewProps {
  onToast: (msg: string) => void;
}

export const AdminNewsSourcesView: React.FC<AdminNewsSourcesViewProps> = ({ onToast }) => {
  const [sources, setSources] = useState<NewsSourceItem[]>([
    { id: '1', name: 'MIT Technology Review', url: 'https://technologyreview.com/feed', domain: 'technologyreview.com', category: 'AI & Technology', status: 'active', type: 'RSS', articlesCollected: 1420, lastSync: '10 mins ago', apiStatus: 'online', credibilityScore: 98 },
    { id: '2', name: 'Financial Times API', url: 'https://api.ft.com/v1/news', domain: 'ft.com', category: 'Business & Finance', status: 'active', type: 'REST API', articlesCollected: 890, lastSync: '15 mins ago', apiStatus: 'online', credibilityScore: 96 },
    { id: '3', name: 'NASA Astronomy Stream', url: 'https://nasa.gov/rss/news.xml', domain: 'nasa.gov', category: 'Science & Space', status: 'active', type: 'RSS', articlesCollected: 450, lastSync: '25 mins ago', apiStatus: 'online', credibilityScore: 99 },
    { id: '4', name: 'WHO Global Health Stream', url: 'https://who.int/api/news', domain: 'who.int', category: 'Health & Medicine', status: 'paused', type: 'REST API', articlesCollected: 310, lastSync: '1 day ago', apiStatus: 'degraded', credibilityScore: 97 },
    { id: '5', name: 'Bloomberg Markets', url: 'https://bloomberg.com/feed', domain: 'bloomberg.com', category: 'Business & Finance', status: 'error', type: 'REST API', articlesCollected: 1200, lastSync: '2 hours ago', apiStatus: 'offline', credibilityScore: 94 }
  ]);

  const toggleSourceStatus = (id: string) => {
    setSources(prev => prev.map(s => {
      if (s.id === id) {
        const next = s.status === 'active' ? 'paused' : 'active';
        onToast(`News source "${s.name}" set to ${next.toUpperCase()}`);
        return { ...s, status: next };
      }
      return s;
    }));
  };

  const handleSyncNow = (name: string) => {
    onToast(`Triggered instant RSS/API sync for publisher "${name}"...`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-3xl bg-slate-950 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">News Source & Ingestion Directory</h2>
            <p className="text-xs text-slate-400">Configure news aggregation feeds, API status, domain trust ratings, and sync schedules</p>
          </div>
        </div>

        <button
          onClick={() => onToast('Opened Add Publisher Source Modal')}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Publisher Feed
        </button>
      </div>

      {/* Sources List */}
      <div className="space-y-3">
        {sources.map(src => (
          <div key={src.id} className="p-4 rounded-3xl bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-bold text-white">{src.name}</h3>
                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border uppercase ${
                  src.status === 'active' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' :
                  src.status === 'paused' ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' :
                  'bg-rose-500/15 text-rose-400 border-rose-500/30'
                }`}>
                  {src.status}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono bg-slate-900 text-slate-400 border border-slate-800">
                  {src.type}
                </span>
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                {src.url} • Category: <span className="text-indigo-400">{src.category}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs shrink-0 font-mono">
              <div className="text-right">
                <div className="font-extrabold text-slate-200">{src.articlesCollected.toLocaleString()}</div>
                <div className="text-[9px] text-slate-500 uppercase">Collected</div>
              </div>

              <div className="text-right">
                <div className="font-extrabold text-emerald-400">{src.credibilityScore}%</div>
                <div className="text-[9px] text-slate-500 uppercase">Credibility</div>
              </div>

              <div className="flex items-center gap-2 pl-3 border-l border-slate-800">
                <button
                  onClick={() => handleSyncNow(src.name)}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500 text-slate-300 transition-all cursor-pointer"
                  title="Sync Feed Now"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => toggleSourceStatus(src.id)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500 text-slate-300 text-[11px] font-bold cursor-pointer"
                >
                  {src.status === 'active' ? 'Disable' : 'Enable'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
