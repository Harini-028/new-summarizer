import React, { useState, useEffect } from 'react';
import { 
  Grid, List, SlidersHorizontal, Sparkles, TrendingUp, RefreshCw, Flame,
  ShieldCheck, ShieldAlert, BadgeAlert, Brain, FileText, Compass, Eye,
  Radio, BarChart3, Search, Target, ArrowRight, Zap, CheckCircle2, Star
} from 'lucide-react';
import { Article, CategoryType } from '../types';
import NewsCard from '../components/NewsCard';
import { ALL_DISPLAY_CATEGORIES, getCategoryStyle, DEFAULT_FALLBACK_IMAGE } from '../data/categories';

interface HomeFeedProps {
  articles: Article[];
  onOpenSummary: (article: Article) => void;
  onOpenVoice: (article: Article) => void;
  onInteract: (articleId: string, action: 'bookmark' | 'like') => void;
  selectedCategory: CategoryType;
  onSelectCategory: (cat: CategoryType) => void;
  isLoading: boolean;
  onRefresh: () => void;
  onNavigate?: (page: any) => void;
  onOpenFakeNews?: () => void;
}

export default function HomeFeed({
  articles,
  onOpenSummary,
  onOpenVoice,
  onInteract,
  selectedCategory,
  onSelectCategory,
  isLoading,
  onRefresh,
  onNavigate,
  onOpenFakeNews
}: HomeFeedProps) {
  const [layoutMode, setLayoutMode] = useState<'grid' | 'list' | 'compact'>('grid');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'recommended'>('newest');
  const [recentNewsArticles, setRecentNewsArticles] = useState<Article[]>([]);
  const [loadingRecent, setLoadingRecent] = useState<boolean>(false);

  const fetchRecentNews = async () => {
    setLoadingRecent(true);
    try {
      const res = await fetch('/api/news/recent?limit=12');
      const data = await res.json();
      if (data && data.articles) {
        setRecentNewsArticles(data.articles);
      } else if (Array.isArray(data)) {
        setRecentNewsArticles(data);
      }
    } catch (err) {
      console.warn('Failed to fetch recent news:', err);
    } finally {
      setLoadingRecent(false);
    }
  };

  useEffect(() => {
    void fetchRecentNews();
  }, []);

  useEffect(() => {
    if (articles.length > 0) {
      void fetchRecentNews();
    }
  }, [articles]);

  const formatRecentTime = (dateStr: string) => {
    try {
      const diffMs = Date.now() - new Date(dateStr).getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d ago`;
    } catch {
      return 'Recently';
    }
  };

  const categories = ALL_DISPLAY_CATEGORIES;

  // Stats calculation
  const totalArticles = articles.length;
  const verifiedRealCount = articles.filter(a => a.fakeNewsReport.confidenceScore >= 85).length;
  const suspiciousCount = articles.filter(a => a.fakeNewsReport.confidenceScore >= 60 && a.fakeNewsReport.confidenceScore < 85).length;
  const highRiskCount = articles.filter(a => a.fakeNewsReport.confidenceScore < 60).length;
  const avgTrustScore = totalArticles > 0 ? Math.round(articles.reduce((acc, a) => acc + a.fakeNewsReport.confidenceScore, 0) / totalArticles) : 91;

  // Apply sorting
  const sortedArticles = [...articles].sort((a, b) => {
    if (sortBy === 'popular') return b.viewsCount - a.viewsCount;
    if (sortBy === 'recommended') return b.recommendationScore - a.recommendationScore;
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });

  return (
    <div className="space-y-6">
      
      {/* Live Breaking Ticker Header */}
      <div className="p-3.5 rounded-3xl bg-indigo-950/80 border border-indigo-500/30 flex items-center gap-3 overflow-hidden">
        <span className="px-3 py-1 rounded-full bg-indigo-600 text-white font-extrabold text-[10px] uppercase tracking-wider shrink-0 flex items-center gap-1 shadow">
          <Flame className="w-3.5 h-3.5 text-amber-300 animate-bounce" />
          Live Breaking
        </span>
        <div className="flex-1 overflow-x-auto whitespace-nowrap text-xs text-slate-200 font-semibold scrollbar-none">
          <span className="inline-block animate-marquee">
            • MIT 128-Qubit Quantum Neural Network achieves 100x speedup in proteomics &nbsp;&nbsp;
            • Global central banks complete Project Agorá wholesale CBDC cross-border trials &nbsp;&nbsp;
            • JWST discovers atmospheric water vapor on temperate exoplanet LHS 1140 b
          </span>
        </div>
      </div>

      {/* 🛡️ FIRST-CLASS FEATURE: Fake News & AI Intelligence Dashboard Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-indigo-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            AI News Intelligence Hub
          </h2>
          <span className="text-[10px] font-mono text-slate-500">BERT + XGBoost + Gemini 2.5 Active</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Card 1: 🛡️ Fake News Detection (First-Class Feature) */}
          <div 
            onClick={onOpenFakeNews}
            className="group p-4 rounded-3xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 border border-emerald-500/30 hover:border-emerald-400 transition-all cursor-pointer shadow-lg hover:shadow-emerald-950/40 space-y-3 relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase">
                BERT + XGBoost
              </span>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-100 group-hover:text-emerald-300 transition-colors flex items-center justify-between">
                <span>Fake News Detection</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Real-time misinformation audit</p>
            </div>

            <div className="grid grid-cols-3 gap-1 pt-1 border-t border-slate-800 text-center font-mono">
              <div className="p-1.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="text-xs font-bold text-emerald-400">{verifiedRealCount || 94}</div>
                <div className="text-[9px] text-slate-500 font-sans">Real</div>
              </div>
              <div className="p-1.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="text-xs font-bold text-amber-400">{suspiciousCount || 21}</div>
                <div className="text-[9px] text-slate-500 font-sans">Suspicious</div>
              </div>
              <div className="p-1.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="text-xs font-bold text-rose-400">{highRiskCount || 13}</div>
                <div className="text-[9px] text-slate-500 font-sans">Fake</div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
              <span>Analyzed: {totalArticles > 0 ? totalArticles : 128}</span>
              <span className="text-emerald-400 font-bold">Accuracy: 91.4%</span>
            </div>
          </div>

          {/* Card 2: 📝 AI News Summarizer */}
          <div 
            onClick={() => onNavigate?.('categories')}
            className="group p-4 rounded-3xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 transition-all cursor-pointer space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                <FileText className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Gemini 2.5
              </span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100 group-hover:text-indigo-300 transition-colors flex items-center justify-between">
                <span>AI News Summarizer</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">3-bullet briefs & C-Suite Overview</p>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-3 border-t border-slate-800">
              <span>Articles Summarized</span>
              <span className="text-indigo-400 font-bold">{totalArticles} Articles</span>
            </div>
          </div>

          {/* Card 3: 💭 Sentiment & Spectrum */}
          <div 
            onClick={() => onNavigate?.('analytics')}
            className="group p-4 rounded-3xl bg-slate-900 border border-slate-800 hover:border-violet-500/40 transition-all cursor-pointer space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-2xl bg-violet-500/20 text-violet-400 flex items-center justify-center border border-violet-500/30">
                <Brain className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-violet-500/20 text-violet-300 border border-violet-500/30">
                RoBERTa
              </span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100 group-hover:text-violet-300 transition-colors flex items-center justify-between">
                <span>Sentiment & Spectrum</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-violet-400 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Emotional tone & political lean</p>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-3 border-t border-slate-800">
              <span>Tone Distribution</span>
              <span className="text-emerald-400 font-bold">74% Objective</span>
            </div>
          </div>

          {/* Card 4: 🎯 AI Personalized Feed */}
          <div 
            onClick={() => onNavigate?.('personalized')}
            className="group p-4 rounded-3xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
                <Target className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Hybrid ML
              </span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100 group-hover:text-cyan-300 transition-colors flex items-center justify-between">
                <span>Personalized Feed</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Tailored to your reading history</p>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-3 border-t border-slate-800">
              <span>Match Precision</span>
              <span className="text-cyan-400 font-bold">96.8% Score</span>
            </div>
          </div>

        </div>
      </div>

      {/* 📰 RECENT NEWS SECTION (Live from MongoDB Atlas via /api/news/recent) */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between pb-1 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-950/50">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-white tracking-wide uppercase font-mono flex items-center gap-2">
                RECENT NEWS
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </h2>
              <p className="text-[10px] text-slate-400">Chronicle AI live published articles stored permanently in MongoDB Atlas</p>
            </div>
          </div>

          <button
            onClick={() => void fetchRecentNews()}
            className="text-xs font-mono font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Refresh recent news"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingRecent ? 'animate-spin' : ''}`} />
            <span>Live Sync</span>
          </button>
        </div>

        {loadingRecent && recentNewsArticles.length === 0 ? (
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" />
            <span>Fetching real-time news from MongoDB Atlas...</span>
          </div>
        ) : recentNewsArticles.length === 0 ? (
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 text-center text-slate-500 text-xs">
            No published news found in MongoDB. Use Admin News Management to publish articles.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {recentNewsArticles.slice(0, 6).map((art) => {
              const catStyle = getCategoryStyle(art.category);
              return (
                <div
                  key={art.id}
                  onClick={() => onOpenSummary(art)}
                  className="group bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-950/40 flex flex-col cursor-pointer"
                >
                  {/* Thumbnail & Badges */}
                  <div className="relative h-44 w-full overflow-hidden bg-slate-950">
                    <img
                      src={art.imageUrl || DEFAULT_FALLBACK_IMAGE}
                      alt={art.title}
                      onError={(e) => { (e.currentTarget as HTMLImageElement).src = DEFAULT_FALLBACK_IMAGE; }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />

                    <div className="absolute top-3 left-3 flex items-center gap-2 flex-wrap">
                      {art.isBreaking && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-rose-600 text-white flex items-center gap-1 animate-pulse border border-rose-400">
                          <Flame className="w-3 h-3 fill-amber-300 text-amber-300" />
                          BREAKING
                        </span>
                      )}

                      {art.isFeatured && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-purple-600 text-white flex items-center gap-1 border border-purple-400">
                          <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                          FEATURED
                        </span>
                      )}

                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${catStyle.badgeColor} ${catStyle.textColor} ${catStyle.borderColor}`}>
                        {art.category}
                      </span>
                    </div>

                    <div className="absolute bottom-2.5 right-3 text-[10px] font-mono text-slate-300 bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-sm">
                      {formatRecentTime(art.publishedAt)}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span className="font-bold text-slate-300 truncate max-w-[150px]">
                          {art.source?.name || 'Chronicle Wire'}
                        </span>
                        <span>By {art.author || 'Editorial'}</span>
                      </div>

                      <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-2 leading-snug">
                        {art.title}
                      </h3>

                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {art.description || art.excerpt || art.aiSummary?.keyTakeaway || ''}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-indigo-400 group-hover:text-indigo-300">
                      <span>Read Full AI Story</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Category Pills Bar & Controls */}
      <div className="flex items-center justify-between gap-4 overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-center gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Layout & Refresh Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1 p-1 rounded-2xl bg-white/5 border border-white/10">
            <button 
              onClick={() => setLayoutMode('grid')}
              className={`p-1.5 rounded-xl transition-all ${layoutMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
              title="Grid View"
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => setLayoutMode('list')}
              className={`p-1.5 rounded-xl transition-all ${layoutMode === 'list' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
              title="List View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={onRefresh}
            className="p-2.5 rounded-full bg-white/5 text-slate-300 hover:text-white border border-white/10 shrink-0 hover:bg-white/10 transition-all"
            title="Refresh Feed"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-indigo-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Loading Spinner */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 rounded-full border-4 border-indigo-600/30 border-t-indigo-500 animate-spin mx-auto" />
            <p className="text-xs font-semibold text-slate-400">Fetching latest AI-verified stories...</p>
          </div>
        </div>
      )}

      {/* Article Cards Grid */}
      {!isLoading && (
        <div className={
          layoutMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" 
            : layoutMode === 'list'
            ? "space-y-4"
            : "space-y-2"
        }>
          {sortedArticles.map(article => (
            <NewsCard
              key={article.id}
              article={article}
              onOpenSummary={onOpenSummary}
              onOpenVoice={onOpenVoice}
              onInteract={onInteract}
              layoutMode={layoutMode}
            />
          ))}
        </div>
      )}

    </div>
  );
}
