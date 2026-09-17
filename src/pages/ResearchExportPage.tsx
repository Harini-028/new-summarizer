import React, { useState, useMemo } from 'react';
import { Article } from '../types';
import { 
  FileText, Download, CheckSquare, Square, Sparkles, Database,
  FileSpreadsheet, Copy, Check, Filter, Layers, Share2, Printer
} from 'lucide-react';

interface ResearchExportPageProps {
  articles: Article[];
}

export const ResearchExportPage: React.FC<ResearchExportPageProps> = ({ articles }) => {
  const [selectedArticleIds, setSelectedArticleIds] = useState<string[]>(
    articles.slice(0, 5).map(a => a.id)
  );
  const [reportTitle, setReportTitle] = useState('Chronicle AI Executive Intelligence Briefing');
  const [copiedMarkdown, setCopiedMarkdown] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtered articles list for selection
  const filteredArticles = useMemo(() => {
    return articles.filter(a => {
      const matchCat = filterCategory === 'All' || a.category === filterCategory;
      const matchQuery = !searchQuery || 
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [articles, filterCategory, searchQuery]);

  // Selected articles
  const selectedArticles = useMemo(() => {
    return articles.filter(a => selectedArticleIds.includes(a.id));
  }, [articles, selectedArticleIds]);

  const toggleSelect = (id: string) => {
    setSelectedArticleIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedArticleIds(filteredArticles.map(a => a.id));
  };

  const clearAll = () => {
    setSelectedArticleIds([]);
  };

  // Generate Markdown report string
  const generatedMarkdown = useMemo(() => {
    const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    let md = `# ${reportTitle}\n\n`;
    md += `**Generated Date:** ${dateStr}  \n`;
    md += `**Platform:** Chronicle AI Enterprise Intelligence Engine  \n`;
    md += `**Total Articles Synthesized:** ${selectedArticles.length}  \n\n`;
    md += `---\n\n## 1. Executive Briefing Summary\n\n`;
    md += `This intelligence dossier synthesizes empirical news telemetry across ${selectedArticles.length} primary enterprise sources. Key findings indicate accelerated technological advancement, robust regulatory frameworks, and positive operational outcomes across targeted sectors.\n\n`;
    md += `## 2. Synthesized Article Digest\n\n`;

    selectedArticles.forEach((art, idx) => {
      md += `### 2.${idx + 1} ${art.title}\n`;
      md += `- **Source:** ${art.source?.name} (${art.source?.trustScore}% Trust Score)\n`;
      md += `- **Category:** ${art.category}\n`;
      md += `- **Author:** ${art.author} | **Published:** ${new Date(art.publishedAt).toLocaleDateString()}\n`;
      md += `- **Sentiment:** ${art.sentiment?.type} (Score: ${art.sentiment?.score}, Tone: ${art.sentiment?.tone})\n`;
      md += `- **Fact-Check Status:** ${art.fakeNewsReport?.verdict} (${art.fakeNewsReport?.confidenceScore}% Confidence)\n\n`;
      md += `> ${art.excerpt}\n\n`;
      if (art.aiSummary?.keyTakeaway) {
        md += `**Key Takeaway:** ${art.aiSummary.keyTakeaway}\n\n`;
      }
      md += `---\n\n`;
    });

    md += `## 3. Methodological Citations & References\n\n`;
    selectedArticles.forEach((art, idx) => {
      md += `[${idx + 1}] ${art.author} (${new Date(art.publishedAt).getFullYear()}). "${art.title}". *${art.source?.name}*. Available at: ${art.url}\n`;
    });

    return md;
  }, [reportTitle, selectedArticles]);

  // Export Markdown download
  const handleDownloadMarkdown = () => {
    const blob = new Blob([generatedMarkdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Chronicle_AI_Research_Dossier_${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export JASP CSV download
  const handleDownloadCSV = () => {
    const headers = ['id','title','category','source','trustScore','author','publishedAt','sentiment','sentimentScore','fakeNewsVerdict','views','likes','bookmarks'].join(',');
    const rows = selectedArticles.map(a => [
      `"${a.id}"`,
      `"${(a.title || '').replace(/"/g, '""')}"`,
      `"${a.category || ''}"`,
      `"${a.source?.name || ''}"`,
      a.source?.trustScore || 50,
      `"${a.author || ''}"`,
      `"${a.publishedAt || ''}"`,
      `"${a.sentiment?.type || 'Neutral'}"`,
      a.sentiment?.score || 0,
      `"${a.fakeNewsReport?.verdict || 'Verified Authentic'}"`,
      a.viewsCount || 0,
      a.likesCount || 0,
      a.bookmarksCount || 0
    ].join(','));

    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Chronicle_AI_JASP_Dataset_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(generatedMarkdown);
    setCopiedMarkdown(true);
    setTimeout(() => setCopiedMarkdown(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-950/80 via-slate-900 to-purple-950/80 border border-cyan-500/20 p-8 shadow-2xl backdrop-blur-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-3">
              <Database className="w-3.5 h-3.5" /> Research & JASP Export Studio
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
              Enterprise Research Briefing & Dataset Exporter
            </h1>
            <p className="mt-2 text-slate-300 max-w-2xl text-sm leading-relaxed">
              Synthesize custom executive intelligence dossiers, format citations, and export clean research datasets directly compatible with JASP & SPSS statistical software.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleDownloadMarkdown}
              disabled={selectedArticles.length === 0}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-semibold transition-all shadow-lg shadow-purple-600/30 cursor-pointer"
            >
              <Download className="w-4 h-4" /> Download Markdown Dossier
            </button>
            <button
              onClick={handleDownloadCSV}
              disabled={selectedArticles.length === 0}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold transition-all shadow-lg shadow-emerald-600/30 cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" /> Download JASP CSV
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Article Selection List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" /> Select Source Articles ({selectedArticleIds.length})
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={selectAll}
                  className="text-xs text-purple-400 hover:text-purple-300 font-semibold"
                >
                  Select All
                </button>
                <span className="text-slate-700">|</span>
                <button
                  onClick={clearAll}
                  className="text-xs text-slate-400 hover:text-slate-300 font-semibold"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Search & Category Filter */}
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-purple-500"
              >
                <option value="All">All Categories</option>
                <option value="AI & Technology">AI & Technology</option>
                <option value="Business & Finance">Business & Finance</option>
                <option value="Science & Space">Science & Space</option>
                <option value="Health & Medicine">Health & Medicine</option>
                <option value="World & Politics">World & Politics</option>
                <option value="Climate & Environment">Climate & Environment</option>
                <option value="Entertainment & Culture">Entertainment & Culture</option>
              </select>
            </div>

            {/* Article Cards Scrollable Area */}
            <div className="max-h-[500px] overflow-y-auto space-y-2.5 pr-1">
              {filteredArticles.map((art) => {
                const isSelected = selectedArticleIds.includes(art.id);
                return (
                  <div
                    key={art.id}
                    onClick={() => toggleSelect(art.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                      isSelected 
                        ? 'bg-purple-950/40 border-purple-500/50 shadow-md' 
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="mt-0.5 text-purple-400 flex-shrink-0">
                      {isSelected ? <CheckSquare className="w-4 h-4 fill-purple-500/20" /> : <Square className="w-4 h-4 text-slate-600" />}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-bold text-purple-300">{art.category}</span>
                        <span className="text-slate-400">{art.source?.name}</span>
                      </div>
                      <h4 className="text-xs font-bold text-white leading-tight line-clamp-2">
                        {art.title}
                      </h4>
                      <div className="flex items-center gap-3 text-[10px] text-slate-400 pt-1">
                        <span className="text-emerald-400 font-semibold">{art.source?.trustScore}% Trust</span>
                        <span>{art.sentiment?.type}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Dossier Report Preview */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-slate-400 mb-1">Dossier Title</label>
                <input
                  type="text"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm font-bold text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div className="flex gap-2 self-end sm:self-center">
                <button
                  onClick={handleCopyMarkdown}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700 flex items-center gap-1.5"
                >
                  {copiedMarkdown ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedMarkdown ? 'Copied!' : 'Copy Markdown'}
                </button>
              </div>
            </div>

            {/* Markdown Report Preview Box */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 max-h-[550px] overflow-y-auto font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
              {generatedMarkdown}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
