import React from 'react';
import { TrendingUp, Eye, Heart, Bookmark, ArrowUpRight, Sparkles, Shield } from 'lucide-react';
import { Article } from '../../types';

interface AdminTrendingViewProps {
  articles: Article[];
  onToggleTrending: (id: string) => void;
  onToast: (msg: string) => void;
}

export const AdminTrendingView: React.FC<AdminTrendingViewProps> = ({ articles, onToggleTrending, onToast }) => {
  const trendingList = articles
    .map(a => {
      const score = (a.viewsCount || 0) * 0.5 + (a.likesCount || 0) * 2 + (a.bookmarksCount || 0) * 3;
      return { ...a, engagementScore: Math.round(score) };
    })
    .sort((a, b) => b.engagementScore - a.engagementScore)
    .slice(0, 10);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-500/15 text-rose-400 flex items-center justify-center border border-rose-500/20">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">Trending News & Engagement Algorithm Manager</h2>
            <p className="text-xs text-slate-400">Dynamic engagement rankings computed from user page views, likes, and bookmark saves</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {trendingList.map((art, rank) => (
          <div key={art.id} className="p-4 rounded-3xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center font-mono font-bold text-rose-400 text-sm">
                #{rank + 1}
              </div>
              <div className="space-y-0.5">
                <h3 className="text-xs font-bold text-white line-clamp-1">{art.title}</h3>
                <div className="text-[10px] text-slate-500 font-mono">
                  {art.source.name} • Category: <span className="text-indigo-400">{art.category}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs shrink-0 font-mono">
              <div className="text-right">
                <div className="font-extrabold text-indigo-400">{art.engagementScore.toLocaleString()}</div>
                <div className="text-[9px] text-slate-500 uppercase">Engagement Score</div>
              </div>

              <div className="text-right">
                <div className="font-extrabold text-slate-200">{(art.viewsCount || 0).toLocaleString()}</div>
                <div className="text-[9px] text-slate-500 uppercase">Views</div>
              </div>

              <button
                onClick={() => {
                  onToggleTrending(art.id);
                  onToast(`Updated trending rank for "${art.title.substring(0, 25)}..."`);
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-rose-500 text-slate-300 font-bold text-[11px] cursor-pointer"
              >
                Promote / Demote
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
