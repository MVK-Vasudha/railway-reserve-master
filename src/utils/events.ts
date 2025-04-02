
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
export const simulateSuccessfulPayment = () => {
  // This would typically be called after a payment is processed
  triggerPaymentUpdate();
  triggerBookingUpdate();
};
