// 
// User model schema
// 

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^[^\s@]+@gmail\.com$/i, 'Email must be a Gmail address (example: juan@gmail.com).']
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['admin', 'client'],
    default: 'client'
  },
  isArchived: {
    type: Boolean,
    default: false
  },
  
});

const UserModel = mongoose.model('users', UserSchema);
module.exports = UserModel;
