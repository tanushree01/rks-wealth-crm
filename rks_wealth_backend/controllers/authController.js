const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// **Register Controller**
exports.register = async (req, res) => {
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

    // Generate salt and hash password
    const salt = await bcrypt.genSalt(12); // 12 rounds of salting
    const hashedPassword = await bcrypt.hash(password, salt);

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
};

// **Login Controller**
exports.login = async (req, res) => {
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
};
