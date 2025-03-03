// app.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');

// Load environment variables
dotenv.config();

// Initialize app
const app = express();
app.use(express.json());

// Use the routes
app.use('/api/auth', authRoutes);

// Connect to the MongoDB database (no need for useNewUrlParser and useUnifiedTopology)
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log('MongoDB Connection Error:', err));

// Define a basic route to check if the server is running
app.get('/', (req, res) => {
  res.send('Welcome to your Node.js project!');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
