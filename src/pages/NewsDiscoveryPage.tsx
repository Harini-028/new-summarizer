import React, { useState, useEffect } from 'react';
import { Compass, Flame, Zap, Shuffle, Hash, Globe, ArrowRight, TrendingUp, Sparkles, Search, ShieldCheck, RefreshCw } from 'lucide-react';
import { Article, CategoryType } from '../types';
import NewsCard from '../components/NewsCard';

interface NewsDiscoveryPageProps {
  onOpenSummary: (article: Article) => void;
  onOpenVoice: (article: Article) => void;
  onInteract: (id: string, action: 'bookmark' | 'like') => void;
  onSelectCategory?: (cat: CategoryType) => void;
  onNavigateToFakeNews?: (article?: Article) => void;
}

type DiscoveryTab = 'trending' | 'emerging' | 'random' | 'topics' | 'sources';

interface DiscoveryData {
  trending: Article[];
  emerging: Article[];
  random: Article[];
  topics: string[];
  sources: { name: string; domain: string; trustScore: number }[];
  categories: string[];
}

const categoryColors: Record<string, string> = {
  'AI & Technology': 'from-indigo-600 to-violet-600',
  'Business & Finance': 'from-emerald-600 to-teal-600',
  'Science & Space': 'from-cyan-600 to-blue-600',
  'Health & Medicine': 'from-rose-600 to-pink-600',
  'World & Politics': 'from-amber-600 to-orange-600',
  'Climate & Environment': 'from-green-600 to-emerald-600',
  'Entertainment & Culture': 'from-fuchsia-600 to-purple-600',
};

const FILTER_CATEGORIES = [
  'All', 'AI & Technology', 'Business & Finance', 'Science & Space',
  'Health & Medicine', 'World & Politics', 'Climate & Environment', 'Entertainment & Culture',
  'Startups', 'Cybersecurity'
];

export default function NewsDiscoveryPage({
  onOpenSummary, onOpenVoice, onInteract, onSelectCategory, onNavigateToFakeNews
}: NewsDiscoveryPageProps) {
  const [activeTab, setActiveTab] = useState<DiscoveryTab>('trending');
  const [data, setData] = useState<DiscoveryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Filters
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Pagination / Load More state
  const [page, setPage] = useState(1);
  const [displayedArticles, setDisplayedArticles] = useState<Article[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const PAGE_SIZE = 6;

  useEffect(() => {
    fetch('/api/news/discovery')
      .then(r => r.json())
      .then(d => {
        setData(d);
        const initial = (d.trending || []) as Article[];
        setDisplayedArticles(initial.slice(0, PAGE_SIZE));
        setHasMore(initial.length > PAGE_SIZE);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const tabs: { id: DiscoveryTab; label: string; icon: React.ReactNode }[] = [
    { id: 'trending', label: 'Trending Now', icon: <Flame className="w-3.5 h-3.5" /> },
    { id: 'emerging', label: 'Emerging Topics', icon: <TrendingUp className="w-3.5 h-3.5" /> },
    { id: 'random', label: 'Random Horizon', icon: <Shuffle className="w-3.5 h-3.5" /> },
    { id: 'topics', label: 'Explore Topics', icon: <Hash className="w-3.5 h-3.5" /> },
    { id: 'sources', label: 'Popular Sources', icon: <Globe className="w-3.5 h-3.5" /> },
  ];

  const getSourcePool = (): Article[] => {
    if (!data) return [];
    if (activeTab === 'trending') return (data.trending || []) as Article[];
    if (activeTab === 'emerging') return (data.emerging || []) as Article[];
    if (activeTab === 'random') return (data.random || []) as Article[];
    return [];
  };

  // Filter pool by Category and Search Query
  const filteredPool = getSourcePool().filter(a => {
    const matchCat = selectedFilter === 'All' || a.category === selectedFilter ||
      (selectedFilter === 'Startups' && a.category === 'Business & Finance') ||
      (selectedFilter === 'Cybersecurity' && a.category === 'AI & Technology');
    const matchQuery = !searchQuery.trim() ||
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.source.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.entities?.keywords?.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchQuery;
  });

  const currentVisible = filteredPool.slice(0, page * PAGE_SIZE);

  const handleLoadMore = () => {
    if (isLoadingMore || currentVisible.length >= filteredPool.length) return;
    setIsLoadingMore(true);
    setTimeout(() => {
      setPage(prev => prev + 1);
      setIsLoadingMore(false);
    }, 400);
  };

  const handleTabChange = (tab: DiscoveryTab) => {
    setActiveTab(tab);
    setPage(1);
  };

  if (isLoading) {
    return (
      <div className="space-y-4 p-6">
        <div className="h-28 bg-slate-900 animate-pulse rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1,2,3,4].map(n => <div key={n} className="h-48 bg-slate-900 animate-pulse rounded-3xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-violet-900/20 to-indigo-900/10 border border-violet-500/20 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-500/20 text-violet-400 flex items-center justify-center border border-violet-500/30">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">Discover News</h2>
            <p className="text-xs text-slate-400">Explore trending topics, emerging stories, and new sources</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setPage(1); }}
            placeholder="Search discovered stories by keyword, source, or topic..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-2xl text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-violet-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
          {FILTER_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => { setSelectedFilter(cat); setPage(1); }}
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all ${
                selectedFilter === cat ? 'bg-violet-600 text-white shadow-lg' : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1.5 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 overflow-x-auto scrollbar-none">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 ${
              activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Article Grid View */}
      {(activeTab === 'trending' || activeTab === 'emerging' || activeTab === 'random') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {activeTab === 'trending' && <><Flame className="w-4 h-4 text-orange-400" /><span className="text-sm font-bold text-slate-200">Trending Stories</span></>}
              {activeTab === 'emerging' && <><TrendingUp className="w-4 h-4 text-cyan-400" /><span className="text-sm font-bold text-slate-200">Emerging Topics</span></>}
              {activeTab === 'random' && <><Shuffle className="w-4 h-4 text-violet-400" /><span className="text-sm font-bold text-slate-200">Random Discovery</span></>}
            </div>
            <span className="text-xs font-mono text-slate-500">{currentVisible.length} / {filteredPool.length} stories</span>
          </div>

          {currentVisible.length === 0 ? (
            <div className="p-12 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-3">
              <p className="text-sm text-slate-400">No articles found matching "{searchQuery || selectedFilter}".</p>
              <button onClick={() => { setSearchQuery(''); setSelectedFilter('All'); }} className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl">Clear Filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentVisible.map(article => (
                <div key={article.id} className="relative group/wrapper">
                  <NewsCard article={article} onOpenSummary={onOpenSummary} onOpenVoice={onOpenVoice} onInteract={onInteract} />
                  
                  {/* AI Check Button on Article Card */}
                  {onNavigateToFakeNews && (
                    <button
                      onClick={(e) => { e.stopPropagation(); onNavigateToFakeNews(article); }}
                      className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-full bg-slate-950/90 border border-emerald-500/40 text-[10px] font-bold text-emerald-400 hover:bg-emerald-600 hover:text-white transition-all flex items-center gap-1 shadow-lg"
                      title="Run AI Fake News Check on this article"
                    >
                      <ShieldCheck className="w-3 h-3" />
                      <span>AI Check</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* MORE ARTICLES PAGINATION BUTTON */}
          {filteredPool.length > 0 && (
            <div className="pt-4 flex justify-center">
              <button
                onClick={handleLoadMore}
                disabled={isLoadingMore || currentVisible.length >= filteredPool.length}
                className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 hover:text-white transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isLoadingMore ? (
                  <><RefreshCw className="w-4 h-4 animate-spin text-indigo-400" /> Loading More Articles...</>
                ) : currentVisible.length >= filteredPool.length ? (
                  <span>No More Articles</span>
                ) : (
                  <><Sparkles className="w-4 h-4 text-indigo-400" /> More Articles ({filteredPool.length - currentVisible.length} remaining)</>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Topics tab */}
      {activeTab === 'topics' && data?.topics && (
        <div className="space-y-4">
          <p className="text-xs text-slate-400">Explore emerging topics and keywords across all articles</p>
          <div className="flex flex-wrap gap-2">
            {data.topics.map((topic, i) => (
              <button key={i} onClick={() => setSearchQuery(topic)} className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-indigo-500 text-xs font-semibold text-slate-300 hover:text-indigo-300 transition-all flex items-center gap-1.5">
                <Hash className="w-3 h-3 text-slate-500" /> {topic}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sources tab */}
      {activeTab === 'sources' && data?.sources && (
        <div className="space-y-3">
          <p className="text-xs text-slate-400">Explore articles by their original news sources</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.sources.map((source, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-slate-100">{source.name}</div>
                  <div className="text-[10px] text-slate-500 font-mono">{source.domain}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold font-mono text-emerald-400">{source.trustScore || 85}/100</div>
                  <div className="text-[10px] text-slate-500">Trust Score</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
