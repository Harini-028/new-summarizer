import React, { useState } from 'react';
import {
  LayoutDashboard, Newspaper, PlusCircle, CheckCircle2, Clock, Flame, 
  Sparkles, LogOut, BarChart3, Activity, ShieldAlert, Users, 
  Radio, Cpu, Terminal, Settings, ChevronDown, ChevronRight, ChevronLeft, X, ShieldCheck, Globe, Grid
} from 'lucide-react';

export type AdminSection =
  // PRIMARY REQUIRED SECTIONS
  | 'overview'
  | 'news-management'
  | 'add-article'
  | 'published-news'
  | 'draft-news'
  | 'breaking-news'
  | 'featured-news'
  | 'admin-accounts'
  // ADDITIONAL ANALYTICS & TOOLS
  | 'analytics'
  | 'system-health'
  | 'all-articles'
  | 'categories'
  | 'news-sources'
  | 'trending-news'
  | 'fake-news'
  | 'ai-summarization'
  | 'sentiment-analysis'
  | 'news-classification'
  | 'recommendations'
  | 'ml-performance'
  | 'dataset-management'
  | 'users'
  | 'user-activity'
  | 'interest-profiles'
  | 'reading-history'
  | 'feedback'
  | 'api-monitoring'
  | 'notifications'
  | 'logs'
  | 'settings';

interface AdminSidebarProps {
  currentSection: AdminSection;
  onSelectSection: (section: AdminSection) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onLogout?: () => void;
  onBackToWebsite?: () => void;
  counts?: {
    articles?: number;
    published?: number;
    drafts?: number;
    breaking?: number;
    featured?: number;
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
  onLogout,
  onBackToWebsite,
  counts
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const primaryItems = [
    { id: 'overview' as AdminSection, label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'news-management' as AdminSection, label: 'News Management', icon: <Newspaper className="w-4 h-4" />, badge: counts?.articles !== undefined ? `${counts.articles}` : undefined, badgeColor: 'bg-indigo-600' },
    { id: 'add-article' as AdminSection, label: 'Add News', icon: <PlusCircle className="w-4 h-4" /> },
    { id: 'published-news' as AdminSection, label: 'Published News', icon: <CheckCircle2 className="w-4 h-4" />, badge: counts?.published !== undefined ? `${counts.published}` : undefined, badgeColor: 'bg-emerald-600' },
    { id: 'draft-news' as AdminSection, label: 'Draft News', icon: <Clock className="w-4 h-4" />, badge: counts?.drafts !== undefined ? `${counts.drafts}` : undefined, badgeColor: 'bg-amber-600' },
    { id: 'breaking-news' as AdminSection, label: 'Breaking News', icon: <Flame className="w-4 h-4" />, badge: counts?.breaking !== undefined ? `${counts.breaking}` : undefined, badgeColor: 'bg-rose-600' },
    { id: 'featured-news' as AdminSection, label: 'Featured News', icon: <Sparkles className="w-4 h-4" />, badge: counts?.featured !== undefined ? `${counts.featured}` : undefined, badgeColor: 'bg-purple-600' },
    { id: 'admin-accounts' as AdminSection, label: 'Admin Account Management', icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />, badge: 'Auth Only', badgeColor: 'bg-indigo-900 text-indigo-300' },
  ];

  const quickFilterItems = [
    { id: 'published-news' as AdminSection, label: 'Published Articles', icon: <CheckCircle2 className="w-3.5 h-3.5" />, badge: counts?.published !== undefined ? `${counts.published}` : undefined, badgeColor: 'bg-emerald-600' },
    { id: 'draft-news' as AdminSection, label: 'Draft Articles', icon: <Clock className="w-3.5 h-3.5" />, badge: counts?.drafts !== undefined ? `${counts.drafts}` : undefined, badgeColor: 'bg-amber-600' },
    { id: 'breaking-news' as AdminSection, label: 'Breaking News', icon: <Flame className="w-3.5 h-3.5" />, badge: counts?.breaking !== undefined ? `${counts.breaking}` : undefined, badgeColor: 'bg-rose-600' },
    { id: 'featured-news' as AdminSection, label: 'Featured News', icon: <Sparkles className="w-3.5 h-3.5" />, badge: counts?.featured !== undefined ? `${counts.featured}` : undefined, badgeColor: 'bg-purple-600' },
  ];

  const advancedGroups = [
    {
      title: 'PLATFORM & ML TOOLS',
      items: [
        { id: 'ml-performance' as AdminSection, label: 'ML Telemetry', icon: <Cpu className="w-4 h-4" /> },
        { id: 'news-sources' as AdminSection, label: 'News Sources Feed', icon: <Radio className="w-4 h-4" /> },
        { id: 'analytics' as AdminSection, label: 'Platform Analytics', icon: <BarChart3 className="w-4 h-4" /> },
        { id: 'system-health' as AdminSection, label: 'System Health', icon: <Activity className="w-4 h-4" />, badge: 'Live', badgeColor: 'bg-emerald-500' },
        { id: 'logs' as AdminSection, label: 'Audit Logs', icon: <Terminal className="w-4 h-4" /> },
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
        className={`fixed lg:sticky top-0 left-0 h-screen ${
          isCollapsed ? 'lg:w-20' : 'lg:w-64'
        } w-64 bg-slate-950 border-r border-slate-800/80 flex flex-col z-50 transition-all duration-300 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-950/50 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <div className="text-xs font-extrabold text-white tracking-wider font-mono truncate">CHRONICLE.AI</div>
                <div className="text-[9px] text-indigo-400 font-mono font-bold uppercase tracking-widest truncate">Admin Dashboard</div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1">
            {/* Desktop Collapse / Expand Toggle */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
              title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
            </button>

            {/* Mobile Close Button */}
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-900 border border-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Navigation Area */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4 scrollbar-thin scrollbar-thumb-slate-800">
          
          {/* Main Required Admin Navigation */}
          <div className="space-y-1">
            {!isCollapsed && (
              <div className="px-3 py-1 text-[10px] font-mono font-extrabold text-slate-400 uppercase tracking-widest">
                Core Administration
              </div>
            )}

            {primaryItems.map(item => {
              const isActive = currentSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectSection(item.id);
                    onCloseMobile();
                  }}
                  title={isCollapsed ? item.label : undefined}
                  className={`w-full flex items-center ${isCollapsed ? 'justify-center px-2' : 'justify-between px-3'} py-2 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-lg shadow-indigo-950/60'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={isActive ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                  </div>

                  {!isCollapsed && item.badge && (
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

          {/* Advanced Tools Collapsible Section */}
          {!isCollapsed && (
            <div className="pt-2 border-t border-slate-800/60">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full flex items-center justify-between px-3 py-1.5 text-[10px] font-mono font-extrabold text-slate-400 hover:text-slate-200 uppercase tracking-widest cursor-pointer"
              >
                <span>Advanced Analytics</span>
                {showAdvanced ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>

              {showAdvanced && (
                <div className="space-y-3 mt-1.5 animate-in fade-in duration-200">
                  {advancedGroups.map((group, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="px-3 py-0.5 text-[9px] font-mono text-slate-500 uppercase tracking-wider">
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
                            className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
                              isActive
                                ? 'bg-indigo-600/40 text-white font-bold border border-indigo-500/40'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className={isActive ? 'text-indigo-400' : 'text-slate-400'}>{item.icon}</span>
                              <span className="truncate">{item.label}</span>
                            </div>
                            {item.badge && (
                              <span className={`px-1.5 py-0.2 rounded-full text-[8px] font-mono font-bold text-white ${item.badgeColor || 'bg-slate-800'}`}>
                                {item.badge}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Area: Back to Website & Logout & Status */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/95 space-y-2">
          {onBackToWebsite && (
            <button
              onClick={onBackToWebsite}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center px-2' : 'justify-center gap-2 px-3'} py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer`}
              title="Back to Website"
            >
              <Globe className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              {!isCollapsed && <span>Back to Website</span>}
            </button>
          )}

          {onLogout && (
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to end your administrator session and log out?')) {
                  onLogout();
                }
              }}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center px-2' : 'justify-center gap-2 px-3'} py-2 rounded-xl text-xs font-bold text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-600 border border-rose-500/20 hover:border-rose-600 transition-all cursor-pointer`}
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5 shrink-0" />
              {!isCollapsed && <span>Logout</span>}
            </button>
          )}

          {!isCollapsed && (
            <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Admin Authorization Active</span>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
