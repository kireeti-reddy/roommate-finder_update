const db = require('./index');

// Get user by ID
const getUserById = async (id) => {
  const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0];
};

// Get all users
const getAllUsers = async () => {
  const result = await db.query('SELECT * FROM users');
  return result.rows;
};

// Helper function to get random element from array
const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Create new user with preferences
const createUser = async (user) => {
  const { email, password_hash, full_name, age, gender, profile_url, phone_number, bio } = user;
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');

    const userResult = await client.query(
      `INSERT INTO users (email, password_hash, full_name, age, gender, profile_url, phone_number, bio)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [email, password_hash, full_name, age, gender, profile_url, phone_number, bio]
    );
    const newUser = userResult.rows[0];

    // Generate random values for user_preferences
    const cleanliness = Math.floor(Math.random() * 5) + 1; // 1-5
    const noise_tolerance = Math.floor(Math.random() * 5) + 1; // 1-5
    const frequencyLevels = ['Low', 'Medium', 'High'];
    const yesNo = ['Yes', 'No'];
    const drinkingFrequency = ['Never', 'Socially', 'Often'];
    const marijuanaUsage = ['Never', 'Sometimes', 'Often'];
    const cookingFrequency = ['Rarely', 'Sometimes', 'Often'];
    const foodPreferences = ['Vegetarian', 'Non-Vegetarian', 'Vegan'];
    const genderPreferences = ['Any', 'Male', 'Female', 'Other'];
    const workSchedules = ['Night Shift', 'Day Shift', 'Flexible'];

    const guests_frequency = getRandomElement(frequencyLevels);
    const partying = getRandomElement(frequencyLevels);
    const bed_time = parseFloat((Math.random() * 24).toFixed(2));
    const wake_up_time = parseFloat((Math.random() * 24).toFixed(2));
    const smoking = getRandomElement(yesNo);
    const drinking = getRandomElement(drinkingFrequency);
    const marijuana = getRandomElement(marijuanaUsage);
    const cooking = getRandomElement(cookingFrequency);
    const food_preferences = getRandomElement(foodPreferences);
    const introversion = parseFloat(Math.random().toFixed(2));
    const openness = parseFloat(Math.random().toFixed(2));
    const conscientiousness = parseFloat(Math.random().toFixed(2));
    const agreeableness = parseFloat(Math.random().toFixed(2));
    const neuroticism = parseFloat(Math.random().toFixed(2));
    const preferred_genders = getRandomElement(genderPreferences);
    const age_pref_min = 18;
    const age_pref_max = 100;
    const lgbtq_friendly = getRandomElement(yesNo);
    const work_schedule = getRandomElement(workSchedules);
    const home_frequency = getRandomElement(frequencyLevels);

    await client.query(
      `INSERT INTO user_preferences (
        user_id, cleanliness, noise_tolerance, guests_frequency, partying, bed_time, wake_up_time,
        smoking, drinking, marijuana, cooking, food_preferences, introversion, openness,
        conscientiousness, agreeableness, neuroticism, preferred_genders, age_pref_min, age_pref_max,
        lgbtq_friendly, work_schedule, home_frequency
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7,
        $8, $9, $10, $11, $12, $13, $14,
        $15, $16, $17, $18, $19, $20,
        $21, $22, $23
      )`,
      [
        newUser.id, cleanliness, noise_tolerance, guests_frequency, partying, bed_time, wake_up_time,
        smoking, drinking, marijuana, cooking, food_preferences, introversion, openness,
        conscientiousness, agreeableness, neuroticism, preferred_genders, age_pref_min, age_pref_max,
        lgbtq_friendly, work_schedule, home_frequency
      ]
    );

    // Removed compatibility scores insertion during user creation to avoid overloading

    await client.query('COMMIT');
    return newUser;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

// Update user by ID
const updateUser = async (id, user) => {
  let { full_name, age, gender, profile_url, phone_number, bio, is_active, email_verified } = user;

  // Map gender to capitalized enum values in DB
  if (gender) {
    const genderMap = {
      male: 'Male',
      female: 'Female',
      other: 'Other',
    };
    gender = genderMap[gender.toLowerCase()] || null;
  }

  // Convert empty string age to null
  if (age === '') {
    age = null;
  } else if (age !== null && age !== undefined) {
    age = parseInt(age, 10);
    if (isNaN(age)) {
      age = null;
    }
  }

  if (!id) {
    throw new Error('User id is required for update');
  }

  const result = await db.query(
    `UPDATE users SET full_name = $1, age = $2, gender = $3, profile_url = $4, phone_number = $5, bio = $6, is_active = $7, email_verified = $8, updated_at = NOW()
     WHERE id = $9
     RETURNING *`,
    [full_name, age, gender, profile_url, phone_number, bio, is_active, email_verified, id]
  );
  return result.rows[0];
};

// Delete user by ID
const deleteUser = async (id) => {
  await db.query('DELETE FROM users WHERE id = $1', [id]);
};

const getAllUsersWithPreferences = async () => {
  const result = await db.query(
    `SELECT u.*, p.cleanliness, p.noise_tolerance, p.guests_frequency, p.partying, p.bed_time, p.wake_up_time,
            p.smoking, p.drinking, p.marijuana, p.cooking, p.food_preferences, p.introversion, p.openness,
            p.conscientiousness, p.agreeableness, p.neuroticism, p.preferred_genders, p.age_pref_min, p.age_pref_max,
            p.lgbtq_friendly, p.work_schedule, p.home_frequency
     FROM users u
     LEFT JOIN user_preferences p ON u.id = p.user_id
     WHERE u.is_active = TRUE`
  );
  return result.rows;
};

const getPrecomputedCompatibilityScores = async (userId) => {
  const query = `
    SELECT u.*, cs.compatibility_score
    FROM user_compatibility_scores cs
    JOIN users u ON cs.match_user_id = u.id
    WHERE cs.user_id = $1
    ORDER BY cs.compatibility_score DESC
    LIMIT 15
  `;
  const result = await db.query(query, [userId]);
  if (!result.rows.length) {
    return null;
  }
  return result.rows.map(row => ({
    user: {
      id: row.id,
      email: row.email,
      full_name: row.full_name,
      age: row.age,
      gender: row.gender,
      profile_url: row.profile_url,
      phone_number: row.phone_number,
      bio: row.bio,
      is_active: row.is_active,
      email_verified: row.email_verified,
      last_login: row.last_login,
      created_at: row.created_at,
      updated_at: row.updated_at,
      cleanliness: row.cleanliness,
      noise_tolerance: row.noise_tolerance,
      guests_frequency: row.guests_frequency,
      partying: row.partying,
      bed_time: row.bed_time,
      wake_up_time: row.wake_up_time,
      smoking: row.smoking,
      drinking: row.drinking,
      marijuana: row.marijuana,
      cooking: row.cooking,
      food_preferences: row.food_preferences,
      introversion: row.introversion,
      openness: row.openness,
      conscientiousness: row.conscientiousness,
      agreeableness: row.agreeableness,
      neuroticism: row.neuroticism,
      preferred_genders: row.preferred_genders,
      age_pref_min: row.age_pref_min,
      age_pref_max: row.age_pref_max,
      lgbtq_friendly: row.lgbtq_friendly,
      work_schedule: row.work_schedule,
      home_frequency: row.home_frequency,
    },
    compatibility_score: row.compatibility_score,
  }));
};

module.exports = {
  getUserById,
  getAllUsers,
  getAllUsersWithPreferences,
  createUser,
  updateUser,
  deleteUser,
  getPrecomputedCompatibilityScores,
};
