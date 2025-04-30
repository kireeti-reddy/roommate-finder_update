def calculate_compatibility(user1, user2, debug=False):
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

        weighted_similarity = similarity * weight
        contributions[feature] = weighted_similarity
        total_score += weighted_similarity
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
