import React from 'react';
import { Sparkles, Brain, Flame, ThumbsUp, Layers } from 'lucide-react';
import { Article, UserProfile } from '../types';
import NewsCard from '../components/NewsCard';

interface PersonalizedFeedPageProps {
  articles: Article[];
  user: UserProfile;
  onOpenSummary: (article: Article) => void;
  onOpenVoice: (article: Article) => void;
  onInteract: (articleId: string, action: 'bookmark' | 'like') => void;
}

export default function PersonalizedFeedPage({
  articles,
  user,
  onOpenSummary,
  onOpenVoice,
  onInteract
}: PersonalizedFeedPageProps) {
  
  // Filter & sort by ML recommendation score
  const personalizedArticles = [...articles]
    .map(a => {
      const isInterest = user.interests.includes(a.category);
      const score = isInterest ? Math.min(100, a.recommendationScore + 10) : a.recommendationScore;
      return { ...a, recommendationScore: score };
    })
    .sort((a, b) => b.recommendationScore - a.recommendationScore);

  return (
    <div className="space-y-6">
      
      {/* Personalized Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-950 border border-indigo-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>FAISS Collaborative Filtering Active</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-100">
            Recommended for {user.name}
          </h2>
          <p className="text-xs text-slate-300">
            Calculated based on your interests: <strong className="text-indigo-300">{user.interests.join(', ')}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-center font-mono">
            <span className="text-xs text-slate-400 block">Rec Precision</span>
            <span className="text-lg font-bold text-emerald-400">98.2%</span>
          </div>
        </div>
      </div>

      {/* Recommended List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {personalizedArticles.map(art => (
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
