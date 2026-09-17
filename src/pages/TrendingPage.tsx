import React from 'react';
import { Flame, TrendingUp, Zap, Sparkles, Globe } from 'lucide-react';
import { Article } from '../types';
import NewsCard from '../components/NewsCard';

interface TrendingPageProps {
  articles: Article[];
  onOpenSummary: (article: Article) => void;
  onOpenVoice: (article: Article) => void;
  onInteract: (articleId: string, action: 'bookmark' | 'like') => void;
}

export default function TrendingPage({
  articles,
  onOpenSummary,
  onOpenVoice,
  onInteract
}: TrendingPageProps) {
  
  // Sort by popularity / views
  const trendingArticles = [...articles].sort((a, b) => b.viewsCount - a.viewsCount);

  const hotTopics = [
    { title: 'Quantum Neural Networks', count: '14.2k reads', trend: '+140%' },
    { title: 'Project Agorá CBDC', count: '11.8k reads', trend: '+95%' },
    { title: 'JWST Exoplanet LHS 1140 b', count: '24.5k reads', trend: '+210%' },
    { title: 'Solid-State EV Batteries', count: '15.3k reads', trend: '+80%' },
    { title: 'CRISPR Epigenetic Base Editing', count: '18.9k reads', trend: '+125%' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Hot Topics Radar Bar */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-950 border border-amber-500/30 space-y-4 shadow-xl">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
            <Flame className="w-4 h-4 animate-bounce" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100">Trending Topics Radar</h2>
            <p className="text-xs text-slate-400">Viral stories identified by BERTopic velocity algorithms</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {hotTopics.map((topic, idx) => (
            <div key={idx} className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center gap-3">
              <span className="text-xs font-bold text-amber-400 font-mono">#{idx + 1}</span>
              <div>
                <p className="text-xs font-semibold text-slate-200">{topic.title}</p>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                  <span>{topic.count}</span>
                  <span className="text-emerald-400 font-bold">{topic.trend}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trendingArticles.map(art => (
          <NewsCard
            key={art.id}
            article={art}
            onOpenSummary={onOpenSummary}
            onOpenVoice={onOpenVoice}
            onInteract={onInteract}
          />
        ))}
      </div>

    </div>
  );
}
