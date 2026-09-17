import React from 'react';
import { Cpu, Server, Database, Layers, CheckCircle, Activity, Zap, RefreshCw } from 'lucide-react';
import { MLTelemetry } from '../types';

interface MLDashboardPageProps {
  telemetry: MLTelemetry;
}

export default function MLDashboardPage({ telemetry }: MLDashboardPageProps) {
  
  const modelsInPipeline = [
    { name: 'Gemini-3.6-Flash', task: 'Executive C-Suite Summarization & Fact Checking', status: 'Optimal', framework: 'Google GenAI SDK' },
    { name: 'BERTopic-DistilRoBERTa-v2', task: 'Topic Clustering & Trend Velocity', status: 'Optimal', framework: 'PyTorch / HuggingFace' },
    { name: 'FAISS-Index-FlatL2', task: '384-Dim Vector Similarity Search', status: 'Optimal', framework: 'FAISS C++ Python' },
    { name: 'SpaCy En_Core_Web_Trf', task: 'Named Entity Recognition (NER)', status: 'Optimal', framework: 'SpaCy 3.7' },
    { name: 'Gemini-3.1-Flash-TTS', task: 'Multi-Speaker Voice Synthesis', status: 'Optimal', framework: 'Google GenAI Audio' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">Python FastAPI Machine Learning Service Telemetry</h2>
              <p className="text-xs text-slate-400">Real-time model latency, vector database index stats, and pipeline accuracy</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-mono font-bold text-emerald-400">FastAPI ML Connected (18ms)</span>
          </div>
        </div>

        {/* Telemetry Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] uppercase font-semibold text-slate-500">FAISS Vectors</span>
            <p className="text-xl font-bold font-mono text-slate-100">{telemetry.vectorIndexCount.toLocaleString()}</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] uppercase font-semibold text-slate-500">Model Accuracy</span>
            <p className="text-xl font-bold font-mono text-emerald-400">{(telemetry.accuracyScore * 100).toFixed(1)}%</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] uppercase font-semibold text-slate-500">F1 Score</span>
            <p className="text-xl font-bold font-mono text-cyan-400">{(telemetry.f1Score * 100).toFixed(1)}%</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] uppercase font-semibold text-slate-500">Articles Processed Today</span>
            <p className="text-xl font-bold font-mono text-indigo-400">{telemetry.processedArticlesToday.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Active Pipeline Models Table */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">Active Microservice ML Models</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px]">
              <tr>
                <th className="p-3 rounded-l-xl">Model Name</th>
                <th className="p-3">Functional Task</th>
                <th className="p-3">Framework</th>
                <th className="p-3 rounded-r-xl">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {modelsInPipeline.map((m, i) => (
                <tr key={i} className="hover:bg-slate-800/40">
                  <td className="p-3 font-bold font-mono text-slate-100">{m.name}</td>
                  <td className="p-3 text-slate-300">{m.task}</td>
                  <td className="p-3 font-mono text-cyan-400">{m.framework}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {m.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
