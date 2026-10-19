// ============================================================================
// seed.js - Database Cleanup & Presentation Data Seeder
// Run with: node seed.js
// Cleans all dummy/test data and inserts the exact required presentation records
// ============================================================================

const mongoose = require('mongoose');
const UserModel = require('./models/User');
const BookingModel = require('./models/Booking');
const { initialUsers, initialBookings } = require('./seedData');

const MONGO_URI = 'mongodb://127.0.0.1:27017/mitsu_travel_db';

async function seedDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Module 6: Data Cleanup Before Presentation (Remove all old test/dummy records)
    await UserModel.deleteMany({});
    await BookingModel.deleteMany({});
    console.log('Old test and dummy records cleared.');

    // Module 5: Insert 12 Active Users + 2 Archived Users
    await UserModel.insertMany(initialUsers);
    console.log('Inserted 14 realistic user accounts (12 active, 2 archived).');

    // Module 3 & 4: Insert 21 Completed Transactions + 3 Active + 2 Archived
    await BookingModel.insertMany(initialBookings);
    console.log('Inserted 26 realistic booking transactions (21 Completed, 3 In-Progress, 2 Archived).');

    console.log('Database seeding completed! Ready for presentation.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
}

seedDatabase();
