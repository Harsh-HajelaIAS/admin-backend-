require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const authRoutes = require('./routes/authRoutes');
const formRoutes = require('./routes/formRoutes');

const app = express();

/* ======================
   PORT (IMPORTANT)
====================== */
const PORT = process.env.PORT || 5000;

/* ======================
   CORS (CORRECT WAY)
====================== */
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://admin-frontend-gamma-ten.vercel.app',
    'https://admin-frontend-dwqkh928-harshs-projects-f32e0299.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

/* ======================
   BODY PARSER
====================== */
app.use(express.json());

/* ======================
   UPLOADS
====================== */
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use('/uploads', express.static(uploadDir));

/* ======================
   ROUTES
====================== */
app.use('/api/auth', authRoutes);
app.use('/api/forms', formRoutes);

/* ======================
   HEALTH CHECK
====================== */
app.get('/', (req, res) => {
  res.json({
    status: 'API is running',
    dbState: mongoose.connection.readyState === 1 ? 'Connected' : 'Not connected'
  });
});

/* ======================
   DATABASE
====================== */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('Mongo Error:', err));

/* ======================
   START SERVER
====================== */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
 