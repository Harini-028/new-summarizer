import React from 'react';
import { ShieldAlert, Lock, ArrowLeft, KeyRound, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AdminForbiddenPageProps {
  onBackToHome?: () => void;
  onAdminLogin?: () => void;
}

export default function AdminForbiddenPage({ onBackToHome, onAdminLogin }: AdminForbiddenPageProps) {
  const { user, logout } = useAuth();

  const handleGoHome = () => {
    if (onBackToHome) onBackToHome();
    else {
      window.history.pushState({}, '', '/');
      window.location.href = '/';
    }
  };

  const handleAdminLogin = () => {
    if (onAdminLogin) onAdminLogin();
    else {
      window.history.pushState({}, '', '/admin/login');
      window.location.href = '/admin/login';
    }
  };

  const handleSignOutAndAdminLogin = () => {
    logout();
    handleAdminLogin();
  };

  return (
    <div className="min-h-screen bg-[#05070f] text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans selection:bg-rose-600 selection:text-white">
      {/* Background glow effects */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-rose-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-amber-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-slate-900/40 rounded-full blur-[160px] pointer-events-none" />

      {/* Main card */}
      <div className="w-full max-w-lg bg-slate-950/85 backdrop-blur-xl border border-rose-900/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-rose-950/40 z-10 space-y-6 text-center">
        
        {/* Shield Icon Badge */}
        <div className="mx-auto inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-rose-600 to-amber-600 text-white shadow-xl shadow-rose-950/60 border border-rose-400/30">
          <ShieldAlert className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono font-bold">
            <Lock className="w-3.5 h-3.5" />
            HTTP 403 • ACCESS FORBIDDEN
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Administrator Privilege Required
          </h1>
          <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            The Chronicle AI Administrative Portal is strictly restricted to verified system administrators. Your account does not have sufficient clearance to access this route.
          </p>
        </div>

        {/* User Identity Info */}
        {user && (
          <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-800/30 text-left space-y-1 text-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span>Authenticated Account:</span>
              <span className="font-mono text-white font-medium">{user.email}</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Assigned Role:</span>
              <span className="px-2 py-0.5 rounded-md bg-slate-800 text-amber-300 font-mono font-bold capitalize">
                {user.role || 'standard_user'}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Required Role:</span>
              <span className="px-2 py-0.5 rounded-md bg-rose-900/50 text-rose-300 font-mono font-bold">
                admin
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <button
            type="button"
            onClick={handleAdminLogin}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-indigo-950/50 transition-all cursor-pointer"
          >
            <KeyRound className="w-4 h-4" />
            <span>Log In with Administrator Account</span>
          </button>

          {user && (
            <button
              type="button"
              onClick={handleSignOutAndAdminLogin}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-medium text-xs border border-slate-800 hover:border-slate-700 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out Current Account & Switch to Admin</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleGoHome}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-slate-900/60 hover:bg-slate-900 text-slate-400 hover:text-white font-medium text-xs border border-slate-800 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Chronicle AI News Feed</span>
          </button>
        </div>

        <p className="text-[11px] text-slate-600 font-mono">
          Security policy enforced via backend JWT role verification and MongoDB Atlas schema.
        </p>
      </div>
    </div>
  );
}
