
// controllers/bookingController.js - Business Logic for Core Transactions

const BookingModel = require('../models/Booking');

// Get all active bookings (Core Transaction Module)
const getBookings = async (req, res) => {
  try {
    const bookings = await BookingModel.find({ isArchived: false }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
};

// Get all archived bookings (Archive Module)
const getArchivedBookings = async (req, res) => {
  try {
    const archivedBookings = await BookingModel.find({ isArchived: true }).sort({ createdAt: -1 });
    res.json(archivedBookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching archived bookings', error: error.message });
  }
};

// Create a new booking transaction (Core Transaction Workflow - Step 1: Creation)
const createBooking = async (req, res) => {
  try {
    const {
      bookingCode,
      guestName,
      email,
      phone,
      destination,
      hotelName,
      itineraryTitle,
      duration,
      addonSelected,
      travelDate,
      guestsCount,
      totalCost,
      paymentMethod
    } = req.body;

    const generatedCode = bookingCode || ('MTT-' + Math.floor(100000 + Math.random() * 900000));

    const newBooking = new BookingModel({
      bookingCode: generatedCode,
      guestName,
      email,
      phone: phone || '+63 917 000 0000',
      destination,
      hotelName,
      itineraryTitle: itineraryTitle || 'Curated Luxury Blueprint',
      duration: duration || '5 Days',
      addonSelected: addonSelected || 'None',
      travelDate,
      guestsCount: guestsCount || 2,
      totalCost,
      paymentMethod: paymentMethod || 'Credit Card',
      status: 'Pending',
      isArchived: false
    });

    const savedBooking = await newBooking.save();
    res.status(201).json({ message: 'Booking created successfully!', booking: savedBooking });
  } catch (error) {
    res.status(500).json({ message: 'Error creating booking', error: error.message });
  }
};

// 4. Update booking status or details (Workflow: Pending -> Confirmed -> Completed)
const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedBooking = await BookingModel.findByIdAndUpdate(id, req.body, { new: true });
    res.json({ message: 'Booking transaction updated!', booking: updatedBooking });
  } catch (error) {
    res.status(500).json({ message: 'Error updating booking', error: error.message });
  }
};

// Archive a booking record 
const archiveBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const archivedBooking = await BookingModel.findByIdAndUpdate(
      id,
      { isArchived: true },
      { new: true }
    );
    res.json({ message: 'Booking moved to Archive.', booking: archivedBooking });
  } catch (error) {
    res.status(500).json({ message: 'Error archiving booking', error: error.message });
  }
};

//  Restore an archived booking record 
const restoreBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const restoredBooking = await BookingModel.findByIdAndUpdate(
      id,
      { isArchived: false },
      { new: true }
    );
    res.json({ message: 'Booking restored to active transactions.', booking: restoredBooking });
  } catch (error) {
    res.status(500).json({ message: 'Error restoring booking', error: error.message });
  }
};


const UserModel = require('../models/User');
const { initialUsers, initialBookings } = require('../seedData');
//  Data Cleanup & Presentation Reset (Module 6: Remove test/dummy data & restore 12 users + 21 completed bookings)
const resetPresentationData = async (req, res) => {
  try {
    await UserModel.deleteMany({});
    await BookingModel.deleteMany({});
    const users = await UserModel.insertMany(initialUsers);
    const bookings = await BookingModel.insertMany(initialBookings);
    res.json({
      message: 'Presentation data cleaned and reset! (12 Active Users, 21 Completed Transactions)',
      usersCount: users.length,
      bookingsCount: bookings.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Error resetting presentation data', error: error.message });
  }
};

module.exports = {
  resetPresentationData,
  getBookings,
  getArchivedBookings,
  createBooking,
  updateBookingStatus,
  archiveBooking,
  restoreBooking
};
