import mongoose, { Schema, Document } from 'mongoose';
import { CategoryType, SentimentType } from '../src/types';

// Connection function with robust fallback detection
let isDbConnected = false;

export async function connectDatabase() {
  const uri = process.env.MONGODB_URI;
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (!uri) {
    if (isProduction) {
      console.error('CRITICAL ERROR: MONGODB_URI environment variable is missing. MongoDB Atlas connection is required in production.');
      process.exit(1);
    }
    console.log('INFO: Operating in local In-Memory database mode (Development).');
    return false;
  }
  
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000
    });
    isDbConnected = true;
    console.log('MongoDB Atlas Connected successfully.');
    return true;
  } catch (err: any) {
    if (isProduction) {
      console.error('CRITICAL ERROR: Failed to connect to MongoDB Atlas in production:', err.message);
      process.exit(1);
    }
    console.log('INFO: MongoDB Atlas connection refused. Falling back to local In-Memory database mode (Development).');
    isDbConnected = false;
    return false;
  }
}

export function isMongoConnected() {
  return isDbConnected && mongoose.connection.readyState === 1;
}

// ─── Schemas & Models ──────────────────────────────────────────────────────────

// 1. User
export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
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
    lastReadAt?: Date;
    readingStreakUpdatedDate?: string;
  };
  preferences: {
    theme: 'dark' | 'light' | 'system';
    dailyBriefingEmail: boolean;
    voiceAccent: 'Kore' | 'Puck' | 'Zephyr' | 'Fenrir';
    autoSummarizeOnOpen: boolean;
    fakeNewsSensitivity: 'High' | 'Medium' | 'Low';
  };
  isVerified: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  refreshToken?: string;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, index: true },
  passwordHash: { type: String, required: true },
  avatarUrl: { type: String, default: '' },
  role: { type: String, enum: ['user', 'admin', 'subscriber'], default: 'subscriber' },
  plan: { type: String, enum: ['Free Tier', 'Pro Member', 'Enterprise SaaS'], default: 'Free Tier' },
  interests: { type: [String], default: ['AI & Technology'] },
  readingStats: {
    totalArticlesRead: { type: Number, default: 0 },
    totalMinutesSpent: { type: Number, default: 0 },
    streakDays: { type: Number, default: 0 },
    savedArticlesCount: { type: Number, default: 0 },
    favoriteCategory: { type: String, default: 'AI & Technology' },
    lastReadAt: { type: Date },
    readingStreakUpdatedDate: { type: String }
  },
  preferences: {
    theme: { type: String, enum: ['dark', 'light', 'system'], default: 'dark' },
    dailyBriefingEmail: { type: Boolean, default: true },
    voiceAccent: { type: String, enum: ['Kore', 'Puck', 'Zephyr', 'Fenrir'], default: 'Kore' },
    autoSummarizeOnOpen: { type: Boolean, default: true },
    fakeNewsSensitivity: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' }
  },
  isVerified: { type: Boolean, default: false },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  refreshToken: String,
  createdAt: { type: Date, default: Date.now }
});

export const User: mongoose.Model<IUser> = (mongoose.models.User as any) || mongoose.model<IUser>('User', UserSchema);

// 2. Article
export interface IArticle extends Document {
  title: string;
  excerpt: string;
  content: string;
  description?: string;
  category: CategoryType;
  source: {
    name: string;
    logo?: string;
    domain: string;
    trustScore: number;
  };
  sourceUrl?: string;
  author: string;
  publishedAt: Date;
  url: string;
  imageUrl: string;
  readTimeMinutes: number;
  tags?: string[];
  aiSummary: {
    bullets: string[];
    executiveParagraph: string;
    keyTakeaway: string;
  };
  sentiment: {
    type: SentimentType;
    score: number;
    label: string;
    tone: string;
    politicalSpectrum?: 'Left' | 'Center-Left' | 'Center' | 'Center-Right' | 'Right';
  };
  fakeNewsReport: {
    isLikelyFake: boolean;
    confidenceScore: number;
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
  recommendationScore: number;
  likesCount: number;
  bookmarksCount: number;
  sharesCount: number;
  viewsCount: number;
  sourceType?: 'admin' | 'dataset' | 'api';
  status?: 'published' | 'draft';
  isBreaking?: boolean;
  isFeatured?: boolean;
  isTrending?: boolean;
  allowComments?: boolean;
  aiProcessingStatus?: 'completed' | 'pending' | 'failed';
}

const ArticleSchema = new Schema<IArticle>({
  title: { type: String, required: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, required: true, index: true },
  source: {
    name: { type: String, required: true },
    logo: String,
    domain: { type: String, required: true },
    trustScore: { type: Number, default: 80 }
  },
  author: { type: String, default: 'AI Editorial System' },
  publishedAt: { type: Date, default: Date.now, index: true },
  url: { type: String, required: true },
  imageUrl: { type: String, required: true },
  readTimeMinutes: { type: Number, default: 3 },
  aiSummary: {
    bullets: [String],
    executiveParagraph: String,
    keyTakeaway: String
  },
  sentiment: {
    type: { type: String, enum: ['Positive', 'Neutral', 'Negative'], required: true },
    score: { type: Number, default: 0 },
    label: String,
    tone: String,
    politicalSpectrum: { type: String, enum: ['Left', 'Center-Left', 'Center', 'Center-Right', 'Right'] }
  },
  fakeNewsReport: {
    isLikelyFake: { type: Boolean, default: false },
    confidenceScore: { type: Number, default: 90 },
    verdict: { type: String, enum: ['Verified Authentic', 'Needs Fact-Checking', 'High Misinformation Risk'], default: 'Verified Authentic' },
    redFlags: [String],
    factCheckSources: [String]
  },
  entities: {
    organizations: [String],
    people: [String],
    locations: [String],
    keywords: [String]
  },
  recommendationScore: { type: Number, default: 50 },
  likesCount: { type: Number, default: 0 },
  bookmarksCount: { type: Number, default: 0 },
  sharesCount: { type: Number, default: 0 },
  viewsCount: { type: Number, default: 0 },
  sourceType: { type: String, enum: ['admin', 'dataset', 'api'], default: 'admin' },
  status: { type: String, enum: ['published', 'draft'], default: 'published' },
  description: { type: String, default: '' },
  sourceUrl: { type: String, default: '' },
  tags: { type: [String], default: [] },
  isBreaking: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  isTrending: { type: Boolean, default: false },
  allowComments: { type: Boolean, default: true },
  aiProcessingStatus: { type: String, enum: ['completed', 'pending', 'failed'], default: 'completed' }
});

ArticleSchema.index({ title: 'text', excerpt: 'text', content: 'text' });
ArticleSchema.index({ category: 1, publishedAt: -1 });
ArticleSchema.index({ 'source.name': 1 });
ArticleSchema.index({ 'entities.keywords': 1 });

export const Article: mongoose.Model<IArticle> = (mongoose.models.Article as any) || mongoose.model<IArticle>('Article', ArticleSchema);

// 3. Reading Log
export interface IReadingLog extends Document {
  userId: string;
  articleId: string;
  readAt: Date;
  durationSec: number;
}

const ReadingLogSchema = new Schema<IReadingLog>({
  userId: { type: String, required: true, index: true },
  articleId: { type: String, required: true, index: true },
  readAt: { type: Date, default: Date.now },
  durationSec: { type: Number, default: 60 }
});

export const ReadingLog: mongoose.Model<IReadingLog> = (mongoose.models.ReadingLog as any) || mongoose.model<IReadingLog>('ReadingLog', ReadingLogSchema);

// 4. Bookmark
export interface IBookmark extends Document {
  userId: string;
  articleId: string;
  collectionName: string;
  savedAt: Date;
}

const BookmarkSchema = new Schema<IBookmark>({
  userId: { type: String, required: true, index: true },
  articleId: { type: String, required: true, index: true },
  collectionName: { type: String, default: 'General' },
  savedAt: { type: Date, default: Date.now }
});

export const Bookmark: mongoose.Model<IBookmark> = (mongoose.models.Bookmark as any) || mongoose.model<IBookmark>('Bookmark', BookmarkSchema);

// 5. Notification
export interface INotification extends Document {
  userId: string;
  title: string;
  message: string;
  unread: boolean;
  time: string;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>({
  userId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  unread: { type: Boolean, default: true },
  time: { type: String, default: 'Just now' },
  createdAt: { type: Date, default: Date.now }
});

export const Notification: mongoose.Model<INotification> = (mongoose.models.Notification as any) || mongoose.model<INotification>('Notification', NotificationSchema);

// 6. News Source
export interface INewsSource extends Document {
  name: string;
  url: string;
  domain: string;
  category: CategoryType;
  status: 'active' | 'paused' | 'error' | 'disabled';
  type: 'RSS' | 'REST API' | 'Webhook' | 'Scraper';
  articlesCollected: number;
  lastSyncAt: Date;
  apiStatus: 'online' | 'degraded' | 'offline';
  credibilityScore: number;
  priority: number;
}

const NewsSourceSchema = new Schema<INewsSource>({
  name: { type: String, required: true },
  url: { type: String, required: true },
  domain: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  status: { type: String, enum: ['active', 'paused', 'error', 'disabled'], default: 'active' },
  type: { type: String, enum: ['RSS', 'REST API', 'Webhook', 'Scraper'], default: 'RSS' },
  articlesCollected: { type: Number, default: 0 },
  lastSyncAt: { type: Date, default: Date.now },
  apiStatus: { type: String, enum: ['online', 'degraded', 'offline'], default: 'online' },
  credibilityScore: { type: Number, default: 90 },
  priority: { type: Number, default: 2 }
});

export const NewsSource: mongoose.Model<INewsSource> = (mongoose.models.NewsSource as any) || mongoose.model<INewsSource>('NewsSource', NewsSourceSchema);

// 7. Dataset Record
export interface IDatasetRecord extends Document {
  name: string;
  fileName: string;
  recordsCount: number;
  columnsCount: number;
  columnsList: string[];
  purpose: string;
  version: string;
  lastUpdated: Date;
  trainingStatus: 'Ready' | 'In Training' | 'Validating' | 'Needs Update';
}

const DatasetRecordSchema = new Schema<IDatasetRecord>({
  name: { type: String, required: true, unique: true },
  fileName: { type: String, required: true },
  recordsCount: { type: Number, default: 0 },
  columnsCount: { type: Number, default: 0 },
  columnsList: [String],
  purpose: { type: String, default: 'Model Evaluation' },
  version: { type: String, default: 'v1.0' },
  lastUpdated: { type: Date, default: Date.now },
  trainingStatus: { type: String, enum: ['Ready', 'In Training', 'Validating', 'Needs Update'], default: 'Ready' }
});

export const DatasetRecord: mongoose.Model<IDatasetRecord> = (mongoose.models.DatasetRecord as any) || mongoose.model<IDatasetRecord>('DatasetRecord', DatasetRecordSchema);

// 8. Admin Audit Log
export interface IAdminLog extends Document {
  timestamp: Date;
  level: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
  service: string;
  message: string;
  userEmail?: string;
  ipAddress?: string;
}

const AdminLogSchema = new Schema<IAdminLog>({
  timestamp: { type: Date, default: Date.now },
  level: { type: String, enum: ['INFO', 'WARNING', 'ERROR', 'CRITICAL'], default: 'INFO' },
  service: { type: String, required: true },
  message: { type: String, required: true },
  userEmail: String,
  ipAddress: String
});

export const AdminLog: mongoose.Model<IAdminLog> = (mongoose.models.AdminLog as any) || mongoose.model<IAdminLog>('AdminLog', AdminLogSchema);

// 9. Admin Settings
export interface IAdminSetting extends Document {
  key: string;
  value: any;
  category: string;
  updatedAt: Date;
}

const AdminSettingSchema = new Schema<IAdminSetting>({
  key: { type: String, required: true, unique: true },
  value: { type: Schema.Types.Mixed, required: true },
  category: { type: String, default: 'general' },
  updatedAt: { type: Date, default: Date.now }
});

export const AdminSetting: mongoose.Model<IAdminSetting> = (mongoose.models.AdminSetting as any) || mongoose.model<IAdminSetting>('AdminSetting', AdminSettingSchema);

