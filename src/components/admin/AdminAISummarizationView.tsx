import React, { useState } from 'react';
import { Sparkles, Brain, Save, RefreshCw, AlertCircle, CheckCircle2, FileText, Globe, Plus, Trash2 } from 'lucide-react';
import { Article } from '../../types';

interface AdminAISummarizationViewProps {
  articles: Article[];
  onArticleUpdated?: (updated: Article) => void;
  onToast: (msg: string) => void;
}

export const AdminAISummarizationView: React.FC<AdminAISummarizationViewProps> = ({
  articles,
  onArticleUpdated,
  onToast
}) => {
  const [selectedArticleId, setSelectedArticleId] = useState<string>(articles[0]?.id || '');
  const [customText, setCustomText] = useState('');
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Editable Summary State
  const [bullets, setBullets] = useState<string[]>([
    'Key finding or highlight from the intelligence report',
    'Secondary consequence and market or societal impact',
    'Strategic outlook and future development trajectory'
  ]);
  const [paragraph, setParagraph] = useState<string>('');
  const [takeaway, setTakeaway] = useState<string>('');
  const [isGenerated, setIsGenerated] = useState<boolean>(false);

  const token = localStorage.getItem('chronicle_admin_token') || 
                localStorage.getItem('chronicle_token') || 
                sessionStorage.getItem('chronicle_admin_token') || 
                sessionStorage.getItem('chronicle_token');

  const selectedArticle = articles.find(a => a.id === selectedArticleId || (a as any)._id === selectedArticleId);

  // Sync article content when selected
  const handleSelectArticle = (id: string) => {
    setSelectedArticleId(id);
    const art = articles.find(a => a.id === id || (a as any)._id === id);
    if (art) {
      if (art.aiSummary) {
        setBullets(art.aiSummary.bulletPoints || []);
        setParagraph(art.aiSummary.paragraph || art.excerpt || '');
        setTakeaway(art.aiSummary.keyTakeaway || '');
        setIsGenerated(true);
      } else {
        setParagraph(art.excerpt || '');
        setIsGenerated(false);
      }
    }
  };

  const handleGenerateSummary = async () => {
    setErrorMsg(null);
    const textToSummarize = selectedArticle ? selectedArticle.content : customText;
    const title = selectedArticle ? selectedArticle.title : 'Custom News Dispatch';

    if (!textToSummarize || textToSummarize.trim().length < 20) {
      setErrorMsg('Please select an article or provide at least 20 characters of article text.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/admin/ai/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          title,
          content: textToSummarize,
          language
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'AI Summarization service temporarily unavailable.');
      }

      if (data.summary) {
        setBullets(data.summary.bulletPoints || []);
        setParagraph(data.summary.paragraph || '');
        setTakeaway(data.summary.keyTakeaway || '');
        setIsGenerated(true);
        onToast('AI Summary successfully generated!');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'AI service unavailable. You can compose and edit the summary manually below.');
      setIsGenerated(true); // Allow manual editing
    } finally {
      setLoading(false);
    }
  };

  const handleAddBullet = () => {
    setBullets([...bullets, 'New key takeaway point']);
  };

  const handleUpdateBullet = (index: number, val: string) => {
    const updated = [...bullets];
    updated[index] = val;
    setBullets(updated);
  };

  const handleRemoveBullet = (index: number) => {
    setBullets(bullets.filter((_, i) => i !== index));
  };

  const handleSaveToArticle = async () => {
    if (!selectedArticle) {
      onToast('Please select a valid article from the database to save.');
      return;
    }

    setLoading(true);
    try {
      const updatedSummary = {
        bulletPoints: bullets.filter(b => b.trim().length > 0),
        paragraph: paragraph.trim(),
        keyTakeaway: takeaway.trim()
      };

      const res = await fetch(`/api/admin/news/${selectedArticle.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          title: selectedArticle.title,
          content: selectedArticle.content,
          category: selectedArticle.category,
          author: selectedArticle.author,
          aiSummary: updatedSummary
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save updated summary to database.');

      if (onArticleUpdated && data.article) {
        onArticleUpdated(data.article);
      }
      onToast(`Summary persisted to MongoDB for "${selectedArticle.title.substring(0, 30)}..."`);
    } catch (err: any) {
      onToast(err.message || 'Error updating article in database.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">AI News Summarization Workbench</h2>
            <p className="text-xs text-slate-400">
              Generate, audit, customize, and persist executive bullet points & takeaways via Gemini
            </p>
          </div>
        </div>
      </div>

      {/* Select Source Article */}
      <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
        <div className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">
          1. Select Article & Synthesis Options
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Choose News Article from Database</label>
            <select
              value={selectedArticleId}
              onChange={e => handleSelectArticle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs font-mono focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="">-- Choose an article or enter custom text below --</option>
              {articles.map(art => (
                <option key={art.id} value={art.id}>
                  [{art.category}] {art.title.substring(0, 70)}...
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              Language
            </label>
            <select
              value={language}
              onChange={e => setLanguage(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs font-mono focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="en">English (en)</option>
              <option value="es">Spanish (es)</option>
              <option value="fr">French (fr)</option>
              <option value="de">German (de)</option>
              <option value="zh">Chinese (zh)</option>
              <option value="ja">Japanese (ja)</option>
              <option value="hi">Hindi (hi)</option>
            </select>
          </div>
        </div>

        {!selectedArticle && (
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Or Paste Raw News Content to Summarize</label>
            <textarea
              rows={4}
              value={customText}
              onChange={e => setCustomText(e.target.value)}
              placeholder="Paste article body text here..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-indigo-500 placeholder:text-slate-600"
            />
          </div>
        )}

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            onClick={handleGenerateSummary}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold font-mono transition-all cursor-pointer disabled:opacity-50 shadow-lg shadow-indigo-950/50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Generating Summary...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate AI Summary</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Editable Summary Review & Customization */}
      <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-5">
        <div className="flex items-center justify-between">
          <div className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
            <span>2. Review, Edit & Save Summary</span>
            {isGenerated && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px]">
                Ready for Review
              </span>
            )}
          </div>

          {selectedArticle && (
            <button
              onClick={handleSaveToArticle}
              disabled={loading}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold font-mono transition-all cursor-pointer disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save to MongoDB</span>
            </button>
          )}
        </div>

        {/* Executive Paragraph */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300">Executive Summary Paragraph</label>
          <textarea
            rows={3}
            value={paragraph}
            onChange={e => setParagraph(e.target.value)}
            placeholder="Executive summary of the intelligence dispatch..."
            className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-indigo-500 placeholder:text-slate-600"
          />
        </div>

        {/* Bullet Points */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-300">Key Intelligence Takeaways (Bullet Points)</label>
            <button
              onClick={handleAddBullet}
              className="flex items-center gap-1 text-[11px] font-mono text-indigo-400 hover:text-indigo-300 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Bullet</span>
            </button>
          </div>

          <div className="space-y-2">
            {bullets.map((b, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-xs text-indigo-400 font-mono font-bold w-5">{idx + 1}.</span>
                <input
                  type="text"
                  value={b}
                  onChange={e => handleUpdateBullet(idx, e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={() => handleRemoveBullet(idx)}
                  className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Single Key Takeaway */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300">Single Essential Takeaway</label>
          <input
            type="text"
            value={takeaway}
            onChange={e => setTakeaway(e.target.value)}
            placeholder="e.g. Breakthrough brings scalable neuromorphic supercomputing to consumer datacenters within 18 months."
            className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-indigo-500 placeholder:text-slate-600"
          />
        </div>
      </div>
    </div>
  );
};
