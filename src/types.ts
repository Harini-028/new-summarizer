export type CategoryType = 
  | 'All'
  | 'AI & Technology'
  | 'Business & Finance'
  | 'Science & Space'
  | 'Health & Medicine'
  | 'World & Politics'
  | 'Climate & Environment'
  | 'Entertainment & Culture';

export type SentimentType = 'Positive' | 'Neutral' | 'Negative';

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: CategoryType;
  source: {
    name: string;
    logo?: string;
    domain: string;
    trustScore: number; // 0 - 100
  };
  author: string;
  publishedAt: string;
  url: string;
  imageUrl: string;
  readTimeMinutes: number;
  
  // AI / ML metadata
  aiSummary: {
    bullets: string[];
    executiveParagraph: string;
    keyTakeaway: string;
  };
  sentiment: {
    type: SentimentType;
    score: number; // -1.0 to 1.0
    label: string;
    tone: string;
    politicalSpectrum?: 'Left' | 'Center-Left' | 'Center' | 'Center-Right' | 'Right';
  };
  fakeNewsReport: {
    isLikelyFake: boolean;
    confidenceScore: number; // 0 - 100
    verdict: 'Verified Authentic' | 'Needs Fact-Checking' | 'High Misinformation Risk';
    redFlags: string[];
    factCheckSources: string[];
  };
  entities: {
    organizations: string[];
    people: string[];
    locations: string[];
    keywords: string[];
  };
  recommendationScore: number; // 0 - 100
  likesCount: number;
  bookmarksCount: number;
  sharesCount: number;
  viewsCount: number;
  isBookmarked?: boolean;
  isLiked?: boolean;
  isBreaking?: boolean;
  isTrending?: boolean;
  isFeatured?: boolean;
  duplicateCount?: number; // number of similar articles
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: 'user' | 'admin' | 'subscriber';
  plan: 'Free Tier' | 'Pro Member' | 'Enterprise SaaS';
  interests: CategoryType[];
  readingStats: {
    totalArticlesRead: number;
    totalMinutesSpent: number;
    streakDays: number;
    savedArticlesCount: number;
    favoriteCategory: CategoryType;
    readingStreakUpdatedDate?: string;
  };
  preferences: {
    theme: 'dark' | 'light' | 'system';
    dailyBriefingEmail: boolean;
    voiceAccent: 'Kore' | 'Puck' | 'Zephyr' | 'Fenrir';
    autoSummarizeOnOpen: boolean;
    fakeNewsSensitivity: 'High' | 'Medium' | 'Low';
    notificationPreferences?: NotificationPreferences;
  };
}

export interface NotificationPreferences {
  breakingNews: boolean;
  dailyBrief: boolean;
  weeklyDigest: boolean;
  recommendations: boolean;
  followedTopics: boolean;
  followedSources: boolean;
}

export interface MLTelemetry {
  fastApiStatus: 'Connected' | 'Degraded' | 'Offline';
  latencyMs: number;
  activeModel: string;
  vectorIndexCount: number;
  bertTopicClustersCount: number;
  accuracyScore: number;
  f1Score: number;
  sentimentModelLoss: number;
  processedArticlesToday: number;
  uptimePercentage: number;
}

export interface DailyBrief {
  id: string;
  date: string;
  title: string;
  subtitle: string;
  audioUrl?: string;
  durationSeconds: number;
  keyHighlights: string[];
  topArticles: Article[];
  marketOverview: {
    index: string;
    change: string;
    isPositive: boolean;
  }[];
}

// ─── New Types ────────────────────────────────────────────────────────────────

export interface BookmarkCollection {
  id: string;
  name: string;
  icon: string;
  color: string;
  articleIds: string[];
  createdAt: string;
}

export interface Achievement {
  id: string;
  icon: string;
  title: string;
  description: string;
  unlockedAt?: string;
  progress?: number; // 0-100
  isUnlocked: boolean;
  category: 'reading' | 'engagement' | 'exploration' | 'streak';
}

export interface TimelineEvent {
  date: string;
  time?: string;
  title: string;
  description: string;
  source: string;
  importance: 'high' | 'medium' | 'low';
  type: 'event' | 'response' | 'development' | 'update';
}

export interface StoryTimeline {
  topic: string;
  summary: string;
  events: TimelineEvent[];
  lastUpdated: string;
  relatedArticleIds: string[];
}

export interface SourceCredibility {
  domain: string;
  name: string;
  overallScore: number; // 0-100
  factors: {
    historicalAccuracy: number;
    citationRate: number;
    correctionHistory: number;
    crossSourceAgreement: number;
    biasIndicator: number;
  };
  tier: 'High Credibility' | 'Moderate Credibility' | 'Low Credibility' | 'Unknown';
  verdict: string;
}

export interface ArticleComparison {
  articleIds: string[];
  commonPoints: string[];
  differences: string[];
  viewpoints: { source: string; stance: string }[];
  importantFacts: string[];
  missingInfo: string[];
  sourceSummaryComparison: { source: string; summary: string }[];
  overallConclusion: string;
}

export interface ClaimExtraction {
  claim: string;
  confidence: number;
  supportingCount: number;
  conflictingCount: number;
  sources: string[];
}

export interface DiversityScore {
  overall: number; // 0-100
  categoryBreakdown: { category: string; percentage: number; count: number }[];
  sourceBreakdown: { source: string; percentage: number }[];
  overRelianceWarning?: string;
  recommendations: string[];
}

export interface PersonalNewsScore {
  score: number; // 0-100
  date: string;
  breakdown: {
    importantStoriesRead: number;
    topicDiversity: number;
    breakingNewsAwareness: number;
    interestAlignment: number;
  };
  message: string;
  missedImportantStories: number;
}

export interface NewsSource {
  id: string;
  name: string;
  domain: string;
  type: 'RSS' | 'REST API' | 'Webhook' | 'Scraper';
  status: 'active' | 'paused' | 'error' | 'disabled';
  priority: 1 | 2 | 3 | 4 | 5;
  credibilityScore: number;
  articlesPerDay: number;
  lastFetchAt?: string;
  errorMessage?: string;
}

export interface ArticleReport {
  id: string;
  articleId: string;
  articleTitle: string;
  reason: ReportReason;
  details?: string;
  reportedAt: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  reviewedBy?: string;
}

export type ReportReason =
  | 'fake_information'
  | 'duplicate_article'
  | 'offensive_content'
  | 'incorrect_category'
  | 'broken_article'
  | 'misleading_headline';

export interface ModelMetrics {
  name: string;
  task: string;
  framework: string;
  modelType: 'pretrained' | 'fine-tuned' | 'rule-based';
  status: 'healthy' | 'warning' | 'needs_retraining' | 'offline';
  metrics: {
    accuracy?: number;
    f1?: number;
    precision?: number;
    recall?: number;
    rouge1?: number;
    rouge2?: number;
    rougeL?: number;
    rocAuc?: number;
    ndcgAtK?: number;
    precisionAtK?: number;
  };
  lastEvaluated?: string;
  callsToday: number;
  avgLatencyMs: number;
}

export interface SystemHealth {
  backend: { status: 'healthy' | 'degraded' | 'down'; latencyMs: number };
  database: { status: 'connected' | 'disconnected' | 'degraded'; type: string };
  mlService: { status: 'online' | 'offline' | 'degraded'; latencyMs: number };
  redis: { status: 'connected' | 'fallback' | 'offline' };
  errorRate: number; // percentage
  requestsPerMinute: number;
  uptime: string;
}

export interface TrendData {
  topic: string;
  category: CategoryType;
  trend: 'rising' | 'stable' | 'declining';
  changePercent: number;
  dataPoints: { date: string; count: number }[];
  velocity: number;
}

export interface PerspectivePersona {
  id: string;
  name: string;
  role: string;
  avatar: string;
  badge: string;
  color: string;
  stance: 'Strongly Support' | 'Moderate Support' | 'Neutral' | 'Moderate Oppose' | 'Critical';
  summary: string;
  keyArguments: string[];
  biasRating: number; // 0-100
}

export interface FactCheckWorkbenchResult {
  urlOrText: string;
  analyzedAt: string;
  verdict: 'Verified Authentic' | 'Needs Context' | 'Misleading Claims' | 'High Synthetic Risk';
  confidenceScore: number;
  syntheticScore: number; // 0-100 (AI generated likelihood)
  clickbaitScore: number; // 0-100
  sourceCredibilityScore: number; // 0-100
  extractedClaims: {
    claim: string;
    verdict: 'Supported' | 'Unverified' | 'Disproven';
    explanation: string;
  }[];
  redFlags: string[];
  crossReferences: { source: string; snippet: string; matches: boolean }[];
}

export interface GeoNewsRegion {
  id: string;
  name: string;
  coordinates: { x: number; y: number }; // percentage on world map
  activeArticlesCount: number;
  sentimentBreakdown: { positive: number; neutral: number; negative: number };
  geopoliticalRiskScore: number; // 0-100
  trendingTopic: string;
  topHeadline: string;
  status: 'High Activity' | 'Stable' | 'Breaking Incident';
}

export type ActivePage = 
  | 'home'
  | 'personalized'
  | 'trending'
  | 'categories'
  | 'search'
  | 'history'
  | 'saved'
  | 'daily-brief'
  | 'voice-summary'
  | 'analytics'
  | 'ml-dashboard'
  | 'admin'
  | 'profile'
  | 'landing'
  | 'auth'
  | 'ai-chat'
  // New pages
  | 'compare'
  | 'timeline'
  | 'discovery'
  | 'missed'
  | 'interest-profile'
  | 'ai-models'
  | 'system-health'
  | 'media-bias'
  | 'research-export'
  | 'fake-news'
  | 'perspective'
  | 'fact-checker'
  | 'georadar';

