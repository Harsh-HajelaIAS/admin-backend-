require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const formRoutes = require('./routes/formRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

/* =======================
   ✅ CORS CONFIG (FIXED)
======================= */
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://admin-frontend-gamma-ten.vercel.app',
    'https://admin-frontend-git-main-harshs-projects-f32e0299.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Handle preflight requests
app.options('*', cors());

/* =======================
   MIDDLEWARE
======================= */
app.use(express.json());

/* =======================
   UPLOADS FOLDER
======================= */
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.use('/uploads', express.static(uploadDir));

/* =======================
   ROUTES
======================= */
app.use('/api/auth', authRoutes);
app.use('/api/forms', formRoutes);

/* =======================
   HEALTH CHECK
======================= */
app.get('/', (req, res) => {
  const dbState = mongoose.connection.readyState;
  res.json({
    status: 'API is running',
    dbState: dbState === 1 ? 'Connected' : 'Disconnected/Connecting'
  });
});

/* =======================
   DATABASE
======================= */
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected Successfully');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

/* =======================
   START SERVER
======================= */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
