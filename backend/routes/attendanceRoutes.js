
const express = require('express');
const Attendance = require('../models/Attendance');
const User = require('../models/User');
const { protect, manager } = require('../middleware/authMiddleware');
const router = express.Router();

// --- Employee Routes ---

// @route POST /api/attendance/checkin
router.post('/checkin', protect, async (req, res) => {
  const userId = req.user._id;
  const today = new Date().toISOString().split('T')[0];

  try {
    const existing = await Attendance.findOne({ userId, date: today });
    if (existing) return res.status(400).json({ message: 'Already checked in today' });

    // Logic to determine status (e.g., late if after 9:30)
    const now = new Date();
    let status = 'Present';
    if (now.getHours() > 9 || (now.getHours() === 9 && now.getMinutes() > 30)) {
      status = 'Late';
    }

    const attendance = await Attendance.create({
      userId,
      date: today,
      checkInTime: now,
      status
    });

    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route POST /api/attendance/checkout
router.post('/checkout', protect, async (req, res) => {
  const userId = req.user._id;
  const today = new Date().toISOString().split('T')[0];

  try {
    const attendance = await Attendance.findOne({ userId, date: today });
    if (!attendance) return res.status(404).json({ message: 'No check-in record found today' });

    attendance.checkOutTime = new Date();
    
    // Calculate Total Hours
    const diff = attendance.checkOutTime - attendance.checkInTime;
    attendance.totalHours = (diff / (1000 * 60 * 60)).toFixed(2);

    await attendance.save();
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/attendance/my-history
router.get('/my-history', protect, async (req, res) => {
  try {
    const history = await Attendance.find({ userId: req.user._id }).sort({ date: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- Manager Routes ---

// @route GET /api/attendance/all
router.get('/all', protect, manager, async (req, res) => {
  try {
    const attendance = await Attendance.find({}).sort({ date: -1 });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route GET /api/attendance/users
router.get('/users', protect, manager, async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
