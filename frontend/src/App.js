// ============================================================================
// src/App.js - Frontend Integration (React Router, useEffect, and Axios)
// Target Client: Mitsu Travel & Tours
// ============================================================================

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';

import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import DestinationPage from './pages/DestinationPage';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';
import TransactionsPage from './pages/TransactionsPage';
import UserManagementPage from './pages/UserManagementPage';
import ArchivePage from './pages/ArchivePage';
import { INITIAL_USERS, INITIAL_BOOKINGS } from './data/destinationsData';

const API_BASE = 'http://localhost:5000/api';

function App() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);
  const [currentUser, setCurrentUser] = useState(null); // the app starts logged out
  const [backendConnected, setBackendConnected] = useState(false);

  // Fetch Users and Bookings from Express Backend using useEffect & axios.get()
  useEffect(() => {
    const fetchSystemData = async () => {
      try {
        const [activeUsersRes, archivedUsersRes, activeBookingsRes, archivedBookingsRes] = await Promise.all([
          axios.get(`${API_BASE}/getUsers`),
          axios.get(`${API_BASE}/getArchivedUsers`),
          axios.get(`${API_BASE}/getBookings`),
          axios.get(`${API_BASE}/getArchivedBookings`)
        ]);

        const combinedUsers = [...activeUsersRes.data, ...archivedUsersRes.data];
        const combinedBookings = [...activeBookingsRes.data, ...archivedBookingsRes.data];

        if (combinedUsers.length > 0) setUsers(combinedUsers);
        if (combinedBookings.length > 0) setBookings(combinedBookings);
        setBackendConnected(true);
      } catch (error) {
        // Fallback to realistic presentation dataset if local MongoDB/Express server isn't started yet
        console.log('Using pre-loaded presentation dataset (Start backend on port 5000 for live MongoDB sync).');
        setBackendConnected(false);
      }
    };

    fetchSystemData();
  }, []);

  // 1. Account Management: Login
  const handleLogin = async (email, password) => {
    try {
      if (backendConnected) {
        const res = await axios.post(`${API_BASE}/login`, { email, password });
        setCurrentUser(res.data.user);
        return { success: true };
      }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Invalid credentials.' };
    }

    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!found) return { success: false, message: 'Invalid email or password.' };
    if (found.isArchived) return { success: false, message: 'This account is archived. Please restore it first.' };
    setCurrentUser(found);
    return { success: true };
  };

  // 2. Account Management: Register
  const handleRegister = async (newUserData) => {
    try {
      if (backendConnected) {
        const res = await axios.post(`${API_BASE}/register`, newUserData);
        setUsers((prev) => [res.data.user, ...prev]);
        setCurrentUser(res.data.user);
        return { success: true };
      }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Registration failed.' };
    }

    const exists = users.some((u) => u.email.toLowerCase() === newUserData.email.toLowerCase());
    if (exists) return { success: false, message: 'Email is already registered.' };

    const created = {
      ...newUserData,
      _id: 'u_' + Date.now(),
      isArchived: false,
    };
    setUsers((prev) => [created, ...prev]);
    setCurrentUser(created);
    return { success: true };
  };

  // 3. User Management: Admin adds a user (does NOT change who is logged in)
  const handleAddUser = async (newUserData) => {
    try {
      if (backendConnected) {
        const res = await axios.post(`${API_BASE}/register`, { ...newUserData, adminId: currentUser._id });
        setUsers((prev) => [res.data.user, ...prev]);
        return { success: true };
      }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Could not add the user.' };
    }

    const exists = users.some((u) => u.email.toLowerCase() === newUserData.email.toLowerCase());
    if (exists) return { success: false, message: 'Email is already registered.' };

    const created = {
      ...newUserData,
      _id: 'u_' + Date.now(),
      isArchived: false,
    };
    setUsers((prev) => [created, ...prev]);
    return { success: true };
  };

  // 4. User Management: Update Profile / Role
  const handleUpdateUser = async (id, updatedFields) => {
    try {
      if (backendConnected) {
        const res = await axios.put(`${API_BASE}/updateUser/${id}`, { ...updatedFields, adminId: currentUser ? currentUser._id : undefined });
        setUsers((prev) => prev.map((u) => (u._id === id ? res.data.user : u)));
        if (currentUser && currentUser._id === id) setCurrentUser(res.data.user);
        return;
      }
    } catch (err) {
      console.error(err);
    }

    setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, ...updatedFields } : u)));
    if (currentUser && currentUser._id === id) {
      setCurrentUser((prev) => ({ ...prev, ...updatedFields }));
    }
  };

  // 5. Archive & Restore User
  const handleArchiveUser = async (id) => {
    try {
      if (backendConnected) {
        await axios.put(`${API_BASE}/archiveUser/${id}`);
      }
    } catch (err) {
      console.error(err);
    }
    setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, isArchived: true } : u)));
  };

  const handleRestoreUser = async (id) => {
    try {
      if (backendConnected) {
        await axios.put(`${API_BASE}/restoreUser/${id}`);
      }
    } catch (err) {
      console.error(err);
    }
    setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, isArchived: false } : u)));
  };

  // 6. Core Transaction Module: Create Booking
  const handleCreateBooking = async (bookingData) => {
    try {
      if (backendConnected) {
        const res = await axios.post(`${API_BASE}/createBooking`, bookingData);
        setBookings((prev) => [res.data.booking, ...prev]);
        return;
      }
    } catch (err) {
      console.error(err);
    }

    const newBooking = {
      ...bookingData,
      _id: 'b_' + Date.now(),
      status: 'Pending',
      isArchived: false,
    };
    setBookings((prev) => [newBooking, ...prev]);
  };

  // 7. Core Transaction Workflow: Update Booking Status (Pending -> Confirmed -> Completed)
  const handleUpdateBookingStatus = async (id, newStatus) => {
    try {
      if (backendConnected) {
        await axios.put(`${API_BASE}/updateBookingStatus/${id}`, { status: newStatus });
      }
    } catch (err) {
      console.error(err);
    }
    setBookings((prev) => prev.map((b) => (b._id === id ? { ...b, status: newStatus } : b)));
  };

  // 8. Archive & Restore Booking
  const handleArchiveBooking = async (id) => {
    try {
      if (backendConnected) {
        await axios.put(`${API_BASE}/archiveBooking/${id}`);
      }
    } catch (err) {
      console.error(err);
    }
    setBookings((prev) => prev.map((b) => (b._id === id ? { ...b, isArchived: true } : b)));
  };

  const handleRestoreBooking = async (id) => {
    try {
      if (backendConnected) {
        await axios.put(`${API_BASE}/restoreBooking/${id}`);
      }
    } catch (err) {
      console.error(err);
    }
    setBookings((prev) => prev.map((b) => (b._id === id ? { ...b, isArchived: false } : b)));
  };

  // 9. Data Cleanup Before Presentation (Module 6)
  const handleResetPresentationData = async () => {
    try {
      if (backendConnected) {
        await axios.post(`${API_BASE}/resetPresentationData`);
        const [activeUsersRes, archivedUsersRes, activeBookingsRes, archivedBookingsRes] = await Promise.all([
          axios.get(`${API_BASE}/getUsers`),
          axios.get(`${API_BASE}/getArchivedUsers`),
          axios.get(`${API_BASE}/getBookings`),
          axios.get(`${API_BASE}/getArchivedBookings`)
        ]);
        setUsers([...activeUsersRes.data, ...archivedUsersRes.data]);
        setBookings([...activeBookingsRes.data, ...archivedBookingsRes.data]);
        return;
      }
    } catch (err) {
      console.error(err);
    }
    setUsers(INITIAL_USERS);
    setBookings(INITIAL_BOOKINGS);
  };

  const isAdmin = currentUser && currentUser.role === 'admin';
  // admins see every booking, clients only see their own
  const visibleBookings = isAdmin
    ? bookings
    : bookings.filter((b) => currentUser && b.email.toLowerCase() === currentUser.email.toLowerCase());
  const activeBookingsCount = visibleBookings.filter((b) => !b.isArchived).length;
  const completedCount = bookings.filter((b) => !b.isArchived && b.status === 'Completed').length;
  const activeUsersCount = users.filter((u) => !u.isArchived).length;
  const archivedCount = bookings.filter((b) => b.isArchived).length + users.filter((u) => u.isArchived).length;

  return (
    <Router>
      <Navbar
        currentUser={currentUser}
        onLogout={() => setCurrentUser(null)}
        activeBookingsCount={activeBookingsCount}
        activeUsersCount={activeUsersCount}
        archivedCount={archivedCount}
      />

      <Routes>
        <Route
          path="/"
          element={<HomePage completedCount={completedCount} activeUsersCount={activeUsersCount} />}
        />
        <Route
          path="/destination/:city"
          element={<DestinationPage currentUser={currentUser} onCreateBooking={handleCreateBooking} />}
        />
        <Route
          path="/auth"
          element={
            <AuthPage
              users={users}
              onLogin={handleLogin}
              onRegister={handleRegister}
            />
          }
        />
        <Route
          path="/profile"
          element={
            <ProfilePage
              currentUser={currentUser}
              bookings={bookings}
              onUpdateUser={handleUpdateUser}
              onLogout={() => setCurrentUser(null)}
            />
          }
        />
        <Route
          path="/transactions"
          element={
            <TransactionsPage
              currentUser={currentUser}
              bookings={bookings}
              onCreateBooking={handleCreateBooking}
              onUpdateStatus={handleUpdateBookingStatus}
              onArchiveBooking={handleArchiveBooking}
            />
          }
        />
        <Route
          path="/users"
          element={
            <UserManagementPage
              users={users}
              currentUser={currentUser}
              onAddUser={handleAddUser}
              onUpdateUser={handleUpdateUser}
              onArchiveUser={handleArchiveUser}
            />
          }
        />
        <Route
          path="/archive"
          element={
            <ArchivePage
              currentUser={currentUser}
              bookings={bookings}
              users={users}
              onRestoreBooking={handleRestoreBooking}
              onRestoreUser={handleRestoreUser}
              onResetPresentationData={handleResetPresentationData}
            />
          }
        />
      </Routes>

    
    </Router>
  );
}

export default App;
