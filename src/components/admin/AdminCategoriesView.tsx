import React, { useState, useEffect } from 'react';
import { Layers, Folder, FileText, CheckCircle2, Clock, ShieldCheck, ArrowRight, RefreshCw, Plus } from 'lucide-react';
import { NEWS_CATEGORIES } from '../../data/categories';

interface CategoryMetric {
  category: string;
  total: number;
  published: number;
  drafts: number;
  avgTrustScore: number;
  latestArticleTitle?: string;
}

interface AdminCategoriesViewProps {
  onSelectCategory?: (category: string) => void;
  onToast: (msg: string) => void;
}

export const AdminCategoriesView: React.FC<AdminCategoriesViewProps> = ({
  onSelectCategory,
  onToast
}) => {
  const [categories, setCategories] = useState<CategoryMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const token = localStorage.getItem('chronicle_admin_token') || 
                localStorage.getItem('chronicle_token') || 
                sessionStorage.getItem('chronicle_admin_token') || 
                sessionStorage.getItem('chronicle_token');

  const fetchCategoryStats = async () => {
    try {
      const res = await fetch('/api/admin/categories', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        if (data.categories && Array.isArray(data.categories)) {
          setCategories(data.categories);
        }
      } else {
        // Fallback default list
        setCategories(NEWS_CATEGORIES.map(cat => ({
          category: cat,
          total: 0,
          published: 0,
          drafts: 0,
          avgTrustScore: 92
        })));
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCategoryStats();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchCategoryStats().then(() => onToast('Categories refreshed from MongoDB.'));
  };

  const totalAllArticles = categories.reduce((acc, c) => acc + c.total, 0);
  const totalPublished = categories.reduce((acc, c) => acc + c.published, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">News Category Taxonomy & Intelligence</h2>
            <p className="text-xs text-slate-400">Manage editorial streams, live distribution channels, and category trust indices</p>
          </div>
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-mono text-slate-300 transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-indigo-400' : ''}`} />
          <span>Sync Data</span>
        </button>
      </div>

      {/* KPI summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-mono">Active Categories</div>
            <div className="text-2xl font-black font-mono text-white mt-1">{categories.length}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-600/10 text-indigo-400 flex items-center justify-center">
            <Folder className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-mono">Total Indexed Articles</div>
            <div className="text-2xl font-black font-mono text-emerald-400 mt-1">{totalAllArticles}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-600/10 text-emerald-400 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-mono">Published Ratio</div>
            <div className="text-2xl font-black font-mono text-cyan-400 mt-1">
              {totalAllArticles > 0 ? `${Math.round((totalPublished / totalAllArticles) * 100)}%` : '100%'}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-600/10 text-cyan-400 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Category Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 font-mono">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-400" />
          Loading category distribution...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.category}
              className="p-5 rounded-2xl bg-slate-950 border border-slate-800/80 hover:border-indigo-500/50 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 rounded-full text-xs font-bold font-mono bg-indigo-600/15 text-indigo-400 border border-indigo-500/20">
                    {cat.category}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{cat.avgTrustScore}% Trust</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 my-4 text-center">
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800/60">
                    <div className="text-xs font-mono font-bold text-white">{cat.total}</div>
                    <div className="text-[10px] text-slate-500 font-mono">Total</div>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800/60">
                    <div className="text-xs font-mono font-bold text-emerald-400">{cat.published}</div>
                    <div className="text-[10px] text-slate-500 font-mono">Published</div>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800/60">
                    <div className="text-xs font-mono font-bold text-amber-400">{cat.drafts}</div>
                    <div className="text-[10px] text-slate-500 font-mono">Drafts</div>
                  </div>
                </div>

                {cat.latestArticleTitle && (
                  <p className="text-[11px] text-slate-400 line-clamp-1 italic mb-4">
                    Latest: "{cat.latestArticleTitle}"
                  </p>
                )}
              </div>

              {onSelectCategory && (
                <button
                  onClick={() => onSelectCategory(cat.category)}
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-900 hover:bg-indigo-600 text-slate-300 hover:text-white text-xs font-bold font-mono transition-colors cursor-pointer group-hover:border-indigo-500/40"
                >
                  <span>Filter Articles</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
