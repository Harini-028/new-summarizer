# Chronicle AI — JASP Data Dictionary

This document defines the schema, variables, data types, allowed values, and statistical application for all JASP-compatible datasets exported from the Chronicle AI News Intelligence Platform.

---

## 1. Fake News Dataset (`fake_news_jasp.csv`)
**Purpose**: Statistical evaluation of misinformation detection models, linguistic signals, source trust ratings, and confidence distributions.

| Column | Data Type | JASP Measurement | Description | Allowed / Expected Values |
| :--- | :--- | :--- | :--- | :--- |
| `id` | Nominal | Nominal | Unique article record identifier | String (e.g., `fn_001`) |
| `title` | Text | Text | Article headline string | Free text string |
| `text` | Text | Text | Article body or snippet | Free text string |
| `category` | Nominal | Nominal | Primary news domain category | `AI & Technology`, `Business & Finance`, `Science & Space`, `Health & Medicine`, `World & Politics`, `Climate & Environment`, `Entertainment & Culture` |
| `source` | Nominal | Nominal | Publishing domain URL | Domain name string (e.g. `mit.edu`, `reuters.com`) |
| `word_count` | Scale | Continuous Scale | Article total word count | Positive Integer ($\ge 0$) |
| `sentiment` | Nominal | Nominal | Emotional tone tag | `Positive`, `Neutral`, `Negative` |
| `label` | Nominal / Binary | Nominal (0/1) | Ground truth authenticity label | `0` = Real, `1` = Fake |
| `prediction` | Nominal / Binary | Nominal (0/1) | ML Model predicted label | `0` = Real, `1` = Fake |
| `confidence` | Scale | Continuous Scale | Model confidence probability score | Numeric range `0.00` to `1.00` |

---

## 2. News Classification Dataset (`news_classification_jasp.csv`)
**Purpose**: Evaluating multi-class categorization performance across DistilBERT and rule-based pipelines.

| Column | Data Type | JASP Measurement | Description | Allowed / Expected Values |
| :--- | :--- | :--- | :--- | :--- |
| `id` | Nominal | Nominal | Unique classification record ID | String (e.g. `nc_001`) |
| `title` | Text | Text | Article headline | Text string |
| `text` | Text | Text | Article text content | Text string |
| `category` | Nominal | Nominal | Ground truth category | Domain category strings |
| `word_count` | Scale | Continuous Scale | Article text length | Positive Integer |
| `source` | Nominal | Nominal | Publishing domain | Domain string |
| `predicted_category` | Nominal | Nominal | DistilBERT predicted category | Domain category strings |
| `prediction_confidence` | Scale | Continuous Scale | Category classification probability | Numeric range `0.00` to `1.00` |

---

## 3. Sentiment Analysis Dataset (`sentiment_jasp.csv`)
**Purpose**: Analyzing political leanings, emotional tone, and polarity across diverse news outlets.

| Column | Data Type | JASP Measurement | Description | Allowed / Expected Values |
| :--- | :--- | :--- | :--- | :--- |
| `id` | Nominal | Nominal | Sentiment entry identifier | String (e.g. `st_001`) |
| `text` | Text | Text | Evaluated text snippet | Text string |
| `sentiment` | Nominal | Nominal | RoBERTa predicted sentiment | `Positive`, `Neutral`, `Negative` |
| `confidence` | Scale | Continuous Scale | Polarity probability score | Numeric range `0.00` to `1.00` |
| `word_count` | Scale | Continuous Scale | Word count | Positive Integer |
| `category` | Nominal | Nominal | Domain category | Domain category strings |

---

## 4. Recommendation System Dataset (`recommendation_jasp.csv`)
**Purpose**: Evaluating user engagement, category preference weights, reading times, and recommendation scores.

| Column | Data Type | JASP Measurement | Description | Allowed / Expected Values |
| :--- | :--- | :--- | :--- | :--- |
| `user_id` | Nominal | Nominal | Unique user identifier | String (e.g. `usr_demo_001`) |
| `article_id` | Nominal | Nominal | Unique article identifier | String (e.g. `art_quantum_101`) |
| `category` | Nominal | Nominal | Article category | Category strings |
| `interaction` | Nominal | Nominal | Primary user action | `view`, `click`, `like`, `bookmark`, `share`, `complete_read` |
| `interaction_score` | Scale | Continuous Scale | Calculated engagement weight | Numeric range `0.00` to `1.00` |
| `reading_time` | Scale | Continuous Scale | Minutes spent reading | Positive Float ($\ge 0.0$) |
| `liked` | Binary | Nominal | User liked article | `1` = True, `0` = False |
| `bookmarked` | Binary | Nominal | User saved article | `1` = True, `0` = False |
| `shared` | Binary | Nominal | User shared article | `1` = True, `0` = False |
| `timestamp` | Date / Time | Date | ISO Timestamp | ISO 8601 Date String |

---

## 5. Summarization Dataset (`summarization_jasp.csv`)
**Purpose**: Statistical evaluation of LLM compression efficiency and ROUGE-1/2/L lexical overlap scores.

| Column | Data Type | JASP Measurement | Description | Allowed / Expected Values |
| :--- | :--- | :--- | :--- | :--- |
| `id` | Nominal | Nominal | Summary entry ID | String (e.g. `sm_001`) |
| `article` | Text | Text | Original source article text | Free text string |
| `reference_summary` | Text | Text | Human ground truth reference summary | Free text string |
| `generated_summary` | Text | Text | Gemini 2.5 Flash generated summary | Free text string |
| `article_word_count` | Scale | Continuous Scale | Full article word count | Positive Integer |
| `summary_word_count` | Scale | Continuous Scale | Executive summary word count | Positive Integer |
| `compression_ratio` | Scale | Continuous Scale | Reduction ratio percentage | Positive Float |
| `rouge1` | Scale | Continuous Scale | ROUGE-1 Unigram overlap F1 score | Numeric range `0.00` to `1.00` |
| `rouge2` | Scale | Continuous Scale | ROUGE-2 Bigram overlap F1 score | Numeric range `0.00` to `1.00` |
| `rougeL` | Scale | Continuous Scale | ROUGE-L LCS overlap F1 score | Numeric range `0.00` to `1.00` |

---

## 6. Model Evaluation Dataset (`model_evaluation_jasp.csv`)
**Purpose**: Side-by-side comparative statistical analysis of all 8 machine learning models deployed in the platform.

| Column | Data Type | JASP Measurement | Description | Allowed / Expected Values |
| :--- | :--- | :--- | :--- | :--- |
| `model_name` | Nominal | Nominal | Public model title | String |
| `algorithm` | Nominal | Nominal | Underlying ML architecture | String (e.g. `LLM Transformer`, `DistilBERT`, `XGBoost`) |
| `dataset` | Nominal | Nominal | Task domain dataset | String |
| `accuracy` | Scale | Continuous Scale | Evaluated accuracy | Range `0.00` to `1.00` |
| `precision` | Scale | Continuous Scale | Evaluated precision | Range `0.00` to `1.00` |
| `recall` | Scale | Continuous Scale | Evaluated recall | Range `0.00` to `1.00` |
| `f1_score` | Scale | Continuous Scale | Evaluated F1-Score | Range `0.00` to `1.00` |
| `training_samples` | Scale | Continuous Scale | Training split size | Positive Integer |
| `test_samples` | Scale | Continuous Scale | Test split size | Positive Integer |
