import React, { useState } from 'react';
import { Bell, Send, CheckCircle2, AlertTriangle, Shield, Sparkles } from 'lucide-react';

interface AdminNotificationsViewProps {
  onToast: (msg: string) => void;
}

export const AdminNotificationsView: React.FC<AdminNotificationsViewProps> = ({ onToast }) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('Breaking News');
  const [priority, setPriority] = useState('High');

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) {
      onToast('Title and Message are required.');
      return;
    }
    onToast(`Broadcasted notification "${title}" across all active client sockets!`);
    setTitle('');
    setMessage('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center border border-amber-500/20">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">Platform Broadcast & Notification Center</h2>
            <p className="text-xs text-slate-400">Send real-time WebSockets notifications for Breaking News, AI Alerts, and System Updates</p>
          </div>
        </div>
      </div>

      {/* Broadcast Form */}
      <form onSubmit={handleBroadcast} className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4 max-w-2xl">
        <h3 className="text-sm font-bold text-slate-200 font-mono uppercase tracking-wider">Create Push Notification Broadcast</h3>

        <div className="space-y-1">
          <label className="text-[10px] font-mono text-slate-400 uppercase">Notification Title *</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Breaking: Major AI Quantum Breakthrough"
            className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-slate-400 uppercase">Notification Type</label>
            <select
              value={type}
              onChange={e => setType(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none font-mono"
            >
              <option value="Breaking News">Breaking News</option>
              <option value="System Update">System Update</option>
              <option value="AI Alert">AI Alert</option>
              <option value="Security Alert">Security Alert</option>
              <option value="New Feature">New Feature</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono text-slate-400 uppercase">Priority Level</label>
            <select
              value={priority}
              onChange={e => setPriority(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none font-mono"
            >
              <option value="High">High (Immediate Popup)</option>
              <option value="Medium">Medium (Notification Bell)</option>
              <option value="Low">Low (Silent Feed Badge)</option>
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-mono text-slate-400 uppercase">Message Content *</label>
          <textarea
            rows={3}
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Detailed broadcast message text..."
            className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            required
          />
        </div>

        <button
          type="submit"
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-950/50 cursor-pointer w-full"
        >
          <Send className="w-4 h-4" /> Broadcast Notification
        </button>
      </form>
    </div>
  );
};
