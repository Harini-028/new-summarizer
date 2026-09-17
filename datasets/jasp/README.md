# Chronicle AI — JASP Statistical Analysis Guide

Welcome to the **JASP Statistical Analysis Guide** for Chronicle AI. This directory contains research-grade, JASP-compatible CSV datasets formatted specifically for statistical validation, model benchmarking, hypothesis testing, and academic reporting in JASP (Java-based Statistical Software).

---

## 📂 Directory Map
```text
datasets/jasp/
├── fake_news_jasp.csv             # Misinformation detection & trust ratings
├── news_classification_jasp.csv   # Multi-class news category predictions
├── sentiment_jasp.csv             # Polarity & emotional tone scores
├── recommendation_jasp.csv        # User interaction weights & engagement
├── summarization_jasp.csv         # Compression ratios & ROUGE metrics
├── model_evaluation_jasp.csv      # Comparative performance across all 8 models
├── DATA_DICTIONARY.md             # Complete variable definitions & schemas
└── README.md                      # This import & statistical analysis guide
```

---

## 🚀 How to Import Datasets into JASP

1. **Launch JASP** on your computer.
2. Click **File** (top left corner) $\rightarrow$ **Open** $\rightarrow$ **Computer** / **Browse**.
3. Navigate to `chronicle-ai-main/datasets/jasp/` and select any `.csv` file.
4. Ensure JASP correctly assigns variable types:
   - **Nominal** (3 colored circles): Categorical columns (`category`, `sentiment`, `label`, `interaction`, `model_name`).
   - **Scale** (Ruler icon): Continuous numerical columns (`confidence`, `word_count`, `rouge1`, `f1_score`, `reading_time`).

---

## 📊 Recommended Statistical Analyses in JASP

### 1. Fake News Detection Analysis (`fake_news_jasp.csv`)
- **Frequencies & Contingency Tables**:
  - Open **Frequencies** $\rightarrow$ **Contingency Tables (Chi-Square)**.
  - Rows: `category` | Columns: `label` (0=Real, 1=Fake).
  - Test if misinformation frequency differs significantly across news categories ($\chi^2$ test).
- **Logistic Regression**:
  - Open **Regression** $\rightarrow$ **Logistic Regression**.
  - Dependent Variable: `label` | Covariates: `confidence`, `word_count`.
  - Evaluate how word count and sentiment predict article authenticity.

### 2. News Classification Analysis (`news_classification_jasp.csv`)
- **ANOVA (Analysis of Variance)**:
  - Open **ANOVA** $\rightarrow$ **One-Way ANOVA**.
  - Dependent Variable: `word_count` | Grouping Variable: `category`.
  - Test if article lengths vary significantly across news sectors.

### 3. Sentiment Analysis (`sentiment_jasp.csv`)
- **Descriptive Statistics**:
  - Open **Descriptives** $\rightarrow$ **Descriptive Statistics**.
  - Variables: `confidence` | Split by: `sentiment`.
  - Calculate Mean, Standard Deviation, and Confidence Intervals for positive vs negative stories.

### 4. Recommendation System Analysis (`recommendation_jasp.csv`)
- **Pearson / Spearman Correlation**:
  - Open **Regression** $\rightarrow$ **Correlation**.
  - Variables: `interaction_score`, `reading_time`.
  - Assess linear correlation between user reading duration and engagement scores.

### 5. Summarization Evaluation (`summarization_jasp.csv`)
- **Paired Samples T-Test / Repeated Measures**:
  - Open **T-Tests** $\rightarrow$ **Paired Samples T-Test**.
  - Pairs: `rouge1` - `rouge2`.
  - Compare unigram vs bigram overlap F1 scores for LLM summaries.

---

## ⚙️ Automated Re-Exporting via Python
To regenerate these JASP datasets directly from MongoDB or backend logs, run the export script:
```bash
python scripts/export_jasp_datasets.py
```
This script validates data types, strips invalid characters, guarantees UTF-8 formatting, and outputs cleanly structured JASP CSV files into `datasets/jasp/`.
