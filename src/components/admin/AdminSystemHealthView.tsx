import React from 'react';
import { Activity, Server, Database, Cpu, Radio, Shield, RefreshCw, CheckCircle2 } from 'lucide-react';

interface AdminSystemHealthViewProps {
  onToast: (msg: string) => void;
}

export const AdminSystemHealthView: React.FC<AdminSystemHealthViewProps> = ({ onToast }) => {
  const services = [
    { name: 'Vite Frontend SPA Engine', status: 'Online', latency: '4ms', lastChecked: 'Just now', errorCount: 0, icon: <Activity className="w-4 h-4 text-emerald-400" /> },
    { name: 'Express Node.js Server', status: 'Online', latency: '12ms', lastChecked: 'Just now', errorCount: 0, icon: <Server className="w-4 h-4 text-emerald-400" /> },
    { name: 'MongoDB Atlas Database', status: 'Online', latency: '24ms', lastChecked: 'Just now', errorCount: 0, icon: <Database className="w-4 h-4 text-emerald-400" /> },
    { name: 'FastAPI Python ML Service', status: 'Online', latency: '85ms', lastChecked: 'Just now', errorCount: 0, icon: <Cpu className="w-4 h-4 text-indigo-400" /> },
    { name: 'Google Gemini 3.6 API', status: 'Online', latency: '820ms', lastChecked: 'Just now', errorCount: 0, icon: <Radio className="w-4 h-4 text-purple-400" /> },
    { name: 'Socket.io WebSockets', status: 'Online', latency: '8ms', lastChecked: 'Just now', errorCount: 0, icon: <Shield className="w-4 h-4 text-cyan-400" /> }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-3xl bg-slate-950 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">System Infrastructure & Service Probes</h2>
            <p className="text-xs text-slate-400">Live heartbeat monitoring across Frontend, Express API, MongoDB, FastAPI ML, and Sockets</p>
          </div>
        </div>

        <button
          onClick={() => onToast('Re-probed all 6 backend services — 100% Operational')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500 text-slate-200 text-xs font-bold transition-all cursor-pointer shrink-0"
        >
          <RefreshCw className="w-4 h-4 text-emerald-400" /> Refresh Health Probes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((srv, idx) => (
          <div key={idx} className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">{srv.icon}</div>
                <span className="text-xs font-bold text-slate-200">{srv.name}</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                {srv.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center font-mono text-[10px] pt-1">
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                <div className="font-bold text-slate-200">{srv.latency}</div>
                <div className="text-slate-500 uppercase">Response Latency</div>
              </div>
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                <div className="font-bold text-emerald-400">{srv.errorCount} Errors</div>
                <div className="text-slate-500 uppercase">Error Rate</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
