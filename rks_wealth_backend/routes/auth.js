const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// **Register API**
router.post('/register', [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').isMobilePhone().withMessage('Valid phone number is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match');
    }
    return true;
  }),
  body('gender').isIn(['Male', 'Female', 'Other']).withMessage('Invalid gender selection'),
  body('address').notEmpty().withMessage('Address is required'),
  body('maritalStatus').isIn(['Single', 'Married', 'Divorced', 'Widowed']).withMessage('Invalid marital status'),
  body('userType').isIn(['Admin', 'User', 'Manager']).withMessage('Invalid user type')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { firstName, lastName, email, phone, password, gender, address, maritalStatus, userType } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user in MySQL
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      gender,
      address,
      maritalStatus,
      userType,
    });

    res.status(201).json({ message: 'User registered successfully', userId: newUser.id });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// **Login API**
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Generate JWT Token
    const token = jwt.sign(
      { id: user.id, userType: user.userType },
      process.env.JWT_SECRET,
      { expiresIn: '12h' }
    );

    res.json({ token, userType: user.userType });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;
