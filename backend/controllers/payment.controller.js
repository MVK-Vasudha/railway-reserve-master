
const Payment = require('../models/Payment');
const Booking = require('../models/Booking');

// @desc    Create new payment
// @route   POST /api/payments
// @access  Private
exports.createPayment = async (req, res, next) => {
  try {
    // Verify booking exists
    const booking = await Booking.findById(req.body.bookingId);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `Booking not found with id of ${req.body.bookingId}`
      });
    }
    
    // Ensure user owns the booking or is admin
    if (booking.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: `User with ID ${req.user.id} is not authorized to make payment for this booking`
      });
    }
    
    // Add user ID to request body
    req.body.userId = req.user.id;
    
    // Create payment
    const payment = await Payment.create(req.body);
    
    // Update booking status if payment is successful
    if (payment.status === 'completed') {
      booking.status = 'confirmed';
      await booking.save();
    }
    
    res.status(201).json({
      success: true,
      data: payment
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all payments
// @route   GET /api/payments
// @access  Private/Admin
exports.getPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find()
      .populate({
        path: 'userId',
        select: 'name email'
      })
      .populate({
        path: 'bookingId',
        populate: {
          path: 'trainId',
          select: 'number name'
        }
      });
    
    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get current user's payments
// @route   GET /api/payments/my-payments
// @access  Private
exports.getUserPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find({ userId: req.user.id })
      .populate({
        path: 'bookingId',
        populate: {
          path: 'trainId',
          select: 'number name'
        }
      });
    
    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (err) {
    next(err);
  }
};
