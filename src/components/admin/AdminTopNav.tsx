import React, { useState } from 'react';
import {
  Search, Bell, RefreshCw, Cpu, ShieldAlert, Sparkles, Menu, Command,
  CheckCircle2, AlertTriangle, X
} from 'lucide-react';
import { UserProfile } from '../../types';

interface AdminTopNavProps {
  user: UserProfile | null;
  onOpenMobileSidebar: () => void;
  onOpenGlobalSearch: () => void;
  onToast: (msg: string) => void;
}

export const AdminTopNav: React.FC<AdminTopNavProps> = ({
  user,
  onOpenMobileSidebar,
  onOpenGlobalSearch,
  onToast
}) => {
  const [alertsOpen, setAlertsOpen] = useState(false);

  const mockSystemAlerts = [
    { id: '1', type: 'WARN', title: 'High Misinformation Cluster', time: '10m ago', msg: '3 articles flagged with synthetic probability > 85%' },
    { id: '2', type: 'INFO', title: 'FAISS Index Re-clustered', time: '1h ago', msg: '148,290 embeddings optimized in 420ms' },
    { id: '3', type: 'SUCCESS', title: 'JASP Datasets Exported', time: '2h ago', msg: 'All 6 academic CSV files synchronized successfully' }
  ];

  return (
    <header className="sticky top-0 z-30 w-full bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-4 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Menu + Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileSidebar}
            className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Quick Search trigger */}
          <button
            onClick={onOpenGlobalSearch}
            className="hidden sm:flex items-center gap-3 px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 text-xs w-64 md:w-80 transition-all cursor-pointer shadow-inner"
          >
            <Search className="w-4 h-4 text-indigo-400" />
            <span className="flex-1 text-left truncate">Search articles, users, logs, models...</span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-400 border border-slate-700 flex items-center gap-0.5">
              <Command className="w-3 h-3" /> K
            </kbd>
          </button>
        </div>

        {/* Right: Quick Action Controls + Notifications + Profile */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenGlobalSearch}
            className="sm:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            title="Global Search"
          >
            <Search className="w-4 h-4" />
          </button>

          <button
            onClick={() => onToast('Flushed Redis L2 Cache & Purged Stale Sessions')}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500 text-slate-300 text-xs font-bold transition-all cursor-pointer"
            title="Flush Cache"
          >
            <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
            <span>Flush Cache</span>
          </button>

          <button
            onClick={() => onToast('Triggered FAISS Vector Re-indexing Pipeline')}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-600/30 text-xs font-bold transition-all cursor-pointer"
            title="Re-index ML Store"
          >
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            <span>Re-index FAISS</span>
          </button>

          {/* System Alerts Dropdown */}
          <div className="relative">
            <button
              onClick={() => setAlertsOpen(!alertsOpen)}
              className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500" />
            </button>

            {alertsOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-slate-950 border border-slate-800 p-3 shadow-2xl space-y-2 z-50 animate-fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-slate-200 font-mono uppercase">System Audit Alerts</span>
                  <button onClick={() => setAlertsOpen(false)} className="text-slate-500 hover:text-slate-300">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="space-y-1.5 max-h-60 overflow-y-auto">
                  {mockSystemAlerts.map(alert => (
                    <div key={alert.id} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-bold">
                        <span className={alert.type === 'WARN' ? 'text-amber-400' : alert.type === 'SUCCESS' ? 'text-emerald-400' : 'text-indigo-400'}>
                          {alert.title}
                        </span>
                        <span className="text-[9px] font-mono text-slate-500">{alert.time}</span>
                      </div>
                      <p className="text-[10px] text-slate-400">{alert.msg}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Badge */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center font-bold text-white text-xs shadow-md">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold text-slate-200">{user?.name || 'Enterprise Admin'}</div>
              <div className="text-[9px] font-mono text-rose-400 font-bold uppercase tracking-widest">{user?.role || 'admin'}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
