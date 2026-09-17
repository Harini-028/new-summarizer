import React from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  SkipForward, 
  SkipBack, 
  Sparkles,
  ChevronUp
} from 'lucide-react';
import { useVoicePlayer } from '../context/VoicePlayerContext';

export default function VoicePlayerMini() {
  const {
    currentArticle,
    isPlaying,
    audioProgress,
    currentTime,
    duration,
    playbackSpeed,
    volume,
    readingMode,
    isMinimized,
    togglePlayPause,
    stop,
    next,
    prev,
    setVolume,
    setPlaybackSpeed,
    setReadingMode,
    maximize,
    close
  } = useVoicePlayer();

  // Do not render anything if there is no article loaded
  if (!currentArticle) return null;

  // Render nothing if maximized
  if (!isMinimized) return null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const getReadingModeLabel = () => {
    if (readingMode === 'detailed') return 'Detailed Briefing';
    if (readingMode === 'fakeNewsExplanation') return 'AI Misinfo explanation';
    return 'Summary Briefing';
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-4 animate-in slide-in-from-bottom duration-300">
      <div className="max-w-5xl mx-auto bg-slate-900/95 border border-slate-800 text-slate-100 rounded-2xl shadow-2xl backdrop-blur-md overflow-hidden">
        
        {/* Top Progress bar */}
        <div className="w-full bg-slate-800 h-1">
          <div 
            className="bg-indigo-500 h-full transition-all duration-300"
            style={{ width: `${audioProgress}%` }}
          />
        </div>

        <div className="p-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Article Info */}
          <div className="flex items-center gap-3 w-full md:w-1/3 min-w-0">
            <img 
              src={currentArticle.imageUrl} 
              alt={currentArticle.title} 
              className="w-11 h-11 rounded-lg object-cover border border-slate-800 shrink-0" 
            />
            <div className="min-w-0 flex-1">
              <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-wider block">
                {currentArticle.category} • {getReadingModeLabel()}
              </span>
              <h4 
                onClick={maximize} 
                className="text-xs font-bold text-slate-100 line-clamp-1 hover:text-indigo-400 transition-colors cursor-pointer"
              >
                {currentArticle.title}
              </h4>
              <p className="text-[10px] text-slate-400 line-clamp-1">{currentArticle.source.name}</p>
            </div>
          </div>

          {/* Primary Controls */}
          <div className="flex items-center justify-center gap-4 w-full md:w-1/3">
            <button 
              onClick={prev} 
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-200"
              title="Previous Article"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button 
              onClick={togglePlayPause}
              className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 hover:scale-105 transition-transform"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>

            <button 
              onClick={stop} 
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-200"
              title="Stop Playback"
            >
              <Square className="w-4 h-4 fill-current" />
            </button>

            <button 
              onClick={next} 
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-200"
              title="Next Article"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            <span className="text-[10px] font-mono text-slate-400 select-none">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          {/* Configuration / Options Controls */}
          <div className="flex items-center justify-end gap-4 w-full md:w-1/3">
            
            {/* Speed selection */}
            <button 
              onClick={() => setPlaybackSpeed(playbackSpeed === 1.0 ? 1.25 : playbackSpeed === 1.25 ? 1.5 : playbackSpeed === 1.5 ? 2.0 : 1.0)}
              className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono hover:bg-slate-700"
              title="Change speed rate"
            >
              {playbackSpeed}x
            </button>

            {/* Volume slider */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setVolume(volume > 0 ? 0 : 0.8)}
                className="text-slate-400 hover:text-slate-200"
              >
                {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.1" 
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-16 accent-indigo-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Maximize detailed view */}
            <button 
              onClick={maximize} 
              className="p-2 rounded-lg bg-indigo-900/40 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-900/60 hover:text-indigo-300 transition-colors flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider"
              title="Maximize player modal"
            >
              <ChevronUp className="w-3.5 h-3.5" />
              <span>Player</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
