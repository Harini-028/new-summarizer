import React from 'react';
import { X, ShieldAlert, CheckCircle2, Brain, Sparkles, Eye, Heart, Bookmark, Share2 } from 'lucide-react';
import { Article } from '../../types';

interface AdminArticleDetailModalProps {
  article: Article | null;
  onClose: () => void;
}

export const AdminArticleDetailModal: React.FC<AdminArticleDetailModalProps> = ({ article, onClose }) => {
  if (!article) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-3xl bg-slate-950 border border-slate-800 p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto scrollbar-thin">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div className="space-y-1 pr-6">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
              {article.category}
            </span>
            <h3 className="text-lg font-extrabold text-white leading-snug">{article.title}</h3>
            <div className="text-xs text-slate-400 font-mono">
              Publisher: {article.source.name} • Author: {article.author} • {new Date(article.publishedAt).toLocaleDateString()}
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800 shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* AI & ML Models Inspection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Fake News Report */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="text-[10px] font-mono text-slate-400 uppercase font-bold flex items-center justify-between">
              <span>Fake News Verdict</span>
              <span className="text-indigo-400">BERT + XGBoost</span>
            </div>
            <div className={`text-base font-extrabold font-mono ${article.fakeNewsReport?.isLikelyFake ? 'text-rose-400' : 'text-emerald-400'}`}>
              {article.fakeNewsReport?.verdict || 'Verified Authentic'}
            </div>
            <div className="text-[10px] text-slate-500 font-mono">
              Confidence Score: {article.fakeNewsReport?.confidenceScore || 92}%
            </div>
          </div>

          {/* Sentiment Analysis */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="text-[10px] font-mono text-slate-400 uppercase font-bold flex items-center justify-between">
              <span>Sentiment Polarity</span>
              <span className="text-indigo-400">RoBERTa</span>
            </div>
            <div className="text-base font-extrabold font-mono text-indigo-300">
              {article.sentiment?.type} ({article.sentiment?.score})
            </div>
            <div className="text-[10px] text-slate-500 font-mono">
              Tone: {article.sentiment?.tone || 'Analytical'}
            </div>
          </div>

          {/* Engagement Metrics */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">User Engagement</div>
            <div className="text-base font-extrabold font-mono text-emerald-400">
              {(article.viewsCount || 0).toLocaleString()} views
            </div>
            <div className="text-[10px] text-slate-500 font-mono">
              {article.likesCount || 0} Likes • {article.bookmarksCount || 0} Bookmarks
            </div>
          </div>
        </div>

        {/* AI Summary Section */}
        {article.aiSummary && (
          <div className="p-4 rounded-2xl bg-slate-900 border border-indigo-500/20 space-y-3">
            <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider font-mono flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Executive AI Summary (Gemini 3.6 Flash)
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed italic bg-slate-950 p-3 rounded-xl border border-slate-800">
              "{article.aiSummary.executiveParagraph}"
            </p>
            {article.aiSummary.bullets?.length > 0 && (
              <ul className="space-y-1 list-disc list-inside text-xs text-slate-400">
                {article.aiSummary.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Article Full Text */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Full Body Text</h4>
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed max-h-48 overflow-y-auto scrollbar-thin">
            {article.content}
          </div>
        </div>
      </div>
    </div>
  );
};
