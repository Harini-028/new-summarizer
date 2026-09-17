import React, { useState, useRef } from 'react';
import { 
  X, Sparkles, Volume2, ShieldCheck, ShieldAlert, Brain, ExternalLink, 
  Bookmark, Heart, Loader2, CheckCircle2, AlertTriangle, BookOpen,
  Zap, MessageSquare, ChevronRight, ChevronDown, Copy, Check,
  Lightbulb, Users, TrendingUp, Hash, Flag
} from 'lucide-react';
import { Article } from '../types';

interface AISummaryModalProps {
  article: Article | null;
  onClose: () => void;
  onOpenVoice: (article: Article) => void;
  onInteract: (articleId: string, action: 'bookmark' | 'like') => void;
  onDiscussWithAI?: (article: Article) => void;
  onOpenReadingMode?: (article: Article) => void;
}

type ModalTab = 'summary' | 'insights' | 'simplify' | 'qa' | 'impact' | 'sentiment' | 'factcheck' | 'full';

const SIMPLIFY_LEVELS = [
  { id: 'simple', label: 'ELI5', description: 'Explain Like I\'m 5', color: 'from-pink-500 to-rose-500' },
  { id: 'student', label: 'Student', description: 'High School Level', color: 'from-amber-500 to-orange-500' },
  { id: 'professional', label: 'Pro', description: 'Business Executive', color: 'from-indigo-500 to-violet-500' },
  { id: 'expert', label: 'Expert', description: 'Domain Specialist', color: 'from-emerald-500 to-teal-500' },
];

const SUGGESTED_QUESTIONS = [
  'Who are the main people or organizations involved?',
  'What is the most important takeaway from this article?',
  'What are the potential long-term consequences?',
  'Are there any alternative viewpoints not covered here?',
  'What should I do or know as a result of this news?',
];

export default function AISummaryModal({
  article, onClose, onOpenVoice, onInteract, onDiscussWithAI, onOpenReadingMode
}: AISummaryModalProps) {
  const [activeTab, setActiveTab] = useState<ModalTab>('summary');
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [liveSummary, setLiveSummary] = useState<any>(null);

  // Key Insights state
  const [keyInsights, setKeyInsights] = useState<any>(null);
  const [insightsLoading, setInsightsLoading] = useState(false);

  // Simplify state
  const [simplifyLevel, setSimplifyLevel] = useState<string>('professional');
  const [simplifiedText, setSimplifiedText] = useState<Record<string, string>>({});
  const [simplifyLoading, setSimplifyLoading] = useState(false);
  const [copiedSimplify, setCopiedSimplify] = useState(false);

  // Q&A state
  const [qaQuestion, setQaQuestion] = useState('');
  const [qaAnswer, setQaAnswer] = useState<any>(null);
  const [qaLoading, setQaLoading] = useState(false);
  const [qaHistory, setQaHistory] = useState<{ q: string; a: any }[]>([]);

  // Impact state
  const [impactData, setImpactData] = useState<any>(null);
  const [impactLoading, setImpactLoading] = useState(false);

  // Report state
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportSent, setReportSent] = useState(false);

  if (!article) return null;

  const summaryData = liveSummary || article.aiSummary;
  const sentimentData = article.sentiment;
  const factData = article.fakeNewsReport;

  const handleLiveReAnalyze = async () => {
    setIsRegenerating(true);
    try {
      const res = await fetch('/api/ai/summarize', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: article.title, content: article.content, url: article.url })
      });
      const data = await res.json();
      if (data?.bullets) setLiveSummary(data);
    } catch {}
    finally { setIsRegenerating(false); }
  };

  const handleLoadInsights = async () => {
    if (keyInsights) return;
    setInsightsLoading(true);
    try {
      const res = await fetch('/api/ai/key-insights', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId: article.id, content: article.content, title: article.title })
      });
      const data = await res.json();
      setKeyInsights(data);
    } catch {}
    finally { setInsightsLoading(false); }
  };

  const handleSimplify = async (level: string) => {
    if (simplifiedText[level]) return;
    setSimplifyLoading(true);
    try {
      const res = await fetch('/api/ai/simplify', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: article.content, title: article.title, level })
      });
      const data = await res.json();
      setSimplifiedText(prev => ({ ...prev, [level]: data.text }));
    } catch {}
    finally { setSimplifyLoading(false); }
  };

  const handleTabSwitch = (tab: ModalTab) => {
    setActiveTab(tab);
    if (tab === 'insights' && !keyInsights) handleLoadInsights();
    if (tab === 'simplify' && !simplifiedText[simplifyLevel]) handleSimplify(simplifyLevel);
    if (tab === 'impact' && !impactData) handleLoadImpact();
  };

  const handleSimplifyLevel = (level: string) => {
    setSimplifyLevel(level);
    if (!simplifiedText[level]) handleSimplify(level);
  };

  const handleLoadImpact = async () => {
    if (impactData) return;
    setImpactLoading(true);
    try {
      const res = await fetch('/api/ai/impact-analysis', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId: article.id, content: article.content, title: article.title })
      });
      setImpactData(await res.json());
    } catch {}
    finally { setImpactLoading(false); }
  };

  const handleAskQuestion = async (question?: string) => {
    const q = question || qaQuestion.trim();
    if (!q) return;
    setQaLoading(true); setQaAnswer(null);
    try {
      const res = await fetch('/api/ai/article-qa', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, articleId: article.id, content: article.content, title: article.title })
      });
      const data = await res.json();
      setQaAnswer(data);
      setQaHistory(prev => [{ q, a: data }, ...prev.slice(0, 4)]);
      setQaQuestion('');
    } catch {}
    finally { setQaLoading(false); }
  };

  const handleReport = async () => {
    if (!reportReason) return;
    await fetch(`/api/news/${article.id}/report`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason: reportReason })
    });
    setReportSent(true);
    setTimeout(() => setReportOpen(false), 2000);
  };

  const copyText = (text: string, setCopied: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs = [
    { id: 'summary' as ModalTab, label: 'Summary', icon: <Sparkles className="w-3 h-3" /> },
    { id: 'insights' as ModalTab, label: 'Key Insights', icon: <Lightbulb className="w-3 h-3" /> },
    { id: 'simplify' as ModalTab, label: 'Simplify', icon: <Zap className="w-3 h-3" /> },
    { id: 'qa' as ModalTab, label: 'Ask AI', icon: <MessageSquare className="w-3 h-3" /> },
    { id: 'impact' as ModalTab, label: 'Impact', icon: <TrendingUp className="w-3 h-3" /> },
    { id: 'sentiment' as ModalTab, label: 'Sentiment', icon: <Brain className="w-3 h-3" /> },
    { id: 'factcheck' as ModalTab, label: `Fact Check (${factData.confidenceScore}%)`, icon: <ShieldCheck className="w-3 h-3" /> },
    { id: 'full' as ModalTab, label: 'Full Text', icon: null },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#050505]/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-4xl bg-[#080808] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 bg-white/5 border-b border-white/10 flex items-start justify-between gap-4 shrink-0">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 text-[11px] font-extrabold uppercase tracking-widest bg-indigo-600 text-white rounded-full">
                {article.category}
              </span>
              <span className="text-xs font-bold text-slate-300">
                Source: <strong className="text-white">{article.source.name}</strong> ({article.source.trustScore}% Trust)
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white leading-snug line-clamp-2">{article.title}</h2>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {onOpenReadingMode && (
              <button onClick={() => onOpenReadingMode(article)}
                className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all" title="Reading Mode">
                <BookOpen className="w-4 h-4" />
              </button>
            )}
            <button onClick={() => setReportOpen(!reportOpen)}
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all" title="Report Article">
              <Flag className="w-4 h-4" />
            </button>
            <button onClick={onClose} className="p-2 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Report Article Panel */}
        {reportOpen && !reportSent && (
          <div className="px-6 py-3 bg-rose-500/10 border-b border-rose-500/20 flex items-center gap-3 flex-wrap">
            <span className="text-xs font-bold text-rose-400">Report this article:</span>
            <select value={reportReason} onChange={e => setReportReason(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-rose-500/30 text-xs text-slate-300 focus:outline-none">
              <option value="">Select reason</option>
              <option value="fake_information">Fake / Misinformation</option>
              <option value="duplicate_article">Duplicate Article</option>
              <option value="offensive_content">Offensive Content</option>
              <option value="incorrect_category">Wrong Category</option>
              <option value="broken_article">Broken / Incomplete</option>
              <option value="misleading_headline">Misleading Headline</option>
            </select>
            <button onClick={handleReport} disabled={!reportReason}
              className="px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-bold disabled:opacity-50 hover:bg-rose-500 transition-all">
              Submit Report
            </button>
          </div>
        )}
        {reportSent && (
          <div className="px-6 py-3 bg-emerald-500/10 border-b border-emerald-500/20 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-emerald-400">Report submitted. Thank you!</span>
          </div>
        )}

        {/* Tab Selector */}
        <div className="px-6 py-2.5 bg-[#080808] border-b border-white/10 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => handleTabSwitch(tab.id)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
              }`}>
              {tab.icon}<span>{tab.label}</span>
            </button>
          ))}
          <div className="flex-1" />
          <button onClick={handleLiveReAnalyze} disabled={isRegenerating}
            className="px-3 py-1.5 rounded-full text-[11px] font-bold bg-white/5 border border-white/10 text-indigo-300 hover:bg-white/10 flex items-center gap-1.5 transition-all shrink-0">
            {isRegenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
            <span>Re-Run AI</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* TAB: SUMMARY */}
          {activeTab === 'summary' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/80 via-purple-950/60 to-slate-900 border border-indigo-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-400" /> Key Executive Takeaway
                  </span>
                  <button onClick={() => onOpenVoice(article)}
                    className="px-3 py-1 rounded-lg bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-500 flex items-center gap-1.5 transition-all">
                    <Volume2 className="w-3.5 h-3.5" /><span>Listen</span>
                  </button>
                </div>
                <p className="text-sm font-semibold text-slate-100 leading-relaxed">{summaryData.keyTakeaway}</p>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Core Briefing Points</h4>
                <div className="space-y-2.5">
                  {summaryData.bullets?.map((bullet: string, idx: number) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-3">
                      <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-300 font-bold text-xs flex items-center justify-center shrink-0 border border-indigo-500/30">0{idx + 1}</span>
                      <p className="text-xs text-slate-200 leading-relaxed pt-0.5">{bullet}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">C-Suite Overview</h4>
                <p className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
                  {summaryData.executiveParagraph}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Extracted Entities (SpaCy NER)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div><span className="text-slate-500">Organizations:</span><p className="text-slate-200 font-semibold mt-0.5">{article.entities.organizations.join(', ') || 'N/A'}</p></div>
                  <div><span className="text-slate-500">People:</span><p className="text-slate-200 font-semibold mt-0.5">{article.entities.people.join(', ') || 'N/A'}</p></div>
                  <div><span className="text-slate-500">Locations:</span><p className="text-slate-200 font-semibold mt-0.5">{article.entities.locations.join(', ') || 'N/A'}</p></div>
                  <div>
                    <span className="text-slate-500">Keywords:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {article.entities.keywords.map((kw, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 text-[10px]">#{kw}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: KEY INSIGHTS */}
          {activeTab === 'insights' && (
            <div className="space-y-4 animate-in fade-in">
              {insightsLoading && (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center space-y-3">
                    <div className="w-8 h-8 rounded-full border-4 border-amber-600/30 border-t-amber-400 animate-spin mx-auto" />
                    <p className="text-xs text-slate-400">Extracting key insights with Gemini AI...</p>
                  </div>
                </div>
              )}
              {keyInsights && !insightsLoading && (
                <>
                  {[
                    { label: 'What Happened?', key: 'whatHappened', icon: <Hash className="w-4 h-4" />, color: 'text-cyan-400 border-cyan-500/20 bg-cyan-500/5' },
                    { label: 'Why It Matters', key: 'whyItMatters', icon: <Lightbulb className="w-4 h-4" />, color: 'text-amber-400 border-amber-500/20 bg-amber-500/5' },
                    { label: 'Who Is Affected', key: 'whoIsAffected', icon: <Users className="w-4 h-4" />, color: 'text-indigo-400 border-indigo-500/20 bg-indigo-500/5' },
                    { label: 'What Happens Next', key: 'whatHappensNext', icon: <ChevronRight className="w-4 h-4" />, color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' },
                  ].map(item => keyInsights[item.key] && (
                    <div key={item.key} className={`p-4 rounded-2xl border ${item.color}`}>
                      <div className={`flex items-center gap-2 mb-2 ${item.color.split(' ')[0]}`}>
                        {item.icon}
                        <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
                      </div>
                      <p className="text-sm text-slate-200 leading-relaxed">{keyInsights[item.key]}</p>
                    </div>
                  ))}

                  {keyInsights.keyNumbers?.length > 0 && (
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Key Numbers & Statistics</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {keyInsights.keyNumbers.map((n: string, i: number) => (
                          <span key={i} className="px-3 py-1.5 rounded-xl bg-indigo-500/15 text-indigo-300 text-xs font-semibold border border-indigo-500/25">{n}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {keyInsights.expertOpinions?.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Expert Opinions & Quotes</span>
                      {keyInsights.expertOpinions.map((op: string, i: number) => (
                        <div key={i} className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 italic flex items-start gap-2">
                          <span className="text-slate-500 text-lg leading-none -mt-1">"</span>{op}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* TAB: SIMPLIFY */}
          {activeTab === 'simplify' && (
            <div className="space-y-4 animate-in fade-in">
              <p className="text-xs text-slate-400">Choose a complexity level to get a version of this article tailored to your needs:</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {SIMPLIFY_LEVELS.map(level => (
                  <button key={level.id} onClick={() => handleSimplifyLevel(level.id)}
                    className={`p-3 rounded-2xl text-center transition-all border ${
                      simplifyLevel === level.id
                        ? `bg-gradient-to-br ${level.color} border-transparent text-white shadow-lg`
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                    }`}>
                    <div className="text-sm font-extrabold">{level.label}</div>
                    <div className="text-[10px] mt-0.5 opacity-80">{level.description}</div>
                  </button>
                ))}
              </div>

              {(simplifyLoading && !simplifiedText[simplifyLevel]) && (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 rounded-full border-4 border-indigo-600/30 border-t-indigo-400 animate-spin" />
                </div>
              )}

              {simplifiedText[simplifyLevel] && (
                <div className="relative">
                  <div className="p-5 rounded-2xl bg-slate-900 border border-slate-700 text-sm text-slate-200 leading-relaxed">
                    {simplifiedText[simplifyLevel]}
                  </div>
                  <button onClick={() => copyText(simplifiedText[simplifyLevel], setCopiedSimplify)}
                    className="absolute top-3 right-3 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all">
                    {copiedSimplify ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB: ARTICLE Q&A */}
          {activeTab === 'qa' && (
            <div className="space-y-4 animate-in fade-in">
              <p className="text-xs text-slate-400">Ask any question about this article — AI will answer using only the article content.</p>

              {/* Suggested questions */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Suggested Questions</span>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_QUESTIONS.map((q, i) => (
                    <button key={i} onClick={() => handleAskQuestion(q)}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-indigo-500 text-xs text-slate-300 hover:text-indigo-300 transition-all text-left">
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input */}
              <div className="flex gap-2">
                <input value={qaQuestion} onChange={e => setQaQuestion(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAskQuestion()}
                  placeholder="Ask anything about this article..."
                  className="flex-1 px-4 py-3 bg-slate-900 border border-slate-700 rounded-2xl text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500" />
                <button onClick={() => handleAskQuestion()} disabled={!qaQuestion.trim() || qaLoading}
                  className="px-4 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold disabled:opacity-50 transition-all flex items-center gap-1.5">
                  {qaLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <MessageSquare className="w-3.5 h-3.5" />}
                  Ask
                </button>
              </div>

              {/* Q&A History */}
              {qaHistory.length > 0 && (
                <div className="space-y-3">
                  {qaHistory.map((item, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex items-start gap-2">
                        <span className="px-2 py-1 rounded-lg bg-indigo-600/20 text-indigo-400 text-[10px] font-bold shrink-0">Q</span>
                        <p className="text-xs text-slate-300 pt-1">{item.q}</p>
                      </div>
                      <div className="flex items-start gap-2 ml-2">
                        <span className="px-2 py-1 rounded-lg bg-emerald-600/20 text-emerald-400 text-[10px] font-bold shrink-0">A</span>
                        <div className="flex-1">
                          <p className="text-xs text-slate-200 leading-relaxed">{item.a?.answer || 'No answer available.'}</p>
                          {item.a?.relatedQuote && (
                            <blockquote className="mt-2 pl-3 border-l-2 border-slate-600 text-[10px] text-slate-400 italic">"{item.a.relatedQuote}"</blockquote>
                          )}
                          {item.a?.confidence && (
                            <span className="text-[10px] text-slate-600 mt-1 block">Confidence: {item.a.confidence}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: IMPACT */}
          {activeTab === 'impact' && (
            <div className="space-y-4 animate-in fade-in">
              {impactLoading && (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 rounded-full border-4 border-violet-600/30 border-t-violet-400 animate-spin" />
                </div>
              )}
              {impactData && !impactLoading && (
                <>
                  {[
                    { label: 'Economic Impact', key: 'economic', color: 'from-emerald-500/10 to-teal-500/10 border-emerald-500/20 text-emerald-400' },
                    { label: 'Technology Impact', key: 'technology', color: 'from-cyan-500/10 to-blue-500/10 border-cyan-500/20 text-cyan-400' },
                    { label: 'Business Implications', key: 'business', color: 'from-indigo-500/10 to-violet-500/10 border-indigo-500/20 text-indigo-400' },
                    { label: 'Social Effects', key: 'social', color: 'from-amber-500/10 to-orange-500/10 border-amber-500/20 text-amber-400' },
                  ].map(item => impactData[item.key] && (
                    <div key={item.key} className={`p-4 rounded-2xl bg-gradient-to-br ${item.color} border`}>
                      <div className={`text-[10px] font-bold uppercase tracking-wider mb-2 ${item.color.split(' ')[3]}`}>{item.label}</div>
                      <p className="text-sm text-slate-200 leading-relaxed">{impactData[item.key]}</p>
                    </div>
                  ))}
                  {impactData.timeline && (
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-500 font-bold uppercase">Timeline:</span>
                      <span className="px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-300 text-xs font-bold border border-violet-500/25 capitalize">{impactData.timeline}</span>
                      {impactData.riskLevel && (
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${
                          impactData.riskLevel === 'high' ? 'bg-rose-500/15 text-rose-400 border-rose-500/25' : impactData.riskLevel === 'medium' ? 'bg-amber-500/15 text-amber-400 border-amber-500/25' : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25'
                        }`}>Risk: {impactData.riskLevel}</span>
                      )}
                    </div>
                  )}
                  <p className="text-[10px] text-slate-600 italic">⚠️ {impactData.disclaimer}</p>
                </>
              )}
            </div>
          )}

          {/* TAB: SENTIMENT */}
          {activeTab === 'sentiment' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Tone & Emotional Polarity</span>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xl font-bold text-slate-100">{sentimentData.label}</p>
                      <p className="text-xs text-slate-400">Score: {sentimentData.score > 0 ? `+${sentimentData.score}` : sentimentData.score}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">{sentimentData.type}</span>
                  </div>
                  <div className="space-y-1 pt-2">
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>-1.0 Negative</span><span>0.0 Neutral</span><span>+1.0 Positive</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 relative">
                      <div className="absolute top-0 bottom-0 bg-indigo-500 rounded-full"
                        style={{ left: '50%', width: `${Math.abs(sentimentData.score) * 50}%`, marginLeft: sentimentData.score < 0 ? `-${Math.abs(sentimentData.score) * 50}%` : '0%' }} />
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Political Alignment Spectrum</span>
                  <p className="text-xl font-bold text-slate-100">{sentimentData.politicalSpectrum || 'Center'}</p>
                  <p className="text-xs text-slate-400">Evaluated for objective reporting vs ideological framing.</p>
                  <div className="flex justify-between text-[10px] font-mono text-slate-400 pt-2">
                    {['Left', 'Center-Left', 'Center', 'Center-Right', 'Right'].map(s => (
                      <span key={s} className={sentimentData.politicalSpectrum === s ? 'text-indigo-400 font-bold' : ''}>{s.replace('Center-', 'C-')}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: FACT CHECK */}
          {activeTab === 'factcheck' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {factData.confidenceScore >= 80
                      ? <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center"><ShieldCheck className="w-6 h-6" /></div>
                      : <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center"><ShieldAlert className="w-6 h-6" /></div>
                    }
                    <div>
                      <h4 className="text-base font-bold text-slate-100">{factData.verdict}</h4>
                      <p className="text-xs text-slate-400">Authenticity Confidence: {factData.confidenceScore}%</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${factData.confidenceScore >= 80 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'}`}>
                    {factData.confidenceScore >= 80 ? 'Low Risk' : 'High Alert'}
                  </span>
                </div>

                {factData.redFlags?.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5" /> Red Flags</span>
                    <ul className="space-y-1">
                      {factData.redFlags.map((flag, i) => (
                        <li key={i} className="text-xs text-slate-300 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">• {flag}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {factData.factCheckSources?.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Cross-Referenced Sources</span>
                    <div className="flex flex-wrap gap-2">
                      {factData.factCheckSources.map((src, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />{src}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: FULL TEXT */}
          {activeTab === 'full' && (
            <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 text-slate-200 text-sm leading-relaxed space-y-4 animate-in fade-in">
              <p className="font-semibold text-slate-400 italic">By {article.author} · {new Date(article.publishedAt).toLocaleDateString()}</p>
              <div className="whitespace-pre-line text-slate-300 space-y-3">{article.content}</div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <a href={article.url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
              <span>Original Source</span><ExternalLink className="w-3.5 h-3.5" />
            </a>
            {onDiscussWithAI && (
              <button onClick={() => onDiscussWithAI(article)}
                className="flex items-center gap-1.5 text-xs font-medium text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-xl transition-colors">
                <Brain className="w-3.5 h-3.5" /><span>Discuss with Copilot</span>
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => onInteract(article.id, 'bookmark')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all ${article.isBookmarked ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>
              <Bookmark className="w-3.5 h-3.5" /><span>{article.isBookmarked ? 'Saved' : 'Save'}</span>
            </button>
            <button onClick={() => onInteract(article.id, 'like')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all ${article.isLiked ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>
              <Heart className="w-3.5 h-3.5" /><span>{article.likesCount}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
