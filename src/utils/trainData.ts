
// Mock data for available trains
export const availableTrains = [
  {
    id: "train-101",
    name: "Shatabdi Express",
    number: "12001",
    departureTime: "06:00",
    arrivalTime: "12:30",
    duration: "6h 30m",
    source: "New Delhi",
    destination: "Jaipur",
    distance: "268",
    coaches: {
      sleeper: { available: 32, fare: 750 },
      ac3Tier: { available: 24, fare: 1200 },
      ac2Tier: { available: 16, fare: 1800 },
      acFirstClass: { available: 8, fare: 3200 }
    },
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  },
  {
    id: "train-102",
    name: "Rajdhani Express",
    number: "12002",
    departureTime: "16:55",
    arrivalTime: "22:30",
    duration: "5h 35m",
    source: "New Delhi",
    destination: "Jaipur",
    distance: "268",
    coaches: {
      sleeper: { available: 0, fare: 800 },
      ac3Tier: { available: 12, fare: 1400 },
      ac2Tier: { available: 8, fare: 2000 },
      acFirstClass: { available: 4, fare: 3500 }
    },
    days: ["Mon", "Wed", "Fri", "Sun"]
  },
  {
    id: "train-103",
    name: "Duronto Express",
    number: "12003",
    departureTime: "22:15",
    arrivalTime: "05:00",
    duration: "6h 45m",
    source: "New Delhi",
    destination: "Jaipur",
    distance: "268",
    coaches: {
      sleeper: { available: 45, fare: 700 },
      ac3Tier: { available: 35, fare: 1100 },
      ac2Tier: { available: 20, fare: 1700 },
      acFirstClass: { available: 10, fare: 3000 }
    },
    days: ["Tue", "Thu", "Sat"]
  },
];
