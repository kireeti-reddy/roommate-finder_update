const express = require('express');
const router = express.Router();
const roomsDb = require('../db/rooms');

// Get room by ID
router.get('/:id', async (req, res) => {
  try {
    const room = await roomsDb.getRoomById(req.params.id);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    res.json(room);
  } catch (err) {
    console.error('Error fetching room:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all rooms
router.get('/', async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 100;
    const rooms = await roomsDb.getAllRooms(limit);
    res.json(rooms);
  } catch (err) {
    console.error('Error fetching rooms:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new room
router.post('/', async (req, res) => {
  try {
    const newRoom = await roomsDb.createRoom(req.body);
    res.status(201).json(newRoom);
  } catch (err) {
    console.error('Error creating room:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update room by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedRoom = await roomsDb.updateRoom(req.params.id, req.body);
    if (!updatedRoom) {
      return res.status(404).json({ error: 'Room not found' });
    }
    res.json(updatedRoom);
  } catch (err) {
    console.error('Error updating room:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete room by ID
router.delete('/:id', async (req, res) => {
  try {
    await roomsDb.deleteRoom(req.params.id);
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting room:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
