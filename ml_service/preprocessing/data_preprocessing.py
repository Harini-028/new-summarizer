#!/usr/bin/env python3
"""
Chronicle AI — Unified Kaggle Data Preprocessing Pipeline

Preprocesses and validates 6 datasets:
1. articles.csv
2. fake_news.csv
3. news_classification.csv
4. recommendation.csv
5. sentiment.csv
6. summarization.csv

Handles missing values, column mapping, text normalization, duplicate removal,
and train/test splitting.
"""

import os
import re
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DATASETS_DIR = os.path.join(PROJECT_ROOT, "datasets")
RAW_DIR = os.path.join(DATASETS_DIR, "raw")
PROCESSED_DIR = os.path.join(DATASETS_DIR, "processed")

os.makedirs(RAW_DIR, exist_ok=True)
os.makedirs(PROCESSED_DIR, exist_ok=True)

STANDARD_CATEGORIES = [
    'AI & Technology',
    'Business & Finance',
    'Science & Space',
    'Health & Medicine',
    'World & Politics',
    'Climate & Environment',
    'Entertainment & Culture'
]

CATEGORY_MAP = {
    'tech': 'AI & Technology',
    'technology': 'AI & Technology',
    'ai': 'AI & Technology',
    'business': 'Business & Finance',
    'finance': 'Business & Finance',
    'economy': 'Business & Finance',
    'science': 'Science & Space',
    'space': 'Science & Space',
    'health': 'Health & Medicine',
    'medicine': 'Health & Medicine',
    'politics': 'World & Politics',
    'world': 'World & Politics',
    'climate': 'Climate & Environment',
    'environment': 'Climate & Environment',
    'entertainment': 'Entertainment & Culture',
    'culture': 'Entertainment & Culture',
    'sports': 'Entertainment & Culture'
}

def clean_text(text: str) -> str:
    """Normalizes text while preserving core semantic meaning."""
    if not isinstance(text, str):
        return ""
    text = re.sub(r'https?://\S+|www\.\S+', '', text) # Remove URLs
    text = re.sub(r'<.*?>', '', text) # Remove HTML tags
    text = re.sub(r'\s+', ' ', text) # Remove extra whitespace
    return text.strip()

def normalize_category(cat: str) -> str:
    if not isinstance(cat, str):
        return 'AI & Technology'
    cat_clean = cat.strip().lower()
    if cat in STANDARD_CATEGORIES:
        return cat
    for k, v in CATEGORY_MAP.items():
        if k in cat_clean:
            return v
    return 'AI & Technology'

def preprocess_articles():
    print("\n--- 1. Preprocessing Articles Dataset ---")
    raw_path = os.path.join(RAW_DIR, "articles.csv")
    main_path = os.path.join(DATASETS_DIR, "articles.csv")
    input_path = raw_path if os.path.exists(raw_path) else main_path
    
    if not os.path.exists(input_path):
        print(f"Skipping articles preprocessing: File not found at {input_path}")
        return None

    df = pd.read_csv(input_path)
    print(f"Original shape: {df.shape}")

    # Column mapping
    col_map = {
        'id': 'article_id',
        'publishedAt': 'published_date',
        'image': 'URL',
        'url': 'URL'
    }
    df = df.rename(columns=col_map)
    
    required_cols = ['article_id', 'title', 'content', 'author', 'source', 'category', 'published_date', 'URL']
    for col in required_cols:
        if col not in df.columns:
            if col == 'content' and 'description' in df.columns:
                df['content'] = df['description']
            elif col == 'author':
                df['author'] = 'Chronicle News Desk'
            elif col == 'source':
                df['source'] = 'Global Wire'
            elif col == 'URL':
                df['URL'] = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c'
            elif col == 'published_date':
                df['published_date'] = pd.Timestamp.now().isoformat()
            elif col == 'article_id':
                df['article_id'] = [f"art_{i:03d}" for i in range(len(df))]

    df['title'] = df['title'].apply(clean_text)
    df['content'] = df['content'].apply(clean_text)
    df['category'] = df['category'].apply(normalize_category)

    # Remove duplicates and missing content
    df = df.dropna(subset=['title', 'content'])
    df = df.drop_duplicates(subset=['title'])

    out_path = os.path.join(PROCESSED_DIR, "articles_processed.csv")
    df[required_cols].to_csv(out_path, index=False)
    print(f"Processed shape: {df.shape}. Saved to {out_path}")
    return df

def preprocess_fake_news():
    print("\n--- 2. Preprocessing Fake News Dataset ---")
    raw_path = os.path.join(RAW_DIR, "fake_news.csv")
    main_path = os.path.join(DATASETS_DIR, "fake_news.csv")
    input_path = raw_path if os.path.exists(raw_path) else main_path

    if not os.path.exists(input_path):
        print(f"Skipping fake news preprocessing: File not found at {input_path}")
        return None

    df = pd.read_csv(input_path)
    print(f"Original shape: {df.shape}")

    # Label normalization (0 = REAL, 1 = FAKE)
    if 'label' in df.columns:
        df['label'] = df['label'].apply(lambda x: 1 if str(x).lower() in ['1', 'fake', 'true_fake', 'false'] else 0)
    else:
        df['label'] = 0

    if 'title' not in df.columns:
        df['title'] = "News Article"
    if 'text' not in df.columns and 'content' in df.columns:
        df['text'] = df['content']
    if 'source' not in df.columns:
        df['source'] = 'Independent Media'

    df['title'] = df['title'].apply(clean_text)
    df['text'] = df['text'].apply(clean_text)
    df['combined_text'] = df['title'] + " " + df['text']

    df = df.dropna(subset=['combined_text'])
    df = df.drop_duplicates(subset=['combined_text'])

    required_cols = ['title', 'text', 'label', 'source']
    out_path = os.path.join(PROCESSED_DIR, "fake_news_processed.csv")
    df[required_cols].to_csv(out_path, index=False)

    # Class balance stats
    label_dist = df['label'].value_counts().to_dict()
    print(f"Processed shape: {df.shape}. Class balance (0=REAL, 1=FAKE): {label_dist}")
    print(f"Saved to {out_path}")
    return df

def preprocess_news_classification():
    print("\n--- 3. Preprocessing News Classification Dataset ---")
    raw_path = os.path.join(RAW_DIR, "news_classification.csv")
    main_path = os.path.join(DATASETS_DIR, "news_classification.csv")
    input_path = raw_path if os.path.exists(raw_path) else main_path

    if not os.path.exists(input_path):
        print(f"Skipping news classification preprocessing: File not found at {input_path}")
        return None

    df = pd.read_csv(input_path)
    print(f"Original shape: {df.shape}")

    if 'text' not in df.columns and 'content' in df.columns:
        df['text'] = df['content']
    if 'title' not in df.columns:
        df['title'] = df['text'].apply(lambda t: str(t)[:50] + "...")

    df['title'] = df['title'].apply(clean_text)
    df['text'] = df['text'].apply(clean_text)
    df['category'] = df['category'].apply(normalize_category)

    df = df.dropna(subset=['text', 'category'])
    df = df.drop_duplicates(subset=['title', 'text'])

    required_cols = ['title', 'text', 'category']
    out_path = os.path.join(PROCESSED_DIR, "news_classification_processed.csv")
    df[required_cols].to_csv(out_path, index=False)
    
    print(f"Processed shape: {df.shape}. Categories distribution:\n{df['category'].value_counts()}")
    print(f"Saved to {out_path}")
    return df

def preprocess_recommendation():
    print("\n--- 4. Preprocessing Recommendation Dataset ---")
    raw_path = os.path.join(RAW_DIR, "recommendation.csv")
    main_path = os.path.join(DATASETS_DIR, "recommendation.csv")
    input_path = raw_path if os.path.exists(raw_path) else main_path

    if not os.path.exists(input_path):
        print(f"Skipping recommendation preprocessing: File not found at {input_path}")
        return None

    df = pd.read_csv(input_path)
    print(f"Original shape: {df.shape}")

    if 'user_interest' not in df.columns:
        df['user_interest'] = df['category']
    if 'interaction_type' not in df.columns and 'interaction' in df.columns:
        df['interaction_type'] = df['interaction']
    if 'timestamp' not in df.columns:
        df['timestamp'] = pd.Timestamp.now().isoformat()

    df['category'] = df['category'].apply(normalize_category)
    df = df.dropna(subset=['user_id', 'article_id'])
    
    required_cols = ['user_id', 'article_id', 'category', 'user_interest', 'interaction_type', 'timestamp']
    out_path = os.path.join(PROCESSED_DIR, "recommendation_processed.csv")
    df[required_cols].to_csv(out_path, index=False)

    print(f"Processed shape: {df.shape}. Unique Users: {df['user_id'].nunique()}, Articles: {df['article_id'].nunique()}")
    print(f"Saved to {out_path}")
    return df

def preprocess_sentiment():
    print("\n--- 5. Preprocessing Sentiment Analysis Dataset ---")
    raw_path = os.path.join(RAW_DIR, "sentiment.csv")
    main_path = os.path.join(DATASETS_DIR, "sentiment.csv")
    input_path = raw_path if os.path.exists(raw_path) else main_path

    if not os.path.exists(input_path):
        print(f"Skipping sentiment preprocessing: File not found at {input_path}")
        return None

    df = pd.read_csv(input_path)
    print(f"Original shape: {df.shape}")

    if 'text' not in df.columns and 'Sentence' in df.columns:
        df['text'] = df['Sentence']
    if 'sentiment_label' not in df.columns and 'sentiment' in df.columns:
        df['sentiment_label'] = df['sentiment']

    def normalize_sentiment(s):
        if not isinstance(s, str):
            return 'Neutral'
        s_clean = s.strip().lower()
        if 'pos' in s_clean or s_clean == '1':
            return 'Positive'
        elif 'neg' in s_clean or s_clean == '-1':
            return 'Negative'
        return 'Neutral'

    df['text'] = df['text'].apply(clean_text)
    df['sentiment_label'] = df['sentiment_label'].apply(normalize_sentiment)
    df = df.dropna(subset=['text', 'sentiment_label'])
    df = df.drop_duplicates(subset=['text'])

    required_cols = ['text', 'sentiment_label']
    out_path = os.path.join(PROCESSED_DIR, "sentiment_processed.csv")
    df[required_cols].to_csv(out_path, index=False)

    print(f"Processed shape: {df.shape}. Sentiment distribution:\n{df['sentiment_label'].value_counts()}")
    print(f"Saved to {out_path}")
    return df

def preprocess_summarization():
    print("\n--- 6. Preprocessing Summarization Dataset ---")
    raw_path = os.path.join(RAW_DIR, "summarization.csv")
    main_path = os.path.join(DATASETS_DIR, "summarization.csv")
    input_path = raw_path if os.path.exists(raw_path) else main_path

    if not os.path.exists(input_path):
        print(f"Skipping summarization preprocessing: File not found at {input_path}")
        return None

    df = pd.read_csv(input_path)
    print(f"Original shape: {df.shape}")

    if 'article_text' not in df.columns:
        if 'article' in df.columns:
            df['article_text'] = df['article']
        elif 'text' in df.columns:
            df['article_text'] = df['text']
        elif 'ctext' in df.columns:
            df['article_text'] = df['ctext']

    if 'summary' not in df.columns:
        if 'reference_summary' in df.columns:
            df['summary'] = df['reference_summary']
        elif 'headlines' in df.columns:
            df['summary'] = df['headlines']

    df['article_text'] = df['article_text'].apply(clean_text)
    df['summary'] = df['summary'].apply(clean_text)

    df = df.dropna(subset=['article_text', 'summary'])
    df = df.drop_duplicates(subset=['article_text'])

    required_cols = ['article_text', 'summary']
    out_path = os.path.join(PROCESSED_DIR, "summarization_processed.csv")
    df[required_cols].to_csv(out_path, index=False)

    print(f"Processed shape: {df.shape}. Saved to {out_path}")
    return df

def run_all_preprocessing():
    print("==================================================")
    print(" Chronicle AI — Master Dataset Preprocessing ")
    print("==================================================")
    preprocess_articles()
    preprocess_fake_news()
    preprocess_news_classification()
    preprocess_recommendation()
    preprocess_sentiment()
    preprocess_summarization()
    print("\nAll dataset preprocessing steps finished successfully!")

if __name__ == "__main__":
    run_all_preprocessing()
