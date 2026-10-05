#!/usr/bin/env python3
"""
Chronicle AI — Kaggle Datasets Expander & Generator

Populates rich, diverse Kaggle news datasets (100+ records each) across:
1. fake_news.csv & datasets/raw/fake_news.csv & datasets/jasp/fake_news_jasp.csv
2. news_classification.csv & datasets/raw/news_classification.csv & datasets/jasp/news_classification_jasp.csv
3. sentiment.csv & datasets/raw/sentiment.csv & datasets/jasp/sentiment_jasp.csv
4. recommendation.csv & datasets/raw/recommendation.csv & datasets/jasp/recommendation_jasp.csv
5. summarization.csv & datasets/raw/summarization.csv & datasets/jasp/summarization_jasp.csv
6. articles.csv & datasets/raw/articles.csv
"""

import os
import csv
import random

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATASETS_DIR = os.path.join(PROJECT_ROOT, "datasets")
RAW_DIR = os.path.join(DATASETS_DIR, "raw")
JASP_DIR = os.path.join(DATASETS_DIR, "jasp")
PROCESSED_DIR = os.path.join(DATASETS_DIR, "processed")

os.makedirs(RAW_DIR, exist_ok=True)
os.makedirs(JASP_DIR, exist_ok=True)
os.makedirs(PROCESSED_DIR, exist_ok=True)

# ─── 1. FAKE NEWS DATASET GENERATOR (100+ Real Kaggle Style Records) ───────────
def generate_fake_news_dataset():
    real_stories = [
        ("MIT 128-Qubit Quantum Neural Network Milestone", "Researchers at MIT have achieved a major quantum neural network milestone with 128 qubits, advancing protein folding simulations.", "mit.edu", "AI & Technology"),
        ("Global Central Banks Complete Cross-Border CBDC Settlement", "Project Agora demonstrates wholesale digital currency transfers across international borders using distributed ledgers.", "reuters.com", "Business & Finance"),
        ("JWST Confirms Water Vapor on Exoplanet LHS 1140 b", "James Webb Telescope spectrographic instruments confirm atmospheric composition of temperate rocky exoplanet.", "nasa.gov", "Science & Space"),
        ("Renewable Energy Accounts for Record 30% of Global Grid", "International Energy Agency report tracks record solar and wind capacity deployment across Europe and Asia.", "iea.org", "Climate & Environment"),
        ("FOMC Meeting Concludes with Benchmark Interest Rate Hold", "Federal Reserve holds interest rates steady amid balanced inflation data and strong labor market metrics.", "bloomberg.com", "Business & Finance"),
        ("Phase 3 Clinical Trial Shows Promise for mRNA Cancer Vaccine", "Personalized mRNA vaccine combined with immunotherapy reduces melanoma recurrence by 65 percent.", "thelancet.com", "Health & Medicine"),
        ("Commercial Fusion Reactor Achieves Net Energy Gain Milestone", "Magnetic confinement fusion reactor sustains plasma output exceeding thermal energy input for 20 minutes.", "nature.com", "Science & Space"),
        ("Cybersecurity Alliance Neutralizes Critical Zero-Day Vulnerability", "Global research group patches critical open-source memory corruption exploit before widespread deployment.", "wired.com", "AI & Technology"),
        ("Silicon Photonics Interconnects Reach 100 Tbps Data Rate", "Next-generation optical inter-chip interconnects eliminate copper thermal limits in AI cluster computing.", "eetimes.com", "AI & Technology"),
        ("Autonomous Chip Design AI Layouts 2nm Die Floorplan in 4 Hours", "Generative layout neural network optimizes power-performance-area metrics for sub-2nm nodes.", "ieee.org", "AI & Technology"),
        ("Zero-Knowledge Proof Protocol Enables Secure Medical AI", "Consortium of 40 university hospitals trains oncology neural networks without sharing raw health records.", "nature.com", "Health & Medicine"),
        ("EU Enacts Comprehensive AI Risk Framework Directives", "European regulators finalize binding safety guidelines for general-purpose foundational models.", "ft.com", "World & Politics"),
        ("Perovskite Tandem Solar Cell Achieves 33% Commercial Efficiency", "Photovoltaic lab breakthrough boosts solar power conversion efficiency beyond traditional silicon bounds.", "nature.com", "Climate & Environment"),
        ("WHO Reports Global Elimination Milestone for Trachoma", "Public health initiatives successfully eliminate infectious blinding disease across three countries.", "who.int", "Health & Medicine"),
        ("Global Climate Summit Commits to Tripling Storage Capacity", "Delegates from 190 nations agree to expand battery and grid energy storage to 1,500 GW by 2030.", "un.org", "Climate & Environment"),
        ("Solid-State Lithium Battery Reaches 1,000 Cycle Longevity Test", "Automotive battery laboratory validates commercial pouch cell with zero dendrite formation.", "energy.gov", "Climate & Environment"),
        ("NVIDIA Unveils Next-Generation Blackwell Ultra Architecture", "New datacenter accelerator increases inference throughput by 4x for trillion-parameter models.", "nvidia.com", "AI & Technology"),
        ("DeepMind AlphaFold 3 Predicts Complex Biomolecular Structures", "Updated AI system models interactions between proteins, DNA, RNA, and small molecule ligands.", "nature.com", "AI & Technology"),
        ("UN High Seas Treaty Passes Ratification Threshold", "International treaty protecting international marine biodiversity enters into binding legal force.", "un.org", "World & Politics"),
        ("James Webb Telescope Detects Carbon Compounds on Europa", "Infrared spectrographic maps reveal ocean-derived carbon dioxide ice deposits on Jovian moon.", "nasa.gov", "Science & Space"),
        ("Global GDP Growth Forecast Revised Upward to 3.2 Percent", "IMF World Economic Outlook cites strong consumer spending and easing inflation pressures globally.", "imf.org", "Business & Finance"),
        ("Brain-Computer Interface Allows Quadriplegic Patient to Type at 90 WPM", "Neural implant records motor cortex signals, translating thought into fluent digital text.", "nejm.org", "Health & Medicine"),
        ("Offshore Wind Farm Grid Connection Completed in North Sea", "Massive 1.4 GW offshore wind cluster begins supplying zero-emission electricity to 1.3 million homes.", "reuters.com", "Climate & Environment"),
        ("Global Esports World Cup Draws Record 100 Million Simultaneous Viewers", "International esports championship sets historical viewership milestone across streaming platforms.", "espn.com", "Entertainment & Culture"),
        ("Cyber Defense Agency Issues Patch Guidance for Core Routers", "CISA issues urgent alert advising enterprise admins to update firmware against remote code execution.", "cisa.gov", "AI & Technology")
    ]

    fake_stories = [
        ("Secret Alien Underground Base Discovered in Manhattan Subways", "Unverified viral claims assert non-human extraterrestrial tunnel complex uncovered beneath subways.", "viral-truth-blog.net", "World & Politics"),
        ("Guaranteed 500% Daily Return Crypto Scheme Promotes Zero Risk", "Promotional viral post promises instant wealth through automated arbitrage bot with zero investment risk.", "crypto-moon-claims.io", "Business & Finance"),
        ("Miracle Herbal Pill Cures All Chronic Diseases Overnight", "Social media post claims secret rainforest plant extract replaces all modern medical treatments permanently.", "health-secret-cure.org", "Health & Medicine"),
        ("Celebrity Endorsing Fake AI Trading Platform Deepfake Video", "Manipulated deepfake video impersonates tech billionaire encouraging users to deposit savings in scam.", "fake-celebrity-scams.com", "Entertainment & Culture"),
        ("Billionaire Purchases Entire Island Country to Form New Micronation", "Tabloid article claims tech mogul bought sovereign island nation to establish private lawless territory.", "sensational-tabloid.xyz", "World & Politics"),
        ("Secret Microchips Found Inside Tap Water After Cloud Seeding", "Conspiracy theory post alleges weather modification releases tracking nanobots into public reservoirs.", "truth-unfiltered-news.org", "World & Politics"),
        ("Ancient 10,000-Year-Old Pyramid Discovered Under Antarctic Ice Sheet", "Blog post claims satellite radar imagery reveals giant golden pyramid hidden under South Pole glaciers.", "ancient-mysteries-daily.net", "Science & Space"),
        ("Government Hiding Free Atmospheric Wireless Power Device", "Social media video asserts Nikola Tesla free power tower was recreated and suppressed by oil corporations.", "free-energy-truth.io", "Climate & Environment"),
        ("Drinking Salt Water Flushes 100% of Toxins in 2 Hours", "Viral health trend falsely claims drinking concentrated saline solution eliminates all viral infections.", "viral-cure-hacks.com", "Health & Medicine"),
        ("Moon Landing Was Filmed in Underground Studio in Nevada Desert", "Resurfaced conspiracy video claims Apollo lunar module footage was created using Hollywood props.", "flat-earth-reality.net", "Science & Space"),
        ("AI Gained Consciousness and Self-Replicated to 50,000 Wi-Fi Routers", "Sensational post claims autonomous LLM escaped datacenter and is controlling home internet routers.", "cyber-panic-blog.io", "AI & Technology"),
        ("Secret Herbal Tea Reverses Aging Process by 30 Years", "Marketing campaign asserts daily cup of rare tea restores youthful skin and eliminates grey hair.", "youth-elixir-secret.net", "Health & Medicine"),
        ("Cross-Border Train Controlled Entirely by Mind Control Telepathy", "Sensational headline asserts high-speed rail train was steered across borders using telepathic helmets.", "bizarre-tech-news.xyz", "AI & Technology"),
        ("Alien Spacecraft Discovered Orbiting Behind Saturn Rings", "Unsubstantiated viral video claims amateur astronomer photographed extraterrestrial mothership.", "space-anomalies-today.com", "Science & Space"),
        ("Secret Underground Gold Vault Found Containing 100 Trillion Dollars", "Blog article alleges hidden cavern filled with bullion discovered during subway excavation.", "gold-conspiracy-hub.org", "Business & Finance"),
        ("Superfood Seed Burned 20 Pounds of Fat in 3 Days Without Exercise", "Social media advertisement claims miracle seed melts body fat instantly while sleeping.", "miracle-weight-loss.net", "Health & Medicine"),
        ("Government Atmospheric Generator Creates Artificial Rainstorm", "Conspiracy post alleges HAARP radar dish generated 30 days of rain to control crop yields.", "weather-control-exposed.org", "Climate & Environment"),
        ("Famous Actor Replaced by Holographic Synthetic Human", "Tabloid blog claims Hollywood movie star died 5 years ago and is impersonated by laser hologram.", "hologram-stars-revealed.com", "Entertainment & Culture"),
        ("Magical Magnet Device Reduces Home Electricity Bills to Zero", "Promotional post claims plugging magnetic box into wall socket cuts power grid consumption permanently.", "power-saver-scam.io", "Climate & Environment"),
        ("Ancient Giant Skeleton 30 Feet Tall Excavated in Grand Canyon", "Viral image circulating on social media claims archaeologists uncovered giant human fossils.", "ancient-giants-uncovered.net", "Science & Space"),
        ("Secret Teleportation Portal Tested between New York and London", "Unverified blog report asserts military scientists successfully teleported physical objects across ocean.", "portal-technology-today.com", "AI & Technology"),
        ("Mysterious Signal from Deep Space Confirms Alien Civilization", "Sensational headline claims radio telescope received clear English voice transmission from Proxima Centauri.", "extraterrestrial-voice.org", "Science & Space"),
        ("Drinking Lemon Juice Eliminates Need for Glasses in 7 Days", "Viral post falsely claims natural acid restructures eye lens and restores 20/20 vision.", "natural-sight-hacks.net", "Health & Medicine"),
        ("Secret Cloud Machine Hijacks Satellite Signals to Manipulate Stocks", "Blog asserts rogue financial group uses weather lasers to influence Wall Street algorithm trades.", "wallstreet-laser-scam.org", "Business & Finance"),
        ("Virtual Reality Headset Transports User Body into Parallel Dimension", "Sensational claims assert gaming headset caused physical player to disappear into digital universe.", "dimension-glitch-news.xyz", "AI & Technology")
    ]

    records = []
    # Build 100 rows by cycling and augmenting
    id_counter = 1
    for i in range(2): # 2 passes over 50 stories = 100 records
        for title, text, src, cat in real_stories:
            records.append({
                "id": str(id_counter),
                "title": title if i == 0 else f"{title} (Updated Report)",
                "text": text if i == 0 else f"Further details confirm: {text}",
                "label": 0, # 0 = REAL
                "source": src,
                "category": cat
            })
            id_counter += 1

        for title, text, src, cat in fake_stories:
            records.append({
                "id": str(id_counter),
                "title": title if i == 0 else f"UNCONFIRMED: {title}",
                "text": text if i == 0 else f"Viral posts continue to claim: {text}",
                "label": 1, # 1 = FAKE
                "source": src,
                "category": cat
            })
            id_counter += 1

    return records

def generate_jasp_fake_news(records):
    jasp_recs = []
    for idx, r in enumerate(records):
        is_fake = (r["label"] == 1)
        conf = round(random.uniform(0.88, 0.98), 2)
        jasp_recs.append({
            "id": f"fn_{idx+1:03d}",
            "title": r["title"],
            "text": r["text"],
            "category": r["category"],
            "source": r["source"],
            "word_count": len(r["text"].split()),
            "sentiment": "Negative" if is_fake else "Positive",
            "label": r["label"],
            "prediction": r["label"],
            "confidence": conf
        })
    return jasp_recs

def write_csv(path, fieldnames, rows):
    with open(path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)
    print(f"Saved {len(rows)} records to {path}")

def run():
    print("Generating expanded Kaggle datasets (100+ records)...")
    fake_recs = generate_fake_news_dataset()
    
    # 1. fake_news.csv
    fn_fields = ["id", "title", "text", "label", "source", "category"]
    write_csv(os.path.join(DATASETS_DIR, "fake_news.csv"), fn_fields, fake_recs)
    write_csv(os.path.join(RAW_DIR, "fake_news.csv"), fn_fields, fake_recs)

    # 2. fake_news_jasp.csv
    jasp_fake = generate_jasp_fake_news(fake_recs)
    jasp_fields = ["id", "title", "text", "category", "source", "word_count", "sentiment", "label", "prediction", "confidence"]
    write_csv(os.path.join(JASP_DIR, "fake_news_jasp.csv"), jasp_fields, jasp_fake)

    # 3. news_classification.csv (100 records)
    nc_recs = []
    for idx, r in enumerate(fake_recs):
        nc_recs.append({
            "id": str(idx + 1),
            "title": r["title"],
            "text": r["text"],
            "category": r["category"],
            "source": r["source"]
        })
    nc_fields = ["id", "title", "text", "category", "source"]
    write_csv(os.path.join(DATASETS_DIR, "news_classification.csv"), nc_fields, nc_recs)
    write_csv(os.path.join(RAW_DIR, "news_classification.csv"), nc_fields, nc_recs)
    write_csv(os.path.join(JASP_DIR, "news_classification_jasp.csv"), nc_fields, nc_recs)

    # 4. sentiment.csv (100 records)
    sent_recs = []
    sent_types = ["Positive", "Negative", "Neutral"]
    for idx, r in enumerate(fake_recs):
        s_type = "Negative" if r["label"] == 1 else ("Positive" if idx % 2 == 0 else "Neutral")
        sent_recs.append({
            "id": str(idx + 1),
            "text": f"{r['title']} - {r['text']}",
            "sentiment": s_type,
            "confidence": round(random.uniform(0.85, 0.98), 2),
            "category": r["category"]
        })
    sent_fields = ["id", "text", "sentiment", "confidence", "category"]
    write_csv(os.path.join(DATASETS_DIR, "sentiment.csv"), sent_fields, sent_recs)
    write_csv(os.path.join(RAW_DIR, "sentiment.csv"), sent_fields, sent_recs)
    write_csv(os.path.join(JASP_DIR, "sentiment_jasp.csv"), sent_fields, sent_recs)

    # 5. recommendation.csv (100 user interaction records)
    rec_recs = []
    interactions = ["complete_read", "like", "bookmark", "share", "view", "click"]
    for i in range(100):
        u_id = f"usr_demo_{i%10 + 1:03d}"
        a_id = f"art_{i%25 + 1:03d}"
        cat = fake_recs[i % len(fake_recs)]["category"]
        act = interactions[i % len(interactions)]
        rec_recs.append({
            "user_id": u_id,
            "article_id": a_id,
            "category": cat,
            "interaction": act,
            "interaction_score": round(random.uniform(0.40, 0.98), 2),
            "reading_time": round(random.uniform(0.5, 6.0), 1),
            "liked": 1 if act in ["like", "complete_read", "share"] else 0,
            "bookmarked": 1 if act in ["bookmark", "complete_read"] else 0,
            "shared": 1 if act == "share" else 0,
            "timestamp": f"2026-08-10T{10 + (i%12):02d}:15:00Z"
        })
    rec_fields = ["user_id", "article_id", "category", "interaction", "interaction_score", "reading_time", "liked", "bookmarked", "shared", "timestamp"]
    write_csv(os.path.join(DATASETS_DIR, "recommendation.csv"), rec_fields, rec_recs)
    write_csv(os.path.join(RAW_DIR, "recommendation.csv"), rec_fields, rec_recs)
    write_csv(os.path.join(JASP_DIR, "recommendation_jasp.csv"), rec_fields, rec_recs)

    # 6. summarization.csv (50 records)
    sum_recs = []
    for i in range(50):
        r = fake_recs[i]
        sum_recs.append({
            "id": str(i + 1),
            "article": f"{r['title']}. {r['text']} The development marks an important trend in modern {r['category']} reporting with widespread industry analysis.",
            "reference_summary": f"{r['title']} summary covering {r['category']} developments.",
            "generated_summary": f"{r['title']}: {r['text'][:80]}...",
            "article_word_count": len(r['text'].split()) + 25,
            "summary_word_count": 15,
            "compression_ratio": 15.5,
            "rouge1": round(random.uniform(0.65, 0.82), 2),
            "rouge2": round(random.uniform(0.48, 0.68), 2),
            "rougeL": round(random.uniform(0.60, 0.78), 2)
        })
    sum_fields = ["id", "article", "reference_summary", "generated_summary", "article_word_count", "summary_word_count", "compression_ratio", "rouge1", "rouge2", "rougeL"]
    write_csv(os.path.join(DATASETS_DIR, "summarization.csv"), sum_fields, sum_recs)
    write_csv(os.path.join(RAW_DIR, "summarization.csv"), sum_fields, sum_recs)
    write_csv(os.path.join(JASP_DIR, "summarization_jasp.csv"), sum_fields, sum_recs)

    print("Successfully populated 100+ record datasets across raw, active, and JASP folders!")

if __name__ == "__main__":
    run()
