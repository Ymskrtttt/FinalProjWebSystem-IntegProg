import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function ArchivePage({ currentUser, bookings, users, onRestoreBooking, onRestoreUser, onResetPresentationData }) {
  const [tab, setTab] = useState('bookings');
  const [cleanupMsg, setCleanupMsg] = useState('');

  // admins only
  if (!currentUser) {
    return (
      <div className="container" style={{ textAlign: 'center' }}>
        <div className="panel-card">
          <h2>Please Sign In</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Log in with an admin account to view the archive.</p>
          <Link to="/auth" className="cta-btn">Go to Login</Link>
        </div>
      </div>
    );
  }
  if (currentUser.role !== 'admin') {
    return (
      <div className="container" style={{ textAlign: 'center' }}>
        <div className="panel-card">
          <h2>For Admins Only</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Your account does not have permission to view the archive.</p>
          <Link to="/" className="cta-btn">Back to Home</Link>
        </div>
      </div>
    );
  }

  const archivedBookings = bookings.filter((b) => b.isArchived);
  const archivedUsers = users.filter((u) => u.isArchived);

  const handlePresentationCleanup = async () => {
    await onResetPresentationData();
    setCleanupMsg('All dummy/test data removed! Clean presentation dataset (12 Active Users & 21 Completed Transactions) is now active.');
    setTimeout(() => setCleanupMsg(''), 4000);
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '24px' }}>
        <div>
          <h2 style={{ margin: '0 0 6px 0' }}>System <span style={{ color: 'var(--accent-gold)' }}>Archive & Data Cleanup</span></h2>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Archived records are separated from active records and can be viewed or restored at any time.
          </p>
        </div>
        <button
          type="button"
          className="action-btn gold"
          onClick={handlePresentationCleanup}
          style={{ padding: '10px 18px', fontSize: '0.82rem' }}
          title="Module 6: Clean dummy test data and reset to required presentation dataset"
        >
          <i className="fa-solid fa-broom"></i> Clean & Reset Presentation Data
        </button>
      </div>

      {cleanupMsg && (
        <div style={{ padding: '14px', background: 'rgba(42, 157, 143, 0.2)', border: '1px solid #2a9d8f', color: '#3ec1b1', borderRadius: '10px', marginBottom: '20px', fontSize: '0.9rem' }}>
          <i className="fa-solid fa-circle-check"></i> {cleanupMsg}
        </div>
      )}

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button
          type="button"
          className={`action-btn ${tab === 'bookings' ? 'gold' : ''}`}
          onClick={() => setTab('bookings')}
          style={{ padding: '10px 20px' }}
        >
          Archived Transactions ({archivedBookings.length})
        </button>
        <button
          type="button"
          className={`action-btn ${tab === 'users' ? 'gold' : ''}`}
          onClick={() => setTab('users')}
          style={{ padding: '10px 20px' }}
        >
          Archived Users ({archivedUsers.length})
        </button>
      </div>

      {tab === 'bookings' ? (
        <div className="panel-card">
          <h3 style={{ marginTop: 0 }}>Archived Booking Transactions</h3>
          {archivedBookings.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>No archived booking transactions.</p>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Guest Name</th>
                    <th>Destination & Hotel</th>
                    <th>Travel Date</th>
                    <th>Total Cost</th>
                    <th>Last Status</th>
                    <th>Restore Action</th>
                  </tr>
                </thead>
                <tbody>
                  {archivedBookings.map((b) => (
                    <tr key={b._id}>
                      <td style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>{b.bookingCode}</td>
                      <td>{b.guestName} ({b.email})</td>
                      <td>{b.destination} — {b.hotelName}</td>
                      <td>{b.travelDate}</td>
                      <td>${Number(b.totalCost).toLocaleString()}</td>
                      <td>
                        <span className="status-badge status-archived">Archived ({b.status})</span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="action-btn emerald"
                          onClick={() => onRestoreBooking(b._id)}
                        >
                          <i className="fa-solid fa-rotate-left"></i> Restore to Active
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className="panel-card">
          <h3 style={{ marginTop: 0 }}>Archived User Accounts</h3>
          {archivedUsers.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>No archived user accounts.</p>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Restore Action</th>
                  </tr>
                </thead>
                <tbody>
                  {archivedUsers.map((u) => (
                    <tr key={u._id}>
                      <td><strong>{u.fullName}</strong></td>
                      <td>{u.email}</td>
                      <td>{u.phone}</td>
                      <td>{u.role.toUpperCase()}</td>
                      <td><span className="status-badge status-archived">Archived</span></td>
                      <td>
                        <button
                          type="button"
                          className="action-btn emerald"
                          onClick={() => onRestoreUser(u._id)}
                        >
                          <i className="fa-solid fa-rotate-left"></i> Restore Account
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ArchivePage;
