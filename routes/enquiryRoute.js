const express = require('express');
const router = express.Router();
const Enquiry = require('../schema/enquirySchema');
const enquiryEmail = require('../utils/enquiryRecivedTamplate');
const sendEmail = require('../utils/sendEmail');
const apiKeyMiddleware = require('../utils/apiKeyMiddleware');

module.exports = (io) => {
  // Create a new enquiry
  router.post('/', async (req, res) => {
    try {
      const data = await Enquiry.create(req.body);
      io.emit('new Enquiry received', data);

      const message = enquiryEmail(data);
    //   await sendEmail("krsubam4u@gmail.com", "New Enquiry Received", message);

      res.status(201).json({ message: 'Enquiry created successfully' });
    } catch (err) {
      console.error('Error creating enquiry:', err);
      res.status(500).json({ message: 'Error creating enquiry' });
    }
  });

  // Get all enquiries with filters (status + sort)
  router.get('/', apiKeyMiddleware, async (req, res) => {
    try {
      const { sort = 'newest', status } = req.query;

      const filters = {};
      if (status) {
        filters.status = status;
      }

      const sortOrder = sort === 'oldest' ? 1 : -1;

      const enquiries = await Enquiry.find(filters).sort({ createdAt: sortOrder });
      res.json(enquiries);
    } catch (err) {
      console.error('Error fetching enquiries:', err);
      res.status(500).json({ message: 'Error fetching enquiries' });
    }
  });

  // Update enquiry status (e.g., mark as Completed)
  router.patch('/:id', async (req, res) => {
    try {
      const updatedStatus = await Enquiry.findByIdAndUpdate(
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

  return router;
};
