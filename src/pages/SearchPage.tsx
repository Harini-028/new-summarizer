import React, { useState } from 'react';
import { Search, SlidersHorizontal, ShieldCheck, Sparkles, Filter } from 'lucide-react';
import { Article, CategoryType, SentimentType } from '../types';
import NewsCard from '../components/NewsCard';

interface SearchPageProps {
  articles: Article[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenSummary: (article: Article) => void;
  onOpenVoice: (article: Article) => void;
  onInteract: (articleId: string, action: 'bookmark' | 'like') => void;
}

export default function SearchPage({
  articles,
  searchQuery,
  onSearchChange,
  onOpenSummary,
  onOpenVoice,
  onInteract
}: SearchPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('All');
  const [selectedSentiment, setSelectedSentiment] = useState<SentimentType | 'All'>('All');
  const [minFactConfidence, setMinFactConfidence] = useState<number>(0);

  // Filter articles
  const filteredArticles = articles.filter(a => {
    // Search match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const titleMatch = a.title.toLowerCase().includes(q);
      const excerptMatch = a.excerpt.toLowerCase().includes(q);
      const contentMatch = a.content.toLowerCase().includes(q);
      const kwMatch = a.entities.keywords.some(k => k.toLowerCase().includes(q));
      if (!titleMatch && !excerptMatch && !contentMatch && !kwMatch) return false;
    }

    // Category match
    if (selectedCategory !== 'All' && a.category !== selectedCategory) return false;

    // Sentiment match
    if (selectedSentiment !== 'All' && a.sentiment.type !== selectedSentiment) return false;

    // Fact check confidence
    if (a.fakeNewsReport.confidenceScore < minFactConfidence) return false;

    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Search Header & Filter Controls */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5 text-indigo-400" />
          <h2 className="text-base font-bold text-slate-100">Semantic Search & Multi-Filter Engine</h2>
        </div>

        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Type keywords, topics, companies, or paste article text to search..."
            className="w-full pl-10 pr-4 py-3 text-sm bg-slate-950 text-slate-200 border border-slate-800 rounded-2xl focus:outline-none focus:border-indigo-500"
          />
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
        </div>

        {/* Filter Sliders & Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-800/80">
          
          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Category Filter:</label>
            <select
              value={selectedCategory}
              onChange={(e: any) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl p-2 text-xs focus:outline-none"
            >
              <option value="All">All Categories</option>
              <option value="AI & Technology">AI & Technology</option>
              <option value="Business & Finance">Business & Finance</option>
              <option value="Science & Space">Science & Space</option>
              <option value="Health & Medicine">Health & Medicine</option>
              <option value="World & Politics">World & Politics</option>
              <option value="Climate & Environment">Climate & Environment</option>
            </select>
          </div>

          {/* Sentiment */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Sentiment Polarity:</label>
            <select
              value={selectedSentiment}
              onChange={(e: any) => setSelectedSentiment(e.target.value)}
              className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl p-2 text-xs focus:outline-none"
            >
              <option value="All">All Sentiments</option>
              <option value="Positive">Positive</option>
              <option value="Neutral">Neutral</option>
              <option value="Negative">Negative</option>
            </select>
          </div>

          {/* Min Fact Confidence */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Min Fact Confidence: <strong className="text-indigo-400">{minFactConfidence}%</strong>
            </label>
            <input
              type="range"
              min="0"
              max="90"
              step="10"
              value={minFactConfidence}
              onChange={(e) => setMinFactConfidence(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

        </div>

      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-400 font-mono">
          Found <strong className="text-indigo-400">{filteredArticles.length}</strong> matching stories
        </p>
      </div>

      {/* Results Grid */}
      {filteredArticles.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl space-y-2">
          <p className="text-sm font-semibold text-slate-300">No articles matched your filter parameters.</p>
          <p className="text-xs text-slate-500">Try broadening your search query or adjusting filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map(art => (
            <NewsCard
              key={art.id}
              article={art}
              onOpenSummary={onOpenSummary}
              onOpenVoice={onOpenVoice}
              onInteract={onInteract}
            />
          ))}
        </div>
      )}

    </div>
  );
}
