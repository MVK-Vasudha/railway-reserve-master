
// Simple event system to communicate between components
import { availableTrains as defaultTrains } from "./trainData";

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
    
    // Generate PNR if not already present
    if (!bookingDetails.pnr) {
      bookingDetails.pnr = `PNR${Math.floor(1000000 + Math.random() * 9000000)}`;
    }
    
    // Add unique ID if not present
    if (!bookingDetails.id) {
      bookingDetails.id = `book${Date.now()}`;
    }
    
    // Set booking status if not specified
    if (!bookingDetails.status) {
      bookingDetails.status = "confirmed";
    }
    
    // Add journey date if necessary
    if (!bookingDetails.journeyDate && bookingDetails.date) {
      bookingDetails.journeyDate = bookingDetails.date;
    }
    
    // Ensure we store seatClass and seatType consistently
    if (bookingDetails.class && !bookingDetails.seatClass) {
      bookingDetails.seatClass = bookingDetails.class;
    }
    
    if (bookingDetails.seatClass && !bookingDetails.seatType) {
      bookingDetails.seatType = bookingDetails.seatClass;
    }
    
    // Ensure train information is complete
    if (bookingDetails.trainId && bookingDetails.train) {
      // Make sure the train object has its id set
      if (!bookingDetails.train.id) {
        bookingDetails.train.id = bookingDetails.trainId;
      }
    } else if (bookingDetails.train && !bookingDetails.trainId) {
      bookingDetails.trainId = bookingDetails.train.id;
    }
    
    // Clean up any duplicate booking with same PNR
    const filteredBookings = existingBookings.filter((booking: any) => 
      booking.pnr !== bookingDetails.pnr
    );
    
    // Add timestamp for sorting
    bookingDetails.timestamp = Date.now();
    
    filteredBookings.push(bookingDetails);
    localStorage.setItem("userBookings", JSON.stringify(filteredBookings));
    
    // Create a payment record for this booking
    addPaymentRecord(bookingDetails);
    
    // Log successful booking for debugging
    console.log("Booking saved to localStorage:", bookingDetails);
  }
  
  // Trigger events to update UI components
  triggerPaymentUpdate();
  triggerBookingUpdate();
};

/**
 * Add a payment record to localStorage
 */
export const addPaymentRecord = (bookingDetails: any) => {
  const payments = JSON.parse(localStorage.getItem("userPayments") || "[]");
  
  const newPayment = {
    id: `TXN-${Math.floor(Math.random() * 1000000)}`,
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
    amount: bookingDetails.totalFare || bookingDetails.fare,
    status: "Completed",
    type: "Train Ticket",
    reference: bookingDetails.pnr,
    timestamp: Date.now(),
    bookingId: bookingDetails.id
  };
  
  payments.push(newPayment);
  localStorage.setItem("userPayments", JSON.stringify(payments));
  
  console.log("Payment record created:", newPayment);
};

/**
 * Get user payments from localStorage
 */
export const getUserPayments = () => {
  const payments = JSON.parse(localStorage.getItem("userPayments") || "[]");
  return payments.sort((a: any, b: any) => (b.timestamp || 0) - (a.timestamp || 0));
};

/**
 * Get user bookings from localStorage
 */
export const getUserBookings = () => {
  const bookings = JSON.parse(localStorage.getItem("userBookings") || "[]");
  return bookings.sort((a: any, b: any) => (b.timestamp || 0) - (a.timestamp || 0));
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
    // Use imported default trains instead of require
    trains = defaultTrains;
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
    // Use imported default trains instead of require
    trains = defaultTrains;
    // Initialize localStorage with default trains
    localStorage.setItem("availableTrains", JSON.stringify(defaultTrains));
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
  
  // Return true if booking was found and updated
  return bookings.some((booking: any) => booking.pnr === pnr);
};

/**
 * Cancel booking by id
 */
export const cancelBooking = (bookingId: string): boolean => {
  const bookings = JSON.parse(localStorage.getItem("userBookings") || "[]");
  let found = false;
  
  const updatedBookings = bookings.map((booking: any) => {
    if (booking.id === bookingId) {
      found = true;
      // Create a refund payment record
      const cancelledBooking = { ...booking, status: "cancelled" };
      addRefundRecord(cancelledBooking);
      return cancelledBooking;
    }
    return booking;
  });
  
  if (found) {
    localStorage.setItem("userBookings", JSON.stringify(updatedBookings));
    triggerBookingUpdate();
    triggerPaymentUpdate(); // Trigger payment update for the refund
    return true;
  }
  
  return false;
};

/**
 * Add a refund record to localStorage
 */
export const addRefundRecord = (bookingDetails: any) => {
  const payments = JSON.parse(localStorage.getItem("userPayments") || "[]");
  
  const newRefund = {
    id: `REF-${Math.floor(Math.random() * 1000000)}`,
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
    amount: bookingDetails.totalFare || bookingDetails.fare,
    status: "Refunded",
    type: "Ticket Refund",
    reference: bookingDetails.pnr,
    timestamp: Date.now(),
    bookingId: bookingDetails.id
  };
  
  payments.push(newRefund);
  localStorage.setItem("userPayments", JSON.stringify(payments));
  
  console.log("Refund record created:", newRefund);
};

/**
 * Get booking by PNR
 */
export const getBookingByPnr = (pnr: string) => {
  const bookings = JSON.parse(localStorage.getItem("userBookings") || "[]");
  return bookings.find((booking: any) => booking.pnr === pnr) || null;
};

/**
 * Clear all localStorage data (for testing)
 */
export const clearAllData = () => {
  localStorage.removeItem("userBookings");
  localStorage.removeItem("userPayments");
  localStorage.removeItem("availableTrains");
  console.log("All localStorage data cleared");
};

/**
 * Get a dummy booking for testing
 */
export const createDummyBooking = () => {
  const train = defaultTrains[0];
  const booking = {
    id: `book${Date.now()}`,
    pnr: `PNR${Math.floor(1000000 + Math.random() * 9000000)}`,
    bookingDate: new Date().toISOString().split('T')[0],
    journeyDate: "2025-04-15",
    status: "confirmed",
    totalFare: train.coaches.sleeper.fare,
    passengers: [
      {
        name: "Test User",
        age: 30,
        gender: "Male"
      }
    ],
    seatClass: "sleeper",
    seatType: "sleeper",
    trainId: train.id,
    train: train,
    timestamp: Date.now()
  };
  
  return booking;
};
