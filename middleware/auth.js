const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'hajela_ias_academy_secret_key_2024';

module.exports = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }
  
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new Error('No Authorization header found');
    }

    // Expecting "Bearer <token>"
    const token = authHeader.split(' ')[1]; 
    if (!token) {
      throw new Error('Authentication failed: No token provided');
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.userData = decoded;
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error.message);
    return res.status(401).json({ 
      message: 'Authentication failed: Invalid or expired token. Please login again.' 
    });
  }
};