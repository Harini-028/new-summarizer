#!/usr/bin/env python3
"""
Chronicle AI — Article Recommendation Pipeline

Provides hybrid content-based recommendation logic using user interest categories,
reading history, saved articles, and interaction weights.
"""

import os
import sys
import pandas as pd
from typing import List, Dict, Any

SYS_PATH = os.path.dirname(os.path.abspath(__file__))
if SYS_PATH not in sys.path:
    sys.path.append(SYS_PATH)

PROJECT_ROOT = os.path.dirname(SYS_PATH)
PROCESSED_PATH = os.path.join(PROJECT_ROOT, "datasets", "processed", "recommendation_processed.csv")
RAW_PATH = os.path.join(PROJECT_ROOT, "datasets", "recommendation.csv")

def load_user_interaction_data():
    data_file = PROCESSED_PATH if os.path.exists(PROCESSED_PATH) else RAW_PATH
    if os.path.exists(data_file):
        return pd.read_csv(data_file)
    return pd.DataFrame()

def rank_articles_for_user(
    user_interests: List[str],
    read_history: List[str],
    articles: List[Dict[str, Any]],
    user_id: str = "demo_user"
) -> List[Dict[str, Any]]:
    """
    Ranks articles based on:
    1. Category alignment with user interests (Weight: +35)
    2. Novelty boost for unread articles (Demotion for read: -40)
    3. Source trust score (Weight: +0.5 per trust point above 80)
    4. Popularity (views/likes count)
    """
    df_interactions = load_user_interaction_data()
    
    # Extract user profile from interaction CSV if user_id matches
    if not df_interactions.empty and 'user_id' in df_interactions.columns:
        user_rows = df_interactions[df_interactions['user_id'] == user_id]
        if not user_rows.empty:
            historical_interests = user_rows['category'].dropna().tolist()
            user_interests = list(set(user_interests + historical_interests))

    ranked = []
    for art in articles:
        art_copy = dict(art)
        score = 50.0

        # Category match
        art_cat = art.get('category', '')
        if art_cat in user_interests:
            score += 35.0

        # Read history penalty (promote fresh content)
        art_id = str(art.get('id', art.get('article_id', '')))
        if art_id in read_history:
            score -= 40.0

        # Trust score boost
        trust = art.get('source', {}).get('trustScore', 80) if isinstance(art.get('source'), dict) else 80
        score += max(0, (trust - 80) * 0.5)

        # Engagement boost
        views = art.get('views', art.get('viewsCount', 0))
        likes = art.get('likes', art.get('likesCount', 0))
        score += min(15, (views * 0.01) + (likes * 0.05))

        art_copy['recommendationScore'] = round(max(5.0, min(99.0, score)), 1)
        ranked.append(art_copy)

    ranked.sort(key=lambda a: a['recommendationScore'], reverse=True)
    return ranked

if __name__ == "__main__":
    sample_articles = [
        {"id": "art_001", "title": "Quantum Leap in AI", "category": "AI & Technology", "views": 1200},
        {"id": "art_002", "title": "Fed Rate Decision", "category": "Business & Finance", "views": 800},
        {"id": "art_003", "title": "James Webb Discovery", "category": "Science & Space", "views": 2300}
    ]
    recs = rank_articles_for_user(["AI & Technology", "Science & Space"], ["art_001"], sample_articles)
    print("Recommendation Test Output:")
    for r in recs:
        print(f"[{r['recommendationScore']}% match] {r['title']} ({r['category']})")
