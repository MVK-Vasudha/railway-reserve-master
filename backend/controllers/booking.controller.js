
const Booking = require('../models/Booking');
const Train = require('../models/Train');

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private/Admin
exports.getBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate({
        path: 'userId',
        select: 'name email'
      })
      .populate('trainId');
    
    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
exports.getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate({
        path: 'userId',
        select: 'name email'
      })
      .populate('trainId');
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `Booking not found with id of ${req.params.id}`
      });
    }
    
    // Make sure user is booking owner or admin
    if (booking.userId._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: `User with ID ${req.user.id} is not authorized to view this booking`
      });
    }
    
    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res, next) => {
  try {
    // Add user ID to request body
    req.body.userId = req.user.id;
    
    // Verify train exists and has available seats
    const train = await Train.findById(req.body.trainId);
    
    if (!train) {
      return res.status(404).json({
        success: false,
        message: `Train not found with id of ${req.body.trainId}`
      });
    }
    
    // Check if there are enough seats available
    const seatClass = req.body.seatClass;
    const numPassengers = req.body.passengers.length;
    
    if (train.availableSeats[seatClass] < numPassengers) {
      return res.status(400).json({
        success: false,
        message: `Not enough ${seatClass} seats available. Only ${train.availableSeats[seatClass]} seats left`
      });
    }
    
    const booking = await Booking.create(req.body);
    
    // Update available seats in train
    train.availableSeats[seatClass] -= numPassengers;
    await train.save();
    
    res.status(201).json({
      success: true,
      data: booking
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update booking
// @route   PUT /api/bookings/:id
// @access  Private
exports.updateBooking = async (req, res, next) => {
  try {
    let booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `Booking not found with id of ${req.params.id}`
      });
    }
    
    // Make sure user is booking owner or admin
    if (booking.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: `User with ID ${req.user.id} is not authorized to update this booking`
      });
    }
    
    // If status is changing to cancelled, update available seats
    if (req.body.status === 'cancelled' && booking.status !== 'cancelled') {
      const train = await Train.findById(booking.trainId);
      
      if (train) {
        // Add seats back to availability
        train.availableSeats[booking.seatClass] += booking.passengers.length;
        await train.save();
      }
    }
    
    booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
// @access  Private
exports.deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `Booking not found with id of ${req.params.id}`
      });
    }
    
    // Make sure user is booking owner or admin
    if (booking.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: `User with ID ${req.user.id} is not authorized to delete this booking`
      });
    }
    
    // If booking is not cancelled, update available seats
    if (booking.status !== 'cancelled') {
      const train = await Train.findById(booking.trainId);
      
      if (train) {
        // Add seats back to availability
        train.availableSeats[booking.seatClass] += booking.passengers.length;
        await train.save();
      }
    }
    
    await booking.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get current user's bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
exports.getUserBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate('trainId');
    
    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (err) {
    next(err);
  }
};
