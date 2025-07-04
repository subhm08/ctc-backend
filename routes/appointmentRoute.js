// routes/appointments.routes.js

const express = require('express');
const router = express.Router();
const Appointment = require('../schema/appointmentSchema');
const appointmentEmail = require('../utils/appointmentRecivedTamplate');
const sendEmail = require('../utils/sendEmail');
const apiKeyMiddleware = require('../utils/apiKeyMiddleware');

// Utils
const formatDateOnly = (date) =>
  new Date(date).toISOString().split('T')[0];

module.exports = (io) => {
  // Create appointment
  router.post('/', async (req, res) => {
    try {
      const { name, phone, email, address, gender, preferredDate, preferredTime, selectedServices } = req.body;

      if (!name || !phone || !email || !address || !gender || !preferredDate || !preferredTime || !selectedServices) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const appointment = await Appointment.create(req.body);

      io.emit('new-appointment', appointment); // Emit event to all connected clients

      const message = appointmentEmail(appointment);
      await sendEmail('krsubam4u@gmail.com', 'New Appointment Booked', message);

      res.status(201).json(appointment);
    } catch (error) {
      console.error('💥 Appointment Booking Error:', error);
      res.status(500).json({ message: 'Failed to book appointment' });
    }
  });

  // Get all appointments with filtering
  // routes/appointments.routes.js
router.get('/', apiKeyMiddleware, async (req, res) => {
  try {
    const { status, bookedOn, appointmentDate, sort, order } = req.query;

    const filters = {};

    // Filter by status
    if (status) filters.status = status;

    // Filter by booking date (createdAt)
    if (bookedOn) {
      const date = new Date(bookedOn);
      filters.createdAt = {
        $gte: new Date(date.setHours(0, 0, 0, 0)),
        $lte: new Date(date.setHours(23, 59, 59, 999))
      };
    }

    // Filter by preferred appointment date
    if (appointmentDate) {
      const date = new Date(appointmentDate);
      filters.preferredDate = {
        $gte: new Date(date.setHours(0, 0, 0, 0)),
        $lte: new Date(date.setHours(23, 59, 59, 999))
      };
    }

    // Dynamic sorting
    const sortField = sort === 'bookingDate' ? 'createdAt' : sort === 'appointmentDate' ? 'preferredDate' : 'createdAt';
    const sortOrder = order === 'asc' ? 1 : -1;

    const appointments = await Appointment.find(filters).sort({ [sortField]: sortOrder });

    res.json(appointments);
  } catch (err) {
    console.error('❌ Failed to fetch appointments:', err);
    res.status(500).json({ message: 'Failed to load appointments' });
  }
});


  // Update appointment status
  router.patch('/:id', apiKeyMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ message: 'Status field is required' });
      }

      const updated = await Appointment.findByIdAndUpdate(id, { status }, { new: true });

      if (!updated) {
        return res.status(404).json({ message: 'Appointment not found' });
      }

      res.json(updated);
    } catch (err) {
      console.error('❌ Error updating appointment:', err);
      res.status(500).json({ message: 'Failed to update appointment' });
    }
  });

  return router;
};
