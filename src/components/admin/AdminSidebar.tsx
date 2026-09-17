import React from 'react';
import {
  LayoutDashboard, BarChart3, Activity, Newspaper, PlusCircle, FolderTree,
  Radio, TrendingUp, Sparkles, Brain, ShieldAlert, HeartHandshake, Tags,
  Compass, Cpu, Database, Users, UserCheck, Heart, History, MessageSquare,
  Server, Bell, Terminal, Settings, ChevronRight, X
} from 'lucide-react';

export type AdminSection =
  // OVERVIEW
  | 'overview'
  | 'analytics'
  | 'system-health'
  // CONTENT
  | 'all-articles'
  | 'add-article'
  | 'categories'
  | 'news-sources'
  | 'trending-news'
  | 'featured-news'
  // AI & ML
  | 'ai-summarization'
  | 'fake-news'
  | 'sentiment-analysis'
  | 'news-classification'
  | 'recommendations'
  | 'ml-performance'
  | 'dataset-management'
  // USERS
  | 'users'
  | 'user-activity'
  | 'interest-profiles'
  | 'reading-history'
  | 'feedback'
  // SYSTEM
  | 'api-monitoring'
  | 'notifications'
  | 'logs'
  | 'settings';

interface AdminSidebarProps {
  currentSection: AdminSection;
  onSelectSection: (section: AdminSection) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  counts?: {
    articles?: number;
    fakeNewsCount?: number;
    users?: number;
    sources?: number;
  };
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentSection,
  onSelectSection,
  isOpenMobile,
  onCloseMobile,
  counts
}) => {
  const groups: {
    title: string;
    items: { id: AdminSection; label: string; icon: React.ReactNode; badge?: string; badgeColor?: string }[];
  }[] = [
    {
      title: 'OVERVIEW',
      items: [
        { id: 'overview', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
        { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
        { id: 'system-health', label: 'System Health', icon: <Activity className="w-4 h-4" />, badge: 'Live', badgeColor: 'bg-emerald-500' }
      ]
    },
    {
      title: 'CONTENT',
      items: [
        { id: 'all-articles', label: 'All Articles', icon: <Newspaper className="w-4 h-4" />, badge: counts?.articles?.toString() },
        { id: 'add-article', label: 'Add Article', icon: <PlusCircle className="w-4 h-4" /> },
        { id: 'categories', label: 'Categories', icon: <FolderTree className="w-4 h-4" /> },
        { id: 'news-sources', label: 'News Sources', icon: <Radio className="w-4 h-4" />, badge: counts?.sources?.toString() },
        { id: 'trending-news', label: 'Trending News', icon: <TrendingUp className="w-4 h-4" /> },
        { id: 'featured-news', label: 'Featured News', icon: <Sparkles className="w-4 h-4" /> }
      ]
    },
    {
      title: 'AI & MACHINE LEARNING',
      items: [
        { id: 'fake-news', label: 'Fake News Detection', icon: <ShieldAlert className="w-4 h-4" />, badge: counts?.fakeNewsCount ? `${counts.fakeNewsCount}` : undefined, badgeColor: 'bg-rose-500' },
        { id: 'ai-summarization', label: 'AI Summarization', icon: <Brain className="w-4 h-4" /> },
        { id: 'sentiment-analysis', label: 'Sentiment Analysis', icon: <HeartHandshake className="w-4 h-4" /> },
        { id: 'news-classification', label: 'News Classification', icon: <Tags className="w-4 h-4" /> },
        { id: 'recommendations', label: 'Recommendation Engine', icon: <Compass className="w-4 h-4" /> },
        { id: 'ml-performance', label: 'ML Model Performance', icon: <Cpu className="w-4 h-4" /> },
        { id: 'dataset-management', label: 'Dataset Management', icon: <Database className="w-4 h-4" /> }
      ]
    },
    {
      title: 'USERS & COMMUNITY',
      items: [
        { id: 'users', label: 'Users Directory', icon: <Users className="w-4 h-4" />, badge: counts?.users?.toString() },
        { id: 'user-activity', label: 'User Activity Analytics', icon: <UserCheck className="w-4 h-4" /> },
        { id: 'interest-profiles', label: 'Interest Profiles', icon: <Heart className="w-4 h-4" /> },
        { id: 'reading-history', label: 'Reading History Logs', icon: <History className="w-4 h-4" /> },
        { id: 'feedback', label: 'User Feedback & Reports', icon: <MessageSquare className="w-4 h-4" /> }
      ]
    },
    {
      title: 'SYSTEM & SECURITY',
      items: [
        { id: 'api-monitoring', label: 'API Monitoring', icon: <Server className="w-4 h-4" /> },
        { id: 'notifications', label: 'Notifications Center', icon: <Bell className="w-4 h-4" /> },
        { id: 'logs', label: 'System Logs', icon: <Terminal className="w-4 h-4" /> },
        { id: 'settings', label: 'Admin Settings', icon: <Settings className="w-4 h-4" /> }
      ]
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-slate-950 border-r border-slate-800/80 flex flex-col z-50 transition-transform duration-300 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-950/50">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-extrabold text-white tracking-wider font-mono">CHRONICLE.AI</div>
              <div className="text-[9px] text-indigo-400 font-mono font-bold uppercase tracking-widest">Admin SaaS Console</div>
            </div>
          </div>

          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-900 border border-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Navigation Groups */}
        <div className="flex-1 overflow-y-auto p-3 space-y-5 scrollbar-thin scrollbar-thumb-slate-800">
          {groups.map((group, idx) => (
            <div key={idx} className="space-y-1">
              <div className="px-3 py-1 text-[10px] font-mono font-extrabold text-slate-500 uppercase tracking-widest">
                {group.title}
              </div>

              {group.items.map(item => {
                const isActive = currentSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectSection(item.id);
                      onCloseMobile();
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-lg shadow-indigo-950/60'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={isActive ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold text-white shadow-sm ${
                          item.badgeColor || 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer Admin Tag */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/90 text-center">
          <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Admin Authorization Verified</span>
          </div>
        </div>
      </aside>
    </>
  );
};
