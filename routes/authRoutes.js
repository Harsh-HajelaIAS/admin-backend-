const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'hajela_secret';

const SEED_EMAIL = 'admin@hajelaias.com';
const SEED_PASSWORD = 'admin123';

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (email !== SEED_EMAIL || password !== SEED_PASSWORD) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { email },
    JWT_SECRET,
    { expiresIn: '12h' }
  );

  res.status(200).json({
    token,
    user: { email }
  });
});

module.exports = router;
