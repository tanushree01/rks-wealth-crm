const express = require('express');
const clientController = require('../controllers/clientController.js');

const router = express.Router();

// Routes
router.get('/diary', clientController.getClientDiaries);

module.exports = router;
