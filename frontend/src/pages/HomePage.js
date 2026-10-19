import React from 'react';
import { Link } from 'react-router-dom';

function HomePage({ completedCount, activeUsersCount }) {
  return (
    <div>
      <header className="hero">
        <div className="hero-content">
          <div style={{ display: 'inline-block', padding: '6px 16px', borderRadius: '30px', background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.4)', color: 'var(--accent-gold)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '18px' }}>
            Target Client: Mitsu Travel & Tours
          </div>
          <h1>Curated Journeys. <br />Unrivaled Luxury.</h1>
          <p>
            Elevate your travel experience with bespoke itineraries designed for the modern explorer.
            From skyline penthouses in Tokyo to jungle sanctuaries in Bali and Marina Bay suites in Singapore.
          </p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#destinations" className="cta-btn">Explore Collections</a>
            <Link to="/transactions" className="action-btn" style={{ padding: '14px 28px', borderRadius: '30px', fontSize: '0.9rem', textDecoration: 'none' }}>
              View {completedCount} Completed Bookings
            </Link>
          </div>
        </div>
      </header>

      <main className="container">
        <section className="features-grid">
         
         
         
        </section>

        <section className="about-section">
          <div>
            <h2 style={{ fontSize: '2.2rem', marginTop: 0 }}>
              Redefining the <span style={{ color: 'var(--accent-gold)' }}>Modern Escape</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              <strong>Target Client Organization:</strong> Mitsu Travel & Tours is a boutique luxury travel agency specializing in high-end Asian destinations. This Reservation & Transaction Management System centralizes client account registration, bespoke hotel & itinerary booking, live price calculation, and administrative record archiving.
            </p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              Whether securing a boutique suite in Shibuya for urban photography or chartering a private yacht off the limestone cliffs of Bali, our system manages every client journey from initial reservation through completion.
            </p>
            <div style={{ display: 'flex', gap: '24px', marginTop: '24px', flexWrap: 'wrap' }}>
              <div>
                <strong style={{ fontSize: '1.8rem', color: 'var(--accent-gold)', display: 'block' }}>3</strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Exclusive Destinations</span>
              </div>
              <div>
                <strong style={{ fontSize: '1.8rem', color: 'var(--accent-gold)', display: 'block' }}>{activeUsersCount}</strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Registered Accounts</span>
              </div>
              <div>
                <strong style={{ fontSize: '1.8rem', color: 'var(--accent-gold)', display: 'block' }}>{completedCount}</strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Completed Transactions</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ height: '280px', borderRadius: '14px', backgroundSize: 'cover', backgroundPosition: 'center', backgroundImage: "url('https://images.unsplash.com/photo-1542314831-c6a4d140b2cc?q=80&w=600&auto=format&fit=crop')", border: '1px solid var(--border-subtle)' }} />
            <div style={{ height: '280px', borderRadius: '14px', backgroundSize: 'cover', backgroundPosition: 'center', backgroundImage: "url('https://images.unsplash.com/photo-1480796927426-f609979314bd?q=80&w=600&auto=format&fit=crop')", border: '1px solid var(--border-subtle)' }} />
          </div>
        </section>

        <section id="destinations">
          <h2 className="section-title">Select Your <span>Destination</span></h2>
          <div className="destination-grid">
            <Link to="/destination/tokyo" className="dest-card">
              <div className="dest-img" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=800&auto=format&fit=crop')" }} />
              <div className="dest-info">
                <h2>Tokyo</h2>
                <p>Urban Culture & Neon Skylines</p>
                <div className="explore-btn">
                  <span>View Collection</span>
                  <i className="fa-solid fa-arrow-right"></i>
                </div>
              </div>
            </Link>

            <Link to="/destination/bali" className="dest-card">
              <div className="dest-img" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=800&auto=format&fit=crop')" }} />
              <div className="dest-info">
                <h2>Bali</h2>
                <p>Cliffside Luxury & Deep Jungle</p>
                <div className="explore-btn">
                  <span>View Collection</span>
                  <i className="fa-solid fa-arrow-right"></i>
                </div>
              </div>
            </Link>

            <Link to="/destination/singapore" className="dest-card">
              <div className="dest-img" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=800&auto=format&fit=crop')" }} />
              <div className="dest-info">
                <h2>Singapore</h2>
                <p>Futuristic Architecture & Resort Life</p>
                <div className="explore-btn">
                  <span>View Collection</span>
                  <i className="fa-solid fa-arrow-right"></i>
                </div>
              </div>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

export default HomePage;
