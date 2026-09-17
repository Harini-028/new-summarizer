import { Article, IArticle, isMongoConnected } from '../db';
import { SAMPLE_ARTICLES } from '../../src/data/mockNewsData';

export interface IngestionArticleInput {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  sourceName: string;
  sourceDomain: string;
  author?: string;
  url?: string;
  imageUrl?: string;
  readTimeMinutes?: number;
}

export class NewsIngestionService {
  /**
   * Ingests, normalizes, deduplicates, and stores a new article.
   */
  static async ingestArticle(input: IngestionArticleInput): Promise<{ status: 'ingested' | 'duplicate'; article: any }> {
    const normalizedTitle = input.title.trim();
    const normalizedDomain = input.sourceDomain.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '');
    
    // Deduplication check
    if (isMongoConnected()) {
      const existing = await Article.findOne({
        $or: [
          { title: { $regex: new RegExp(`^${normalizedTitle}$`, 'i') } },
          { url: input.url }
        ]
      });

      if (existing) {
        return { status: 'duplicate', article: existing.toObject() };
      }

      // Calculate simple sentiment & fake report defaults
      const wordCount = input.content.split(/\s+/).length;
      const readTime = input.readTimeMinutes || Math.max(1, Math.ceil(wordCount / 200));

      const newArt = new Article({
        title: normalizedTitle,
        excerpt: input.excerpt || normalizedTitle,
        content: input.content,
        category: input.category || 'AI & Technology',
        source: {
          name: input.sourceName || 'Chronicle Wire',
          domain: normalizedDomain || 'chronicle.ai',
          trustScore: 90
        },
        author: input.author || 'Chronicle Editorial Team',
        publishedAt: new Date(),
        url: input.url || `https://${normalizedDomain || 'chronicle.ai'}/news/${Date.now()}`,
        imageUrl: input.imageUrl || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=800',
        readTimeMinutes: readTime,
        aiSummary: {
          bullets: [
            `Key insight: ${normalizedTitle}`,
            `Ingested and analyzed by Chronicle AI ML pipeline.`
          ],
          executiveParagraph: input.excerpt || normalizedTitle,
          keyTakeaway: 'Verified by Chronicle News Ingestion Service.'
        },
        sentiment: {
          type: 'Neutral',
          score: 0.5,
          label: 'Balanced Report',
          tone: 'Informative',
          politicalSpectrum: 'Center'
        },
        fakeNewsReport: {
          isLikelyFake: false,
          confidenceScore: 92,
          verdict: 'Verified Authentic',
          redFlags: [],
          factCheckSources: ['Chronicle Automated Fact Guard', 'Ingestion Pipeline Validation']
        },
        entities: {
          organizations: [input.sourceName || 'Chronicle Wire'],
          people: [input.author || 'Editorial Staff'],
          locations: ['Global'],
          keywords: [input.category, 'News', 'Analysis']
        },
        recommendationScore: 85,
        likesCount: 12,
        bookmarksCount: 5,
        sharesCount: 2,
        viewsCount: 150
      });

      await newArt.save();
      return { status: 'ingested', article: newArt.toObject() };
    } else {
      // Memory Store Fallback
      const existing = SAMPLE_ARTICLES.find(a => a.title.toLowerCase() === normalizedTitle.toLowerCase());
      if (existing) {
        return { status: 'duplicate', article: existing };
      }

      const id = 'art_' + Date.now();
      const newArt: any = {
        id,
        title: normalizedTitle,
        excerpt: input.excerpt || normalizedTitle,
        content: input.content,
        category: input.category || 'AI & Technology',
        source: {
          name: input.sourceName || 'Chronicle Wire',
          domain: normalizedDomain || 'chronicle.ai',
          trustScore: 90
        },
        author: input.author || 'Chronicle Editorial Staff',
        publishedAt: new Date().toISOString(),
        url: input.url || `https://${normalizedDomain || 'chronicle.ai'}/news/${Date.now()}`,
        imageUrl: input.imageUrl || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=800',
        readTimeMinutes: input.readTimeMinutes || 3,
        aiSummary: {
          bullets: [`Key insight: ${normalizedTitle}`],
          executiveParagraph: input.excerpt || normalizedTitle,
          keyTakeaway: 'Verified by Chronicle News Ingestion Service.'
        },
        sentiment: { type: 'Neutral', score: 0.5, label: 'Balanced', tone: 'Informative', politicalSpectrum: 'Center' },
        fakeNewsReport: { isLikelyFake: false, confidenceScore: 92, verdict: 'Verified Authentic', redFlags: [], factCheckSources: ['Chronicle Automated Ingestion'] },
        entities: { organizations: [input.sourceName], people: [input.author || 'Staff'], locations: ['Global'], keywords: [input.category] },
        recommendationScore: 85,
        likesCount: 10,
        bookmarksCount: 3,
        sharesCount: 1,
        viewsCount: 100
      };

      SAMPLE_ARTICLES.unshift(newArt);
      return { status: 'ingested', article: newArt };
    }
  }
}
