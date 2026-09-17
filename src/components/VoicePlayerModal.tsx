import React, { useState } from 'react';
import {
  X, Play, Pause, Square, SkipBack, SkipForward,
  Volume2, VolumeX, RotateCcw, Mic, ChevronDown,
  Sparkles, BookOpen, ShieldCheck, ListMusic, Trash2
} from 'lucide-react';
import { useVoicePlayer, ReadingMode } from '../context/VoicePlayerContext';

export default function VoicePlayerModal() {
  const {
    playlist, currentIdx, currentArticle, isPlaying, isGeneratingSpeech,
    playbackSpeed, volume, voiceName, readingMode, audioProgress,
    currentTime, duration, isMinimized,
    togglePlayPause, stop, next, prev, seek,
    setPlaybackSpeed, setVolume, setVoiceName, setReadingMode,
    removeFromQueue, minimize, close, playArticle
  } = useVoicePlayer();

  const [showQueue, setShowQueue] = useState(false);

  // Only render when there is an article loaded and the player is maximized
  if (!currentArticle || isMinimized) return null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const remainingTime = Math.max(0, duration - currentTime);

  const SPEEDS = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];
  const nextSpeed = () => {
    const idx = SPEEDS.indexOf(playbackSpeed);
    setPlaybackSpeed(SPEEDS[(idx + 1) % SPEEDS.length]);
  };

  const readingModes: { mode: ReadingMode; label: string; icon: React.ReactNode }[] = [
    { mode: 'summary', label: 'AI Summary', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { mode: 'detailed', label: 'Full Briefing', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { mode: 'fakeNewsExplanation', label: 'Fact-Check', icon: <ShieldCheck className="w-3.5 h-3.5" /> }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">

        {/* Top accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-indigo-600 via-purple-500 to-cyan-500" />

        <div className="p-6 space-y-5">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                <Mic className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-100">AI Voice Player</h3>
                <p className="text-[10px] text-slate-400">Web Speech TTS Engine</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowQueue(v => !v)}
                className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-colors ${showQueue ? 'bg-indigo-600/20 border-indigo-500/30 text-indigo-400' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
                title="Queue"
              >
                <ListMusic className="w-3.5 h-3.5" />
                <span className="text-[10px] font-mono">{playlist.length}</span>
              </button>
              <button onClick={minimize} className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white" title="Minimize">
                <ChevronDown className="w-4 h-4" />
              </button>
              <button onClick={close} className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white" title="Close">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Queue Panel */}
          {showQueue && (
            <div className="rounded-2xl bg-slate-950 border border-slate-800 p-3 space-y-2 max-h-44 overflow-y-auto">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Play Queue ({playlist.length})</p>
              {playlist.length === 0 && (
                <p className="text-xs text-slate-500 italic">Queue is empty.</p>
              )}
              {playlist.map((art, idx) => (
                <div
                  key={art.id}
                  onClick={() => playArticle(art, playlist)}
                  className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-colors ${idx === currentIdx ? 'bg-indigo-600/20 border border-indigo-500/20' : 'hover:bg-slate-800'}`}
                >
                  <img src={art.imageUrl} alt={art.title} className="w-8 h-8 rounded-lg object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold text-slate-200 line-clamp-1">{art.title}</p>
                    <p className="text-[10px] text-slate-400">{art.source.name}</p>
                  </div>
                  {idx !== currentIdx && (
                    <button
                      onClick={(e) => { e.stopPropagation(); removeFromQueue(art.id); }}
                      className="text-slate-600 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {idx === currentIdx && (
                    <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-wider">Now</span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Article Info */}
          <div className="flex items-center gap-4 p-3 rounded-2xl bg-slate-950 border border-slate-800">
            <img
              src={currentArticle.imageUrl}
              alt={currentArticle.title}
              className="w-16 h-16 rounded-xl object-cover shrink-0"
            />
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">{currentArticle.category}</span>
              <h4 className="text-sm font-bold text-slate-100 line-clamp-2 leading-snug">{currentArticle.title}</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">{currentArticle.source.name}</p>
            </div>
          </div>

          {/* Reading Mode Selector */}
          <div className="flex items-center gap-2">
            {readingModes.map(({ mode, label, icon }) => (
              <button
                key={mode}
                onClick={() => setReadingMode(mode)}
                className={`flex-1 py-1.5 px-2 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all border ${readingMode === mode ? 'bg-indigo-600/20 border-indigo-500/30 text-indigo-300' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'}`}
              >
                {icon}{label}
              </button>
            ))}
          </div>

          {/* Sound Wave Visualizer */}
          <div className="py-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center gap-2">
            <div className="flex items-center gap-1 h-10">
              {[40, 75, 20, 90, 55, 30, 100, 70, 45, 90, 30, 80, 50, 90, 60, 25, 70, 40].map((h, i) => (
                <div
                  key={i}
                  className={`w-1 rounded-full bg-gradient-to-t from-indigo-600 to-cyan-400 transition-all duration-150 ${isPlaying ? '' : 'opacity-30'}`}
                  style={{
                    height: isPlaying ? `${Math.max(12, h * (i % 2 === 0 ? 1 : 0.7))}%` : '15%',
                    animationDelay: `${i * 50}ms`
                  }}
                />
              ))}
            </div>
            <p className="text-[10px] font-mono text-slate-400">
              {isGeneratingSpeech ? 'Initializing...' : isPlaying ? 'Synthesizing voice stream...' : 'Paused'}
            </p>
          </div>

          {/* Seek Bar */}
          <div className="space-y-1.5">
            <input
              type="range"
              min="0"
              max="100"
              step="0.5"
              value={audioProgress}
              onChange={(e) => seek(parseFloat(e.target.value))}
              className="w-full h-1.5 accent-indigo-500 bg-slate-800 rounded-full appearance-none cursor-pointer"
            />
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
              <span>{formatTime(currentTime)}</span>
              <span>-{formatTime(remainingTime)}</span>
            </div>
          </div>

          {/* Main Controls */}
          <div className="flex items-center justify-between">

            {/* Speed */}
            <button
              onClick={nextSpeed}
              className="w-10 h-10 rounded-xl bg-slate-800 text-slate-300 text-xs font-mono hover:bg-slate-700 transition-colors"
              title="Toggle speed"
            >
              {playbackSpeed}x
            </button>

            {/* Prev */}
            <button
              onClick={prev}
              disabled={currentIdx <= 0}
              className="p-2.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
            >
              <SkipBack className="w-5 h-5" />
            </button>

            {/* Play / Pause */}
            <button
              onClick={togglePlayPause}
              disabled={isGeneratingSpeech}
              className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-xl shadow-indigo-600/30 hover:scale-105 transition-transform disabled:opacity-60"
            >
              {isGeneratingSpeech
                ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : isPlaying
                  ? <Pause className="w-6 h-6" />
                  : <Play className="w-6 h-6 ml-0.5" />
              }
            </button>

            {/* Next */}
            <button
              onClick={next}
              disabled={currentIdx >= playlist.length - 1}
              className="p-2.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
            >
              <SkipForward className="w-5 h-5" />
            </button>

            {/* Stop */}
            <button
              onClick={stop}
              className="w-10 h-10 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors flex items-center justify-center"
              title="Stop"
            >
              <Square className="w-4 h-4 fill-current" />
            </button>
          </div>

          {/* Voice + Volume */}
          <div className="flex items-center justify-between gap-4 pt-1 border-t border-slate-800">

            {/* Voice selector */}
            <div className="flex items-center gap-1 flex-wrap">
              <span className="text-[10px] text-slate-500 font-medium mr-1">Voice:</span>
              {(['Kore', 'Puck', 'Zephyr', 'Fenrir'] as const).map(v => (
                <button
                  key={v}
                  onClick={() => setVoiceName(v)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${voiceName === v ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'}`}
                >
                  {v}
                </button>
              ))}
            </div>

            {/* Volume */}
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => setVolume(volume > 0 ? 0 : 0.8)}>
                {volume === 0 ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-slate-400" />}
              </button>
              <input
                type="range" min="0" max="1" step="0.05"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-20 h-1 accent-indigo-500 appearance-none cursor-pointer"
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
