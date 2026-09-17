import React from 'react';
import { 
  Sparkles, 
  Clock, 
  Bookmark, 
  Heart, 
  Share2, 
  ShieldCheck, 
  ShieldAlert, 
  Volume2, 
  ChevronRight,
  ThumbsUp
} from 'lucide-react';
import { Article } from '../types';

interface NewsCardProps {
  key?: string;
  article: Article;
  onOpenSummary: (article: Article) => void;
  onOpenVoice: (article: Article) => void;
  onInteract: (articleId: string, action: 'bookmark' | 'like') => void;
  layoutMode?: 'grid' | 'list' | 'compact';
}

export default function NewsCard({
  article,
  onOpenSummary,
  onOpenVoice,
  onInteract,
  layoutMode = 'grid'
}: NewsCardProps) {
  
  // Format relative time
  const formatTime = (isoString: string) => {
    const diffHours = Math.round((Date.now() - new Date(isoString).getTime()) / (1000 * 60 * 60));
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.round(diffHours / 24)}d ago`;
  };

  // Sentiment color maps
  const sentimentColorMap = {
    Positive: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    Neutral: 'bg-slate-500/10 text-slate-300 border-slate-500/30',
    Negative: 'bg-rose-500/10 text-rose-400 border-rose-500/30'
  };

  // Fake news status
  const isFactChecked = article.fakeNewsReport.confidenceScore >= 80;

  if (layoutMode === 'compact') {
    return (
      <div 
        onClick={() => onOpenSummary(article)}
        className="group p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer flex items-center justify-between gap-3"
      >
        <div className="flex items-center gap-3 min-w-0">
          <img 
            src={article.imageUrl} 
            alt={article.title} 
            className="w-14 h-14 rounded-xl object-cover shrink-0 border border-white/10" 
          />
          <div className="min-w-0">
            <span className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-widest block">
              {article.category}
            </span>
            <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
              {article.title}
            </h4>
            <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
              {article.aiSummary.keyTakeaway}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] font-mono text-slate-500">{formatTime(article.publishedAt)}</span>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-400 transition-colors" />
        </div>
      </div>
    );
  }

  return (
    <div className={`group bg-white/5 border border-white/10 hover:border-indigo-500/50 rounded-3xl overflow-hidden transition-all duration-300 hover:bg-white/10 flex ${
      layoutMode === 'list' ? 'flex-col md:flex-row' : 'flex-col'
    }`}>
      
      {/* Thumbnail Container */}
      <div className={`relative overflow-hidden ${
        layoutMode === 'list' ? 'w-full md:w-64 h-48 md:h-auto shrink-0' : 'w-full h-48'
      }`}>
        <img 
          src={article.imageUrl} 
          alt={article.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/90 via-transparent to-transparent" />
        
        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="px-3 py-1 text-[10px] font-extrabold tracking-wider uppercase bg-indigo-600 text-white rounded-full shadow">
            {article.category}
          </span>
          <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full border backdrop-blur-md ${sentimentColorMap[article.sentiment.type]}`}>
            {article.sentiment.label}
          </span>
        </div>

        {/* Fake News Trust Score Badge */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#080808]/90 border border-white/10 text-[10px] font-bold text-slate-200 backdrop-blur-md">
          {isFactChecked ? (
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
          )}
          <span>{article.fakeNewsReport.confidenceScore}% Trust</span>
        </div>

        {/* Audio Quick Listen Pill */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenVoice(article);
          }}
          className="absolute bottom-3 right-3 p-2.5 rounded-full bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg transition-transform hover:scale-110"
          title="Listen to AI Voice Summary"
        >
          <Volume2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          
          {/* Metadata Row */}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold text-slate-200 flex items-center gap-1.5">
              {article.source.name}
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-white/10 text-slate-300 border border-white/5">
                {article.source.trustScore}/100
              </span>
            </span>
            <div className="flex items-center gap-2 text-[11px] font-mono">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                {article.readTimeMinutes} min
              </span>
              <span>•</span>
              <span>{formatTime(article.publishedAt)}</span>
            </div>
          </div>

          {/* Title */}
          <h3 
            onClick={() => onOpenSummary(article)}
            className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors cursor-pointer line-clamp-2 leading-snug"
          >
            {article.title}
          </h3>

          {/* AI Executive Summary Preview */}
          <div className="p-3.5 rounded-2xl bg-[#080808]/80 border border-white/10 space-y-1.5">
            <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-indigo-400 uppercase tracking-widest">
              <Sparkles className="w-3 h-3" />
              AI Executive Takeaway
            </div>
            <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
              {article.aiSummary.keyTakeaway}
            </p>
          </div>

          {/* Key Entities / Tags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {article.entities.keywords.slice(0, 3).map((kw, idx) => (
              <span key={idx} className="px-2.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-white/5 border border-white/5 rounded-full">
                #{kw}
              </span>
            ))}
          </div>

        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between">
          
          <button
            onClick={() => onOpenSummary(article)}
            className="flex items-center gap-1 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-wider"
          >
            <span>Read AI Analysis</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1 text-slate-400">
            {/* Bookmark button */}
            <button
              onClick={() => onInteract(article.id, 'bookmark')}
              className={`p-2 rounded-full transition-colors ${
                article.isBookmarked ? 'bg-indigo-600 text-white' : 'bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white'
              }`}
              title="Save Article"
            >
              <Bookmark className={`w-3.5 h-3.5 ${article.isBookmarked ? 'fill-white' : ''}`} />
            </button>

            {/* Like button */}
            <button
              onClick={() => onInteract(article.id, 'like')}
              className={`px-2.5 py-1 rounded-full flex items-center gap-1.5 text-xs transition-colors ${
                article.isLiked ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white'
              }`}
              title="Like Article"
            >
              <Heart className={`w-3.5 h-3.5 ${article.isLiked ? 'fill-rose-400' : ''}`} />
              <span className="text-[11px] font-mono font-bold">{article.likesCount}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
