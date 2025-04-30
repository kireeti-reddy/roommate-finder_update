const express = require('express');
const router = express.Router();
const preferencesDb = require('../db/preferences');

// Get preferences by user ID
router.get('/:userId', async (req, res) => {
  try {
    const prefs = await preferencesDb.getPreferencesByUserId(req.params.userId);
    if (!prefs) {
      return res.status(404).json({ error: 'Preferences not found' });
    }
    res.json(prefs);
  } catch (err) {
    console.error('Error fetching preferences:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create or update preferences for user ID
router.post('/:userId', async (req, res) => {
  try {
    const updatedPrefs = await preferencesDb.upsertPreferences(req.params.userId, req.body);
    res.json(updatedPrefs);
  } catch (err) {
    console.error('Error updating preferences:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
