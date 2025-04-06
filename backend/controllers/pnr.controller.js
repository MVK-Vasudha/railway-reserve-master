
const Booking = require('../models/Booking');

// @desc    Get PNR status
// @route   GET /api/pnr/:pnr
// @access  Public
exports.getPnrStatus = async (req, res, next) => {
  try {
    const booking = await Booking.findOne({ pnr: req.params.pnr })
      .populate('trainId');
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `Booking not found with PNR ${req.params.pnr}`
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        pnr: booking.pnr,
        status: booking.status,
        trainNumber: booking.trainId.number,
        trainName: booking.trainId.name,
        source: booking.trainId.source,
        destination: booking.trainId.destination,
        journeyDate: booking.journeyDate,
        departureTime: booking.trainId.departureTime,
        arrivalTime: booking.trainId.arrivalTime,
        passengerCount: booking.passengers.length,
        seatClass: booking.seatClass,
        totalFare: booking.totalFare,
        bookingDate: booking.createdAt
      }
    });
  } catch (err) {
    next(err);
  }
};
