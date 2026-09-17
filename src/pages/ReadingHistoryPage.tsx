import React from 'react';
import { History, Bookmark, Clock, Flame, ChevronRight } from 'lucide-react';
import { Article, UserProfile } from '../types';
import NewsCard from '../components/NewsCard';

interface ReadingHistoryPageProps {
  articles: Article[];
  user: UserProfile;
  mode: 'history' | 'saved';
  onOpenSummary: (article: Article) => void;
  onOpenVoice: (article: Article) => void;
  onInteract: (articleId: string, action: 'bookmark' | 'like') => void;
}

export default function ReadingHistoryPage({
  articles,
  user,
  mode,
  onOpenSummary,
  onOpenVoice,
  onInteract
}: ReadingHistoryPageProps) {
  
  const displayArticles = mode === 'saved' 
    ? articles.filter(a => a.isBookmarked) 
    : articles;

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
            {mode === 'saved' ? <Bookmark className="w-5 h-5" /> : <History className="w-5 h-5" />}
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">
              {mode === 'saved' ? 'Saved Articles & Reading List' : 'Reading History & Intelligence Activity'}
            </h2>
            <p className="text-xs text-slate-400">
              {mode === 'saved' ? 'Articles bookmarked for offline review and deep analysis.' : 'Your recent reading behavior used to fine-tune FAISS recommendation weights.'}
            </p>
          </div>
        </div>

        {/* User Reading Stats Pill Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] text-slate-500 font-medium block">Total Articles Read</span>
            <span className="text-base font-bold font-mono text-slate-100">{user.readingStats.totalArticlesRead}</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] text-slate-500 font-medium block">Minutes Spent</span>
            <span className="text-base font-bold font-mono text-indigo-400">{user.readingStats.totalMinutesSpent} min</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] text-slate-500 font-medium block">Daily Streak</span>
            <span className="text-base font-bold font-mono text-amber-400">{user.readingStats.streakDays} Days</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] text-slate-500 font-medium block">Top Category</span>
            <span className="text-base font-bold text-slate-100 truncate">{user.readingStats.favoriteCategory}</span>
          </div>
        </div>
      </div>

      {/* List */}
      {displayArticles.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl space-y-2">
          <p className="text-sm font-semibold text-slate-300">
            {mode === 'saved' ? 'No saved articles yet.' : 'No reading history logged.'}
          </p>
          <p className="text-xs text-slate-500">
            {mode === 'saved' ? 'Click the bookmark icon on any news card to save it for later.' : 'Start exploring headlines to build your reading history.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayArticles.map(art => (
            <NewsCard
              key={art.id}
              article={art}
              onOpenSummary={onOpenSummary}
              onOpenVoice={onOpenVoice}
              onInteract={onInteract}
            />
          ))}
        </div>
      )}

    </div>
  );
}
