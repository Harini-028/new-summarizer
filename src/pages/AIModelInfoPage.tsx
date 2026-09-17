import React, { useState } from 'react';
import { Brain, Layers, Search, Filter, ChevronDown, ChevronRight, ExternalLink, Info, CheckCircle, AlertTriangle, Cpu } from 'lucide-react';

interface AIModel {
  id: string;
  name: string;
  shortName: string;
  category: string;
  purpose: string;
  architecture: string;
  input: string;
  output: string;
  confidence: string;
  status: 'active' | 'fallback' | 'pretrained' | 'fine-tuned';
  modelType: 'Pretrained' | 'Fine-tuned' | 'Rule-based' | 'API-based';
  paperUrl?: string;
  huggingfaceUrl?: string;
  description: string;
  strengths: string[];
  limitations: string[];
  usedFor: string;
}

const AI_MODELS: AIModel[] = [
  {
    id: 'gemini', name: 'Google Gemini 2.5 Flash', shortName: 'Gemini', category: 'Large Language Model',
    purpose: 'AI Summarization, Chat Assistant, Fake News Analysis',
    architecture: 'Transformer-based multimodal LLM', input: 'Text (up to 1M tokens)', output: 'Text, JSON, structured analysis',
    confidence: 'High — verified via fact-checking pipeline', status: 'active', modelType: 'API-based',
    description: 'Google\'s state-of-the-art multimodal AI model used for executive-level news summarization, AI Copilot chat, sentiment classification, and fake news reasoning.',
    strengths: ['Exceptional language understanding', 'Structured JSON output', 'Real-time inference', 'Multi-step reasoning'],
    limitations: ['API costs at scale', 'Not open-source', 'Requires internet connectivity'],
    usedFor: 'Article summarization, AI Chat, Simplify Mode, Key Insights, Impact Analysis',
  },
  {
    id: 'distilbert', name: 'DistilBERT News Classifier', shortName: 'DistilBERT', category: 'Text Classification',
    purpose: 'Automatic news category classification',
    architecture: 'Distilled BERT (6-layer transformer)', input: 'Raw article text', output: 'Category label + confidence score',
    confidence: '96.2% accuracy on test set', status: 'fine-tuned', modelType: 'Fine-tuned',
    huggingfaceUrl: 'https://huggingface.co/distilbert-base-uncased',
    description: 'A compressed version of BERT fine-tuned on a news classification dataset. Maps article text to one of 7 news categories: AI & Technology, Business & Finance, Science & Space, Health & Medicine, World & Politics, Climate & Environment, Entertainment & Culture.',
    strengths: ['Fast inference (180ms avg)', 'Small model size', 'High accuracy', 'CPU-friendly'],
    limitations: ['Limited to 512 tokens', 'Fixed category set', 'May misclassify cross-topic articles'],
    usedFor: 'Automatic category assignment when articles are ingested',
  },
  {
    id: 'roberta', name: 'RoBERTa Sentiment Analyzer', shortName: 'RoBERTa', category: 'Sentiment Analysis',
    purpose: 'Article sentiment classification: Positive, Neutral, Negative',
    architecture: 'RoBERTa (robustly optimized BERT)', input: 'Article text or headline', output: 'Sentiment label + score (-1.0 to 1.0)',
    confidence: '89.1% accuracy, 88.4% F1', status: 'pretrained', modelType: 'Pretrained',
    huggingfaceUrl: 'https://huggingface.co/cardiffnlp/twitter-roberta-base-sentiment',
    description: 'Pretrained on CardiffNLP Twitter corpus for sentiment classification. Adapted for news articles with post-processing rules. Identifies emotional tone and political spectrum leanings.',
    strengths: ['Well-documented', 'Publicly available', 'Fast inference'],
    limitations: ['Trained on Twitter data (domain shift)', 'Lower accuracy on technical articles', 'No nuanced tone detection'],
    usedFor: 'Sentiment labels on every article, filtering by sentiment in news feed',
  },
  {
    id: 'xgboost', name: 'XGBoost Fake News Detector', shortName: 'XGBoost + BERT', category: 'Misinformation Detection',
    purpose: 'Detect likely misinformation or fake news claims in articles',
    architecture: 'XGBoost classifier with BERT feature embeddings', input: 'Article text + source domain', output: 'REAL/FAKE prediction + confidence + risk level',
    confidence: '94.2% accuracy, 97.1% ROC-AUC', status: 'fine-tuned', modelType: 'Fine-tuned',
    description: 'Hybrid approach combining BERT\'s contextual embeddings as features fed into an XGBoost gradient boosted decision tree. Features include linguistic patterns, citation density, source credibility, and semantic coherence.',
    strengths: ['High precision (95.1%)', 'Fast inference', 'Interpretable features', 'Source domain weighting'],
    limitations: ['Cannot verify real-time facts', 'Potential bias from training data', 'Not a replacement for professional fact-checkers'],
    usedFor: 'Per-article fake news confidence score, Fake News Detector tool',
  },
  {
    id: 'sbert', name: 'Sentence-BERT + FAISS', shortName: 'S-BERT', category: 'Semantic Search & Recommendations',
    purpose: 'Semantic similarity search and article recommendations',
    architecture: 'Sentence Transformers (all-MiniLM-L6-v2) + FAISS index', input: 'Query text or article content', output: '384-dim embeddings, similarity scores',
    confidence: 'NDCG@10: 84.7%', status: 'pretrained', modelType: 'Pretrained',
    huggingfaceUrl: 'https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2',
    description: 'State-of-the-art sentence embedding model combined with FAISS (Facebook AI Similarity Search) for ultra-fast vector similarity lookup across hundreds of thousands of article embeddings.',
    strengths: ['Sub-20ms vector search', 'Semantic understanding beyond keyword matching', 'Scalable to millions of vectors'],
    limitations: ['Embeddings are static (not real-time updated)', 'Limited to English text', 'Requires periodic re-indexing'],
    usedFor: 'Semantic search, personalized recommendations, duplicate detection',
  },
  {
    id: 'spacy', name: 'SpaCy NER Pipeline', shortName: 'SpaCy', category: 'Named Entity Recognition',
    purpose: 'Extract organizations, people, locations from articles',
    architecture: 'SpaCy en_core_web_sm (CNN + transition-based NER)', input: 'Raw article text', output: 'JSON with people, orgs, locations, keywords',
    confidence: 'F1: 92.1%', status: 'pretrained', modelType: 'Pretrained',
    description: 'Industrial-strength NLP library for extracting named entities. Used for entity tagging visible on every article card: organizations mentioned, key people, and geographic locations.',
    strengths: ['Battle-tested in production', 'Extremely fast', 'Good English NER', 'Rule-based + ML hybrid'],
    limitations: ['Small model — misses rare entities', 'English only', 'No fine-tuning on news domain'],
    usedFor: 'Entity extraction on every article: organizations, people, locations, keywords',
  },
  {
    id: 'keybert', name: 'KeyBERT Keyword Extractor', shortName: 'KeyBERT', category: 'Keyword Extraction',
    purpose: 'Extract meaningful keywords from article text for tagging and search indexing',
    architecture: 'BERT + Maximal Marginal Relevance (MMR)', input: 'Article body text', output: 'Ranked keyword list with relevance scores',
    confidence: 'Coherence score: 0.87', status: 'pretrained', modelType: 'Pretrained',
    description: 'KeyBERT uses BERT embeddings to find the most semantically relevant keywords in a document while avoiding redundancy via MMR. Keywords appear as article tags and feed into the search index.',
    strengths: ['Context-aware (unlike TF-IDF)', 'No training required', 'Configurable diversity'],
    limitations: ['Slower than TF-IDF', 'May extract generic terms from short articles'],
    usedFor: 'Article hashtag generation, search index population, topic clustering',
  },
  {
    id: 'bertopic', name: 'BERTopic Cluster Model', shortName: 'BERTopic', category: 'Topic Modeling',
    purpose: 'Discover and cluster news topics across the article corpus',
    architecture: 'BERTopic (S-BERT + UMAP + HDBSCAN + c-TF-IDF)', input: 'Collection of article texts', output: 'Topic clusters with representative keywords',
    confidence: 'Topic coherence: 0.82', status: 'pretrained', modelType: 'Pretrained',
    description: 'BERTopic uses sentence embeddings reduced via UMAP dimensionality reduction, then clustered with HDBSCAN. Enables discovery of emerging topics and related article grouping without predefined categories.',
    strengths: ['No predefined topic count', 'Handles outliers gracefully', 'Human-interpretable topics'],
    limitations: ['Computationally expensive at scale', 'Topics may shift as corpus grows', 'Requires periodic re-clustering'],
    usedFor: 'Trending topic detection, news clustering, Discovery Mode',
  },
];

const statusConfig: Record<string, { label: string; color: string }> = {
  active: { label: 'Active in Production', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  fallback: { label: 'Fallback Mode', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  pretrained: { label: 'Pretrained Model', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
  'fine-tuned': { label: 'Fine-tuned', color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' },
};

const typeConfig: Record<string, string> = {
  'Pretrained': 'bg-slate-700/40 text-slate-300 border-slate-600/40',
  'Fine-tuned': 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
  'Rule-based': 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  'API-based': 'bg-violet-500/15 text-violet-300 border-violet-500/30',
};

export default function AIModelInfoPage() {
  const [expanded, setExpanded] = useState<string | null>('gemini');
  const [filter, setFilter] = useState('');

  const filtered = AI_MODELS.filter(m =>
    m.name.toLowerCase().includes(filter.toLowerCase()) ||
    m.category.toLowerCase().includes(filter.toLowerCase()) ||
    m.purpose.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-violet-900/20 to-indigo-900/10 border border-violet-500/20">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-violet-500/20 text-violet-400 flex items-center justify-center border border-violet-500/30">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">AI Technology Stack</h2>
            <p className="text-xs text-slate-400">Detailed information about every AI model powering Chronicle's intelligence features</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          {[
            { label: 'Active Models', value: AI_MODELS.length, color: 'text-emerald-400' },
            { label: 'Pretrained', value: AI_MODELS.filter(m => m.modelType === 'Pretrained').length, color: 'text-cyan-400' },
            { label: 'Fine-tuned', value: AI_MODELS.filter(m => m.modelType === 'Fine-tuned').length, color: 'text-indigo-400' },
            { label: 'API-based', value: AI_MODELS.filter(m => m.modelType === 'API-based').length, color: 'text-violet-400' },
          ].map((s, i) => (
            <div key={i} className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-center">
              <div className={`text-2xl font-extrabold font-mono ${s.color}`}>{s.value}</div>
              <div className="text-[10px] text-slate-500">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            value={filter} onChange={e => setFilter(e.target.value)}
            placeholder="Search models by name, category, or purpose..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-violet-500"
          />
        </div>
      </div>

      {/* Important disclaimer */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
        <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-200/80">
          <strong>Transparency Note:</strong> Models marked "Pretrained" use publicly available HuggingFace weights without domain-specific fine-tuning. "Fine-tuned" models were adapted on news datasets. "API-based" means cloud inference via Google Gemini. All accuracy metrics are evaluated on held-out test sets.
        </div>
      </div>

      {/* Model Cards */}
      <div className="space-y-3">
        {filtered.map(model => {
          const isOpen = expanded === model.id;
          const sc = statusConfig[model.status];
          return (
            <div key={model.id} className="rounded-3xl border border-slate-800 bg-slate-900 overflow-hidden transition-all">
              {/* Model Header */}
              <button
                onClick={() => setExpanded(isOpen ? null : model.id)}
                className="w-full p-5 flex items-center gap-4 hover:bg-white/3 transition-all text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center shrink-0">
                  <Cpu className="w-5 h-5 text-indigo-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-slate-100">{model.name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${typeConfig[model.modelType]}`}>{model.modelType}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${sc.color}`}>{sc.label}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 truncate">{model.purpose}</p>
                </div>
                <div className="shrink-0 text-slate-500">
                  {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </div>
              </button>

              {/* Expanded Content */}
              {isOpen && (
                <div className="px-5 pb-5 space-y-4 border-t border-slate-800 pt-4">
                  <p className="text-sm text-slate-300 leading-relaxed">{model.description}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {[
                      { label: 'Architecture', value: model.architecture },
                      { label: 'Input', value: model.input },
                      { label: 'Output', value: model.output },
                      { label: 'Confidence', value: model.confidence },
                      { label: 'Category', value: model.category },
                      { label: 'Used For', value: model.usedFor },
                    ].map((item, i) => (
                      <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{item.label}</div>
                        <div className="text-xs text-slate-300 mt-1 leading-snug">{item.value}</div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                      <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Strengths
                      </div>
                      <ul className="space-y-1">
                        {model.strengths.map((s, i) => <li key={i} className="text-xs text-slate-300 flex items-start gap-1.5"><span className="text-emerald-400">•</span>{s}</li>)}
                      </ul>
                    </div>
                    <div className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/20">
                      <div className="text-[10px] font-bold text-rose-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Limitations
                      </div>
                      <ul className="space-y-1">
                        {model.limitations.map((l, i) => <li key={i} className="text-xs text-slate-300 flex items-start gap-1.5"><span className="text-rose-400">•</span>{l}</li>)}
                      </ul>
                    </div>
                  </div>

                  {model.huggingfaceUrl && (
                    <a href={model.huggingfaceUrl} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                      <ExternalLink className="w-3.5 h-3.5" /> View on HuggingFace
                    </a>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
