import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function TransactionsPage({ currentUser, bookings, onCreateBooking, onUpdateStatus, onArchiveBooking }) {
  const [statusFilter, setStatusFilter] = useState('All');
  const [destFilter, setDestFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);

  // New Booking Form State
  const [guestName, setGuestName] = useState('');
  const [email, setEmail] = useState('');
  const [destination, setDestination] = useState('Tokyo');
  const [hotelName, setHotelName] = useState('The Ritz-Carlton');
  const [duration, setDuration] = useState('5 Days');
  const [addonSelected, setAddonSelected] = useState('None');
  const [travelDate, setTravelDate] = useState('2026-11-25');
  const [totalCost, setTotalCost] = useState(3250);

  // must be logged in
  if (!currentUser) {
    return (
      <div className="container" style={{ textAlign: 'center' }}>
        <div className="panel-card">
          <h2>Please Sign In</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Log in to view your travel reservations.</p>
          <Link to="/auth" className="cta-btn">Go to Login</Link>
        </div>
      </div>
    );
  }

  // admins see every booking, clients only see their own
  const isAdmin = currentUser.role === 'admin';
  const visibleBookings = isAdmin
    ? bookings
    : bookings.filter((b) => b.email.toLowerCase() === currentUser.email.toLowerCase());

  const activeBookings = visibleBookings.filter((b) => !b.isArchived);
  const completedBookings = activeBookings.filter((b) => b.status === 'Completed');
  const pendingOrConfirmed = activeBookings.filter((b) => b.status === 'Pending' || b.status === 'Confirmed');
  const totalRevenue = completedBookings.reduce((sum, b) => sum + Number(b.totalCost || 0), 0);

  const filteredBookings = activeBookings.filter((b) => {
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    const matchesDest = destFilter === 'All' || b.destination === destFilter;
    const matchesSearch =
      b.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.bookingCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.hotelName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesDest && matchesSearch;
  });

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    await onCreateBooking({
      bookingCode: 'MTT-' + Math.floor(202630 + Math.random() * 7000),
      guestName,
      email,
      phone: '+63 917 550 2011',
      destination,
      hotelName,
      duration,
      addonSelected,
      travelDate,
      guestsCount: 2,
      totalCost: Number(totalCost),
      paymentMethod: 'Credit Card'
    });
    setShowNewModal(false);
    setGuestName('');
    setEmail('');
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '24px' }}>
        <div>
          <h2 style={{ margin: '0 0 6px 0' }}>Core Transaction <span style={{ color: 'var(--accent-gold)' }}>Management</span></h2>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {isAdmin
              ? 'Full transaction workflow from Creation (Pending) → Confirmation (Confirmed) → Completion (Completed) → Archive.'
              : 'Your travel reservations and where each one is in the process: Pending → Confirmed → Completed.'}
          </p>
        </div>
        {isAdmin && (
          <button type="button" className="cta-btn" onClick={() => setShowNewModal(!showNewModal)} style={{ padding: '10px 22px', fontSize: '0.85rem' }}>
            <i className="fa-solid fa-plus"></i> New Booking Transaction
          </button>
        )}
      </div>

      {/* KPI Summary Cards */}
      <div className="stats-row">
        <div className="stat-card">
          <h4>Active Transactions</h4>
          <div className="stat-value">{activeBookings.length}</div>
        </div>
        <div className="stat-card">
          <h4>{isAdmin ? 'Completed Transactions (Req: 20+)' : 'My Completed Trips'}</h4>
          <div className="stat-value" style={{ color: '#3ec1b1' }}>{completedBookings.length}</div>
        </div>
        <div className="stat-card">
          <h4>In-Progress Workflow</h4>
          <div className="stat-value" style={{ color: '#00f0ff' }}>{pendingOrConfirmed.length}</div>
        </div>
        <div className="stat-card">
          <h4>Completed Revenue</h4>
          <div className="stat-value">${totalRevenue.toLocaleString()}</div>
        </div>
      </div>

      {isAdmin && showNewModal && (
        <div className="panel-card" style={{ borderColor: 'var(--accent-gold)' }}>
          <h3 style={{ marginTop: 0 }}>Create New Booking Transaction (Starts as Pending)</h3>
          <form onSubmit={handleQuickAdd} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
            <div className="form-group">
              <label>Guest Name</label>
              <input type="text" className="form-input" required value={guestName} onChange={(e) => setGuestName(e.target.value)} placeholder="Marco Villanueva" />
            </div>
            <div className="form-group">
              <label>Guest Email</label>
              <input type="email" className="form-input" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="marco@gmail.com" />
            </div>
            <div className="form-group">
              <label>Destination</label>
              <select className="addon-select" value={destination} onChange={(e) => setDestination(e.target.value)}>
                <option value="Tokyo">Tokyo</option>
                <option value="Bali">Bali</option>
                <option value="Singapore">Singapore</option>
              </select>
            </div>
            <div className="form-group">
              <label>Hotel Property</label>
              <select className="addon-select" value={hotelName} onChange={(e) => setHotelName(e.target.value)}>
                <option value="The Ritz-Carlton">The Ritz-Carlton (Tokyo)</option>
                <option value="Hotel Chinzanso">Hotel Chinzanso (Tokyo)</option>
                <option value="TRUNK (Hotel) Shibuya">TRUNK (Hotel) Shibuya (Tokyo)</option>
                <option value="AYANA Resort Bali">AYANA Resort Bali</option>
                <option value="Hanging Gardens">Hanging Gardens (Bali)</option>
                <option value="Desa Potato Head">Desa Potato Head (Bali)</option>
                <option value="Marina Bay Sands">Marina Bay Sands (Singapore)</option>
                <option value="Raffles Hotel">Raffles Hotel (Singapore)</option>
                <option value="W Singapore - Sentosa Cove">W Singapore - Sentosa Cove</option>
              </select>
            </div>
            <div className="form-group">
              <label>Duration</label>
              <select className="addon-select" value={duration} onChange={(e) => setDuration(e.target.value)}>
                <option value="5 Days">5 Days</option>
                <option value="7 Days">7 Days</option>
              </select>
            </div>
            <div className="form-group">
              <label>Add-on Enhancement</label>
              <input type="text" className="form-input" value={addonSelected} onChange={(e) => setAddonSelected(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Travel Date</label>
              <input type="date" className="form-input" required value={travelDate} onChange={(e) => setTravelDate(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Total Cost ($)</label>
              <input type="number" className="form-input" required value={totalCost} onChange={(e) => setTotalCost(e.target.value)} />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', marginBottom: '14px' }}>
              <button type="submit" className="submit-btn">Save Transaction</button>
              <button type="button" className="action-btn" onClick={() => setShowNewModal(false)} style={{ padding: '14px' }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Filters & Search */}
      <div className="panel-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['All', 'Completed', 'Confirmed', 'Pending', 'Cancelled'].map((st) => (
              <button
                key={st}
                type="button"
                className={`action-btn ${statusFilter === st ? 'gold' : ''}`}
                onClick={() => setStatusFilter(st)}
              >
                {st}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <select className="addon-select" style={{ width: 'auto', padding: '8px 14px' }} value={destFilter} onChange={(e) => setDestFilter(e.target.value)}>
              <option value="All">All Destinations</option>
              <option value="Tokyo">Tokyo</option>
              <option value="Bali">Bali</option>
              <option value="Singapore">Singapore</option>
            </select>
            <input
              type="text"
              className="form-input"
              style={{ width: '240px', padding: '8px 14px' }}
              placeholder="Search guest, code, hotel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Guest</th>
                <th>Destination & Hotel</th>
                <th>Blueprint & Add-on</th>
                <th>Travel Date</th>
                <th>Total</th>
                <th>Workflow Status</th>
                <th>Workflow & Archive Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((b) => (
                <tr key={b._id}>
                  <td style={{ fontWeight: 700, color: 'var(--accent-gold)' }}>{b.bookingCode}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{b.guestName}</div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>{b.email}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{b.destination}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{b.hotelName}</div>
                  </td>
                  <td>
                    <div>{b.duration}</div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>{b.addonSelected}</div>
                  </td>
                  <td>{b.travelDate}</td>
                  <td style={{ fontWeight: 700 }}>${Number(b.totalCost).toLocaleString()}</td>
                  <td>
                    <span className={`status-badge status-${b.status.toLowerCase()}`}>
                      {b.status}
                    </span>
                  </td>
                  <td>
                    {!isAdmin && <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Handled by admin</span>}
                    {isAdmin && b.status === 'Pending' && (
                      <button
                        type="button"
                        className="action-btn gold"
                        onClick={() => onUpdateStatus(b._id, 'Confirmed')}
                        title="Step 2: Confirm Booking"
                      >
                        <i className="fa-solid fa-check"></i> Confirm
                      </button>
                    )}
                    {isAdmin && b.status === 'Confirmed' && (
                      <button
                        type="button"
                        className="action-btn emerald"
                        onClick={() => onUpdateStatus(b._id, 'Completed')}
                        title="Step 3: Mark Transaction Completed"
                      >
                        <i className="fa-solid fa-flag-checkered"></i> Complete
                      </button>
                    )}
                    {isAdmin && (
                      <button
                        type="button"
                        className="action-btn danger"
                        onClick={() => onArchiveBooking(b._id)}
                        title="Move to Archive Module"
                      >
                        <i className="fa-solid fa-box-archive"></i> Archive
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TransactionsPage;
