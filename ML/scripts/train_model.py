import pandas as pd
import numpy as np
import joblib
import json
from pathlib import Path
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix

BASE_DIR = Path(__file__).resolve().parent.parent
PROCESSED_DIR = BASE_DIR / "data" / "processed"
MODELS_DIR = BASE_DIR / "models"
MODELS_DIR.mkdir(parents=True, exist_ok=True)

TRAINING_CSV = PROCESSED_DIR / "career_training.csv"
MODEL_FILE = MODELS_DIR / "career_model.pkl"
FEATURE_COLUMNS_FILE = MODELS_DIR / "feature_columns.json"

def train_model():
    print("[ML TRAINER] Starting Random Forest Model Training on O*NET Dataset...")

    if not TRAINING_CSV.exists():
        raise FileNotFoundError(f"Training dataset missing at {TRAINING_CSV}. Run build_career_training_dataset.py first.")

    df = pd.read_csv(TRAINING_CSV)
    print(f"[ML TRAINER] Total Records Loaded: {len(df)}")
    print(f"[ML TRAINER] Unique Career Classes: {df['career_title'].nunique()}")

    feature_cols = [
        "python", "java", "sql", "cpp", "dsa",
        "problem_solving", "communication", "creativity", "mathematics",
        "web_dev", "ai_data", "cybersecurity", "networking", "databases",
        "realistic", "investigative", "artistic", "social", "enterprising", "conventional"
    ]

    X = df[feature_cols]
    y = df['career_title']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

    clf = RandomForestClassifier(n_estimators=100, random_state=42, max_depth=12)
    clf.fit(X_train, y_train)

    y_pred = clf.predict(X_test)
    acc = accuracy_score(y_test, y_pred)

    print("\n--------------------------------------------------")
    print("MODEL TRAINING EVALUATION METRICS")
    print("--------------------------------------------------")
    print(f"Accuracy Score: {acc * 100:.2f}%")
    print(f"Total Training Records: {len(X_train)}")
    print(f"Total Validation Records: {len(X_test)}")
    print(f"Feature Count: {len(feature_cols)}")
    print(f"Class Count: {len(clf.classes_)}")

    print("\nTop Feature Importances:")
    importances = pd.Series(clf.feature_importances_, index=feature_cols).sort_values(ascending=False)
    for feat, imp in importances.head(10).items():
        print(f"  * {feat:<20}: {imp * 100:.2f}%")

    joblib.dump(clf, MODEL_FILE)
    with open(FEATURE_COLUMNS_FILE, "w") as f:
        json.dump(feature_cols, f, indent=2)

    print(f"\nSaved trained model to: {MODEL_FILE}")
    print(f"Saved feature column schema to: {FEATURE_COLUMNS_FILE}")
    print("--------------------------------------------------\n")

if __name__ == "__main__":
    train_model()