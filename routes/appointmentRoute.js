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
  router.get('/', apiKeyMiddleware, async (req, res) => {
    try {
      const { status, bookedOn, appointmentDate } = req.query;

      const filters = {};

      if (status) filters.status = status;
      if (bookedOn) {
        const date = formatDateOnly(bookedOn);
        filters.createdAt = {
          $gte: new Date(`${date}T00:00:00.000Z`),
          $lte: new Date(`${date}T23:59:59.999Z`)
        };
      }
      if (appointmentDate) {
        const date = formatDateOnly(appointmentDate);
        filters.preferredDate = {
          $gte: new Date(`${date}T00:00:00.000Z`),
          $lte: new Date(`${date}T23:59:59.999Z`)
        };
      }

      const all = await Appointment.find(filters).sort({ createdAt: -1 });
      res.json(all);
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
