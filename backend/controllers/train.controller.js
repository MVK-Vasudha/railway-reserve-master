const Train = require('../models/Train');
const Booking = require('../models/Booking');
const User = require('../models/User');
const emailService = require('../utils/emailService');

// @desc    Get all trains
// @route   GET /api/trains
// @access  Public
exports.getTrains = async (req, res, next) => {
  try {
    const trains = await Train.find();
    
    res.status(200).json({
      success: true,
      count: trains.length,
      data: trains
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single train
// @route   GET /api/trains/:id
// @access  Public
exports.getTrain = async (req, res, next) => {
  try {
    const train = await Train.findById(req.params.id);
    
    if (!train) {
      return res.status(404).json({
        success: false,
        message: `Train not found with id of ${req.params.id}`
      });
    }
    
    res.status(200).json({
      success: true,
      data: train
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new train
// @route   POST /api/trains
// @access  Private/Admin
exports.createTrain = async (req, res, next) => {
  try {
    const train = await Train.create(req.body);
    
    res.status(201).json({
      success: true,
      data: train
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update train
// @route   PUT /api/trains/:id
// @access  Private/Admin
exports.updateTrain = async (req, res, next) => {
  try {
    let train = await Train.findById(req.params.id);
    
    if (!train) {
      return res.status(404).json({
        success: false,
        message: `Train not found with id of ${req.params.id}`
      });
    }
    
    train = await Train.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: train
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete train
// @route   DELETE /api/trains/:id
// @access  Private/Admin
exports.deleteTrain = async (req, res, next) => {
  try {
    const train = await Train.findById(req.params.id);
    
    if (!train) {
      return res.status(404).json({
        success: false,
        message: `Train not found with id of ${req.params.id}`
      });
    }
    
    await train.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Search trains
// @route   GET /api/trains/search
// @access  Public
exports.searchTrains = async (req, res, next) => {
  try {
    const { source, destination, date } = req.query;
    
    if (!source || !destination || !date) {
      return res.status(400).json({
        success: false,
        message: 'Please provide source, destination and date'
      });
    }
    
    // Search for trains matching source and destination
    const trains = await Train.find({
      source: source,
      destination: destination
    });
    
    if (trains.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No trains found for this route'
      });
    }
    
    // Convert date string to day of week
    const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
    
    // Filter trains that run on this day of week or are daily
    const availableTrains = trains.filter(train => 
      train.days.includes(dayOfWeek) || train.days.includes('Daily')
    );
    
    res.status(200).json({
      success: true,
      count: availableTrains.length,
      data: availableTrains
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update train status (delays, cancellations)
// @route   POST /api/trains/:id/update-status
// @access  Private/Admin
exports.updateTrainStatus = async (req, res, next) => {
  try {
    const { status, delayMinutes, reason } = req.body;
    
    if (!status || !['on-time', 'delayed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid status (on-time, delayed, cancelled)'
      });
    }
    
    const train = await Train.findById(req.params.id);
    
    if (!train) {
      return res.status(404).json({
        success: false,
        message: `Train not found with id of ${req.params.id}`
      });
    }
    
    // Update train status
    train.status = status;
    if (status === 'delayed' && delayMinutes) {
      train.delayMinutes = delayMinutes;
    }
    if (reason) {
      train.statusReason = reason;
    }
    
    await train.save();
    
    // If train is delayed or cancelled, notify passengers
    if (status === 'delayed' || status === 'cancelled') {
      // Find all active bookings for this train
      const bookings = await Booking.find({
        trainId: req.params.id,
        status: 'confirmed'
      }).populate({
        path: 'userId',
        select: 'email name'
      });
      
      // Send notifications
      let emailsSent = 0;
      for (const booking of bookings) {
        if (booking.userId && booking.userId.email) {
          if (status === 'delayed') {
            await emailService.sendDelayNotification(
              booking,
              booking.userId,
              train,
              delayMinutes || 0
            );
          } else if (status === 'cancelled') {
            // You could create a train cancellation email service method here
            // For now, we'll use the delay notification
            await emailService.sendDelayNotification(
              booking,
              booking.userId,
              train,
              9999 // Use a high number to indicate cancellation
            );
          }
          emailsSent++;
        }
      }
      
      return res.status(200).json({
        success: true,
        data: train,
        message: `Train status updated and ${emailsSent} passengers notified`
      });
    }
    
    res.status(200).json({
      success: true,
      data: train
    });
  } catch (err) {
    next(err);
  }
};
