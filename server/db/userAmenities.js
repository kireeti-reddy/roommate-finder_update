const db = require('./index');

// Get amenities by user ID
const getAmenitiesByUserId = async (userId) => {
  const result = await db.query('SELECT amenity FROM user_amenities WHERE user_id = $1', [userId]);
  return result.rows.map(row => row.amenity);
};

// Add an amenity for a user
const addAmenityForUser = async (userId, amenity) => {
  const result = await db.query(
    `INSERT INTO user_amenities (user_id, amenity) VALUES ($1, $2) ON CONFLICT (user_id, amenity) DO NOTHING RETURNING *`,
    [userId, amenity]
  );
  return result.rows[0];
};

// Remove an amenity for a user
const removeAmenityForUser = async (userId, amenity) => {
  await db.query('DELETE FROM user_amenities WHERE user_id = $1 AND amenity = $2', [userId, amenity]);
};

module.exports = {
  getAmenitiesByUserId,
  addAmenityForUser,
  removeAmenityForUser,
};
