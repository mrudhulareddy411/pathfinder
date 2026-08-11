import pandas as pd
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
PROCESSED_DIR = BASE_DIR / "data" / "processed"

# Example assessment records.
# These are ONLY for testing the pipeline.
# Later Pathfinder will collect real student responses.

data = [
    {
        "student_id": "S001",
        "python": 90,
        "java": 75,
        "sql": 85,
        "cpp": 65,
        "dsa": 90,
        "problem_solving": 92,
        "communication": 70,
        "creativity": 75,
        "realistic": 45,
        "investigative": 95,
        "artistic": 40,
        "social": 50,
        "enterprising": 55,
        "conventional": 70,
        "career": "Software Developers"
    },
    {
        "student_id": "S002",
        "python": 85,
        "java": 60,
        "sql": 95,
        "cpp": 50,
        "dsa": 85,
        "problem_solving": 90,
        "communication": 75,
        "creativity": 65,
        "realistic": 40,
        "investigative": 92,
        "artistic": 35,
        "social": 55,
        "enterprising": 45,
        "conventional": 85,
        "career": "Data Scientists"
    },
    {
        "student_id": "S003",
        "python": 70,
        "java": 65,
        "sql": 70,
        "cpp": 55,
        "dsa": 75,
        "problem_solving": 95,
        "communication": 65,
        "creativity": 60,
        "realistic": 80,
        "investigative": 90,
        "artistic": 30,
        "social": 40,
        "enterprising": 45,
        "conventional": 75,
        "career": "Information Security Analysts"
    }
]

df = pd.DataFrame(data)

output = PROCESSED_DIR / "student_training.csv"

df.to_csv(
    output,
    index=False,
    encoding="utf-8"
)

print("Student dataset created successfully!")
print("Rows:", len(df))
print("Saved to:", output)
print(df)