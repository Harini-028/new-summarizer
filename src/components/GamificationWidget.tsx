import React, { useState, useEffect } from 'react';
import { Trophy, Lock, RefreshCw, Star } from 'lucide-react';
import { UserProfile } from '../types';

interface Achievement {
  id: string; icon: string; title: string; description: string;
  isUnlocked: boolean; progress: number; category: string;
  unlockedAt?: string;
}

interface GamificationWidgetProps {
  user: UserProfile;
  compact?: boolean;
}

export default function GamificationWidget({ user, compact = false }: GamificationWidgetProps) {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [unlockedCount, setUnlockedCount] = useState(0);

  useEffect(() => {
    const params = `?userId=${user.id}&email=${encodeURIComponent(user.email)}`;
    fetch(`/api/user/achievements${params}`)
      .then(r => r.json())
      .then(d => {
        setAchievements(d.achievements || []);
        setUnlockedCount(d.unlockedCount || 0);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [user.id]);

  if (isLoading) {
    return (
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center h-24">
        <div className="w-5 h-5 rounded-full border-2 border-indigo-600/30 border-t-indigo-600 animate-spin" />
      </div>
    );
  }

  if (compact) {
    const unlocked = achievements.filter(a => a.isUnlocked);
    return (
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-slate-200">Achievements</span>
          </div>
          <span className="text-xs font-mono text-amber-400 font-bold">{unlockedCount}/{achievements.length}</span>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {unlocked.slice(0, 5).map(a => (
            <div key={a.id} title={a.title} className="text-lg leading-none filter drop-shadow-lg">{a.icon}</div>
          ))}
          {unlockedCount === 0 && (
            <span className="text-[10px] text-slate-500">Complete reading goals to unlock achievements</span>
          )}
        </div>
        <div className="w-full bg-slate-800 rounded-full h-1.5">
          <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-400"
            style={{ width: `${(unlockedCount / Math.max(achievements.length, 1)) * 100}%` }} />
        </div>
      </div>
    );
  }

  const categories = ['streak', 'reading', 'engagement', 'exploration'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-900/20 to-slate-900 border border-amber-500/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">Achievements</h2>
            <p className="text-xs text-slate-400">Track your reading milestones and unlock professional badges</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-400 font-semibold">{unlockedCount} / {achievements.length} Unlocked</span>
              <span className="text-amber-400 font-bold font-mono">{Math.round((unlockedCount / Math.max(achievements.length, 1)) * 100)}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2.5">
              <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-400 transition-all duration-700"
                style={{ width: `${(unlockedCount / Math.max(achievements.length, 1)) * 100}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Achievement Grid by Category */}
      {categories.map(cat => {
        const catAchievements = achievements.filter(a => a.category === cat);
        if (catAchievements.length === 0) return null;
        return (
          <div key={cat} className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Star className="w-3.5 h-3.5 text-amber-400" />
              {cat === 'streak' ? 'Reading Streaks' : cat === 'reading' ? 'Reading Milestones' : cat === 'engagement' ? 'Engagement' : 'Exploration'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {catAchievements.map(achievement => (
                <div
                  key={achievement.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    achievement.isUnlocked
                      ? 'bg-gradient-to-br from-amber-500/10 to-orange-500/5 border-amber-500/30'
                      : 'bg-slate-950 border-slate-800 opacity-70'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`text-3xl leading-none ${achievement.isUnlocked ? 'filter drop-shadow-lg' : 'grayscale opacity-40'}`}>
                      {achievement.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold ${achievement.isUnlocked ? 'text-slate-100' : 'text-slate-400'}`}>
                          {achievement.title}
                        </span>
                        {achievement.isUnlocked
                          ? <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">UNLOCKED</span>
                          : <Lock className="w-3 h-3 text-slate-600" />
                        }
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5">{achievement.description}</p>

                      {/* Progress Bar */}
                      {!achievement.isUnlocked && achievement.progress > 0 && (
                        <div className="mt-2">
                          <div className="w-full bg-slate-800 rounded-full h-1.5">
                            <div className="h-full rounded-full bg-indigo-500/60 transition-all"
                              style={{ width: `${achievement.progress}%` }} />
                          </div>
                          <span className="text-[9px] text-slate-600 font-mono mt-0.5 block">{Math.round(achievement.progress)}% complete</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
