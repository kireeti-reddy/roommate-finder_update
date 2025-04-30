const express = require('express');
const router = express.Router();
const userAmenitiesDb = require('../db/userAmenities');

// Get amenities by user ID
router.get('/:userId', async (req, res) => {
  try {
    const amenities = await userAmenitiesDb.getAmenitiesByUserId(req.params.userId);
    res.json(amenities);
  } catch (err) {
    console.error('Error fetching user amenities:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add an amenity for user
router.post('/:userId', async (req, res) => {
  try {
    const { amenity } = req.body;
    if (!amenity) {
      return res.status(400).json({ error: 'Amenity is required' });
    }
    const added = await userAmenitiesDb.addAmenityForUser(req.params.userId, amenity);
    res.status(201).json(added);
  } catch (err) {
    console.error('Error adding user amenity:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Remove an amenity for user
router.delete('/:userId/:amenity', async (req, res) => {
  try {
    await userAmenitiesDb.removeAmenityForUser(req.params.userId, req.params.amenity);
    res.status(204).send();
  } catch (err) {
    console.error('Error removing user amenity:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
