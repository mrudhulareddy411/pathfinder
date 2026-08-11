import pandas as pd
from pathlib import Path

# --------------------------------------------------
# PATHS
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent.parent
RAW_DIR = BASE_DIR / "data" / "raw" / "onet"
PROCESSED_DIR = BASE_DIR / "data" / "processed"

PROCESSED_DIR.mkdir(parents=True, exist_ok=True)


# --------------------------------------------------
# LOAD CSV
# --------------------------------------------------

def load_csv(filename):
    path = RAW_DIR / filename

    if not path.exists():
        print(f"❌ Missing file: {filename}")
        return None

    print(f"Loading: {filename}")

    try:
        # occupation_data.csv is comma-separated
        df = pd.read_csv(
            path,
            encoding="utf-8-sig",
            low_memory=False
        )

        print(f"   Rows: {len(df):,}")
        print(f"   Columns: {list(df.columns)}")

        return df

    except Exception as e:
        print(f"❌ Could not read {filename}: {e}")
        return None


# --------------------------------------------------
# LOAD OCCUPATIONS
# --------------------------------------------------

occupation = load_csv("occupation_data.csv")

if occupation is None:
    print("\n❌ occupation_data.csv is required.")
    raise SystemExit(1)


# --------------------------------------------------
# SHOW DATA
# --------------------------------------------------

print("\nOccupation dataset preview:")
print(occupation.head())


# --------------------------------------------------
# IDENTIFY SOFTWARE / IT CAREERS
# --------------------------------------------------

software_keywords = [
    "Software",
    "Computer",
    "Web Developer",
    "Data Scientist",
    "Database",
    "Cybersecurity",
    "Information Security",
    "Network",
    "Programmer",
    "Systems Analyst",
    "Information Technology"
]

pattern = "|".join(software_keywords)

software_careers = occupation[
    occupation["Title"]
    .astype(str)
    .str.contains(pattern, case=False, na=False)
].copy()


# --------------------------------------------------
# REMOVE DUPLICATES
# --------------------------------------------------

software_careers = software_careers.drop_duplicates(
    subset=["O*NET-SOC Code"]
)


# --------------------------------------------------
# SAVE DATASET
# --------------------------------------------------

output_file = PROCESSED_DIR / "software_careers.csv"

software_careers.to_csv(
    output_file,
    index=False,
    encoding="utf-8"
)


# --------------------------------------------------
# RESULT
# --------------------------------------------------

print("\n" + "=" * 60)
print("SUCCESS")
print("=" * 60)

print(
    f"Software/IT occupations found: "
    f"{len(software_careers)}"
)

print("\nSaved to:")
print(output_file)

print("\nCareers found:")

print(
    software_careers[
        ["O*NET-SOC Code", "Title"]
    ].to_string(index=False)
)