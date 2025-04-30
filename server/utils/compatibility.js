const calculate_compatibility = (user1, user2) => {
  // Adapted from scripts/compatibility_algo.py calculate_compatibility function
  // Simplified for backend usage, assumes user objects with necessary fields

  const weights = {
    cleanliness: 0.05, noise_tolerance: 0.05, guests_frequency: 0.04,
    partying: 0.03, bed_time: 0.015, wake_up_time: 0.015,
    smoking: 0.06, drinking: 0.05, marijuana: 0.03,
    cooking: 0.03, food_preferences: 0.03,
    introversion: 0.04, openness: 0.04, conscientiousness: 0.04,
    agreeableness: 0.05, neuroticism: 0.03,
    preferred_genders: 0.05, age_pref_min: 0.025, age_pref_max: 0.025,
    lgbtq_friendly: 0.05, work_schedule: 0.12, home_frequency: 0.08
  };

  const feature_ranges = {
    smoking: 1, drinking: 1, marijuana: 1, lgbtq_friendly: 1,
    preferred_genders: 3, cleanliness: 5, noise_tolerance: 5, guests_frequency: 5,
    partying: 5, cooking: 5, food_preferences: 5,
    introversion: 2, openness: 2, conscientiousness: 2,
    agreeableness: 2, neuroticism: 2,
    bed_time: 24, wake_up_time: 24,
    work_schedule: 3, home_frequency: 7,
    age_pref_min: 3, age_pref_max: 3,
  };

  // Helper to get value or default
  const getVal = (obj, key) => (obj && obj[key] !== undefined && obj[key] !== null) ? obj[key] : 0;

  // Map categorical string values to numeric codes for comparison
  const mapCategorical = (feature, value) => {
    const maps = {
      smoking: { 'No': 0, 'Yes': 1 },
      drinking: { 'Never': 0, 'Socially': 1, 'Often': 2 },
      marijuana: { 'Never': 0, 'Sometimes': 1, 'Often': 2 },
      lgbtq_friendly: { 'No': 0, 'Yes': 1 },
      preferred_genders: { 'Any': 0, 'Male': 1, 'Female': 2, 'Other': 3 },
      guests_frequency: { 'Low': 1, 'Medium': 3, 'High': 5 },
      partying: { 'Low': 1, 'Medium': 3, 'High': 5 },
      cooking: { 'Rarely': 1, 'Sometimes': 3, 'Often': 5 },
      food_preferences: { 'Vegetarian': 1, 'Non-Vegetarian': 2, 'Vegan': 3 },
      work_schedule: { 'Night Shift': 1, 'Day Shift': 2, 'Flexible': 3 },
      home_frequency: { 'Low': 1, 'Medium': 4, 'High': 7 },
    };
    if (maps[feature]) {
      return maps[feature][value] !== undefined ? maps[feature][value] : 0;
    }
    return value;
  };

  let total_score = 0;
  let total_weight = 0;

  // Age preference check
  const user1_age = parseFloat(getVal(user1, 'age'));
  const user2_age = parseFloat(getVal(user2, 'age'));
  let age_acceptance = 1.0;
  if (user1_age && user2_age) {
    const min_age = parseFloat(getVal(user1, 'age_pref_min'));
    const max_age = parseFloat(getVal(user1, 'age_pref_max'));
    if (user2_age < min_age || user2_age > max_age) {
      age_acceptance = 0.0;
    }
  }
  total_score += age_acceptance * weights.age_pref_min;
  total_weight += weights.age_pref_min;

  // Gender preference check
  const preferred_gender = getVal(user1, 'preferred_genders');
  const user2_gender = getVal(user2, 'gender');
  let gender_acceptance = 1.0;
  if (preferred_gender !== 0 && preferred_gender !== user2_gender) {
    gender_acceptance = 0.0;
  }
  total_score += gender_acceptance * weights.preferred_genders;
  total_weight += weights.preferred_genders;

  // Iterate over features
  for (const feature in weights) {
    if (feature === 'age_pref_min' || feature === 'preferred_genders') continue;

    const weight = weights[feature];
    let val1 = getVal(user1, feature);
    let val2 = getVal(user2, feature);
    const range = feature_ranges[feature] || 1;

    // Convert categorical string values to numeric codes
    val1 = mapCategorical(feature, val1);
    val2 = mapCategorical(feature, val2);

    // Convert numeric strings to numbers
    val1 = typeof val1 === 'string' ? parseFloat(val1) || 0 : val1;
    val2 = typeof val2 === 'string' ? parseFloat(val2) || 0 : val2;

    let similarity = 0;

    if (feature === 'bed_time' || feature === 'wake_up_time') {
      const diff = Math.min(Math.abs(val1 - val2), range - Math.abs(val1 - val2));
      similarity = 1 - Math.min(diff / range, 1);
    } else if (feature === 'work_schedule') {
      similarity = val1 === val2 ? 1 : 0.5;
    } else {
      similarity = 1 - Math.min(Math.abs(val1 - val2) / range, 1);
    }

    total_score += similarity * weight;
    total_weight += weight;
  }

  const final_score = total_weight > 0 ? (total_score / total_weight) * 100 : 0;
  return Math.max(0, Math.min(final_score, 100));
};

module.exports = { calculate_compatibility };
