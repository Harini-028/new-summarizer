import React from 'react';
import {
  Newspaper, CheckCircle2, Clock, Flame, Sparkles, Users, 
  Calendar, RefreshCw, AlertCircle, ShieldAlert,
  ArrowUpRight, Plus, FolderKanban, ShieldCheck, History
} from 'lucide-react';
import { Article, UserProfile } from '../../types';
import {
  ResponsiveContainer,
  AreaChart, Area,
  BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, CartesianGrid, Legend
} from 'recharts';

export interface NewsStats {
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  breakingNews: number;
  featuredArticles: number;
  totalRegisteredUsers?: number;
  articlesCreatedToday?: number;
  articlesUpdatedRecently?: number;
  articlesPendingReview?: number;
  publishedOverTime?: { day: string; count: number; views?: number; reads?: number }[];
  articlesByCategory?: { category: string; count: number }[];
  articleStatusDistribution?: { name: string; value: number; color: string }[];
}

interface AdminOverviewViewProps {
  articles: Article[];
  users: UserProfile[];
  stats?: NewsStats | null;
  onNavigateSection: (sec: any) => void;
  onRefresh?: () => void;
  onToast: (msg: string) => void;
}

export const AdminOverviewView: React.FC<AdminOverviewViewProps> = ({
  articles,
  users,
  stats,
  onNavigateSection,
  onRefresh,
  onToast
}) => {
  // Real database metrics directly from backend stats response or computed from database articles
  const totalArticles = stats?.totalArticles ?? articles.length;
  const publishedCount = stats?.publishedArticles ?? articles.filter(a => ((a as any).status || 'published') === 'published').length;
  const draftCount = stats?.draftArticles ?? articles.filter(a => (a as any).status === 'draft').length;
  const breakingCount = stats?.breakingNews ?? articles.filter(a => !!a.isBreaking).length;
  const featuredCount = stats?.featuredArticles ?? articles.filter(a => !!a.isFeatured).length;
  const totalRegisteredUsers = stats?.totalRegisteredUsers ?? users.length;

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const articlesCreatedToday = stats?.articlesCreatedToday ?? articles.filter(a => new Date(a.createdAt || a.publishedAt) >= startOfToday).length;
  const articlesUpdatedRecently = stats?.articlesUpdatedRecently ?? articles.filter(a => new Date(a.updatedAt || a.publishedAt) >= sevenDaysAgo).length;
  const articlesPendingReview = stats?.articlesPendingReview ?? articles.filter(a => 
    a.fakeNewsReport?.verdict === 'Needs Fact-Checking' || 
    (a as any).status === 'draft' || 
    (a.fakeNewsReport as any)?.adminReviewStatus === 'needs_review'
  ).length;

  // The 5 Required Dashboard Cards + User Count
  const coreStatsCards = [
    {
      id: 'total-articles',
      label: 'Total Articles',
      value: totalArticles,
      section: 'news-management',
      subtext: 'All articles in MongoDB database',
      icon: <Newspaper className="w-5 h-5 text-indigo-400" />,
      bgGradient: 'from-indigo-950/60 via-slate-900 to-slate-950',
      borderColor: 'border-indigo-500/30 hover:border-indigo-400',
      textColor: 'text-indigo-400'
    },
    {
      id: 'published-articles',
      label: 'Published Articles',
      value: publishedCount,
      section: 'published-news',
      subtext: 'Live on public portal & feed',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
      bgGradient: 'from-emerald-950/60 via-slate-900 to-slate-950',
      borderColor: 'border-emerald-500/30 hover:border-emerald-400',
      textColor: 'text-emerald-400'
    },
    {
      id: 'draft-articles',
      label: 'Draft Articles',
      value: draftCount,
      section: 'draft-news',
      subtext: 'Unpublished & hidden from public',
      icon: <Clock className="w-5 h-5 text-amber-400" />,
      bgGradient: 'from-amber-950/60 via-slate-900 to-slate-950',
      borderColor: 'border-amber-500/30 hover:border-amber-400',
      textColor: 'text-amber-400'
    },
    {
      id: 'breaking-news',
      label: 'Breaking News',
      value: breakingCount,
      section: 'breaking-news',
      subtext: 'High-priority alert broadcasts',
      icon: <Flame className="w-5 h-5 text-rose-400" />,
      bgGradient: 'from-rose-950/60 via-slate-900 to-slate-950',
      borderColor: 'border-rose-500/30 hover:border-rose-400',
      textColor: 'text-rose-400'
    },
    {
      id: 'featured-articles',
      label: 'Featured Articles',
      value: featuredCount,
      section: 'featured-news',
      subtext: 'Editorially highlighted stories',
      icon: <Sparkles className="w-5 h-5 text-purple-400" />,
      bgGradient: 'from-purple-950/60 via-slate-900 to-slate-950',
      borderColor: 'border-purple-500/30 hover:border-purple-400',
      textColor: 'text-purple-400'
    },
    {
      id: 'total-users',
      label: 'Total Registered Users',
      value: totalRegisteredUsers,
      section: 'users',
      subtext: 'Verified user accounts in DB',
      icon: <Users className="w-5 h-5 text-cyan-400" />,
      bgGradient: 'from-cyan-950/60 via-slate-900 to-slate-950',
      borderColor: 'border-cyan-500/30 hover:border-cyan-400',
      textColor: 'text-cyan-400'
    }
  ];

  // Chart 1: Articles published over time (Real data from backend stats or computed from loaded articles)
  const publishedOverTimeData = stats?.publishedOverTime && stats.publishedOverTime.length > 0
    ? stats.publishedOverTime
    : (() => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const map = new Map<string, number>();
        for (let i = 6; i >= 0; i--) {
          const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
          map.set(days[d.getDay()], 0);
        }
        for (const a of articles) {
          const d = new Date(a.publishedAt);
          const name = days[d.getDay()];
          if (map.has(name)) {
            map.set(name, (map.get(name) || 0) + 1);
          }
        }
        return Array.from(map.entries()).map(([day, count]) => ({ day, count }));
      })();

  // Chart 2: Articles by Category (Real data from backend stats or computed from loaded articles)
  const categoryData = stats?.articlesByCategory && stats.articlesByCategory.length > 0
    ? stats.articlesByCategory
    : (() => {
        const catMap = new Map<string, number>();
        for (const art of articles) {
          const cat = art.category || 'General';
          catMap.set(cat, (catMap.get(cat) || 0) + 1);
        }
        return Array.from(catMap.entries())
          .map(([category, count]) => ({ category, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 7);
      })();

  // Chart 3: Article Status Distribution (Real data from backend stats or computed from loaded articles)
  const statusDistributionData = stats?.articleStatusDistribution && stats.articleStatusDistribution.length > 0
    ? stats.articleStatusDistribution
    : [
        { name: 'Published', value: publishedCount, color: '#10b981' },
        { name: 'Draft', value: draftCount, color: '#f59e0b' }
      ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Welcome & Telemetry Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/90 border border-slate-800 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            ADMINISTRATOR INTELLIGENCE CONSOLE
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Admin Dashboard Overview</h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Real-time MongoDB Atlas telemetry across {totalArticles} verified articles, user directory statistics, and content moderation queue.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 w-full md:w-auto">
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-all cursor-pointer"
              title="Refresh Live Database Statistics"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => onNavigateSection('add-article')}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-950/50 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Article</span>
          </button>

          <button
            onClick={() => onNavigateSection('news-management')}
            className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all border border-slate-700 cursor-pointer"
          >
            Manage Articles
          </button>
        </div>
      </div>

      {/* ── REAL DATABASE METRICS: 7 REQUIRED STATISTIC CARDS ── */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-xs font-mono font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <Newspaper className="w-3.5 h-3.5 text-indigo-400" />
            <span>Database Statistics Overview (Live MongoDB Atlas)</span>
          </h2>
          <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live Backend Verified
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
          {coreStatsCards.map((card) => (
            <div
              key={card.id}
              onClick={() => onNavigateSection(card.section)}
              className={`p-4 rounded-2xl bg-gradient-to-br ${card.bgGradient} border ${card.borderColor} shadow-xl hover:shadow-2xl transition-all duration-200 cursor-pointer group flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 group-hover:border-slate-700 transition-colors">
                  {card.icon}
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
              </div>

              <div className="mt-4">
                <div className={`text-2xl font-black font-mono text-white ${card.textColor} transition-colors`}>
                  {card.value.toLocaleString()}
                </div>
                <div className="text-xs font-bold text-slate-200 mt-0.5 line-clamp-1">
                  {card.label}
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5 line-clamp-1">
                  {card.subtext}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 3 REQUIRED REAL CHARTS ROW ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CHART 1: Articles Published Over Time */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-400" />
                <span>Articles Published Over Time</span>
              </h3>
              <p className="text-[11px] text-slate-400">Trend of published news articles indexed in the database</p>
            </div>
            <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-slate-800 text-slate-300">
              Live Database Telemetry
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={publishedOverTimeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="articlesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#articlesGrad)" name="Articles Published" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 3: Article Status Distribution (Pie Chart) */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Article Status Distribution</span>
            </h3>
            <p className="text-[11px] text-slate-400">Ratio of Published vs Draft articles in database</p>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80">
            {statusDistributionData.map((entry, i) => {
              const total = publishedCount + draftCount || 1;
              const pct = Math.round((entry.value / total) * 100);
              return (
                <div key={i} className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span className="text-[10px] font-mono text-slate-400">{entry.name}</span>
                  </div>
                  <div className="text-base font-bold font-mono text-white">{entry.value} ({pct}%)</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CHART 2: Articles by Category (Full Width Bar Chart) */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-purple-400" />
              <span>Articles by Category</span>
            </h3>
            <p className="text-[11px] text-slate-400">Distribution of news coverage across categories in MongoDB database</p>
          </div>
          <button
            onClick={() => onNavigateSection('categories')}
            className="text-xs font-mono text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
          >
            <span>View All Categories</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis
                dataKey="category"
                stroke="#64748b"
                fontSize={11}
                interval={0}
                angle={-15}
                textAnchor="end"
              />
              <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }}
              />
              <Bar dataKey="count" fill="#818cf8" radius={[6, 6, 0, 0]} name="Total Articles" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
