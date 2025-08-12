const express = require('express');
const router = express.Router();
const Appointment = require('../schema/appointmentSchema');
const appointmentEmail = require('../utils/appointmentRecivedTamplate');
const sendEmail = require('../utils/sendEmail');
const authMiddleware = require('../utils/authMiddleware')
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
      io.emit('new appointment booked', appointment);
      const message = appointmentEmail(appointment);
      await sendEmail('krsubam4u@gmail.com', 'New Appointment Booked', message);
      res.status(201).json(appointment);
    } catch (error) {
      console.error('💥 Appointment Booking Error:', error);
      res.status(500).json({ message: 'Failed to book appointment' });
    }
  });

  router.get('/', authMiddleware, async (req, res) => {
    try {
      const { search, status, bookedOn, appointmentDate, sort, order } = req.query;

      const filters = {};

      // Filter by status
      if (status) filters.status = status;

      if (search) {
        const regex = new RegExp(search, 'i'); // case-insensitive
        filters.$or = [
          { name: regex },
          { email: regex },
          { phone: regex }
        ];
      }

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
      const sortField = (sort === 'bookingDate' || sort === 'appointmentDate')
      ? (sort === 'bookingDate' ? 'createdAt' : 'preferredDate')
      : 'createdAt';
    
    const sortOrder = order === 'asc' ? 1 : -1; 
    
      const appointments = await Appointment.find(filters).sort({ [sortField]: sortOrder });

      res.json(appointments);
    } catch (err) {
      console.error('❌ Failed to fetch appointments:', err);
      res.status(500).json({ message: 'Failed to load appointments' });
    }
  });


  router.patch('/:id', authMiddleware, async (req, res) => {
    try {
      const updatedStatus = await Appointment.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.json(updatedStatus);
    } catch (err) {
      console.error('Error updating enquiry:', err);
      res.status(500).json({ message: 'Error updating enquiry' });
    }
  });

  router.delete('/:id', authMiddleware, async (req, res) => {
    try {
      const deleted = await Appointment.findByIdAndDelete(req.params.id);
      res.json(deleted);
    } catch (err) {
      console.error('Error deleting appointment:', err);
      res.status(500).json({ message: 'Error deleting appointment' });
    }
  })
  return router;
};
