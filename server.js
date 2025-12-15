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

// Middleware
app.use(cors()); // Allow all origins by default for easier local dev
app.use(express.json());

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/forms', formRoutes);
app.use('/api/auth', authRoutes);

// Health check
app.get('/', (req, res) => {
  const dbState = mongoose.connection.readyState; // 0: disconnected, 1: connected, 2: connecting, 3: disconnecting
  res.json({ 
    status: 'API is running', 
    dbState: dbState === 1 ? 'Connected' : 'Disconnected/Connecting' 
  });
});

// Database Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://harshitwanjare_db_user:JbEa0pyul8rAZ4PD@cluster0.fmffgcn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Connect to MongoDB
// We don't block app.listen so the frontend doesn't get "Connection Refused"
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected Successfully');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    console.log('Retrying connection in 5 seconds...');
    // Simple retry logic could be added here if needed
  });

// Start Server immediately
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Test API at: http://localhost:${PORT}/`);
});