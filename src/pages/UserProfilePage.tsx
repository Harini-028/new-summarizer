import React, { useState } from 'react';
import { User, Settings, Check, Save, Sparkles, Shield, Bell, Moon } from 'lucide-react';
import { UserProfile, CategoryType } from '../types';

interface UserProfilePageProps {
  user: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
}

export default function UserProfilePage({ user, onUpdateProfile }: UserProfilePageProps) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [selectedInterests, setSelectedInterests] = useState<CategoryType[]>(user.interests);
  const [voiceAccent, setVoiceAccent] = useState(user.preferences.voiceAccent);
  const [fakeSensitivity, setFakeSensitivity] = useState(user.preferences.fakeNewsSensitivity);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const categories: CategoryType[] = [
    'AI & Technology',
    'Business & Finance',
    'Science & Space',
    'Health & Medicine',
    'World & Politics',
    'Climate & Environment',
    'Entertainment & Culture'
  ];

  const toggleInterest = (cat: CategoryType) => {
    if (selectedInterests.includes(cat)) {
      setSelectedInterests(selectedInterests.filter(c => c !== cat));
    } else {
      setSelectedInterests([...selectedInterests, cat]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name,
      email,
      interests: selectedInterests,
      preferences: {
        ...user.preferences,
        voiceAccent,
        fakeNewsSensitivity: fakeSensitivity
      }
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center gap-4">
          <img src={user.avatarUrl} alt={user.name} className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500" />
          <div>
            <h2 className="text-xl font-bold text-slate-100">{user.name}</h2>
            <p className="text-xs text-slate-400">{user.email}</p>
            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {user.plan}
            </span>
          </div>
        </div>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSave} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
        
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">Personal Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-950 text-slate-200 border border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-950 text-slate-200 border border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Interests Topic Picker */}
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
            Reading Interest Topics (Weights Rec Engine)
          </h3>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => {
              const selected = selectedInterests.includes(cat);
              return (
                <button
                  type="button"
                  key={cat}
                  onClick={() => toggleInterest(cat)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    selected 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {selected && <Check className="w-3.5 h-3.5 inline mr-1" />}
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* AI Voice & Misinformation Sensitivity */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">AI Speech Persona Accent</label>
            <select
              value={voiceAccent}
              onChange={(e: any) => setVoiceAccent(e.target.value)}
              className="w-full p-2.5 text-xs bg-slate-950 text-slate-200 border border-slate-800 rounded-xl focus:outline-none"
            >
              <option value="Kore">Kore (Balanced C-Suite Executive)</option>
              <option value="Puck">Puck (Fast Tech Analyst)</option>
              <option value="Zephyr">Zephyr (Calm Broadcast Persona)</option>
              <option value="Fenrir">Fenrir (Authoritative Deep Voice)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Fake News Guard Sensitivity</label>
            <select
              value={fakeSensitivity}
              onChange={(e: any) => setFakeSensitivity(e.target.value)}
              className="w-full p-2.5 text-xs bg-slate-950 text-slate-200 border border-slate-800 rounded-xl focus:outline-none"
            >
              <option value="High">High (Strict Academic Fact Checking)</option>
              <option value="Medium">Medium (Balanced Misinformation Alert)</option>
              <option value="Low">Low (Permissive Domain Filtering)</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-indigo-950/30 transition-all"
        >
          {savedSuccess ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
          <span>{savedSuccess ? 'Preferences Saved!' : 'Save Preferences'}</span>
        </button>

      </form>

    </div>
  );
}
