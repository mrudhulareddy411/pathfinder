import pandas as pd
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
RAW_DIR = BASE_DIR / "data" / "raw" / "onet"

files = [
    "abilities.csv",
    "education.csv",
    "knowledge.csv",
    "work_styles.csv",
    "skills.csv",
    "career_interest_types.csv",
    "specific_interest_areas.csv",
    "software_skills.csv"
]

for filename in files:

    path = RAW_DIR / filename

    print("\n" + "=" * 70)
    print("FILE:", filename)

    if not path.exists():
        print("❌ FILE NOT FOUND")
        continue

    try:
        df = pd.read_csv(
            path,
            encoding="utf-8-sig",
            low_memory=False
        )

        print("Rows:", len(df))
        print("Columns:")
        for column in df.columns:
            print("  -", column)

        print("\nFirst row:")
        print(df.head(1).to_string(index=False))

    except Exception as e:
        print("❌ ERROR:", e)