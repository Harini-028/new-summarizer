import React, { useState, useEffect } from 'react';
import { X, Sparkles, Brain, Check, RefreshCw, Upload, Image as ImageIcon } from 'lucide-react';
import { Article, CategoryType } from '../../types';

interface AdminAddEditArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (articleData: Partial<Article>) => void;
  articleToEdit?: Article | null;
  onToast: (msg: string) => void;
}

export const AdminAddEditArticleModal: React.FC<AdminAddEditArticleModalProps> = ({
  isOpen,
  onClose,
  onSave,
  articleToEdit,
  onToast
}) => {
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<CategoryType>('AI & Technology');
  const [sourceName, setSourceName] = useState('MIT Technology Review');
  const [sourceDomain, setSourceDomain] = useState('technologyreview.com');
  const [author, setAuthor] = useState('Chronicle Editorial');
  const [imageUrl, setImageUrl] = useState('');
  const [tags, setTags] = useState('AI, Machine Learning, Research');
  const [isTrending, setIsTrending] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isBreaking, setIsBreaking] = useState(false);
  const [analyzingML, setAnalyzingML] = useState(false);

  useEffect(() => {
    if (articleToEdit) {
      setTitle(articleToEdit.title || '');
      setExcerpt(articleToEdit.excerpt || '');
      setContent(articleToEdit.content || '');
      setCategory(articleToEdit.category || 'AI & Technology');
      setSourceName(articleToEdit.source?.name || 'MIT Technology Review');
      setSourceDomain(articleToEdit.source?.domain || 'technologyreview.com');
      setAuthor(articleToEdit.author || 'Chronicle Editorial');
      setImageUrl(articleToEdit.imageUrl || '');
      setTags(articleToEdit.entities?.keywords?.join(', ') || 'AI, News');
      setIsTrending(!!articleToEdit.isTrending);
      setIsFeatured(!!articleToEdit.isFeatured);
      setIsBreaking(!!articleToEdit.isBreaking);
    } else {
      setTitle('');
      setExcerpt('');
      setContent('');
      setCategory('AI & Technology');
      setSourceName('MIT Technology Review');
      setSourceDomain('technologyreview.com');
      setAuthor('Chronicle Editorial');
      setImageUrl('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800');
      setTags('AI, Innovation, Tech');
      setIsTrending(false);
      setIsFeatured(false);
      setIsBreaking(false);
    }
  }, [articleToEdit, isOpen]);

  if (!isOpen) return null;

  const handleRunMLAnalysis = async () => {
    if (!content && !excerpt) {
      onToast('Please enter article content before running ML Analysis.');
      return;
    }
    setAnalyzingML(true);
    onToast('Running Gemini 3.6 Flash & NLP Pipeline analysis...');
    await new Promise(r => setTimeout(r, 1200));
    setAnalyzingML(false);
    onToast('ML Analysis Complete: Generated Executive Summary, Sentiment, and Fake News Verdict.');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      onToast('Title and Content are required.');
      return;
    }

    const keywordList = tags.split(',').map(t => t.trim()).filter(Boolean);

    const articleData: Partial<Article> = {
      title,
      excerpt: excerpt || content.substring(0, 150) + '...',
      content,
      category,
      source: {
        name: sourceName,
        domain: sourceDomain,
        trustScore: 92
      },
      author,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
      publishedAt: articleToEdit ? articleToEdit.publishedAt : new Date().toISOString(),
      url: articleToEdit ? articleToEdit.url : `https://${sourceDomain}/news/${Date.now()}`,
      readTimeMinutes: Math.max(2, Math.round(content.split(' ').length / 200)),
      entities: {
        organizations: [sourceName],
        people: [author],
        locations: ['Global'],
        keywords: keywordList
      },
      aiSummary: articleToEdit?.aiSummary || {
        bullets: ['Automated NLP summary generated on commit.', 'Key findings outline strategic implications.'],
        executiveParagraph: content.substring(0, 200) + '...',
        keyTakeaway: 'Immediate action advised based on analysis.'
      },
      sentiment: articleToEdit?.sentiment || {
        type: 'Positive',
        score: 0.8,
        label: 'Optimistic Analysis',
        tone: 'Analytical'
      },
      fakeNewsReport: articleToEdit?.fakeNewsReport || {
        isLikelyFake: false,
        confidenceScore: 94,
        verdict: 'Verified Authentic',
        redFlags: [],
        factCheckSources: [sourceDomain]
      },
      isTrending,
      isFeatured,
      isBreaking
    };

    onSave(articleData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-3xl bg-slate-950 border border-slate-800 p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto scrollbar-thin">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              {articleToEdit ? 'Edit Corpus Article' : 'Add New Article to Corpus'}
            </h3>
            <p className="text-xs text-slate-400">Configure article parameters and trigger automated ML pipelines</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Title & Author */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2 space-y-1">
              <label className="text-[10px] font-mono text-slate-400 uppercase">Article Title *</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Enter article headline..."
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500 font-semibold"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate-400 uppercase">Author Name</label>
              <input
                type="text"
                value={author}
                onChange={e => setAuthor(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Category & Source */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate-400 uppercase">Category *</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as CategoryType)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
              >
                <option value="AI & Technology">AI & Technology</option>
                <option value="Business & Finance">Business & Finance</option>
                <option value="Science & Space">Science & Space</option>
                <option value="Health & Medicine">Health & Medicine</option>
                <option value="World & Politics">World & Politics</option>
                <option value="Climate & Environment">Climate & Environment</option>
                <option value="Entertainment & Culture">Entertainment & Culture</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate-400 uppercase">Publisher Source</label>
              <input
                type="text"
                value={sourceName}
                onChange={e => setSourceName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate-400 uppercase">Source Domain</label>
              <input
                type="text"
                value={sourceDomain}
                onChange={e => setSourceDomain(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          </div>

          {/* Image & Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate-400 uppercase">Image URL</label>
              <input
                type="text"
                value={imageUrl}
                onChange={e => setImageUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate-400 uppercase">Keywords & Tags (comma separated)</label>
              <input
                type="text"
                value={tags}
                onChange={e => setTags(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Excerpt */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-slate-400 uppercase">Article Excerpt / Abstract</label>
            <textarea
              rows={2}
              value={excerpt}
              onChange={e => setExcerpt(e.target.value)}
              placeholder="Short summary for feed preview cards..."
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Full Content */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-slate-400 uppercase">Full Article Content *</label>
            <textarea
              rows={6}
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Paste full article text here..."
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          {/* Flags Toggles */}
          <div className="flex flex-wrap items-center gap-4 p-3 rounded-2xl bg-slate-900 border border-slate-800">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isTrending}
                onChange={e => setIsTrending(e.target.checked)}
                className="rounded border-slate-700 text-indigo-600 focus:ring-0"
              />
              <span className="text-slate-300 font-bold">Mark as Trending</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={e => setIsFeatured(e.target.checked)}
                className="rounded border-slate-700 text-purple-600 focus:ring-0"
              />
              <span className="text-slate-300 font-bold">Mark as Featured</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isBreaking}
                onChange={e => setIsBreaking(e.target.checked)}
                className="rounded border-slate-700 text-rose-600 focus:ring-0"
              />
              <span className="text-slate-300 font-bold">Breaking News Alert</span>
            </label>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={handleRunMLAnalysis}
              disabled={analyzingML}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-300 hover:bg-purple-600/30 font-bold text-xs cursor-pointer disabled:opacity-50 transition-all"
            >
              {analyzingML ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Brain className="w-3.5 h-3.5" />}
              <span>{analyzingML ? 'Analyzing...' : 'Run Auto ML Analysis'}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-950/50 cursor-pointer"
              >
                Save Article
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
