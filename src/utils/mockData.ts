
// Mock data for trains
export const trainsData = [
  {
    id: 1,
    trainNumber: 12952,
    name: "Delhi Rajdhani",
    source: "New Delhi",
    destination: "Mumbai Central",
    departureTime: "16:25",
    arrivalTime: "08:15",
    distance: 1377,
    duration: "15h 50m",
    classes: ["SL", "3A", "2A", "1A"],
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    fare: {
      SL: 755,
      "3A": 1955,
      "2A": 2855,
      "1A": 4755
    }
  },
  {
    id: 2,
    trainNumber: 12301,
    name: "Howrah Rajdhani",
    source: "New Delhi",
    destination: "Howrah",
    departureTime: "16:55",
    arrivalTime: "09:55",
    distance: 1451,
    duration: "17h 00m",
    classes: ["3A", "2A", "1A"],
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    fare: {
      "3A": 2055,
      "2A": 2995,
      "1A": 5155
    }
  },
  {
    id: 3,
    trainNumber: 12957,
    name: "Swarna Jayanti Express",
    source: "Mumbai Central",
    destination: "New Delhi",
    departureTime: "19:25",
    arrivalTime: "14:35",
    distance: 1377,
    duration: "19h 10m",
    classes: ["SL", "3A", "2A"],
    days: ["Mon", "Wed", "Fri"],
    fare: {
      SL: 665,
      "3A": 1755,
      "2A": 2555
    }
  },
  {
    id: 4,
    trainNumber: 12951,
    name: "Mumbai Rajdhani",
    source: "Mumbai Central",
    destination: "New Delhi",
    departureTime: "17:00",
    arrivalTime: "08:35",
    distance: 1377,
    duration: "15h 35m",
    classes: ["3A", "2A", "1A"],
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    fare: {
      "3A": 1955,
      "2A": 2855,
      "1A": 4755
    }
  },
  {
    id: 5,
    trainNumber: 22221,
    name: "Vande Bharat Express",
    source: "New Delhi",
    destination: "Varanasi",
    departureTime: "06:00",
    arrivalTime: "14:00",
    distance: 759,
    duration: "8h 00m",
    classes: ["CC", "EC"],
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    fare: {
      CC: 1755,
      EC: 3255
    }
  }
];

// Mock data for users
export const usersData = [
  {
    id: 1,
    name: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    phone: "+91 98765 43210",
    status: "active"
  },
  {
    id: 2,
    name: "Priya Singh",
    email: "priya.singh@example.com",
    phone: "+91 87654 32109",
    status: "active"
  },
  {
    id: 3,
    name: "Amit Patel",
    email: "amit.patel@example.com",
    phone: "+91 76543 21098",
    status: "inactive"
  },
  {
    id: 4,
    name: "Sneha Gupta",
    email: "sneha.gupta@example.com",
    phone: "+91 65432 10987",
    status: "blocked"
  },
  {
    id: 5,
    name: "Ravi Kumar",
    email: "ravi.kumar@example.com",
    phone: "+91 54321 09876",
    status: "active"
  }
];

// Mock data for bookings
export const bookingsData = [
  {
    id: 1,
    pnr: "PNR4567812",
    userId: 1,
    userName: "Rahul Sharma",
    trainId: 1,
    trainName: "Delhi Rajdhani",
    trainNumber: 12952,
    source: "New Delhi",
    destination: "Mumbai Central",
    journeyDate: "2023-09-15",
    departureTime: "16:25",
    arrivalTime: "08:15",
    classType: "3A",
    seats: ["B1-22", "B1-23"],
    totalFare: 3910,
    status: "confirmed",
    bookingDate: "2023-09-01",
    paymentStatus: "completed"
  },
  {
    id: 2,
    pnr: "PNR9876543",
    userId: 2,
    userName: "Priya Singh",
    trainId: 5,
    trainName: "Vande Bharat Express",
    trainNumber: 22221,
    source: "New Delhi",
    destination: "Varanasi",
    journeyDate: "2023-09-18",
    departureTime: "06:00",
    arrivalTime: "14:00",
    classType: "EC",
    seats: ["C5-12"],
    totalFare: 3255,
    status: "confirmed",
    bookingDate: "2023-09-05",
    paymentStatus: "completed"
  },
  {
    id: 3,
    pnr: "PNR2468013",
    userId: 1,
    userName: "Rahul Sharma",
    trainId: 2,
    trainName: "Howrah Rajdhani",
    trainNumber: 12301,
    source: "New Delhi",
    destination: "Howrah",
    journeyDate: "2023-10-05",
    departureTime: "16:55",
    arrivalTime: "09:55",
    classType: "2A",
    seats: ["A2-15", "A2-16"],
    totalFare: 5990,
    status: "waiting",
    bookingDate: "2023-09-10",
    paymentStatus: "completed"
  },
  {
    id: 4,
    pnr: "PNR1357924",
    userId: 3,
    userName: "Amit Patel",
    trainId: 4,
    trainName: "Mumbai Rajdhani",
    trainNumber: 12951,
    source: "Mumbai Central",
    destination: "New Delhi",
    journeyDate: "2023-09-12",
    departureTime: "17:00",
    arrivalTime: "08:35",
    classType: "1A",
    seats: ["H1-3"],
    totalFare: 4755,
    status: "cancelled",
    bookingDate: "2023-08-28",
    paymentStatus: "refunded"
  },
  {
    id: 5,
    pnr: "PNR3692581",
    userId: 5,
    userName: "Ravi Kumar",
    trainId: 3,
    trainName: "Swarna Jayanti Express",
    trainNumber: 12957,
    source: "Mumbai Central",
    destination: "New Delhi",
    journeyDate: "2023-09-22",
    departureTime: "19:25",
    arrivalTime: "14:35",
    classType: "SL",
    seats: ["S4-45", "S4-46", "S4-47"],
    totalFare: 1995,
    status: "confirmed",
    bookingDate: "2023-09-08",
    paymentStatus: "completed"
  }
];
