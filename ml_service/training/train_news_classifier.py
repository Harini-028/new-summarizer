#!/usr/bin/env python3
"""
Chronicle AI — News Category Classifier Training Pipeline

Trains TF-IDF + Logistic Regression classifier on news classification dataset.
Saves model and vectorizer pkl artifacts to ml_service/saved_models/.
"""

import os
import sys
import pickle
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split

SYS_PATH = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if SYS_PATH not in sys.path:
    sys.path.append(SYS_PATH)

PROJECT_ROOT = os.path.dirname(SYS_PATH)
PROCESSED_PATH = os.path.join(PROJECT_ROOT, "datasets", "processed", "news_classification_processed.csv")
RAW_PATH = os.path.join(PROJECT_ROOT, "datasets", "news_classification.csv")
MODELS_DIR = os.path.join(SYS_PATH, "saved_models")
os.makedirs(MODELS_DIR, exist_ok=True)

def train():
    data_file = PROCESSED_PATH if os.path.exists(PROCESSED_PATH) else RAW_PATH
    if not os.path.exists(data_file):
        raise FileNotFoundError(f"News classification dataset not found at {data_file}")

    print(f"Loading dataset from {data_file}...")
    df = pd.read_csv(data_file)

    if 'text' in df.columns and 'title' in df.columns:
        df['combined_text'] = df['title'].fillna('') + " " + df['text'].fillna('')
    elif 'text' in df.columns:
        df['combined_text'] = df['text'].fillna('')
    else:
        df['combined_text'] = df.iloc[:, 0].astype(str)

    X = df['combined_text']
    y = df['category']

    print(f"Dataset samples: {len(df)}. Category distribution:\n{y.value_counts()}")

    # Safe stratification check
    counts = y.value_counts()
    strat = y if (len(counts) > 1 and counts.min() >= 2) else None

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=strat)

    vectorizer = TfidfVectorizer(max_features=5000, stop_words='english', ngram_range=(1, 2))
    X_train_tfidf = vectorizer.fit_transform(X_train)
    X_test_tfidf = vectorizer.transform(X_test)

    print("Training Logistic Regression Category Classifier...")
    model = LogisticRegression(C=1.0, max_iter=1000)
    model.fit(X_train_tfidf, y_train)

    train_acc = model.score(X_train_tfidf, y_train)
    test_acc = model.score(X_test_tfidf, y_test)
    print(f"Training accuracy: {train_acc * 100:.2f}%, Test accuracy: {test_acc * 100:.2f}%")

    model_path = os.path.join(MODELS_DIR, "news_category_model.pkl")
    vec_path = os.path.join(MODELS_DIR, "news_category_vectorizer.pkl")

    with open(model_path, 'wb') as f:
        pickle.dump(model, f)
    with open(vec_path, 'wb') as f:
        pickle.dump(vectorizer, f)

    print(f"Successfully saved news category model artifacts to {MODELS_DIR}")
    return model, vectorizer

if __name__ == "__main__":
    train()
