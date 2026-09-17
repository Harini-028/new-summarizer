import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, PieChart, ShieldCheck, Activity, Eye, ThumbsUp, Database } from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart as RePieChart, 
  Pie, 
  Cell 
} from 'recharts';

export default function AnalyticsDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics')
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load analytics:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 rounded-full border-4 border-indigo-600/30 border-t-indigo-600 animate-spin" />
      </div>
    );
  }

  const userGrowth = data?.userGrowth || [
    { month: 'Jan', users: 12000, activeUsers: 8400 },
    { month: 'Feb', users: 19000, activeUsers: 14200 },
    { month: 'Mar', users: 28000, activeUsers: 21500 },
    { month: 'Apr', users: 42000, activeUsers: 33800 },
    { month: 'May', users: 68000, activeUsers: 51200 },
    { month: 'Jun', users: 104000, activeUsers: 89000 }
  ];

  const sentimentDistribution = data?.sentimentDistribution || [
    { name: 'Positive', value: 48, fill: '#10b981' },
    { name: 'Neutral', value: 32, fill: '#6366f1' },
    { name: 'Negative', value: 20, fill: '#f43f5e' }
  ];

  const fakeNews = data?.fakeNewsMetrics || {
    totalAudited: 142800,
    fakeDetected: 12400,
    avgTrustScore: 92.4,
    topFlaggedDomains: ['buzz-click-news.org', 'truth-unfiltered-blog.net', 'crypto-moon-claims.io']
  };

  const engagement = data?.engagement || {
    totalArticles: 8,
    totalViews: 104800,
    totalLikes: 14200
  };

  const categoryDistribution = [
    { name: 'AI & Tech', value: 42 },
    { name: 'Business', value: 24 },
    { name: 'Science', value: 18 },
    { name: 'Health', value: 10 },
    { name: 'World', value: 6 }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-indigo-400" />
          <h2 className="text-lg font-bold text-slate-100">Enterprise Platform Analytics & Reader Metrics</h2>
        </div>
        <p className="text-xs text-slate-400">
          Real-time tracking of active reader engagement, topic distribution, sentiment polarity, and recommendation accuracy.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-semibold text-slate-500 flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-indigo-400" /> Active Readers
          </span>
          <p className="text-2xl font-extrabold text-slate-100 font-mono">{(userGrowth[userGrowth.length - 1]?.activeUsers / 1000).toFixed(1)}k</p>
          <span className="text-[10px] text-emerald-400 font-bold">+18.4% this month</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-semibold text-slate-500 flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-cyan-400" /> Articles Read
          </span>
          <p className="text-2xl font-extrabold text-slate-100 font-mono">{engagement.totalViews.toLocaleString()}</p>
          <span className="text-[10px] text-indigo-400 font-bold">{engagement.totalArticles} source articles</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-semibold text-slate-500 flex items-center gap-1">
            <ThumbsUp className="w-3.5 h-3.5 text-emerald-400" /> Article Likes
          </span>
          <p className="text-2xl font-extrabold text-slate-100 font-mono">{engagement.totalLikes.toLocaleString()}</p>
          <span className="text-[10px] text-emerald-400 font-bold">{(engagement.totalLikes / engagement.totalViews * 100).toFixed(1)}% click engagement</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] uppercase font-semibold text-slate-500 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-rose-400" /> Fake Audited
          </span>
          <p className="text-2xl font-extrabold text-rose-400 font-mono">{fakeNews.fakeDetected.toLocaleString()}</p>
          <span className="text-[10px] text-slate-400">Out of {fakeNews.totalAudited.toLocaleString()} requests</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* User Growth Area Chart */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center justify-between">
            <span>Reader Growth Velocity (Active vs Total)</span>
            <Activity className="w-4 h-4 text-indigo-400" />
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={userGrowth}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                <Area type="monotone" dataKey="activeUsers" stroke="#6366f1" fillOpacity={1} fill="url(#colorUsers)" name="Active Readers" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sentiment Distribution Pie Chart */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center justify-between">
            <span>Linguistic Sentiment Distribution (%)</span>
            <PieChart className="w-4 h-4 text-emerald-400" />
          </h3>
          <div className="h-64 flex items-center justify-center">
            <div className="w-1/2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={sentimentDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {sentimentDistribution.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                </RePieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/2 space-y-2 text-xs">
              {sentimentDistribution.map((item: any, i: number) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }} />
                  <span className="text-slate-300">{item.name}</span>
                  <span className="font-mono font-bold text-slate-100">({item.value}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Flagged Domains */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-slate-100 flex items-center justify-between">
          <span>High-Risk Flagged Misinformation Domains</span>
          <Database className="w-4 h-4 text-rose-500" />
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {fakeNews.topFlaggedDomains.map((domain: string, idx: number) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-semibold text-rose-300 flex items-center justify-between">
              <span className="font-mono">{domain}</span>
              <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-500 text-[10px]">Flagged</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
