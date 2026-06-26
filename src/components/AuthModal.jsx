import React, { useState } from 'react';
import { login, signup } from '../utils/db';

export default function AuthModal({ initialMode = 'login', onClose, onAuthSuccess }) {
  const [mode, setMode] = useState(initialMode); // 'login' or 'signup'
  const [role, setRole] = useState('seeker'); // 'seeker' or 'employer'
  const [error, setError] = useState('');
  
  // Form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [companyName, setCompanyName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    try {
      if (mode === 'login') {
        const user = login(email, password, role);
        onAuthSuccess(user);
        onClose();
      } else {
        // Validation
        if (!email || !password || !name) {
          throw new Error('Please fill in all required fields.');
        }
        
        let extra = { phone, location };
        if (role === 'employer') {
          if (!companyName) throw new Error('Company name is required for employers.');
          extra.companyName = companyName;
        }

        const user = signup(email, password, name, role, extra);
        onAuthSuccess(user);
        onClose();
      }
    } catch (err) {
      setError(err.message || 'An error occurred during authentication.');
    }
  };

  const handleDemoLogin = (demoRole) => {
    setError('');
    try {
      let user;
      if (demoRole === 'seeker') {
        user = login('seeker@rakiyawak.lk', 'password', 'seeker');
      } else {
        user = login('employer@rakiyawak.lk', 'password', 'employer');
      }
      onAuthSuccess(user);
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title text-gradient">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {error && (
            <div className="badge badge-danger" style={{ display: 'block', width: '100%', padding: '12px', marginBottom: '20px', textTransform: 'none', borderRadius: '8px' }}>
              {error}
            </div>
          )}

          {/* Mode Switcher */}
          <div className="pills-container" style={{ justifyContent: 'center', marginBottom: '24px' }}>
            <button 
              type="button"
              className={`pill-btn ${mode === 'login' ? 'active' : ''}`}
              onClick={() => { setMode('login'); setError(''); }}
              style={{ padding: '8px 24px', flex: 1 }}
            >
              Log In
            </button>
            <button 
              type="button"
              className={`pill-btn ${mode === 'signup' ? 'active' : ''}`}
              onClick={() => { setMode('signup'); setError(''); }}
              style={{ padding: '8px 24px', flex: 1 }}
            >
              Sign Up
            </button>
          </div>

          {/* Role Switcher */}
          <div className="form-group">
            <span className="form-label">I am a:</span>
            <div style={{ display: 'flex', gap: '16px' }}>
              <label className="card" style={{ flex: 1, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', borderColor: role === 'seeker' ? 'var(--primary)' : 'var(--border)' }}>
                <input 
                  type="radio" 
                  name="auth-role" 
                  checked={role === 'seeker'} 
                  onChange={() => setRole('seeker')}
                  style={{ accentColor: 'var(--primary)' }}
                />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Job Seeker</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Find and apply to jobs</span>
                </div>
              </label>
              <label className="card" style={{ flex: 1, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', borderColor: role === 'employer' ? 'var(--primary)' : 'var(--border)' }}>
                <input 
                  type="radio" 
                  name="auth-role" 
                  checked={role === 'employer'} 
                  onChange={() => setRole('employer')}
                  style={{ accentColor: 'var(--primary)' }}
                />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Employer</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Post jobs & hire talent</span>
                </div>
              </label>
            </div>
          </div>

          {/* Common Fields */}
          {mode === 'signup' && (
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Enter your name" 
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
          )}

          {mode === 'signup' && role === 'employer' && (
            <div className="form-group">
              <label className="form-label">Company Name *</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Enter company name" 
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input 
              type="email" 
              className="form-control" 
              placeholder="name@example.com" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password *</label>
            <input 
              type="password" 
              className="form-control" 
              placeholder="••••••••" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          {mode === 'signup' && (
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. 077 123 4567" 
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Location</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. Colombo, LK" 
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                />
              </div>
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '12px', padding: '12px' }}
          >
            {mode === 'login' ? 'Log In' : 'Create Account'}
          </button>

          <div className="divider" style={{ margin: '24px 0 16px 0' }}></div>
          
          <div style={{ textAlign: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Or Test Instantly with Demo Accounts:</span>
          </div>

          <div className="grid-2">
            <button 
              type="button" 
              className="btn btn-outline btn-sm"
              onClick={() => handleDemoLogin('seeker')}
              style={{ display: 'flex', flexDirection: 'column', height: '54px', gap: '2px', padding: '8px' }}
            >
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Demo Job Seeker</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>seeker@rakiyawak.lk</span>
            </button>
            <button 
              type="button" 
              className="btn btn-outline btn-sm"
              onClick={() => handleDemoLogin('employer')}
              style={{ display: 'flex', flexDirection: 'column', height: '54px', gap: '2px', padding: '8px' }}
            >
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Demo Employer</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>employer@rakiyawak.lk</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
