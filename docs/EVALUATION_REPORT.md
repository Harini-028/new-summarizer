# Chronicle AI — Machine Learning Models Empirical Evaluation Report

**Generated Date:** 2026-10-05 09:28:15

## 1. Fake News Detection Model

- **Dataset Source:** Kaggle Fake and Real News Dataset (`fake_news.csv`)
- **Total Dataset Size:** 100 records
- **Class Balance:** {0: 50, 1: 50} (0 = Real, 1 = Fake)
- **Model Architecture:** TF-IDF (5,000 max features, 1-2 ngrams) + Logistic Regression
- **Accuracy:** 100.00%
- **Precision:** 1.0000
- **Recall:** 1.0000
- **F1-Score:** 1.0000
- **Confusion Matrix:**
```
[[Real_as_Real=50, Real_as_Fake=0],
 [Fake_as_Real=0, Fake_as_Fake=50]]
```

## 2. News Category Classification Model

- **Dataset Source:** Kaggle News Classification Dataset (`news_classification.csv`)
- **Total Dataset Size:** 100 records
- **Target Categories:** AI & Technology, Business & Finance, Science & Space, Health & Medicine, World & Politics, Climate & Environment, Entertainment & Culture
- **Accuracy:** 91.00%
- **Precision:** 0.9361
- **Recall:** 0.9100
- **F1-Score:** 0.9085

## 3. Sentiment Analysis Model

- **Dataset Source:** Kaggle News Sentiment Dataset (`sentiment.csv`)
- **Total Dataset Size:** 100 records
- **Sentiment Labels:** Positive, Negative, Neutral
- **Accuracy:** 98.00%
- **Precision:** 0.9806
- **Recall:** 0.9800
- **F1-Score:** 0.9797

## 4. Article Summarization Benchmark

- **Dataset Source:** Kaggle CNN / DailyMail News Summarization (`summarization.csv`)
- **Evaluated Test Pairs:** 50
- **Mean Precision:** 0.3724
- **Mean Recall:** 0.5233
- **Mean F1-Score:** 0.4343

## 5. Recommendation Engine Verification

- **Dataset Source:** Kaggle User Interaction Dataset (`recommendation.csv`)
- **Total User Interactions Logged:** 100
- **Unique Users:** 10
- **Interaction Types Tracked:** complete_read, like, bookmark, share, view, click
- **Algorithm Type:** Hybrid Content-Based Filtering with User Preference Weights
