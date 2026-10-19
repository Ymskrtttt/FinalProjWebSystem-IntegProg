import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function UserManagementPage({ users, currentUser, onAddUser, onUpdateUser, onArchiveUser }) {
  const [showAddUser, setShowAddUser] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editForm, setEditForm] = useState({ fullName: '', phone: '', role: 'client' });

  // New User Form
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('+63 917 000 0000');
  const [newPassword, setNewPassword] = useState('client123');
  const [newRole, setNewRole] = useState('client');
  const [addError, setAddError] = useState('');

  // admins only
  if (!currentUser) {
    return (
      <div className="container" style={{ textAlign: 'center' }}>
        <div className="panel-card">
          <h2>Please Sign In</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Log in with an admin account to manage users.</p>
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
          <p style={{ color: 'var(--text-secondary)' }}>Your account does not have permission to manage users.</p>
          <Link to="/" className="cta-btn">Back to Home</Link>
        </div>
      </div>
    );
  }

  const activeUsers = users.filter((u) => !u.isArchived);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setAddError('');

    if (!/^[^\s@]+@gmail\.com$/i.test(newEmail.trim())) {
      setAddError('Please use a Gmail address (example: elena@gmail.com).');
      return;
    }

    const result = await onAddUser({
      fullName: newName,
      email: newEmail.trim().toLowerCase(),
      phone: newPhone,
      password: newPassword,
      role: newRole
    });

    if (!result.success) {
      setAddError(result.message);
      return;
    }
    setNewName('');
    setNewEmail('');
    setShowAddUser(false);
  };

  const startEdit = (user) => {
    setEditingUserId(user._id);
    setEditForm({ fullName: user.fullName, phone: user.phone, role: user.role });
  };

  const saveEdit = async (id) => {
    await onUpdateUser(id, editForm);
    setEditingUserId(null);
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '24px' }}>
        <div>
          <h2 style={{ margin: '0 0 6px 0' }}>Admin User <span style={{ color: 'var(--accent-gold)' }}>Management</span></h2>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            View registered accounts ({activeUsers.length} active users — exceeds minimum requirement of 10), manage roles, or archive accounts.
          </p>
        </div>
        <button type="button" className="cta-btn" onClick={() => setShowAddUser(!showAddUser)} style={{ padding: '10px 22px', fontSize: '0.85rem' }}>
          <i className="fa-solid fa-user-plus"></i> Add New User
        </button>
      </div>

      {showAddUser && (
        <div className="panel-card" style={{ borderColor: 'var(--accent-gold)' }}>
          <h3 style={{ marginTop: 0 }}>Add Registered User Account</h3>
          {addError && (
            <div style={{ padding: '12px', background: 'rgba(230, 57, 70, 0.16)', border: '1px solid #e63946', color: '#ff5a67', borderRadius: '8px', marginBottom: '16px', fontSize: '0.88rem' }}>
              {addError}
            </div>
          )}
          <form onSubmit={handleAddSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" className="form-input" required value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Elena Gomez" />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" className="form-input" required value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="elena@gmail.com" />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input type="text" className="form-input" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Default Password</label>
              <input type="text" className="form-input" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Role & Permissions</label>
              <select className="addon-select" value={newRole} onChange={(e) => setNewRole(e.target.value)}>
                <option value="client">Client (Standard Booking Access)</option>
                <option value="admin">Admin (Full System Management)</option>
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', marginBottom: '14px' }}>
              <button type="submit" className="submit-btn">Create User</button>
              <button type="button" className="action-btn" onClick={() => setShowAddUser(false)} style={{ padding: '14px' }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="panel-card">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Email Address</th>
                <th>Phone</th>
                <th>Role & Permissions</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {activeUsers.map((u) => (
                <tr key={u._id}>
                  <td>
                    {editingUserId === u._id ? (
                      <input
                        type="text"
                        className="form-input"
                        value={editForm.fullName}
                        onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                      />
                    ) : (
                      <strong>{u.fullName}</strong>
                    )}
                  </td>
                  <td>{u.email}</td>
                  <td>
                    {editingUserId === u._id ? (
                      <input
                        type="text"
                        className="form-input"
                        value={editForm.phone}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      />
                    ) : (
                      u.phone
                    )}
                  </td>
                  <td>
                    {editingUserId === u._id ? (
                      <select
                        className="addon-select"
                        value={editForm.role}
                        onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                      >
                        <option value="client">client</option>
                        <option value="admin">admin</option>
                      </select>
                    ) : (
                      <span className={`status-badge ${u.role === 'admin' ? 'status-confirmed' : 'status-completed'}`}>
                        {u.role.toUpperCase()}
                      </span>
                    )}
                  </td>
                  <td>
                    {editingUserId === u._id ? (
                      <>
                        <button type="button" className="action-btn gold" onClick={() => saveEdit(u._id)}>Save</button>
                        <button type="button" className="action-btn" onClick={() => setEditingUserId(null)}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button type="button" className="action-btn" onClick={() => startEdit(u)}>
                          <i className="fa-solid fa-pen"></i> Edit
                        </button>
                        <button type="button" className="action-btn danger" onClick={() => onArchiveUser(u._id)}>
                          <i className="fa-solid fa-box-archive"></i> Archive
                        </button>
                      </>
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

export default UserManagementPage;
