const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const JWT_SECRET = process.env.JWT_SECRET || 'hajela_ias_academy_secret_key_2024';

// Hardcoded seed for demonstration since no registration flow is requested
// Matches the hint displayed on the Admin Login page
const SEED_EMAIL = 'admin@hajelaias.com';
const SEED_PASSWORD = 'admin123'; 

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // For this specific requirement without a registration page, 
    // we check against a hardcoded credential.
    
    let isValid = false;
    let userId = 'admin-static-id';

    if (email === SEED_EMAIL && password === SEED_PASSWORD) {
        isValid = true;
    }

    if (!isValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: userId, email: email },
      JWT_SECRET,
      { expiresIn: '12h' }
    );

    res.json({
      token: token,
      user: { id: userId, email: email }
    });

  } catch (error) {
    res.status(500).json({ message: 'Login failed' });
  }
});

module.exports = router;