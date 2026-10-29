import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Lock, Mail, Eye, EyeOff, Loader2, AlertCircle, 
  ArrowLeft, KeyRound, Server, CheckCircle2, Cpu
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

interface AdminLoginPageProps {
  onSuccess: () => void;
  onNavigateHome?: () => void;
}

export default function AdminLoginPage({ onSuccess, onNavigateHome }: AdminLoginPageProps) {
  const { login, isAuthenticated, error, clearError, isLoading } = useAdminAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [localError, setLocalError] = useState<string | null>(null);

  // If already authenticated as admin, trigger success
  useEffect(() => {
    if (isAuthenticated) {
      onSuccess();
    }
  }, [isAuthenticated, onSuccess]);

  useEffect(() => {
    clearError();
    setLocalError(null);
  }, [clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (!email.trim() || !email.includes('@')) {
      setLocalError('Please enter a valid administrator email address.');
      return;
    }

    if (!password) {
      setLocalError('Please enter your administrator password.');
      return;
    }

    setLocalError(null);
    clearError();

    try {
      await login(email.trim(), password, remember);
      onSuccess();
    } catch (err: any) {
      // Error is captured in context or returned
      setLocalError(err.message || 'Authentication failed. Please verify credentials.');
    }
  };

  const activeError = localError || error;

  return (
    <div className="min-h-screen bg-[#05070f] text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans selection:bg-indigo-600 selection:text-white">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-indigo-600/15 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-purple-600/15 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-slate-900/40 rounded-full blur-[160px] pointer-events-none" />

      {/* Top Navigation / Back to Public Portal */}
      <div className="w-full max-w-md flex items-center justify-between mb-8 z-10">
        <button
          type="button"
          onClick={() => {
            if (onNavigateHome) onNavigateHome();
            else {
              window.history.pushState({}, '', '/');
              window.dispatchEvent(new PopStateEvent('popstate'));
            }
          }}
          className="flex items-center gap-2 text-xs font-mono font-bold text-slate-400 hover:text-white transition-colors px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Website</span>
        </button>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          SECURE PROTOCOL v2.5
        </div>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md bg-slate-950/80 backdrop-blur-xl border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-indigo-950/40 z-10 space-y-6">
        
        {/* Header / Brand */}
        <div className="text-center space-y-2.5">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 text-white shadow-xl shadow-indigo-900/50 mb-1 border border-indigo-400/30">
            <ShieldCheck className="w-7 h-7" />
          </div>

          <div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-xl font-black tracking-tight text-white font-mono">
                CHRONICLE<span className="text-indigo-400">.AI</span>
              </span>
              <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-widest bg-rose-500/15 text-rose-400 border border-rose-500/30 rounded-md">
                ADMIN
              </span>
            </div>
            <h1 className="text-xl font-bold text-white mt-1">
              Admin Portal
            </h1>
            <p className="text-xs text-slate-400 max-w-xs mx-auto mt-0.5">
              Manage news, articles, and AI-powered content
            </p>
          </div>
        </div>

        {/* Error Notification */}
        {activeError && (
          <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1 font-medium leading-relaxed">
              {activeError}
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Admin Email */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300 font-mono flex items-center justify-between">
              <span>Admin Email</span>
              <span className="text-[10px] text-slate-500 font-normal">Registered administrator ID</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                autoFocus
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@chronicle.ai"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-100 text-xs placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300 font-mono flex items-center justify-between">
              <span>Password</span>
              <span className="text-[10px] text-slate-500 font-normal">Encrypted credentials</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-100 text-xs placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
                className="w-3.5 h-3.5 rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0 cursor-pointer"
              />
              <span className="text-xs text-slate-400">Remember admin session</span>
            </label>

            <span className="text-[10px] font-mono text-indigo-400 flex items-center gap-1">
              <KeyRound className="w-3 h-3" /> 256-bit JWT
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs tracking-wide shadow-lg shadow-indigo-950/60 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer border border-indigo-400/20 active:scale-[0.99]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                <span>Sign In as Admin</span>
              </>
            )}
          </button>
        </form>

        {/* First Admin Setup Link */}
        <div className="pt-1 text-center">
          <a
            href="/admin/register"
            onClick={(e) => {
              e.preventDefault();
              window.history.pushState({}, '', '/admin/register');
              window.dispatchEvent(new PopStateEvent('popstate'));
            }}
            className="text-[11px] text-slate-500 hover:text-indigo-400 transition-colors font-mono"
          >
            First-time deployment? <span className="text-indigo-400 underline">Configure First Administrator</span>
          </a>
        </div>

        {/* Security Notice */}
        <div className="pt-4 border-t border-slate-800/80 text-center space-y-2">
          <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-500 font-mono">
            <Server className="w-3 h-3 text-emerald-400" />
            <span>Connected to MongoDB Atlas Security Cluster</span>
          </div>
          <p className="text-[10px] text-slate-600 leading-relaxed">
            Restricted access portal for authorized administrators only. Unauthorized access attempts are monitored and recorded.
          </p>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-8 text-center text-xs text-slate-600 font-mono z-10">
        Chronicle AI Enterprise Edition • Production SaaS Build
      </div>
    </div>
  );
}
