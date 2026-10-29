import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Brain, Save, Send, X, AlertCircle, CheckCircle2, 
  Image as ImageIcon, Tag, Globe, User, Calendar, Clock, Flame, 
  Star, RefreshCw, FileText, Upload, Plus, Trash2
} from 'lucide-react';
import { Article } from '../../types';
import { NEWS_CATEGORIES, DEFAULT_FALLBACK_IMAGE } from '../../data/categories';

interface AdminAddNewsFormProps {
  articleToEdit?: Article | null;
  onSuccess: (savedArticle: Article, msg: string) => void;
  onCancel: () => void;
  onToast: (msg: string) => void;
}

export const AdminAddNewsForm: React.FC<AdminAddNewsFormProps> = ({
  articleToEdit,
  onSuccess,
  onCancel,
  onToast
}) => {
  const [title, setTitle] = useState(articleToEdit?.title || '');
  const [description, setDescription] = useState(articleToEdit?.excerpt || '');
  const [content, setContent] = useState(articleToEdit?.content || '');
  const [author, setAuthor] = useState(articleToEdit?.author || 'Editorial Board');
  const [category, setCategory] = useState<string>(articleToEdit?.category || 'Technology');
  const [language, setLanguage] = useState<string>(articleToEdit?.language || 'en');
  const [tags, setTags] = useState<string>(
    articleToEdit?.entities?.keywords?.join(', ') || 'AI, Technology, Innovation'
  );
  const [imageUrl, setImageUrl] = useState<string>(articleToEdit?.imageUrl || articleToEdit?.featuredImage || '');
  const [sourceName, setSourceName] = useState<string>(articleToEdit?.source?.name || 'Chronicle Wire');
  const [sourceUrl, setSourceUrl] = useState<string>(articleToEdit?.sourceUrl || (articleToEdit?.source?.domain ? `https://${articleToEdit.source.domain}` : ''));
  
  // Date & Time
  const now = new Date();
  const defaultDate = now.toISOString().split('T')[0];
  const defaultTime = now.toTimeString().split(' ')[0].substring(0, 5);
  
  const [publishedDate, setPublishedDate] = useState<string>(
    articleToEdit?.publishedAt ? new Date(articleToEdit.publishedAt).toISOString().split('T')[0] : defaultDate
  );
  const [publishedTime, setPublishedTime] = useState<string>(
    articleToEdit?.publishedAt ? new Date(articleToEdit.publishedAt).toTimeString().split(' ')[0].substring(0, 5) : defaultTime
  );

  const [status, setStatus] = useState<'draft' | 'published'>((articleToEdit as any)?.status || 'published');
  const [isBreaking, setIsBreaking] = useState<boolean>(!!articleToEdit?.isBreaking);
  const [isFeatured, setIsFeatured] = useState<boolean>(!!articleToEdit?.isFeatured);
  
  // AI Summary State
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiBullets, setAiBullets] = useState<string[]>(
    articleToEdit?.aiSummary?.bulletPoints || [
      'Verified intelligence update based on primary sources',
      'Synthesized by Chronicle AI neural news processing pipeline'
    ]
  );
  const [aiParagraph, setAiParagraph] = useState<string>(articleToEdit?.aiSummary?.paragraph || '');
  const [aiTakeaway, setAiTakeaway] = useState<string>(articleToEdit?.aiSummary?.keyTakeaway || '');
  const [showAiEditor, setShowAiEditor] = useState<boolean>(!!articleToEdit?.aiSummary);

  // States
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [imagePreviewError, setImagePreviewError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setImagePreviewError(false);
  }, [imageUrl]);

  const token = localStorage.getItem('chronicle_admin_token') || 
                localStorage.getItem('chronicle_token') || 
                sessionStorage.getItem('chronicle_admin_token') || 
                sessionStorage.getItem('chronicle_token');

  // Handle local image file upload -> Base64
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Image file size must be less than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Str = event.target?.result as string;
      setImageUrl(base64Str);
      onToast('Local image attached successfully as featured media.');
    };
    reader.readAsDataURL(file);
  };

  // Generate AI Summary on-demand
  const handleGenerateAiSummary = async () => {
    setAiError(null);
    if (!content.trim() || content.trim().length < 20) {
      setAiError('Please enter at least 20 characters of article content first.');
      return;
    }

    setAiLoading(true);
    try {
      const res = await fetch('/api/admin/ai/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          title: title.trim() || 'News Dispatch',
          content: content.trim(),
          language
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'AI Summarization service temporarily unavailable.');
      }

      if (data.summary) {
        setAiBullets(data.summary.bulletPoints || []);
        setAiParagraph(data.summary.paragraph || '');
        setAiTakeaway(data.summary.keyTakeaway || '');
        setShowAiEditor(true);
        onToast('AI Summary generated successfully.');
      }
    } catch (err: any) {
      setAiError(err.message || 'AI service unavailable. You can enter or edit summary manually.');
      setShowAiEditor(true);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (submitStatus?: 'draft' | 'published') => {
    setErrorMsg(null);
    const finalStatus = submitStatus || status;

    // Validation
    if (!title.trim() || title.trim().length < 3) {
      setErrorMsg('News Title is required and must be at least 3 characters.');
      return;
    }
    if (!content.trim() || content.trim().length < 10) {
      setErrorMsg('Article Content is required and must be at least 10 characters.');
      return;
    }
    if (!author.trim()) {
      setErrorMsg('Author name is required.');
      return;
    }
    if (!sourceName.trim()) {
      setErrorMsg('Source name is required.');
      return;
    }

    setIsLoading(true);

    const payload = {
      title: title.trim(),
      description: description.trim() || title.trim(),
      content: content.trim(),
      author: author.trim(),
      category,
      language,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      imageUrl: imageUrl.trim() || DEFAULT_FALLBACK_IMAGE,
      featuredImage: imageUrl.trim() || DEFAULT_FALLBACK_IMAGE,
      sourceName: sourceName.trim(),
      sourceUrl: sourceUrl.trim(),
      publishedDate,
      publishedTime,
      status: finalStatus,
      isBreaking,
      isFeatured,
      sourceType: 'admin',
      aiSummary: showAiEditor ? {
        bulletPoints: aiBullets.filter(b => b.trim().length > 0),
        paragraph: aiParagraph.trim() || description.trim(),
        keyTakeaway: aiTakeaway.trim()
      } : undefined
    };

    try {
      const isEditing = !!articleToEdit?.id;
      const endpoint = isEditing ? `/api/admin/news/${articleToEdit.id}` : '/api/admin/news';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save news article.');
      }

      const successText = finalStatus === 'published'
        ? (isEditing ? 'News article updated and published successfully.' : 'News article published successfully.')
        : (isEditing ? 'News article updated as draft.' : 'News article saved as draft.');

      onSuccess(data.article, successText);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error occurred while saving article.');
      onToast(err.message || 'Error occurred while saving article.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-4xl mx-auto shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              {articleToEdit ? 'Edit News Article' : 'Add New Article'}
            </h2>
            <p className="text-xs text-slate-400">
              Create, synthesize, and publish verified articles to the Chronicle AI news feed
            </p>
          </div>
        </div>

        <button
          onClick={onCancel}
          disabled={isLoading}
          className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Form Content */}
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
        
        {/* Section 1: News Information */}
        <div className="space-y-4">
          <div className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
            <span>1. Core Article Metadata</span>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">
              News Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Breakthrough in Neuromorphic Supercomputing Accelerates Real-Time AI"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 text-sm font-semibold"
              required
            />
          </div>

          {/* Short Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">
              Short Description / Excerpt
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Crisp 1-2 sentence preview for dashboards, landing page, and social feeds..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 text-xs"
            />
          </div>

          {/* Category, Language, Author, Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                Category <span className="text-rose-400">*</span>
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500 text-xs font-mono cursor-pointer"
              >
                {NEWS_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
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
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500 text-xs font-mono cursor-pointer"
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

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                Author <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={author}
                onChange={e => setAuthor(e.target.value)}
                placeholder="e.g. Dr. Maya Lin"
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 text-xs"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                Tags
              </label>
              <input
                type="text"
                value={tags}
                onChange={e => setTags(e.target.value)}
                placeholder="AI, Silicon, Edge"
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 text-xs"
              />
            </div>
          </div>

          {/* Source Name & Source URL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                News Source <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={sourceName}
                onChange={e => setSourceName(e.target.value)}
                placeholder="e.g. MIT Technology Review"
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 text-xs"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                Source URL
              </label>
              <input
                type="text"
                value={sourceUrl}
                onChange={e => setSourceUrl(e.target.value)}
                placeholder="https://technologyreview.com/..."
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 text-xs font-mono"
              />
            </div>
          </div>

          {/* Featured Image URL & Local Upload */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
                Featured Image (URL or Upload)
              </span>
              <span className="text-[10px] text-slate-500 font-normal">Supports URL or local image upload</span>
            </label>
            <div className="flex flex-col sm:flex-row gap-3 items-start">
              <input
                type="text"
                value={imageUrl}
                onChange={e => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/... or upload below"
                className="flex-1 w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 text-xs font-mono"
              />

              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageFileUpload}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold font-mono flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-indigo-400" />
                <span>Upload File</span>
              </button>

              <div className="w-20 h-11 rounded-xl border border-slate-800 overflow-hidden bg-slate-950 shrink-0 relative">
                <img
                  src={imagePreviewError || !imageUrl ? DEFAULT_FALLBACK_IMAGE : imageUrl}
                  alt="Preview"
                  onError={() => setImagePreviewError(true)}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Full Article Content */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">
              Full Article Content <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={8}
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Paste or write the full article content here..."
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 text-xs leading-relaxed"
              required
            />
          </div>
        </div>

        {/* Section 2: Optional AI-Generated Summary */}
        <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-mono font-bold text-indigo-300 uppercase tracking-wider">
                2. AI News Summarization
              </span>
            </div>

            <button
              type="button"
              onClick={handleGenerateAiSummary}
              disabled={aiLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 hover:text-white text-xs font-mono font-bold transition-all cursor-pointer disabled:opacity-50"
            >
              {aiLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
                  <span>Generate with Gemini</span>
                </>
              )}
            </button>
          </div>

          {aiError && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{aiError}</span>
            </div>
          )}

          {showAiEditor && (
            <div className="space-y-3 pt-2 border-t border-indigo-500/20">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300">Executive Summary Paragraph</label>
                <textarea
                  rows={2}
                  value={aiParagraph}
                  onChange={e => setAiParagraph(e.target.value)}
                  placeholder="Concise overview generated by AI..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-slate-300">Key Takeaway Bullets</label>
                  <button
                    type="button"
                    onClick={() => setAiBullets([...aiBullets, 'Additional takeaway point'])}
                    className="text-[10px] font-mono text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Point</span>
                  </button>
                </div>

                {aiBullets.map((b, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-xs text-indigo-400 font-mono font-bold w-4">{i + 1}.</span>
                    <input
                      type="text"
                      value={b}
                      onChange={e => {
                        const copy = [...aiBullets];
                        copy[i] = e.target.value;
                        setAiBullets(copy);
                      }}
                      className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => setAiBullets(aiBullets.filter((_, idx) => idx !== i))}
                      className="p-1.5 text-slate-500 hover:text-rose-400 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300">Single Essential Takeaway</label>
                <input
                  type="text"
                  value={aiTakeaway}
                  onChange={e => setAiTakeaway(e.target.value)}
                  placeholder="One sentence essential takeaway..."
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Section 3: Publication & Delivery Options */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
          <div className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">
            3. Publication & Delivery Options
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Publication Date
              </label>
              <input
                type="date"
                value={publishedDate}
                onChange={e => setPublishedDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 text-xs font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Publication Time
              </label>
              <input
                type="time"
                value={publishedTime}
                onChange={e => setPublishedTime(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 text-xs font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                Status <span className="text-rose-400">*</span>
              </label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as 'draft' | 'published')}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 text-xs font-mono focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          {/* Breaking & Featured Switches */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800/80">
            {/* Breaking Switch */}
            <div
              onClick={() => setIsBreaking(!isBreaking)}
              className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                isBreaking ? 'bg-rose-500/10 border-rose-500/40' : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-xl ${isBreaking ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Breaking News</div>
                  <div className="text-[10px] text-slate-400">Pushes urgent alert badge & ticker</div>
                </div>
              </div>

              <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold ${
                isBreaking ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-400'
              }`}>
                {isBreaking ? 'ON' : 'OFF'}
              </span>
            </div>

            {/* Featured Switch */}
            <div
              onClick={() => setIsFeatured(!isFeatured)}
              className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                isFeatured ? 'bg-purple-500/10 border-purple-500/40' : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-xl ${isFeatured ? 'bg-purple-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                  <Star className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Featured Article</div>
                  <div className="text-[10px] text-slate-400">Highlights in hero showcase</div>
                </div>
              </div>

              <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold ${
                isFeatured ? 'bg-purple-500 text-white' : 'bg-slate-800 text-slate-400'
              }`}>
                {isFeatured ? 'ON' : 'OFF'}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              disabled={isLoading}
              onClick={() => handleSubmit('draft')}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs transition-all cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4 text-slate-400" />
              <span>Save Draft</span>
            </button>

            <button
              type="button"
              disabled={isLoading}
              onClick={() => handleSubmit('published')}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-950/50 transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Publish Article</span>
                </>
              )}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
};
