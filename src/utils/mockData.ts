
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Train {
  id: string;
  name: string;
  number: string;
  source: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  distance: number;
  duration: string;
  availableSeats: {
    sleeper: number;
    ac3Tier: number;
    ac2Tier: number;
    acFirstClass: number;
  };
  fare: {
    sleeper: number;
    ac3Tier: number;
    ac2Tier: number;
    acFirstClass: number;
  };
  days: string[];
}

export interface Booking {
  id: string;
  pnr: string;
  userId: string;
  trainId: string;
  passengers: Passenger[];
  journeyDate: string;
  bookingDate: string;
  status: 'confirmed' | 'cancelled' | 'waiting';
  seatType: 'sleeper' | 'ac3Tier' | 'ac2Tier' | 'acFirstClass';
  totalFare: number;
}

export interface Passenger {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  seatNumber?: string;
}

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user',
  },
  {
    id: '2',
    name: 'Admin User',
    email: 'admin@railways.com',
    role: 'admin',
  },
];

// Mock Trains
export const mockTrains: Train[] = [
  {
    id: '1',
    name: 'Rajdhani Express',
    number: 'RJ-12345',
    source: 'Delhi',
    destination: 'Mumbai',
    departureTime: '16:35',
    arrivalTime: '08:15',
    distance: 1384,
    duration: '15h 40m',
    availableSeats: {
      sleeper: 120,
      ac3Tier: 85,
      ac2Tier: 48,
      acFirstClass: 20,
    },
    fare: {
      sleeper: 755,
      ac3Tier: 1990,
      ac2Tier: 2890,
      acFirstClass: 4950,
    },
    days: ['Mon', 'Wed', 'Fri', 'Sun'],
  },
  {
    id: '2',
    name: 'Shatabdi Express',
    number: 'ST-22567',
    source: 'Bangalore',
    destination: 'Chennai',
    departureTime: '06:00',
    arrivalTime: '11:00',
    distance: 346,
    duration: '5h 00m',
    availableSeats: {
      sleeper: 0,
      ac3Tier: 0,
      ac2Tier: 65,
      acFirstClass: 35,
    },
    fare: {
      sleeper: 0,
      ac3Tier: 0,
      ac2Tier: 1245,
      acFirstClass: 2150,
    },
    days: ['Daily'],
  },
  {
    id: '3',
    name: 'Duronto Express',
    number: 'DE-12342',
    source: 'Kolkata',
    destination: 'Delhi',
    departureTime: '20:10',
    arrivalTime: '13:25',
    distance: 1515,
    duration: '17h 15m',
    availableSeats: {
      sleeper: 150,
      ac3Tier: 100,
      ac2Tier: 60,
      acFirstClass: 24,
    },
    fare: {
      sleeper: 890,
      ac3Tier: 2320,
      ac2Tier: 3260,
      acFirstClass: 5675,
    },
    days: ['Tue', 'Thu', 'Sat'],
  },
  {
    id: '4',
    name: 'Vande Bharat Express',
    number: 'VB-18001',
    source: 'Mumbai',
    destination: 'Ahmedabad',
    departureTime: '07:45',
    arrivalTime: '13:55',
    distance: 493,
    duration: '6h 10m',
    availableSeats: {
      sleeper: 0,
      ac3Tier: 0,
      ac2Tier: 125,
      acFirstClass: 73,
    },
    fare: {
      sleeper: 0,
      ac3Tier: 0,
      ac2Tier: 1950,
      acFirstClass: 3575,
    },
    days: ['Daily'],
  },
  {
    id: '5',
    name: 'Garib Rath Express',
    number: 'GR-12952',
    source: 'Delhi',
    destination: 'Bangalore',
    departureTime: '15:35',
    arrivalTime: '06:40',
    distance: 2176,
    duration: '39h 05m',
    availableSeats: {
      sleeper: 180,
      ac3Tier: 120,
      ac2Tier: 0,
      acFirstClass: 0,
    },
    fare: {
      sleeper: 1100,
      ac3Tier: 2600,
      ac2Tier: 0,
      acFirstClass: 0,
    },
    days: ['Mon', 'Wed', 'Sat'],
  },
];

// Mock Bookings
export const mockBookings: Booking[] = [
  {
    id: '1',
    pnr: 'PNR1234567890',
    userId: '1',
    trainId: '1',
    passengers: [
      {
        name: 'John Doe',
        age: 35,
        gender: 'male',
        seatNumber: 'S5-34',
      },
      {
        name: 'Jane Doe',
        age: 32,
        gender: 'female',
        seatNumber: 'S5-35',
      },
    ],
    journeyDate: '2023-12-15',
    bookingDate: '2023-11-30',
    status: 'confirmed',
    seatType: 'sleeper',
    totalFare: 1510,
  },
  {
    id: '2',
    pnr: 'PNR9876543210',
    userId: '1',
    trainId: '3',
    passengers: [
      {
        name: 'John Doe',
        age: 35,
        gender: 'male',
        seatNumber: 'B1-12',
      },
    ],
    journeyDate: '2023-12-24',
    bookingDate: '2023-12-01',
    status: 'confirmed',
    seatType: 'ac2Tier',
    totalFare: 3260,
  },
];

// List of stations
export const stations = [
  'Ahmedabad',
  'Bangalore',
  'Chennai',
  'Delhi',
  'Hyderabad',
  'Jaipur',
  'Kolkata',
  'Lucknow',
  'Mumbai',
  'Pune',
];

// Helper function to format price to INR
export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
};

// Get user by ID
export const getUserById = (id: string): User | undefined => {
  return mockUsers.find(user => user.id === id);
};

// Get train by ID
export const getTrainById = (id: string): Train | undefined => {
  return mockTrains.find(train => train.id === id);
};

// Get booking by ID
export const getBookingById = (id: string): Booking | undefined => {
  return mockBookings.find(booking => booking.id === id);
};

// Get booking by PNR
export const getBookingByPNR = (pnr: string): Booking | undefined => {
  return mockBookings.find(booking => booking.pnr === pnr);
};

// Get bookings by user ID
export const getBookingsByUserId = (userId: string): Booking[] => {
  return mockBookings.filter(booking => booking.userId === userId);
};
