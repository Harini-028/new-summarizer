import React, { useState, useEffect, useMemo } from 'react';
import { AdminSidebar, AdminSection } from '../components/admin/AdminSidebar';
import { AdminTopNav } from '../components/admin/AdminTopNav';
import { AdminOverviewView } from '../components/admin/AdminOverviewView';
import { AdminArticlesView } from '../components/admin/AdminArticlesView';
import { AdminAddEditArticleModal } from '../components/admin/AdminAddEditArticleModal';
import { AdminArticleDetailModal } from '../components/admin/AdminArticleDetailModal';
import { AdminFakeNewsView } from '../components/admin/AdminFakeNewsView';
import { AdminMLPerformanceView } from '../components/admin/AdminMLPerformanceView';
import { AdminDatasetsView } from '../components/admin/AdminDatasetsView';
import { AdminNewsSourcesView } from '../components/admin/AdminNewsSourcesView';
import { AdminUsersView } from '../components/admin/AdminUsersView';
import { AdminAnalyticsView } from '../components/admin/AdminAnalyticsView';
import { AdminTrendingView } from '../components/admin/AdminTrendingView';
import { AdminNotificationsView } from '../components/admin/AdminNotificationsView';
import { AdminSystemHealthView } from '../components/admin/AdminSystemHealthView';
import { AdminAPIMonitoringView } from '../components/admin/AdminAPIMonitoringView';
import { AdminLogsView } from '../components/admin/AdminLogsView';
import { AdminSettingsView } from '../components/admin/AdminSettingsView';
import { Article, UserProfile } from '../types';
import { SAMPLE_ARTICLES, INITIAL_USER_PROFILE } from '../data/mockNewsData';
import { Search, X, CheckCircle2, Command } from 'lucide-react';

export default function AdminDashboard() {
  const [currentSection, setCurrentSection] = useState<AdminSection>('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [articles, setArticles] = useState<Article[]>([...SAMPLE_ARTICLES]);
  const [users, setUsers] = useState<UserProfile[]>([{ ...INITIAL_USER_PROFILE, role: 'admin' }]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Modals
  const [addEditModalOpen, setAddEditModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [inspectingArticle, setInspectingArticle] = useState<Article | null>(null);
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false);
  const [globalQuery, setGlobalQuery] = useState('');

  const token = localStorage.getItem('chronicle_token') || sessionStorage.getItem('chronicle_token');

  // Keyboard shortcut Ctrl+K / Cmd+K for Global Search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setGlobalSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fetch articles and users from backend API
  useEffect(() => {
    fetch('/api/news?limit=150')
      .then(r => r.json())
      .then(d => {
        if (Array.isArray(d)) setArticles(d);
        else if (d.articles) setArticles(d.articles);
      })
      .catch(() => { /* use mock data fallback */ });

    fetch('/api/admin/users', {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
      .then(r => r.json())
      .then(d => {
        if (d.users) setUsers(d.users);
      })
      .catch(() => { /* silent fallback */ });
  }, [token]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Article handlers
  const handleSaveArticle = (articleData: Partial<Article>) => {
    if (editingArticle) {
      // Update existing
      setArticles(prev => prev.map(a => a.id === editingArticle.id ? { ...a, ...articleData } as Article : a));
      showToast(`Updated article "${articleData.title?.substring(0, 25)}..."`);
    } else {
      // Create new
      const newArt: Article = {
        id: `art_${Date.now()}`,
        title: articleData.title || 'Untitled',
        excerpt: articleData.excerpt || '',
        content: articleData.content || '',
        category: articleData.category || 'AI & Technology',
        source: articleData.source || { name: 'Chronicle Editorial', domain: 'chronicle.ai', trustScore: 95 },
        author: articleData.author || 'Admin',
        publishedAt: new Date().toISOString(),
        url: articleData.url || '',
        imageUrl: articleData.imageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
        readTimeMinutes: articleData.readTimeMinutes || 3,
        aiSummary: articleData.aiSummary || { bullets: [], executiveParagraph: '', keyTakeaway: '' },
        sentiment: articleData.sentiment || { type: 'Positive', score: 0.8, label: 'Positive', tone: 'Analytical' },
        fakeNewsReport: articleData.fakeNewsReport || { isLikelyFake: false, confidenceScore: 95, verdict: 'Verified Authentic', redFlags: [], factCheckSources: [] },
        entities: articleData.entities || { organizations: [], people: [], locations: [], keywords: [] },
        recommendationScore: 85,
        likesCount: 0,
        bookmarksCount: 0,
        sharesCount: 0,
        viewsCount: 1,
        isTrending: !!articleData.isTrending,
        isFeatured: !!articleData.isFeatured,
        isBreaking: !!articleData.isBreaking
      };
      setArticles(prev => [newArt, ...prev]);
      showToast(`Created new article "${newArt.title.substring(0, 25)}..."`);
    }
    setEditingArticle(null);
  };

  const handleDeleteArticle = (id: string) => {
    setArticles(prev => prev.filter(a => a.id !== id));
  };

  const handleToggleTrending = (id: string) => {
    setArticles(prev => prev.map(a => a.id === id ? { ...a, isTrending: !a.isTrending } : a));
    showToast('Updated article trending status');
  };

  const handleToggleFeatured = (id: string) => {
    setArticles(prev => prev.map(a => a.id === id ? { ...a, isFeatured: !a.isFeatured } : a));
    showToast('Updated article featured status');
  };

  // Global search results
  const searchResults = useMemo(() => {
    if (!globalQuery.trim()) return { articles: [], users: [] };
    const q = globalQuery.toLowerCase();
    const matchedArticles = articles.filter(a => a.title.toLowerCase().includes(q) || a.category.toLowerCase().includes(q)).slice(0, 4);
    const matchedUsers = users.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)).slice(0, 3);
    return { articles: matchedArticles, users: matchedUsers };
  }, [globalQuery, articles, users]);

  // Counts for sidebar badges
  const fakeNewsCount = articles.filter(a => a.fakeNewsReport?.isLikelyFake || a.fakeNewsReport?.verdict === 'High Misinformation Risk').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-indigo-600 text-white text-xs font-bold shadow-2xl border border-indigo-400/40 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          {toastMsg}
        </div>
      )}

      {/* Main Layout Container */}
      <div className="flex-1 flex w-full">
        {/* Sidebar */}
        <AdminSidebar
          currentSection={currentSection}
          onSelectSection={(sec) => {
            if (sec === 'add-article') {
              setEditingArticle(null);
              setAddEditModalOpen(true);
            } else {
              setCurrentSection(sec);
            }
          }}
          isOpenMobile={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
          counts={{
            articles: articles.length,
            fakeNewsCount,
            users: users.length,
            sources: 5
          }}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <AdminTopNav
            user={users[0] || null}
            onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
            onOpenGlobalSearch={() => setGlobalSearchOpen(true)}
            onToast={showToast}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
            {currentSection === 'overview' && (
              <AdminOverviewView
                articles={articles}
                users={users}
                onNavigateSection={setCurrentSection}
                onToast={showToast}
              />
            )}

            {(currentSection === 'all-articles' || currentSection === 'categories' || currentSection === 'featured-news') && (
              <AdminArticlesView
                articles={articles}
                onOpenAddModal={() => { setEditingArticle(null); setAddEditModalOpen(true); }}
                onOpenEditModal={(art) => { setEditingArticle(art); setAddEditModalOpen(true); }}
                onOpenDetailModal={(art) => { setInspectingArticle(art); setDetailModalOpen(true); }}
                onDeleteArticle={handleDeleteArticle}
                onToggleTrending={handleToggleTrending}
                onToggleFeatured={handleToggleFeatured}
                onToast={showToast}
              />
            )}

            {currentSection === 'fake-news' && (
              <AdminFakeNewsView
                articles={articles}
                onOpenDetailModal={(art) => { setInspectingArticle(art); setDetailModalOpen(true); }}
                onToast={showToast}
              />
            )}

            {(currentSection === 'ml-performance' || currentSection === 'ai-summarization' || currentSection === 'sentiment-analysis' || currentSection === 'news-classification' || currentSection === 'recommendations') && (
              <AdminMLPerformanceView />
            )}

            {currentSection === 'dataset-management' && (
              <AdminDatasetsView onToast={showToast} />
            )}

            {currentSection === 'news-sources' && (
              <AdminNewsSourcesView onToast={showToast} />
            )}

            {(currentSection === 'users' || currentSection === 'user-activity' || currentSection === 'interest-profiles' || currentSection === 'reading-history' || currentSection === 'feedback') && (
              <AdminUsersView users={users} onToast={showToast} />
            )}

            {currentSection === 'analytics' && (
              <AdminAnalyticsView />
            )}

            {currentSection === 'trending-news' && (
              <AdminTrendingView
                articles={articles}
                onToggleTrending={handleToggleTrending}
                onToast={showToast}
              />
            )}

            {currentSection === 'notifications' && (
              <AdminNotificationsView onToast={showToast} />
            )}

            {currentSection === 'system-health' && (
              <AdminSystemHealthView onToast={showToast} />
            )}

            {currentSection === 'api-monitoring' && (
              <AdminAPIMonitoringView />
            )}

            {currentSection === 'logs' && (
              <AdminLogsView onToast={showToast} />
            )}

            {currentSection === 'settings' && (
              <AdminSettingsView onToast={showToast} />
            )}
          </main>
        </div>
      </div>

      {/* Add / Edit Article Modal */}
      <AdminAddEditArticleModal
        isOpen={addEditModalOpen}
        onClose={() => setAddEditModalOpen(false)}
        onSave={handleSaveArticle}
        articleToEdit={editingArticle}
        onToast={showToast}
      />

      {/* Article Detail Inspection Modal */}
      <AdminArticleDetailModal
        article={inspectingArticle}
        onClose={() => { setDetailModalOpen(false); setInspectingArticle(null); }}
      />

      {/* Global Search Modal (Ctrl+K) */}
      {globalSearchOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-start justify-center pt-20 p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-slate-950 border border-slate-800 p-4 shadow-2xl space-y-3">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
              <Search className="w-5 h-5 text-indigo-400" />
              <input
                type="text"
                autoFocus
                value={globalQuery}
                onChange={e => setGlobalQuery(e.target.value)}
                placeholder="Global admin search across articles, users, logs..."
                className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
              />
              <button onClick={() => setGlobalSearchOpen(false)} className="text-slate-500 hover:text-slate-300">
                <X className="w-4 h-4" />
              </button>
            </div>

            {globalQuery.trim() && (
              <div className="space-y-3 max-h-80 overflow-y-auto scrollbar-thin text-xs">
                {searchResults.articles?.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-mono text-slate-500 uppercase font-bold">Matched Articles</div>
                    {searchResults.articles.map(art => (
                      <div
                        key={art.id}
                        onClick={() => {
                          setInspectingArticle(art);
                          setDetailModalOpen(true);
                          setGlobalSearchOpen(false);
                        }}
                        className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500 cursor-pointer flex items-center justify-between"
                      >
                        <span className="font-semibold text-slate-200 truncate">{art.title}</span>
                        <span className="text-[10px] font-mono text-indigo-400 shrink-0">{art.category}</span>
                      </div>
                    ))}
                  </div>
                )}

                {searchResults.users?.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-mono text-slate-500 uppercase font-bold">Matched Users</div>
                    {searchResults.users.map(u => (
                      <div
                        key={u.id}
                        onClick={() => {
                          setCurrentSection('users');
                          setGlobalSearchOpen(false);
                        }}
                        className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500 cursor-pointer flex items-center justify-between"
                      >
                        <span className="font-semibold text-slate-200">{u.name} ({u.email})</span>
                        <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold shrink-0">{u.role}</span>
                      </div>
                    ))}
                  </div>
                )}

                {searchResults.articles?.length === 0 && searchResults.users?.length === 0 && (
                  <div className="p-6 text-center text-slate-500 font-mono">No matching records found for "{globalQuery}"</div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
