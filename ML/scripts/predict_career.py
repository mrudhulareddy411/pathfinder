import pandas as pd
import joblib
import json
from pathlib import Path
import sys

BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_FILE = BASE_DIR / "models" / "career_model.pkl"
FEATURE_COLUMNS_FILE = BASE_DIR / "models" / "feature_columns.json"

def predict(sample_vector=None):
    if not MODEL_FILE.exists():
        print(f"[ML INFERENCE] Model file missing at {MODEL_FILE}")
        return

    model = joblib.load(MODEL_FILE)
    
    with open(FEATURE_COLUMNS_FILE, "r") as f:
        feature_cols = json.load(f)

    if sample_vector is None:
        sample_vector = {
            "python": 4.5, "java": 2.0, "sql": 4.5, "cpp": 2.0, "dsa": 4.0,
            "problem_solving": 4.5, "communication": 4.0, "creativity": 3.5, "mathematics": 4.5,
            "web_dev": 2.0, "ai_data": 4.8, "cybersecurity": 1.5, "networking": 1.5, "databases": 4.5,
            "realistic": 2.5, "investigative": 4.8, "artistic": 2.0, "social": 3.0, "enterprising": 3.5, "conventional": 4.0
        }

    X = pd.DataFrame([[sample_vector.get(f, 3.0) for f in feature_cols]], columns=feature_cols)

    pred = model.predict(X)[0]
    probs = model.predict_proba(X)[0]

    print("\n--------------------------------------------------")
    print("CAREER PREDICTION INFERENCE RESULT")
    print("--------------------------------------------------")
    print(f"Recommended Career: {pred}")
    print("\nTop Match Probabilities:")

    rankings = []
    for career, prob in zip(model.classes_, probs):
        rankings.append({"career": career, "match": round(float(prob * 100), 2)})

    rankings.sort(key=lambda x: x["match"], reverse=True)

    for idx, r in enumerate(rankings[:5], 1):
        print(f"  {idx}. {r['career']:<35} : {r['match']}% Match")
    print("--------------------------------------------------\n")

if __name__ == "__main__":
    predict()