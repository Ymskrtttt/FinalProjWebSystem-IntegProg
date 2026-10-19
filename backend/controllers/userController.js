// ============================================================================
// controllers/userController.js - Business Logic for Account & User Management
// ============================================================================

const UserModel = require('../models/User');

// 1. Get all active users (Admin User Management)
const getUsers = async (req, res) => {
  try {
    const users = await UserModel.find({ isArchived: false }).sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

// 2. Get all archived users (Archive Module)
const getArchivedUsers = async (req, res) => {
  try {
    const archivedUsers = await UserModel.find({ isArchived: true }).sort({ createdAt: -1 });
    res.json(archivedUsers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching archived users', error: error.message });
  }
};

// Helper: is this id the id of an admin account?
const isAdminId = async (id) => {
  if (!id) return false;
  const admin = await UserModel.findOne({ _id: id, role: 'admin' });
  return !!admin;
};

// 3. Register a new user account (Account Management / Admin Add User)
// New accounts are always "client". Only an admin (sending adminId) can create an admin account.
const registerUser = async (req, res) => {
  try {
    const { fullName, password, phone, role, adminId } = req.body;
    const email = String(req.body.email || '').trim().toLowerCase();

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'Please fill in all fields.' });
    }
    if (!/^[^\s@]+@gmail\.com$/.test(email)) {
      return res.status(400).json({ message: 'Please use a Gmail address (example: juan@gmail.com).' });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered.' });
    }

    let newRole = 'client';
    if (role === 'admin') {
      if (!(await isAdminId(adminId))) {
        return res.status(403).json({ message: 'Only an admin can create an admin account.' });
      }
      newRole = 'admin';
    }

    const newUser = new UserModel({
      fullName,
      email,
      password,
      phone: phone || '+63 917 000 0000',
      role: newRole,
      isArchived: false
    });

    const savedUser = await newUser.save();
    res.status(201).json({ message: 'User registered successfully!', user: savedUser });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

// 4. User Login (Account Management)
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email: String(email || '').trim().toLowerCase(), password });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    if (user.isArchived) {
      return res.status(403).json({ message: 'This account is archived. Please contact an administrator.' });
    }

    res.json({ message: 'Login successful!', user });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

// 6. Update User Profile or Role (Profile & Admin User Management)
// Changing a role needs adminId of an admin account. Email and archive status cannot be changed here.
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminId, email, isArchived, ...fields } = req.body;

    if (fields.role !== undefined && !(await isAdminId(adminId))) {
      return res.status(403).json({ message: 'Only an admin can change roles.' });
    }

    const updatedUser = await UserModel.findByIdAndUpdate(id, fields, { new: true });
    res.json({ message: 'User updated successfully!', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
};

// 7. Archive User (Archive Module)
const archiveUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { isArchived: true },
      { new: true }
    );
    res.json({ message: 'User moved to archive.', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Error archiving user', error: error.message });
  }
};

// 8. Restore Archived User (Archive Module)
const restoreUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { isArchived: false },
      { new: true }
    );
    res.json({ message: 'User restored to active records.', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Error restoring user', error: error.message });
  }
};

module.exports = {
  getUsers,
  getArchivedUsers,
  registerUser,
  loginUser,
  updateUser,
  archiveUser,
  restoreUser
};
