const jwt = require('jsonwebtoken');
const User = require('../../models/User'); // Adjust path as necessary

const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
    req.user = await User.findByPk(decoded.id, {
      attributes: ['id', 'firstName', 'lastName', 'email', 'phone','userType', 'username']
    });
    
    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;
