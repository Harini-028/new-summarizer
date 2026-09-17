import React from 'react';
import {
  Sparkles,
  ShieldCheck,
  Cpu,
  Radio,
  Zap,
  Brain,
  CheckCircle,
  ArrowRight,
  BarChart3,
  Globe2,
  Lock,
  Users,
  Star,
  TrendingUp,
  Newspaper,
  Play,
  ChevronRight,
  Building2,
  Award,
  Clock,
  Volume2
} from 'lucide-react';
import { ActivePage } from '../types';
import { useAuth } from '../context/AuthContext';

interface LandingPageProps {
  onNavigate: (page: ActivePage) => void;
  onOpenAuth: () => void;
}

const FEATURES = [
  {
    icon: Sparkles,
    title: 'AI Multi-Level Summarizer',
    desc: 'Generates executive 3-bullet briefings, C-suite summary paragraphs, and single-sentence takeaways — all in under 20ms using Gemini 3.6 Flash.',
    color: 'text-indigo-400',
    bg: 'from-indigo-500/15 to-indigo-500/5',
    border: 'border-indigo-500/20 hover:border-indigo-500/50',
    badge: 'GEMINI 3.6'
  },
  {
    icon: ShieldCheck,
    title: 'Fake News & Fact-Check Guard',
    desc: 'Real-time domain authority scoring, logical fallacy detection, and viral misinformation risk flagging with BERT + XGBoost classifiers.',
    color: 'text-emerald-400',
    bg: 'from-emerald-500/15 to-emerald-500/5',
    border: 'border-emerald-500/20 hover:border-emerald-500/50',
    badge: 'BERT + XGBoost'
  },
  {
    icon: Radio,
    title: 'Voice Summary & Audio Briefings',
    desc: 'Transforms your personalized news feed into high-fidelity AI voice audio podcasts with controllable speed and accent personas.',
    color: 'text-cyan-400',
    bg: 'from-cyan-500/15 to-cyan-500/5',
    border: 'border-cyan-500/20 hover:border-cyan-500/50',
    badge: 'TTS API'
  },
  {
    icon: Brain,
    title: 'Personalized ML Recommendations',
    desc: 'FAISS vector cosine similarity engine learns your reading preferences and surfaces the most relevant stories from 148k+ indexed articles.',
    color: 'text-violet-400',
    bg: 'from-violet-500/15 to-violet-500/5',
    border: 'border-violet-500/20 hover:border-violet-500/50',
    badge: 'FAISS'
  },
  {
    icon: BarChart3,
    title: 'Sentiment & Bias Analytics',
    desc: 'Multi-axis sentiment polarity, political spectrum mapping, and real-time bias rating across your entire news consumption history.',
    color: 'text-amber-400',
    bg: 'from-amber-500/15 to-amber-500/5',
    border: 'border-amber-500/20 hover:border-amber-500/50',
    badge: 'BERTopic'
  },
  {
    icon: Globe2,
    title: 'Enterprise REST API',
    desc: 'Full OpenAPI 3.0 spec with 18+ endpoints for news ingestion, ML pipelines, analytics, auth, and admin management — ready for your integration.',
    color: 'text-rose-400',
    bg: 'from-rose-500/15 to-rose-500/5',
    border: 'border-rose-500/20 hover:border-rose-500/50',
    badge: 'REST + FastAPI'
  },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Ingest & Index',
    desc: 'News articles are ingested in real-time, cleaned, and FAISS-indexed with 768-dim BERT embeddings for ultra-fast vector similarity search.',
    icon: Newspaper
  },
  {
    step: '02',
    title: 'AI Analysis',
    desc: 'Gemini 3.6 Flash generates multi-format summaries. BERTopic clusters topics. XGBoost classifies authenticity. All in under 20ms.',
    icon: Brain
  },
  {
    step: '03',
    title: 'Personalized Delivery',
    desc: 'Your interest profile drives hybrid collaborative + content-based filtering. Results are ranked, optionally voiced, and delivered in your dashboard.',
    icon: TrendingUp
  },
];

const TESTIMONIALS = [
  {
    quote: "Chronicle AI's ML pipeline reduced our editorial review time by 78% and fake-news rejections improved by 3.2x.",
    name: 'Elena Rostova',
    role: 'Chief Editor, Reuters AI Division',
    avatar: 'ER',
    stars: 5
  },
  {
    quote: "The FAISS-powered recommendations are uncannily accurate. Our analyst team now starts every morning with the Chronicle Daily Brief.",
    name: 'Marcus Vance',
    role: 'Head of Research, Goldman Sachs',
    avatar: 'MV',
    stars: 5
  },
  {
    quote: "We integrated the REST API into our proprietary news terminal in under a day. The OpenAPI docs are excellent.",
    name: 'Priya Sharma',
    role: 'CTO, FinTech Ventures',
    avatar: 'PS',
    stars: 5
  },
];

const PLANS = [
  {
    name: 'Starter',
    price: '$0',
    period: 'month',
    desc: 'Perfect for individual journalists and researchers.',
    features: ['Standard live news feed', 'Basic AI bullet summaries', 'Daily briefing text', '5 fact-check audits/day', 'Community support'],
    cta: 'Get Started Free',
    highlight: false
  },
  {
    name: 'Pro Member',
    price: '$49',
    period: 'month',
    desc: 'Ideal for power users and small editorial teams.',
    features: ['ML personalized vector engine', 'Gemini voice summary audio', 'Unlimited fact-check audits', 'Sentiment & bias analytics', 'Priority email support'],
    cta: 'Upgrade to Pro',
    highlight: true,
    badge: 'Most Popular'
  },
  {
    name: 'Enterprise SaaS',
    price: '$299',
    period: 'month',
    desc: 'For organizations requiring maximum scale.',
    features: ['Custom FastAPI model training', 'Dedicated FAISS vector cluster', 'SLA 99.99% uptime', 'Admin dashboard & controls', 'Dedicated account manager'],
    cta: 'Contact Sales',
    highlight: false
  },
];

const STATS = [
  { value: '148k+', label: 'FAISS Embeddings Indexed', icon: Brain, color: 'text-indigo-400' },
  { value: '96.4%', label: 'ML Model Accuracy', icon: Award, color: 'text-emerald-400' },
  { value: '< 20ms', label: 'FastAPI Inference Latency', icon: Zap, color: 'text-amber-400' },
  { value: '24/7', label: 'Real-Time Fact Guard', icon: ShieldCheck, color: 'text-cyan-400' },
  { value: '18+', label: 'REST API Endpoints', icon: Globe2, color: 'text-violet-400' },
  { value: '104k+', label: 'Monthly Active Users', icon: Users, color: 'text-rose-400' },
];

export default function LandingPage({ onNavigate, onOpenAuth }: LandingPageProps) {
  const { isAuthenticated } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      onNavigate('home');
    } else {
      onOpenAuth();
    }
  };

  return (
    <div className="space-y-20 py-6 animate-in">

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="relative rounded-3xl overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950/60 to-slate-950" />
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-indigo-500/12 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 w-40 h-40 bg-emerald-500/8 rounded-full blur-[60px] pointer-events-none animate-float" />
        <div className="absolute inset-0 border border-white/5 rounded-3xl" />

        <div className="relative z-10 p-8 lg:p-14">
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Next-Gen Enterprise News Intelligence Platform
          </div>

          <div className="max-w-3xl space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-100 tracking-tight leading-[1.1]">
              Personalized News &{' '}
              <span className="gradient-text">AI-Powered Intelligence</span>{' '}
              at Scale
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              Real-time news aggregation, C-suite executive AI summarization, sentiment polarity analysis, and automated fake news detection — powered by BERTopic, FAISS vector embeddings, and Gemini 3.6 Flash.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={handleGetStarted}
                className="px-7 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center gap-2 transition-all hover:scale-105"
              >
                <span>{isAuthenticated ? 'Go to News Feed' : 'Get Started Free'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('ml-dashboard')}
                className="px-7 py-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm flex items-center gap-2 transition-all"
              >
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>Inspect ML Pipeline</span>
              </button>

              {!isAuthenticated && (
                <button
                  onClick={() => onNavigate('home')}
                  className="px-7 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 font-semibold text-sm flex items-center gap-2 transition-all"
                >
                  <Play className="w-4 h-4 text-slate-400" />
                  <span>Browse as Guest</span>
                </button>
              )}
            </div>

            {/* Stats row */}
            <div className="pt-8 border-t border-slate-800/60 grid grid-cols-2 sm:grid-cols-4 gap-6">
              {STATS.slice(0, 4).map(s => {
                const Icon = s.icon;
                return (
                  <div key={s.label}>
                    <div className={`flex items-center gap-1.5 ${s.color} mb-1`}>
                      <Icon className="w-4 h-4" />
                      <p className="text-2xl font-extrabold font-mono">{s.value}</p>
                    </div>
                    <p className="text-xs text-slate-400">{s.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Full Row ─────────────────────────────────────────── */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {STATS.map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="glass rounded-2xl p-5 text-center space-y-2 card-hover">
              <div className={`w-8 h-8 mx-auto rounded-xl flex items-center justify-center ${s.color} bg-white/5`}>
                <Icon className="w-4 h-4" />
              </div>
              <p className={`text-2xl font-extrabold font-mono ${s.color}`}>{s.value}</p>
              <p className="text-[10px] text-slate-400 leading-tight">{s.label}</p>
            </div>
          );
        })}
      </section>

      {/* ── Features Grid ─────────────────────────────────────────── */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Enterprise Machine Learning Architecture
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-100 tracking-tight">
            Every Feature You Need to{' '}
            <span className="gradient-text">Stay Ahead</span>
          </h2>
          <p className="text-sm text-slate-400">
            A complete microservices pipeline combining NLP, sentiment analysis, vector search, and Gemini AI reasoning.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map(f => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className={`p-6 rounded-3xl bg-gradient-to-br ${f.bg} border ${f.border} transition-all space-y-4 card-hover`}
              >
                <div className="flex items-start justify-between">
                  <div className={`w-11 h-11 rounded-2xl bg-white/8 ${f.color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`px-2.5 py-0.5 text-[10px] font-extrabold ${f.color} border border-current/30 rounded-full uppercase tracking-wider opacity-70`}>
                    {f.badge}
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-100 mb-2">{f.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
                <button
                  onClick={() => onNavigate('home')}
                  className={`flex items-center gap-1 text-xs font-semibold ${f.color} hover:opacity-80 transition-opacity`}
                >
                  Explore feature <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────────────── */}
      <section className="p-8 lg:p-12 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 space-y-10">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
            <Cpu className="w-3.5 h-3.5" />
            ML Pipeline Architecture
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-100">How Chronicle AI Works</h2>
          <p className="text-xs text-slate-400">Three automated stages transform raw news into personalized, verified intelligence.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-12 left-[33%] right-[33%] h-px bg-gradient-to-r from-indigo-500/30 via-cyan-500/30 to-emerald-500/30" />

          {HOW_IT_WORKS.map((step, i) => {
            const Icon = step.icon;
            const stepColors = [
              { dot: 'bg-indigo-600', text: 'text-indigo-400' },
              { dot: 'bg-cyan-600', text: 'text-cyan-400' },
              { dot: 'bg-emerald-600', text: 'text-emerald-400' },
            ];
            return (
              <div key={step.step} className="relative text-center space-y-4">
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-2xl ${stepColors[i].dot}/20 border border-current/20 flex items-center justify-center mb-4 relative z-10`}>
                    <Icon className={`w-6 h-6 ${stepColors[i].text}`} />
                  </div>
                  <span className={`text-[10px] font-extrabold font-mono uppercase tracking-widest ${stepColors[i].text} mb-2`}>
                    Step {step.step}
                  </span>
                  <h3 className="text-base font-bold text-white">{step.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mt-2 max-w-xs mx-auto">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────────── */}
      <section className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400 text-xs font-semibold">
            <Users className="w-3.5 h-3.5 text-indigo-400" />
            Trusted by Enterprise Teams
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-100">What Our Users Say</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map(t => (
            <div key={t.name} className="glass rounded-3xl p-6 space-y-4 card-hover">
              <div className="flex items-center gap-1">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-sm text-slate-300 leading-relaxed italic">"{t.quote}"</p>
              <div className="flex items-center gap-3 pt-2 border-t border-white/8">
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-[10px] font-bold">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-xs font-bold text-white">{t.name}</p>
                  <p className="text-[10px] text-slate-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pricing ───────────────────────────────────────────────── */}
      <section className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400 text-xs font-semibold">
            <Building2 className="w-3.5 h-3.5 text-indigo-400" />
            Flexible Enterprise Licensing
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-100">Simple, Transparent Pricing</h2>
          <p className="text-xs text-slate-400">Scale news intelligence across your entire executive leadership team.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map(plan => (
            <div
              key={plan.name}
              className={`relative rounded-3xl p-7 space-y-6 transition-all card-hover ${
                plan.highlight
                  ? 'bg-gradient-to-b from-indigo-950/60 to-slate-950 border border-indigo-500/40 shadow-xl shadow-indigo-500/10'
                  : 'glass'
              }`}
            >
              {plan.badge && (
                <span className="absolute -top-3 right-5 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-indigo-600 text-white rounded-full shadow-lg shadow-indigo-600/40">
                  {plan.badge}
                </span>
              )}
              <div>
                <span className={`text-xs font-bold uppercase tracking-wider block mb-3 ${plan.highlight ? 'text-indigo-300' : 'text-slate-400'}`}>
                  {plan.name}
                </span>
                <div className="flex items-end gap-1">
                  <p className="text-4xl font-extrabold text-slate-100 font-mono">{plan.price}</p>
                  <span className="text-sm text-slate-500 mb-1">/{plan.period}</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">{plan.desc}</p>
              </div>

              <ul className="space-y-2.5">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-xs text-slate-300">
                    <CheckCircle className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${plan.highlight ? 'text-indigo-400' : 'text-slate-500'}`} />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={handleGetStarted}
                className={`w-full py-3 rounded-2xl font-bold text-sm transition-all ${
                  plan.highlight
                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                    : 'bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────────────── */}
      <section className="relative rounded-3xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-600 animate-gradient" />
        <div className="absolute inset-0 bg-[#050505]/40" />
        <div className="relative z-10 p-10 lg:p-16 text-center space-y-6 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
            Ready to Transform Your News Intelligence?
          </h2>
          <p className="text-sm text-white/80 leading-relaxed">
            Join 104,000+ professionals who trust Chronicle AI to cut through the noise and deliver verified, personalized news intelligence every day.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={handleGetStarted}
              className="px-8 py-4 rounded-2xl bg-white text-indigo-700 font-bold text-sm shadow-xl hover:scale-105 transition-all flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              {isAuthenticated ? 'Go to News Feed' : 'Start for Free — No Credit Card'}
            </button>
            <button
              onClick={() => onNavigate('ml-dashboard')}
              className="px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/30 font-semibold text-sm transition-all"
            >
              View ML Architecture
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────── */}
      <footer className="border-t border-white/8 pt-10 pb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2 md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white">CHRONICLE<span className="text-indigo-400">.AI</span></span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Enterprise AI-powered news intelligence platform for modern professionals.
            </p>
            <div className="flex gap-2">
              {['Twitter', 'LinkedIn', 'GitHub'].map(s => (
                <button key={s} className="px-3 py-1 rounded-lg bg-white/5 text-slate-500 text-[10px] font-medium hover:bg-white/10 hover:text-slate-300 transition-all border border-white/5">
                  {s}
                </button>
              ))}
            </div>
          </div>
          {[
            { title: 'Product', links: ['Features', 'ML Pipeline', 'API Docs', 'Pricing'] },
            { title: 'Company', links: ['About', 'Blog', 'Careers', 'Press'] },
            { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'GDPR'] },
          ].map(col => (
            <div key={col.title} className="space-y-3">
              <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">{col.title}</p>
              <ul className="space-y-2">
                {col.links.map(l => (
                  <li key={l}>
                    <button className="text-xs text-slate-500 hover:text-slate-300 transition-colors">{l}</button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-slate-600">© 2026 Chronicle AI Inc. All rights reserved.</p>
          <p className="text-[11px] text-slate-600">
            Powered by{' '}
            <span className="text-indigo-500">Gemini 3.6 Flash</span>,{' '}
            <span className="text-emerald-500">BERT</span>, &{' '}
            <span className="text-cyan-500">FAISS</span>
          </p>
        </div>
      </footer>

    </div>
  );
}
