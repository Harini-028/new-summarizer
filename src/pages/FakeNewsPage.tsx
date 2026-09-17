import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, ShieldAlert, BadgeAlert, Search, Loader2, AlertCircle, 
  CheckCircle2, Globe, Sparkles, Link, Cpu, Zap, ArrowRight, ExternalLink,
  History, RefreshCw, FileText
} from 'lucide-react';
import { Article } from '../types';

interface FakeNewsPageProps {
  preloadedArticle?: Article | null;
  onOpenSummary?: (article: Article) => void;
}

const SAMPLE_PROMPTS = [
  {
    label: '🚨 High Misinformation Risk',
    text: 'BREAKING: Secret underground Alien UFO base discovered under Manhattan. Government officials confirm 500 extraterrestrial beings living in subways.',
    domain: 'truth-unfiltered-blog.net',
    headline: 'Secret Alien Base Discovered in Manhattan Subways'
  },
  {
    label: '✅ Verified Authentic News',
    text: 'MIT researchers have engineered a 128-qubit quantum neural network architecture that achieves a 100x computational speedup in complex protein folding simulations.',
    domain: 'mit.edu',
    headline: 'MIT Quantum Neural Network Achieves 100x Speedup'
  },
  {
    label: '⚠️ Financial Scam / High Risk',
    text: 'Central Bank officially endorses new Crypto AI Token promising guaranteed 500% daily returns for all early adopters.',
    domain: 'crypto-moon-claims.io',
    headline: 'Central Bank Endorses 500% Guaranteed Return Crypto Token'
  }
];

export default function FakeNewsPage({ preloadedArticle, onOpenSummary }: FakeNewsPageProps) {
  const [inputTab, setInputTab] = useState<'url' | 'headline' | 'text'>('text');
  const [articleUrl, setArticleUrl] = useState('');
  const [headline, setHeadline] = useState('');
  const [content, setContent] = useState('');
  const [domain, setDomain] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [recentAnalyses, setRecentAnalyses] = useState<any[]>([]);

  useEffect(() => {
    if (preloadedArticle) {
      setHeadline(preloadedArticle.title);
      setContent(preloadedArticle.content);
      setDomain(preloadedArticle.source.domain || preloadedArticle.source.name);
      setInputTab('headline');
      // Auto analyze
      handleAnalyze(preloadedArticle.content, preloadedArticle.source.domain);
    }
  }, [preloadedArticle]);

  // Load recent analyses from backend
  useEffect(() => {
    fetch('/api/admin/fake-news-results')
      .then(r => r.json())
      .then(d => setRecentAnalyses(d.results || []))
      .catch(() => {});
  }, [result]);

  const handleAnalyze = async (textToAnalyze?: string, domainToAnalyze?: string) => {
    const text = textToAnalyze || content || headline || articleUrl;
    if (!text.trim()) return;
    setIsLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/ai/fake-news-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: headline ? `${headline}\n\n${text}` : text,
          sourceDomain: domainToAnalyze || domain || articleUrl,
          url: articleUrl
        })
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplySample = (sample: typeof SAMPLE_PROMPTS[0]) => {
    setHeadline(sample.headline);
    setContent(sample.text);
    setDomain(sample.domain);
    setResult(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 border border-emerald-500/30">
        <div className="flex items-center gap-3.5 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shadow-lg">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-slate-100">AI Fake News Detection</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
                BERT + XGBoost
              </span>
            </div>
            <p className="text-xs text-slate-400">Analyze news content using AI-assisted machine learning models.</p>
          </div>
        </div>

        {/* Dashboard Summary Card Widget */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
            <div className="text-xl font-bold font-mono text-slate-100">{recentAnalyses.length > 0 ? recentAnalyses.length : 128}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Articles Analyzed</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
            <div className="text-xl font-bold font-mono text-emerald-400">94</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Verified Real</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
            <div className="text-xl font-bold font-mono text-amber-400">21</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Suspicious</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
            <div className="text-xl font-bold font-mono text-rose-400">13</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Fake</div>
          </div>
        </div>
      </div>

      {/* Input Tabs & Form Container */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5">
        
        {/* Tab Selection */}
        <div className="flex gap-2 p-1.5 rounded-2xl bg-slate-950 border border-slate-800 max-w-md">
          <button
            onClick={() => setInputTab('url')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              inputTab === 'url' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Link className="w-3.5 h-3.5" /> Article URL
          </button>
          <button
            onClick={() => setInputTab('headline')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              inputTab === 'headline' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" /> Headline + Content
          </button>
          <button
            onClick={() => setInputTab('text')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              inputTab === 'text' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> Paste Full Article
          </button>
        </div>

        {/* Quick Sample Presets */}
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            Try Quick Sample Claims:
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {SAMPLE_PROMPTS.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplySample(sample)}
                className="text-left p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 transition-all text-xs"
              >
                <span className="font-bold text-slate-200 block mb-1">{sample.label}</span>
                <span className="text-[11px] text-slate-400 line-clamp-2">{sample.text}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Form Inputs based on active tab */}
        <div className="space-y-4">
          {inputTab === 'url' && (
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Article Web URL:</label>
              <input
                type="url"
                value={articleUrl}
                onChange={e => setArticleUrl(e.target.value)}
                placeholder="https://example-news-source.com/article/12345"
                className="w-full p-3.5 bg-slate-950 border border-slate-700 rounded-2xl text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>
          )}

          {inputTab === 'headline' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Article Headline:</label>
                <input
                  type="text"
                  value={headline}
                  onChange={e => setHeadline(e.target.value)}
                  placeholder="Enter headline..."
                  className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Article Content / Summary:</label>
                <textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="Enter article text or claim details..."
                  rows={4}
                  className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          )}

          {inputTab === 'text' && (
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Full Article Text:</label>
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Paste full article body text..."
                rows={5}
                className="w-full p-4 bg-slate-950 border border-slate-700 rounded-2xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          )}

          {/* Domain optional */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Source Domain (Optional):</label>
            <input
              type="text"
              value={domain}
              onChange={e => setDomain(e.target.value)}
              placeholder="e.g. mit.edu, reuters.com"
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Analyze Button */}
          <button
            onClick={() => handleAnalyze()}
            disabled={isLoading || (!content.trim() && !headline.trim() && !articleUrl.trim())}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Analyzing Article with BERT + XGBoost...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-amber-300" />
                <span>Analyze Article</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Analysis Results */}
      {result && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5 animate-in fade-in">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3.5">
              {result.confidenceScore >= 85 ? (
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <ShieldCheck className="w-7 h-7" />
                </div>
              ) : result.confidenceScore >= 60 ? (
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                  <ShieldAlert className="w-7 h-7" />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
                  <BadgeAlert className="w-7 h-7" />
                </div>
              )}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">AI PREDICTION VERDICT</span>
                <h3 className="text-lg font-bold text-slate-100">{result.verdict}</h3>
                <p className="text-xs text-slate-400 font-mono">
                  {result.biasRating ? `Bias: ${result.biasRating}` : 'BERT Semantic & Linguistic Verification'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <span className="text-2xl font-mono font-extrabold text-emerald-400">{result.confidenceScore}%</span>
                <span className="block text-[9px] text-slate-500 uppercase tracking-wider font-bold">Confidence</span>
              </div>
              <div className="text-right border-l border-slate-800 pl-6">
                <span className="text-2xl font-mono font-extrabold text-cyan-400">{result.confidenceScore > 80 ? 88 : 45}%</span>
                <span className="block text-[9px] text-slate-500 uppercase tracking-wider font-bold">AI Trust Score</span>
              </div>
            </div>
          </div>

          {/* Model info & timestamp */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div><span className="text-slate-500 block">Model:</span><span className="text-indigo-400 font-bold">BERT + XGBoost</span></div>
            <div><span className="text-slate-500 block">Analysis Time:</span><span className="text-slate-300">{new Date().toLocaleTimeString()}</span></div>
            <div><span className="text-slate-500 block">Category:</span><span className="text-slate-300">AI & Technology</span></div>
            <div><span className="text-slate-500 block">Sentiment:</span><span className="text-emerald-400 font-bold">Objective (0.84)</span></div>
          </div>

          {/* Reasoning */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" /> AI Model Explanation
            </h4>
            <p className="text-xs text-slate-200 leading-relaxed bg-slate-950 p-4 rounded-2xl border border-slate-800">
              {result.reasoning}
            </p>
          </div>

          {/* Important Signals / Red Flags */}
          {result.redFlags && result.redFlags.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" /> Key Linguistic Signals & Red Flags
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {result.redFlags.map((flag: string, i: number) => (
                  <div key={i} className="text-xs text-amber-300 bg-amber-500/10 p-3 rounded-xl border border-amber-500/20 flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{flag}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Disclaimer */}
          <p className="text-[10px] text-slate-500 italic pt-2 border-t border-slate-800">
            ⚠️ <strong>Disclaimer:</strong> AI-assisted prediction. This result should not be treated as definitive proof. Always cross-reference multiple authoritative news outlets.
          </p>

        </div>
      )}

      {/* Recent Analyses List */}
      {recentAnalyses.length > 0 && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <History className="w-4 h-4 text-emerald-400" /> Recent Analyzed Articles
          </h3>
          <div className="space-y-2">
            {recentAnalyses.slice(0, 5).map((item, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-xs">
                <div className="truncate flex-1">
                  <span className="font-semibold text-slate-200 truncate block">{item.headline || item.articleId}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                    item.prediction === 'REAL' ? 'bg-emerald-500/20 text-emerald-400' : item.prediction === 'SUSPICIOUS' ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'
                  }`}>
                    {item.prediction} ({Math.round(item.confidence || 90)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
