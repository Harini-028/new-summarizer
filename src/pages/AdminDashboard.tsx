import React, { useState, useEffect, useMemo } from 'react';
import { AdminSidebar, AdminSection } from '../components/admin/AdminSidebar';
import { AdminTopNav } from '../components/admin/AdminTopNav';
import { AdminOverviewView, NewsStats } from '../components/admin/AdminOverviewView';
import { AdminArticlesView } from '../components/admin/AdminArticlesView';
import { AdminNewsManagementView } from '../components/admin/AdminNewsManagementView';
import { AdminAddNewsForm } from '../components/admin/AdminAddNewsForm';
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
import { AdminCategoriesView } from '../components/admin/AdminCategoriesView';
import { AdminAISummarizationView } from '../components/admin/AdminAISummarizationView';
import { AdminAccountManagementView } from '../components/admin/AdminAccountManagementView';
import { Article, UserProfile } from '../types';
import { SAMPLE_ARTICLES, INITIAL_USER_PROFILE } from '../data/mockNewsData';
import { Search, X, CheckCircle2 } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

interface AdminDashboardProps {
  initialPath?: string;
  onNavigate?: (path: string) => void;
  onLogoutSuccess?: () => void;
}

export default function AdminDashboard({ initialPath, onNavigate, onLogoutSuccess }: AdminDashboardProps) {
  const { adminUser, logout } = useAdminAuth();

  // Resolve initial section from URL pathname
  const resolveInitialState = () => {
    const path = initialPath || window.location.pathname;
    if (path === '/admin/news/add') {
      return { section: 'add-article' as AdminSection, articleId: null, filter: 'all' as const };
    }
    if (path.startsWith('/admin/news/edit/')) {
      const id = path.replace('/admin/news/edit/', '').trim();
      return { section: 'add-article' as AdminSection, articleId: id, filter: 'all' as const };
    }
    if (path === '/admin/news') {
      const searchParams = new URLSearchParams(window.location.search);
      const statusParam = searchParams.get('status') || searchParams.get('type') || searchParams.get('filter');
      const filter: 'all' | 'published' | 'draft' | 'breaking' | 'featured' = 
        (statusParam === 'published' || statusParam === 'draft' || statusParam === 'breaking' || statusParam === 'featured')
          ? statusParam
          : 'all';
      return { section: 'news-management' as AdminSection, articleId: null, filter };
    }
    return { section: 'overview' as AdminSection, articleId: null, filter: 'all' as const };
  };

  const initialResolved = resolveInitialState();
  const [currentSection, setCurrentSection] = useState<AdminSection>(initialResolved.section);
  const [managementFilter, setManagementFilter] = useState<'all' | 'published' | 'draft' | 'breaking' | 'featured'>(initialResolved.filter);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [articles, setArticles] = useState<Article[]>([...SAMPLE_ARTICLES]);
  const [users, setUsers] = useState<UserProfile[]>([{ ...INITIAL_USER_PROFILE, role: 'admin' }]);
  const [stats, setStats] = useState<NewsStats | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Modals & form state
  const [addEditModalOpen, setAddEditModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [inspectingArticle, setInspectingArticle] = useState<Article | null>(null);
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false);
  const [globalQuery, setGlobalQuery] = useState('');

  const token = localStorage.getItem('chronicle_admin_token') || 
                localStorage.getItem('chronicle_token') || 
                sessionStorage.getItem('chronicle_admin_token') || 
                sessionStorage.getItem('chronicle_token');

  // Push browser URL changes cleanly
  const syncBrowserUrl = (targetPath: string) => {
    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath);
    }
    if (onNavigate) {
      onNavigate(targetPath);
    }
  };

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

  // Handle browser popstate navigation (Back/Forward)
  useEffect(() => {
    const handlePopState = () => {
      const state = resolveInitialState();
      setCurrentSection(state.section);
      setManagementFilter(state.filter);
      if (state.articleId) {
        loadArticleForEditing(state.articleId);
      } else if (state.section === 'add-article') {
        setEditingArticle(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [articles]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Fetch live stats directly from MongoDB Atlas
  const fetchAdminStats = () => {
    fetch('/api/admin/news/stats', {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
      .then(r => r.json())
      .then(d => {
        if (d && typeof d.totalArticles === 'number') {
          setStats(d);
        }
      })
      .catch(() => {});
  };

  // Fetch all articles from MongoDB Atlas
  const fetchAdminArticles = () => {
    fetch('/api/admin/news', {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
      .then(r => {
        if (r.status === 401 || r.status === 403) {
          handleLogout();
          throw new Error('Authentication required');
        }
        return r.json();
      })
      .then(d => {
        if (Array.isArray(d)) setArticles(d);
        else if (d.articles) setArticles(d.articles);
        fetchAdminStats();
      })
      .catch(() => {
        fetch('/api/news?limit=150')
          .then(r => r.json())
          .then(d => {
            if (Array.isArray(d)) setArticles(d);
            else if (d.articles) setArticles(d.articles);
          })
          .catch(() => {});
      });
  };

  // Fetch initial data on mount
  useEffect(() => {
    fetchAdminArticles();
    fetchAdminStats();

    fetch('/api/admin/users', {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
      .then(r => r.json())
      .then(d => {
        if (d && d.users) setUsers(d.users);
        else if (Array.isArray(d)) setUsers(d);
      })
      .catch(() => {});

    // If initial route was an edit page, load that article
    if (initialResolved.articleId) {
      loadArticleForEditing(initialResolved.articleId);
    }
  }, [token]);

  const loadArticleForEditing = (id: string) => {
    // Check in existing state first
    const existing = articles.find(a => a.id === id || (a as any)._id === id);
    if (existing) {
      setEditingArticle(existing);
      setCurrentSection('add-article');
      return;
    }

    // Fetch from API
    fetch(`/api/admin/news/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
      .then(r => r.json())
      .then(art => {
        if (art && art.title) {
          setEditingArticle(art);
          setCurrentSection('add-article');
        }
      })
      .catch(() => {
        showToast('Failed to load article for editing.');
      });
  };

  const handleSectionSelect = (sec: AdminSection) => {
    if (sec === 'overview') {
      setCurrentSection('overview');
      syncBrowserUrl('/admin/dashboard');
    } else if (sec === 'news-management') {
      setManagementFilter('all');
      setCurrentSection('news-management');
      syncBrowserUrl('/admin/news');
    } else if (sec === 'published-news') {
      setManagementFilter('published');
      setCurrentSection('news-management');
      syncBrowserUrl('/admin/news?status=published');
    } else if (sec === 'draft-news') {
      setManagementFilter('draft');
      setCurrentSection('news-management');
      syncBrowserUrl('/admin/news?status=draft');
    } else if (sec === 'breaking-news') {
      setManagementFilter('breaking');
      setCurrentSection('news-management');
      syncBrowserUrl('/admin/news?type=breaking');
    } else if (sec === 'featured-news') {
      setManagementFilter('featured');
      setCurrentSection('news-management');
      syncBrowserUrl('/admin/news?type=featured');
    } else if (sec === 'add-article') {
      setEditingArticle(null);
      setCurrentSection('add-article');
      syncBrowserUrl('/admin/news/add');
    } else {
      setCurrentSection(sec);
    }
  };

  const handlePublishNews = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/news/${id}/publish`, {
        method: 'PATCH',
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to publish news');
      setArticles(prev => prev.map(a => a.id === id ? { ...a, status: 'published', publishedAt: new Date().toISOString() } : a));
      fetchAdminStats();
      showToast('News article published successfully to MongoDB Atlas.');
    } catch (err: any) {
      showToast(err.message || 'Failed to publish news.');
    }
  };

  const handleUnpublishNews = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/news/${id}/unpublish`, {
        method: 'PATCH',
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to unpublish news');
      setArticles(prev => prev.map(a => a.id === id ? { ...a, status: 'draft' } : a));
      fetchAdminStats();
      showToast('News article moved to draft status.');
    } catch (err: any) {
      showToast(err.message || 'Failed to unpublish news.');
    }
  };

  const handleDeleteNews = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/news/${id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete news');
      setArticles(prev => prev.filter(a => a.id !== id && (a as any)._id !== id));
      fetchAdminStats();
      showToast('News article permanently deleted from MongoDB Atlas.');
    } catch (err: any) {
      showToast(err.message || 'Failed to delete news.');
    }
  };

  const handleLogout = () => {
    logout();
    if (onLogoutSuccess) {
      onLogoutSuccess();
    } else {
      window.history.pushState({}, '', '/admin/login');
      window.location.href = '/admin/login';
    }
  };

  const handleOpenEditArticle = (art: Article) => {
    setEditingArticle(art);
    setCurrentSection('add-article');
    syncBrowserUrl(`/admin/news/edit/${art.id}`);
  };

  const handleOpenAddArticle = () => {
    setEditingArticle(null);
    setCurrentSection('add-article');
    syncBrowserUrl('/admin/news/add');
  };

  // Article handlers for fallback modal
  const handleSaveArticle = (articleData: Partial<Article>) => {
    if (editingArticle) {
      setArticles(prev => prev.map(a => a.id === editingArticle.id ? { ...a, ...articleData } as Article : a));
      showToast(`Updated article "${articleData.title?.substring(0, 25)}..."`);
    }
    setEditingArticle(null);
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
  const publishedArticlesCount = stats?.publishedArticles ?? articles.filter(a => ((a as any).status || 'published') === 'published').length;
  const draftArticlesCount = stats?.draftArticles ?? articles.filter(a => (a as any).status === 'draft').length;
  const breakingArticlesCount = stats?.breakingNews ?? articles.filter(a => a.isBreaking).length;
  const featuredArticlesCount = stats?.featuredArticles ?? articles.filter(a => a.isFeatured).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
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
          onSelectSection={handleSectionSelect}
          isOpenMobile={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
          onLogout={handleLogout}
          onBackToWebsite={() => {
            if (onNavigate) {
              onNavigate('/');
            } else {
              window.history.pushState({}, '', '/');
              window.dispatchEvent(new PopStateEvent('popstate'));
            }
          }}
          counts={{
            articles: stats?.totalArticles ?? articles.length,
            published: publishedArticlesCount,
            drafts: draftArticlesCount,
            breaking: breakingArticlesCount,
            featured: featuredArticlesCount,
            fakeNewsCount,
            users: users.length,
            sources: 6
          }}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <AdminTopNav
            user={adminUser ? { ...INITIAL_USER_PROFILE, name: adminUser.name, email: adminUser.email, role: 'admin' } : (users[0] || null)}
            onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
            onOpenGlobalSearch={() => setGlobalSearchOpen(true)}
            onToast={showToast}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
            {currentSection === 'overview' && (
              <AdminOverviewView
                articles={articles}
                users={users}
                stats={stats}
                onNavigateSection={handleSectionSelect}
                onRefresh={() => { fetchAdminArticles(); fetchAdminStats(); showToast('Synchronized with MongoDB Atlas.'); }}
                onToast={showToast}
              />
            )}

            {currentSection === 'news-management' && (
              <AdminNewsManagementView
                articles={articles}
                initialFilter={managementFilter}
                onOpenAddNews={handleOpenAddArticle}
                onOpenEditNews={handleOpenEditArticle}
                onOpenViewNews={(art) => {
                  setInspectingArticle(art);
                  setDetailModalOpen(true);
                }}
                onDeleteNews={handleDeleteNews}
                onPublishNews={handlePublishNews}
                onUnpublishNews={handleUnpublishNews}
                onRefresh={() => { fetchAdminArticles(); fetchAdminStats(); showToast('Refreshed news from MongoDB Atlas.'); }}
                onToast={showToast}
              />
            )}

            {currentSection === 'add-article' && (
              <AdminAddNewsForm
                articleToEdit={editingArticle}
                onSuccess={(savedArt, msg) => {
                  setArticles(prev => {
                    const exists = prev.some(a => a.id === savedArt.id || (a as any)._id === savedArt.id);
                    if (exists) {
                      return prev.map(a => (a.id === savedArt.id || (a as any)._id === savedArt.id) ? savedArt : a);
                    }
                    return [savedArt, ...prev];
                  });
                  setEditingArticle(null);
                  setCurrentSection('news-management');
                  syncBrowserUrl('/admin/news');
                  fetchAdminStats();
                  showToast(msg);
                }}
                onCancel={() => {
                  setEditingArticle(null);
                  setCurrentSection('news-management');
                  syncBrowserUrl('/admin/news');
                }}
                onToast={showToast}
              />
            )}

            {currentSection === 'all-articles' && (
              <AdminArticlesView
                articles={articles}
                onOpenAddModal={handleOpenAddArticle}
                onOpenEditModal={handleOpenEditArticle}
                onOpenDetailModal={(art) => { setInspectingArticle(art); setDetailModalOpen(true); }}
                onDeleteArticle={handleDeleteNews}
                onToggleTrending={() => {}}
                onToggleFeatured={() => {}}
                onToast={showToast}
              />
            )}

            {currentSection === 'fake-news' && (
              <AdminFakeNewsView
                articles={articles}
                onOpenDetailModal={(art) => { setInspectingArticle(art); setDetailModalOpen(true); }}
                onArticleUpdated={(updated) => setArticles(prev => prev.map(a => a.id === updated.id ? updated : a))}
                onToast={showToast}
              />
            )}

            {currentSection === 'categories' && (
              <AdminCategoriesView
                onSelectCategory={(cat) => {
                  setManagementFilter('all');
                  setCurrentSection('news-management');
                  syncBrowserUrl('/admin/news');
                }}
                onToast={showToast}
              />
            )}

            {currentSection === 'ai-summarization' && (
              <AdminAISummarizationView
                articles={articles}
                onArticleUpdated={(updated) => setArticles(prev => prev.map(a => a.id === updated.id ? updated : a))}
                onToast={showToast}
              />
            )}

            {(currentSection === 'ml-performance' || currentSection === 'sentiment-analysis' || currentSection === 'news-classification' || currentSection === 'recommendations') && (
              <AdminMLPerformanceView />
            )}

            {currentSection === 'dataset-management' && (
              <AdminDatasetsView onToast={showToast} />
            )}

            {currentSection === 'news-sources' && (
              <AdminNewsSourcesView onToast={showToast} />
            )}

            {currentSection === 'admin-accounts' && (
              <AdminAccountManagementView onToast={showToast} />
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
                onToggleTrending={() => {}}
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

      {/* Add / Edit Article Fallback Modal */}
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
                className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none font-mono"
              />
              <button onClick={() => setGlobalSearchOpen(false)} className="text-slate-500 hover:text-slate-300 cursor-pointer">
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
