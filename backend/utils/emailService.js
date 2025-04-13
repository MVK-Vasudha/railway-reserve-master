
const nodemailer = require('nodemailer');

// Create transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASS || ''
  }
});

/**
 * Send booking confirmation email
 * @param {Object} booking - The booking object
 * @param {Object} user - The user object
 * @param {Object} train - The train object
 */
const sendBookingConfirmation = async (booking, user, train) => {
  try {
    // Only send if email configuration is available
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('Email configuration not available. Skipping email notification.');
      return;
    }

    const mailOptions = {
      from: `"RailReserve" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: `Booking Confirmation - PNR: ${booking.pnr}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #1a56db;">Your Booking is Confirmed!</h2>
          </div>
          
          <div style="margin-bottom: 20px; padding: 15px; background-color: #f3f4f6; border-radius: 5px;">
            <p><strong>PNR Number:</strong> ${booking.pnr}</p>
            <p><strong>Train:</strong> ${train.name} (${train.number})</p>
            <p><strong>From:</strong> ${train.source}</p>
            <p><strong>To:</strong> ${train.destination}</p>
            <p><strong>Journey Date:</strong> ${booking.journeyDate}</p>
            <p><strong>Class:</strong> ${booking.seatClass.toUpperCase()}</p>
            <p><strong>Total Passengers:</strong> ${booking.passengers.length}</p>
            <p><strong>Total Fare:</strong> $${booking.totalFare}</p>
          </div>
          
          <div style="margin-bottom: 20px;">
            <h3>Passenger Details:</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background-color: #f3f4f6;">
                  <th style="padding: 8px; text-align: left; border: 1px solid #e0e0e0;">Name</th>
                  <th style="padding: 8px; text-align: left; border: 1px solid #e0e0e0;">Age</th>
                  <th style="padding: 8px; text-align: left; border: 1px solid #e0e0e0;">Gender</th>
                </tr>
              </thead>
              <tbody>
                ${booking.passengers.map(passenger => `
                  <tr>
                    <td style="padding: 8px; border: 1px solid #e0e0e0;">${passenger.name}</td>
                    <td style="padding: 8px; border: 1px solid #e0e0e0;">${passenger.age}</td>
                    <td style="padding: 8px; border: 1px solid #e0e0e0;">${passenger.gender}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          
          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #6b7280; font-size: 14px;">
            <p>Thank you for choosing RailReserve for your journey. Have a safe trip!</p>
            <p>For any assistance, please contact our support team.</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Booking confirmation email sent to ${user.email}`);
  } catch (error) {
    console.error('Error sending booking confirmation email:', error);
  }
};

/**
 * Send train delay notification email
 * @param {Object} booking - The booking object
 * @param {Object} user - The user object
 * @param {Object} train - The train object
 * @param {Number} delayMinutes - Delay in minutes
 */
const sendDelayNotification = async (booking, user, train, delayMinutes) => {
  try {
    // Only send if email configuration is available
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('Email configuration not available. Skipping email notification.');
      return;
    }

    const mailOptions = {
      from: `"RailReserve" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: `Train Delay Notification - ${train.number}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #dc2626;">Train Delay Alert</h2>
          </div>
          
          <div style="margin-bottom: 20px; padding: 15px; background-color: #fee2e2; border-radius: 5px;">
            <p style="font-size: 16px; font-weight: bold;">
              Your train ${train.name} (${train.number}) is delayed by ${delayMinutes} minutes.
            </p>
          </div>
          
          <div style="margin-bottom: 20px; padding: 15px; background-color: #f3f4f6; border-radius: 5px;">
            <p><strong>PNR Number:</strong> ${booking.pnr}</p>
            <p><strong>Train:</strong> ${train.name} (${train.number})</p>
            <p><strong>From:</strong> ${train.source}</p>
            <p><strong>To:</strong> ${train.destination}</p>
            <p><strong>Journey Date:</strong> ${booking.journeyDate}</p>
            <p><strong>New Expected Departure:</strong> [Updated departure time will be communicated]</p>
          </div>
          
          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #6b7280; font-size: 14px;">
            <p>We apologize for the inconvenience. For more information, please contact our customer support.</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Delay notification email sent to ${user.email}`);
  } catch (error) {
    console.error('Error sending delay notification email:', error);
  }
};

/**
 * Send booking status update email
 * @param {Object} booking - The booking object
 * @param {Object} user - The user object
 * @param {Object} train - The train object
 * @param {String} status - New status
 */
const sendStatusUpdateNotification = async (booking, user, train, status) => {
  try {
    // Only send if email configuration is available
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('Email configuration not available. Skipping email notification.');
      return;
    }

    const statusColor = status === 'confirmed' ? '#059669' : status === 'cancelled' ? '#dc2626' : '#f59e0b';
    const statusText = status.charAt(0).toUpperCase() + status.slice(1);

    const mailOptions = {
      from: `"RailReserve" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: `Booking Status Update - ${statusText}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: ${statusColor};">Booking Status Update</h2>
          </div>
          
          <div style="margin-bottom: 20px; padding: 15px; background-color: #f3f4f6; border-radius: 5px;">
            <p style="font-size: 16px; font-weight: bold;">
              Your booking status has been updated to <span style="color: ${statusColor};">${statusText}</span>
            </p>
          </div>
          
          <div style="margin-bottom: 20px; padding: 15px; background-color: #f3f4f6; border-radius: 5px;">
            <p><strong>PNR Number:</strong> ${booking.pnr}</p>
            <p><strong>Train:</strong> ${train.name} (${train.number})</p>
            <p><strong>From:</strong> ${train.source}</p>
            <p><strong>To:</strong> ${train.destination}</p>
            <p><strong>Journey Date:</strong> ${booking.journeyDate}</p>
          </div>
          
          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #6b7280; font-size: 14px;">
            <p>Thank you for choosing RailReserve for your journey.</p>
            <p>For any assistance, please contact our support team.</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Status update email sent to ${user.email}`);
  } catch (error) {
    console.error('Error sending status update email:', error);
  }
};

module.exports = {
  sendBookingConfirmation,
  sendDelayNotification,
  sendStatusUpdateNotification
};
