import React, { useState, useEffect, useRef } from 'react';
import { X, Minus, Plus, Moon, Sun, AlignLeft, Clock, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import { Article } from '../types';

interface ReadingModeModalProps {
  article: Article | null;
  onClose: () => void;
}

type FontSize = 'sm' | 'md' | 'lg' | 'xl';
type Theme = 'dark' | 'sepia' | 'light';

const fontSizeMap: Record<FontSize, string> = { sm: 'text-sm', md: 'text-base', lg: 'text-lg', xl: 'text-xl' };
const fontSizeLabelMap: Record<FontSize, string> = { sm: '14px', md: '16px', lg: '18px', xl: '20px' };
const lineHeightMap: Record<FontSize, string> = { sm: 'leading-7', md: 'leading-8', lg: 'leading-9', xl: 'leading-10' };

const themeMap: Record<Theme, { bg: string; text: string; card: string; toolbar: string; border: string }> = {
  dark: { bg: 'bg-[#0a0a0a]', text: 'text-slate-200', card: 'bg-[#111]', toolbar: 'bg-[#0a0a0a]/95 border-white/10', border: 'border-white/10' },
  sepia: { bg: 'bg-[#f4e8d0]', text: 'text-[#3d2c1a]', card: 'bg-[#ebe0c8]', toolbar: 'bg-[#f4e8d0]/95 border-[#c4a882]/30', border: 'border-[#c4a882]/30' },
  light: { bg: 'bg-white', text: 'text-slate-800', card: 'bg-slate-50', toolbar: 'bg-white/95 border-slate-200', border: 'border-slate-200' },
};

export default function ReadingModeModal({ article, onClose }: ReadingModeModalProps) {
  const [fontSize, setFontSize] = useState<FontSize>('md');
  const [theme, setTheme] = useState<Theme>('dark');
  const [readProgress, setReadProgress] = useState(0);
  const [estimatedRemaining, setEstimatedRemaining] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (article) {
      setReadProgress(0);
      setEstimatedRemaining(article.readTimeMinutes);
    }
  }, [article]);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      const progress = Math.min(100, (scrollTop / (scrollHeight - clientHeight)) * 100);
      setReadProgress(Math.round(progress));
      const remaining = Math.max(0, Math.round(((100 - progress) / 100) * (article?.readTimeMinutes || 5)));
      setEstimatedRemaining(remaining);
    };
    const el = containerRef.current;
    el?.addEventListener('scroll', handleScroll);
    return () => el?.removeEventListener('scroll', handleScroll);
  }, [article]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!article) return null;
  const tc = themeMap[theme];
  const sizes: FontSize[] = ['sm', 'md', 'lg', 'xl'];
  const currentSizeIdx = sizes.indexOf(fontSize);

  return (
    <div className="fixed inset-0 z-[200] flex flex-col" style={{ background: theme === 'dark' ? '#0a0a0a' : theme === 'sepia' ? '#f4e8d0' : 'white' }}>
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 z-[201] bg-transparent">
        <div className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-300"
          style={{ width: `${readProgress}%` }} />
      </div>

      {/* Toolbar */}
      <div className={`flex items-center justify-between px-6 py-3 border-b ${tc.toolbar} backdrop-blur-md sticky top-0 z-[201]`}>
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 transition-all">
            <X className={`w-4 h-4 ${tc.text}`} />
          </button>
          <div className={`text-[10px] font-semibold ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>
            READING MODE
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Font size */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-black/10">
            <button onClick={() => setFontSize(sizes[Math.max(0, currentSizeIdx - 1)])}
              disabled={currentSizeIdx === 0}
              className={`p-1.5 rounded-lg transition-all disabled:opacity-30 ${tc.text}`}>
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className={`text-[10px] font-mono font-bold w-8 text-center ${tc.text}`}>{fontSizeLabelMap[fontSize]}</span>
            <button onClick={() => setFontSize(sizes[Math.min(sizes.length - 1, currentSizeIdx + 1)])}
              disabled={currentSizeIdx === sizes.length - 1}
              className={`p-1.5 rounded-lg transition-all disabled:opacity-30 ${tc.text}`}>
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Theme toggle */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-black/10">
            {(['dark', 'sepia', 'light'] as Theme[]).map(t => (
              <button key={t} onClick={() => setTheme(t)}
                className={`p-1.5 rounded-lg transition-all ${theme === t ? 'bg-indigo-600 text-white' : tc.text + ' hover:bg-white/10'}`}
                title={t.charAt(0).toUpperCase() + t.slice(1)}>
                {t === 'dark' ? <Moon className="w-3.5 h-3.5" /> : t === 'light' ? <Sun className="w-3.5 h-3.5" /> : <AlignLeft className="w-3.5 h-3.5" />}
              </button>
            ))}
          </div>

          {/* Reading stats */}
          <div className={`flex items-center gap-2 text-[10px] font-mono ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>
            <Clock className="w-3 h-3" />
            <span>{estimatedRemaining}min left</span>
            <span>·</span>
            <span>{readProgress}% read</span>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div ref={containerRef} className={`flex-1 overflow-y-auto ${tc.bg}`}>
        <div className="max-w-2xl mx-auto px-6 py-10">
          {/* Article header */}
          <div className="mb-8 space-y-4">
            <span className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-widest">{article.category}</span>
            <h1 className={`text-2xl font-extrabold ${tc.text} leading-tight`}>{article.title}</h1>

            <div className={`flex items-center gap-3 text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>
              <span className="font-semibold">{article.author}</span>
              <span>·</span>
              <span>{article.source.name}</span>
              <span>·</span>
              <span><BookOpen className="w-3 h-3 inline mr-1" />{article.readTimeMinutes} min read</span>
              <span>·</span>
              <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
            </div>

            {/* Article image */}
            <img src={article.imageUrl} alt={article.title}
              className="w-full h-64 object-cover rounded-2xl" />
          </div>

          {/* AI Summary callout */}
          <div className={`p-4 rounded-2xl border ${tc.border} ${tc.card} mb-8`}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-wider">AI Key Takeaway</span>
            </div>
            <p ref={null} className={`text-sm italic ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'} leading-relaxed`}>
              {article.aiSummary.keyTakeaway}
            </p>
          </div>

          {/* Content */}
          <div ref={contentRef}>
            {article.content.split('\n\n').map((para, i) => (
              <p key={i} className={`mb-6 ${fontSizeMap[fontSize]} ${lineHeightMap[fontSize]} ${tc.text} ${theme !== 'dark' ? 'text-opacity-90' : ''}`}>
                {para}
              </p>
            ))}
          </div>

          {/* Article footer */}
          <div className={`mt-12 pt-8 border-t ${tc.border}`}>
            <div className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'} space-y-1`}>
              <p>Source: <strong>{article.source.name}</strong> — Trust Score: {article.source.trustScore}/100</p>
              <p>Keywords: {article.entities.keywords.join(', ')}</p>
            </div>
          </div>

          {/* Completion */}
          {readProgress >= 95 && (
            <div className="mt-8 p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
              <div className="text-2xl mb-2">✅</div>
              <p className="text-sm font-bold text-emerald-400">Article Complete!</p>
              <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                Great reading! This has been logged to your history.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
