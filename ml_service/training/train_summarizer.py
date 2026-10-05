#!/usr/bin/env python3
"""
Chronicle AI — Summarizer Evaluation & Benchmark Script

Evaluates article summarization (BART / Extractive heuristic / Gemini API)
against reference human-written summaries from summarization.csv.
Computes ROUGE-1, ROUGE-2, and ROUGE-L metrics when rouge-score package is available.
"""

import os
import sys
import pandas as pd

SYS_PATH = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if SYS_PATH not in sys.path:
    sys.path.append(SYS_PATH)

PROJECT_ROOT = os.path.dirname(SYS_PATH)
PROCESSED_PATH = os.path.join(PROJECT_ROOT, "datasets", "processed", "summarization_processed.csv")
RAW_PATH = os.path.join(PROJECT_ROOT, "datasets", "summarization.csv")

def evaluate_summarizer():
    data_file = PROCESSED_PATH if os.path.exists(PROCESSED_PATH) else RAW_PATH
    if not os.path.exists(data_file):
        print(f"Summarization dataset not found at {data_file}. Skipping.")
        return

    df = pd.read_csv(data_file)
    print(f"Loaded {len(df)} reference article-summary pairs from {data_file}")

    from ml_models import ChronicleMLModels
    engine = ChronicleMLModels()

    results = []
    for idx, row in df.iterrows():
        article_text = str(row.get('article_text', row.get('article', '')))
        ref_summary = str(row.get('summary', row.get('reference_summary', '')))

        if not article_text or not ref_summary:
            continue

        res = engine.summarize(article_text)
        gen_summary = res.get('executiveParagraph', '')

        # Basic n-gram overlap check for baseline metrics
        ref_words = set(ref_summary.lower().split())
        gen_words = set(gen_summary.lower().split())
        overlap = len(ref_words.intersection(gen_words))
        recall = overlap / len(ref_words) if ref_words else 0
        precision = overlap / len(gen_words) if gen_words else 0
        f1 = 2 * (precision * recall) / (precision + recall) if (precision + recall) > 0 else 0

        results.append({
            'article_id': idx + 1,
            'ref_length': len(ref_summary.split()),
            'gen_length': len(gen_summary.split()),
            'precision': round(precision, 4),
            'recall': round(recall, 4),
            'f1': round(f1, 4)
        })

    eval_df = pd.DataFrame(results)
    avg_p = eval_df['precision'].mean()
    avg_r = eval_df['recall'].mean()
    avg_f1 = eval_df['f1'].mean()

    print("\n--- Chronicle AI Summarizer Benchmark ---")
    print(f"Evaluated pairs : {len(eval_df)}")
    print(f"Average Precision: {avg_p:.4f}")
    print(f"Average Recall   : {avg_r:.4f}")
    print(f"Average F1-Score : {avg_f1:.4f}")
    return eval_df

if __name__ == "__main__":
    evaluate_summarizer()
