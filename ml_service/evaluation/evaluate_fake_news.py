#!/usr/bin/env python3
"""
Chronicle AI — Fake News Model Evaluation Pipeline

Evaluates trained models on datasets/fake_news.csv, computing Accuracy, Precision, Recall, F1.
"""

import os
import sys
import pickle
from sklearn.metrics import classification_report, accuracy_score, precision_recall_fscore_support

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from preprocessing.fake_news_preprocessing import load_and_preprocess

MODELS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "saved_models")

def evaluate():
    X_train, X_test, y_train, y_test, vectorizer = load_and_preprocess()
    
    model_path = os.path.join(MODELS_DIR, "fake_news_model.pkl")
    if not os.path.exists(model_path):
        print("Trained model pkl not found. Training model first...")
        from training.train_fake_news import train
        train()
        
    with open(model_path, 'rb') as f:
        model = pickle.load(f)
        
    y_pred = model.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    prec, rec, f1, _ = precision_recall_fscore_support(y_test, y_pred, average='weighted')
    
    print("\n--- Chronicle AI Fake News Model Evaluation Report ---")
    print(f"Accuracy : {acc:.4f}")
    print(f"Precision: {prec:.4f}")
    print(f"Recall   : {rec:.4f}")
    print(f"F1-Score : {f1:.4f}")
    print("\nDetailed Metrics:")
    print(classification_report(y_test, y_pred, target_names=['Real', 'Fake']))

if __name__ == "__main__":
    evaluate()
