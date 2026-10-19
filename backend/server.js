// ============================================================================
// server.js - Backend Server Initialization
// Target Client: Mitsu Travel & Tours
// Concepts Used: Express, express.json(), cors(), Mongoose Connection, MVC Routes
// ============================================================================

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import MVC Route Files
const userRoutes = require('./routes/userRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();
const PORT = 5000;

// Middleware Setup
app.use(cors());
app.use(express.json());

// MongoDB Connection via Mongoose
const MONGO_URI = 'mongodb://127.0.0.1:27017/mitsu_travel_db';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB: mitsu_travel_db');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error.message);
  });

// Register API Routes
app.use('/api', userRoutes);
app.use('/api', bookingRoutes);

// Root Test Endpoint
app.get('/', (req, res) => {
  res.send('Mitsu Travel & Tours API Server is running.');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
