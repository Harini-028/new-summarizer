import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, MessageSquare, Trash2, HelpCircle, ArrowRight, BookOpen, AlertCircle } from 'lucide-react';
import { Article } from '../types';

interface Message {
  role: 'user' | 'model';
  content: string;
}

interface AIChatPageProps {
  contextArticle: Article | null;
  onClearContext: () => void;
}

const PRESET_PROMPTS = [
  { label: '⚛️ Explain Quantum Speedup', prompt: 'Can you explain the MIT and Caltech 128-qubit quantum neural network breakthrough in simple terms? What are the main benefits?' },
  { label: '🌐 Summarize World AI Safety Summit', prompt: 'Provide a concise bullet summary of the Global AI Safety Governance Treaty signed by 42 nations.' },
  { label: '🔬 Is GlycoRoot-X diabetes claim fake?', prompt: 'Analyze the claim regarding GlycoRoot-X curing diabetes in 48 hours. What red flags did the AI fact check audit raise?' },
  { label: '⚖️ Compare AI smart grids vs exoplanets', prompt: 'Compare the technical challenges in deep exoplanet spectroscopy (LHS 1140 b) versus decentralized reinforcement learning energy grids.' }
];

export default function AIChatPage({ contextArticle, onClearContext }: AIChatPageProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      content: "Hello! I am your Chronicle AI News Assistant. I can help you summarize headlines, explain technical concepts, check factuality scores, compare stories, and explore deep scientific breakthroughs. How can I help you today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: text };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages,
          articleId: contextArticle?.id
        })
      });
      const data = await res.json();
      if (res.ok && data.reply) {
        setMessages(prev => [...prev, { role: 'model', content: data.reply }]);
      } else {
        setMessages(prev => [...prev, { role: 'model', content: `Error: ${data.error || 'Failed to generate response.'}` }]);
      }
    } catch (e) {
      setMessages(prev => [...prev, { role: 'model', content: 'Connection error. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        role: 'model',
        content: "Hello! I am your Chronicle AI News Assistant. I can help you summarize headlines, explain technical concepts, check factuality scores, compare stories, and explore deep scientific breakthroughs. How can I help you today?"
      }
    ]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-130px)] rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl">
      
      {/* Header Info Panel */}
      <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/20 shadow-inner">
            <MessageSquare className="w-4.5 h-4.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-100">Chronicle AI Copilot</h3>
              <span className="px-2 py-0.5 text-[9px] font-mono font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-full uppercase">
                Gemini 2.5 Active
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Interact and analyze articles contextually</p>
          </div>
        </div>

        <button
          onClick={handleClearChat}
          className="p-2 rounded-xl bg-white/5 border border-slate-800 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all text-xs"
          title="Clear Conversation History"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Article Context Alert */}
      {contextArticle && (
        <div className="p-3.5 bg-indigo-500/10 border-b border-indigo-500/20 flex items-center justify-between gap-3 text-xs shrink-0 animate-in slide-in-from-top">
          <div className="flex items-center gap-2 min-w-0">
            <BookOpen className="w-4 h-4 text-indigo-400 shrink-0" />
            <span className="text-slate-300 truncate">
              Context Injected: <strong className="text-white">"{contextArticle.title}"</strong>
            </span>
          </div>
          <button
            onClick={onClearContext}
            className="px-2 py-1 rounded bg-white/5 border border-white/10 hover:bg-white/10 text-[10px] font-bold text-slate-300 hover:text-white transition-all shrink-0"
          >
            Clear Context
          </button>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0 bg-slate-900/50">
        {messages.map((msg, idx) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={idx}
              className={`flex items-start gap-3.5 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
            >
              {/* Icon */}
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border text-xs font-bold ${
                isUser 
                  ? 'bg-slate-800 text-slate-200 border-slate-700' 
                  : 'bg-indigo-600/10 text-indigo-400 border-indigo-500/20'
              }`}>
                {isUser ? 'U' : <Sparkles className="w-3.5 h-3.5" />}
              </div>

              {/* Bubble */}
              <div className={`p-4 rounded-2xl text-xs leading-relaxed space-y-2 ${
                isUser 
                  ? 'bg-indigo-600 text-white rounded-tr-none shadow-lg shadow-indigo-950/20' 
                  : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none'
              }`}>
                <div className="whitespace-pre-wrap font-sans">
                  {msg.content}
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-start gap-3.5 max-w-[80%]">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center shrink-0 border">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-400 rounded-tl-none flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Preset Prompt Suggestions */}
      {messages.length === 1 && (
        <div className="p-4 border-t border-slate-800 bg-slate-950/30 space-y-2 shrink-0">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Suggested Analysis Queries:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {PRESET_PROMPTS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(p.prompt)}
                className="text-left p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900 transition-all text-xs flex items-center justify-between gap-2 text-slate-300 hover:text-white"
              >
                <span>{p.label}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Send Input Panel */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/80 shrink-0">
        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder={contextArticle ? `Ask about "${contextArticle.title}"...` : "Ask a question about the latest news, verify claims..."}
            className="flex-1 px-4 py-3 bg-slate-900 text-slate-100 border border-slate-800 focus:border-indigo-500 rounded-2xl text-xs placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-55 cursor-pointer flex items-center justify-center transition-all shadow-lg shadow-indigo-950/30"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
}
