import React from 'react';
import { Mic, Volume2, Play, Sparkles } from 'lucide-react';
import { Article } from '../types';

interface VoiceSummaryPageProps {
  articles: Article[];
  onOpenVoice: (article: Article) => void;
  onOpenSummary: (article: Article) => void;
}

export default function VoiceSummaryPage({
  articles,
  onOpenVoice,
  onOpenSummary
}: VoiceSummaryPageProps) {
  return (
    <div className="space-y-6">
      
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
        <div className="flex items-center gap-2">
          <Mic className="w-5 h-5 text-indigo-400" />
          <h2 className="text-lg font-bold text-slate-100">AI Voice Playlist & Audio Summaries</h2>
        </div>
        <p className="text-xs text-slate-400">
          Listen to clear AI-synthesized briefings powered by Gemini 3.1 Flash Speech models while commuting or multitasking.
        </p>
      </div>

      <div className="space-y-3">
        {articles.map((art, idx) => (
          <div
            key={art.id}
            onClick={() => onOpenVoice(art)}
            className="group p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4 min-w-0">
              <span className="text-xs font-mono font-bold text-slate-500 shrink-0">0{idx + 1}</span>
              <img src={art.imageUrl} alt={art.title} className="w-16 h-16 rounded-xl object-cover shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">{art.category}</span>
                <h3 className="text-sm font-bold text-slate-100 group-hover:text-indigo-300 transition-colors line-clamp-1">{art.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-1">{art.aiSummary.keyTakeaway}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
              <span className="text-xs text-slate-400 font-mono">{art.readTimeMinutes}m audio</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenVoice(art);
                }}
                className="p-3 rounded-full bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-transform group-hover:scale-105"
              >
                <Play className="w-4 h-4 ml-0.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
