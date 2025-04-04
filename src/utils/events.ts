
// Simple event system to communicate between components

/**
 * Trigger a payment event to update transaction history
 */
export const triggerPaymentUpdate = () => {
  window.dispatchEvent(new CustomEvent("payment_completed"));
};

/**
 * Trigger a booking update event to refresh bookings list
 */
export const triggerBookingUpdate = () => {
  window.dispatchEvent(new CustomEvent("booking_updated"));
};

/**
 * Trigger a train update event to refresh train lists
 */
export const triggerTrainUpdate = () => {
  window.dispatchEvent(new CustomEvent("train_updated"));
};

/**
 * Helper to simulate a successful payment and update relevant components
 */
export const simulateSuccessfulPayment = (bookingDetails?: any) => {
  // Store booking in localStorage if provided
  if (bookingDetails) {
    const existingBookings = JSON.parse(localStorage.getItem("userBookings") || "[]");
    existingBookings.push({
      ...bookingDetails,
      id: `book${Date.now()}`,
      pnr: `PNR${Math.floor(1000000 + Math.random() * 9000000)}`,
      status: "confirmed"
    });
    localStorage.setItem("userBookings", JSON.stringify(existingBookings));
  }
  
  // Trigger events to update UI components
  triggerPaymentUpdate();
  triggerBookingUpdate();
};

/**
 * Get user bookings from localStorage
 */
export const getUserBookings = () => {
  return JSON.parse(localStorage.getItem("userBookings") || "[]");
};

/**
 * Check if user is admin
 */
export const isAdminUser = () => {
  return localStorage.getItem("userRole") === "admin";
};

/**
 * Set user as admin
 */
export const setAdminUser = () => {
  localStorage.setItem("userRole", "admin");
};

/**
 * Login as admin helper function
 */
export const adminLogin = (email: string, password: string): boolean => {
  // In a real app, this would validate against a backend
  // Using hardcoded admin credentials for demo purposes
  if (email === "admin@railreserve.com" && password === "admin123") {
    localStorage.setItem("userLoggedIn", "true");
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userName", "Admin User");
    setAdminUser();
    return true;
  }
  return false;
};

/**
 * Add a new train to the system
 */
export const addNewTrain = (trainData: any) => {
  // Get trains from localStorage or trainData.ts if not yet in localStorage
  let trains = JSON.parse(localStorage.getItem("availableTrains") || "null");
  
  if (!trains) {
    // Import from trainData if no trains in localStorage yet
    const { availableTrains } = require("./trainData");
    trains = availableTrains;
  }
  
  // Add new train with unique ID
  const newTrain = {
    ...trainData,
    id: `train-${Date.now()}`
  };
  
  trains.push(newTrain);
  
  // Save back to localStorage
  localStorage.setItem("availableTrains", JSON.stringify(trains));
  
  // Trigger train update event
  triggerTrainUpdate();
  
  return newTrain;
};

/**
 * Get all trains from localStorage or default data
 */
export const getAllTrains = () => {
  let trains = JSON.parse(localStorage.getItem("availableTrains") || "null");
  
  if (!trains) {
    // Import from trainData if no trains in localStorage yet
    const { availableTrains } = require("./trainData");
    trains = availableTrains;
    // Initialize localStorage with default trains
    localStorage.setItem("availableTrains", JSON.stringify(availableTrains));
  }
  
  return trains;
};

/**
 * Update PNR status
 */
export const updatePnrStatus = (pnr: string, newStatus: string) => {
  const bookings = JSON.parse(localStorage.getItem("userBookings") || "[]");
  const updatedBookings = bookings.map((booking: any) => {
    if (booking.pnr === pnr) {
      return { ...booking, status: newStatus };
    }
    return booking;
  });
  
  localStorage.setItem("userBookings", JSON.stringify(updatedBookings));
  triggerBookingUpdate();
};

