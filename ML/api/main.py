from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import pandas as pd
import joblib
import json
from pathlib import Path
from typing import Optional, Dict

# --------------------------------------------------
# PATHS & MODEL LOADING
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_FILE = BASE_DIR / "models" / "career_model.pkl"
FEATURE_COLUMNS_FILE = BASE_DIR / "models" / "feature_columns.json"

model = joblib.load(MODEL_FILE)

with open(FEATURE_COLUMNS_FILE, "r") as f:
    feature_cols = json.load(f)

# --------------------------------------------------
# FASTAPI APP
# --------------------------------------------------

app = FastAPI(
    title="Pathfinder Career Recommendation ML API",
    description="Machine Learning Service serving career_model.pkl trained on O*NET datasets",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------------------------------------
# INPUT ASSESSMENT MODEL
# --------------------------------------------------

class StudentAssessment(BaseModel):
    python: Optional[float] = Field(default=3.0)
    java: Optional[float] = Field(default=3.0)
    sql: Optional[float] = Field(default=3.0)
    cpp: Optional[float] = Field(default=3.0)
    dsa: Optional[float] = Field(default=3.0)
    problem_solving: Optional[float] = Field(default=3.5)
    communication: Optional[float] = Field(default=3.5)
    creativity: Optional[float] = Field(default=3.0)
    mathematics: Optional[float] = Field(default=3.0)

    web_dev: Optional[float] = Field(default=3.0)
    ai_data: Optional[float] = Field(default=3.0)
    cybersecurity: Optional[float] = Field(default=3.0)
    networking: Optional[float] = Field(default=3.0)
    databases: Optional[float] = Field(default=3.0)

    realistic: Optional[float] = Field(default=3.0)
    investigative: Optional[float] = Field(default=3.5)
    artistic: Optional[float] = Field(default=3.0)
    social: Optional[float] = Field(default=3.0)
    enterprising: Optional[float] = Field(default=3.0)
    conventional: Optional[float] = Field(default=3.0)

# --------------------------------------------------
# ENDPOINTS
# --------------------------------------------------

@app.get("/")
def home():
    return {
        "status": "success",
        "service": "Pathfinder ML Prediction Engine",
        "model": "career_model.pkl",
        "featureCount": len(feature_cols),
        "classCount": len(model.classes_),
        "port": 8000
    }

@app.get("/health")
def health():
    return {
        "status": "OK",
        "modelLoaded": True,
        "modelType": type(model).__name__,
        "classesCount": len(model.classes_),
        "featureColumns": feature_cols,
        "classes": list(model.classes_)
    }

@app.post("/predict")
def predict_career(student: StudentAssessment):
    data = student.model_dump()

    # Build DataFrame strictly according to feature_columns.json schema
    X = pd.DataFrame(
        [[data.get(feat, 3.0) for feat in feature_cols]],
        columns=feature_cols
    )

    prediction = model.predict(X)[0]
    probabilities = model.predict_proba(X)[0]

    rankings = []
    matchScores: Dict[str, float] = {}

    for career, probability in zip(model.classes_, probabilities):
        match_pct = round(float(probability * 100), 2)
        rankings.append({
            "career": career,
            "match": match_pct,
            "confidence": f"{match_pct}%"
        })
        matchScores[career] = match_pct

    rankings.sort(key=lambda x: x["match"], reverse=True)

    return {
        "success": True,
        "model": "RandomForest (career_model.pkl)",
        "recommendedCareer": prediction,
        "rankings": rankings,
        "matchScores": matchScores,
        "topMatch": rankings[0] if rankings else None,
        "explanation": f"Statistical feature vector prediction computed by Random Forest Model across {len(model.classes_)} O*NET software occupations."
    }