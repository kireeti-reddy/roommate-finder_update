require('dotenv').config();
require('./db');

const express = require('express');
const cors = require('cors');

const healthRouter = require('./routes/health');
const testDbRouter = require('./routes/testDb');

const usersRouter = require('./routes/users');

const roomsRouter = require('./routes/rooms');

const preferencesRouter = require('./routes/preferences');
const userAmenitiesRouter = require('./routes/userAmenities');

const app = express();

const PORT = process.env.PORT || 5001;
const FRONTEND_ORIGINS = process.env.FRONTEND_ORIGINS ? process.env.FRONTEND_ORIGINS.split(',') : ['http://localhost:5173', 'http://localhost:8081'];

const db = require('./db');

// Middleware
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (FRONTEND_ORIGINS.indexOf(origin) === -1 && !/^http:\/\/localhost:\d+$/.test(origin)) {
      console.error('Blocked CORS request from origin:', origin);
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));
app.use(express.json());

// Routes

app.use('/api/health', healthRouter);
app.use('/api/test-db', testDbRouter);

app.use('/api/users', usersRouter);

app.use('/api/rooms', roomsRouter);

app.use('/api/preferences', preferencesRouter);
app.use('/api/user-amenities', userAmenitiesRouter);

const fs = require('fs');
const path = require('path');

// Enhanced error logging middleware
app.use((err, req, res, next) => {
  const logMessage = `[${new Date().toISOString()}] Error: ${err.message}\nStack: ${err.stack}\nRequest: ${req.method} ${req.originalUrl}\n\n`;
  console.error(logMessage);
  // Append error log to a file
  fs.appendFile(path.join(__dirname, 'error.log'), logMessage, (writeErr) => {
    if (writeErr) {
      console.error('Failed to write error log:', writeErr);
    }
  });
  res.status(500).json({ error: 'Internal Server Error' });
});

db.pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Database connection successful:', res.rows[0]);
  }
});

console.log('Starting server...');
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
