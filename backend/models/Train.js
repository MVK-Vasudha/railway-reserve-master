
const mongoose = require('mongoose');

const TrainSchema = new mongoose.Schema({
  number: {
    type: String,
    required: [true, 'Please add a train number'],
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: [true, 'Please add a train name'],
    trim: true
  },
  source: {
    type: String,
    required: [true, 'Please add a source station']
  },
  destination: {
    type: String,
    required: [true, 'Please add a destination station']
  },
  departureTime: {
    type: String,
    required: [true, 'Please add departure time']
  },
  arrivalTime: {
    type: String,
    required: [true, 'Please add arrival time']
  },
  distance: {
    type: Number,
    required: [true, 'Please add distance in km']
  },
  duration: {
    type: String,
    required: [true, 'Please add journey duration']
  },
  days: {
    type: [String],
    required: [true, 'Please specify running days']
  },
  availableSeats: {
    sleeper: {
      type: Number,
      default: 100
    },
    ac3Tier: {
      type: Number,
      default: 80
    },
    ac2Tier: {
      type: Number,
      default: 50
    },
    acFirstClass: {
      type: Number,
      default: 20
    }
  },
  fare: {
    sleeper: {
      type: Number,
      required: true
    },
    ac3Tier: {
      type: Number,
      required: true
    },
    ac2Tier: {
      type: Number,
      required: true
    },
    acFirstClass: {
      type: Number,
      required: true
    }
  }
});

module.exports = mongoose.model('Train', TrainSchema);
