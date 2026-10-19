//booking schema
const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  bookingCode: {
    type: String,
    required: true
  },
  guestName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    default: ''
  },
  destination: {
    type: String,
    enum: ['Tokyo', 'Bali', 'Singapore'],
    required: true
  },
  hotelName: {
    type: String,
    required: true
  },
  itineraryTitle: {
    type: String,
    default: 'Curated Luxury Blueprint'
  },
  duration: {
    type: String,
    enum: ['5 Days', '7 Days'],
    default: '5 Days'
  },
  addonSelected: {
    type: String,
    default: 'None'
  },
  travelDate: {
    type: String,
    required: true
  },
  guestsCount: {
    type: Number,
    default: 2
  },
  totalCost: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    default: 'Credit Card'
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  isArchived: {
    type: Boolean,
    default: false
  },
 
});

const BookingModel = mongoose.model('bookings', BookingSchema);
module.exports = BookingModel;
