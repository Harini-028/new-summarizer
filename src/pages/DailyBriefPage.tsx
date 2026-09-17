import React, { useState } from 'react';
import { Radio, Volume2, Play, Pause, Sparkles, TrendingUp, Calendar, ChevronRight } from 'lucide-react';
import { DailyBrief, Article } from '../types';
import NewsCard from '../components/NewsCard';

interface DailyBriefPageProps {
  brief: DailyBrief;
  onOpenSummary: (article: Article) => void;
  onOpenVoice: (article: Article) => void;
  onInteract: (articleId: string, action: 'bookmark' | 'like') => void;
}

export default function DailyBriefPage({
  brief,
  onOpenSummary,
  onOpenVoice,
  onInteract
}: DailyBriefPageProps) {
  const [isPlayingBrief, setIsPlayingBrief] = useState(false);

  const toggleBriefAudio = () => {
    if ('speechSynthesis' in window) {
      if (isPlayingBrief) {
        window.speechSynthesis.cancel();
        setIsPlayingBrief(false);
      } else {
        window.speechSynthesis.cancel();
        const text = `Morning AI Briefing for ${brief.date}. Key highlights: ${brief.keyHighlights.join('. ')}`;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onend = () => setIsPlayingBrief(false);
        window.speechSynthesis.speak(utterance);
        setIsPlayingBrief(true);
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Brief Header Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border border-indigo-500/30 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
              <Radio className="w-3.5 h-3.5 animate-pulse text-indigo-400" />
              <span>{brief.date} Edition</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold text-slate-100">{brief.title}</h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-xl">{brief.subtitle}</p>
          </div>

          <button
            onClick={toggleBriefAudio}
            className="px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-3 shadow-xl shadow-indigo-600/30 transition-transform hover:scale-105 shrink-0"
          >
            {isPlayingBrief ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            <span>{isPlayingBrief ? 'Pause Briefing' : 'Play Audio Briefing (3 min)'}</span>
          </button>
        </div>

        {/* Financial Markets Ticker Strip */}
        <div className="pt-4 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {brief.marketOverview.map((item, idx) => (
            <div key={idx} className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 font-medium block">{item.index}</span>
              <span className={`text-sm font-bold font-mono ${item.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                {item.change}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Key Highlights List */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          Executive Daily Highlights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {brief.keyHighlights.map((hl, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex items-start gap-3">
              <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-300 text-xs font-bold flex items-center justify-center shrink-0">
                0{idx + 1}
              </span>
              <p className="text-xs text-slate-200 leading-relaxed pt-0.5">{hl}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Top Stories in Briefing */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-100">Featured Briefing Articles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brief.topArticles.map(art => (
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

    </div>
  );
}
