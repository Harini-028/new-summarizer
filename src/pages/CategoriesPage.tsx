import React from 'react';
import { Grid, ChevronRight, Cpu, DollarSign, Rocket, Stethoscope, Globe, Trees, Clapperboard } from 'lucide-react';
import { Article, CategoryType } from '../types';

interface CategoriesPageProps {
  articles: Article[];
  onSelectCategory: (cat: CategoryType) => void;
}

export default function CategoriesPage({ articles, onSelectCategory }: CategoriesPageProps) {
  
  const categoryList: { name: CategoryType; icon: any; color: string; description: string }[] = [
    { name: 'AI & Technology', icon: Cpu, color: 'from-indigo-600 to-purple-600', description: 'Quantum computing, neural networks, robotics, and generative AI' },
    { name: 'Business & Finance', icon: DollarSign, color: 'from-emerald-600 to-teal-600', description: 'Global macroeconomics, CBDCs, stock markets, and venture capital' },
    { name: 'Science & Space', icon: Rocket, color: 'from-cyan-600 to-blue-600', description: 'JWST astronomy, deep space exploration, and physics breakthroughs' },
    { name: 'Health & Medicine', icon: Stethoscope, color: 'from-rose-600 to-pink-600', description: 'CRISPR base editing, oncology research, and biotech trials' },
    { name: 'World & Politics', icon: Globe, color: 'from-amber-600 to-orange-600', description: 'Diplomacy, international AI safety treaties, and trade corridors' },
    { name: 'Climate & Environment', icon: Trees, color: 'from-teal-600 to-emerald-600', description: 'Solid-state EV batteries, clean energy grids, and carbon reduction' },
    { name: 'Entertainment & Culture', icon: Clapperboard, color: 'from-purple-600 to-indigo-600', description: 'Digital media, creative AI tools, and culture trends' }
  ];

  return (
    <div className="space-y-6">
      
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Grid className="w-5 h-5 text-indigo-400" />
          <span>Category Directory & Topic Clusters</span>
        </h2>
        <p className="text-xs text-slate-400">
          Explore specialized news feeds categorized by machine learning classifier models.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoryList.map(cat => {
          const Icon = cat.icon;
          const count = articles.filter(a => a.category === cat.name).length;
          return (
            <div
              key={cat.name}
              onClick={() => onSelectCategory(cat.name)}
              className="group p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 transition-all cursor-pointer space-y-4 hover:shadow-xl hover:shadow-indigo-950/20"
            >
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${cat.color} text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-slate-950 text-indigo-400 border border-slate-800">
                  {count} Stories
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-100 group-hover:text-indigo-300 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mt-1">
                  {cat.description}
                </p>
              </div>

              <div className="flex items-center gap-1 text-xs font-semibold text-indigo-400 pt-2">
                <span>View Category Feed</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
