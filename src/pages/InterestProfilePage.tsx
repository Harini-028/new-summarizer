import React, { useState, useEffect } from 'react';
import { User, Sparkles, PieChart, RefreshCw, Plus, X, Check } from 'lucide-react';
import { UserProfile, CategoryType } from '../types';

interface InterestProfilePageProps {
  user: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
}

const ALL_CATEGORIES: CategoryType[] = [
  'AI & Technology', 'Business & Finance', 'Science & Space',
  'Health & Medicine', 'World & Politics', 'Climate & Environment', 'Entertainment & Culture'
];

const categoryGradients: Record<string, string> = {
  'AI & Technology': 'from-indigo-500 to-violet-500',
  'Business & Finance': 'from-emerald-500 to-teal-500',
  'Science & Space': 'from-cyan-500 to-blue-500',
  'Health & Medicine': 'from-rose-500 to-pink-500',
  'World & Politics': 'from-amber-500 to-orange-500',
  'Climate & Environment': 'from-green-500 to-emerald-500',
  'Entertainment & Culture': 'from-fuchsia-500 to-purple-500',
};

interface ProfileEntry { category: string; score: number; isExplicit: boolean; articleCount: number; }
interface DiversityData { overall: number; categoryBreakdown: { category: string; percentage: number; count: number }[]; overRelianceWarning?: string; recommendations: string[]; }
interface NewsScore { score: number; grade: string; message: string; breakdown: Record<string, number>; missedImportantStories: number; }

export default function InterestProfilePage({ user, onUpdateProfile }: InterestProfilePageProps) {
  const [profile, setProfile] = useState<ProfileEntry[]>([]);
  const [diversity, setDiversity] = useState<DiversityData | null>(null);
  const [newsScore, setNewsScore] = useState<NewsScore | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeInterests, setActiveInterests] = useState<CategoryType[]>(user.interests || []);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const params = `?userId=${user.id}&email=${encodeURIComponent(user.email)}`;
    Promise.all([
      fetch(`/api/user/interest-profile${params}`).then(r => r.json()),
      fetch(`/api/user/diversity-score${params}`).then(r => r.json()),
      fetch(`/api/user/news-score${params}`).then(r => r.json()),
    ]).then(([p, d, s]) => {
      setProfile(p.profile || []);
      setDiversity(d);
      setNewsScore(s);
      setIsLoading(false);
    }).catch(() => setIsLoading(false));
  }, [user.id]);

  const toggleInterest = (cat: CategoryType) => {
    setActiveInterests(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  };

  const handleSave = async () => {
    setSaving(true);
    await onUpdateProfile({ interests: activeInterests });
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 rounded-full border-4 border-indigo-600/30 border-t-indigo-600 animate-spin" />
      </div>
    );
  }

  const gradeColor = newsScore?.grade === 'Excellent' ? 'text-emerald-400' : newsScore?.grade === 'Good' ? 'text-cyan-400' : newsScore?.grade === 'Fair' ? 'text-amber-400' : 'text-slate-400';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-900/20 to-violet-900/10 border border-indigo-500/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">Interest Profile & Diversity</h2>
            <p className="text-xs text-slate-400">AI-computed interest scores based on your reading behavior</p>
          </div>
        </div>

        {/* News Score Card */}
        {newsScore && (
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-700 flex items-center gap-6">
            <div className="text-center">
              <div className={`text-5xl font-extrabold font-mono ${gradeColor}`}>{newsScore.score}</div>
              <div className="text-[10px] text-slate-500 mt-1">/ 100</div>
            </div>
            <div className="flex-1">
              <div className={`text-sm font-bold ${gradeColor}`}>{newsScore.grade} Coverage</div>
              <p className="text-xs text-slate-300 mt-1">{newsScore.message}</p>
              <div className="w-full bg-slate-800 rounded-full h-2 mt-3">
                <div className={`h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500`} style={{ width: `${newsScore.score}%` }} />
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3">
                {Object.entries(newsScore.breakdown).map(([key, val]) => (
                  <div key={key} className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span className="text-slate-300 font-mono font-bold">+{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Interest Profile Bars */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" /> Your AI-Generated Interest Profile
          </h3>
          <span className="text-[10px] text-slate-500">AI-estimated based on reading patterns</span>
        </div>
        <div className="space-y-3">
          {profile.map((item, i) => {
            const gradient = categoryGradients[item.category] || 'from-slate-500 to-slate-400';
            return (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-200">{item.category}</span>
                    {item.isExplicit && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">Following</span>
                    )}
                  </div>
                  <span className="font-mono font-bold text-slate-300">{item.score}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-1000`}
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Diversity Score */}
      {diversity && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-cyan-400" /> News Diversity Score
            </h3>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-extrabold font-mono text-cyan-400">{diversity.overall}</div>
              <div className="text-xs text-slate-500">/100</div>
            </div>
          </div>

          {diversity.overRelianceWarning && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
              ⚠️ {diversity.overRelianceWarning}
            </div>
          )}

          <div className="space-y-2">
            {diversity.categoryBreakdown.slice(0, 7).map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-xs">
                <span className="text-slate-400 w-36 truncate">{item.category}</span>
                <div className="flex-1 bg-slate-800 rounded-full h-2">
                  <div className="h-full rounded-full bg-indigo-500/70" style={{ width: `${Math.min(100, item.percentage * 2)}%` }} />
                </div>
                <span className="text-slate-300 font-mono w-8 text-right">{item.percentage}%</span>
                <span className="text-slate-600 w-16 text-right font-mono">{item.count} articles</span>
              </div>
            ))}
          </div>

          {diversity.recommendations.length > 0 && (
            <div className="space-y-1.5">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Recommendations</h4>
              {diversity.recommendations.map((rec, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                  <span className="text-indigo-400">→</span> {rec}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Edit Interests */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-100">Edit Your Interests</h3>
          <button
            onClick={handleSave}
            disabled={saving}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${saved ? 'bg-emerald-600 text-white' : 'bg-indigo-600 hover:bg-indigo-500 text-white'} disabled:opacity-50`}
          >
            {saved ? <><Check className="w-3.5 h-3.5" /> Saved!</> : saving ? 'Saving...' : <><Check className="w-3.5 h-3.5" /> Save Interests</>}
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {ALL_CATEGORIES.map(cat => {
            const isActive = activeInterests.includes(cat);
            const gradient = categoryGradients[cat] || 'from-slate-500 to-slate-400';
            return (
              <button
                key={cat}
                onClick={() => toggleInterest(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 border ${
                  isActive
                    ? `bg-gradient-to-r ${gradient} text-white border-transparent shadow-lg`
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-500 hover:text-white'
                }`}
              >
                {isActive && <Check className="w-3 h-3" />}
                {cat}
              </button>
            );
          })}
        </div>
        <p className="text-[10px] text-slate-500">
          Selected: {activeInterests.length}/7 categories. Your selections improve AI recommendations.
        </p>
      </div>
    </div>
  );
}
