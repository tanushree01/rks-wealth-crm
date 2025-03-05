const express = require('express');
const authController = require('../controllers/authController.js');
const { registerValidation } = require('../middlewares/validationMiddleware');

const router = express.Router();

// Routes
router.post('/register', registerValidation, authController.register);
router.post('/login', authController.login);

module.exports = router;
