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
# LOAD FUNCTION
# --------------------------------------------------

def load_csv(filename):
    path = RAW_DIR / filename

    print(f"\nLoading: {filename}")

    if not path.exists():
        print(f"❌ Missing: {filename}")
        return None

    df = pd.read_csv(
        path,
        encoding="utf-8-sig",
        low_memory=False
    )

    print(f"Rows: {len(df):,}")
    print(f"Columns: {list(df.columns)}")

    return df


# --------------------------------------------------
# LOAD CAREERS
# --------------------------------------------------

careers = pd.read_csv(
    PROCESSED_DIR / "software_careers.csv",
    encoding="utf-8-sig"
)

career_codes = careers["O*NET-SOC Code"].astype(str).unique()

print("\nSoftware/IT careers:", len(career_codes))


# --------------------------------------------------
# LOAD O*NET DATA
# --------------------------------------------------

abilities = load_csv("abilities.csv")
education = load_csv("education.csv")
knowledge = load_csv("knowledge.csv")
work_styles = load_csv("work_styles.csv")
interests = load_csv("career_interest_types.csv")
specific_interests = load_csv("specific_interest_areas.csv")
software = load_csv("software_skills.csv")


# --------------------------------------------------
# FILTER TO OUR CAREERS
# --------------------------------------------------

def filter_careers(df):

    if df is None:
        return None

    df["O*NET-SOC Code"] = df["O*NET-SOC Code"].astype(str)

    return df[
        df["O*NET-SOC Code"].isin(career_codes)
    ].copy()


abilities = filter_careers(abilities)
education = filter_careers(education)
knowledge = filter_careers(knowledge)
work_styles = filter_careers(work_styles)
interests = filter_careers(interests)
specific_interests = filter_careers(specific_interests)
software = filter_careers(software)


# --------------------------------------------------
# CREATE CAREER PROFILE TABLE
# --------------------------------------------------

profiles = careers[
    [
        "O*NET-SOC Code",
        "Title",
        "Description"
    ]
].copy()


# --------------------------------------------------
# TOP SKILLS / KNOWLEDGE / ABILITIES
# --------------------------------------------------

def create_top_features(
    df,
    feature_name,
    number=10
):

    if df is None or len(df) == 0:
        return pd.DataFrame(
            columns=[
                "O*NET-SOC Code",
                feature_name
            ]
        )

    # Prefer Importance when available
    if "Scale Name" in df.columns:

        importance = df[
            df["Scale Name"]
            .astype(str)
            .str.contains(
                "Importance",
                case=False,
                na=False
            )
        ].copy()

        if len(importance) > 0:
            df = importance

    # Convert score
    df["Data Value"] = pd.to_numeric(
        df["Data Value"],
        errors="coerce"
    )

    df = df.dropna(
        subset=["Data Value"]
    )

    df = df.sort_values(
        ["O*NET-SOC Code", "Data Value"],
        ascending=[True, False]
    )

    result = (
        df.groupby("O*NET-SOC Code")
        .head(number)
        .groupby("O*NET-SOC Code")["Element Name"]
        .apply(lambda x: ", ".join(x.astype(str)))
        .reset_index()
    )

    result.columns = [
        "O*NET-SOC Code",
        feature_name
    ]

    return result


ability_features = create_top_features(
    abilities,
    "Top Abilities"
)

knowledge_features = create_top_features(
    knowledge,
    "Top Knowledge"
)

workstyle_features = create_top_features(
    work_styles,
    "Top Work Styles"
)


# --------------------------------------------------
# INTEREST PROFILE
# --------------------------------------------------

def create_interest_features(df):

    if df is None or len(df) == 0:
        return pd.DataFrame(
            columns=[
                "O*NET-SOC Code",
                "Interest Profile"
            ]
        )

    df["Data Value"] = pd.to_numeric(
        df["Data Value"],
        errors="coerce"
    )

    df = df.dropna(
        subset=["Data Value"]
    )

    df = df.sort_values(
        ["O*NET-SOC Code", "Data Value"],
        ascending=[True, False]
    )

    result = (
        df.groupby("O*NET-SOC Code")
        .head(6)
        .groupby("O*NET-SOC Code")["Element Name"]
        .apply(lambda x: ", ".join(x.astype(str)))
        .reset_index()
    )

    result.columns = [
        "O*NET-SOC Code",
        "Interest Profile"
    ]

    return result


interest_features = create_interest_features(
    interests
)


# --------------------------------------------------
# SPECIFIC INTERESTS
# --------------------------------------------------

specific_interest_features = create_top_features(
    specific_interests,
    "Specific Interest Areas"
)


# --------------------------------------------------
# SOFTWARE / TECHNOLOGY
# --------------------------------------------------

def create_technology_features(df):

    if df is None or len(df) == 0:
        return pd.DataFrame(
            columns=[
                "O*NET-SOC Code",
                "Technology Skills"
            ]
        )

    result = (
        df.groupby("O*NET-SOC Code")[
            "Workplace Example"
        ]
        .apply(
            lambda x: ", ".join(
                pd.Series(
                    x.dropna()
                    .astype(str)
                    .unique()
                ).head(15)
            )
        )
        .reset_index()
    )

    result.columns = [
        "O*NET-SOC Code",
        "Technology Skills"
    ]

    return result


technology_features = create_technology_features(
    software
)


# --------------------------------------------------
# MERGE EVERYTHING
# --------------------------------------------------

datasets = [
    ability_features,
    knowledge_features,
    workstyle_features,
    interest_features,
    specific_interest_features,
    technology_features
]

for dataset in datasets:

    profiles = profiles.merge(
        dataset,
        on="O*NET-SOC Code",
        how="left"
    )


# --------------------------------------------------
# SAVE
# --------------------------------------------------

output = PROCESSED_DIR / "career_profiles.csv"

profiles.to_csv(
    output,
    index=False,
    encoding="utf-8"
)


# --------------------------------------------------
# RESULT
# --------------------------------------------------

print("\n" + "=" * 70)
print("CAREER PROFILE DATASET CREATED")
print("=" * 70)

print("Total careers:", len(profiles))

print("\nColumns:")
print(profiles.columns.tolist())

print("\nSaved to:")
print(output)

print("\nPreview:")
print(profiles.head(10).to_string(index=False))