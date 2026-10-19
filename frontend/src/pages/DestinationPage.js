import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { DESTINATIONS } from '../data/destinationsData';

function DestinationPage({ currentUser, onCreateBooking }) {
  const { city } = useParams();
  const navigate = useNavigate();
  const destination = DESTINATIONS[city] || DESTINATIONS.tokyo;

  const [selectedHotel, setSelectedHotel] = useState(destination.hotels[0]);
  const [duration, setDuration] = useState(5);
  const [addonIndex, setAddonIndex] = useState(0);
  const [guestName, setGuestName] = useState(currentUser ? currentUser.fullName : '');
  const [email, setEmail] = useState(currentUser ? currentUser.email : '');
  const [phone, setPhone] = useState(currentUser ? currentUser.phone : '+63 917 550 2011');
  const [travelDate, setTravelDate] = useState('2026-11-20');
  const [guestsCount, setGuestsCount] = useState(2);
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [submitMessage, setSubmitMessage] = useState('');

  const mapRef = useRef(null);
  const leafletMapInstance = useRef(null);
  const leafletMarkerInstance = useRef(null);

  useEffect(() => {
    const firstHotel = (DESTINATIONS[city] || DESTINATIONS.tokyo).hotels[0];
    setSelectedHotel(firstHotel);
    setDuration(5);
    setAddonIndex(0);
    setSubmitMessage('');
  }, [city]);

  useEffect(() => {
    if (currentUser) {
      setGuestName(currentUser.fullName);
      setEmail(currentUser.email);
      setPhone(currentUser.phone || '+63 917 550 2011');
    }
  }, [currentUser]);

  // Initialize or update Leaflet Map when selectedHotel changes
  useEffect(() => {
    if (!window.L || !mapRef.current || !selectedHotel) return;

    if (!leafletMapInstance.current) {
      leafletMapInstance.current = window.L.map(mapRef.current).setView([selectedHotel.lat, selectedHotel.lng], 14);
      window.L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap'
      }).addTo(leafletMapInstance.current);
      leafletMarkerInstance.current = window.L.marker([selectedHotel.lat, selectedHotel.lng]).addTo(leafletMapInstance.current);
    } else {
      leafletMapInstance.current.setView([selectedHotel.lat, selectedHotel.lng], 14);
      if (leafletMarkerInstance.current) {
        leafletMarkerInstance.current.setLatLng([selectedHotel.lat, selectedHotel.lng]);
      }
    }

    setTimeout(() => {
      if (leafletMapInstance.current) {
        leafletMapInstance.current.invalidateSize();
      }
    }, 250);
  }, [selectedHotel]);

  const currentAddon = destination.addons[addonIndex] || destination.addons[0];
  const totalCost = selectedHotel.pricePerNight * duration + currentAddon.cost;

  const daysList = duration === 7
    ? [...selectedHotel.fiveDays, ...selectedHotel.sevenDays]
    : selectedHotel.fiveDays;

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      setSubmitMessage('Please log in or create an account first to book a trip.');
      return;
    }
    const newBookingPayload = {
      bookingCode: 'MTT-' + Math.floor(202625 + Math.random() * 7000),
      guestName,
      email,
      phone,
      destination: destination.name,
      hotelName: selectedHotel.name,
      itineraryTitle: selectedHotel.itineraryTitle,
      duration: `${duration} Days`,
      addonSelected: currentAddon.shortName,
      travelDate,
      guestsCount: Number(guestsCount),
      totalCost,
      paymentMethod
    };

    await onCreateBooking(newBookingPayload);
    setSubmitMessage('Reservation inquiry submitted! Redirecting to Transactions...');
    setTimeout(() => {
      navigate('/transactions');
    }, 1500);
  };

  return (
    <div>
      <header className="sub-hero">
        <div style={{ marginBottom: '12px' }}>
          <Link to="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem' }}>
            <i className="fa-solid fa-arrow-left"></i> Back to Destinations
          </Link>
        </div>
        <h1>{destination.name} Collections</h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
          {destination.subtitle}
        </p>
      </header>

      <main className="container">
        <section className="hotel-grid">
          {destination.hotels.map((hotel) => (
            <article
              key={hotel.id}
              className={`hotel-card ${selectedHotel.id === hotel.id ? 'active' : ''}`}
              onClick={() => setSelectedHotel(hotel)}
            >
              <div className="hotel-img" style={{ backgroundImage: `url('${hotel.image}')` }} />
              <div className="hotel-info">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{hotel.name}</h3>
                  <span style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>${hotel.pricePerNight}/night</span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0 }}>
                  {hotel.desc}
                </p>
              </div>
            </article>
          ))}
        </section>

        <section className="booking-portal">
          <div className="portal-grid">
            <div className="itinerary-box">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
                <h2 style={{ margin: 0, fontSize: '1.7rem' }}>{selectedHotel.itineraryTitle}</h2>
                <span className="status-badge status-pending">{selectedHotel.name}</span>
              </div>

              <div ref={mapRef} className="map-container" />

              <div className="duration-toggle">
                <button
                  type="button"
                  className={`toggle-btn ${duration === 5 ? 'active' : ''}`}
                  onClick={() => setDuration(5)}
                >
                  5-Day Blueprint
                </button>
                <button
                  type="button"
                  className={`toggle-btn ${duration === 7 ? 'active' : ''}`}
                  onClick={() => setDuration(7)}
                >
                  7-Day Blueprint
                </button>
              </div>

              <div>
                {daysList.map((item, idx) => (
                  <div key={idx} className="timeline-item">
                    <div className="timeline-day">{item.day}</div>
                    <div className="timeline-desc">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="price-calculator">
                <h4 style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                  Estimated Package Total
                </h4>
                <p className="total-price">${totalCost.toLocaleString()}</p>
                <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  Calculated for <strong>{duration} nights</strong> at ${selectedHotel.pricePerNight}/night
                  {currentAddon.cost > 0 ? ` + $${currentAddon.cost} Add-on` : ''}
                </p>
              </div>

              <div className="addon-section" style={{ marginBottom: '22px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                  Optional Enhancements
                </label>
                <select
                  className="addon-select"
                  value={addonIndex}
                  onChange={(e) => setAddonIndex(Number(e.target.value))}
                >
                  {destination.addons.map((addon, idx) => (
                    <option key={idx} value={idx}>{addon.label}</option>
                  ))}
                </select>

                {currentAddon.cost > 0 && (
                  <div style={{ marginTop: '14px', padding: '14px', background: 'rgba(212, 175, 55, 0.06)', borderLeft: '3px solid var(--accent-gold)', borderRadius: '0 8px 8px 0', fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                    <strong style={{ color: 'var(--accent-gold)', display: 'block', marginBottom: '4px' }}>
                      {currentAddon.shortName}
                    </strong>
                    {currentAddon.desc}
                  </div>
                )}
              </div>

              <div className="form-box">
                <h3 style={{ marginTop: 0, marginBottom: '16px' }}>Confirm Reservation Inquiry</h3>
                {submitMessage && (
                  <div style={{ padding: '12px', background: 'rgba(42, 157, 143, 0.2)', border: '1px solid #2a9d8f', color: '#3ec1b1', borderRadius: '8px', marginBottom: '14px', fontSize: '0.88rem' }}>
                    {submitMessage}
                  </div>
                )}
                <form onSubmit={handleBookingSubmit}>
                  <div className="form-group">
                    <label>Primary Guest Name</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="Enter full name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Contact Email</label>
                    <input
                      type="email"
                      className="form-input"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="guest@example.com"
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="form-group">
                      <label>Travel Date</label>
                      <input
                        type="date"
                        className="form-input"
                        required
                        value={travelDate}
                        onChange={(e) => setTravelDate(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Guests</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        className="form-input"
                        required
                        value={guestsCount}
                        onChange={(e) => setGuestsCount(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Payment Method</label>
                    <select
                      className="addon-select"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                      <option value="Credit Card">Credit Card</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="GCash / E-Wallet">GCash / E-Wallet</option>
                    </select>
                  </div>
                  <button type="submit" className="submit-btn">
                    Submit Booking Transaction
                  </button>
                </form>
              </div>

              <button
                type="button"
                onClick={() => window.print()}
                className="action-btn print-hide"
                style={{ width: '100%', padding: '14px', marginTop: '14px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
              >
                <i className="fa-solid fa-file-pdf"></i> Download / Print PDF Itinerary
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default DestinationPage;
