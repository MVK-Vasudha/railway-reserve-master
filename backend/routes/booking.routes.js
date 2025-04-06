
const express = require('express');
const router = express.Router();
const { 
  getBookings, 
  getBooking, 
  createBooking, 
  updateBooking, 
  deleteBooking,
  getUserBookings
} = require('../controllers/booking.controller');
const { protect, authorize } = require('../middleware/auth');

router.use(protect); // All booking routes need authentication

router.route('/')
  .get(authorize('admin'), getBookings)
  .post(createBooking);

router.get('/my-bookings', getUserBookings);

router.route('/:id')
  .get(getBooking)
  .put(updateBooking)
  .delete(deleteBooking);

module.exports = router;
