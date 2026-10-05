#!/usr/bin/env python3
"""
Chronicle AI — Unified Model Evaluation and Metrics Pipeline

Runs evaluation across all 5 ML models:
1. Fake News Classifier
2. News Category Classifier
3. Sentiment Analysis Model
4. Article Summarizer Benchmark
5. Recommendation Ranker Engine

Calculates empirical Accuracy, Precision, Recall, F1-Score, and Confusion Matrix.
Prints complete report and saves markdown evaluation report to docs/EVALUATION_REPORT.md.
"""

import os
import sys
import pickle
import pandas as pd
import numpy as np
from sklearn.metrics import accuracy_score, precision_recall_fscore_support, confusion_matrix, classification_report

SYS_PATH = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if SYS_PATH not in sys.path:
    sys.path.append(SYS_PATH)

PROJECT_ROOT = os.path.dirname(SYS_PATH)
PROCESSED_DIR = os.path.join(PROJECT_ROOT, "datasets", "processed")
RAW_DIR = os.path.join(PROJECT_ROOT, "datasets")
MODELS_DIR = os.path.join(SYS_PATH, "saved_models")
DOCS_DIR = os.path.join(PROJECT_ROOT, "docs")
os.makedirs(DOCS_DIR, exist_ok=True)

def evaluate_all():
    report_sections = []
    report_sections.append("# Chronicle AI — Machine Learning Models Empirical Evaluation Report\n")
    report_sections.append(f"**Generated Date:** {pd.Timestamp.now().strftime('%Y-%m-%d %H:%M:%S')}\n")

    # 1. Fake News Model Evaluation
    report_sections.append("## 1. Fake News Detection Model")
    fake_path = os.path.join(PROCESSED_DIR, "fake_news_processed.csv")
    if not os.path.exists(fake_path):
        fake_path = os.path.join(RAW_DIR, "fake_news.csv")

    if os.path.exists(fake_path):
        df_fake = pd.read_csv(fake_path)
        model_path = os.path.join(MODELS_DIR, "fake_news_model.pkl")
        vec_path = os.path.join(MODELS_DIR, "fake_news_vectorizer.pkl")

        if not os.path.exists(model_path):
            print("Training fake news model first...")
            from training.train_fake_news import train as train_fn
            train_fn()

        with open(model_path, 'rb') as f:
            fn_model = pickle.load(f)
        with open(vec_path, 'rb') as f:
            fn_vec = pickle.load(f)

        text_col = 'combined_text' if 'combined_text' in df_fake.columns else ('text' if 'text' in df_fake.columns else df_fake.columns[0])
        X = fn_vec.transform(df_fake[text_col].fillna(''))
        y_true = df_fake['label'].apply(lambda l: 1 if str(l).lower() in ['1', 'fake', 'true_fake'] else 0)

        y_pred = fn_model.predict(X)
        acc = accuracy_score(y_true, y_pred)
        prec, rec, f1, _ = precision_recall_fscore_support(y_true, y_pred, average='weighted', zero_division=0)
        cm = confusion_matrix(y_true, y_pred)

        fn_text = f"""
- **Dataset Source:** Kaggle Fake and Real News Dataset (`fake_news.csv`)
- **Total Dataset Size:** {len(df_fake)} records
- **Class Balance:** {y_true.value_counts().to_dict()} (0 = Real, 1 = Fake)
- **Model Architecture:** TF-IDF (5,000 max features, 1-2 ngrams) + Logistic Regression
- **Accuracy:** {acc * 100:.2f}%
- **Precision:** {prec:.4f}
- **Recall:** {rec:.4f}
- **F1-Score:** {f1:.4f}
- **Confusion Matrix:**
```
[[Real_as_Real={cm[0][0] if len(cm)>0 else 0}, Real_as_Fake={cm[0][1] if len(cm)>0 and len(cm[0])>1 else 0}],
 [Fake_as_Real={cm[1][0] if len(cm)>1 else 0}, Fake_as_Fake={cm[1][1] if len(cm)>1 and len(cm[1])>1 else 0}]]
```
"""
        report_sections.append(fn_text)
        print("Fake News Evaluation:\n", fn_text)
    else:
        report_sections.append("Fake news dataset not found.\n")

    # 2. News Category Classification Model
    report_sections.append("## 2. News Category Classification Model")
    cat_path = os.path.join(PROCESSED_DIR, "news_classification_processed.csv")
    if not os.path.exists(cat_path):
        cat_path = os.path.join(RAW_DIR, "news_classification.csv")

    if os.path.exists(cat_path):
        df_cat = pd.read_csv(cat_path)
        model_path = os.path.join(MODELS_DIR, "news_category_model.pkl")
        vec_path = os.path.join(MODELS_DIR, "news_category_vectorizer.pkl")

        if not os.path.exists(model_path):
            print("Training news classification model first...")
            from training.train_news_classifier import train as train_nc
            train_nc()

        with open(model_path, 'rb') as f:
            cat_model = pickle.load(f)
        with open(vec_path, 'rb') as f:
            cat_vec = pickle.load(f)

        text_col = 'combined_text' if 'combined_text' in df_cat.columns else ('text' if 'text' in df_cat.columns else df_cat.columns[0])
        X = cat_vec.transform(df_cat[text_col].fillna(''))
        y_true = df_cat['category']

        y_pred = cat_model.predict(X)
        acc = accuracy_score(y_true, y_pred)
        prec, rec, f1, _ = precision_recall_fscore_support(y_true, y_pred, average='weighted', zero_division=0)

        cat_text = f"""
- **Dataset Source:** Kaggle News Classification Dataset (`news_classification.csv`)
- **Total Dataset Size:** {len(df_cat)} records
- **Target Categories:** AI & Technology, Business & Finance, Science & Space, Health & Medicine, World & Politics, Climate & Environment, Entertainment & Culture
- **Accuracy:** {acc * 100:.2f}%
- **Precision:** {prec:.4f}
- **Recall:** {rec:.4f}
- **F1-Score:** {f1:.4f}
"""
        report_sections.append(cat_text)
        print("News Category Evaluation:\n", cat_text)
    else:
        report_sections.append("News classification dataset not found.\n")

    # 3. Sentiment Analysis Model
    report_sections.append("## 3. Sentiment Analysis Model")
    sent_path = os.path.join(PROCESSED_DIR, "sentiment_processed.csv")
    if not os.path.exists(sent_path):
        sent_path = os.path.join(RAW_DIR, "sentiment.csv")

    if os.path.exists(sent_path):
        df_sent = pd.read_csv(sent_path)
        model_path = os.path.join(MODELS_DIR, "sentiment_model.pkl")
        vec_path = os.path.join(MODELS_DIR, "sentiment_vectorizer.pkl")

        if not os.path.exists(model_path):
            print("Training sentiment model first...")
            from training.train_sentiment import train as train_sent
            train_sent()

        with open(model_path, 'rb') as f:
            sent_model = pickle.load(f)
        with open(vec_path, 'rb') as f:
            sent_vec = pickle.load(f)

        text_col = 'text' if 'text' in df_sent.columns else df_sent.columns[0]
        X = sent_vec.transform(df_sent[text_col].fillna(''))
        y_true = df_sent['sentiment_label'] if 'sentiment_label' in df_sent.columns else df_sent['sentiment']

        y_pred = sent_model.predict(X)
        acc = accuracy_score(y_true, y_pred)
        prec, rec, f1, _ = precision_recall_fscore_support(y_true, y_pred, average='weighted', zero_division=0)

        sent_text = f"""
- **Dataset Source:** Kaggle News Sentiment Dataset (`sentiment.csv`)
- **Total Dataset Size:** {len(df_sent)} records
- **Sentiment Labels:** Positive, Negative, Neutral
- **Accuracy:** {acc * 100:.2f}%
- **Precision:** {prec:.4f}
- **Recall:** {rec:.4f}
- **F1-Score:** {f1:.4f}
"""
        report_sections.append(sent_text)
        print("Sentiment Analysis Evaluation:\n", sent_text)
    else:
        report_sections.append("Sentiment dataset not found.\n")

    # 4. Summarization Benchmark
    report_sections.append("## 4. Article Summarization Benchmark")
    sum_path = os.path.join(PROCESSED_DIR, "summarization_processed.csv")
    if not os.path.exists(sum_path):
        sum_path = os.path.join(RAW_DIR, "summarization.csv")

    if os.path.exists(sum_path):
        from training.train_summarizer import evaluate_summarizer
        eval_df = evaluate_summarizer()
        if eval_df is not None:
            sum_text = f"""
- **Dataset Source:** Kaggle CNN / DailyMail News Summarization (`summarization.csv`)
- **Evaluated Test Pairs:** {len(eval_df)}
- **Mean Precision:** {eval_df['precision'].mean():.4f}
- **Mean Recall:** {eval_df['recall'].mean():.4f}
- **Mean F1-Score:** {eval_df['f1'].mean():.4f}
"""
            report_sections.append(sum_text)
    else:
        report_sections.append("Summarization dataset not found.\n")

    # 5. Recommendation Engine Verification
    report_sections.append("## 5. Recommendation Engine Verification")
    rec_path = os.path.join(PROCESSED_DIR, "recommendation_processed.csv")
    if not os.path.exists(rec_path):
        rec_path = os.path.join(RAW_DIR, "recommendation.csv")

    if os.path.exists(rec_path):
        df_rec = pd.read_csv(rec_path)
        rec_text = f"""
- **Dataset Source:** Kaggle User Interaction Dataset (`recommendation.csv`)
- **Total User Interactions Logged:** {len(df_rec)}
- **Unique Users:** {df_rec['user_id'].nunique() if 'user_id' in df_rec.columns else 'N/A'}
- **Interaction Types Tracked:** complete_read, like, bookmark, share, view, click
- **Algorithm Type:** Hybrid Content-Based Filtering with User Preference Weights
"""
        report_sections.append(rec_text)

    # Save to file
    report_content = "\n".join(report_sections)
    report_path = os.path.join(DOCS_DIR, "EVALUATION_REPORT.md")
    with open(report_path, 'w', encoding='utf-8') as f:
        f.write(report_content)

    print(f"\nSaved complete evaluation report to {report_path}")
    return report_content

if __name__ == "__main__":
    evaluate_all()
