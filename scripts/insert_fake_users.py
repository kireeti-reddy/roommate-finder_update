import psycopg2
import uuid
import random
from faker import Faker
from datetime import datetime

# === Configuration ===
db_config = {
    "host": "localhost",
    "database": "applications",
    "user": "postgres",
    "password": "kireeti-19/08/2005",
    "port": "5432",
}

# === Initialize Faker ===
fake = Faker()

# === Helper Functions ===
def get_connection():
    return psycopg2.connect(**db_config)

def random_decimal(start, end, decimals=2):
    return round(random.uniform(start, end), decimals)

def get_random_element(arr):
    return random.choice(arr)

def create_fake_user():
    gender_options = ['Male', 'Female', 'Other']
    gender = get_random_element(gender_options)
    full_name = fake.name_male() if gender == 'Male' else fake.name_female() if gender == 'Female' else fake.name()
    email = fake.unique.email()
    password_hash = str(uuid.uuid4())  # Placeholder for hashed password
    age = random.randint(18, 100)
    profile_url = fake.image_url()
    phone_number = fake.phone_number()
    bio = fake.sentence(nb_words=12)
    return {
        "id": str(uuid.uuid4()),
        "email": email,
        "password_hash": password_hash,
        "full_name": full_name,
        "age": age,
        "gender": gender,
        "profile_url": profile_url,
        "phone_number": phone_number,
        "bio": bio,
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    }

def create_fake_user_preferences(user_id):
    frequency_levels = ['Low', 'Medium', 'High']
    yes_no = ['Yes', 'No']
    drinking_frequency = ['Never', 'Socially', 'Often']
    marijuana_usage = ['Never', 'Sometimes', 'Often']
    cooking_frequency = ['Rarely', 'Sometimes', 'Often']
    food_preferences = ['Vegetarian', 'Non-Vegetarian', 'Vegan']
    gender_preferences = ['Any', 'Male', 'Female', 'Other']
    work_schedules = ['Night Shift', 'Day Shift', 'Flexible']

    return {
        "id": str(uuid.uuid4()),
        "user_id": user_id,
        "cleanliness": random.randint(1, 5),
        "noise_tolerance": random.randint(1, 5),
        "guests_frequency": get_random_element(frequency_levels),
        "partying": get_random_element(frequency_levels),
        "bed_time": round(random.uniform(0, 24), 2),
        "wake_up_time": round(random.uniform(0, 24), 2),
        "smoking": get_random_element(yes_no),
        "drinking": get_random_element(drinking_frequency),
        "marijuana": get_random_element(marijuana_usage),
        "cooking": get_random_element(cooking_frequency),
        "food_preferences": get_random_element(food_preferences),
        "introversion": round(random.uniform(0, 1), 2),
        "openness": round(random.uniform(0, 1), 2),
        "conscientiousness": round(random.uniform(0, 1), 2),
        "agreeableness": round(random.uniform(0, 1), 2),
        "neuroticism": round(random.uniform(0, 1), 2),
        "preferred_genders": get_random_element(gender_preferences),
        "age_pref_min": 18,
        "age_pref_max": 100,
        "lgbtq_friendly": get_random_element(yes_no),
        "work_schedule": get_random_element(work_schedules),
        "home_frequency": get_random_element(frequency_levels),
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    }

def create_fake_compatibility_scores(user_id, existing_user_ids):
    scores = []
    for existing_id in existing_user_ids:
        if existing_id == user_id:
            continue
        # forward direction
        scores.append({
            "id": str(uuid.uuid4()),
            "user_id": user_id,
            "target_user_id": existing_id,
            "direction": "forward",
            "overall_score": 50.0,
            "lifestyle_score": 50.0,
            "personality_score": 50.0,
            "schedule_score": 50.0,
            "preference_match_score": 50.0,
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        })
        # reverse direction
        scores.append({
            "id": str(uuid.uuid4()),
            "user_id": existing_id,
            "target_user_id": user_id,
            "direction": "reverse",
            "overall_score": 50.0,
            "lifestyle_score": 50.0,
            "personality_score": 50.0,
            "schedule_score": 50.0,
            "preference_match_score": 50.0,
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        })
    return scores

def insert_users_preferences_scores(users, preferences, scores):
    conn = get_connection()
    cur = conn.cursor()
    try:
        for user in users:
            cur.execute("""
                INSERT INTO users (id, email, password_hash, full_name, age, gender, profile_url, phone_number, bio, created_at, updated_at)
                VALUES (%(id)s, %(email)s, %(password_hash)s, %(full_name)s, %(age)s, %(gender)s, %(profile_url)s, %(phone_number)s, %(bio)s, %(created_at)s, %(updated_at)s)
            """, user)
        for pref in preferences:
            cur.execute("""
                INSERT INTO user_preferences (
                    id, user_id, cleanliness, noise_tolerance, guests_frequency, partying, bed_time, wake_up_time,
                    smoking, drinking, marijuana, cooking, food_preferences, introversion, openness,
                    conscientiousness, agreeableness, neuroticism, preferred_genders, age_pref_min, age_pref_max,
                    lgbtq_friendly, work_schedule, home_frequency, created_at, updated_at
                ) VALUES (
                    %(id)s, %(user_id)s, %(cleanliness)s, %(noise_tolerance)s, %(guests_frequency)s, %(partying)s, %(bed_time)s, %(wake_up_time)s,
                    %(smoking)s, %(drinking)s, %(marijuana)s, %(cooking)s, %(food_preferences)s, %(introversion)s, %(openness)s,
                    %(conscientiousness)s, %(agreeableness)s, %(neuroticism)s, %(preferred_genders)s, %(age_pref_min)s, %(age_pref_max)s,
                    %(lgbtq_friendly)s, %(work_schedule)s, %(home_frequency)s, %(created_at)s, %(updated_at)s
                )
            """, pref)
        for score in scores:
            cur.execute("""
                INSERT INTO compatibility_scores (
                    id, user_id, target_user_id, direction, overall_score, lifestyle_score, personality_score, schedule_score, preference_match_score, created_at, updated_at
                ) VALUES (
                    %(id)s, %(user_id)s, %(target_user_id)s, %(direction)s, %(overall_score)s, %(lifestyle_score)s, %(personality_score)s, %(schedule_score)s, %(preference_match_score)s, %(created_at)s, %(updated_at)s
                )
            """, score)
        conn.commit()
    except Exception as e:
        print("Error inserting data:", e)
        conn.rollback()
    finally:
        cur.close()
        conn.close()

def main():
    users = []
    preferences = []
    scores = []
    for _ in range(100):
        user = create_fake_user()
        users.append(user)
        pref = create_fake_user_preferences(user["id"])
        preferences.append(pref)
        # For compatibility scores, we need existing user ids, so we add scores after all users are created
    # After all users are created, generate compatibility scores
    user_ids = [user["id"] for user in users]
    for user in users:
        user_scores = create_fake_compatibility_scores(user["id"], user_ids)
        scores.extend(user_scores)

    insert_users_preferences_scores(users, preferences, scores)
    print("Inserted 100 fake users with preferences and compatibility scores.")

if __name__ == "__main__":
    main()
