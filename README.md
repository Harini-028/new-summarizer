# Chronicle AI – AI-Based Personalized News Summarizer

Chronicle AI is an enterprise-grade, full-stack AI platform for news summarization, fake news detection, news classification, sentiment analysis, and personalized news recommendations.

---

## Technical Architecture

```
                 KAGGLE DATASETS
                       │
       ┌───────────────┼────────────────┐
       ↓               ↓                ↓
   Preprocessing    Validation       Cleaning
       │
       ↓
 ┌─────────────────────────────────────────┐
 │             ML PIPELINES                │
 │                                         │
 │ Fake News Detection                     │
 │ News Classification                     │
 │ Sentiment Analysis                      │
 │ Recommendation                          │
 │ Summarization Evaluation                │
 └─────────────────────────────────────────┘
                       │
                       ↓
                  ML MODELS
                       │
                       ↓
                  Node/Express
                       │
                       ↓
                 MongoDB Atlas
                       │
          ┌────────────┴─────────────┐
          ↓                          ↓
     Admin Dashboard            User Dashboard
          │                          │
     Add Recent News            Recent News
     Edit News                  AI Summary
     Delete News                Fake News
     Publish News               Sentiment
     Dataset Management         Recommendations
     Model Performance          Categories
```

---

## Integrated Kaggle Datasets

| Dataset Filename | Kaggle Source & URL | Purpose | Machine Learning Model |
|---|---|---|---|
| `articles.csv` | [News Category Dataset](https://www.kaggle.com/datasets/rmisra/news-category-dataset) | News Feed, Search, Categorization, AI Summaries | Text Vectorizer & Database Seeding |
| `fake_news.csv` | [Fake and Real News Dataset](https://www.kaggle.com/datasets/clmentbisaillon/fake-and-real-news-dataset) | Fake News Misinformation Detection | TF-IDF + Logistic Regression / Linear SVM |
| `news_classification.csv` | [BBC News Classification](https://www.kaggle.com/datasets/hgchhirang/bbc-news-classification) | News Category Prediction | TF-IDF + Logistic Regression Classifier |
| `recommendation.csv` | [MIND News Recommendation](https://www.kaggle.com/datasets/arashnic/mind-news-dataset) | Personalized News Recommendations | Hybrid Content-Based Filtering |
| `sentiment.csv` | [Financial Sentiment Analysis](https://www.kaggle.com/datasets/ankurzing/sentiment-analysis-for-financial-news) | Article Sentiment Analysis | TF-IDF + Sentiment Classifier |
| `summarization.csv` | [News Summary (CNN/DailyMail)](https://www.kaggle.com/datasets/sunnysai12345/news-summary) | Article Summarization Benchmark | BART / Gemini API & ROUGE Evaluation |

---

## Directory Structure

```
chronicle-ai/
├── datasets/
│   ├── raw/                           <-- Raw Kaggle downloaded CSV files
│   ├── processed/                     <-- Cleaned and schema-mapped CSV files
│   └── README.md                      <-- Kaggle dataset sources & license docs
├── ml_service/
│   ├── saved_models/                  <-- Trained model pickle artifacts (.pkl)
│   ├── preprocessing/
│   │   └── data_preprocessing.py      <-- Unified dataset preprocessor
│   ├── training/
│   │   ├── train_fake_news.py
│   │   ├── train_news_classifier.py
│   │   ├── train_sentiment.py
│   │   └── train_summarizer.py
│   ├── evaluation/
│   │   └── evaluate_models.py         <-- Empirical metrics & confusion matrix generator
│   ├── recommend_articles.py
│   ├── import_datasets.py             <-- MongoDB Atlas dataset import tool
│   ├── ml_models.py                   <-- Inference engine
│   └── main.py                        <-- FastAPI ML Service
├── docs/
│   ├── EVALUATION_REPORT.md
│   └── KAGGLE_DATASETS_INTEGRATION_GUIDE.md
├── server.ts
├── package.json
└── vite.config.ts
```

---

## Local Development & Execution Steps (Windows PowerShell)

### Step 1: Install Dependencies
```powershell
# Install Node dependencies
npm install

# Install Python ML dependencies
py -m pip install -r ml_service/requirements.txt
```

### Step 2: Preprocess Datasets
```powershell
py ml_service/preprocessing/data_preprocessing.py
```

### Step 3: Train Machine Learning Models
```powershell
py ml_service/training/train_fake_news.py
py ml_service/training/train_news_classifier.py
py ml_service/training/train_sentiment.py
py ml_service/training/train_summarizer.py
```

### Step 4: Evaluate Models
```powershell
py ml_service/evaluation/evaluate_models.py
```

### Step 5: Import Datasets into MongoDB
```powershell
py ml_service/import_datasets.py
```

### Step 6: Run Applications
```powershell
# Start FastAPI ML Service (Port 8000)
py ml_service/main.py

# Start Node.js Express Backend & Vite Frontend (Port 3000)
npm run dev
```

---

## Render Deployment Guide

1. **Express Web Service on Render:**
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`
   - **Environment Variables:**
     - `GEMINI_API_KEY`: Google Gemini API Key
     - `MONGODB_URI`: MongoDB Atlas Connection String
     - `JWT_SECRET`: Secret key for JWT authentication
     - `FASTAPI_URL`: URL of your deployed Python FastAPI ML Service

2. **Python FastAPI Web Service on Render:**
   - **Environment:** Python 3
   - **Build Command:** `pip install -r ml_service/requirements.txt && python ml_service/preprocessing/data_preprocessing.py && python ml_service/training/train_fake_news.py`
   - **Start Command:** `python ml_service/main.py`
