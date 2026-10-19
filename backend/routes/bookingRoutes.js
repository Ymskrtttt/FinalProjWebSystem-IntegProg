// Booking routes

const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// Core Transaction & Archive Endpoints
router.get('/getBookings', bookingController.getBookings);
router.get('/getArchivedBookings', bookingController.getArchivedBookings);
router.post('/createBooking', bookingController.createBooking);
router.put('/updateBookingStatus/:id', bookingController.updateBookingStatus);
router.put('/archiveBooking/:id', bookingController.archiveBooking);
router.put('/restoreBooking/:id', bookingController.restoreBooking);

router.post('/resetPresentationData', bookingController.resetPresentationData);

module.exports = router;
