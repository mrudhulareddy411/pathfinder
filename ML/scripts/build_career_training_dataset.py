import pandas as pd
import numpy as np
from pathlib import Path
import json

# --------------------------------------------------
# PATHS
# --------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent.parent
RAW_ONET_DIR = BASE_DIR / "data" / "raw" / "onet"
PROCESSED_DIR = BASE_DIR / "data" / "processed"
PROCESSED_DIR.mkdir(parents=True, exist_ok=True)

SOFTWARE_CAREERS_CSV = PROCESSED_DIR / "software_careers.csv"
TRAINING_CSV = PROCESSED_DIR / "career_training.csv"

def build_dataset():
    print("[ONET PIPELINE] Building O*NET Career Training Dataset...")

    if not SOFTWARE_CAREERS_CSV.exists():
        raise FileNotFoundError(f"Software careers CSV not found at {SOFTWARE_CAREERS_CSV}")

    software_careers = pd.read_csv(SOFTWARE_CAREERS_CSV)
    print(f"[ONET PIPELINE] Loaded {len(software_careers)} software occupations from software_careers.csv")

    features = [
        "python", "java", "sql", "cpp", "dsa",
        "problem_solving", "communication", "creativity", "mathematics",
        "web_dev", "ai_data", "cybersecurity", "networking", "databases",
        "realistic", "investigative", "artistic", "social", "enterprising", "conventional"
    ]

    records = []

    career_profiles = {
        "Software Developers": {
            "python": (4.0, 5.0), "java": (3.5, 5.0), "sql": (3.0, 4.5), "cpp": (3.0, 4.5), "dsa": (4.0, 5.0),
            "problem_solving": (4.0, 5.0), "communication": (3.0, 4.5), "creativity": (3.5, 4.5), "mathematics": (3.0, 4.5),
            "web_dev": (3.5, 5.0), "ai_data": (2.5, 4.0), "cybersecurity": (2.0, 3.5), "networking": (2.0, 3.5), "databases": (3.0, 4.5),
            "realistic": (3.0, 4.0), "investigative": (4.0, 5.0), "artistic": (2.5, 4.0), "social": (2.5, 3.5), "enterprising": (3.0, 4.0), "conventional": (3.0, 4.0)
        },
        "Data Scientists": {
            "python": (4.5, 5.0), "java": (2.0, 3.5), "sql": (4.0, 5.0), "cpp": (2.0, 3.5), "dsa": (3.5, 4.5),
            "problem_solving": (4.5, 5.0), "communication": (3.5, 4.5), "creativity": (3.5, 4.5), "mathematics": (4.5, 5.0),
            "web_dev": (2.0, 3.5), "ai_data": (4.5, 5.0), "cybersecurity": (1.5, 3.0), "networking": (1.5, 3.0), "databases": (4.0, 5.0),
            "realistic": (2.5, 3.5), "investigative": (4.5, 5.0), "artistic": (2.5, 3.5), "social": (2.5, 3.5), "enterprising": (3.0, 4.0), "conventional": (3.5, 4.5)
        },
        "Information Security Analysts": {
            "python": (3.5, 4.5), "java": (2.5, 4.0), "sql": (3.0, 4.5), "cpp": (2.5, 4.0), "dsa": (3.0, 4.0),
            "problem_solving": (4.5, 5.0), "communication": (3.5, 4.5), "creativity": (2.5, 3.5), "mathematics": (3.0, 4.0),
            "web_dev": (2.5, 4.0), "ai_data": (2.0, 3.5), "cybersecurity": (4.5, 5.0), "networking": (4.0, 5.0), "databases": (3.0, 4.5),
            "realistic": (3.5, 4.5), "investigative": (4.5, 5.0), "artistic": (1.5, 3.0), "social": (2.5, 3.5), "enterprising": (3.0, 4.0), "conventional": (4.0, 5.0)
        },
        "Web Developers": {
            "python": (3.0, 4.5), "java": (2.5, 4.0), "sql": (3.0, 4.5), "cpp": (1.5, 3.0), "dsa": (3.0, 4.0),
            "problem_solving": (3.5, 4.5), "communication": (3.5, 4.5), "creativity": (4.0, 5.0), "mathematics": (2.5, 3.5),
            "web_dev": (4.5, 5.0), "ai_data": (2.0, 3.5), "cybersecurity": (2.0, 3.5), "networking": (2.5, 4.0), "databases": (3.5, 4.5),
            "realistic": (2.5, 3.5), "investigative": (3.5, 4.5), "artistic": (4.0, 5.0), "social": (3.0, 4.0), "enterprising": (3.0, 4.0), "conventional": (3.0, 4.0)
        },
        "Database Administrators": {
            "python": (3.0, 4.0), "java": (2.0, 3.5), "sql": (4.5, 5.0), "cpp": (1.5, 3.0), "dsa": (3.0, 4.0),
            "problem_solving": (4.0, 5.0), "communication": (3.0, 4.0), "creativity": (2.0, 3.0), "mathematics": (3.0, 4.0),
            "web_dev": (2.0, 3.5), "ai_data": (3.0, 4.5), "cybersecurity": (3.0, 4.5), "networking": (3.0, 4.0), "databases": (4.5, 5.0),
            "realistic": (3.0, 4.0), "investigative": (4.0, 5.0), "artistic": (1.5, 2.5), "social": (2.5, 3.5), "enterprising": (3.0, 4.0), "conventional": (4.5, 5.0)
        },
        "Computer Network Architects": {
            "python": (3.0, 4.0), "java": (2.5, 3.5), "sql": (2.5, 3.5), "cpp": (2.5, 4.0), "dsa": (3.5, 4.5),
            "problem_solving": (4.5, 5.0), "communication": (4.0, 5.0), "creativity": (3.0, 4.0), "mathematics": (3.5, 4.5),
            "web_dev": (2.0, 3.5), "ai_data": (2.0, 3.5), "cybersecurity": (4.0, 5.0), "networking": (4.5, 5.0), "databases": (3.0, 4.0),
            "realistic": (4.0, 5.0), "investigative": (4.5, 5.0), "artistic": (2.0, 3.0), "social": (3.0, 4.0), "enterprising": (4.0, 5.0), "conventional": (4.0, 5.0)
        },
        "Computer Systems Analysts": {
            "python": (3.0, 4.0), "java": (3.0, 4.0), "sql": (3.5, 4.5), "cpp": (2.0, 3.5), "dsa": (3.0, 4.0),
            "problem_solving": (4.5, 5.0), "communication": (4.5, 5.0), "creativity": (3.0, 4.0), "mathematics": (3.0, 4.0),
            "web_dev": (3.0, 4.0), "ai_data": (3.0, 4.0), "cybersecurity": (3.0, 4.0), "networking": (3.0, 4.0), "databases": (3.5, 4.5),
            "realistic": (3.0, 4.0), "investigative": (4.5, 5.0), "artistic": (2.0, 3.0), "social": (3.5, 4.5), "enterprising": (4.0, 5.0), "conventional": (4.0, 5.0)
        }
    }

    np.random.seed(42)

    for idx, row in software_careers.iterrows():
        code = row['O*NET-SOC Code']
        title = row['Title']

        profile = None
        for p_name, p_vals in career_profiles.items():
            if p_name.lower() in title.lower() or title.lower() in p_name.lower():
                profile = p_vals
                break
        
        if not profile:
          profile = career_profiles["Software Developers"]

        for _ in range(50):
            row_data = {"onet_code": code, "career_title": title}
            for feat in features:
                min_v, max_v = profile.get(feat, (2.0, 4.0))
                val = np.round(np.random.uniform(min_v, max_v), 1)
                row_data[feat] = val

            records.append(row_data)

    df_train = pd.DataFrame(records)
    df_train.to_csv(TRAINING_CSV, index=False)
    print(f"[ONET PIPELINE] Generated {len(df_train)} training records across {df_train['career_title'].nunique()} O*NET software occupations.")
    print(f"[ONET PIPELINE] Saved training dataset to: {TRAINING_CSV}")

if __name__ == "__main__":
    build_dataset()
