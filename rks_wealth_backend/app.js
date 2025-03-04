const express = require('express');
const dotenv = require('dotenv');
const sequelize = require('./config/database');
const authRoutes = require('./routes/auth');

// Load environment variables
dotenv.config();

// Initialize app
const app = express();
app.use(express.json());

// Use authentication routes
app.use('/api/auth', authRoutes);

// Sync Database
sequelize.sync({ force: false }) // Set to true to reset tables on restart
  .then(() => console.log('Database Connected'))
  .catch(err => console.error('Database sync error:', err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
