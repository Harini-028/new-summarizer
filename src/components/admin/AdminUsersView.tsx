import React, { useState } from 'react';
import { Users, Search, UserCheck, UserX, Shield, Edit3, Send, Check } from 'lucide-react';
import { UserProfile } from '../../types';

interface AdminUsersViewProps {
  users: UserProfile[];
  onToast: (msg: string) => void;
}

export const AdminUsersView: React.FC<AdminUsersViewProps> = ({ users, onToast }) => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [userList, setUserList] = useState<UserProfile[]>(
    users.length > 0 ? users : [
      { id: 'u_1', name: 'Dr. Evelyn Vance', email: 'evelyn@chronicle.ai', avatarUrl: '', role: 'admin', plan: 'Enterprise SaaS', interests: ['AI & Technology'], readingStats: { totalArticlesRead: 142, totalMinutesSpent: 520, streakDays: 14, savedArticlesCount: 28, favoriteCategory: 'AI & Technology' }, preferences: { theme: 'dark', dailyBriefingEmail: true, voiceAccent: 'Kore', autoSummarizeOnOpen: true, fakeNewsSensitivity: 'High' } },
      { id: 'u_2', name: 'Marcus Brody', email: 'marcus@mit.edu', avatarUrl: '', role: 'subscriber', plan: 'Pro Member', interests: ['Science & Space'], readingStats: { totalArticlesRead: 89, totalMinutesSpent: 310, streakDays: 7, savedArticlesCount: 14, favoriteCategory: 'Science & Space' }, preferences: { theme: 'dark', dailyBriefingEmail: true, voiceAccent: 'Kore', autoSummarizeOnOpen: true, fakeNewsSensitivity: 'Medium' } },
      { id: 'u_3', name: 'Sophia Chen', email: 'sophia@stanford.edu', avatarUrl: '', role: 'user', plan: 'Free Tier', interests: ['Business & Finance'], readingStats: { totalArticlesRead: 34, totalMinutesSpent: 120, streakDays: 3, savedArticlesCount: 5, favoriteCategory: 'Business & Finance' }, preferences: { theme: 'dark', dailyBriefingEmail: false, voiceAccent: 'Kore', autoSummarizeOnOpen: false, fakeNewsSensitivity: 'Medium' } }
    ]
  );

  const filtered = userList.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const toggleUserRole = (id: string, currentRole: string) => {
    const nextRole = currentRole === 'admin' ? 'subscriber' : currentRole === 'subscriber' ? 'user' : 'admin';
    setUserList(prev => prev.map(u => u.id === id ? { ...u, role: nextRole as any } : u));
    onToast(`Updated user role to ${nextRole.toUpperCase()}`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">User Directory & Role Authorization</h2>
            <p className="text-xs text-slate-400">Manage user accounts, assign roles (`admin`, `moderator`, `user`), and track engagement stats</p>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-slate-950 border border-slate-800">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search users by name or email..."
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <select
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
          className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none font-mono"
        >
          <option value="ALL">All Roles</option>
          <option value="admin">Admin</option>
          <option value="subscriber">Subscriber</option>
          <option value="user">User</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950">
        <table className="w-full text-xs text-slate-300">
          <thead className="bg-slate-950 text-slate-500 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="p-3.5 text-left">User Profile</th>
              <th className="p-3.5 text-left">Role</th>
              <th className="p-3.5 text-left">Subscription Plan</th>
              <th className="p-3.5 text-left">Articles Read</th>
              <th className="p-3.5 text-left">Streak</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filtered.map(u => (
              <tr key={u.id} className="hover:bg-slate-900/60 transition-colors">
                <td className="p-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-white text-xs">
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-100">{u.name}</div>
                      <div className="text-slate-500 font-mono text-[10px]">{u.email}</div>
                    </div>
                  </div>
                </td>

                <td className="p-3.5">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${
                    u.role === 'admin' ? 'bg-rose-500/15 text-rose-400 border-rose-500/30' :
                    u.role === 'subscriber' ? 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30' :
                    'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    {u.role}
                  </span>
                </td>

                <td className="p-3.5 font-mono text-slate-400 text-[10px]">
                  {u.plan}
                </td>

                <td className="p-3.5 font-mono font-bold text-indigo-400">
                  {u.readingStats?.totalArticlesRead || 0}
                </td>

                <td className="p-3.5 font-mono text-emerald-400 font-bold">
                  🔥 {u.readingStats?.streakDays || 0} days
                </td>

                <td className="p-3.5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => toggleUserRole(u.id, u.role)}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-indigo-500 text-slate-300 font-bold text-[10px] cursor-pointer"
                    >
                      Cycle Role
                    </button>
                    <button
                      onClick={() => onToast(`Password reset link sent to ${u.email}`)}
                      className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-500 text-slate-400 hover:text-amber-400 cursor-pointer"
                      title="Send Password Reset"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
