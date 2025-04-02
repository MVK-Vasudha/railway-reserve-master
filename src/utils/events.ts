
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

