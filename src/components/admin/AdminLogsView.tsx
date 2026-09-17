import React, { useState } from 'react';
import { Terminal, Search, Download, Trash2, Filter } from 'lucide-react';

export const AdminLogsView: React.FC<{ onToast: (msg: string) => void }> = ({ onToast }) => {
  const [levelFilter, setLevelFilter] = useState<'ALL' | 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL'>('ALL');
  const [search, setSearch] = useState('');

  const [logs] = useState([
    { time: '11:42:01', level: 'INFO', service: 'AUTH', msg: 'Admin user demo@chronicle.ai logged in successfully.' },
    { time: '11:38:15', level: 'INFO', service: 'FAISS', msg: 'Vector index re-clustered: 148,290 embeddings optimized.' },
    { time: '11:25:40', level: 'WARNING', service: 'FACTCHECK', msg: 'High misinformation risk on domain health-miracle-daily.xyz.' },
    { time: '11:10:02', level: 'INFO', service: 'GEMINI', msg: 'Gemini 3.6 Flash summarizer executed on article #art_142.' },
    { time: '10:55:18', level: 'ERROR', service: 'ROBERTA', msg: 'Model inference timeout on batch #42. Auto-retried.' },
    { time: '10:30:00', level: 'CRITICAL', service: 'SYSTEM', msg: 'High memory usage spike detected on worker process #2.' }
  ]);

  const filteredLogs = logs.filter(l => {
    const matchLevel = levelFilter === 'ALL' || l.level === levelFilter;
    const matchSearch = !search || l.msg.toLowerCase().includes(search.toLowerCase()) || l.service.toLowerCase().includes(search.toLowerCase());
    return matchLevel && matchSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">System Audit Logs & Security Console</h2>
            <p className="text-xs text-slate-400">Structured system event logging across Authentication, NLP Inferences, and Database operations</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-slate-950 border border-slate-800">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search logs by message or service name..."
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
          />
        </div>

        <div className="flex items-center gap-2">
          {(['ALL', 'INFO', 'WARNING', 'ERROR', 'CRITICAL'] as const).map(lvl => (
            <button
              key={lvl}
              onClick={() => setLevelFilter(lvl)}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-mono font-bold transition-all cursor-pointer ${
                levelFilter === lvl ? 'bg-indigo-600 text-white' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 rounded-3xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-xs max-h-96 overflow-y-auto scrollbar-thin">
        {filteredLogs.map((log, i) => (
          <div key={i} className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-center gap-3">
            <span className="text-slate-500 text-[10px] shrink-0">{log.time}</span>
            <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold shrink-0 ${
              log.level === 'CRITICAL' ? 'bg-rose-600 text-white' :
              log.level === 'ERROR' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
              log.level === 'WARNING' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
              'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
            }`}>
              {log.level}
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 shrink-0 text-[10px]">{log.service}</span>
            <span className="text-slate-300 truncate">{log.msg}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
