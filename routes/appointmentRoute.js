const express = require('express');
const router = express.Router();
const Appointment = require('../schema/appointmentSchema');
const appointmentEmail = require('../utils/appointmentRecivedTamplate')
const sendEmail = require('../utils/sendEmail');
module.exports = (io) => {
  // Create appointment
  router.post('/', async (req, res) => {
    const data = await Appointment.create(req.body);
    io.emit('new-appointment', data);
    const message = appointmentEmail(data);

  await sendEmail("care2curephysiotherapy71@gmail.com", 'New Appointment Booked', message);

    res.status(201).json(data);
  });

  // Get all appointments
  router.get('/', async (req, res) => {
    const all = await Appointment.find().sort({ createdAt: -1 });
    res.json(all);
  });

  // Update appointment status
  router.patch('/:id', async (req, res) => {
    const updated = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  });

  return router;
}
