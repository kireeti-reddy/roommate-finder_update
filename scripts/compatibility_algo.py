from faker import Faker
import random
import pandas as pd
import time
import numpy as np
import uuid
from sklearn.preprocessing import LabelEncoder
from datetime import datetime

def generate_synthetic_users(num_samples=500):
    current_time = int(time.time())
    random.seed(current_time)
    fake = Faker()
    fake.seed_instance(current_time + 1)

    def random_rating(): return random.randint(1, 5)
    def random_choice(options): return random.choice(options)

    data = []
    for _ in range(num_samples):
        profile = {
                  "cleanliness": random_rating(),
                  "noise_tolerance": random_rating(),
                  "guests_frequency": random_choice(["Low", "Medium", "High"]),
                  "partying": random_choice(["Low", "Medium", "High"]),
                  "bed_time": fake.time(pattern="%H:%M"),
                  "wake_up_time": fake.time(pattern="%H:%M"),
                  "smoking": random_choice(["Yes", "No"]),
                  "drinking": random_choice(["Never", "Socially", "Often"]),
                  "marijuana": random_choice(["Never", "Sometimes", "Often"]),
                  "cooking": random_choice(["Rarely", "Sometimes", "Often"]),
                  "food_preferences": random_choice(["Vegetarian", "Non-Vegetarian", "Vegan"]),
                  "introversion": round(random.uniform(0, 1), 2),
                  "openness": round(random.uniform(0, 1), 2),
                  "conscientiousness": round(random.uniform(0, 1), 2),
                  "agreeableness": round(random.uniform(0, 1), 2),
                  "neuroticism": round(random.uniform(0, 1), 2),
                  "preferred_genders": random_choice(["Any", "Male", "Female", "Other"]),
                  "age_range": random.randint(18, 35),
                  "lgbtq_friendly": random_choice(["Yes", "No"]),
                  "requested_amenities": random_choice(["WiFi", "Parking", "Laundry", "Gym", "None"]),
                  "work_schedule": random_choice(["Night Shift", "Day Shift", "Flexible"]),
                  "home_frequency": random_choice(["Low", "Medium", "High"]),
                  "gender": random_choice(["Male", "Female", "Other"]),
                  "cluster": None
              }

        data.append(profile)

    df = pd.DataFrame(data)

    def time_str_to_float(time_str):
        hour, minute = map(int, time_str.split(':'))
        return hour + minute / 60.0

    df['bed_time'] = df['bed_time'].apply(time_str_to_float)
    df['wake_up_time'] = df['wake_up_time'].apply(time_str_to_float)

    df['name'] = [fake.first_name() + " " + fake.last_name() for _ in range(num_samples)]
    df['age'] = [np.random.randint(18, 45) for _ in range(num_samples)]

    df['age_pref_min'] = df['age_range'] - 3
    df['age_pref_max'] = df['age_range'] + 3
    df['age_pref_min'] = df['age_pref_min'].clip(lower=18)
    df['age_pref_max'] = df['age_pref_max'].clip(upper=45)
    df.drop(columns=['age_range'], inplace=True)

    df["user_id"] = [str(uuid.uuid4()) for _ in range(len(df))]
    cols = ['user_id'] + [col for col in df.columns if col != 'user_id']
    df = df[cols]

    return df

'''def encode_dataframe(df):
    df_encoded = df.copy()

    df_encoded["bed_time"] = pd.to_datetime(df_encoded["bed_time"], format="%H:%M")
    df_encoded["wake_up_time"] = pd.to_datetime(df_encoded["wake_up_time"], format="%H:%M")

    def time_to_minutes(time_value):
        return time_value.hour * 60 + time_value.minute

    df_encoded["bed_time"] = df_encoded["bed_time"].apply(time_to_minutes)
    df_encoded["wake_up_time"] = df_encoded["wake_up_time"].apply(time_to_minutes)

    label_columns = ["guests_frequency", "partying", "smoking", "drinking", "marijuana",
                     "cooking", "food_preferences", "preferred_genders",
                     "lgbtq_friendly", "requested_amenities", "work_schedule", "home_frequency"]

    for col in label_columns:
        le = LabelEncoder()
        df_encoded[col] = le.fit_transform(df_encoded[col])

    return df_encoded'''

from sklearn.preprocessing import MinMaxScaler

def preprocess_user_dataframe(df):
    df_processed = df.copy()



    def time_str_to_float_safe(time_val):
        if isinstance(time_val, str):
            try:
                hour, minute = map(int, time_val.split(':'))
                return hour + minute / 60.0
            except:
                return np.nan  # or keep as-is, based on how you want to handle invalids
        return time_val

    # Safely convert time strings to float hours
    df_processed['bed_time'] = df_processed['bed_time'].apply(time_str_to_float_safe)
    df_processed['wake_up_time'] = df_processed['wake_up_time'].apply(time_str_to_float_safe)

    # Define categorical and numeric features
    categorical_cols = ['gender', 'preferred_genders', 'work_schedule']
    boolean_cols = ['smoking', 'drinking', 'marijuana', 'lgbtq_friendly']
    list_cols = ['requested_amenities']  # assuming list encoded as counts
    numeric_cols = [
        'cleanliness', 'noise_tolerance', 'guests_frequency', 'partying',
        'bed_time', 'wake_up_time', 'cooking', 'food_preferences',
        'introversion', 'openness', 'conscientiousness', 'agreeableness', 'neuroticism',
        'age_pref_min', 'age_pref_max', 'home_frequency'
    ]


    label_columns = ["guests_frequency", "partying", "smoking", "drinking", "marijuana",
                     "cooking", "food_preferences", "preferred_genders",
                     "lgbtq_friendly", "requested_amenities", "work_schedule", "home_frequency"]

    for col in label_columns:
        le = LabelEncoder()
        df_processed[col] = le.fit_transform(df_processed[col])

    # Encode categoricals using LabelEncoder
    for col in categorical_cols:
        if col in df_processed.columns:
            df_processed[col] = LabelEncoder().fit_transform(df_processed[col].astype(str))

    # Convert booleans to 0/1
    for col in boolean_cols:
        if col in df_processed.columns:
            df_processed[col] = df_processed[col].astype(int)

    # Count elements in list columns (like requested amenities)
    for col in list_cols:
        if col in df_processed.columns:
            df_processed[col] = df_processed[col].apply(lambda x: len(x) if isinstance(x, list) else 0)

    # Normalize numeric values
    scaler = MinMaxScaler()
    norm_cols = numeric_cols + list_cols
    # DO NOT SCALE THESE COLUMNS
    columns_to_exclude_from_scaling = ['age', 'age_pref_min', 'age_pref_max']

    # Updated list of columns to scale
    cols_to_scale = [col for col in norm_cols if col in df_processed.columns and col not in columns_to_exclude_from_scaling]
    if cols_to_scale:
        df_processed[cols_to_scale] = scaler.fit_transform(df_processed[cols_to_scale])
    if cols_to_scale:
        df_processed[cols_to_scale] = scaler.fit_transform(df_processed[cols_to_scale])

    return df_processed


# Usage example
df_synthetic_users = generate_synthetic_users()
df_encoded = preprocess_user_dataframe(df_synthetic_users)


import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

def calculate_compatibility(user1, user2, debug=False):
    import math
    name1 = user1.get("name", "User1") if isinstance(user1, dict) else user1.get("name", "User1")
    name2 = user2.get("name", "User2") if isinstance(user2, dict) else user2.get("name", "User2")

    drop_cols = ['user_id', 'name', 'age', 'gender', 'cluster']

    if isinstance(user1, pd.Series):
        user1_data = user1.copy()
        for col in drop_cols:
            if col in user1_data.index:
                user1_data = user1_data.drop(col)
    else:
        user1_data = {k: v for k, v in user1.items() if k not in drop_cols}

    if isinstance(user2, pd.Series):
        user2_data = user2.copy()
        for col in drop_cols:
            if col in user2_data.index:
                user2_data = user2_data.drop(col)
    else:
        user2_data = {k: v for k, v in user2.items() if k not in drop_cols}

    weights = {
        "cleanliness": 0.05, "noise_tolerance": 0.05, "guests_frequency": 0.04,
        "partying": 0.03, "bed_time": 0.015, "wake_up_time": 0.015,
        "smoking": 0.06, "drinking": 0.05, "marijuana": 0.03,
        "cooking": 0.03, "food_preferences": 0.03,
        "introversion": 0.04, "openness": 0.04, "conscientiousness": 0.04,
        "agreeableness": 0.05, "neuroticism": 0.03,
        "preferred_genders": 0.05, "age_pref_min": 0.025, "age_pref_max": 0.025,
        "lgbtq_friendly": 0.05, "requested_amenities": 0.05,
        "work_schedule": 0.12, "home_frequency": 0.08
    }

    feature_ranges = {
        "smoking": 1, "drinking": 1, "marijuana": 1, "lgbtq_friendly": 1,
        "preferred_genders": 3, "requested_amenities": 5,
        "cleanliness": 5, "noise_tolerance": 5, "guests_frequency": 5,
        "partying": 5, "cooking": 5, "food_preferences": 5,
        "introversion": 2, "openness": 2, "conscientiousness": 2,
        "agreeableness": 2, "neuroticism": 2,
        "bed_time": 24 * 60, "wake_up_time": 24 * 60,
        "work_schedule": 3, "home_frequency": 7,
        "age_pref_min": 3, "age_pref_max": 3,
    }

    if isinstance(user1_data, pd.Series):
        common_features = set(user1_data.index).intersection(set(user2_data.index))
    else:
        common_features = set(user1_data.keys()).intersection(set(user2_data.keys()))

    total_score = 0
    total_weight = 0
    contributions = {}

    user1_age = user1.get("age", None) if isinstance(user1, dict) else user1.get("age", None)
    user2_age = user2.get("age", None) if isinstance(user2, dict) else user2.get("age", None)
    user1_gender = user1.get("gender", None) if isinstance(user1, dict) else user1.get("gender", None)
    user2_gender = user2.get("gender", None) if isinstance(user2, dict) else user2.get("gender", None)

    age_acceptance = 1.0
    age_weight = weights.get("age_pref_min", 0) + weights.get("age_pref_max", 0)

    if all(x is not None for x in [user1_age, user2_age]):
        if "age_pref_min" in common_features and "age_pref_max" in common_features:
            if isinstance(user1_data, pd.Series):
                user1_min_age = user1_age - user1_data["age_pref_min"]
                user1_max_age = user1_age + user1_data["age_pref_max"]
            else:
                user1_min_age = user1_age - user1_data["age_pref_min"]
                user1_max_age = user1_age + user1_data["age_pref_max"]

            user1_accepts_user2_age = user1_min_age <= user2_age <= user1_max_age

            if not user1_accepts_user2_age:
                age_acceptance = 0.0

    contributions["age_preferences"] = age_acceptance * age_weight
    total_score += contributions["age_preferences"]
    total_weight += age_weight

    gender_acceptance = 1.0
    gender_weight = weights.get("preferred_genders", 0)

    if "preferred_genders" in common_features and all(x is not None for x in [user1_gender, user2_gender]):
        if isinstance(user1_data, pd.Series):
            user1_accepts_user2_gender = user1_data["preferred_genders"] == 0 or user1_data["preferred_genders"] == user2_gender
        else:
            user1_accepts_user2_gender = user1_data["preferred_genders"] == 0 or user1_data["preferred_genders"] == user2_gender

        if not user1_accepts_user2_gender:
            gender_acceptance = 0.0

    contributions["gender_preferences"] = gender_acceptance * gender_weight
    total_score += contributions["gender_preferences"]
    total_weight += gender_weight

    lifestyle_factors = ["smoking", "drinking", "marijuana"]
    for factor in lifestyle_factors:
        if factor in common_features:
            weight = weights.get(factor, 0)

            if isinstance(user1_data, pd.Series):
                val1 = user1_data[factor]
                val2 = user2_data[factor]
            else:
                val1 = user1_data[factor]
                val2 = user2_data[factor]

            # Defensive check for NaN or None
            if val1 is None or val2 is None or (isinstance(val1, float) and math.isnan(val1)) or (isinstance(val2, float) and math.isnan(val2)):
                similarity = 0.5  # Neutral similarity if data missing
            else:
                if val1 == val2:
                    similarity = 1.0
                elif val1 == 0 and val2 > 0:
                    similarity = 0.0
                elif val1 > 0 and val2 == 0:
                    similarity = 0.4
                elif abs(val1 - val2) == 1:
                    similarity = 0.7
                else:
                    similarity = 0.5

            contributions[factor] = similarity * weight
            total_score += contributions[factor]
            total_weight += weight

    if "lgbtq_friendly" in common_features:
        weight = weights.get("lgbtq_friendly", 0)

        if isinstance(user1_data, pd.Series):
            val1 = user1_data["lgbtq_friendly"]
            val2 = user2_data["lgbtq_friendly"]
        else:
            val1 = user1_data["lgbtq_friendly"]
            val2 = user2_data["lgbtq_friendly"]

        if val1 is None or val2 is None or (isinstance(val1, float) and math.isnan(val1)) or (isinstance(val2, float) and math.isnan(val2)):
            similarity = 0.5
        else:
            if val1 == 1 and val2 == 0:
                similarity = 0.0
            else:
                similarity = 1.0

        contributions["lgbtq_friendly"] = similarity * weight
        total_score += contributions["lgbtq_friendly"]
        total_weight += weight

    for feature in common_features:
        if feature in ["age_pref_min", "age_pref_max", "preferred_genders", "lgbtq_friendly"] + lifestyle_factors:
            continue

        if feature not in weights:
            continue

        weight = weights[feature]

        if isinstance(user1_data, pd.Series):
            val1 = user1_data[feature]
            val2 = user2_data[feature]
        else:
            val1 = user1_data[feature]
            val2 = user2_data[feature]

        if val1 is None or val2 is None or (isinstance(val1, float) and math.isnan(val1)) or (isinstance(val2, float) and math.isnan(val2)):
            similarity = 0.5
        else:
            feature_range = feature_ranges.get(feature, 1)

            if feature in ["bed_time", "wake_up_time"]:
                diff = min(abs(val1 - val2), feature_range - abs(val1 - val2))
                similarity = 1.0 - min(diff / feature_range, 1.0)
            elif feature == "requested_amenities":
                shared = min(val1, val2)
                total = max(val1, val2)
                similarity = shared / total if total > 0 else 1.0
            elif feature == "noise_tolerance":
                if val1 < val2:
                    diff = abs(val1 - val2)
                    similarity = 1.0 - min(diff * 1.2 / feature_range, 1.0)
                else:
                    diff = abs(val1 - val2)
                    similarity = 1.0 - min(diff * 0.8 / feature_range, 1.0)
            elif feature == "cleanliness":
                if val1 > val2:
                    diff = abs(val1 - val2)
                    similarity = 1.0 - min(diff * 1.2 / feature_range, 1.0)
                else:
                    diff = abs(val1 - val2)
                    similarity = 1.0 - min(diff * 0.8 / feature_range, 1.0)
            elif feature == "work_schedule":
                if (val1 == 1 and val2 == 3) or (val1 == 3 and val2 == 1):
                    similarity = 0.2
                else:
                    diff = abs(val1 - val2)
                    similarity = 1.0 - min(diff / feature_range, 1.0)
            else:
                diff = abs(val1 - val2)
                similarity = 1.0 - min(diff / feature_range, 1.0)

        contributions[feature] = similarity * weight
        total_score += contributions[feature]
        total_weight += weight

    adjusted_score = total_score / total_weight if total_weight > 0 else 0
    final_score = max(0, min(adjusted_score, 1)) * 100

    print(f"Compatibility from {name1} to {name2}: {final_score:.2f}%")

    if debug:
        print(f"\n✅ Detailed Compatibility Analysis from {name1}'s perspective:")
        print("\nFeature Contributions:")
        sorted_contributions = sorted(contributions.items(), key=lambda x: x[1], reverse=True)
        for feature, contrib in sorted_contributions:
            print(f" - {feature}: {contrib:.4f} (weight: {weights.get(feature, 0):.4f})")
        print(f"\n🎯 Final Compatibility Score: {final_score:.2f}%")

    return final_score


def cluster_users(df_original, df_encoded, num_clusters=5):
    features_for_clustering = df_encoded.drop(columns=['user_id', 'name', 'age'], errors='ignore')
    kmeans = KMeans(n_clusters=num_clusters, random_state=42, n_init=10)
    cluster_labels = kmeans.fit_predict(features_for_clustering)
    df_original["cluster"] = cluster_labels
    df_encoded["cluster"] = cluster_labels
    return df_original, df_encoded

def find_top_matches(user_index, df_original, df_encoded, top_n=5, debug=False):
    """
    Find top potential matches using cosine similarity of encoded features.
    This provides an initial filtering of potential matches before detailed compatibility calculation.
    """
    df_numeric = df_encoded.select_dtypes(include=[np.number])

    # Compute cosine similarity
    similarity_matrix = cosine_similarity(df_numeric)

    # Get similarity scores for the target user
    user_similarities = similarity_matrix[user_index]

    # Get top N most similar users (excluding self)
    top_matches = np.argsort(user_similarities)[::-1]
    top_matches = [idx for idx in top_matches if idx != user_index][:top_n]

    if debug:
        user_name = df_original.iloc[user_index].get("name", f"User{user_index}")
        print(f"\n🔍 Initial Cosine Similarity Matches for {user_name}:")
        for i, match_idx in enumerate(top_matches):
            match_name = df_original.iloc[match_idx].get("name", f"User{match_idx}")
            similarity = user_similarities[match_idx]
            print(f"  {i+1}. {match_name} (Similarity: {similarity:.4f})")

    return top_matches


def get_top_compatible_matches(user_index, df, df_encoded, top_n=5, debug=False):
    """
    Find top compatible roommate matches for a user using bidirectional compatibility calculation.

    Parameters:
    - user_index: Index of the user seeking roommates
    - df: Original dataframe with all user data
    - df_encoded: Encoded dataframe with numerical representations
    - top_n: Number of top matches to return
    - debug: Whether to print debug information

    Returns:
    - DataFrame with top matches sorted by compatibility score
    """
    user_row = df_encoded.iloc[user_index]
    user_name = df.iloc[user_index].get("name", f"User{user_index}")

    print(f"\n📊 Finding top {top_n} compatible matches for {user_name}...")

    # First pass: Find potential matches using cosine similarity
    # This is more efficient than calculating detailed compatibility for all users
    potential_matches = find_top_matches(user_index, df, df_encoded, top_n=min(top_n*3, len(df)-1), debug=debug)

    print(f"\n💯 Calculating detailed compatibility scores for {len(potential_matches)} potential matches:")

    compatibility_scores = []

    # Calculate bidirectional compatibility scores for potential matches
    for match_index in potential_matches:
        match_row = df_encoded.iloc[match_index]
        match_name = df.iloc[match_index].get("name", f"User{match_index}")

        # Calculate compatibility in both directions and average them
        seeker_to_roommate_score = calculate_compatibility(user_row, match_row, debug=debug)
        roommate_to_seeker_score = calculate_compatibility(match_row, user_row, debug=debug)

        # Average the two directional scores
        avg_score = (seeker_to_roommate_score + roommate_to_seeker_score) / 2

        print(f"Average compatibility between {user_name} and {match_name}: {avg_score:.2f}%")

        compatibility_scores.append((match_index, avg_score))

    # Sort by compatibility score (highest first)
    compatibility_scores.sort(key=lambda x: x[1], reverse=True)

    # Take only the top_n matches
    top_match_indices = [idx for idx, _ in compatibility_scores[:top_n]]

    # Prepare result DataFrame with compatibility scores
    top_match_df = df.iloc[top_match_indices].copy()
    top_match_df["compatibility_score"] = [score for _, score in compatibility_scores[:top_n]]

    # Add user ID column for compatibility storage
    if 'id' in df.columns:
        top_match_df['id'] = df.iloc[top_match_indices]['id'].values
    elif 'user_id' in df.columns:
        top_match_df['id'] = df.iloc[top_match_indices]['user_id'].values
    else:
        # If no id column, create one with index as fallback
        top_match_df['id'] = top_match_df.index

    result_columns = ["name", "age", "gender", "compatibility_score", "id"]
    available_columns = [col for col in result_columns if col in top_match_df.columns]

    # Print summary of top matches
    print(f"\n🏆 Top {len(top_match_indices)} compatible matches for {user_name}:")
    for i, (idx, score) in enumerate(compatibility_scores[:top_n]):
        match_name = df.iloc[idx].get("name", f"User{idx}")
        match_age = df.iloc[idx].get("age", "N/A")
        match_gender = df.iloc[idx].get("gender", "N/A")
        print(f"  {i+1}. {match_name} (Age: {match_age}, Gender: {match_gender}) - Compatibility: {score:.2f}%")

    # Return results sorted by compatibility score
    return top_match_df[available_columns].sort_values(by="compatibility_score", ascending=False)


def calculate_group_compatibility(seeker_row, roommates, debug=False):
    """
    Calculate overall compatibility between a seeker and a group of potential roommates.

    Parameters:
    - seeker_row: DataFrame row or dict containing seeker's profile
    - roommates: List of DataFrame rows or dicts containing potential roommates' profiles
    - debug: Whether to print debug information

    Returns:
    - Group compatibility score (0-100)
    """
    if not roommates:
        return 0

    seeker_name = seeker_row.get("name", "Seeker") if isinstance(seeker_row, dict) else seeker_row.get("name", "Seeker")
    print(f"\n🏘️ Calculating group compatibility for {seeker_name} with {len(roommates)} potential roommates")

    # Calculate compatibility between seeker and each roommate
    pairwise_scores = []
    pairwise_details = []

    for roommate in roommates:
      roommate_name = roommate.get("name", "Roommate") if isinstance(roommate, dict) else roommate.get("name", "Roommate")

      # Calculate compatibility score both ways
      seeker_to_roommate = calculate_compatibility(seeker_row, roommate, debug=debug)
      roommate_to_seeker = calculate_compatibility(roommate, seeker_row, debug=debug)

      # Average both directions for fairness
      mutual_score = (seeker_to_roommate + roommate_to_seeker) / 2
      pairwise_scores.append(mutual_score)

      pairwise_details.append((roommate_name, seeker_to_roommate, roommate_to_seeker, mutual_score))


    # Calculate group score as weighted average of individual compatibility scores
    group_score = sum(pairwise_scores) / len(pairwise_scores)

    # Print detailed breakdown of group compatibility
    print(f"\n📊 Group Compatibility Analysis for {seeker_name}")
    print("Individual compatibility scores (mutual):")
    for roommate_name, s_to_r, r_to_s, mutual_score in pairwise_details:
        print(f" - {seeker_name} → {roommate_name}: {s_to_r:.2f}%")
        print(f" - {roommate_name} → {seeker_name}: {r_to_s:.2f}%")
        print(f"   ✅ Mutual Score: {mutual_score:.2f}%\n")

    print(f"📈 Overall Group Compatibility Score: {group_score:.2f}%")

    return group_score


def simulate_matches(df, df_encoded, num_users=5, debug=False):
    """
    Simulate matching for multiple users to demonstrate the system.

    Parameters:
    - df: Original dataframe with all user data
    - df_encoded: Encoded dataframe with numerical representations
    - num_users: Number of users to simulate matching for
    - debug: Whether to print debug information

    Returns:
    - Dict with user indices as keys and their top matches as values
    """
    results = {}

    # Choose a random sample of users to find matches for
    if num_users >= len(df):
        user_indices = range(len(df))
    else:
        user_indices = np.random.choice(range(len(df)), size=num_users, replace=False)

    print(f"\n🚀 Simulating roommate matching for {len(user_indices)} users")

    for user_idx in user_indices:
        user_name = df.iloc[user_idx].get("name", f"User{user_idx}")
        print(f"\n{'='*80}\n🔎 Finding matches for {user_name} (Index: {user_idx})\n{'='*80}")

        # Get top compatible matches for this user
        top_matches = get_top_compatible_matches(user_idx, df, df_encoded, top_n=3, debug=debug)

        results[user_idx] = top_matches

    return results


# Example usage:
compatible_matches_df = get_top_compatible_matches(99, df_encoded, df_encoded)
print(compatible_matches_df)
# Assuming df_synthetic_users is your DataFrame containing the user data

# Correct: passing numerical/encoded data
seeker_row = df_encoded.iloc[99]
roommate1 = df_encoded.iloc[98]
roommate2 = df_encoded.iloc[39]
roommate3 = df_encoded.iloc[13]


# Now calculate group compatibility
group_score = calculate_group_compatibility(seeker_row, [roommate1, roommate2, roommate3])

# Output the group compatibility score
print(f"Group Compatibility Score: {group_score}")
