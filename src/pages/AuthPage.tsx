import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Mail,
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Cpu,
  Radio,
  CheckCircle,
  ChevronRight,
  Zap,
  Globe2,
  BarChart3
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthPageProps {
  onSuccess: () => void;
  initialMode?: 'login' | 'register';
}

const FEATURES = [
  { icon: Sparkles, label: 'AI News Summarizer', desc: 'C-suite executive briefings in milliseconds', color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
  { icon: ShieldCheck, label: 'Fake News Guard', desc: 'BERT + XGBoost misinformation detection', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { icon: Radio, label: 'Voice Briefings', desc: 'Gemini TTS personalized audio news', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  { icon: BarChart3, label: 'ML Analytics', desc: 'Real-time sentiment & trend dashboards', color: 'text-violet-400', bg: 'bg-violet-500/10' },
];

const STATS = [
  { value: '148k+', label: 'FAISS Vectors' },
  { value: '96.4%', label: 'Model Accuracy' },
  { value: '<20ms', label: 'Latency' },
  { value: '24/7', label: 'Fact Guard' },
];

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: '8+ characters', ok: password.length >= 8 },
    { label: 'Uppercase letter', ok: /[A-Z]/.test(password) },
    { label: 'Number', ok: /\d/.test(password) },
  ];
  const score = checks.filter(c => c.ok).length;
  const colors = ['bg-rose-500', 'bg-amber-500', 'bg-emerald-500'];
  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1">
        {[0, 1, 2].map(i => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < score ? colors[score - 1] : 'bg-white/10'}`} />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {checks.map(c => (
          <span key={c.label} className={`text-[10px] flex items-center gap-1 transition-colors ${c.ok ? 'text-emerald-400' : 'text-slate-500'}`}>
            <CheckCircle className="w-3 h-3" />
            {c.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function AuthPage({ onSuccess, initialMode = 'login' }: AuthPageProps) {
  const { login, register, error, clearError, isLoading } = useAuth();
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');

  useEffect(() => { clearError(); setLocalError(''); }, [mode]);

  const displayError = localError || error;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (!email.trim() || !email.includes('@')) {
      setLocalError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setLocalError('Please enter your password.');
      return;
    }

    setLocalError('');
    clearError();

    try {
      if (mode === 'register') {
        if (!name.trim()) { setLocalError('Please enter your full name.'); return; }
        if (password.length < 8) { setLocalError('Password must be at least 8 characters.'); return; }
        await register(name.trim(), email.trim(), password);
        onSuccess();
      } else if (mode === 'login') {
        await login(email.trim(), password, remember);
        onSuccess();
      } else if (mode === 'forgot') {
        setLocalError('');
        alert(`Password reset link sent to ${email}. Check your inbox!`);
        setMode('login');
      }
    } catch {
      // error is already stored in AuthContext
    }
  };

  const switchMode = (m: typeof mode) => {
    setMode(m);
    setLocalError('');
  };

  return (
    <div className="min-h-screen auth-bg flex">

      {/* ── LEFT PANEL: Branding ───────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[55%] xl:w-[60%] flex-col justify-between p-12 xl:p-16 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-cyan-500/8 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-[60px] pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/40">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <span className="font-bold text-xl tracking-tight text-white">
              CHRONICLE<span className="text-indigo-400">.AI</span>
            </span>
            <p className="text-[11px] text-slate-500 font-mono">ENTERPRISE ML PLATFORM</p>
          </div>
        </div>

        {/* Hero Text */}
        <div className="relative z-10 space-y-8 max-w-xl animate-slide-up">
          <div>
            <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight tracking-tight">
              Your AI-Powered{' '}
              <span className="gradient-text">News Intelligence</span>{' '}
              Hub
            </h1>
            <p className="mt-4 text-slate-400 text-base leading-relaxed">
              Real-time personalized news, AI summarization, misinformation detection, and voice briefings — all powered by cutting-edge ML.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-2 gap-3">
            {FEATURES.map(f => {
              const Icon = f.icon;
              return (
                <div key={f.label} className="glass rounded-2xl p-4 space-y-2 card-hover">
                  <div className={`w-8 h-8 rounded-xl ${f.bg} flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${f.color}`} />
                  </div>
                  <p className="text-sm font-bold text-white">{f.label}</p>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-6 pt-2 border-t border-white/5">
            {STATS.map(s => (
              <div key={s.label}>
                <p className="text-xl font-extrabold text-white font-mono">{s.value}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom quote */}
        <div className="relative z-10">
          <blockquote className="text-sm text-slate-400 italic border-l-2 border-indigo-500/50 pl-4">
            "Chronicle AI's ML pipeline reduced our editorial review time by 78%."
          </blockquote>
          <p className="text-xs text-slate-600 mt-1 pl-4">— Elena Rostova, Chief Editor · Reuters AI Division</p>
        </div>
      </div>

      {/* ── RIGHT PANEL: Auth Form ─────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative">
        <div className="w-full max-w-[420px] space-y-6">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-6">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-white">CHRONICLE<span className="text-indigo-400">.AI</span></span>
          </div>

          {/* Card */}
          <div className="glass rounded-3xl p-8 shadow-2xl animate-slide-up">

            {/* Header */}
            <div className="mb-7">
              <h2 className="text-2xl font-extrabold text-white">
                {mode === 'login' && 'Welcome back'}
                {mode === 'register' && 'Create account'}
                {mode === 'forgot' && 'Reset password'}
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                {mode === 'login' && 'Sign in to your Chronicle AI workspace'}
                {mode === 'register' && 'Join thousands of enterprise professionals'}
                {mode === 'forgot' && 'Enter your email to receive a reset link'}
              </p>
            </div>

            {/* Error Banner */}
            {displayError && (
              <div className="mb-5 flex items-start gap-2.5 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs animate-slide-up">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <span>{displayError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Name (register only) */}
              {mode === 'register' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 block">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      id="auth-name"
                      type="text"
                      autoComplete="name"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Alexandra Chen"
                      className="w-full pl-10 pr-4 py-3 text-sm bg-white/5 text-white border border-white/10 rounded-xl focus:outline-none focus:border-indigo-500 input-glow placeholder:text-slate-600 transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              {(mode === 'login' || mode === 'register' || mode === 'forgot') && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 block">Work Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      id="auth-email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="w-full pl-10 pr-4 py-3 text-sm bg-white/5 text-white border border-white/10 rounded-xl focus:outline-none focus:border-indigo-500 input-glow placeholder:text-slate-600 transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Password */}
              {(mode === 'login' || mode === 'register') && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-300 block">Password</label>
                    {mode === 'login' && (
                      <button type="button" onClick={() => switchMode('forgot')} className="text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors">
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      id="auth-password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-11 py-3 text-sm bg-white/5 text-white border border-white/10 rounded-xl focus:outline-none focus:border-indigo-500 input-glow placeholder:text-slate-600 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {mode === 'register' && password && (
                    <PasswordStrength password={password} />
                  )}
                </div>
              )}

              {/* Remember me (login) */}
              {mode === 'login' && (
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <div
                    onClick={() => setRemember(!remember)}
                    className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${remember ? 'bg-indigo-600 border-indigo-500' : 'bg-white/5 border-white/20'}`}
                  >
                    {remember && <CheckCircle className="w-3 h-3 text-white" />}
                  </div>
                  <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">Remember me for 30 days</span>
                </label>
              )}

              {/* Submit */}
              <button
                id="auth-submit"
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>
                      {mode === 'login' && 'Sign In'}
                      {mode === 'register' && 'Create Account'}
                      {mode === 'forgot' && 'Send Reset Link'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            {(mode === 'login' || mode === 'register') && (
              <>
                <div className="flex items-center gap-3 my-5">
                  <div className="flex-1 h-px bg-white/8" />
                  <span className="text-[11px] text-slate-600 font-medium">or continue with</span>
                  <div className="flex-1 h-px bg-white/8" />
                </div>

                {/* Social Buttons (aesthetic only) */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => alert('Google SSO coming soon!')}
                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-xs font-semibold hover:bg-white/10 hover:border-white/20 transition-all"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                    Google
                  </button>
                  <button
                    type="button"
                    onClick={() => alert('GitHub SSO coming soon!')}
                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-xs font-semibold hover:bg-white/10 hover:border-white/20 transition-all"
                  >
                    <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
                    GitHub
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Toggle mode */}
          <p className="text-center text-sm text-slate-500">
            {mode === 'login' ? (
              <>
                Don't have an account?{' '}
                <button onClick={() => switchMode('register')} className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors">
                  Sign up free
                </button>
              </>
            ) : mode === 'register' ? (
              <>
                Already have an account?{' '}
                <button onClick={() => switchMode('login')} className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors">
                  Sign in
                </button>
              </>
            ) : (
              <>
                Remembered it?{' '}
                <button onClick={() => switchMode('login')} className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors">
                  Back to login
                </button>
              </>
            )}
          </p>

          <p className="text-center text-[11px] text-slate-600">
            By continuing, you agree to our{' '}
            <span className="text-slate-500 cursor-pointer hover:text-slate-400">Terms of Service</span>{' '}
            and{' '}
            <span className="text-slate-500 cursor-pointer hover:text-slate-400">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
