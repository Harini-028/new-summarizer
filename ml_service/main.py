from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import uvicorn
import time

from ml_models import ChronicleMLModels

app = FastAPI(
    title="Chronicle AI Machine Learning Service",
    description="Dedicated FastAPI pipeline for deep NLP, fake news detection, and hybrid recommendations",
    version="1.0.0"
)

# Initialize models
ml_engine = ChronicleMLModels()

# Request/Response schemas
class TextRequest(BaseModel):
    text: str
    title: Optional[str] = ""
    url: Optional[str] = ""

class ClassifyRequest(BaseModel):
    text: str

class SentimentRequest(BaseModel):
    text: str

class FakeNewsRequest(BaseModel):
    text: str
    sourceDomain: Optional[str] = ""

class RecommendRequest(BaseModel):
    userInterests: List[str]
    readHistory: List[str]
    articles: List[Dict[str, Any]]

class TopicsRequest(BaseModel):
    texts: List[str]

class KeywordsRequest(BaseModel):
    text: str

@app.get("/health")
def health_check():
    return {
        "status": "online",
        "timestamp": time.time(),
        "models_loaded": True,
        "engine": "FastAPI + Hugging Face CPU/GPU Pipeline"
    }

@app.post("/summarize")
def summarize_endpoint(req: TextRequest):
    try:
        t0 = time.time()
        res = ml_engine.summarize(req.text)
        latency = round((time.time() - t0) * 1000, 2)
        return {
            "success": True,
            "latencyMs": latency,
            "summary": res
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/classify")
def classify_endpoint(req: ClassifyRequest):
    try:
        t0 = time.time()
        category = ml_engine.classify_category(req.text)
        latency = round((time.time() - t0) * 1000, 2)
        return {
            "success": True,
            "latencyMs": latency,
            "category": category
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/sentiment")
def sentiment_endpoint(req: SentimentRequest):
    try:
        t0 = time.time()
        sentiment_res = ml_engine.analyze_sentiment(req.text)
        latency = round((time.time() - t0) * 1000, 2)
        return {
            "success": True,
            "latencyMs": latency,
            "sentiment": sentiment_res
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/fake-news")
def fake_news_endpoint(req: FakeNewsRequest):
    try:
        t0 = time.time()
        report = ml_engine.detect_fake_news(req.text, req.sourceDomain)
        latency = round((time.time() - t0) * 1000, 2)
        return {
            "success": True,
            "latencyMs": latency,
            "report": report
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/recommend")
def recommend_endpoint(req: RecommendRequest):
    try:
        t0 = time.time()
        recommended = ml_engine.recommend_articles(req.userInterests, req.readHistory, req.articles)
        latency = round((time.time() - t0) * 1000, 2)
        return {
            "success": True,
            "latencyMs": latency,
            "articles": recommended
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/topics")
def topics_endpoint(req: TopicsRequest):
    try:
        t0 = time.time()
        clusters = ml_engine.extract_topics(req.texts)
        latency = round((time.time() - t0) * 1000, 2)
        return {
            "success": True,
            "latencyMs": latency,
            "topics": clusters
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/keywords")
def keywords_endpoint(req: KeywordsRequest):
    try:
        t0 = time.time()
        keywords = ml_engine.extract_keywords(req.text)
        latency = round((time.time() - t0) * 1000, 2)
        return {
            "success": True,
            "latencyMs": latency,
            "keywords": keywords
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class SearchRequest(BaseModel):
    query: str
    articles: List[Dict[str, Any]]

@app.post("/semantic-search")
def semantic_search_endpoint(req: SearchRequest):
    try:
        t0 = time.time()
        results = ml_engine.semantic_search(req.query, req.articles)
        latency = round((time.time() - t0) * 1000, 2)
        return {
            "success": True,
            "latencyMs": latency,
            "articles": results
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

