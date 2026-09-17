import React, { useState } from 'react';
import { Settings, Save, Lock, Sliders, Bell, Cpu, Shield } from 'lucide-react';

export const AdminSettingsView: React.FC<{ onToast: (msg: string) => void }> = ({ onToast }) => {
  const [fetchFrequency, setFetchFrequency] = useState('15');
  const [articleLimit, setArticleLimit] = useState('100');
  const [autoSummarize, setAutoSummarize] = useState(true);
  const [fakeSensitivity, setFakeSensitivity] = useState('High');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onToast('Admin platform settings updated successfully!');
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">Platform System Settings</h2>
            <p className="text-xs text-slate-400">Configure news aggregation intervals, ML processing defaults, and recommendation thresholds</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-5 text-xs">
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider font-mono border-b border-slate-900 pb-2">
            News Ingestion & Aggregation
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate-400 uppercase">RSS Fetch Frequency (minutes)</label>
              <select
                value={fetchFrequency}
                onChange={e => setFetchFrequency(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none font-mono"
              >
                <option value="5">Every 5 mins</option>
                <option value="15">Every 15 mins</option>
                <option value="30">Every 30 mins</option>
                <option value="60">Every 1 hour</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate-400 uppercase">Default Article Fetch Limit</label>
              <select
                value={articleLimit}
                onChange={e => setArticleLimit(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none font-mono"
              >
                <option value="50">50 articles per batch</option>
                <option value="100">100 articles per batch</option>
                <option value="200">200 articles per batch</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider font-mono border-b border-slate-900 pb-2">
            Machine Learning & Fact-Check Settings
          </h3>

          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer p-3 rounded-2xl bg-slate-900 border border-slate-800">
              <input
                type="checkbox"
                checked={autoSummarize}
                onChange={e => setAutoSummarize(e.target.checked)}
                className="rounded border-slate-700 text-indigo-600 focus:ring-0"
              />
              <div>
                <div className="font-bold text-slate-200">Auto-Summarize New Articles on Ingestion</div>
                <div className="text-[10px] text-slate-500">Run Gemini 3.6 Flash on incoming RSS/API articles</div>
              </div>
            </label>

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate-400 uppercase">Fake News Audit Sensitivity Threshold</label>
              <select
                value={fakeSensitivity}
                onChange={e => setFakeSensitivity(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none font-mono"
              >
                <option value="High">High (Strict Flagging)</option>
                <option value="Medium">Medium (Balanced)</option>
                <option value="Low">Low (Permissive)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-900 flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-950/50 cursor-pointer"
          >
            <Save className="w-4 h-4" /> Save System Settings
          </button>
        </div>
      </form>
    </div>
  );
};
