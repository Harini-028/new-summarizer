import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, AlertTriangle, Search, Filter, Eye, RefreshCw, Shield } from 'lucide-react';
import { Article } from '../../types';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface AdminFakeNewsViewProps {
  articles: Article[];
  onOpenDetailModal: (art: Article) => void;
  onToast: (msg: string) => void;
}

export const AdminFakeNewsView: React.FC<AdminFakeNewsViewProps> = ({
  articles,
  onOpenDetailModal,
  onToast
}) => {
  const [search, setSearch] = useState('');
  const [verdictFilter, setVerdictFilter] = useState('ALL');

  // Compute Fake News Statistics
  const totalAnalyzed = articles.length;
  const likelyReal = articles.filter(a => !a.fakeNewsReport?.isLikelyFake && a.fakeNewsReport?.verdict !== 'High Misinformation Risk').length;
  const potentiallyFake = articles.filter(a => a.fakeNewsReport?.isLikelyFake || a.fakeNewsReport?.verdict === 'High Misinformation Risk').length;
  const needsReviewCount = articles.filter(a => a.fakeNewsReport?.verdict === 'Needs Fact-Checking').length || 4;
  const avgConfidence = Math.round(
    articles.reduce((sum, a) => sum + (a.fakeNewsReport?.confidenceScore || 90), 0) / Math.max(articles.length, 1)
  );

  // Pie chart data
  const pieData = [
    { name: 'Likely Real', value: likelyReal, color: '#10b981' },
    { name: 'Needs Review', value: needsReviewCount, color: '#f59e0b' },
    { name: 'Potentially Fake', value: Math.max(1, potentiallyFake), color: '#f43f5e' }
  ];

  // Category breakdown data
  const categoryMisinfoData = [
    { category: 'World & Politics', fake: 8, real: 32 },
    { category: 'Health & Med', fake: 6, real: 24 },
    { category: 'Business', fake: 3, real: 28 },
    { category: 'AI & Tech', fake: 2, real: 45 },
    { category: 'Science', fake: 1, real: 22 }
  ];

  const filteredArticles = articles.filter(a => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) || a.source.name.toLowerCase().includes(search.toLowerCase());
    const isFake = a.fakeNewsReport?.isLikelyFake || a.fakeNewsReport?.verdict === 'High Misinformation Risk';
    const matchVerdict = verdictFilter === 'ALL' ||
      (verdictFilter === 'fake' && isFake) ||
      (verdictFilter === 'real' && !isFake) ||
      (verdictFilter === 'review' && a.fakeNewsReport?.verdict === 'Needs Fact-Checking');
    return matchSearch && matchVerdict;
  });

  const handleUpdateStatus = (artId: string, newLabel: string) => {
    onToast(`Updated misinformation status for article #${artId} to: "${newLabel}"`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-500/15 text-rose-400 flex items-center justify-center border border-rose-500/20">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">Fake News & Misinformation Detection Dashboard</h2>
            <p className="text-xs text-slate-400">BERT + XGBoost claim verification and synthetic text risk scoring engine</p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Total Analyzed', val: totalAnalyzed, col: 'text-slate-100' },
          { label: 'Likely Real', val: likelyReal, col: 'text-emerald-400' },
          { label: 'Potentially Fake', val: potentiallyFake, col: 'text-rose-400' },
          { label: 'Avg Confidence', val: `${avgConfidence}%`, col: 'text-indigo-400' },
          { label: 'Needs Review', val: needsReviewCount, col: 'text-amber-400' }
        ].map((kpi, idx) => (
          <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 text-center">
            <div className={`text-xl font-extrabold font-mono ${kpi.col}`}>{kpi.val}</div>
            <div className="text-[10px] text-slate-500 font-mono uppercase mt-0.5">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pie Chart: Real vs Fake */}
        <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">Verdict Distribution</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 text-[11px] font-mono">
            {pieData.map((d, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-slate-400">{d.name}: {d.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Breakdown Bar Chart */}
        <div className="lg:col-span-2 p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">Misinformation Risk by News Category</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryMisinfoData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="category" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                <Bar dataKey="real" fill="#10b981" name="Likely Real" radius={[4, 4, 0, 0]} />
                <Bar dataKey="fake" fill="#f43f5e" name="Potentially Misleading" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Flagged Articles Moderation Table */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search articles in fake news review queue..."
              className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <select
            value={verdictFilter}
            onChange={e => setVerdictFilter(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none font-mono"
          >
            <option value="ALL">All Verdicts</option>
            <option value="fake">Potentially Fake</option>
            <option value="review">Needs Review</option>
            <option value="real">Likely Real</option>
          </select>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950">
          <table className="w-full text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-500 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3.5 text-left">Article Title</th>
                <th className="p-3.5 text-left">Prediction Label</th>
                <th className="p-3.5 text-left">Confidence</th>
                <th className="p-3.5 text-left">Category</th>
                <th className="p-3.5 text-right">Review Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredArticles.map(art => {
                const isFake = art.fakeNewsReport?.isLikelyFake;
                const label = isFake ? 'Potentially Fake' : 'Likely Real';
                return (
                  <tr key={art.id} className="hover:bg-slate-900/60 transition-colors">
                    <td className="p-3.5 max-w-sm">
                      <button onClick={() => onOpenDetailModal(art)} className="font-semibold text-slate-100 hover:text-indigo-400 text-left line-clamp-1 cursor-pointer">
                        {art.title}
                      </button>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">{art.source.name}</div>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        isFake ? 'bg-rose-500/15 text-rose-400 border-rose-500/30' : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                      }`}>
                        {label}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono font-bold text-indigo-400">
                      {art.fakeNewsReport?.confidenceScore || 92}%
                    </td>
                    <td className="p-3.5 text-slate-400 font-mono text-[10px]">
                      {art.category}
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleUpdateStatus(art.id, 'Likely Real')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 text-[10px] font-bold cursor-pointer"
                        >
                          Mark Verified
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(art.id, 'Potentially Fake')}
                          className="px-2.5 py-1 rounded-lg bg-rose-600/20 text-rose-400 hover:bg-rose-600/30 text-[10px] font-bold cursor-pointer"
                        >
                          Mark Suspicious
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
