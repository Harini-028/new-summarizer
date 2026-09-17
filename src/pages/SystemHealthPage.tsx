import React, { useState, useEffect } from 'react';
import { Activity, Database, Cpu, Server, Wifi, WifiOff, AlertTriangle, CheckCircle, RefreshCw, Zap, BarChart3, Clock } from 'lucide-react';

interface ModelMetric {
  name: string; task: string; framework: string; modelType: string;
  status: 'healthy' | 'warning' | 'needs_retraining' | 'offline';
  metrics: Record<string, number>;
  callsToday: number; avgLatencyMs: number;
}

interface SystemHealthData {
  backend: { status: string; latencyMs: number };
  database: { status: string; type: string };
  mlService: { status: string; latencyMs: number };
  redis: { status: string };
  errorRate: number; requestsPerMinute: number; uptime: string;
  timestamp: string;
}

const statusDot = (status: string) => {
  if (['healthy', 'connected', 'online'].includes(status)) return 'bg-emerald-400';
  if (['warning', 'degraded', 'fallback'].includes(status)) return 'bg-amber-400';
  return 'bg-rose-400';
};

const statusLabel = (status: string) => {
  const map: Record<string, string> = { healthy: 'Healthy', connected: 'Connected', online: 'Online', warning: 'Warning', degraded: 'Degraded', fallback: 'Fallback Mode', disconnected: 'Disconnected', offline: 'Offline', needs_retraining: 'Needs Retraining' };
  return map[status] || status;
};

const modelStatusStyle: Record<string, string> = {
  healthy: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  warning: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  needs_retraining: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  offline: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
};

export default function SystemHealthPage() {
  const [health, setHealth] = useState<SystemHealthData | null>(null);
  const [models, setModels] = useState<ModelMetric[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [healthRes, metricsRes] = await Promise.all([
        fetch('/api/system/health'), fetch('/api/ml/metrics')
      ]);
      if (healthRes.ok) setHealth(await healthRes.json());
      if (metricsRes.ok) { const d = await metricsRes.json(); setModels(d.models || []); }
      setLastRefresh(new Date());
    } catch {}
    finally { setIsLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const renderMetric = (key: string, val: number) => {
    const isPercent = ['accuracy', 'f1', 'precision', 'recall', 'rouge1', 'rouge2', 'rougeL', 'rocAuc', 'ndcgAtK', 'precisionAtK'].includes(key);
    const label = { accuracy: 'Accuracy', f1: 'F1 Score', precision: 'Precision', recall: 'Recall', rouge1: 'ROUGE-1', rouge2: 'ROUGE-2', rougeL: 'ROUGE-L', rocAuc: 'ROC-AUC', ndcgAtK: 'NDCG@10', precisionAtK: 'Precision@10' }[key] || key;
    const pct = isPercent ? (val * 100).toFixed(1) + '%' : val.toFixed(3);
    const color = isPercent ? (val >= 0.9 ? 'text-emerald-400' : val >= 0.8 ? 'text-amber-400' : 'text-rose-400') : 'text-slate-300';
    return (
      <div key={key} className="flex items-center justify-between text-[10px] p-2 rounded-lg bg-slate-950/50">
        <span className="text-slate-500 font-mono">{label}</span>
        <span className={`font-bold font-mono ${color}`}>{pct}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">System Health Dashboard</h2>
              <p className="text-xs text-slate-400">Real-time status of all platform services and ML models</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-slate-500 font-mono">Updated {lastRefresh.toLocaleTimeString()}</span>
            <button onClick={loadData} disabled={isLoading} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all">
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Service Status Grid */}
        {health && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Backend API', status: health.backend.status, detail: `${health.backend.latencyMs}ms latency`, icon: <Server className="w-4 h-4" /> },
              { label: 'Database', status: health.database.status, detail: health.database.type, icon: <Database className="w-4 h-4" /> },
              { label: 'ML Service', status: health.mlService.status, detail: health.mlService.latencyMs > 0 ? `${health.mlService.latencyMs}ms` : 'FastAPI Offline', icon: <Cpu className="w-4 h-4" /> },
              { label: 'Redis Cache', status: health.redis.status, detail: health.redis.status === 'fallback' ? 'In-memory mode' : 'Connected', icon: <Zap className="w-4 h-4" /> },
            ].map((svc, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-slate-400">{svc.icon}</div>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${statusDot(svc.status)} ${['healthy','connected','online'].includes(svc.status) ? 'animate-pulse' : ''}`} />
                  </div>
                </div>
                <div className="text-xs font-bold text-slate-100">{svc.label}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{svc.detail}</div>
                <div className={`text-[10px] font-bold mt-1 ${statusDot(svc.status) === 'bg-emerald-400' ? 'text-emerald-400' : statusDot(svc.status) === 'bg-amber-400' ? 'text-amber-400' : 'text-rose-400'}`}>
                  {statusLabel(svc.status)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Platform KPIs */}
      {health && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'API Uptime', value: health.uptime, color: 'text-emerald-400', icon: <CheckCircle className="w-4 h-4 text-emerald-400" /> },
            { label: 'Error Rate', value: `${health.errorRate}%`, color: 'text-amber-400', icon: <AlertTriangle className="w-4 h-4 text-amber-400" /> },
            { label: 'Requests/Min', value: health.requestsPerMinute, color: 'text-indigo-400', icon: <BarChart3 className="w-4 h-4 text-indigo-400" /> },
          ].map((kpi, i) => (
            <div key={i} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
              <div className="flex justify-center mb-2">{kpi.icon}</div>
              <div className={`text-2xl font-extrabold font-mono ${kpi.color}`}>{kpi.value}</div>
              <div className="text-[10px] text-slate-500 mt-1">{kpi.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* ML Model Metrics */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-cyan-400" /> ML Model Performance Metrics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {models.map((model, i) => (
            <div key={i} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-xs font-bold text-slate-100">{model.name}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{model.task}</div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border shrink-0 ${modelStatusStyle[model.status]}`}>
                  {statusLabel(model.status)}
                </span>
              </div>

              {/* Metrics */}
              <div className="space-y-1">
                {Object.entries(model.metrics).map(([k, v]) => renderMetric(k, v as number))}
              </div>

              {/* Footer stats */}
              <div className="flex items-center justify-between text-[10px] pt-2 border-t border-slate-800">
                <div className="flex items-center gap-1 text-slate-500">
                  <Zap className="w-3 h-3 text-indigo-400" />
                  <span className="font-mono text-indigo-400 font-bold">{model.callsToday.toLocaleString()}</span>
                  <span>calls today</span>
                </div>
                <div className="flex items-center gap-1 text-slate-500">
                  <Clock className="w-3 h-3 text-slate-500" />
                  <span className="font-mono">{model.avgLatencyMs}ms avg</span>
                </div>
              </div>

              {/* Progress bar */}
              {model.metrics.accuracy && (
                <div className="w-full bg-slate-800 rounded-full h-1.5">
                  <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all"
                    style={{ width: `${model.metrics.accuracy * 100}%` }} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
