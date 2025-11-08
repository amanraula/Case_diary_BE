const express = require('express');
const router = express.Router();
const Schedule = require('../models/schedule.model');
const {protect} = require('../middleware/auth.middleware'); // if you have token auth

// 🟢 Create new event
router.post('/', protect, async (req, res) => {
  try {
    const { title, date, privacy } = req.body;
    const schedule = await Schedule.create({
      officerId: req.officer._id,
      title,
      date,
      privacy: privacy || 'private',
    });
    res.status(201).json({ message: 'Event created', schedule });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create schedule', error: err.message });
  }
});

// 🟢 Get officer’s events
router.get('/', protect, async (req, res) => {
  try {
    const schedules = await Schedule.find({ officerId: req.officer._id });
    res.json({ data: schedules });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch schedules' });
  }
});

// 🟢 Delete event
router.delete('/:id', protect, async (req, res) => {
  try {
    await Schedule.findOneAndDelete({ _id: req.params.id, officerId: req.officer._id });
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete schedule' });
  }
});

module.exports = router;
