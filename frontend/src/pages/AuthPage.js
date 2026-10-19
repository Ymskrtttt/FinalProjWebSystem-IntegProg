import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// accounts must use a Gmail address
const isGmail = (email) => /^[^\s@]+@gmail\.com$/i.test(email.trim());

function AuthPage({ users, onLogin, onRegister }) {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register State (new accounts are always clients)
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    const result = await onLogin(loginEmail, loginPassword);
    if (result.success) {
      navigate('/profile');
    } else {
      setError(result.message);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!isGmail(regEmail)) {
      setError('Please use a Gmail address (example: juan@gmail.com).');
      return;
    }

    const result = await onRegister({
      fullName: regName,
      email: regEmail.trim().toLowerCase(),
      password: regPassword
    });
    if (result.success) {
      setMessage('Registration successful! Redirecting to your account...');
      setTimeout(() => navigate('/profile'), 1000);
    } else {
      setError(result.message);
    }
  };

  const quickDemoLogin = async (email, password) => {
    const result = await onLogin(email, password);
    if (result.success) {
      navigate('/profile');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '580px' }}>
      <div className="panel-card">
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 style={{ margin: '0 0 8px 0' }}>Account <span style={{ color: 'var(--accent-gold)' }}>Management</span></h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
            Sign in or create a client account with your Gmail address.
          </p>
        </div>

        {/* Mode Switcher */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', background: 'rgba(0,0,0,0.4)', padding: '6px', borderRadius: '12px' }}>
          <button
            type="button"
            className={`toggle-btn ${mode === 'login' ? 'active' : ''}`}
            style={{ flex: 1 }}
            onClick={() => { setMode('login'); setError(''); setMessage(''); }}
          >
            Login
          </button>
          <button
            type="button"
            className={`toggle-btn ${mode === 'register' ? 'active' : ''}`}
            style={{ flex: 1 }}
            onClick={() => { setMode('register'); setError(''); setMessage(''); }}
          >
            Register
          </button>
        </div>

        {error && (
          <div style={{ padding: '12px', background: 'rgba(230, 57, 70, 0.16)', border: '1px solid #e63946', color: '#ff5a67', borderRadius: '8px', marginBottom: '16px', fontSize: '0.88rem' }}>
            {error}
          </div>
        )}

        {message && (
          <div style={{ padding: '12px', background: 'rgba(42, 157, 143, 0.2)', border: '1px solid #2a9d8f', color: '#3ec1b1', borderRadius: '8px', marginBottom: '16px', fontSize: '0.88rem' }}>
            {message}
          </div>
        )}

        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                className="form-input"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="yourname@gmail.com"
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                className="form-input"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Enter password"
              />
            </div>
            <button type="submit" className="submit-btn">Sign In</button>

            <div style={{ marginTop: '24px', paddingTop: '18px', borderTop: '1px solid var(--border-subtle)' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                Quick Presentation Demo Accounts (Click to sign in):
              </p>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="action-btn gold"
                  onClick={() => quickDemoLogin('kenji.mitsu@gmail.com', 'mitsukumar')}
                >
                  Admin: Kenji Mitsu
                </button>
                <button
                  type="button"
                  className="action-btn"
                  onClick={() => quickDemoLogin('marco.villanueva@gmail.com', 'client123')}
                >
                  Client: Marco Villanueva
                </button>
                <button
                  type="button"
                  className="action-btn"
                  onClick={() => quickDemoLogin('camille.santos@gmail.com', 'client123')}
                >
                  Client: Camille Santos
                </button>
              </div>
            </div>
          </form>
        )}

        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                className="form-input"
                required
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="Juan Dela Cruz"
              />
            </div>
            <div className="form-group">
              <label>Gmail Address</label>
              <input
                type="email"
                className="form-input"
                required
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="juan@gmail.com"
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                className="form-input"
                required
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="Create a password"
              />
            </div>
            <button type="submit" className="submit-btn">Create Account</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default AuthPage;
