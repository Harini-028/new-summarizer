import React, { useState } from 'react';
import { 
  ShieldAlert, CheckCircle2, AlertTriangle, Search, Filter, 
  Eye, RefreshCw, Shield, Globe, ExternalLink, MessageSquare, Check, X
} from 'lucide-react';
import { Article } from '../../types';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface AdminFakeNewsViewProps {
  articles: Article[];
  onOpenDetailModal: (art: Article) => void;
  onArticleUpdated?: (art: Article) => void;
  onToast: (msg: string) => void;
}

export const AdminFakeNewsView: React.FC<AdminFakeNewsViewProps> = ({
  articles,
  onOpenDetailModal,
  onArticleUpdated,
  onToast
}) => {
  const [search, setSearch] = useState('');
  const [verdictFilter, setVerdictFilter] = useState('ALL');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [activeNotesModalArt, setActiveNotesModalArt] = useState<Article | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');

  const token = localStorage.getItem('chronicle_admin_token') || 
                localStorage.getItem('chronicle_token') || 
                sessionStorage.getItem('chronicle_admin_token') || 
                sessionStorage.getItem('chronicle_token');

  // Compute Fake News Statistics
  const totalAnalyzed = articles.length;
  const likelyReal = articles.filter(a => !a.fakeNewsReport?.isLikelyFake && a.fakeNewsReport?.verdict !== 'High Misinformation Risk').length;
  const potentiallyFake = articles.filter(a => a.fakeNewsReport?.isLikelyFake || a.fakeNewsReport?.verdict === 'High Misinformation Risk').length;
  const needsReviewCount = articles.filter(a => 
    a.fakeNewsReport?.adminReviewStatus === 'pending' || a.fakeNewsReport?.verdict === 'Needs Fact-Checking'
  ).length;
  const avgConfidence = Math.round(
    articles.reduce((sum, a) => sum + (a.fakeNewsReport?.confidenceScore || 90), 0) / Math.max(articles.length, 1)
  );

  // Pie chart data
  const pieData = [
    { name: 'Likely Real', value: Math.max(1, likelyReal), color: '#10b981' },
    { name: 'Needs Review', value: Math.max(1, needsReviewCount), color: '#f59e0b' },
    { name: 'Potentially Fake', value: Math.max(1, potentiallyFake), color: '#f43f5e' }
  ];

  // Category breakdown data
  const categoryMisinfoData = [
    { category: 'World & Politics', fake: 4, real: 28 },
    { category: 'Health & Med', fake: 3, real: 21 },
    { category: 'Business', fake: 2, real: 26 },
    { category: 'AI & Tech', fake: 1, real: 42 },
    { category: 'Science', fake: 1, real: 19 }
  ];

  const filteredArticles = articles.filter(a => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) || 
                        a.source.name.toLowerCase().includes(search.toLowerCase());
    const isFake = a.fakeNewsReport?.isLikelyFake || a.fakeNewsReport?.verdict === 'High Misinformation Risk';
    const matchVerdict = verdictFilter === 'ALL' ||
      (verdictFilter === 'fake' && isFake) ||
      (verdictFilter === 'real' && !isFake) ||
      (verdictFilter === 'review' && (a.fakeNewsReport?.adminReviewStatus === 'pending' || a.fakeNewsReport?.verdict === 'Needs Fact-Checking'));
    return matchSearch && matchVerdict;
  });

  const handleUpdateStatus = async (
    art: Article, 
    newStatus: 'verified' | 'flagged' | 'inconclusive' | 'pending' | 'unreviewed' | 'verified_authentic' | 'flagged_misinformation' | 'needs_review', 
    newVerdict: string,
    notes?: string
  ) => {
    setUpdatingId(art.id);
    try {
      const res = await fetch(`/api/admin/news/${art.id}/review`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          adminReviewStatus: newStatus,
          verdict: newVerdict,
          confidenceScore: newStatus === 'verified' ? 98 : (newStatus === 'flagged' ? 95 : 75),
          reviewNotes: notes || `Reviewed by Administrator on ${new Date().toLocaleDateString()}`
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update review status');

      if (onArticleUpdated && data.article) {
        onArticleUpdated(data.article);
      }
      onToast(`Review status for "${art.title.substring(0, 25)}..." updated to ${newVerdict}.`);
    } catch (err: any) {
      onToast(err.message || 'Error updating misinformation review.');
    } finally {
      setUpdatingId(null);
      setActiveNotesModalArt(null);
      setReviewNotes('');
    }
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
            <h2 className="text-xl font-extrabold text-white">Misinformation & Fake News Review Center</h2>
            <p className="text-xs text-slate-400">
              Audit AI-generated veracity claims, inspect primary source domains, and record manual editorial determinations
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Total Audited', val: totalAnalyzed, col: 'text-slate-100' },
          { label: 'Verified Real', val: likelyReal, col: 'text-emerald-400' },
          { label: 'Flagged Fake', val: potentiallyFake, col: 'text-rose-400' },
          { label: 'Avg AI Confidence', val: `${avgConfidence}%`, col: 'text-indigo-400' },
          { label: 'Pending Review', val: needsReviewCount, col: 'text-amber-400' }
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
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">Misinformation Risk by Category</h3>
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
              placeholder="Search by article title or news source..."
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
                <th className="p-3.5 text-left">Article Title & Source</th>
                <th className="p-3.5 text-left">AI Prediction</th>
                <th className="p-3.5 text-left">Admin Review</th>
                <th className="p-3.5 text-left">Confidence</th>
                <th className="p-3.5 text-right">Editorial Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredArticles.map(art => {
                const isFake = art.fakeNewsReport?.isLikelyFake;
                const adminStatus = art.fakeNewsReport?.adminReviewStatus || 'pending';
                const isUpdating = updatingId === art.id;

                return (
                  <tr key={art.id} className="hover:bg-slate-900/60 transition-colors">
                    <td className="p-3.5 max-w-sm">
                      <button 
                        onClick={() => onOpenDetailModal(art)} 
                        className="font-semibold text-slate-100 hover:text-indigo-400 text-left line-clamp-1 cursor-pointer"
                      >
                        {art.title}
                      </button>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono mt-0.5">
                        <span className="text-slate-400">{art.source.name}</span>
                        {art.sourceUrl && (
                          <a
                            href={art.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-400 hover:underline flex items-center gap-0.5"
                          >
                            <Globe className="w-3 h-3" />
                            <span>Source</span>
                          </a>
                        )}
                      </div>
                    </td>

                    <td className="p-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        isFake 
                          ? 'bg-rose-500/15 text-rose-400 border-rose-500/30' 
                          : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                      }`}>
                        {art.fakeNewsReport?.verdict || (isFake ? 'High Misinformation Risk' : 'Verified Real')}
                      </span>
                    </td>

                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        adminStatus === 'verified'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : adminStatus === 'flagged'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}>
                        {adminStatus}
                      </span>
                      {art.fakeNewsReport?.reviewNotes && (
                        <div className="text-[10px] text-slate-400 line-clamp-1 italic mt-0.5">
                          "{art.fakeNewsReport.reviewNotes}"
                        </div>
                      )}
                    </td>

                    <td className="p-3.5 font-mono font-bold text-indigo-400">
                      {art.fakeNewsReport?.confidenceScore || 92}%
                    </td>

                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          disabled={isUpdating}
                          onClick={() => handleUpdateStatus(art, 'verified', 'Verified Authentic by Editorial')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 text-[10px] font-bold cursor-pointer transition-colors disabled:opacity-50"
                          title="Mark article verified authentic"
                        >
                          Mark Real
                        </button>
                        <button
                          disabled={isUpdating}
                          onClick={() => handleUpdateStatus(art, 'flagged', 'Flagged Misinformation')}
                          className="px-2.5 py-1 rounded-lg bg-rose-600/20 text-rose-400 hover:bg-rose-600/30 text-[10px] font-bold cursor-pointer transition-colors disabled:opacity-50"
                          title="Flag as misinformation"
                        >
                          Flag Fake
                        </button>
                        <button
                          onClick={() => {
                            setActiveNotesModalArt(art);
                            setReviewNotes(art.fakeNewsReport?.reviewNotes || '');
                          }}
                          className="p-1 rounded-lg bg-slate-900 text-slate-400 hover:text-white cursor-pointer"
                          title="Add review notes"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
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

      {/* Review Notes Modal */}
      {activeNotesModalArt && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">Record Fact-Check Note</h3>
              <button onClick={() => setActiveNotesModalArt(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 font-medium line-clamp-2">
              "{activeNotesModalArt.title}"
            </p>

            <textarea
              rows={3}
              value={reviewNotes}
              onChange={e => setReviewNotes(e.target.value)}
              placeholder="Record editorial corroboration, primary wire references, or rationale..."
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setActiveNotesModalArt(null)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-400 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdateStatus(
                  activeNotesModalArt, 
                  activeNotesModalArt.fakeNewsReport?.adminReviewStatus || 'pending',
                  activeNotesModalArt.fakeNewsReport?.verdict || 'Needs Fact-Checking',
                  reviewNotes
                )}
                className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
              >
                Save Notes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
