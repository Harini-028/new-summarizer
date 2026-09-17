import React, { useState, useMemo } from 'react';
import { Article, CategoryType } from '../types';
import { 
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  BarChart, Bar, Legend
} from 'recharts';
import { 
  ShieldCheck, Sliders, Scale, Compass, Filter, RefreshCw,
  Info, Sparkles, AlertTriangle, CheckCircle, ExternalLink, Eye
} from 'lucide-react';

interface MediaBiasPageProps {
  articles: Article[];
  onSelectArticle: (article: Article) => void;
  onOpenSummaryModal: (article: Article) => void;
}

export const MediaBiasPage: React.FC<MediaBiasPageProps> = ({
  articles,
  onSelectArticle,
  onOpenSummaryModal
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'All'>('All');
  const [minTrust, setMinTrust] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'quadrant' | 'publishers' | 'comparisons'>('quadrant');
  const [hoveredArticle, setHoveredArticle] = useState<Article | null>(null);

  const categories: (CategoryType | 'All')[] = [
    'All',
    'AI & Technology',
    'Business & Finance',
    'Science & Space',
    'Health & Medicine',
    'World & Politics',
    'Climate & Environment',
    'Entertainment & Culture'
  ];

  // Filtered dataset
  const filteredArticles = useMemo(() => {
    return articles.filter(a => {
      const matchCat = selectedCategory === 'All' || a.category === selectedCategory;
      const matchTrust = (a.source?.trustScore || 0) >= minTrust;
      return matchCat && matchTrust;
    });
  }, [articles, selectedCategory, minTrust]);

  // Scatter plot data
  const scatterData = useMemo(() => {
    return filteredArticles.map(a => ({
      id: a.id,
      title: a.title,
      source: a.source?.name || 'Unknown',
      trustScore: a.source?.trustScore || 50,
      sentimentScore: a.sentiment?.score || 0,
      sentimentType: a.sentiment?.type || 'Neutral',
      sentimentLabel: a.sentiment?.label || 'Balanced',
      politicalSpectrum: a.sentiment?.politicalSpectrum || 'Center',
      category: a.category,
      viewsCount: a.viewsCount || 100,
      rawArticle: a
    }));
  }, [filteredArticles]);

  // Publisher bias statistics
  const publisherStats = useMemo(() => {
    const map: Record<string, { name: string; count: number; totalTrust: number; totalSentiment: number; authenticCount: number }> = {};
    
    articles.forEach(a => {
      const pubName = a.source?.name || 'Unknown';
      if (!map[pubName]) {
        map[pubName] = { name: pubName, count: 0, totalTrust: 0, totalSentiment: 0, authenticCount: 0 };
      }
      map[pubName].count += 1;
      map[pubName].totalTrust += (a.source?.trustScore || 50);
      map[pubName].totalSentiment += (a.sentiment?.score || 0);
      if (!a.fakeNewsReport?.isLikelyFake) {
        map[pubName].authenticCount += 1;
      }
    });

    return Object.values(map).map(p => ({
      name: p.name,
      articlesCount: p.count,
      avgTrust: Math.round(p.totalTrust / p.count),
      avgSentiment: parseFloat((p.totalSentiment / p.count).toFixed(2)),
      authenticityRate: Math.round((p.authenticCount / p.count) * 100)
    })).sort((a, b) => b.avgTrust - a.avgTrust);
  }, [articles]);

  const categoryColors: Record<string, string> = {
    'AI & Technology': '#8B5CF6',
    'Business & Finance': '#10B981',
    'Science & Space': '#06B6D4',
    'Health & Medicine': '#EC4899',
    'World & Politics': '#F59E0B',
    'Climate & Environment': '#14B8A6',
    'Entertainment & Culture': '#F43F5E'
  };

  const avgTrustScore = useMemo(() => {
    if (filteredArticles.length === 0) return 0;
    const sum = filteredArticles.reduce((acc, a) => acc + (a.source?.trustScore || 0), 0);
    return Math.round(sum / filteredArticles.length);
  }, [filteredArticles]);

  const authenticRatio = useMemo(() => {
    if (filteredArticles.length === 0) return 0;
    const count = filteredArticles.filter(a => !a.fakeNewsReport?.isLikelyFake).length;
    return Math.round((count / filteredArticles.length) * 100);
  }, [filteredArticles]);

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-950/80 via-slate-900 to-cyan-950/80 border border-purple-500/20 p-8 shadow-2xl backdrop-blur-xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-3">
              <Scale className="w-3.5 h-3.5" /> Media Bias & Sentiment Matrix
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
              Cross-Source Bias & Objectivity Radar
            </h1>
            <p className="mt-2 text-slate-300 max-w-2xl text-sm leading-relaxed">
              Analyze multi-outlet narrative sentiment, publisher credibility indices, and objective reporting balances across enterprise news streams.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => { setSelectedCategory('All'); setMinTrust(0); }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition-all shadow-lg"
            >
              <RefreshCw className="w-4 h-4 text-purple-400" /> Reset Filters
            </button>
          </div>
        </div>

        {/* Telemetry Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800">
            <span className="text-xs text-slate-400 font-medium">Articles Analyzed</span>
            <div className="text-2xl font-black text-white mt-1">{filteredArticles.length}</div>
          </div>
          <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800">
            <span className="text-xs text-slate-400 font-medium">Avg Source Trust Score</span>
            <div className="text-2xl font-black text-emerald-400 mt-1">{avgTrustScore} / 100</div>
          </div>
          <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800">
            <span className="text-xs text-slate-400 font-medium">Authenticity Verification</span>
            <div className="text-2xl font-black text-cyan-400 mt-1">{authenticRatio}% Verified</div>
          </div>
          <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800">
            <span className="text-xs text-slate-400 font-medium">Publishers Tracked</span>
            <div className="text-2xl font-black text-purple-400 mt-1">{publisherStats.length} Outlets</div>
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900/70 border border-slate-800 p-4 rounded-xl backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 border-t lg:border-t-0 border-slate-800 pt-3 lg:pt-0">
          <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
            <Filter className="w-4 h-4 text-purple-400" />
            <span>Min Trust Score: <strong>{minTrust}+</strong></span>
            <input
              type="range"
              min={0}
              max={90}
              step={10}
              value={minTrust}
              onChange={(e) => setMinTrust(Number(e.target.value))}
              aria-label="Filter minimum source trust score"
              className="w-24 accent-purple-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Main View Tabs */}
      <div className="flex border-b border-slate-800 gap-2">
        <button
          onClick={() => setActiveTab('quadrant')}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'quadrant'
              ? 'border-purple-500 text-purple-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Compass className="w-4 h-4" /> 2D Sentiment & Trust Matrix
        </button>
        <button
          onClick={() => setActiveTab('publishers')}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'publishers'
              ? 'border-purple-500 text-purple-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" /> Publisher Credibility & Bias Rankings
        </button>
        <button
          onClick={() => setActiveTab('comparisons')}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'comparisons'
              ? 'border-purple-500 text-purple-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Scale className="w-4 h-4" /> Multi-Source Narrative Comparison
        </button>
      </div>

      {/* Tab 1: 2D Quadrant Scatter Plot */}
      {activeTab === 'quadrant' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl relative">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Compass className="w-4 h-4 text-cyan-400" /> Sentiment (-1.0 to +1.0) vs. Source Trust (0 - 100)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Top-right = Highly Trusted & Optimistic • Top-left = Highly Trusted & Critical • Bottom = Suspicious / Low Trust
                </p>
              </div>
            </div>

            <div className="h-[420px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                  <XAxis 
                    type="number" 
                    dataKey="sentimentScore" 
                    name="Sentiment Score" 
                    domain={[-1, 1]} 
                    stroke="#64748B"
                    tick={{ fill: '#94A3B8', fontSize: 11 }}
                    label={{ value: 'Negative / Critical  ←  Sentiment Score  →  Positive / Optimistic', position: 'insideBottom', offset: -10, fill: '#94A3B8', fontSize: 11 }}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="trustScore" 
                    name="Trust Score" 
                    domain={[0, 100]} 
                    stroke="#64748B"
                    tick={{ fill: '#94A3B8', fontSize: 11 }}
                    label={{ value: 'Source Trust Score (0-100)', angle: -90, position: 'insideLeft', fill: '#94A3B8', fontSize: 11 }}
                  />
                  <ZAxis type="number" dataKey="viewsCount" range={[60, 400]} />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-2xl max-w-xs text-xs text-white space-y-1.5">
                            <div className="font-bold text-purple-300 line-clamp-2">{data.title}</div>
                            <div className="flex items-center justify-between text-slate-400">
                              <span>Source: <strong className="text-slate-200">{data.source}</strong></span>
                              <span className="text-emerald-400 font-semibold">{data.trustScore}% Trust</span>
                            </div>
                            <div className="flex items-center justify-between text-slate-400">
                              <span>Category: <strong className="text-slate-200">{data.category}</strong></span>
                              <span className="text-cyan-400 font-semibold">{data.sentimentType} ({data.sentimentScore})</span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Scatter 
                    data={scatterData} 
                    onMouseEnter={(node: any) => setHoveredArticle(node?.payload?.rawArticle || node?.rawArticle || null)}
                    onClick={(node: any) => {
                      const article = node?.payload?.rawArticle || node?.rawArticle;
                      if (article) onOpenSummaryModal(article);
                    }}
                  >
                    {scatterData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.trustScore < 40 ? '#EF4444' : (categoryColors[entry.category] || '#8B5CF6')} 
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sidebar Inspector Panel */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-xl">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
                <Info className="w-4 h-4 text-purple-400" /> Article Inspector
              </h3>
              {hoveredArticle ? (
                <div className="space-y-4 animate-fade-in">
                  <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        {hoveredArticle.category}
                      </span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                        hoveredArticle.fakeNewsReport?.isLikelyFake 
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' 
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {hoveredArticle.fakeNewsReport?.verdict}
                      </span>
                    </div>
                    
                    <h4 className="text-sm font-bold text-white leading-snug line-clamp-3">
                      {hoveredArticle.title}
                    </h4>

                    <div className="text-xs text-slate-400 line-clamp-2">
                      {hoveredArticle.excerpt}
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-slate-500 block text-[10px]">Publisher</span>
                        <span className="font-semibold text-slate-200">{hoveredArticle.source?.name}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Trust Score</span>
                        <span className="font-semibold text-emerald-400">{hoveredArticle.source?.trustScore}%</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Sentiment Tone</span>
                        <span className="font-semibold text-cyan-400">{hoveredArticle.sentiment?.type}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Political Lean</span>
                        <span className="font-semibold text-purple-300">{hoveredArticle.sentiment?.politicalSpectrum || 'Center'}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenSummaryModal(hoveredArticle)}
                    className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" /> Open Full AI Summary & Audit
                  </button>
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-center p-6 border border-dashed border-slate-800 rounded-xl">
                  <Eye className="w-8 h-8 text-slate-600 mb-2 animate-bounce" />
                  <p className="text-xs text-slate-400">
                    Hover over or click any data point in the matrix to inspect its source credibility and tone breakdown.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-500 space-y-1">
              <div className="flex items-center gap-1.5 text-purple-300 font-semibold">
                <Sparkles className="w-3.5 h-3.5" /> AI Bias Detection Model
              </div>
              <p>
                Calculated using BERTopic cluster embeddings + RoBERTa fine-tuned sentiment weights.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Publisher Rankings */}
      {activeTab === 'publishers' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" /> Publisher Trust & Accuracy Leaderboard
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Aggregated domain reputation, empirical peer review consistency, and fact-checking pass rates across all news sources.
              </p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={publisherStats.slice(0, 8)} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="name" stroke="#64748B" tick={{ fill: '#94A3B8', fontSize: 11 }} />
                <YAxis domain={[0, 100]} stroke="#64748B" tick={{ fill: '#94A3B8', fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="avgTrust" name="Avg Trust Score (%)" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="authenticityRate" name="Authenticity Pass Rate (%)" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Publisher Table */}
          <div className="overflow-x-auto border border-slate-800 rounded-xl">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Publisher Name</th>
                  <th className="py-3 px-4 text-center">Articles Tracked</th>
                  <th className="py-3 px-4 text-center">Trust Rating</th>
                  <th className="py-3 px-4 text-center">Avg Sentiment</th>
                  <th className="py-3 px-4 text-center">Fact-Check Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {publisherStats.map((pub, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-4 font-semibold text-white flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center text-[10px] font-bold">
                        {idx + 1}
                      </span>
                      {pub.name}
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-slate-300">{pub.articlesCount}</td>
                    <td className="py-3 px-4 text-center font-bold text-emerald-400">{pub.avgTrust} / 100</td>
                    <td className="py-3 px-4 text-center font-mono text-cyan-400">{pub.avgSentiment > 0 ? `+${pub.avgSentiment}` : pub.avgSentiment}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        pub.avgTrust >= 80 
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : pub.avgTrust >= 50
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}>
                        {pub.avgTrust >= 80 ? <CheckCircle className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                        {pub.avgTrust >= 80 ? 'Verified Tier 1' : pub.avgTrust >= 50 ? 'Standard Tier 2' : 'High Risk'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Multi-Source Comparison */}
      {activeTab === 'comparisons' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredArticles.slice(0, 4).map((art) => (
            <div key={art.id} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 hover:border-purple-500/40 transition-all">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {art.category}
                </span>
                <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> {art.source?.name} ({art.source?.trustScore}% Trust)
                </span>
              </div>

              <h4 className="text-base font-bold text-white leading-snug">
                {art.title}
              </h4>

              <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                {art.excerpt}
              </p>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">Sentiment Analysis:</span>
                  <span className="text-emerald-400 font-semibold">{art.sentiment?.type} ({art.sentiment?.score})</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">Reporting Tone:</span>
                  <span className="text-cyan-400 font-semibold">{art.sentiment?.tone}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">Political Lean:</span>
                  <span className="text-purple-300 font-semibold">{art.sentiment?.politicalSpectrum || 'Center'}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => onOpenSummaryModal(art)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 text-xs font-semibold transition-all border border-slate-700 flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" /> View AI Briefing
                </button>
                <a
                  href={art.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                >
                  Source Link <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
