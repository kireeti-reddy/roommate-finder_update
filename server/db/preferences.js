const db = require('./index');

// Get preferences by user ID
const getPreferencesByUserId = async (userId) => {
  const result = await db.query('SELECT * FROM user_preferences WHERE user_id = $1', [userId]);
  return result.rows[0];
};

// Create or update preferences for a user
const upsertPreferences = async (userId, preferences) => {
  const {
    cleanliness,
    noise_tolerance,
    guests_frequency,
    partying,
    bed_time,
    wake_up_time,
    smoking,
    drinking,
    marijuana,
    cooking,
    food_preferences,
    introversion,
    openness,
    conscientiousness,
    agreeableness,
    neuroticism,
    preferred_genders,
    age_pref_min,
    age_pref_max,
    lgbtq_friendly,
    work_schedule,
    home_frequency,
  } = preferences;

  // Check if preferences exist
  const existing = await getPreferencesByUserId(userId);
  if (existing) {
    // Update
    const result = await db.query(
      `UPDATE user_preferences SET
        cleanliness = $1,
        noise_tolerance = $2,
        guests_frequency = $3,
        partying = $4,
        bed_time = $5,
        wake_up_time = $6,
        smoking = $7,
        drinking = $8,
        marijuana = $9,
        cooking = $10,
        food_preferences = $11,
        introversion = $12,
        openness = $13,
        conscientiousness = $14,
        agreeableness = $15,
        neuroticism = $16,
        preferred_genders = $17,
        age_pref_min = $18,
        age_pref_max = $19,
        lgbtq_friendly = $20,
        work_schedule = $21,
        home_frequency = $22,
        updated_at = NOW()
      WHERE user_id = $23
      RETURNING *`,
      [
        cleanliness,
        noise_tolerance,
        guests_frequency,
        partying,
        bed_time,
        wake_up_time,
        smoking,
        drinking,
        marijuana,
        cooking,
        food_preferences,
        introversion,
        openness,
        conscientiousness,
        agreeableness,
        neuroticism,
        preferred_genders,
        age_pref_min,
        age_pref_max,
        lgbtq_friendly,
        work_schedule,
        home_frequency,
        userId,
      ]
    );
    return result.rows[0];
  } else {
    // Insert
    const result = await db.query(
      `INSERT INTO user_preferences (
        user_id,
        cleanliness,
        noise_tolerance,
        guests_frequency,
        partying,
        bed_time,
        wake_up_time,
        smoking,
        drinking,
        marijuana,
        cooking,
        food_preferences,
        introversion,
        openness,
        conscientiousness,
        agreeableness,
        neuroticism,
        preferred_genders,
        age_pref_min,
        age_pref_max,
        lgbtq_friendly,
        work_schedule,
        home_frequency
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
        $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
        $21, $22, $23
      ) RETURNING *`,
      [
        userId,
        cleanliness,
        noise_tolerance,
        guests_frequency,
        partying,
        bed_time,
        wake_up_time,
        smoking,
        drinking,
        marijuana,
        cooking,
        food_preferences,
        introversion,
        openness,
        conscientiousness,
        agreeableness,
        neuroticism,
        preferred_genders,
        age_pref_min,
        age_pref_max,
        lgbtq_friendly,
        work_schedule,
        home_frequency,
      ]
    );
    return result.rows[0];
  }
};

module.exports = {
  getPreferencesByUserId,
  upsertPreferences,
};
