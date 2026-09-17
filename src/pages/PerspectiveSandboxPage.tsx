import React, { useState } from 'react';
import { 
  Users, MessageSquare, Sparkles, Shield, AlertTriangle, 
  HelpCircle, RefreshCw, Send, Sliders, CheckCircle2, ChevronRight
} from 'lucide-react';
import { PerspectivePersona } from '../types';

const SAMPLE_TOPICS = [
  {
    id: 'ai-reg',
    title: 'Global AI Safety Regulations & Frontier Model Licensing',
    category: 'AI & Technology',
    summary: 'Governments worldwide are proposing mandatory safety audits, compute caps, and open-source licensing constraints on frontier AI models.',
  },
  {
    id: 'cbdc',
    title: 'Central Bank Digital Currencies (CBDCs) Rollout',
    category: 'Business & Finance',
    summary: 'Major central banks are testing programmable sovereign digital currencies to modernize payment rails and reduce transaction friction.',
  },
  {
    id: 'clean-energy',
    title: 'Nuclear Fusion Commercialization vs. Solar/Battery Grid Subsidies',
    category: 'Climate & Environment',
    summary: 'Debate rages between direct state subsidies for immediate solar/wind battery grids vs long-term investment in commercial fusion energy.',
  }
];

const INITIAL_PERSONAS: Record<string, PerspectivePersona[]> = {
  'ai-reg': [
    {
      id: 'p1',
      name: 'Dr. Aris Thorne',
      role: 'AI Ethics & Alignment Researcher',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      badge: 'Safety First',
      color: 'from-amber-500 to-orange-600',
      stance: 'Strongly Support',
      summary: 'Frontier AI models pose systemic catastrophic risks without binding pre-deployment safety evaluations and mandatory independent red-teaming.',
      keyArguments: [
        'Prevent unintended model autonomous capabilities',
        'Establish international coordination similar to nuclear non-proliferation',
        'Protect public safety against automated cyber exploits'
      ],
      biasRating: 35
    },
    {
      id: 'p2',
      name: 'Elena Vance',
      role: 'Open Source AI Advocate & Tech Founder',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
      badge: 'Open Innovation',
      color: 'from-cyan-500 to-blue-600',
      stance: 'Critical',
      summary: 'Heavy compute licensing creates regulatory capture for tech monopolies while crippling open-source research and global tech democratisation.',
      keyArguments: [
        'Compute limits entrench incumbents like OpenAI & Google',
        'Open source enables decentralized transparency and community audits',
        'Regulatory overreach slows economic productivity gains'
      ],
      biasRating: 75
    },
    {
      id: 'p3',
      name: 'Marcus Vance, M.Econ',
      role: 'Global Markets & Technology Economist',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      badge: 'Economic Stance',
      color: 'from-emerald-500 to-teal-600',
      stance: 'Moderate Support',
      summary: 'Targeted governance builds long-term institutional trust needed for enterprise deployment, provided compliance overhead remains lightweight.',
      keyArguments: [
        'Market certainty accelerates enterprise adoption',
        'Clear liability frameworks encourage venture capital funding',
        'Harmonized standards prevent fragmented global trade'
      ],
      biasRating: 50
    },
    {
      id: 'p4',
      name: 'Sophia Patel',
      role: 'Digital Rights & Privacy Attorney',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200',
      badge: 'Civil Liberties',
      color: 'from-purple-500 to-indigo-600',
      stance: 'Neutral',
      summary: 'Regulations must focus on data provenance, copyright protection, and anti-surveillance safeguards rather than compute caps.',
      keyArguments: [
        'Protect individual privacy against intrusive scraping',
        'Prevent state misuse of AI surveillance tech',
        'Ensure algorithmic transparency in judicial and loan decisions'
      ],
      biasRating: 45
    }
  ]
};

export default function PerspectiveSandboxPage() {
  const [selectedTopicId, setSelectedTopicId] = useState('ai-reg');
  const [activePersona, setActivePersona] = useState<PerspectivePersona | null>(INITIAL_PERSONAS['ai-reg'][0]);
  const [userQuestion, setUserQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState<{ sender: string; text: string; role: string; avatar: string }[]>([
    {
      sender: 'Dr. Aris Thorne',
      role: 'AI Ethics & Alignment Researcher',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      text: 'Welcome to the Perspective Sandbox. Ask me any question regarding frontier AI safety standards and how they balance against rapid innovation!'
    }
  ]);
  const [isSimulating, setIsSimulating] = useState(false);

  const currentTopic = SAMPLE_TOPICS.find(t => t.id === selectedTopicId) || SAMPLE_TOPICS[0];
  const personas = INITIAL_PERSONAS[selectedTopicId] || INITIAL_PERSONAS['ai-reg'];

  const handleAskPersona = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuestion.trim() || !activePersona) return;

    const question = userQuestion;
    setUserQuestion('');

    setChatHistory(prev => [
      ...prev,
      { sender: 'You', role: 'User', avatar: '', text: question }
    ]);

    setIsSimulating(true);

    setTimeout(() => {
      let simulatedReply = '';
      if (activePersona.stance === 'Strongly Support') {
        simulatedReply = `From a safety standpoint, "${question}" highlights why strict guardrails are vital. Without proactive oversight, unforeseen risk scenarios can scale faster than our ability to patch them.`;
      } else if (activePersona.stance === 'Critical') {
        simulatedReply = `Regarding "${question}", my concern is that heavy-handed rules punish small open-source developers while giving big tech monopolies a free pass through lobby power.`;
      } else if (activePersona.stance === 'Moderate Support') {
        simulatedReply = `Economically speaking, addressing "${question}" requires balanced regulation that protects consumers without stifling R&D return on investment.`;
      } else {
        simulatedReply = `From a civil liberties perspective, "${question}" underscores the urgent need for transparent data auditing and protecting fundamental user rights.`;
      }

      setChatHistory(prev => [
        ...prev,
        {
          sender: activePersona.name,
          role: activePersona.role,
          avatar: activePersona.avatar,
          text: simulatedReply
        }
      ]);
      setIsSimulating(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#060608] text-slate-100 p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs font-bold uppercase tracking-widest mb-1">
            <Users className="w-4 h-4" />
            <span>AI Multi-Perspective Sandbox</span>
            <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-[10px]">
              Multi-Agent Simulation
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">
            Perspective <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Sandbox</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Explore complex topics through diverse AI stakeholder personas. Compare arguments, evaluate underlying stances, and challenge viewpoints in real-time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setSelectedTopicId(selectedTopicId)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold transition-all text-slate-300 hover:text-white"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Re-simulate Debate
          </button>
        </div>
      </div>

      {/* Topic Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {SAMPLE_TOPICS.map(topic => (
          <button
            key={topic.id}
            onClick={() => {
              setSelectedTopicId(topic.id);
              setActivePersona(INITIAL_PERSONAS[topic.id] ? INITIAL_PERSONAS[topic.id][0] : INITIAL_PERSONAS['ai-reg'][0]);
            }}
            className={`text-left p-5 rounded-2xl border transition-all ${
              selectedTopicId === topic.id
                ? 'bg-gradient-to-br from-indigo-900/40 via-purple-900/20 to-slate-900 border-indigo-500/50 shadow-lg shadow-indigo-500/10'
                : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/[0.07]'
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block mb-1">
              {topic.category}
            </span>
            <h3 className="font-bold text-sm text-white line-clamp-2 mb-2">{topic.title}</h3>
            <p className="text-xs text-slate-400 line-clamp-2">{topic.summary}</p>
          </button>
        ))}
      </div>

      {/* Selected Topic Overview */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950/40 via-slate-900 to-purple-950/40 border border-indigo-500/20 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold uppercase text-indigo-300 tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            Active Synthesis Topic
          </span>
          <span className="text-xs font-bold text-slate-400 font-mono">4 Active Personas</span>
        </div>
        <h2 className="text-xl font-extrabold text-white">{currentTopic.title}</h2>
        <p className="text-sm text-slate-300 leading-relaxed">{currentTopic.summary}</p>
      </div>

      {/* Personas Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-400" />
            Stakeholder Stances & Arguments
          </h3>
          <span className="text-xs text-slate-400">Click a persona to engage in interactive Q&A</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {personas.map(persona => {
            const isSelected = activePersona?.id === persona.id;
            return (
              <div
                key={persona.id}
                onClick={() => setActivePersona(persona)}
                className={`cursor-pointer rounded-2xl p-5 border transition-all flex flex-col justify-between space-y-4 relative overflow-hidden ${
                  isSelected
                    ? 'bg-slate-900 border-indigo-500 ring-2 ring-indigo-500/50 shadow-xl'
                    : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/[0.08]'
                }`}
              >
                {/* Top Badge */}
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full text-white bg-gradient-to-r ${persona.color}`}>
                    {persona.badge}
                  </span>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                    persona.stance.includes('Support') ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                    persona.stance.includes('Critical') || persona.stance.includes('Oppose') ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                    'bg-slate-500/20 text-slate-300 border border-slate-500/30'
                  }`}>
                    {persona.stance}
                  </span>
                </div>

                {/* Profile */}
                <div className="flex items-center gap-3">
                  <img 
                    src={persona.avatar} 
                    alt={persona.name}
                    className="w-12 h-12 rounded-xl object-cover border border-white/20 shrink-0" 
                  />
                  <div className="min-w-0">
                    <h4 className="font-bold text-sm text-white truncate">{persona.name}</h4>
                    <p className="text-xs text-slate-400 truncate">{persona.role}</p>
                  </div>
                </div>

                {/* Summary */}
                <p className="text-xs text-slate-300 italic line-clamp-3 leading-snug">
                  "{persona.summary}"
                </p>

                {/* Key Arguments */}
                <div className="space-y-1.5 pt-2 border-t border-white/10">
                  <p className="text-[10px] font-mono uppercase text-slate-400 font-bold">Key Drivers:</p>
                  <ul className="space-y-1">
                    {persona.keyArguments.map((arg, idx) => (
                      <li key={idx} className="text-[11px] text-slate-300 flex items-start gap-1.5 leading-tight">
                        <ChevronRight className="w-3 h-3 text-indigo-400 shrink-0 mt-0.5" />
                        <span>{arg}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bias Meter */}
                <div className="pt-2">
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono mb-1">
                    <span>Ideological Bias Index</span>
                    <span>{persona.biasRating}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${persona.color}`}
                      style={{ width: `${persona.biasRating}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Q&A Console */}
      {activePersona && (
        <div className="rounded-3xl bg-slate-900 border border-indigo-500/30 p-6 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <img 
                src={activePersona.avatar} 
                alt={activePersona.name} 
                className="w-10 h-10 rounded-xl object-cover border border-indigo-400"
              />
              <div>
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  Interactive Console: {activePersona.name}
                  <span className="text-xs font-normal text-slate-400">({activePersona.role})</span>
                </h3>
                <p className="text-xs text-indigo-300">Prompt this AI stakeholder directly to test argument resilience</p>
              </div>
            </div>
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold">
              Active Persona
            </span>
          </div>

          {/* Dialogue Messages */}
          <div className="space-y-4 max-h-80 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10">
            {chatHistory.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex gap-3 text-xs ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender !== 'You' && (
                  <img src={msg.avatar} alt="" className="w-8 h-8 rounded-lg object-cover border border-white/20 shrink-0" />
                )}
                <div className={`p-4 rounded-2xl max-w-xl space-y-1 ${
                  msg.sender === 'You' 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-none'
                }`}>
                  <div className="flex items-center justify-between text-[10px] font-mono text-indigo-300 font-bold">
                    <span>{msg.sender}</span>
                    <span>{msg.role}</span>
                  </div>
                  <p className="leading-relaxed text-sm">{msg.text}</p>
                </div>
              </div>
            ))}
            {isSimulating && (
              <div className="flex items-center gap-2 text-xs text-indigo-400 font-mono">
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Simulating persona counter-argument...</span>
              </div>
            )}
          </div>

          {/* Input Form */}
          <form onSubmit={handleAskPersona} className="flex gap-3">
            <input
              type="text"
              value={userQuestion}
              onChange={(e) => setUserQuestion(e.target.value)}
              placeholder={`Ask ${activePersona.name} a question or counter-argument...`}
              className="flex-1 bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={isSimulating || !userQuestion.trim()}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              Challenge Stance
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
