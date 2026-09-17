import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { ActivePage, Article, UserProfile, CategoryType, MLTelemetry, DailyBrief } from './types';
import { INITIAL_USER_PROFILE, INITIAL_ML_TELEMETRY, SAMPLE_DAILY_BRIEF } from './data/mockNewsData';
import { AuthProvider, useAuth } from './context/AuthContext';
import { VoicePlayerProvider, useVoicePlayer } from './context/VoicePlayerContext';

// Layout Components
import Header from './components/Header';
import Sidebar from './components/Sidebar';

// Modals
import AISummaryModal from './components/AISummaryModal';
import VoicePlayerModal from './components/VoicePlayerModal';
import VoicePlayerMini from './components/VoicePlayerMini';
import FakeNewsDetectorModal from './components/FakeNewsDetectorModal';
import ArchitectureExplorerModal from './components/ArchitectureExplorerModal';
import AuthModal from './components/AuthModal';
import ReadingModeModal from './components/ReadingModeModal';

// Pages (Dynamically loaded)
const LandingPage = React.lazy(() => import('./pages/LandingPage'));
const AuthPage = React.lazy(() => import('./pages/AuthPage'));
const HomeFeed = React.lazy(() => import('./pages/HomeFeed'));
const PersonalizedFeedPage = React.lazy(() => import('./pages/PersonalizedFeedPage'));
const TrendingPage = React.lazy(() => import('./pages/TrendingPage'));
const CategoriesPage = React.lazy(() => import('./pages/CategoriesPage'));
const SearchPage = React.lazy(() => import('./pages/SearchPage'));
const DailyBriefPage = React.lazy(() => import('./pages/DailyBriefPage'));
const VoiceSummaryPage = React.lazy(() => import('./pages/VoiceSummaryPage'));
const ReadingHistoryPage = React.lazy(() => import('./pages/ReadingHistoryPage'));
const AnalyticsDashboard = React.lazy(() => import('./pages/AnalyticsDashboard'));
const MLDashboardPage = React.lazy(() => import('./pages/MLDashboardPage'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const UserProfilePage = React.lazy(() => import('./pages/UserProfilePage'));
const AIChatPage = React.lazy(() => import('./pages/AIChatPage'));
const CompareArticlesPage = React.lazy(() => import('./pages/CompareArticlesPage'));
const NewsTimelinePage = React.lazy(() => import('./pages/NewsTimelinePage'));
const NewsDiscoveryPage = React.lazy(() => import('./pages/NewsDiscoveryPage'));
const NewsMissedPage = React.lazy(() => import('./pages/NewsMissedPage'));
const InterestProfilePage = React.lazy(() => import('./pages/InterestProfilePage'));
const AIModelInfoPage = React.lazy(() => import('./pages/AIModelInfoPage'));
const SystemHealthPage = React.lazy(() => import('./pages/SystemHealthPage'));
const FakeNewsPage = React.lazy(() => import('./pages/FakeNewsPage'));
const MediaBiasPage = React.lazy(() => import('./pages/MediaBiasPage').then(m => ({ default: m.MediaBiasPage })));
const ResearchExportPage = React.lazy(() => import('./pages/ResearchExportPage').then(m => ({ default: m.ResearchExportPage })));
const PerspectiveSandboxPage = React.lazy(() => import('./pages/PerspectiveSandboxPage'));
const FactCheckWorkbenchPage = React.lazy(() => import('./pages/FactCheckWorkbenchPage'));
const GeoRadarPage = React.lazy(() => import('./pages/GeoRadarPage'));



const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="w-8 h-8 rounded-full border-4 border-indigo-600/30 border-t-indigo-600 animate-spin" />
  </div>
);

// ─── Inner App (uses Auth context) ───────────────────────────────────────────
function AppInner() {
  const { user, isAuthenticated, logout } = useAuth();
  const { playArticle } = useVoicePlayer();

  const [activePage, setActivePage] = useState<ActivePage>('landing');
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [articles, setArticles] = useState<Article[]>([]);
  const [historyArticles, setHistoryArticles] = useState<Article[]>([]);
  const [savedArticles, setSavedArticles] = useState<Article[]>([]);
  const [recommendations, setRecommendations] = useState<Article[]>([]);
  const [searchResults, setSearchResults] = useState<Article[]>([]);
  const [chatContextArticle, setChatContextArticle] = useState<Article | null>(null);
  const [dailyBrief, setDailyBrief] = useState<DailyBrief>(SAMPLE_DAILY_BRIEF);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [mlTelemetry, setMlTelemetry] = useState<MLTelemetry>(INITIAL_ML_TELEMETRY);


  // Modals
  const [summaryModalArticle, setSummaryModalArticle] = useState<Article | null>(null);
  const [isFakeNewsOpen, setIsFakeNewsOpen] = useState(false);
  const [isArchOpen, setIsArchOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [readingModeArticle, setReadingModeArticle] = useState<Article | null>(null);
  const [fakeNewsArticle, setFakeNewsArticle] = useState<Article | null>(null);

  // Connect Socket.io client for real-time notifications
  useEffect(() => {
    if (user) {
      const socket = io(window.location.origin);
      
      socket.emit('authenticate', user.id);
      
      socket.on('breaking_news', (breakingArticle: any) => {
        console.log('Breaking news received via socket:', breakingArticle);
        setArticles(prev => {
          if (prev.some(art => art.id === breakingArticle.id)) return prev;
          return [breakingArticle, ...prev];
        });
        
        // Trigger browser notification
        if (Notification.permission === 'granted') {
          new Notification(`BREAKING: ${breakingArticle.title}`, {
            body: breakingArticle.excerpt,
            icon: breakingArticle.imageUrl
          });
        }
      });

      socket.on('notification', (newNotif: any) => {
        console.log('Targeted notification received:', newNotif);
        // Trigger browser notification
        if (Notification.permission === 'granted') {
          new Notification(newNotif.title, {
            body: newNotif.message
          });
        }
      });

      if (Notification.permission === 'default') {
        void Notification.requestPermission();
      }

      return () => {
        socket.disconnect();
      };
    }
  }, [user]);

  // When auth user changes, sync into userProfile
  useEffect(() => {
    if (user) {
      setUserProfile(prev => ({
        ...prev,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        role: user.role,
        plan: user.plan,
      }));
      void loadInitialData();
      void fetchNews();
    }
  }, [user]);

  useEffect(() => {
    void loadInitialData();
  }, []);

  useEffect(() => {
    void fetchNews();
  }, [selectedCategory]);

  const loadInitialData = async () => {
    try {
      const queryParams = user ? `?userId=${user.id}&email=${encodeURIComponent(user.email)}` : '';
      const [profileRes, healthRes, briefRes] = await Promise.all([
        fetch(`/api/user/profile${queryParams}`),
        fetch('/api/health'),
        fetch('/api/ai/daily-brief')
      ]);

      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setUserProfile(profileData);
      }

      if (healthRes.ok) {
        const healthData = await healthRes.json();
        if (healthData?.mlTelemetry) {
          setMlTelemetry(healthData.mlTelemetry);
        }
      }

      if (briefRes.ok) {
        const briefData = await briefRes.json();
        setDailyBrief(briefData);
      }
    } catch (err) {
      console.error('Failed to bootstrap app data from API:', err);
    }
  };

  const fetchNews = async () => {
    setIsLoading(true);
    try {
      const userParams = user ? `&userId=${user.id}&email=${encodeURIComponent(user.email)}` : '';
      const url = selectedCategory === 'All'
        ? `/api/news?sort=newest${userParams}`
        : `/api/news?category=${encodeURIComponent(selectedCategory)}${userParams}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data && data.articles) {
        setArticles(data.articles);
      }
    } catch (err) {
      console.error('Failed to fetch articles from API:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const userParams = user ? `?userId=${user.id}&email=${encodeURIComponent(user.email)}` : '';
      const res = await fetch(`/api/user/history${userParams}`);
      const data = await res.json();
      if (data && data.articles) {
        setHistoryArticles(data.articles);
      }
    } catch (err) {
      console.error('Failed to fetch reading history:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBookmarks = async () => {
    setIsLoading(true);
    try {
      const userParams = user ? `?userId=${user.id}&email=${encodeURIComponent(user.email)}` : '';
      const res = await fetch(`/api/user/bookmarks${userParams}`);
      const data = await res.json();
      if (data && data.articles) {
        setSavedArticles(data.articles);
      }
    } catch (err) {
      console.error('Failed to fetch bookmarks:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPersonalizedRecommendations = async () => {
    setIsLoading(true);
    try {
      const userParams = user ? `?userId=${user.id}&email=${encodeURIComponent(user.email)}` : '';
      const res = await fetch(`/api/ai/recommendations${userParams}`);
      const data = await res.json();
      if (data && data.articles) {
        setRecommendations(data.articles);
      }
    } catch (err) {
      console.error('Failed to fetch recommendations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSemanticSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    setIsLoading(true);
    try {
      const userParams = user ? `&userId=${user.id}&email=${encodeURIComponent(user.email)}` : '';
      const res = await fetch(`/api/news/search-semantic?query=${encodeURIComponent(query)}${userParams}`);
      const data = await res.json();
      if (data && data.articles) {
        setSearchResults(data.articles);
      }
    } catch (err) {
      console.error('Failed to run semantic search:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activePage === 'search') {
      const delayDebounceFn = setTimeout(() => {
        void fetchSemanticSearch(searchQuery);
      }, 400);
      return () => clearTimeout(delayDebounceFn);
    }
  }, [searchQuery, activePage]);

  // Navigate — protected routes redirect to auth
  const PROTECTED_PAGES: ActivePage[] = ['personalized', 'history', 'saved', 'profile', 'admin', 'ai-chat'];
  const navigateTo = (page: ActivePage) => {
    if (PROTECTED_PAGES.includes(page) && !isAuthenticated) {
      setActivePage('auth');
      return;
    }
    setActivePage(page);
    if (page === 'history') {
      void fetchHistory();
    } else if (page === 'saved') {
      void fetchBookmarks();
    } else if (page === 'personalized') {
      void fetchPersonalizedRecommendations();
    }
  };


  const handleInteract = async (articleId: string, action: 'bookmark' | 'like') => {
    setArticles(prev => prev.map(art => {
      if (art.id === articleId) {
        if (action === 'bookmark') {
          const isBookmarked = !art.isBookmarked;
          return { ...art, isBookmarked, bookmarksCount: art.bookmarksCount + (isBookmarked ? 1 : -1) };
        } else {
          const isLiked = !art.isLiked;
          return { ...art, isLiked, likesCount: art.likesCount + (isLiked ? 1 : -1) };
        }
      }
      return art;
    }));

    try {
      await fetch(`/api/news/${articleId}/interact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action,
          userId: user?.id,
          email: user?.email
        })
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenSummary = (article: Article) => {
    setSummaryModalArticle(article);
    fetch('/api/user/history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        articleId: article.id, 
        durationSec: article.readTimeMinutes * 60,
        userId: user?.id,
        email: user?.email
      })
    }).catch(err => console.error(err));
  };

  const handleOpenVoice = (article: Article) => {
    playArticle(article, articles);
  };

  const handleToggleTheme = async () => {
    const nextTheme: 'dark' | 'light' = userProfile.preferences.theme === 'dark' ? 'light' : 'dark';
    setUserProfile(prev => {
      const updated = { ...prev, preferences: { ...prev.preferences, theme: nextTheme } };
      void fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          preferences: updated.preferences,
          userId: user?.id,
          email: user?.email
        })
      }).catch(err => console.error('Failed to persist theme preference:', err));
      return updated;
    });
  };

  const handleLogout = () => {
    logout();
    setActivePage('landing');
  };

  // ── Full-screen Auth Page (replaces everything) ─────────────────
  if (activePage === 'auth') {
    return (
      <React.Suspense fallback={<PageLoader />}>
        <AuthPage
          onSuccess={() => setActivePage('home')}
          initialMode="login"
        />
      </React.Suspense>
    );
  }

  const savedArticlesCount = articles.filter(a => a.isBookmarked).length;

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans ${
      userProfile.preferences.theme === 'dark'
        ? 'bg-[#050505] text-slate-100 selection:bg-indigo-600 selection:text-white'
        : 'bg-slate-100 text-slate-900 selection:bg-indigo-600 selection:text-white'
    }`}>

      {/* Header */}
      <Header
        user={userProfile}
        activePage={activePage}
        onNavigate={navigateTo}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenFakeNewsDetector={() => setIsFakeNewsOpen(true)}
        onOpenArchitecture={() => setIsArchOpen(true)}
        onOpenDailyBrief={() => navigateTo('daily-brief')}
        onToggleTheme={handleToggleTheme}
        onOpenProfile={() => navigateTo('profile')}
        onOpenAuth={() => setActivePage('auth')}
        onLogout={handleLogout}
      />

      {/* Main App Layout */}
      <div className="max-w-7xl mx-auto flex gap-6 px-4 lg:px-8 py-6">

        {/* Sidebar */}
        <Sidebar
          activePage={activePage}
          onNavigate={navigateTo}
          savedCount={savedArticlesCount}
        />

        {/* Dynamic Page View Area */}
        <main className="flex-1 min-w-0">
          <React.Suspense fallback={<PageLoader />}>
            {activePage === 'landing' && (
              <LandingPage
                onNavigate={navigateTo}
                onOpenAuth={() => setActivePage('auth')}
              />
            )}

            {activePage === 'home' && (
              <HomeFeed
                articles={articles}
                onOpenSummary={handleOpenSummary}
                onOpenVoice={handleOpenVoice}
                onInteract={handleInteract}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                isLoading={isLoading}
                onRefresh={fetchNews}
                onNavigate={navigateTo}
                onOpenFakeNews={() => navigateTo('fake-news')}
              />
            )}

            {activePage === 'personalized' && (
              <PersonalizedFeedPage
                articles={recommendations.length > 0 ? recommendations : articles}
                user={userProfile}
                onOpenSummary={handleOpenSummary}
                onOpenVoice={handleOpenVoice}
                onInteract={handleInteract}
              />
            )}


            {activePage === 'trending' && (
              <TrendingPage
                articles={articles}
                onOpenSummary={handleOpenSummary}
                onOpenVoice={handleOpenVoice}
                onInteract={handleInteract}
              />
            )}

            {activePage === 'categories' && (
              <CategoriesPage
                articles={articles}
                onSelectCategory={(cat) => {
                  setSelectedCategory(cat);
                  navigateTo('home');
                }}
              />
            )}

            {activePage === 'search' && (
              <SearchPage
                articles={searchQuery.trim() ? searchResults : articles}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onOpenSummary={handleOpenSummary}
                onOpenVoice={handleOpenVoice}
                onInteract={handleInteract}
              />
            )}


            {activePage === 'daily-brief' && (
              <DailyBriefPage
                brief={dailyBrief}
                onOpenSummary={handleOpenSummary}
                onOpenVoice={handleOpenVoice}
                onInteract={handleInteract}
              />
            )}

            {activePage === 'voice-summary' && (
              <VoiceSummaryPage
                articles={articles}
                onOpenVoice={handleOpenVoice}
                onOpenSummary={handleOpenSummary}
              />
            )}

            {activePage === 'history' && (
              <ReadingHistoryPage
                articles={historyArticles}
                user={userProfile}
                mode="history"
                onOpenSummary={handleOpenSummary}
                onOpenVoice={handleOpenVoice}
                onInteract={handleInteract}
              />
            )}

            {activePage === 'saved' && (
              <ReadingHistoryPage
                articles={savedArticles}
                user={userProfile}
                mode="saved"
                onOpenSummary={handleOpenSummary}
                onOpenVoice={handleOpenVoice}
                onInteract={handleInteract}
              />
            )}

            {activePage === 'ai-chat' && (
              <AIChatPage
                contextArticle={chatContextArticle}
                onClearContext={() => setChatContextArticle(null)}
              />
            )}


            {activePage === 'analytics' && <AnalyticsDashboard />}

            {activePage === 'ml-dashboard' && <MLDashboardPage telemetry={mlTelemetry} />}

            {activePage === 'admin' && <AdminDashboard />}

            {activePage === 'profile' && (
              <UserProfilePage
                user={userProfile}
                onUpdateProfile={async (updated) => {
                  setUserProfile(prev => ({ ...prev, ...updated }));
                  try {
                    await fetch('/api/user/profile', {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        ...updated,
                        userId: user?.id,
                        email: user?.email
                      })
                    });
                  } catch (err) {
                    console.error('Failed to persist profile:', err);
                  }
                }}
              />
            )}

            {/* NEW PAGES */}
            {activePage === 'compare' && (
              <CompareArticlesPage
                articles={articles}
                onOpenSummary={handleOpenSummary}
                onOpenVoice={handleOpenVoice}
                onInteract={handleInteract}
              />
            )}

            {activePage === 'timeline' && (
              <NewsTimelinePage articles={articles} />
            )}

            {activePage === 'discovery' && (
              <NewsDiscoveryPage
                onOpenSummary={handleOpenSummary}
                onOpenVoice={handleOpenVoice}
                onInteract={handleInteract}
                onSelectCategory={(cat) => {
                  setSelectedCategory(cat);
                  navigateTo('categories');
                }}
                onNavigateToFakeNews={(art) => {
                  if (art) setFakeNewsArticle(art);
                  navigateTo('fake-news');
                }}
              />
            )}

            {activePage === 'missed' && (
              <NewsMissedPage
                user={userProfile}
                onOpenSummary={handleOpenSummary}
                onOpenVoice={handleOpenVoice}
                onInteract={handleInteract}
              />
            )}

            {activePage === 'interest-profile' && (
              <InterestProfilePage
                user={userProfile}
                onUpdateProfile={async (updated) => {
                  setUserProfile(prev => ({ ...prev, ...updated }));
                  try {
                    await fetch('/api/user/profile', {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ ...updated, userId: user?.id, email: user?.email })
                    });
                  } catch {}
                }}
              />
            )}

            {activePage === 'ai-models' && <AIModelInfoPage />}

            {activePage === 'system-health' && <SystemHealthPage />}

            {activePage === 'fake-news' && (
              <FakeNewsPage
                preloadedArticle={fakeNewsArticle}
                onOpenSummary={handleOpenSummary}
              />
            )}

            {activePage === 'media-bias' && (
              <MediaBiasPage
                articles={articles}
                onSelectArticle={(art) => setChatContextArticle(art)}
                onOpenSummaryModal={handleOpenSummary}
              />
            )}

            {activePage === 'research-export' && (
              <ResearchExportPage articles={articles} />
            )}

            {activePage === 'perspective' && (
              <PerspectiveSandboxPage />
            )}

            {activePage === 'fact-checker' && (
              <FactCheckWorkbenchPage />
            )}

            {activePage === 'georadar' && (
              <GeoRadarPage />
            )}


          </React.Suspense>
        </main>
      </div>

      {/* Global Modals */}
      <AISummaryModal
        article={summaryModalArticle}
        onClose={() => setSummaryModalArticle(null)}
        onOpenVoice={(art) => { setSummaryModalArticle(null); handleOpenVoice(art); }}
        onInteract={handleInteract}
        onDiscussWithAI={(art) => {
          setChatContextArticle(art);
          setSummaryModalArticle(null);
          navigateTo('ai-chat');
        }}
        onOpenReadingMode={(art) => {
          setSummaryModalArticle(null);
          setReadingModeArticle(art);
        }}
      />

      <ReadingModeModal
        article={readingModeArticle}
        onClose={() => setReadingModeArticle(null)}
      />

      <VoicePlayerModal />
      <VoicePlayerMini />

      <FakeNewsDetectorModal
        isOpen={isFakeNewsOpen}
        onClose={() => setIsFakeNewsOpen(false)}
      />

      <ArchitectureExplorerModal
        isOpen={isArchOpen}
        onClose={() => setIsArchOpen(false)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={async (newUsr) => {
          const nextProfile = { ...userProfile, ...newUsr };
          setUserProfile(nextProfile);
          try {
            await fetch('/api/user/profile', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(nextProfile)
            });
          } catch (err) {
            console.error('Failed to persist auth profile:', err);
          }
        }}
      />
    </div>
  );
}

// ─── Root App wrapped with AuthProvider and VoicePlayerProvider ───────────────
export default function App() {
  return (
    <AuthProvider>
      <VoicePlayerProvider>
        <AppInner />
      </VoicePlayerProvider>
    </AuthProvider>
  );
}
