import pandas as pd
import numpy as np
import psycopg2
from psycopg2.extras import execute_values
from compatibility_algo import preprocess_user_dataframe, get_top_compatible_matches

def fetch_users_from_db(conn):
    query = """
    SELECT u.*, p.cleanliness, p.noise_tolerance, p.guests_frequency, p.partying, p.bed_time, p.wake_up_time,
           p.smoking, p.drinking, p.marijuana, p.cooking, p.food_preferences, p.introversion, p.openness,
           p.conscientiousness, p.agreeableness, p.neuroticism, p.preferred_genders, p.age_pref_min, p.age_pref_max,
           p.lgbtq_friendly, p.work_schedule, p.home_frequency
    FROM users u
    LEFT JOIN user_preferences p ON u.id = p.user_id
    WHERE u.is_active = true
    """
    df = pd.read_sql(query, conn)

    # Add missing columns with default values if not present
    expected_cols = ['requested_amenities']
    for col in expected_cols:
        if col not in df.columns:
            df[col] = 0

    return df

def store_compatibility_scores(conn, user_id, matches_df):
    # Prepare data for bulk insert/update
    records = []
    for _, row in matches_df.iterrows():
        # Use 'id' column instead of 'user_id'
        match_user_id = row.get('id')
        if match_user_id is None:
            # Skip rows with missing id to avoid DB errors
            continue
        score = row['compatibility_score']
        records.append((user_id, match_user_id, score))

    if not records:
        print(f"No compatibility scores to insert for user {user_id}")
        print(f"Matches DataFrame for user {user_id}:\n{matches_df}")
        return

    with conn.cursor() as cur:
        # Create table if not exists
        cur.execute("""
            CREATE TABLE IF NOT EXISTS user_compatibility_scores (
                user_id UUID NOT NULL,
                match_user_id UUID NOT NULL,
                compatibility_score FLOAT NOT NULL,
                PRIMARY KEY (user_id, match_user_id),
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (match_user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        """)
        # Upsert compatibility scores
        sql = """
            INSERT INTO user_compatibility_scores (user_id, match_user_id, compatibility_score)
            VALUES %s
            ON CONFLICT (user_id, match_user_id) DO UPDATE
            SET compatibility_score = EXCLUDED.compatibility_score
        """
        execute_values(cur, sql, records)
    conn.commit()

def main():
    # Connect to your PostgreSQL database
    conn = psycopg2.connect(
        dbname="applications",
        user="postgres",
        password="kireeti-19/08/2005",
        host="localhost",
        port=5432
    )

    print("Fetching users from database...")
    df_users = fetch_users_from_db(conn)
    print(f"Fetched {len(df_users)} users")

    print("Preprocessing user data...")
    df_encoded = preprocess_user_dataframe(df_users)

    print("Precomputing compatibility scores for each user...")
    for idx, user_row in df_users.iterrows():
        # Use 'id' column instead of 'user_id' as fetched from DB
        user_id = user_row.get('id')
        print(f"Processing user {user_id} ({idx+1}/{len(df_users)})")
        top_matches = get_top_compatible_matches(idx, df_users, df_encoded, top_n=15, debug=False)
        store_compatibility_scores(conn, user_id, top_matches)

    print("Precomputation complete.")
    conn.close()

if __name__ == "__main__":
    main()
