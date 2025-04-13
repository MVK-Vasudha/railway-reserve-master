
const mongoose = require('mongoose');

const TrainSchema = new mongoose.Schema({
  number: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  source: {
    type: String,
    required: true,
    trim: true
  },
  destination: {
    type: String,
    required: true,
    trim: true
  },
  departureTime: {
    type: String,
    required: true
  },
  arrivalTime: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  distance: {
    type: Number,
    required: true
  },
  days: {
    type: [String],
    required: true,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Daily']
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
  },
  availableSeats: {
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
  },
  totalSeats: {
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
  },
  status: {
    type: String,
    enum: ['on-time', 'delayed', 'cancelled'],
    default: 'on-time'
  },
  delayMinutes: {
    type: Number,
    default: 0
  },
  statusReason: {
    type: String,
    default: ''
  }
});

module.exports = mongoose.model('Train', TrainSchema);
