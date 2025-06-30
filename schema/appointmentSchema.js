const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    match: /^[6-9]\d{9}$/
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    match: /.+\@.+\..+/
  },
  address: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  preferredDate: {
    type: Date,
    required: true
  },
  preferredTime: {
    type: String,
    required: true,
    enum: [
      '9:00AM - 10:00AM',
      '10:00AM - 11:00AM',
      '11:00AM - 12:00PM',
      '12:00PM - 1:00PM',
      '1:00PM - 2:00PM',
      '2:00PM - 3:00PM',
      '3:00PM - 4:00PM',
      '4:00PM - 5:00PM',
      '5:00PM - 6:00PM',
      '6:00PM - 7:00PM'
    ]
  },
  selectedServices: {
    type: String,
    required: true,
    enum: [
      'Manual Therapy',
      'Dry Needling',
      'IASTM',
      'Taping',
      'Electrotherapy',
      'Exercise Therapy',
      'Home Visit',
      'Posture Correction',
      'Pediatric Therapy',
      'Geriatric Therapy',
      'Sports Rehab',
      'Others'
    ]
  },
  message: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Appointment', appointmentSchema);
