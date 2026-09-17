import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Search,
  Bell,
  Sun,
  Moon,
  ShieldCheck,
  Cpu,
  FolderGit2,
  Volume2,
  LogOut,
  Settings,
  User as UserIcon,
  ChevronDown,
  LogIn,
  UserPlus,
  X
} from 'lucide-react';
import { UserProfile, ActivePage } from '../types';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  user: UserProfile;
  activePage: ActivePage;
  onNavigate: (page: ActivePage) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenFakeNewsDetector: () => void;
  onOpenArchitecture: () => void;
  onOpenDailyBrief: () => void;
  onToggleTheme: () => void;
  onOpenProfile: () => void;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export default function Header({
  user,
  activePage,
  onNavigate,
  searchQuery,
  onSearchChange,
  onOpenFakeNewsDetector,
  onOpenArchitecture,
  onOpenDailyBrief,
  onToggleTheme,
  onOpenProfile,
  onOpenAuth,
  onLogout,
}: HeaderProps) {
  const { isAuthenticated } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: '1', title: 'AI Daily Briefing Ready', time: '10m ago', unread: true },
    { id: '2', title: 'Fake News Alert: Viral Health Post Flagged', time: '1h ago', unread: true },
    { id: '3', title: '3 New Articles in AI & Technology', time: '3h ago', unread: false }
  ]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
        setShowLogoutConfirm(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      }

      if (event.key === 'Escape' && document.activeElement === searchInputRef.current) {
        onSearchChange('');
        searchInputRef.current?.blur();
      }
    };

    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onSearchChange]);

  const unreadNotificationCount = notifications.filter(notification => notification.unread).length;

  const markNotificationRead = (id: string) => {
    setNotifications(current => current.map(notification => (
      notification.id === id ? { ...notification, unread: false } : notification
    )));
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleLogoutConfirm = () => {
    setShowUserMenu(false);
    setShowLogoutConfirm(false);
    onLogout();
  };

  return (
    <header className="sticky top-0 z-30 bg-[#080808]/90 backdrop-blur-md border-b border-white/10 text-slate-100 px-4 lg:px-8 py-3.5 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">

        {/* Left: Brand Logo */}
        <div className="flex items-center justify-between">
          <div
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center font-bold italic text-white shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xl tracking-tight text-white">
                  CHRONICLE<span className="text-indigo-500">.AI</span>
                </span>
                <span className="px-2.5 py-0.5 text-[10px] uppercase tracking-widest font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded-full hidden sm:inline">
                  ENTERPRISE ML
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Personalized News Intelligence & Misinformation Guard
              </p>
            </div>
          </div>

          {/* Mobile actions */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10"
            >
              {user.preferences.theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
            {isAuthenticated ? (
              <button onClick={onOpenProfile} className="w-8 h-8 rounded-full ring-2 ring-indigo-500/50 overflow-hidden">
                <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-3 py-1.5 rounded-full bg-indigo-600 text-white text-xs font-bold"
              >
                Sign In
              </button>
            )}
          </div>
        </div>

        {/* Middle: Search Bar */}
        <div className="flex-1 max-w-xl mx-0 md:mx-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => {
                onSearchChange(e.target.value);
                if (activePage !== 'search' && e.target.value.trim().length > 0) {
                  onNavigate('search');
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  onNavigate('search');
                }
              }}
              placeholder="Query the world or search topics..."
              className="w-full pl-11 pr-24 py-2 text-sm bg-white/5 text-white border border-white/10 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-500"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => { onSearchChange(''); searchInputRef.current?.focus(); }}
                  className="p-1 text-slate-400 hover:text-white transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-white/5 rounded border border-white/10">
                {navigator.platform.toLowerCase().includes('mac') ? '⌘K' : 'Ctrl K'}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Tools + Auth */}
        <div className="hidden md:flex items-center gap-2">

          {/* Fact Guard */}
          <button
            onClick={onOpenFakeNewsDetector}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all uppercase tracking-wider"
          >
            <ShieldCheck className="w-4 h-4" />
            <span className="hidden lg:inline">Fact Guard</span>
          </button>

          {/* Daily Brief */}
          <button
            onClick={onOpenDailyBrief}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/20 transition-all uppercase tracking-wider"
          >
            <Volume2 className="w-4 h-4 animate-pulse" />
            <span className="hidden lg:inline">Daily Brief</span>
          </button>

          {/* Architecture */}
          <button
            onClick={onOpenArchitecture}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 transition-all uppercase tracking-wider"
          >
            <FolderGit2 className="w-4 h-4" />
            <span className="hidden lg:inline">Architecture</span>
          </button>

          <div className="h-5 w-px bg-white/10 my-auto mx-1" />

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-full bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white transition-all border border-white/10 relative"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-indigo-500 text-[9px] font-bold text-white flex items-center justify-center ring-2 ring-[#050505]">
                  {unreadNotificationCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl p-3 z-50 animate-in">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Notifications</span>
                  <button
                    type="button"
                    onClick={() => setNotifications(current => current.map(notification => ({ ...notification, unread: false })))}
                    disabled={unreadNotificationCount === 0}
                    className="text-[10px] font-semibold text-indigo-400 hover:text-indigo-300 disabled:text-slate-600 disabled:cursor-default"
                  >
                    Mark all read
                  </button>
                </div>
                <div className="space-y-2">
                  {notifications.map(n => (
                    <button
                      type="button"
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className="w-full p-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all text-xs cursor-pointer text-left"
                    >
                      <div className="flex items-center justify-between font-medium text-slate-200">
                        <span>{n.title}</span>
                        {n.unread && <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">{n.time}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-full bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white transition-all border border-white/10"
            title="Toggle Theme"
          >
            {user.preferences.theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* ── Auth Area ── */}
          {isAuthenticated ? (
            /* User Avatar Dropdown */
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => { setShowUserMenu(!showUserMenu); setShowLogoutConfirm(false); }}
                className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer"
              >
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-6 h-6 rounded-full object-cover ring-1 ring-indigo-400"
                  onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff&size=64`; }}
                />
                <div className="text-left hidden xl:block">
                  <p className="text-xs font-bold text-white leading-tight">{user.name.split(' ')[0]}</p>
                  <p className="text-[10px] text-indigo-400 font-mono leading-tight">{user.plan}</p>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl p-2 z-50 animate-in">
                  {/* User Info */}
                  <div className="px-3 py-2.5 border-b border-white/8 mb-2">
                    <p className="text-xs font-bold text-white">{user.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                    <span className="mt-1 inline-block px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {user.plan}
                    </span>
                  </div>

                  {!showLogoutConfirm ? (
                    <>
                      <button
                        onClick={() => { setShowUserMenu(false); onOpenProfile(); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-white/8 hover:text-white transition-all text-left"
                      >
                        <UserIcon className="w-4 h-4 text-slate-400" />
                        Profile & Settings
                      </button>
                      <button
                        onClick={handleLogoutClick}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 transition-all text-left mt-1"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <div className="px-3 py-2 space-y-2">
                      <p className="text-xs text-slate-300">Are you sure you want to sign out?</p>
                      <div className="flex gap-2">
                        <button
                          onClick={handleLogoutConfirm}
                          className="flex-1 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all"
                        >
                          Yes, Sign Out
                        </button>
                        <button
                          onClick={() => setShowLogoutConfirm(false)}
                          className="flex-1 py-1.5 rounded-lg bg-white/8 hover:bg-white/15 text-white text-xs font-bold transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* Sign In / Sign Up Buttons */
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 text-xs font-bold transition-all"
              >
                <LogIn className="w-3.5 h-3.5" />
                Sign In
              </button>
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Get Started
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
