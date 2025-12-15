const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const JWT_SECRET =
  process.env.JWT_SECRET || 'hajela_ias_academy_secret_key_2024';

const SEED_EMAIL = 'admin@hajelaias.com';
const SEED_PASSWORD = 'admin123';

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (email !== SEED_EMAIL || password !== SEED_PASSWORD) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = jwt.sign(
    { email, role: 'admin' },
    JWT_SECRET,
    { expiresIn: '12h' }
  );

  res.json({
    token,
    user: {
      email,
      role: 'admin'
    }
  });
});

module.exports = router;
