const express = require('express');
const authController = require('../controllers/authController.js');
const { registerValidation } = require('../middlewares/validation/validationMiddleware');
const authMiddleware = require('../middlewares/auth/authMiddleware.js');
const roleMiddleware = require('../middlewares/auth/roleMiddleware.js');

const router = express.Router();

// Routes
router.post('/register',authMiddleware , roleMiddleware(["Admin"]), registerValidation, authController.register);
router.post('/login', authController.login);

module.exports = router;
