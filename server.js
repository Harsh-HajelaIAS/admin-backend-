require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const formRoutes = require('./routes/formRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 10000;

/* =======================
   ✅ CORS (FIXED)
======================= */
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.options('*', cors()); // 🔥 VERY IMPORTANT

/* =======================
   Uploads
======================= */
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use('/uploads', express.static(uploadDir));

/* =======================
   Routes
======================= */
app.use('/api/forms', formRoutes);
app.use('/api/auth', authRoutes);   // ✅ ONLY THIS

/* =======================
   Health Check
======================= */
app.get('/', (req, res) => {
  res.json({ status: 'API is running', dbState: 'Connected' });
});

/* =======================
   MongoDB
======================= */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch(err => console.error(err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
