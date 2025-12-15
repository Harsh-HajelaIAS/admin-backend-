const mongoose = require('mongoose');

const admissionFormSchema = new mongoose.Schema({
  basicDetails: {
    studentName: { type: String, required: true },
    fatherName: { type: String, required: true },
    motherName: { type: String, required: true },
    dob: { type: String, required: true },
    gender: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pinCode: { type: String, required: true },
    aadhaarNumber: String
  },
  examDetails: {
    examName: String,
    examType: { type: String, required: true },
    agencyName: String,
    examYear: String,
    postServiceName: String,
    percentage: String,
    performanceRank: String,
    previousSelections: String
  },
  documents: {
    passport_photo: String,
    marksheet_10th: String,
    marksheet_12th: String,
    marksheet_graduation: String,
    aadhaar_card: String
  },
  office: {
    registrationNo: String,
    studentId: String,
    batchTime: String,
    batchNumber: String
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  submissionDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('AdmissionForm', admissionFormSchema);