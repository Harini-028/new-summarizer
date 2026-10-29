import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, ShieldAlert, UserPlus, Mail, Lock, User, 
  KeyRound, CheckCircle2, AlertCircle, Loader2, X, Eye, EyeOff,
  Server, Calendar, RefreshCw
} from 'lucide-react';
import { UserProfile } from '../../types';

interface AdminAccountManagementViewProps {
  onToast: (msg: string) => void;
}

export const AdminAccountManagementView: React.FC<AdminAccountManagementViewProps> = ({ onToast }) => {
  const [admins, setAdmins] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const token = localStorage.getItem('chronicle_admin_token') || 
                localStorage.getItem('chronicle_token') || 
                sessionStorage.getItem('chronicle_admin_token') || 
                sessionStorage.getItem('chronicle_token');

  const fetchAdmins = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/users', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      const data = await res.json();
      const userList: UserProfile[] = Array.isArray(data) ? data : (data.users || []);
      // Filter for administrators
      const adminList = userList.filter(u => u.role === 'admin');
      setAdmins(adminList);
    } catch (err: any) {
      console.error('Failed to fetch administrator accounts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchAdmins();
  }, []);

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setFormError(null);

    if (!name.trim() || name.trim().length < 2) {
      setFormError('Please enter administrator full name (at least 2 characters).');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setFormError('Please enter a valid administrator email address.');
      return;
    }
    if (!password || password.length < 8) {
      setFormError('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/users/create-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          confirmPassword
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create administrator account.');
      }

      onToast(`Administrator account "${email}" provisioned successfully.`);
      setIsModalOpen(false);
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      void fetchAdmins();
    } catch (err: any) {
      setFormError(err.message || 'An error occurred during administrator provisioning.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center border border-indigo-500/30 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold uppercase tracking-wider mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              RESTRICTED AUTHORIZATION ZONE
            </div>
            <h1 className="text-xl font-extrabold text-white">Administrator Account Management</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Authorized administrators directory. Provision new administrators or verify active credentials.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchAdmins}
            disabled={isLoading}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 transition-colors cursor-pointer"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-indigo-400' : ''}`} />
          </button>

          <button
            onClick={() => { setIsModalOpen(true); setFormError(null); }}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-950/60 flex items-center gap-2 transition-all cursor-pointer border border-indigo-400/20 active:scale-95"
          >
            <UserPlus className="w-4 h-4" />
            <span>Provision Administrator</span>
          </button>
        </div>
      </div>

      {/* Security Info Card */}
      <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-slate-300 flex items-start gap-3">
        <KeyRound className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-white">Zero Public Registration Architecture</p>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Public visitors cannot register as administrators. New administrator accounts may only be created through this secure panel by an authenticated administrator, or via the server seed script (<code className="text-indigo-300 font-mono">npm run create-admin</code>). All credentials are protected with bcrypt cryptographic hashing.
          </p>
        </div>
      </div>

      {/* Administrators Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Active Administrator Accounts
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {admins.length} {admins.length === 1 ? 'Admin' : 'Admins'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono">
            <Server className="w-3.5 h-3.5 text-emerald-400" />
            <span>MongoDB Atlas Cluster</span>
          </div>
        </div>

        {isLoading ? (
          <div className="p-12 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mx-auto" />
            <p className="text-xs text-slate-400 font-mono">Loading administrator directory...</p>
          </div>
        ) : admins.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <ShieldAlert className="w-10 h-10 text-amber-500 mx-auto" />
            <h3 className="text-sm font-bold text-white">No administrators listed</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Provision an administrator using the button above or run the CLI setup script.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-slate-300">
              <thead className="bg-slate-900/60 text-slate-400 font-mono text-[10px] uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-3.5 text-left">Administrator</th>
                  <th className="p-3.5 text-left">System Role</th>
                  <th className="p-3.5 text-left">Security Status</th>
                  <th className="p-3.5 text-left">Subscription Plan</th>
                  <th className="p-3.5 text-right">Access Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {admins.map(adm => (
                  <tr key={adm.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-white text-xs border border-indigo-400/30">
                          {adm.name ? adm.name.charAt(0).toUpperCase() : 'A'}
                        </div>
                        <div>
                          <div className="font-bold text-white text-xs flex items-center gap-1.5">
                            <span>{adm.name}</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          </div>
                          <div className="text-slate-400 font-mono text-[11px]">{adm.email}</div>
                        </div>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 uppercase tracking-wider">
                        Administrator
                      </span>
                    </td>

                    <td className="p-3.5">
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Verified Active</span>
                      </span>
                    </td>

                    <td className="p-3.5 font-mono text-slate-300">
                      {adm.plan || 'Enterprise SaaS'}
                    </td>

                    <td className="p-3.5 text-right font-mono text-[11px] text-purple-400 font-bold">
                      Full Root Clearance
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Provision Administrator Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 animate-in fade-in duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Provision Administrator</h3>
                  <p className="text-[10px] text-slate-400">Grant administrator credentials to a verified team member</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Error banner */}
            {formError && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span className="flex-1">{formError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleCreateAdmin} className="space-y-3.5">
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 font-mono block">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Marcus Vance"
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 font-mono block">Work Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="marcus@chronicle.ai"
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 font-mono block">Password (Min. 8 characters)</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-9 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 font-mono block">Confirm Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-9 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Create Administrator</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
