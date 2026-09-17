import React from 'react';
import { BarChart3, TrendingUp, Users, Eye, Clock, Bookmark, PieChart as PieIcon } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

export const AdminAnalyticsView: React.FC = () => {
  const userGrowth = [
    { month: 'Jan', users: 12000, articles: 4200 },
    { month: 'Feb', users: 15400, articles: 5800 },
    { month: 'Mar', users: 19800, articles: 7400 },
    { month: 'Apr', users: 24100, articles: 9200 },
    { month: 'May', users: 28900, articles: 12100 },
    { month: 'Jun', users: 32480, articles: 14820 }
  ];

  const categoryDistribution = [
    { name: 'AI & Technology', value: 42, color: '#6366f1' },
    { name: 'Business & Finance', value: 24, color: '#10b981' },
    { name: 'Science & Space', value: 16, color: '#a855f7' },
    { name: 'Health & Medicine', value: 10, color: '#06b6d4' },
    { name: 'World & Politics', value: 8, color: '#f43f5e' }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">Full-Platform Interactive Analytics Engine</h2>
            <p className="text-xs text-slate-400">Recharts data visualization across User Growth, Category Trends, and Reading Completion</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Growth */}
        <div className="lg:col-span-2 p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
          <h3 className="text-xs font-bold text-slate-200 font-mono uppercase tracking-wider">User Growth vs Article Corpus Scaling</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={userGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                <Area type="monotone" dataKey="users" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} name="Users" />
                <Area type="monotone" dataKey="articles" stroke="#10b981" fill="#10b981" fillOpacity={0.2} name="Articles" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
          <h3 className="text-xs font-bold text-slate-200 font-mono uppercase tracking-wider">Category Share Breakdown</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryDistribution} dataKey="value" cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4}>
                  {categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 text-[11px] font-mono">
            {categoryDistribution.map((c, i) => (
              <div key={i} className="flex items-center justify-between text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                  <span>{c.name}</span>
                </div>
                <span className="font-bold text-slate-200">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
