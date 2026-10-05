# Chronicle AI — Kaggle Datasets Integration & ML Pipeline Guide

This document provides complete instructions for downloading Kaggle datasets, preprocessing data, training machine learning models, evaluating metrics, running the FastAPI ML service, and deploying to Render.

---

## 1. Selected Kaggle Datasets & Specification

| Dataset Purpose | Dataset Filename | Kaggle Dataset Name & URL | Original Columns | Mapped Schema Columns | Preprocessing Needed | License |
|---|---|---|---|---|---|---|
| **News Articles** | `articles.csv` | [BBC News / News Category Dataset](https://www.kaggle.com/datasets/rmisra/news-category-dataset) | `headline`, `category`, `short_description`, `authors`, `date`, `link` | `article_id`, `title`, `content`, `author`, `source`, `category`, `published_date`, `URL` | Map column names, remove nulls/duplicates, normalize categories | CC0 / Public Domain |
| **Fake News Detection** | `fake_news.csv` | [Fake and Real News Dataset](https://www.kaggle.com/datasets/clmentbisaillon/fake-and-real-news-dataset) | `title`, `text`, `subject`, `date` | `title`, `text`, `label`, `source` | Merge Fake/Real CSVs, assign `label` (0=REAL, 1=FAKE), clean HTML/URLs | CC0 / Public Domain |
| **News Classification** | `news_classification.csv` | [BBC News Classification](https://www.kaggle.com/datasets/hgchhirang/bbc-news-classification) | `text`, `category` | `title`, `text`, `category` | Extract title snippet, map category to standard 7 categories | Public / Educational |
| **Personalized Recommendations** | `recommendation.csv` | [MIND News Recommendation](https://www.kaggle.com/datasets/arashnic/mind-news-dataset) | `user_id`, `article_id`, `impression_id`, `history` | `user_id`, `article_id`, `category`, `user_interest`, `interaction_type`, `timestamp` | Extract interaction types (`complete_read`, `like`, `bookmark`), normalize scores | CC BY-NC-SA 4.0 |
| **Sentiment Analysis** | `sentiment.csv` | [Financial Sentiment Analysis](https://www.kaggle.com/datasets/ankurzing/sentiment-analysis-for-financial-news) | `Sentence`, `Sentiment` | `text`, `sentiment_label` | Map `Sentiment` to `Positive`, `Negative`, `Neutral`, strip noise | CC0 Public Domain |
| **News Summarization** | `summarization.csv` | [News Summary (CNN/DailyMail)](https://www.kaggle.com/datasets/sunnysai12345/news-summary) | `ctext`, `headlines` | `article_text`, `summary` | Clean text, remove extra whitespace, generate evaluation metrics | CC0 Public Domain |

---

## 2. Directory Folder Structure

```
chronicle-ai/
├── datasets/
│   ├── raw/
│   │   ├── articles.csv
│   │   ├── fake_news.csv
│   │   ├── news_classification.csv
│   │   ├── recommendation.csv
│   │   ├── sentiment.csv
│   │   └── summarization.csv
│   ├── processed/
│   │   ├── articles_processed.csv
│   │   ├── fake_news_processed.csv
│   │   ├── news_classification_processed.csv
│   │   ├── recommendation_processed.csv
│   │   ├── sentiment_processed.csv
│   │   └── summarization_processed.csv
│   ├── articles.csv
│   ├── fake_news.csv
│   ├── news_classification.csv
│   ├── recommendation.csv
│   ├── sentiment.csv
│   └── summarization.csv
├── ml_service/
│   ├── saved_models/
│   │   ├── fake_news_model.pkl
│   │   ├── fake_news_vectorizer.pkl
│   │   ├── news_category_model.pkl
│   │   ├── news_category_vectorizer.pkl
│   │   ├── sentiment_model.pkl
│   │   └── sentiment_vectorizer.pkl
│   ├── preprocessing/
│   │   ├── data_preprocessing.py
│   │   └── fake_news_preprocessing.py
│   ├── training/
│   │   ├── train_fake_news.py
│   │   ├── train_news_classifier.py
│   │   ├── train_sentiment.py
│   │   └── train_summarizer.py
│   ├── evaluation/
│   │   ├── evaluate_models.py
│   │   └── evaluate_fake_news.py
│   ├── recommend_articles.py
│   ├── ml_models.py
│   ├── main.py
│   └── requirements.txt
├── docs/
│   ├── EVALUATION_REPORT.md
│   └── KAGGLE_DATASETS_INTEGRATION_GUIDE.md
├── server.ts
└── src/
```

---

## 3. Step-by-Step Execution Commands (Windows PowerShell)

### Step 3.1: Install Dependencies
```powershell
py -m pip install -r ml_service/requirements.txt
```

### Step 3.2: Run Master Data Preprocessing
```powershell
py ml_service/preprocessing/data_preprocessing.py
```

### Step 3.3: Train Machine Learning Models
```powershell
# Train Fake News Model
py ml_service/training/train_fake_news.py

# Train News Category Classifier Model
py ml_service/training/train_news_classifier.py

# Train Sentiment Analysis Model
py ml_service/training/train_sentiment.py

# Evaluate Summarizer Benchmark
py ml_service/training/train_summarizer.py
```

### Step 3.4: Evaluate All Models & Generate Empirical Report
```powershell
py ml_service/evaluation/evaluate_models.py
```

### Step 3.5: Run FastAPI ML Service (Port 8000)
```powershell
py ml_service/main.py
```

### Step 3.6: Run Full-Stack Express & Vite Server (Port 3000)
```powershell
npm run dev
```

---

## 4. API Endpoints Specification

### 1. Fake News Detection
- **Path:** `POST /api/ai/fake-news-check`
- **Request Body:**
  ```json
  {
    "text": "Secret alien Underground Base Discovered under Manhattan subways",
    "sourceDomain": "viral-truth-blog.net"
  }
  ```
- **Response:**
  ```json
  {
    "isLikelyFake": true,
    "confidenceScore": 95.8,
    "verdict": "High Misinformation Risk",
    "factualityScore": 4.2,
    "biasRating": "Partisan / Sensationalized",
    "redFlags": ["Sensational vocabulary pattern detected"],
    "reasoning": "Trained TF-IDF classifier flagged text with 95.8% confidence as high misinformation risk."
  }
  ```

### 2. News Category Classification
- **Path:** `POST /classify` (FastAPI) or auto-classified in news feed
- **Request Body:** `{ "text": "MIT 128-Qubit Quantum Neural Network Milestone" }`
- **Response:** `{ "success": true, "category": "AI & Technology" }`

### 3. Sentiment Analysis
- **Path:** `POST /sentiment` (FastAPI)
- **Request Body:** `{ "text": "Clinical trial demonstrates 65% reduction in cancer recurrence." }`
- **Response:**
  ```json
  {
    "success": true,
    "sentiment": {
      "type": "Positive",
      "score": 0.94,
      "label": "Optimistic Outlook",
      "tone": "Analytical"
    }
  }
  ```

### 4. Article Summarization
- **Path:** `POST /summarize` (FastAPI)
- **Request Body:** `{ "text": "Full length news article text..." }`
- **Response:**
  ```json
  {
    "success": true,
    "summary": {
      "bullets": ["Point 1", "Point 2", "Point 3"],
      "executiveParagraph": "Executive summary paragraph...",
      "keyTakeaway": "Actionable insight..."
    }
  }
  ```

### 5. Personalized News Recommendations
- **Path:** `POST /recommend` (FastAPI)
- **Request Body:**
  ```json
  {
    "userInterests": ["AI & Technology", "Science & Space"],
    "readHistory": ["art_001"],
    "articles": [...]
  }
  ```
- **Response:** `{ "success": true, "articles": [ ... sorted by recommendationScore ... ] }`

---

## 5. Render Deployment Instructions

1. **Deploying Express Node Backend:**
   - Build Command: `npm run build`
   - Start Command: `npm start`
   - Environment Variables:
     - `GEMINI_API_KEY`: Your Google Gemini API Key
     - `MONGODB_URI`: Your MongoDB Atlas connection string
     - `JWT_SECRET`: Your JSON Web Token Secret Key
     - `FASTAPI_URL`: URL of your deployed Python FastAPI service (or fallback mode if omitted)

2. **Deploying Python FastAPI ML Service (Optional Web Service on Render):**
   - Environment: `Python 3`
   - Build Command: `pip install -r ml_service/requirements.txt`
   - Start Command: `python ml_service/main.py`
