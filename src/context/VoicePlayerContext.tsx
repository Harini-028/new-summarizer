import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Article } from '../types';

export type ReadingMode = 'summary' | 'detailed' | 'fakeNewsExplanation';

interface VoicePlayerContextType {
  playlist: Article[];
  currentIdx: number;
  currentArticle: Article | null;
  isPlaying: boolean;
  isGeneratingSpeech: boolean;
  playbackSpeed: number;
  volume: number;
  voiceName: 'Kore' | 'Puck' | 'Zephyr' | 'Fenrir';
  readingMode: ReadingMode;
  audioProgress: number; // 0 to 100
  currentTime: number; // in seconds
  duration: number; // in seconds
  isMinimized: boolean;
  playArticle: (article: Article, list?: Article[]) => void;
  togglePlayPause: () => void;
  stop: () => void;
  next: () => void;
  prev: () => void;
  seek: (percent: number) => void;
  setPlaybackSpeed: (speed: number) => void;
  setVolume: (vol: number) => void;
  setVoiceName: (voice: 'Kore' | 'Puck' | 'Zephyr' | 'Fenrir') => void;
  setReadingMode: (mode: ReadingMode) => void;
  addToQueue: (article: Article) => void;
  removeFromQueue: (articleId: string) => void;
  clearQueue: () => void;
  maximize: () => void;
  minimize: () => void;
  close: () => void;
}

const VoicePlayerContext = createContext<VoicePlayerContextType | undefined>(undefined);

export function VoicePlayerProvider({ children }: { children: React.ReactNode }) {
  const [playlist, setPlaylist] = useState<Article[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isGeneratingSpeech, setIsGeneratingSpeech] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeedState] = useState<number>(1.0);
  const [volume, setVolumeState] = useState<number>(0.8);
  const [voiceName, setVoiceNameState] = useState<'Kore' | 'Puck' | 'Zephyr' | 'Fenrir'>('Kore');
  const [readingMode, setReadingModeState] = useState<ReadingMode>('summary');
  
  // Progress/Timing
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isMinimized, setIsMinimized] = useState<boolean>(true);

  // Synth Utterance Ref
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);
  const timerRef = useRef<number | null>(null);
  const textOffsetRef = useRef<number>(0); // Store index of the current speech slice

  const currentArticle = currentIdx >= 0 && currentIdx < playlist.length ? playlist[currentIdx] : null;

  // Generate TTS Audio Speech Text based on the reading mode
  const getAudioTextForArticle = (article: Article, mode: ReadingMode): string => {
    const title = article.title || 'Untitled Article';
    const source = article.source?.name || 'Chronicle Wire';
    const summary = article.aiSummary?.executiveParagraph || 'No summary overview provided.';
    const takeaway = article.aiSummary?.keyTakeaway || 'No key takeaway listed.';
    const bullets = article.aiSummary?.bullets?.join(' ') || '';

    if (mode === 'detailed') {
      return `Detailed report: ${title}. Sourced from ${source}. ${summary}. Highlight details: ${bullets}. Key Takeaway: ${takeaway}`;
    }
    if (mode === 'fakeNewsExplanation') {
      const isFake = article.fakeNewsReport?.isLikelyFake || article.source?.trustScore < 70;
      const verdict = isFake ? 'High Misinformation Risk' : 'Verified Authentic';
      const explanation = article.aiSummary?.keyTakeaway || 'Continuous monitoring advised.';
      return `Misinformation audit report for: ${title}. Verdict: ${verdict}. Explanation: The article exhibits ${verdict} patterns. AI analysis notes: ${explanation}`;
    }
    // Default summary mode
    return `Briefing summary: ${title}. Sourced from ${source}. ${summary}`;
  };

  const currentText = currentArticle ? getAudioTextForArticle(currentArticle, readingMode) : '';

  // Calculate duration based on average word count reading speed (e.g. 150 words per minute / 2.5 words per second)
  useEffect(() => {
    if (!currentText) {
      setDuration(0);
      setCurrentTime(0);
      return;
    }
    const words = currentText.split(/\s+/).length;
    const computedDuration = Math.max(5, Math.round(words / 2.2)); // Roughly 2.2 words per second
    setDuration(computedDuration);
    setCurrentTime(0);
    textOffsetRef.current = 0;
  }, [currentText]);

  // Handle active speech interval progress timer
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = window.setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            // Speech finished naturally
            if (timerRef.current) clearInterval(timerRef.current);
            return duration;
          }
          return prev + 1;
        });
      }, 1000 / playbackSpeed);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, duration, playbackSpeed]);

  // Stop current speech on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speakTextSegment = (textToSpeak: string, startFromOffset: boolean = false) => {
    if (!('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel();
    setIsGeneratingSpeech(true);

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.volume = volume;
    utterance.rate = playbackSpeed;

    // Load custom voices if available
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      // Pick generic language matching voices if possible
      const targetVoice = voices.find(v => v.name.includes(voiceName)) || voices.find(v => v.lang.startsWith('en'));
      if (targetVoice) utterance.voice = targetVoice;
    }

    utterance.onstart = () => {
      setIsGeneratingSpeech(false);
      setIsPlaying(true);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      // Auto play next article if queue has more items
      if (currentIdx < playlist.length - 1) {
        setTimeout(() => {
          next();
        }, 1000);
      } else {
        stop();
      }
    };

    utterance.onerror = (e) => {
      console.error('SpeechSynthesis error:', e);
      setIsGeneratingSpeech(false);
      setIsPlaying(false);
    };

    synthRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const playArticle = (article: Article, list?: Article[]) => {
    let nextList = [...playlist];
    if (list) {
      nextList = list;
      setPlaylist(list);
    } else {
      // If article not in playlist, add it
      const exists = playlist.some((a) => a.id === article.id);
      if (!exists) {
        nextList = [...playlist, article];
        setPlaylist(nextList);
      }
    }

    const idx = nextList.findIndex((a) => a.id === article.id);
    setCurrentIdx(idx);
    setIsMinimized(false); // Maximize the detail modal on play trigger
    
    // Reset offset and begin speaking
    textOffsetRef.current = 0;
    setCurrentTime(0);
    
    const textToSpeak = getAudioTextForArticle(article, readingMode);
    speakTextSegment(textToSpeak);
  };

  const togglePlayPause = () => {
    if (!currentArticle || !('speechSynthesis' in window)) return;

    if (isPlaying) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
    } else {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        setIsPlaying(true);
      } else {
        // Start from last remaining offset or complete text
        const textLength = currentText.length;
        const charOffset = Math.floor(textLength * (currentTime / duration));
        const remainingText = currentText.substring(charOffset);
        speakTextSegment(remainingText, true);
      }
    }
  };

  const stop = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const next = () => {
    if (playlist.length === 0) return;
    const nextIdx = currentIdx + 1;
    if (nextIdx < playlist.length) {
      setCurrentIdx(nextIdx);
      setCurrentTime(0);
      textOffsetRef.current = 0;
      const nextArt = playlist[nextIdx];
      const textToSpeak = getAudioTextForArticle(nextArt, readingMode);
      speakTextSegment(textToSpeak);
    }
  };

  const prev = () => {
    if (playlist.length === 0) return;
    const prevIdx = currentIdx - 1;
    if (prevIdx >= 0) {
      setCurrentIdx(prevIdx);
      setCurrentTime(0);
      textOffsetRef.current = 0;
      const prevArt = playlist[prevIdx];
      const textToSpeak = getAudioTextForArticle(prevArt, readingMode);
      speakTextSegment(textToSpeak);
    }
  };

  const seek = (percent: number) => {
    if (!currentArticle) return;
    const targetSec = Math.floor(duration * (percent / 100));
    setCurrentTime(targetSec);

    // Stop current speech, slice text and start playing from slice offset
    const charOffset = Math.floor(currentText.length * (percent / 100));
    const textSegment = currentText.substring(charOffset);
    
    if (isPlaying) {
      speakTextSegment(textSegment, true);
    }
  };

  const setPlaybackSpeed = (speed: number) => {
    setPlaybackSpeedState(speed);
    if (isPlaying && currentArticle) {
      // Re-trigger speech with updated rate
      const charOffset = Math.floor(currentText.length * (currentTime / duration));
      const remainingText = currentText.substring(charOffset);
      speakTextSegment(remainingText, true);
    }
  };

  const setVolume = (vol: number) => {
    setVolumeState(vol);
    if (synthRef.current) {
      synthRef.current.volume = vol;
    }
  };

  const setVoiceName = (voice: 'Kore' | 'Puck' | 'Zephyr' | 'Fenrir') => {
    setVoiceNameState(voice);
    if (isPlaying && currentArticle) {
      const charOffset = Math.floor(currentText.length * (currentTime / duration));
      const remainingText = currentText.substring(charOffset);
      speakTextSegment(remainingText, true);
    }
  };

  const setReadingMode = (mode: ReadingMode) => {
    setReadingModeState(mode);
    // Restart audio for current article with the new text mode
    if (currentArticle) {
      setCurrentTime(0);
      const textToSpeak = getAudioTextForArticle(currentArticle, mode);
      speakTextSegment(textToSpeak);
    }
  };

  const addToQueue = (article: Article) => {
    setPlaylist((prev) => {
      if (prev.some((a) => a.id === article.id)) return prev;
      return [...prev, article];
    });
  };

  const removeFromQueue = (articleId: string) => {
    setPlaylist((prev) => prev.filter((a) => a.id !== articleId));
  };

  const clearQueue = () => {
    stop();
    setPlaylist([]);
    setCurrentIdx(-1);
  };

  const maximize = () => setIsMinimized(false);
  const minimize = () => setIsMinimized(true);
  const close = () => {
    stop();
    setCurrentIdx(-1);
    setIsMinimized(true);
  };

  const audioProgress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <VoicePlayerContext.Provider
      value={{
        playlist,
        currentIdx,
        currentArticle,
        isPlaying,
        isGeneratingSpeech,
        playbackSpeed,
        volume,
        voiceName,
        readingMode,
        audioProgress,
        currentTime,
        duration,
        isMinimized,
        playArticle,
        togglePlayPause,
        stop,
        next,
        prev,
        seek,
        setPlaybackSpeed,
        setVolume,
        setVoiceName,
        setReadingMode,
        addToQueue,
        removeFromQueue,
        clearQueue,
        maximize,
        minimize,
        close
      }}
    >
      {children}
    </VoicePlayerContext.Provider>
  );
}

export function useVoicePlayer() {
  const context = useContext(VoicePlayerContext);
  if (!context) {
    throw new Error('useVoicePlayer must be used within a VoicePlayerProvider');
  }
  return context;
}
