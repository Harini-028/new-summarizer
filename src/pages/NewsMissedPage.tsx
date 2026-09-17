import React, { useState, useEffect } from 'react';
import { BookMarked, Flame, Clock, Sparkles, RefreshCw, Eye } from 'lucide-react';
import { Article, UserProfile } from '../types';
import NewsCard from '../components/NewsCard';

interface NewsMissedPageProps {
  user: UserProfile;
  onOpenSummary: (article: Article) => void;
  onOpenVoice: (article: Article) => void;
  onInteract: (id: string, action: 'bookmark' | 'like') => void;
}

export default function NewsMissedPage({ user, onOpenSummary, onOpenVoice, onInteract }: NewsMissedPageProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setIsLoading(true);
    const params = user ? `?userId=${user.id}&email=${encodeURIComponent(user.email)}` : '';
    fetch(`/api/news/missed${params}`)
      .then(r => r.json())
      .then(d => { setArticles(d.articles || []); setIsLoading(false); })
      .catch(() => setIsLoading(false));
  }, [user.id, refreshKey]);

  const hour = new Date().getHours();
  const timeGreeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-900/20 to-slate-900 border border-amber-500/20">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">News You Missed</h2>
              <p className="text-xs text-slate-400">Important stories ranked by relevance and impact that you haven't read yet</p>
            </div>
          </div>
          <button
            onClick={() => setRefreshKey(k => k + 1)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Stats strip */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          {[
            { label: 'Stories Missed', value: articles.length, color: 'text-amber-400', icon: <Eye className="w-3.5 h-3.5" /> },
            { label: 'Your Interests', value: (user.interests || []).length, color: 'text-indigo-400', icon: <Sparkles className="w-3.5 h-3.5" /> },
            { label: 'Articles Read', value: user.readingStats?.totalArticlesRead || 0, color: 'text-emerald-400', icon: <BookMarked className="w-3.5 h-3.5" /> },
          ].map((s, i) => (
            <div key={i} className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
              <div className={`flex items-center justify-center gap-1 ${s.color} mb-1`}>{s.icon}</div>
              <div className={`text-xl font-extrabold font-mono ${s.color}`}>{s.value}</div>
              <div className="text-[10px] text-slate-500">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 rounded-full border-4 border-amber-600/30 border-t-amber-400 animate-spin" />
        </div>
      )}

      {/* Articles */}
      {!isLoading && articles.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-bold text-slate-200">Catch Up on These Stories</span>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold border border-amber-500/30">{articles.length} stories</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {articles.map((article, idx) => (
              <div key={article.id || idx} className="relative">
                {idx < 3 && (
                  <div className="absolute -top-2 -left-2 z-10 w-7 h-7 rounded-full bg-amber-500 text-white text-[11px] font-extrabold flex items-center justify-center shadow-lg shadow-amber-900/50">
                    {idx + 1}
                  </div>
                )}
                <NewsCard
                  article={article}
                  onOpenSummary={onOpenSummary}
                  onOpenVoice={onOpenVoice}
                  onInteract={onInteract}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && articles.length === 0 && (
        <div className="p-12 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <BookMarked className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-200">You're All Caught Up!</h3>
            <p className="text-sm text-slate-400 mt-1 max-w-sm">You've read all the important articles. Check back later for new stories.</p>
          </div>
        </div>
      )}
    </div>
  );
}
