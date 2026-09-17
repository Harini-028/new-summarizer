#!/usr/bin/env python3
"""
Chronicle AI — Fake News Training Pipeline

Trains TF-IDF + Logistic Regression / Gradient Boosting model on datasets/fake_news.csv.
"""

import os
import sys
import pickle
from sklearn.linear_model import LogisticRegression

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from preprocessing.fake_news_preprocessing import load_and_preprocess

MODELS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "saved_models")
os.makedirs(MODELS_DIR, exist_ok=True)

def train():
    print("Loading preprocessed fake news data...")
    X_train, X_test, y_train, y_test, vectorizer = load_and_preprocess()
    
    print("Training Logistic Regression classifier...")
    model = LogisticRegression(C=1.0, max_iter=1000)
    model.fit(X_train, y_train)
    
    acc = model.score(X_test, y_test)
    print(f"Model training complete. Test Accuracy: {acc * 100:.2f}%")
    
    model_path = os.path.join(MODELS_DIR, "fake_news_model.pkl")
    vec_path = os.path.join(MODELS_DIR, "fake_news_vectorizer.pkl")
    
    with open(model_path, 'wb') as f:
        pickle.dump(model, f)
    with open(vec_path, 'wb') as f:
        pickle.dump(vectorizer, f)
        
    print(f"Saved trained model artifacts to {MODELS_DIR}")

if __name__ == "__main__":
    train()
