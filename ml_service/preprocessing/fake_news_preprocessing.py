#!/usr/bin/env python3
"""
Chronicle AI — Fake News Preprocessing Pipeline

Preprocesses datasets/fake_news.csv by cleaning text, tokenizing,
extracting TF-IDF features, and preparing train/test splits.
"""

import os
import pandas as pd
import re
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DATASET_PATH = os.path.join(PROJECT_ROOT, "datasets", "fake_news.csv")

def clean_text(text):
    if not isinstance(text, str):
        return ""
    text = re.sub(r'https?://\S+|www\.\S+', '', text)
    text = re.sub(r'<.*?>', '', text)
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    return text.lower().strip()

def load_and_preprocess():
    if not os.path.exists(DATASET_PATH):
        raise FileNotFoundError(f"Dataset not found at {DATASET_PATH}")
    
    df = pd.read_csv(DATASET_PATH)
    df['clean_title'] = df['title'].apply(clean_text)
    df['clean_text'] = df['text'].apply(clean_text)
    df['combined_text'] = df['clean_title'] + " " + df['clean_text']
    
    X = df['combined_text']
    y = df['label']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y if len(y.unique()) > 1 else None)
    
    vectorizer = TfidfVectorizer(max_features=5000, stop_words='english')
    X_train_tfidf = vectorizer.fit_transform(X_train)
    X_test_tfidf = vectorizer.transform(X_test)
    
    return X_train_tfidf, X_test_tfidf, y_train, y_test, vectorizer

if __name__ == "__main__":
    X_tr, X_te, y_tr, y_te, vec = load_and_preprocess()
    print(f"Preprocessing completed. Train shape: {X_tr.shape}, Test shape: {X_te.shape}")
