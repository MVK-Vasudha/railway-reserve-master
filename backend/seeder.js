
const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// Load models
const Train = require('./models/Train');
const User = require('./models/User');

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Sample data
const trains = [
  {
    number: 'RR12345',
    name: 'Rajdhani Express',
    source: 'Delhi',
    destination: 'Mumbai',
    departureTime: '16:55',
    arrivalTime: '08:15',
    distance: 1384,
    duration: '15h 20m',
    days: ['Daily'],
    availableSeats: {
      sleeper: 120,
      ac3Tier: 90,
      ac2Tier: 60,
      acFirstClass: 24
    },
    fare: {
      sleeper: 755,
      ac3Tier: 1985,
      ac2Tier: 2890,
      acFirstClass: 4895
    }
  },
  {
    number: 'RR23456',
    name: 'Shatabdi Express',
    source: 'Bangalore',
    destination: 'Chennai',
    departureTime: '06:00',
    arrivalTime: '11:00',
    distance: 346,
    duration: '5h 00m',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    availableSeats: {
      sleeper: 0,
      ac3Tier: 78,
      ac2Tier: 60,
      acFirstClass: 28
    },
    fare: {
      sleeper: 0,
      ac3Tier: 870,
      ac2Tier: 1245,
      acFirstClass: 2190
    }
  },
  {
    number: 'RR34567',
    name: 'Duronto Express',
    source: 'Kolkata',
    destination: 'Delhi',
    departureTime: '20:05',
    arrivalTime: '11:35',
    distance: 1447,
    duration: '15h 30m',
    days: ['Tue', 'Thu', 'Sun'],
    availableSeats: {
      sleeper: 144,
      ac3Tier: 100,
      ac2Tier: 60,
      acFirstClass: 20
    },
    fare: {
      sleeper: 830,
      ac3Tier: 2190,
      ac2Tier: 3120,
      acFirstClass: 5260
    }
  }
];

// Create admin user
const users = [
  {
    name: 'Admin User',
    email: 'admin@railreserve.com',
    password: 'admin123',
    role: 'admin'
  }
];

// Import data
const importData = async () => {
  try {
    await Train.deleteMany();
    await User.deleteMany();
    
    await Train.insertMany(trains);
    
    // Create admin user
    for (let user of users) {
      await User.create(user);
    }
    
    console.log('Data Imported...');
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await Train.deleteMany();
    await User.deleteMany();
    
    console.log('Data Destroyed...');
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

// Check args and run appropriate function
if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
} else {
  console.log('Please add an argument: -i (import data) or -d (delete data)');
  process.exit();
}
