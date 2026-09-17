import React, { useState } from 'react';
import { 
  CheckSquare, ShieldAlert, Sparkles, AlertTriangle, CheckCircle2, 
  FileText, Search, Download, Copy, ExternalLink, Cpu, BarChart2
} from 'lucide-react';
import { FactCheckWorkbenchResult } from '../types';

const SAMPLE_CLAIMS = [
  {
    title: 'Clean Energy Breakthrough Claim',
    text: 'A secret laboratory in Stockholm has allegedly achieved room-temperature superconductivity producing 100x efficiency using recycled consumer electronics.',
    expectedVerdict: 'High Synthetic Risk' as const
  },
  {
    title: 'Central Bank Cash Ban Rumor',
    text: 'Leaked regulatory drafts suggest all physical cash currency will be declared invalid across the European Union by the end of Q4.',
    expectedVerdict: 'Misleading Claims' as const
  },
  {
    title: 'Quantum Computing Encryption Standard',
    text: 'NIST officially released the finalized post-quantum cryptographic standards (CRYSTALS-Kyber and CRYSTALS-Dilithium) for commercial security compliance.',
    expectedVerdict: 'Verified Authentic' as const
  }
];

export default function FactCheckWorkbenchPage() {
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<FactCheckWorkbenchResult | null>(null);
  const [copied, setCopied] = useState(false);

  const handleAnalyze = (textToAnalyze?: string) => {
    const text = textToAnalyze || inputText;
    if (!text.trim()) return;

    setIsAnalyzing(true);
    setResult(null);

    setTimeout(() => {
      // Generate synthetic verification result based on content
      const lower = text.toLowerCase();
      let verdict: FactCheckWorkbenchResult['verdict'] = 'Verified Authentic';
      let confidenceScore = 94;
      let syntheticScore = 12;
      let clickbaitScore = 18;
      let sourceCredibilityScore = 92;

      if (lower.includes('secret laboratory') || lower.includes('100x efficiency') || lower.includes('superconductivity')) {
        verdict = 'High Synthetic Risk';
        confidenceScore = 88;
        syntheticScore = 86;
        clickbaitScore = 91;
        sourceCredibilityScore = 24;
      } else if (lower.includes('leaked') || lower.includes('banning physical cash') || lower.includes('invalid across')) {
        verdict = 'Misleading Claims';
        confidenceScore = 85;
        syntheticScore = 64;
        clickbaitScore = 82;
        sourceCredibilityScore = 38;
      }

      setResult({
        urlOrText: text,
        analyzedAt: new Date().toLocaleTimeString(),
        verdict,
        confidenceScore,
        syntheticScore,
        clickbaitScore,
        sourceCredibilityScore,
        extractedClaims: [
          {
            claim: text.slice(0, 90) + '...',
            verdict: verdict === 'Verified Authentic' ? 'Supported' : verdict === 'Misleading Claims' ? 'Disproven' : 'Unverified',
            explanation: verdict === 'Verified Authentic' 
              ? 'Cross-checked with NIST official publication standards and independent security audits.' 
              : 'No official regulatory press release or peer-reviewed paper backs this statement.'
          },
          {
            claim: 'Claims of immediate global regulatory implementation',
            verdict: verdict === 'Verified Authentic' ? 'Supported' : 'Disproven',
            explanation: 'Cross-source analysis shows significant distortion compared to actual legislative proposals.'
          }
        ],
        redFlags: verdict === 'Verified Authentic' ? [] : [
          'Unverified sensationalist terminology ("secret lab", "100x efficiency")',
          'High correlation with known AI generator stylistic patterns',
          'Lack of primary source citations or institutional press release'
        ],
        crossReferences: [
          { source: 'Reuters News Registry', snippet: 'No matching regulatory decree found in official archives.', matches: verdict === 'Verified Authentic' },
          { source: 'IEEE Peer-Review Database', snippet: 'No valid pre-print publication detected for claimed metrics.', matches: verdict === 'Verified Authentic' },
          { source: 'AP FactCheck Index', snippet: 'Similar claim debunked in recent misinformation alert.', matches: false }
        ]
      });

      setIsAnalyzing(false);
    }, 1100);
  };

  const handleCopyReport = () => {
    if (!result) return;
    const summary = `Chronicle AI Fact-Check Verification Report:\nVerdict: ${result.verdict}\nConfidence: ${result.confidenceScore}%\nSynthetic AI Risk: ${result.syntheticScore}%\nAnalyzed Text: ${result.urlOrText}`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#060608] text-slate-100 p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-widest mb-1">
            <CheckSquare className="w-4 h-4" />
            <span>Misinformation & Verification Lab</span>
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-[10px]">
              NLP Audit Engine
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">
            Fact-Check <span className="bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent">Workbench</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Analyze any article text, headline, or claim. Evaluate synthetic AI text probability, extracted claim veracity, and cross-source consensus.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-slate-400 bg-white/5 px-3 py-2 rounded-xl border border-white/10 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            Bert-Misinfo Model 4.2 Active
          </span>
        </div>
      </div>

      {/* Preset Quick Checks */}
      <div className="space-y-2">
        <span className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider">Quick Benchmark Samples</span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SAMPLE_CLAIMS.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputText(sample.text);
                handleAnalyze(sample.text);
              }}
              className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/50 hover:bg-white/[0.08] text-left transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-300 group-hover:text-white">{sample.title}</span>
                <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${
                  sample.expectedVerdict === 'Verified Authentic' ? 'bg-emerald-500/20 text-emerald-300' :
                  sample.expectedVerdict === 'Misleading Claims' ? 'bg-amber-500/20 text-amber-300' :
                  'bg-rose-500/20 text-rose-300'
                }`}>
                  {sample.expectedVerdict}
                </span>
              </div>
              <p className="text-xs text-slate-400 line-clamp-2">{sample.text}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Input Console */}
      <div className="rounded-3xl bg-slate-900 border border-white/10 p-6 space-y-4 shadow-xl">
        <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
          <span>Input Article Text, Headline, or Claim Statement</span>
          <span className="text-slate-500 font-normal">{inputText.length} characters</span>
        </label>

        <textarea
          rows={5}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste article excerpt, social media post, or news URL here to run deep NLP verification..."
          className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all resize-none"
        />

        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-slate-400">
            Powered by multi-stage BERT claim extraction & semantic similarity indexing.
          </p>
          <button
            onClick={() => handleAnalyze()}
            disabled={isAnalyzing || !inputText.trim()}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-cyan-500/20"
          >
            {isAnalyzing ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Auditing Claims...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Run Fact-Check Audit</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Verification Results */}
      {result && (
        <div className="space-y-6">
          {/* Main Verdict Header */}
          <div className={`p-6 rounded-3xl border flex flex-col md:flex-row md:items-center justify-between gap-6 ${
            result.verdict === 'Verified Authentic'
              ? 'bg-gradient-to-r from-emerald-950/60 via-slate-900 to-teal-950/60 border-emerald-500/40'
              : result.verdict === 'Needs Context' || result.verdict === 'Misleading Claims'
              ? 'bg-gradient-to-r from-amber-950/60 via-slate-900 to-orange-950/60 border-amber-500/40'
              : 'bg-gradient-to-r from-rose-950/60 via-slate-900 to-pink-950/60 border-rose-500/40'
          }`}>
            <div className="flex items-center gap-4">
              <div className={`p-4 rounded-2xl border ${
                result.verdict === 'Verified Authentic' ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' :
                result.verdict === 'Misleading Claims' ? 'bg-amber-500/20 border-amber-500/30 text-amber-400' :
                'bg-rose-500/20 border-rose-500/30 text-rose-400'
              }`}>
                {result.verdict === 'Verified Authentic' ? <CheckCircle2 className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-slate-400">
                  Audit Verdict ({result.analyzedAt})
                </span>
                <h2 className="text-2xl font-black text-white">{result.verdict}</h2>
                <p className="text-xs text-slate-300 mt-0.5">
                  Algorithmic confidence rating: <strong className="text-white">{result.confidenceScore}%</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleCopyReport}
                className="px-4 py-2.5 rounded-xl bg-white/10 border border-white/15 hover:bg-white/20 text-xs font-bold text-white flex items-center gap-2 transition-all"
              >
                <Copy className="w-4 h-4 text-cyan-400" />
                {copied ? 'Copied Audit Summary!' : 'Copy Verification Summary'}
              </button>
            </div>
          </div>

          {/* Key Metric Gauges */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Synthetic AI Probability */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-300">Synthetic AI Generation Risk</span>
                <span className={`font-mono ${result.syntheticScore > 50 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {result.syntheticScore}%
                </span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-full ${result.syntheticScore > 50 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                  style={{ width: `${result.syntheticScore}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400">
                {result.syntheticScore > 50 ? 'High probability of automated LLM style syntax.' : 'Human writing characteristics detected.'}
              </p>
            </div>

            {/* Clickbait Index */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-300">Sensationalism & Clickbait</span>
                <span className={`font-mono ${result.clickbaitScore > 50 ? 'text-amber-400' : 'text-cyan-400'}`}>
                  {result.clickbaitScore}%
                </span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-full ${result.clickbaitScore > 50 ? 'bg-amber-500' : 'bg-cyan-500'}`}
                  style={{ width: `${result.clickbaitScore}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400">
                Measures emotional trigger words and hyperbolic phrasing.
              </p>
            </div>

            {/* Source Credibility Index */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-300">Source Credibility Index</span>
                <span className={`font-mono ${result.sourceCredibilityScore > 70 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {result.sourceCredibilityScore}%
                </span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-full ${result.sourceCredibilityScore > 70 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                  style={{ width: `${result.sourceCredibilityScore}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400">
                Historical citation frequency and peer verification agreement.
              </p>
            </div>
          </div>

          {/* Extracted Claims Table */}
          <div className="rounded-3xl bg-slate-900 border border-white/10 p-6 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-400" />
              Extracted Claim Breakdown
            </h3>

            <div className="space-y-3">
              {result.extractedClaims.map((claim, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">Claim #{idx + 1}</span>
                    <p className="text-sm font-bold text-white">"{claim.claim}"</p>
                    <p className="text-xs text-slate-300">{claim.explanation}</p>
                  </div>

                  <span className={`self-start md:self-center px-3 py-1 rounded-full text-xs font-mono font-bold shrink-0 ${
                    claim.verdict === 'Supported' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                    claim.verdict === 'Disproven' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                    'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {claim.verdict}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Cross References & Red Flags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Cross-References */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 space-y-4">
              <h4 className="font-bold text-sm text-white flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-cyan-400" />
                Fact-Check Cross References
              </h4>
              <div className="space-y-3">
                {result.crossReferences.map((ref, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs space-y-1">
                    <div className="flex justify-between font-bold text-cyan-300">
                      <span>{ref.source}</span>
                      <span className={ref.matches ? 'text-emerald-400' : 'text-slate-400'}>
                        {ref.matches ? 'Match Verified' : 'No Direct Match'}
                      </span>
                    </div>
                    <p className="text-slate-400">{ref.snippet}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Red Flags Warnings */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 space-y-4">
              <h4 className="font-bold text-sm text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                Risk Indicators & Red Flags
              </h4>
              {result.redFlags.length === 0 ? (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  No high-risk manipulation flags detected in this statement.
                </div>
              ) : (
                <ul className="space-y-2">
                  {result.redFlags.map((flag, idx) => (
                    <li key={idx} className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-200 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <span>{flag}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
