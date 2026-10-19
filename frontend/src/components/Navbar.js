import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar({ currentUser, onLogout, activeBookingsCount, activeUsersCount, archivedCount }) {
  const location = useLocation();
  const [activeTheme, setActiveTheme] = useState('gold');

  const handleThemeChange = (themeKey, primaryHex, hoverHex) => {
    setActiveTheme(themeKey);
    document.documentElement.style.setProperty('--accent-gold', primaryHex);
    document.documentElement.style.setProperty('--accent-hover', hoverHex);
  };

  return (
    <nav className="main-nav">
      <Link to="/" className="logo">
        Mitsu<span>Travel</span>
      </Link>

      <div className="nav-links">
        <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
          <i className="fa-solid fa-compass"></i> Home
        </Link>
        <Link to="/destination/tokyo" className={`nav-link ${location.pathname === '/destination/tokyo' ? 'active' : ''}`}>
          Tokyo
        </Link>
        <Link to="/destination/bali" className={`nav-link ${location.pathname === '/destination/bali' ? 'active' : ''}`}>
          Bali
        </Link>
        <Link to="/destination/singapore" className={`nav-link ${location.pathname === '/destination/singapore' ? 'active' : ''}`}>
          Singapore
        </Link>
        {currentUser && (
          <Link to="/transactions" className={`nav-link ${location.pathname === '/transactions' ? 'active' : ''}`}>
            <i className="fa-solid fa-receipt"></i> {currentUser.role === 'admin' ? 'Transactions' : 'My Bookings'} ({activeBookingsCount})
          </Link>
        )}
        {currentUser && currentUser.role === 'admin' && (
          <>
            <Link to="/users" className={`nav-link ${location.pathname === '/users' ? 'active' : ''}`}>
              <i className="fa-solid fa-users-gear"></i> Users ({activeUsersCount})
            </Link>
            <Link to="/archive" className={`nav-link ${location.pathname === '/archive' ? 'active' : ''}`}>
              <i className="fa-solid fa-box-archive"></i> Archive ({archivedCount})
            </Link>
          </>
        )}
      </div>

      <div className="nav-right">
        <div className="theme-switcher" title="Switch Theme Color">
          <div
            className={`theme-dot gold ${activeTheme === 'gold' ? 'active' : ''}`}
            onClick={() => handleThemeChange('gold', '#d4af37', '#f1c94f')}
            title="Signature Gold"
          />
          <div
            className={`theme-dot crimson ${activeTheme === 'crimson' ? 'active' : ''}`}
            onClick={() => handleThemeChange('crimson', '#e63946', '#ff5a67')}
            title="Tokyo Crimson"
          />
          <div
            className={`theme-dot cyber ${activeTheme === 'cyber' ? 'active' : ''}`}
            onClick={() => handleThemeChange('cyber', '#00f0ff', '#5cffff')}
            title="Cyberpunk Blue"
          />
          <div
            className={`theme-dot emerald ${activeTheme === 'emerald' ? 'active' : ''}`}
            onClick={() => handleThemeChange('emerald', '#2a9d8f', '#3ec1b1')}
            title="Jungle Emerald"
          />
        </div>

        {currentUser ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Link to="/profile" className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`}>
              <i className="fa-solid fa-user-shield"></i> {currentUser.fullName.split(' ')[0]} ({currentUser.role.toUpperCase()})
            </Link>
            <button onClick={onLogout} className="action-btn danger" style={{ margin: 0 }}>
              <i className="fa-solid fa-right-from-bracket"></i> Logout
            </button>
          </div>
        ) : (
          <Link to="/auth" className="cta-btn" style={{ padding: '8px 18px', fontSize: '0.8rem' }}>
            Login / Register
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
