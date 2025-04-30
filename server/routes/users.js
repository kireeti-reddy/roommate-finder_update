const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const usersDb = require('../db/users');
const { calculate_compatibility } = require('../utils/compatibility');

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await usersDb.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await usersDb.getAllUsers();
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new user with validation
router.post('/', async (req, res) => {
  try {
    const { email, password, full_name, age, gender, profile_url, phone_number, bio } = req.body;

    // Validate required fields
    if (!email || !password || !full_name || !age || !gender) {
      return res.status(400).json({ error: 'Missing required fields: email, password, full_name, age, gender' });
    }

    // Validate age range
    if (age < 18 || age > 100) {
      return res.status(400).json({ error: 'Age must be between 18 and 100' });
    }

    // Check if email already exists
    const existingUsers = await usersDb.getAllUsers();
    if (existingUsers.some(user => user.email === email)) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    const newUser = await usersDb.createUser({
      email,
      password_hash,
      full_name,
      age,
      gender,
      profile_url: profile_url || null,
      phone_number: phone_number || null,
      bio: bio || null,
    });

    res.status(201).json(newUser);
  } catch (err) {
    console.error('Error creating user:', err.message);
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedUser = await usersDb.updateUser(req.params.id, req.body);
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(updatedUser);
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete user by ID
router.delete('/:id', async (req, res) => {
  try {
    await usersDb.deleteUser(req.params.id);
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const users = await usersDb.getAllUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // You can add token generation here if needed

    res.json({ message: 'Login successful', user: { id: user.id, email: user.email, full_name: user.full_name } });
  } catch (err) {
    console.error('Error during login:', err.message);
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id/top-matches', async (req, res) => {
  const userId = req.params.id;

  try {
    // Query precomputed compatibility scores from DB
    const scores = await usersDb.getPrecomputedCompatibilityScores(userId);

    if (!scores) {
      return res.status(404).json({ error: 'No compatibility scores found for user' });
    }

    // Return top matches with user info and compatibility score
    res.json(scores);
  } catch (err) {
    console.error('Error fetching precomputed compatibility scores:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
