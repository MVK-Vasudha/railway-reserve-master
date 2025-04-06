
const express = require('express');
const router = express.Router();
const { 
  getDashboardStats,
  getUsersList,
  getBookingsList
} = require('../controllers/admin.controller');
const { protect, authorize } = require('../middleware/auth');

// All admin routes are protected and restricted to admin role
router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/users', getUsersList);
router.get('/bookings', getBookingsList);

module.exports = router;
