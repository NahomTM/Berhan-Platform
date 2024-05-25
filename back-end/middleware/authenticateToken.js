// backend/middleware/authenticateToken.js
const jwt = require('jsonwebtoken');
const { verifyAccessToken } = require('../utils/authUtils'); // Assume you have this in a shared component

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  const { valid, decoded } = verifyAccessToken(token);

  if (!valid) {
    return res.status(403).json({ message: 'Invalid token' });
  }

  req.user = decoded; // Attach user information to the request
  next(); // Proceed to the next middleware or route handler
};

module.exports = authenticateToken;
