const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const AdmissionForm = require('../models/AdmissionForm');
const checkAuth = require('../middleware/auth');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Config for Local Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Sanitize filename and append timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only images and PDFs are allowed'));
    }
  }
});

// Define file fields
const cpUpload = upload.fields([
  { name: 'passport_photo', maxCount: 1 },
  { name: 'marksheet_10th', maxCount: 1 },
  { name: 'marksheet_12th', maxCount: 1 },
  { name: 'marksheet_graduation', maxCount: 1 },
  { name: 'aadhaar_card', maxCount: 1 }
]);

// Wrapper middleware to handle Multer errors gracefully
const uploadMiddleware = (req, res, next) => {
  cpUpload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading (e.g. file too large)
      return res.status(400).json({ message: `Upload Error: ${err.message}` });
    } else if (err) {
      // An unknown error occurred when uploading.
      return res.status(400).json({ message: `Upload Error: ${err.message}` });
    }
    // Everything went fine.
    next();
  });
};

// POST: Submit Form (Public)
// Uses uploadMiddleware to prevent crashes on upload errors
router.post('/', uploadMiddleware, async (req, res) => {
  try {
    const files = req.files || {};
    
    // Helper to get file path relative to server
    const getPath = (fieldName) => {
      if (files[fieldName] && files[fieldName][0]) {
        return '/uploads/' + files[fieldName][0].filename;
      }
      return null;
    };

    const formData = {
      basicDetails: {
        studentName: req.body.studentName,
        fatherName: req.body.fatherName,
        motherName: req.body.motherName,
        dob: req.body.dob,
        gender: req.body.gender,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        pinCode: req.body.pinCode,
        aadhaarNumber: req.body.aadhaarNumber
      },
      examDetails: {
        examName: req.body.examName,
        examType: req.body.examType,
        agencyName: req.body.agencyName,
        examYear: req.body.examYear
      },
      documents: {
        passport_photo: getPath('passport_photo'),
        marksheet_10th: getPath('marksheet_10th'),
        marksheet_12th: getPath('marksheet_12th'),
        marksheet_graduation: getPath('marksheet_graduation'),
        aadhaar_card: getPath('aadhaar_card')
      }
    };

    const newForm = new AdmissionForm(formData);
    await newForm.save();

    res.status(201).json({ message: 'Form submitted successfully', id: newForm._id });
  } catch (error) {
    console.error('Submission Error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: 'Validation Error', errors: messages });
    }

    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// GET: All Forms (Protected)
router.get('/', checkAuth, async (req, res) => {
  try {
    const forms = await AdmissionForm.find().sort({ submissionDate: -1 });
    res.json(forms);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching forms' });
  }
});

// GET: Single Form (Protected)
router.get('/:id', checkAuth, async (req, res) => {
  try {
    const form = await AdmissionForm.findById(req.params.id);
    if (!form) return res.status(404).json({ message: 'Form not found' });
    res.json(form);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching form details' });
  }
});

// PATCH: Update Status (Protected)
router.patch('/:id', checkAuth, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const form = await AdmissionForm.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true }
    );
    
    if (!form) return res.status(404).json({ message: 'Form not found' });
    res.json(form);
  } catch (error) {
    res.status(500).json({ message: 'Error updating status' });
  }
});

module.exports = router;