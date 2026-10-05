# Chronicle AI — Datasets Documentation

This directory contains raw and processed Kaggle datasets used for training and evaluating machine learning models in Chronicle AI.

---

## 1. Selected Datasets & Specification

### 1. `articles.csv`
- **Purpose:** Display news articles, news feed, search, category filtering, and summary generation.
- **Kaggle Source:** [News Category Dataset by Rishabh Misra](https://www.kaggle.com/datasets/rmisra/news-category-dataset)
- **Original Columns:** `headline`, `category`, `short_description`, `authors`, `date`, `link`
- **Required Columns:** `article_id`, `title`, `content`, `author`, `source`, `category`, `published_date`, `URL`
- **Number of Records:** 144+ records
- **License:** CC0 Public Domain
- **Preprocessing:** Mapped headline to title, short_description to content, link to URL. Cleaned whitespace and normalized categories.

### 2. `fake_news.csv`
- **Purpose:** Fake news classification model training and evaluation.
- **Kaggle Source:** [Fake and Real News Dataset](https://www.kaggle.com/datasets/clmentbisaillon/fake-and-real-news-dataset)
- **Original Columns:** `title`, `text`, `subject`, `date`
- **Required Columns:** `title`, `text`, `label`, `source`
- **Number of Records:** 10+ benchmark samples (expandable with full Kaggle download)
- **License:** CC0 Public Domain
- **Preprocessing:** Merged Fake and True CSVs. Assigned `label` (0 = REAL, 1 = FAKE). Removed URLs, HTML tags, and non-alphanumeric noise.

### 3. `news_classification.csv`
- **Purpose:** News category classification model.
- **Kaggle Source:** [BBC News Classification](https://www.kaggle.com/datasets/hgchhirang/bbc-news-classification)
- **Original Columns:** `text`, `category`
- **Required Columns:** `title`, `text`, `category`
- **Number of Records:** 10+ benchmark samples
- **License:** Educational / Open Access
- **Preprocessing:** Extracted title snippet, mapped categories to standard Chronicle categories (`AI & Technology`, `Business & Finance`, `Science & Space`, `Health & Medicine`, `World & Politics`, `Climate & Environment`, `Entertainment & Culture`).

### 4. `recommendation.csv`
- **Purpose:** Personalized news recommendation algorithm tuning and testing.
- **Kaggle Source:** [MIND News Recommendation Dataset](https://www.kaggle.com/datasets/arashnic/mind-news-dataset)
- **Original Columns:** `user_id`, `article_id`, `impression_id`, `history`
- **Required Columns:** `user_id`, `article_id`, `category`, `user_interest`, `interaction_type`, `timestamp`
- **Number of Records:** 10+ user-interaction records
- **License:** CC BY-NC-SA 4.0
- **Preprocessing:** Transformed interaction history into discrete interaction types (`complete_read`, `like`, `bookmark`, `share`, `click`, `view`).

### 5. `sentiment.csv`
- **Purpose:** News sentiment analysis model training and evaluation.
- **Kaggle Source:** [Financial Sentiment Analysis](https://www.kaggle.com/datasets/ankurzing/sentiment-analysis-for-financial-news)
- **Original Columns:** `Sentence`, `Sentiment`
- **Required Columns:** `text`, `sentiment_label`
- **Number of Records:** 10+ sentiment benchmark samples
- **License:** CC0 Public Domain
- **Preprocessing:** Mapped sentiment strings to `Positive`, `Negative`, `Neutral`. Cleaned text noise.

### 6. `summarization.csv`
- **Purpose:** Article summarization model benchmark and evaluation.
- **Kaggle Source:** [News Summary (CNN/DailyMail)](https://www.kaggle.com/datasets/sunnysai12345/news-summary)
- **Original Columns:** `ctext`, `headlines`
- **Required Columns:** `article_text`, `summary`
- **Number of Records:** 5+ reference pairs
- **License:** CC0 Public Domain
- **Preprocessing:** Cleaned article text and reference human-written summaries for ROUGE evaluation.

---

## 2. Directory Folder Structure

```
datasets/
├── raw/
│   ├── articles.csv
│   ├── fake_news.csv
│   ├── news_classification.csv
│   ├── recommendation.csv
│   ├── sentiment.csv
│   └── summarization.csv
├── processed/
│   ├── articles_clean.csv
│   ├── fake_news_clean.csv
│   ├── news_classification_clean.csv
│   ├── recommendation_clean.csv
│   ├── sentiment_clean.csv
│   ├── summarization_clean.csv
│   └── imported_mongodb_articles.json
└── README.md
```

---

## 3. Manual Kaggle Download Instructions

1. Log in to [Kaggle Datasets](https://www.kaggle.com/datasets).
2. Download the ZIP files for each dataset using the links provided above.
3. Extract the CSV files.
4. Move raw CSV files into `datasets/raw/` in your project folder.
5. Run the master data preprocessor:
   ```powershell
   py ml_service/preprocessing/data_preprocessing.py
   ```
