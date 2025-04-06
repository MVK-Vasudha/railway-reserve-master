
# RailReserve Backend API

Backend API for the RailReserve train booking system.

## Setup Instructions

1. **Install Dependencies**
   ```
   npm install
   ```

2. **Configure Environment Variables**
   - Create a `.env` file in the root directory
   - Add the following variables:
     ```
     NODE_ENV=development
     PORT=5000
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     JWT_EXPIRE=30d
     ```

3. **Seed the Database**
   ```
   # Import sample data
   node seeder.js -i
   
   # To delete all data
   node seeder.js -d
   ```

4. **Run the Server**
   ```
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Trains
- `GET /api/trains` - Get all trains
- `GET /api/trains/:id` - Get single train
- `POST /api/trains` - Create new train (Admin)
- `PUT /api/trains/:id` - Update train (Admin)
- `DELETE /api/trains/:id` - Delete train (Admin)
- `GET /api/trains/search?source=X&destination=Y&date=Z` - Search trains

### Bookings
- `GET /api/bookings` - Get all bookings (Admin)
- `GET /api/bookings/:id` - Get single booking
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Delete booking
- `GET /api/bookings/my-bookings` - Get current user's bookings

### PNR Status
- `GET /api/pnr/:pnr` - Check PNR status

### Payments
- `POST /api/payments` - Process payment
- `GET /api/payments` - Get all payments (Admin)
- `GET /api/payments/my-payments` - Get current user's payments

### Admin
- `GET /api/admin/dashboard` - Get dashboard statistics
- `GET /api/admin/users` - Get all users
- `GET /api/admin/bookings` - Get all bookings with details

## Models

### User
- name
- email
- password
- role (user, admin)

### Train
- number
- name
- source
- destination
- departureTime
- arrivalTime
- distance
- duration
- days
- availableSeats (sleeper, ac3Tier, ac2Tier, acFirstClass)
- fare (sleeper, ac3Tier, ac2Tier, acFirstClass)

### Booking
- userId
- trainId
- pnr
- passengers (name, age, gender)
- seatClass
- journeyDate
- status (confirmed, waitlisted, cancelled)
- totalFare

### Payment
- bookingId
- userId
- amount
- transactionId
- status (completed, pending, failed, refunded)
- paymentMethod

## Admin Access
Default admin credentials:
- Email: admin@railreserve.com
- Password: admin123
