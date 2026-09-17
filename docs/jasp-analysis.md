# Chronicle AI — JASP Statistical Analysis & Evaluation Guide

This document explains how to perform academic-grade statistical analysis and evaluation of the **Chronicle AI Platform** datasets using **JASP** (Java-based Statistical Software).

---

## 📍 Overview
JASP is an open-source statistical package designed to make statistical testing intuitive, transparent, and reproducible. The datasets exported by `scripts/export_jasp_datasets.py` to `datasets/jasp/` allow researchers and engineers to perform:
- **Descriptive Statistics & Frequencies**
- **Chi-Square ($\chi^2$) Tests for Independence**
- **Logistic & Linear Regression Modeling**
- **One-Way and Repeated Measures ANOVA**
- **Paired and Independent Samples T-Tests**
- **Pearson & Spearman Correlation Analysis**

---

## 🛠️ Step-by-Step JASP Import & Workflow

### 1. Import Data
1. Launch **JASP**.
2. Go to **File** $\rightarrow$ **Open** $\rightarrow$ **Computer**.
3. Select `chronicle-ai-main/datasets/jasp/<dataset_name>.csv`.

### 2. Verify Measurement Scales
Inspect the variable header icons in JASP:
- **Nominal** (3 colored circles): Categorical attributes like `category`, `sentiment`, `label`, `interaction`, `model_name`.
- **Ordinal** (3 ascending bars): Ranked scales (e.g. priority 1 to 5).
- **Scale** (Ruler): Continuous numerical metrics like `confidence`, `word_count`, `rouge1`, `f1_score`, `reading_time`.

---

## 📊 Analytical Use Cases

### Case 1: Misinformation & Fake News Analysis (`fake_news_jasp.csv`)
- **Research Question**: Does article authenticity correlate with word count or domain authority?
- **JASP Test**: **Binary Logistic Regression**
  - Dependent Variable: `label` (0=Real, 1=Fake)
  - Covariates: `word_count`, `confidence`
  - Output: Odds Ratios ($OR$), Wald $\chi^2$, and Nagelkerke $R^2$.

### Case 2: News Classification Performance (`news_classification_jasp.csv`)
- **Research Question**: Are prediction confidence scores uniform across all 7 news categories?
- **JASP Test**: **One-Way ANOVA**
  - Dependent Variable: `prediction_confidence`
  - Grouping Variable: `category`
  - Post-Hoc Tests: Tukey / Scheffé test to pinpoint low-confidence sectors.

### Case 3: Summarization Evaluation (`summarization_jasp.csv`)
- **Research Question**: Is there a statistically significant difference between ROUGE-1 and ROUGE-L scores?
- **JASP Test**: **Paired Samples T-Test**
  - Variable Pairs: `rouge1` vs `rougeL`
  - Report: $t$-statistic, degrees of freedom ($df$), $p$-value, and Cohen's $d$ effect size.

### Case 4: Engagement & Recommendation Analysis (`recommendation_jasp.csv`)
- **Research Question**: Does longer reading duration predict higher user interaction scores?
- **JASP Test**: **Pearson Linear Correlation**
  - Variables: `reading_time`, `interaction_score`
  - Plot: Scatter plot with regression line and 95% confidence interval band.

---

## 📜 Ethical & Methodological Notes
1. **Model Predictions vs Ground Truth**: Model-generated fields (`prediction`, `confidence`, `rouge1`) reflect algorithm outputs, not absolute empirical reality.
2. **UTF-8 Encoding**: All datasets are exported in UTF-8 to prevent character corruption.
3. **Reproducibility**: Datasets are stored in `datasets/jasp/` without altering original raw source files in `datasets/raw/`.
