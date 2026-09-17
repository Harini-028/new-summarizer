import React from 'react';
import { Server, Zap, CheckCircle2, AlertTriangle, Activity } from 'lucide-react';

export const AdminAPIMonitoringView: React.FC = () => {
  const endpoints = [
    { endpoint: '/api/news', requests: 142800, successRate: '99.8%', avgResponse: '14ms', lastRequest: 'Just now' },
    { endpoint: '/api/auth/login', requests: 34200, successRate: '99.9%', avgResponse: '28ms', lastRequest: 'Just now' },
    { endpoint: '/api/ai/summarize', requests: 18400, successRate: '99.2%', avgResponse: '820ms', lastRequest: '2m ago' },
    { endpoint: '/api/ai/fake-news', requests: 12100, successRate: '99.5%', avgResponse: '95ms', lastRequest: '5m ago' },
    { endpoint: '/api/user/diversity-score', requests: 8900, successRate: '100%', avgResponse: '8ms', lastRequest: '1m ago' },
    { endpoint: '/api/admin/overview-stats', requests: 4200, successRate: '100%', avgResponse: '6ms', lastRequest: 'Just now' }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">REST & ML API Performance Monitoring</h2>
            <p className="text-xs text-slate-400">Endpoint traffic volumes, success rates, and response latencies</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950">
        <table className="w-full text-xs text-slate-300">
          <thead className="bg-slate-950 text-slate-500 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="p-3.5 text-left">API Endpoint</th>
              <th className="p-3.5 text-left">Requests Today</th>
              <th className="p-3.5 text-left">Success Rate</th>
              <th className="p-3.5 text-left">Avg Latency</th>
              <th className="p-3.5 text-right">Last Request</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {endpoints.map((ep, i) => (
              <tr key={i} className="hover:bg-slate-900/60 transition-colors">
                <td className="p-3.5 font-bold text-indigo-400">{ep.endpoint}</td>
                <td className="p-3.5 text-slate-200">{ep.requests.toLocaleString()}</td>
                <td className="p-3.5 text-emerald-400 font-bold">{ep.successRate}</td>
                <td className="p-3.5 text-cyan-400 font-bold">{ep.avgResponse}</td>
                <td className="p-3.5 text-right text-slate-500">{ep.lastRequest}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
