const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // Import cors
const sequelize = require('./config/database');
const authRoutes = require('./routes/auth');
const clientRoutes = require('./routes/client');

// Load environment variables
dotenv.config();

// Initialize app
const app = express();

// Enable CORS
app.use(cors({
  origin: "*", // Allow frontend requests
  methods: "GET,POST,PUT,DELETE",
  credentials: true // Allow cookies (if needed)
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.send('✅ Server is running!');
});

// Use authentication routes
app.use('/api/auth', authRoutes);
app.use('/api/client', clientRoutes);

// Sync Database
sequelize.sync({ force: false }) // Set to true to reset tables on restart
  .then(() => console.log('Database Connected'))
  .catch(err => console.error('Database sync error:', err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
