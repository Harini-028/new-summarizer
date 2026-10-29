import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, Plus, Eye, Edit3, Trash2, Globe, Send, CheckCircle2, 
  ArrowUpDown, Filter, Flame, Star, RefreshCw, AlertCircle, FileText,
  Clock, ShieldCheck
} from 'lucide-react';
import { Article } from '../../types';
import { NEWS_CATEGORIES, getCategoryStyle, DEFAULT_FALLBACK_IMAGE } from '../../data/categories';

interface AdminNewsManagementViewProps {
  articles: Article[];
  initialFilter?: 'all' | 'published' | 'draft' | 'breaking' | 'featured';
  onOpenAddNews: () => void;
  onOpenEditNews: (article: Article) => void;
  onOpenViewNews: (article: Article) => void;
  onDeleteNews: (id: string) => Promise<void> | void;
  onPublishNews: (id: string) => Promise<void> | void;
  onUnpublishNews: (id: string) => Promise<void> | void;
  onRefresh: () => void;
  onToast: (msg: string) => void;
}

export const AdminNewsManagementView: React.FC<AdminNewsManagementViewProps> = ({
  articles,
  initialFilter = 'all',
  onOpenAddNews,
  onOpenEditNews,
  onOpenViewNews,
  onDeleteNews,
  onPublishNews,
  onUnpublishNews,
  onRefresh,
  onToast
}) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState<'all' | 'published' | 'draft' | 'breaking' | 'featured'>(initialFilter);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (initialFilter) {
      setTypeFilter(initialFilter);
      setCurrentPage(1);
    }
  }, [initialFilter]);

  // Stats calculation
  const totalCount = articles.length;
  const publishedCount = articles.filter(a => ((a as any).status || 'published') === 'published').length;
  const draftCount = articles.filter(a => (a as any).status === 'draft').length;
  const breakingCount = articles.filter(a => a.isBreaking).length;
  const featuredCount = articles.filter(a => a.isFeatured).length;

  // Filtered and sorted articles
  const filteredArticles = useMemo(() => {
    return articles
      .filter(a => {
        const q = search.toLowerCase();
        const matchesSearch = !search.trim() || 
          a.title.toLowerCase().includes(q) ||
          (a.author && a.author.toLowerCase().includes(q)) ||
          (a.source?.name && a.source.name.toLowerCase().includes(q));

        const matchesCat = categoryFilter === 'All' || a.category === categoryFilter;

        const artStatus = (a as any).status || 'published';
        const matchesStatus = statusFilter === 'All' || artStatus === statusFilter.toLowerCase();

        let matchesType = true;
        if (typeFilter === 'published') matchesType = artStatus === 'published';
        else if (typeFilter === 'draft') matchesType = artStatus === 'draft';
        else if (typeFilter === 'breaking') matchesType = !!a.isBreaking;
        else if (typeFilter === 'featured') matchesType = !!a.isFeatured;

        return matchesSearch && matchesCat && matchesStatus && matchesType;
      })
      .sort((a, b) => {
        const timeA = new Date(a.publishedAt).getTime();
        const timeB = new Date(b.publishedAt).getTime();
        return sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
      });
  }, [articles, search, categoryFilter, statusFilter, typeFilter, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage) || 1;
  const paginatedArticles = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredArticles.slice(start, start + itemsPerPage);
  }, [filteredArticles, currentPage]);

  const handleDelete = async (art: Article) => {
    if (window.confirm(`Are you sure you want to permanently delete "${art.title}"?\nThis operation will remove the article from MongoDB Atlas and cannot be undone.`)) {
      await onDeleteNews(art.id);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-extrabold text-white tracking-wide uppercase font-mono">
              NEWS MANAGEMENT
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
              {totalCount} Total in Database
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Create, moderate, publish, and manage verified news articles stored permanently in MongoDB Atlas
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={onRefresh}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all cursor-pointer"
            title="Refresh News from MongoDB"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenAddNews}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-950/50 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add News</span>
          </button>
        </div>
      </div>

      {/* Quick Filter Tabs Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => { setTypeFilter('all'); setCurrentPage(1); }}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
            typeFilter === 'all'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-950/50'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <span>All Articles</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-white/20 text-white">{totalCount}</span>
        </button>

        <button
          onClick={() => { setTypeFilter('published'); setCurrentPage(1); }}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
            typeFilter === 'published'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/50'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
          <span>Published News</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-white/20 text-white">{publishedCount}</span>
        </button>

        <button
          onClick={() => { setTypeFilter('draft'); setCurrentPage(1); }}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
            typeFilter === 'draft'
              ? 'bg-amber-600 text-white shadow-lg shadow-amber-950/50'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-amber-300" />
          <span>Draft News</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-white/20 text-white">{draftCount}</span>
        </button>

        <button
          onClick={() => { setTypeFilter('breaking'); setCurrentPage(1); }}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
            typeFilter === 'breaking'
              ? 'bg-rose-600 text-white shadow-lg shadow-rose-950/50'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-amber-300" />
          <span>Breaking News</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-white/20 text-white">{breakingCount}</span>
        </button>

        <button
          onClick={() => { setTypeFilter('featured'); setCurrentPage(1); }}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
            typeFilter === 'featured'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-950/50'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Star className="w-3.5 h-3.5 text-amber-300" />
          <span>Featured News</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-white/20 text-white">{featuredCount}</span>
        </button>
      </div>

      {/* Search & Filtering Toolbar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
              placeholder="Search news by title, author, or source..."
              className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors font-mono"
            />
          </div>

          {/* Filters & Sorting */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            
            {/* Category Filter */}
            <div className="flex items-center gap-1 bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-800 text-xs">
              <span className="text-slate-500 font-mono text-[10px] uppercase">Category:</span>
              <select
                value={categoryFilter}
                onChange={e => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
                className="bg-transparent text-slate-200 focus:outline-none font-mono text-xs cursor-pointer"
              >
                <option value="All" className="bg-slate-900">All Categories</option>
                {NEWS_CATEGORIES.map(cat => (
                  <option key={cat} value={cat} className="bg-slate-900">{cat}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1 bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-800 text-xs">
              <span className="text-slate-500 font-mono text-[10px] uppercase">Status:</span>
              <select
                value={statusFilter}
                onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                className="bg-transparent text-slate-200 focus:outline-none font-mono text-xs cursor-pointer"
              >
                <option value="All" className="bg-slate-900">All Statuses</option>
                <option value="Published" className="bg-slate-900">Published</option>
                <option value="Draft" className="bg-slate-900">Draft</option>
              </select>
            </div>

            {/* Sort Order */}
            <button
              onClick={() => setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white text-xs font-mono transition-colors cursor-pointer"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-indigo-400" />
              <span>{sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}</span>
            </button>

          </div>
        </div>
      </div>

      {/* News Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/70 shadow-2xl">
        <table className="w-full text-xs text-slate-300">
          <thead className="bg-slate-950 text-slate-500 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="p-3.5 text-left w-16">Image</th>
              <th className="p-3.5 text-left">Title</th>
              <th className="p-3.5 text-left">Category</th>
              <th className="p-3.5 text-left">Author</th>
              <th className="p-3.5 text-left">Publication Date</th>
              <th className="p-3.5 text-left">Status</th>
              <th className="p-3.5 text-left">Labels</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800/60 font-sans">
            {paginatedArticles.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-12 text-center text-slate-500">
                  <FileText className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="font-semibold text-slate-400 text-sm">No news articles found</p>
                  <p className="text-xs text-slate-600 mt-0.5">Try clearing filters or click "+ Add News" to create a new article in MongoDB.</p>
                </td>
              </tr>
            ) : (
              paginatedArticles.map(art => {
                const isDraft = (art as any).status === 'draft';
                const catStyle = getCategoryStyle(art.category);

                return (
                  <tr key={art.id} className="hover:bg-slate-900/60 transition-colors">
                    
                    {/* Image Column */}
                    <td className="p-3.5">
                      <img
                        src={art.imageUrl || DEFAULT_FALLBACK_IMAGE}
                        alt=""
                        onError={(e) => { (e.currentTarget as HTMLImageElement).src = DEFAULT_FALLBACK_IMAGE; }}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-800 shrink-0 bg-slate-900"
                      />
                    </td>

                    {/* Title Column */}
                    <td className="p-3.5 max-w-sm">
                      <div className="space-y-1">
                        <button
                          onClick={() => onOpenViewNews(art)}
                          className="font-bold text-slate-100 hover:text-indigo-400 transition-colors text-left line-clamp-2 cursor-pointer text-sm"
                        >
                          {art.title}
                        </button>
                        <div className="text-[11px] text-slate-500 truncate max-w-xs">
                          {art.description || art.excerpt || 'No description provided'}
                        </div>
                      </div>
                    </td>

                    {/* Category Column */}
                    <td className="p-3.5 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${catStyle.badgeColor} ${catStyle.textColor} ${catStyle.borderColor}`}>
                        {art.category}
                      </span>
                    </td>

                    {/* Author Column */}
                    <td className="p-3.5 whitespace-nowrap font-medium text-slate-300">
                      <div>{art.author || 'Editorial Board'}</div>
                      <div className="text-[10px] text-slate-500">{art.source?.name || 'Chronicle Wire'}</div>
                    </td>

                    {/* Publication Date Column */}
                    <td className="p-3.5 whitespace-nowrap font-mono text-[11px] text-slate-400">
                      <div>{new Date(art.publishedAt).toLocaleDateString()}</div>
                      <div className="text-[10px] text-slate-600">{new Date(art.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </td>

                    {/* Status Column */}
                    <td className="p-3.5 whitespace-nowrap">
                      {isDraft ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold font-mono bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-1 w-fit">
                          <Clock className="w-3 h-3" /> Draft
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 w-fit">
                          <CheckCircle2 className="w-3 h-3" /> Published
                        </span>
                      )}
                    </td>

                    {/* Breaking / Featured Labels Column */}
                    <td className="p-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-1 flex-wrap">
                        {art.isBreaking && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-rose-500/20 text-rose-400 border border-rose-500/40 uppercase tracking-wider flex items-center gap-1 animate-pulse shrink-0">
                            <Flame className="w-2.5 h-2.5" /> Breaking
                          </span>
                        )}

                        {art.isFeatured && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/40 uppercase tracking-wider flex items-center gap-1 shrink-0">
                            <Star className="w-2.5 h-2.5" /> Featured
                          </span>
                        )}

                        {!art.isBreaking && !art.isFeatured && (
                          <span className="text-[10px] text-slate-600 font-mono">Standard</span>
                        )}
                      </div>
                    </td>

                    {/* Actions Column */}
                    <td className="p-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        
                        {/* View Action */}
                        <button
                          onClick={() => onOpenViewNews(art)}
                          className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-indigo-500 text-slate-300 hover:text-indigo-400 transition-all cursor-pointer font-bold text-[11px] flex items-center gap-1"
                          title="View Article Details & AI Analysis"
                        >
                          <Eye className="w-3 h-3" />
                          <span>View</span>
                        </button>

                        {/* Edit Action */}
                        <button
                          onClick={() => onOpenEditNews(art)}
                          className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-500 text-slate-300 hover:text-amber-400 transition-all cursor-pointer font-bold text-[11px] flex items-center gap-1"
                          title="Edit Article Form"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>

                        {/* Publish / Unpublish Action */}
                        {isDraft ? (
                          <button
                            onClick={() => onPublishNews(art.id)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-900/60 transition-all cursor-pointer font-bold text-[11px] flex items-center gap-1"
                            title="Publish article to Recent News"
                          >
                            <Send className="w-3 h-3" />
                            <span>Publish</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => onUnpublishNews(art.id)}
                            className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-amber-400 hover:border-amber-500/40 transition-all cursor-pointer font-bold text-[11px] flex items-center gap-1"
                            title="Move article back to draft"
                          >
                            <span>Unpublish</span>
                          </button>
                        )}

                        {/* Delete Action */}
                        <button
                          onClick={() => handleDelete(art)}
                          className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-rose-500 text-slate-400 hover:text-rose-400 transition-all cursor-pointer"
                          title="Permanently Delete Article"
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
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
        <div className="text-slate-500 font-mono">
          Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredArticles.length)} of {filteredArticles.length} entries
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-40 cursor-pointer text-xs font-mono"
          >
            Previous
          </button>
          <span className="font-mono text-slate-300">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-40 cursor-pointer text-xs font-mono"
          >
            Next
          </button>
        </div>
      </div>

    </div>
  );
};
