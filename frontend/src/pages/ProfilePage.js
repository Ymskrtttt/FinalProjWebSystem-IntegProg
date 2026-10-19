import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function ProfilePage({ currentUser, bookings, onUpdateUser, onLogout }) {
  const [fullName, setFullName] = useState(currentUser ? currentUser.fullName : '');
  const [phone, setPhone] = useState(currentUser ? currentUser.phone : '');
  const [password, setPassword] = useState(currentUser ? currentUser.password : '');
  const [savedMsg, setSavedMsg] = useState('');

  if (!currentUser) {
    return (
      <div className="container" style={{ textAlign: 'center' }}>
        <div className="panel-card">
          <h2>Please Sign In</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Log in to view your profile and personal travel reservations.</p>
          <Link to="/auth" className="cta-btn">Go to Login</Link>
        </div>
      </div>
    );
  }

  const myBookings = bookings.filter(
    (b) => !b.isArchived && b.email.toLowerCase() === currentUser.email.toLowerCase()
  );

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    await onUpdateUser(currentUser._id, {
      fullName,
      phone,
      password
    });
    setSavedMsg('Profile information updated successfully!');
    setTimeout(() => setSavedMsg(''), 3000);
  };

  return (
    <div className="container">
      <div className="portal-grid">
        <div className="panel-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ margin: 0 }}>My Account <span style={{ color: 'var(--accent-gold)' }}>Profile</span></h2>
            <span className={`status-badge ${currentUser.role === 'admin' ? 'status-confirmed' : 'status-completed'}`}>
              Role: {currentUser.role.toUpperCase()}
            </span>
          </div>

          {savedMsg && (
            <div style={{ padding: '12px', background: 'rgba(42, 157, 143, 0.2)', border: '1px solid #2a9d8f', color: '#3ec1b1', borderRadius: '8px', marginBottom: '16px', fontSize: '0.88rem' }}>
              {savedMsg}
            </div>
          )}

          <form onSubmit={handleSaveProfile}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                className="form-input"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Email Address (Login ID)</label>
              <input
                type="email"
                className="form-input"
                value={currentUser.email}
                disabled
                style={{ opacity: 0.6 }}
              />
            </div>
            <div className="form-group">
              <label>Contact Phone</label>
              <input
                type="text"
                className="form-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Account Password</label>
              <input
                type="text"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="submit" className="submit-btn">Save Profile Changes</button>
              <button type="button" onClick={onLogout} className="action-btn danger" style={{ padding: '14px 20px' }}>
                Logout
              </button>
            </div>
          </form>
        </div>

        <div className="panel-card">
          <h3 style={{ marginTop: 0 }}>My Travel Reservations ({myBookings.length})</h3>
          {myBookings.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>
              You have no active bookings under {currentUser.email}. Explore Tokyo, Bali, or Singapore to book!
            </p>
          ) : (
            myBookings.map((b) => (
              <div key={b._id} style={{ padding: '14px', border: '1px solid var(--border-subtle)', borderRadius: '10px', marginBottom: '12px', background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <strong style={{ color: 'var(--accent-gold)' }}>{b.bookingCode} — {b.destination}</strong>
                  <span className={`status-badge status-${b.status.toLowerCase()}`}>{b.status}</span>
                </div>
                <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                  <div><strong>Hotel:</strong> {b.hotelName} ({b.duration})</div>
                  <div><strong>Add-on:</strong> {b.addonSelected}</div>
                  <div><strong>Travel Date:</strong> {b.travelDate} | <strong>Total:</strong> ${Number(b.totalCost).toLocaleString()}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
