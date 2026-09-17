import React, { useState, useMemo } from 'react';
import {
  Search, Filter, Plus, Trash2, Edit3, Eye, Sparkles, TrendingUp,
  ShieldAlert, CheckCircle2, ChevronLeft, ChevronRight, CheckSquare,
  Square, RefreshCw, Layers, ArrowUpDown
} from 'lucide-react';
import { Article } from '../../types';

interface AdminArticlesViewProps {
  articles: Article[];
  onOpenAddModal: () => void;
  onOpenEditModal: (article: Article) => void;
  onOpenDetailModal: (article: Article) => void;
  onDeleteArticle: (id: string) => void;
  onToggleTrending: (id: string) => void;
  onToggleFeatured: (id: string) => void;
  onTogglePublish?: (id: string) => void;
  onToast: (msg: string) => void;
}

export const AdminArticlesView: React.FC<AdminArticlesViewProps> = ({
  articles,
  onOpenAddModal,
  onOpenEditModal,
  onOpenDetailModal,
  onDeleteArticle,
  onToggleTrending,
  onToggleFeatured,
  onTogglePublish,
  onToast
}) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filtered and searched articles
  const filteredArticles = useMemo(() => {
    return articles.filter(a => {
      const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) ||
                          a.source.name.toLowerCase().includes(search.toLowerCase()) ||
                          a.author.toLowerCase().includes(search.toLowerCase());
      const matchCat = categoryFilter === 'ALL' || a.category === categoryFilter;
      const matchStatus = statusFilter === 'ALL' ||
        (statusFilter === 'trending' && (a.isTrending || a.viewsCount > 5000)) ||
        (statusFilter === 'featured' && a.isFeatured) ||
        (statusFilter === 'fake' && a.fakeNewsReport?.isLikelyFake);
      return matchSearch && matchCat && matchStatus;
    });
  }, [articles, search, categoryFilter, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage) || 1;
  const paginatedArticles = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredArticles.slice(start, start + itemsPerPage);
  }, [filteredArticles, currentPage]);

  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedArticles.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedArticles.map(a => a.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Permanently delete ${selectedIds.length} selected articles?`)) return;
    selectedIds.forEach(id => onDeleteArticle(id));
    setSelectedIds([]);
    onToast(`Bulk deleted ${selectedIds.length} articles.`);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            Article Management Directory
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-mono text-xs">
              {filteredArticles.length} Articles
            </span>
          </h2>
          <p className="text-xs text-slate-400">Full CRUD operations, bulk management, and AI/ML analysis inspection</p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-950/50 cursor-pointer w-full sm:w-auto shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Article
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
              placeholder="Search by article title, publisher, or author..."
              className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <select
              value={categoryFilter}
              onChange={e => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
              className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-indigo-500 font-mono"
            >
              <option value="ALL">All Categories</option>
              <option value="AI & Technology">AI & Technology</option>
              <option value="Business & Finance">Business & Finance</option>
              <option value="Science & Space">Science & Space</option>
              <option value="Health & Medicine">Health & Medicine</option>
              <option value="World & Politics">World & Politics</option>
              <option value="Climate & Environment">Climate & Environment</option>
            </select>

            <select
              value={statusFilter}
              onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-indigo-500 font-mono"
            >
              <option value="ALL">All Statuses</option>
              <option value="trending">Trending</option>
              <option value="featured">Featured</option>
              <option value="fake">Flagged Misinfo</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions Strip */}
        {selectedIds.length > 0 && (
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-indigo-950/60 border border-indigo-500/30 text-xs text-indigo-300 animate-fade-in">
            <span>{selectedIds.length} articles selected</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-bold cursor-pointer transition-all"
              >
                Delete Selected
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/60">
        <table className="w-full text-xs text-slate-300">
          <thead className="bg-slate-950 text-slate-500 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="p-3.5 text-center w-10">
                <button onClick={toggleSelectAll} className="cursor-pointer text-slate-400 hover:text-white">
                  {selectedIds.length === paginatedArticles.length && paginatedArticles.length > 0 ? (
                    <CheckSquare className="w-4 h-4 text-indigo-400" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                </button>
              </th>
              <th className="p-3.5 text-left">Article</th>
              <th className="p-3.5 text-left">Category</th>
              <th className="p-3.5 text-left">Publisher</th>
              <th className="p-3.5 text-left">Metrics</th>
              <th className="p-3.5 text-left">Sentiment</th>
              <th className="p-3.5 text-left">Veracity</th>
              <th className="p-3.5 text-left">Flags</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {paginatedArticles.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-8 text-center text-slate-500 font-mono">
                  No articles found matching filters
                </td>
              </tr>
            ) : (
              paginatedArticles.map(art => {
                const isSelected = selectedIds.includes(art.id);
                return (
                  <tr key={art.id} className={`hover:bg-slate-900/60 transition-colors ${isSelected ? 'bg-indigo-950/20' : ''}`}>
                    <td className="p-3.5 text-center">
                      <button onClick={() => toggleSelectOne(art.id)} className="cursor-pointer text-slate-400 hover:text-white">
                        {isSelected ? <CheckSquare className="w-4 h-4 text-indigo-400" /> : <Square className="w-4 h-4" />}
                      </button>
                    </td>

                    <td className="p-3.5 max-w-xs">
                      <div className="flex items-center gap-3">
                        <img
                          src={art.imageUrl}
                          alt=""
                          className="w-10 h-10 rounded-xl object-cover border border-slate-800 shrink-0"
                        />
                        <div className="min-w-0">
                          <button
                            onClick={() => onOpenDetailModal(art)}
                            className="font-semibold text-slate-100 hover:text-indigo-400 text-left line-clamp-1 cursor-pointer transition-colors"
                          >
                            {art.title}
                          </button>
                          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                            By {art.author} • {new Date(art.publishedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                        {art.category}
                      </span>
                    </td>

                    <td className="p-3.5 text-slate-400 font-mono text-[10px]">
                      <div>{art.source.name}</div>
                      <div className="text-emerald-400">{art.source.trustScore}% Trust</div>
                    </td>

                    <td className="p-3.5 font-mono text-[10px] text-slate-400">
                      <div>{(art.viewsCount || 0).toLocaleString()} views</div>
                      <div className="text-slate-500">{art.likesCount || 0} likes • {art.bookmarksCount || 0} saves</div>
                    </td>

                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        art.sentiment.type === 'Positive' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        art.sentiment.type === 'Negative' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                        'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {art.sentiment.type}
                      </span>
                    </td>

                    <td className="p-3.5 font-mono">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        art.fakeNewsReport?.isLikelyFake ? 'bg-rose-500/15 text-rose-400 border-rose-500/30' :
                        'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                      }`}>
                        {art.fakeNewsReport?.verdict || 'Verified'}
                      </span>
                    </td>

                    <td className="p-3.5">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onToggleTrending(art.id)}
                          className={`p-1 rounded-lg border transition-all cursor-pointer ${
                            art.isTrending || art.viewsCount > 5000
                              ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                              : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
                          }`}
                          title="Toggle Trending"
                        >
                          <TrendingUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onToggleFeatured(art.id)}
                          className={`p-1 rounded-lg border transition-all cursor-pointer ${
                            art.isFeatured
                              ? 'bg-purple-500/20 border-purple-500/40 text-purple-400'
                              : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
                          }`}
                          title="Toggle Featured"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onOpenDetailModal(art)}
                          className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-indigo-500 text-slate-400 hover:text-indigo-400 transition-all cursor-pointer"
                          title="Inspect AI Analysis"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onOpenEditModal(art)}
                          className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-500 text-slate-400 hover:text-amber-400 transition-all cursor-pointer"
                          title="Edit Article"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Permanently delete "${art.title}"?`)) {
                              onDeleteArticle(art.id);
                              onToast('Article deleted');
                            }
                          }}
                          className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-rose-500 text-slate-400 hover:text-rose-400 transition-all cursor-pointer"
                          title="Delete Article"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
        <div className="text-slate-500 font-mono">
          Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredArticles.length)} of {filteredArticles.length} entries
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-40 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-mono text-slate-300">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-40 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
