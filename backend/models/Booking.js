
const mongoose = require('mongoose');

const PassengerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female', 'Other']
  }
});

const BookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  trainId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Train',
    required: true
  },
  pnr: {
    type: String,
    required: true,
    unique: true
  },
  passengers: [PassengerSchema],
  seatClass: {
    type: String,
    required: true,
    enum: ['sleeper', 'ac3Tier', 'ac2Tier', 'acFirstClass']
  },
  journeyDate: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['confirmed', 'waitlisted', 'cancelled'],
    default: 'confirmed'
  },
  totalFare: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Generate PNR before saving
BookingSchema.pre('save', async function(next) {
  if (!this.pnr) {
    // Generate a random PNR
    this.pnr = 'PNR' + Math.floor(1000000 + Math.random() * 9000000);
  }
  next();
});

module.exports = mongoose.model('Booking', BookingSchema);
