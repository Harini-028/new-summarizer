import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, ShieldAlert, Lock, Mail, User, Eye, EyeOff, 
  Loader2, AlertCircle, ArrowLeft, CheckCircle2, Server, KeyRound,
  ArrowRight, Sparkles
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

interface AdminRegisterPageProps {
  onSuccess: () => void;
  onNavigateLogin?: () => void;
  onNavigateHome?: () => void;
}

export default function AdminRegisterPage({ onSuccess, onNavigateLogin, onNavigateHome }: AdminRegisterPageProps) {
  const { isAuthenticated } = useAdminAuth();

  // Status check
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const [setupAvailable, setSetupAvailable] = useState<boolean | null>(null);
  const [requiresToken, setRequiresToken] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [setupToken, setSetupToken] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // UI states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // If already authenticated as admin, go straight to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      onSuccess();
    }
  }, [isAuthenticated, onSuccess]);

  // Check setup availability from backend on mount
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch('/api/admin/setup/status');
        const data = await res.json();
        setSetupAvailable(!!data.setupAvailable);
        setRequiresToken(!!data.requiresToken);
        setStatusMessage(data.message || '');
      } catch (err: any) {
        // Fallback: default to restricted for security
        setSetupAvailable(false);
        setStatusMessage('Administrator registration is restricted. Please contact the system administrator.');
      } finally {
        setIsCheckingStatus(false);
      }
    };

    void checkStatus();
  }, []);

  const handleNavigateLogin = () => {
    if (onNavigateLogin) {
      onNavigateLogin();
    } else {
      window.history.pushState({}, '', '/admin/login');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  const handleNavigateHome = () => {
    if (onNavigateHome) {
      onNavigateHome();
    } else {
      window.history.pushState({}, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setErrorMessage(null);
    setSuccessMessage(null);

    // Validation
    if (!name.trim() || name.trim().length < 2) {
      setErrorMessage('Please enter the administrator full name (at least 2 characters).');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid administrator email address.');
      return;
    }

    if (!password || password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter your password.');
      return;
    }

    if (requiresToken && !setupToken.trim()) {
      setErrorMessage('Administrator setup token is required by system security configuration.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/admin/setup/first-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          confirmPassword,
          setupToken: setupToken.trim() || undefined
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create administrator account.');
      }

      // Persist session if token returned
      if (data.token) {
        localStorage.setItem('chronicle_admin_token', data.token);
        if (data.refreshToken) {
          localStorage.setItem('chronicle_admin_refresh_token', data.refreshToken);
        }
        if (data.user) {
          localStorage.setItem('chronicle_admin_user', JSON.stringify(data.user));
        }
      }

      setSuccessMessage('Administrator account created successfully! Redirecting to Admin Dashboard...');

      setTimeout(() => {
        onSuccess();
      }, 1500);

    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during administrator provisioning.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05070f] text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans selection:bg-indigo-600 selection:text-white">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-indigo-600/15 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-purple-600/15 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-slate-900/40 rounded-full blur-[160px] pointer-events-none" />

      {/* Top Navigation */}
      <div className="w-full max-w-md flex items-center justify-between mb-8 z-10">
        <button
          type="button"
          onClick={handleNavigateHome}
          className="flex items-center gap-2 text-xs font-mono font-bold text-slate-400 hover:text-white transition-colors px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Website</span>
        </button>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-[10px] font-mono font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          SETUP PROTOCOL v2.5
        </div>
      </div>

      {/* Checking Status Spinner */}
      {isCheckingStatus ? (
        <div className="w-full max-w-md bg-slate-950/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-12 text-center shadow-2xl z-10 space-y-4">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-mono">Verifying system security protocol...</p>
        </div>
      ) : setupAvailable === false ? (
        /* ── RESTRICTED STATE: Initial setup already complete ── */
        <div className="w-full max-w-md bg-slate-950/80 backdrop-blur-xl border border-rose-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-rose-950/20 z-10 space-y-6 text-center animate-in fade-in duration-300">
          
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/30 mx-auto shadow-lg shadow-rose-950/40">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30 text-[10px] font-mono font-bold uppercase tracking-wider">
              Access Restricted
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Administrator Registration Restricted
            </h1>
            <p className="text-xs text-slate-300 font-medium leading-relaxed bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 mt-2">
              {statusMessage || 'Administrator registration is restricted. Please contact the system administrator.'}
            </p>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed text-left">
            Chronicle AI employs strict role-based access control. Public registration of administrator accounts is disabled. Additional administrators may only be created by an authenticated administrator from within the Admin Portal.
          </p>

          <div className="space-y-2.5 pt-2">
            <button
              type="button"
              onClick={handleNavigateLogin}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs tracking-wide shadow-lg shadow-indigo-950/60 transition-all flex items-center justify-center gap-2 cursor-pointer border border-indigo-400/20"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>Sign In as Admin</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </button>

            <button
              type="button"
              onClick={handleNavigateHome}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800 transition-all cursor-pointer"
            >
              Return to Chronicle AI Homepage
            </button>
          </div>

          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-center gap-1.5 text-[10px] text-slate-500 font-mono">
            <Server className="w-3 h-3 text-emerald-400" />
            <span>MongoDB Atlas Cluster Security Verified</span>
          </div>
        </div>
      ) : (
        /* ── AVAILABLE STATE: First Administrator Setup Form ── */
        <div className="w-full max-w-md bg-slate-950/80 backdrop-blur-xl border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-indigo-950/40 z-10 space-y-6 animate-in fade-in duration-300">
          
          {/* Header */}
          <div className="text-center space-y-2.5">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 text-white shadow-xl shadow-indigo-900/50 mb-1 border border-indigo-400/30">
              <ShieldCheck className="w-7 h-7" />
            </div>

            <div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-xl font-black tracking-tight text-white font-mono">
                  CHRONICLE<span className="text-indigo-400">.AI</span>
                </span>
                <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-widest bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 rounded-md">
                  INITIAL SETUP
                </span>
              </div>
              <h1 className="text-xl font-bold text-white mt-1">
                First Administrator Setup
              </h1>
              <p className="text-xs text-slate-400 max-w-xs mx-auto mt-0.5">
                Provision the root administrator account. This form will be permanently restricted once setup completes.
              </p>
            </div>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {/* Success Banner */}
          {successMessage && (
            <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium leading-relaxed">{successMessage}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Admin Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300 font-mono">
                Admin Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  autoFocus
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Alexandra Vance"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-100 text-xs placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
                />
              </div>
            </div>

            {/* Admin Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300 font-mono">
                Admin Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@chronicle.ai"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-100 text-xs placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-300 font-mono">
                  Administrator Password
                </label>
                <span className="text-[10px] text-slate-500 font-mono">Min. 8 characters</span>
              </div>
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

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300 font-mono">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-100 text-xs placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                  title={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Optional Setup Token field if required */}
            {requiresToken && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-300 font-mono">
                    Setup Authorization Token
                  </label>
                  <span className="text-[10px] text-amber-400 font-mono">Env Token Required</span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={setupToken}
                    onChange={e => setSetupToken(e.target.value)}
                    placeholder="Enter ADMIN_SETUP_TOKEN from server environment"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-amber-500/40 text-slate-100 text-xs placeholder:text-slate-600 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all font-mono"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs tracking-wide shadow-lg shadow-indigo-950/60 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer border border-indigo-400/20 active:scale-[0.99] mt-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Provisioning Administrator...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Create Admin Account</span>
                </>
              )}
            </button>
          </form>

          {/* Already have an account link */}
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={handleNavigateLogin}
              className="text-xs text-slate-400 hover:text-indigo-400 transition-colors font-medium"
            >
              Already configured? <span className="text-indigo-400 underline font-semibold">Sign in as Admin</span>
            </button>
          </div>

          {/* Security Notice */}
          <div className="pt-4 border-t border-slate-800/80 text-center space-y-1.5">
            <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-500 font-mono">
              <Server className="w-3 h-3 text-emerald-400" />
              <span>MongoDB Atlas Multi-Factor Password Hashing (bcrypt)</span>
            </div>
            <p className="text-[10px] text-slate-600 leading-relaxed">
              Upon successful registration, setup will automatically lock to ensure zero unauthorized administrator creations.
            </p>
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="mt-8 text-center text-xs text-slate-600 font-mono z-10">
        Chronicle AI Enterprise Edition • Secure Account Provisioning
      </div>
    </div>
  );
}
