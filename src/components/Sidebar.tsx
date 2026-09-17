import React from 'react';
import { 
  Newspaper, Sparkles, Flame, Grid, Search, History, Bookmark, Radio, Mic, 
  BarChart3, Cpu, ShieldAlert, Settings, Home, GitCompare, Clock, Compass,
  Eye, User, Brain, Activity, Trophy, ShieldCheck, Scale, FileSpreadsheet,
  Globe, Users, CheckSquare
} from 'lucide-react';
import { ActivePage } from '../types';

interface SidebarProps {
  activePage: ActivePage;
  onNavigate: (page: ActivePage) => void;
  savedCount: number;
}

export default function Sidebar({ activePage, onNavigate, savedCount }: SidebarProps) {
  const mainNavItems = [
    { id: 'landing' as ActivePage, label: 'Overview Landing', icon: Home },
    { id: 'home' as ActivePage, label: 'Live News Feed', icon: Newspaper },
    { id: 'personalized' as ActivePage, label: 'Personalized Feed', icon: Sparkles, badge: 'ML' },
    { id: 'georadar' as ActivePage, label: 'Global GeoRadar', icon: Globe, badge: 'NEW' },
    { id: 'trending' as ActivePage, label: 'Trending Radar', icon: Flame },
    { id: 'categories' as ActivePage, label: 'Categories & Topics', icon: Grid },
    { id: 'search' as ActivePage, label: 'Search & Filters', icon: Search },
    { id: 'discovery' as ActivePage, label: 'Discover News', icon: Compass, badge: 'NEW' },
    { id: 'missed' as ActivePage, label: 'News You Missed', icon: Eye, badge: 'NEW' },
    { id: 'fake-news' as ActivePage, label: 'Fake News Detection', icon: ShieldCheck, badge: 'AI' },
  ];

  const aiFeatures = [
    { id: 'ai-chat' as ActivePage, label: 'AI Copilot Assistant', icon: Sparkles, badge: 'Chat' },
    { id: 'perspective' as ActivePage, label: 'Perspective Sandbox', icon: Users, badge: 'NEW' },
    { id: 'fact-checker' as ActivePage, label: 'Fact-Check Workbench', icon: CheckSquare, badge: 'NEW' },
    { id: 'media-bias' as ActivePage, label: 'Media Bias Radar', icon: Scale, badge: 'NEW' },
    { id: 'research-export' as ActivePage, label: 'Research & JASP Export', icon: FileSpreadsheet, badge: 'NEW' },
    { id: 'compare' as ActivePage, label: 'Compare Articles', icon: GitCompare, badge: 'NEW' },
    { id: 'timeline' as ActivePage, label: 'Story Timeline', icon: Clock, badge: 'NEW' },
    { id: 'daily-brief' as ActivePage, label: 'AI Daily Brief', icon: Radio },
    { id: 'voice-summary' as ActivePage, label: 'Voice Playlist', icon: Mic },
  ];

  const personalItems = [
    { id: 'saved' as ActivePage, label: 'Saved Articles', icon: Bookmark, count: savedCount },
    { id: 'history' as ActivePage, label: 'Reading History', icon: History },
    { id: 'interest-profile' as ActivePage, label: 'Interest Profile', icon: User, badge: 'NEW' },
  ];

  const adminAndML = [
    { id: 'analytics' as ActivePage, label: 'Analytics Insights', icon: BarChart3 },
    { id: 'ml-dashboard' as ActivePage, label: 'ML Service Pipeline', icon: Cpu, badge: 'FastAPI' },
    { id: 'system-health' as ActivePage, label: 'System Health', icon: Activity, badge: 'NEW' },
    { id: 'ai-models' as ActivePage, label: 'AI Models Info', icon: Brain, badge: 'NEW' },
    { id: 'admin' as ActivePage, label: 'Admin Dashboard', icon: ShieldAlert },
    { id: 'profile' as ActivePage, label: 'Profile & Settings', icon: Settings },
  ];

  const renderNavItem = (item: { id: ActivePage; label: string; icon: any; badge?: string; count?: number }) => {
    const Icon = item.icon;
    const isActive = activePage === item.id;
    const isNew = item.badge === 'NEW';
    return (
      <button
        key={item.id}
        onClick={() => onNavigate(item.id)}
        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
          isActive
            ? 'bg-white/10 text-white border border-white/15 shadow-sm'
            : 'text-slate-400 hover:text-white hover:bg-white/5'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
          <span className="truncate">{item.label}</span>
        </div>
        {typeof item.count === 'number' && (
          <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-full bg-white/10 text-white border border-white/10 shrink-0">
            {item.count}
          </span>
        )}
        {item.badge && item.badge !== 'NEW' && (
          <span className={`px-2 py-0.5 text-[9px] font-extrabold rounded-full uppercase tracking-wider shrink-0 ${
            item.badge === 'Chat' ? 'bg-indigo-500 text-white' :
            item.badge === 'FastAPI' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' :
            'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
          }`}>
            {item.badge}
          </span>
        )}
        {isNew && (
          <span className="px-1.5 py-0.5 text-[8px] font-extrabold rounded-full bg-emerald-500 text-white shrink-0 animate-pulse">
            NEW
          </span>
        )}
      </button>
    );
  };

  return (
    <aside className="w-64 bg-[#080808] border-r border-white/10 flex flex-col justify-between shrink-0 hidden md:flex min-h-[calc(100vh-65px)] overflow-y-auto scrollbar-none">
      <div className="space-y-5 p-4">

        {/* Main Feed Section */}
        <div>
          <p className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-indigo-400 mb-2">News Feeds</p>
          <nav className="space-y-1">
            {mainNavItems.map(renderNavItem)}
          </nav>
        </div>

        {/* AI Intelligence Features */}
        <div>
          <p className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-violet-400 mb-2">AI Intelligence</p>
          <nav className="space-y-1">
            {aiFeatures.map(renderNavItem)}
          </nav>
        </div>

        {/* Personal Library */}
        <div>
          <p className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-cyan-400 mb-2">My Library</p>
          <nav className="space-y-1">
            {personalItems.map(renderNavItem)}
          </nav>
        </div>

        {/* System & Admin */}
        <div>
          <p className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-rose-400 mb-2">System & Analytics</p>
          <nav className="space-y-1">
            {adminAndML.map(renderNavItem)}
          </nav>
        </div>

      </div>

      {/* ML Pipeline Widget */}
      <div className="p-4 border-t border-white/10 shrink-0">
        <div className="p-3.5 rounded-3xl bg-white/5 border border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-white flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              ML Pipeline Active
            </span>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">18ms</span>
          </div>
          <p className="text-xs font-bold text-white leading-snug">BERTopic + FAISS Index</p>
          <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full w-[96%]" />
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>Acc: 96.4%</span>
            <span>148k Vectors</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
