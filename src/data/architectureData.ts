export interface ArchModule {
  id: string;
  name: string;
  description: string;
  path: string;
  techStack: string[];
  files: {
    filename: string;
    description: string;
    codeSnippet: string;
  }[];
}

export const ENTERPRISE_ARCHITECTURE: ArchModule[] = [
  {
    id: 'client',
    name: 'Client Application (Frontend SPA / Next.js Architecture)',
    description: 'Responsive React 19 + TypeScript + Tailwind CSS UI featuring glassmorphic components, Framer Motion transitions, and Recharts analytics.',
    path: 'client/',
    techStack: ['React 19', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Recharts', 'Lucide React'],
    files: [
      {
        filename: 'client/src/App.tsx',
        description: 'Primary routing manager and layout context container.',
        codeSnippet: `// Primary client controller
import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import HomeFeed from './pages/HomeFeed';

export default function App() {
  const [activeTab, setActiveTab] = useState('feed');
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <Sidebar activeTab={activeTab} onSelect={setActiveTab} />
      <main className="flex-1 p-6">
        <Header />
        <HomeFeed />
      </main>
    </div>
  );
}`
      },
      {
        filename: 'client/src/services/api.ts',
        description: 'Axios API service abstraction handling JWT headers and response caching.',
        codeSnippet: `import axios from 'axios';

export const apiClient = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
});

export const fetchPersonalizedFeed = async (userId: string) => {
  const res = await apiClient.get(\`/news/personalized?userId=\${userId}\`);
  return res.data;
};`
      }
    ]
  },
  {
    id: 'server',
    name: 'Node.js / Express Backend Engine',
    description: 'RESTful API gateway built with Express, JWT authentication, rate-limiting, and Gemini AI SDK server-side integration.',
    path: 'server/',
    techStack: ['Node.js', 'Express', 'TypeScript', '@google/genai', 'JWT', 'Helmet', 'Cors'],
    files: [
      {
        filename: 'server/server.ts',
        description: 'Main Express entrypoint binding port 3000 and Gemini AI endpoint proxies.',
        codeSnippet: `import express from 'express';
import { GoogleGenAI } from '@google/genai';

const app = express();
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post('/api/ai/summarize', async (req, res) => {
  const { text } = req.body;
  const response = await ai.models.generateContent({
    model: 'gemini-3.6-flash',
    contents: \`Summarize this news article in 3 bullet points, compute sentiment (-1 to 1), and assess fake news probability: \${text}\`
  });
  res.json({ summary: response.text });
});

app.listen(3000, '0.0.0.0', () => console.log('Server running on port 3000'));`
      }
    ]
  },
  {
    id: 'ml-service',
    name: 'Python FastAPI Machine Learning Pipeline',
    description: 'Microservice running BERTopic clustering, FAISS vector embeddings, Scikit-learn fake news classifier, and SpaCy NER.',
    path: 'ml-service/',
    techStack: ['Python 3.11', 'FastAPI', 'PyTorch', 'Scikit-learn', 'FAISS', 'BERTopic', 'SpaCy'],
    files: [
      {
        filename: 'ml-service/main.py',
        description: 'FastAPI microservice endpoints for vector similarity and sentiment classification.',
        codeSnippet: `from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import sentence_transformers
import faiss
import numpy as np

app = FastAPI(title="Chronicle AI ML Pipeline", version="2.0.0")

class ArticleInput(BaseModel):
    title: str
    content: str

model = sentence_transformers.SentenceTransformer('all-MiniLM-L6-v2')
index = faiss.IndexFlatL2(384)

@app.post("/ml/embed-and-classify")
async def embed_article(article: ArticleInput):
    vector = model.encode([article.title + " " + article.content])
    index.add(np.array(vector))
    return {
        "status": "success",
        "embedding_dim": 384,
        "total_vectors_indexed": index.ntotal
    }`
      }
    ]
  },
  {
    id: 'database',
    name: 'Database Schemas & Vectors',
    description: 'MongoDB Mongoose collection schemas for Articles, UserProfiles, ReadingLogs, and MLVectorStores.',
    path: 'database/',
    techStack: ['MongoDB Atlas', 'Mongoose ODM', 'Redis Cache'],
    files: [
      {
        filename: 'database/models/Article.ts',
        description: 'Mongoose article schema with text search indexes and vector embedding references.',
        codeSnippet: `import { Schema, model } from 'mongoose';

const ArticleSchema = new Schema({
  title: { type: String, required: true, index: true },
  content: { type: String, required: true },
  category: { type: String, required: true, index: true },
  sentimentScore: { type: Number, default: 0 },
  fakeNewsConfidence: { type: Number, default: 100 },
  vectorEmbedding: [{ type: Number }],
  createdAt: { type: Date, default: Date.now, index: true }
});

export const ArticleModel = model('Article', ArticleSchema);`
      }
    ]
  },
  {
    id: 'docker',
    name: 'Containerization & CI/CD Pipelines',
    description: 'Docker Compose orchestration file bridging client, express server, fastapi ml service, and redis cache.',
    path: 'docker/',
    techStack: ['Docker', 'Docker Compose', 'GitHub Actions', 'Vercel', 'Render'],
    files: [
      {
        filename: 'docker/docker-compose.yml',
        description: 'Multi-container topology definition for seamless production staging.',
        codeSnippet: `version: '3.8'

services:
  web-client:
    build: ./client
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production

  express-gateway:
    build: ./server
    ports:
      - "5000:5000"
    environment:
      - GEMINI_API_KEY=\${GEMINI_API_KEY}
      - MONGODB_URI=\${MONGODB_URI}

  ml-fastapi:
    build: ./ml-service
    ports:
      - "8000:8000"
    volumes:
      - ./trained-models:/app/models`
      }
    ]
  }
];
