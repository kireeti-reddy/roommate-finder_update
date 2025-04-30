const db = require('./index');

// Get room by ID
const getRoomById = async (id) => {
  const result = await db.query('SELECT * FROM rooms WHERE id = $1', [id]);
  return result.rows[0];
};

// Get all rooms (with optional limit)
const getAllRooms = async (limit = 100) => {
  const result = await db.query('SELECT * FROM rooms ORDER BY created_at DESC LIMIT $1', [limit]);
  return result.rows;
};

// Create new room
const createRoom = async (room) => {
  const {
    owner_id,
    location_id,
    title,
    description,
    rent_amount,
    deposit_amount,
    currency,
    available_from,
    available_until,
    total_bedrooms,
    total_bathrooms,
    room_size_sqft,
    is_furnished,
    is_private_room,
    is_private_bathroom,
    is_active,
  } = room;

  const result = await db.query(
    `INSERT INTO rooms (
      owner_id, location_id, title, description, rent_amount, deposit_amount, currency,
      available_from, available_until, total_bedrooms, total_bathrooms, room_size_sqft,
      is_furnished, is_private_room, is_private_bathroom, is_active
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7,
      $8, $9, $10, $11, $12,
      $13, $14, $15, $16
    ) RETURNING *`,
    [
      owner_id,
      location_id,
      title,
      description,
      rent_amount,
      deposit_amount,
      currency,
      available_from,
      available_until,
      total_bedrooms,
      total_bathrooms,
      room_size_sqft,
      is_furnished,
      is_private_room,
      is_private_bathroom,
      is_active,
    ]
  );
  return result.rows[0];
};

// Update room by ID
const updateRoom = async (id, room) => {
  const {
    title,
    description,
    rent_amount,
    deposit_amount,
    currency,
    available_from,
    available_until,
    total_bedrooms,
    total_bathrooms,
    room_size_sqft,
    is_furnished,
    is_private_room,
    is_private_bathroom,
    is_active,
  } = room;

  const result = await db.query(
    `UPDATE rooms SET
      title = $1,
      description = $2,
      rent_amount = $3,
      deposit_amount = $4,
      currency = $5,
      available_from = $6,
      available_until = $7,
      total_bedrooms = $8,
      total_bathrooms = $9,
      room_size_sqft = $10,
      is_furnished = $11,
      is_private_room = $12,
      is_private_bathroom = $13,
      is_active = $14,
      updated_at = NOW()
    WHERE id = $15
    RETURNING *`,
    [
      title,
      description,
      rent_amount,
      deposit_amount,
      currency,
      available_from,
      available_until,
      total_bedrooms,
      total_bathrooms,
      room_size_sqft,
      is_furnished,
      is_private_room,
      is_private_bathroom,
      is_active,
      id,
    ]
  );
  return result.rows[0];
};

// Delete room by ID
const deleteRoom = async (id) => {
  await db.query('DELETE FROM rooms WHERE id = $1', [id]);
};

module.exports = {
  getRoomById,
  getAllRooms,
  createRoom,
  updateRoom,
  deleteRoom,
};
