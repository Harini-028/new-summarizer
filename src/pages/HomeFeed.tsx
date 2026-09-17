import React, { useState } from 'react';
import { 
  Grid, List, SlidersHorizontal, Sparkles, TrendingUp, RefreshCw, Flame,
  ShieldCheck, ShieldAlert, BadgeAlert, Brain, FileText, Compass, Eye,
  Radio, BarChart3, Search, Target, ArrowRight, Zap, CheckCircle2
} from 'lucide-react';
import { Article, CategoryType } from '../types';
import NewsCard from '../components/NewsCard';

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

  const categories: CategoryType[] = [
    'All',
    'AI & Technology',
    'Business & Finance',
    'Science & Space',
    'Health & Medicine',
    'World & Politics',
    'Climate & Environment',
    'Entertainment & Culture'
  ];

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
