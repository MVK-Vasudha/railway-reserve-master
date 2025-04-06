
const User = require('../models/User');
const Booking = require('../models/Booking');
const Train = require('../models/Train');
const Payment = require('../models/Payment');

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
exports.getDashboardStats = async (req, res, next) => {
  try {
    // Get total counts
    const userCount = await User.countDocuments();
    const trainCount = await Train.countDocuments();
    const bookingCount = await Booking.countDocuments();
    
    // Get revenue stats
    const payments = await Payment.find({ status: 'completed' });
    const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);
    
    // Get recent bookings
    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate({
        path: 'userId',
        select: 'name email'
      })
      .populate('trainId');
    
    res.status(200).json({
      success: true,
      data: {
        userCount,
        trainCount,
        bookingCount,
        totalRevenue,
        recentBookings
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get users list
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getUsersList = async (req, res, next) => {
  try {
    const users = await User.find()
      .select('-password');
    
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get bookings with details
// @route   GET /api/admin/bookings
// @access  Private/Admin
exports.getBookingsList = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate({
        path: 'userId',
        select: 'name email'
      })
      .populate('trainId')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (err) {
    next(err);
  }
};
