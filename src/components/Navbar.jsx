import React, { useState } from 'react';

export default function Navbar({ currentUser, activeView, setView, onOpenAuth }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (view) => {
    setView(view);
    setMobileMenuOpen(false);
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <nav className="navbar">
      <div className="container nav-container">
        <div className="logo" onClick={() => handleNavClick('find-jobs')}>
          <div className="logo-icon">R</div>
          <span className="text-gradient">Rakiyawak</span>
        </div>

        {/* Desktop Menu */}
        <ul className="nav-menu">
          <li 
            className={`nav-item ${activeView === 'find-jobs' ? 'active' : ''}`}
            onClick={() => handleNavClick('find-jobs')}
          >
            Find Jobs
          </li>
          {currentUser && (
            <li 
              className={`nav-item ${activeView === 'dashboard' ? 'active' : ''}`}
              onClick={() => handleNavClick('dashboard')}
            >
              Dashboard
            </li>
          )}
          {currentUser && currentUser.role === 'employer' && (
            <li 
              className={`nav-item ${activeView === 'post-job' ? 'active' : ''}`}
              onClick={() => handleNavClick('post-job')}
            >
              Post a Job
            </li>
          )}
          {currentUser && (
            <li 
              className={`nav-item ${activeView === 'profile' ? 'active' : ''}`}
              onClick={() => handleNavClick('profile')}
            >
              My Profile
            </li>
          )}
        </ul>

        {/* User / Auth Actions */}
        <div className="nav-actions">
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div 
                className="avatar" 
                style={{ cursor: 'pointer' }} 
                onClick={() => handleNavClick('profile')}
                title={currentUser.name}
              >
                {currentUser.role === 'employer' ? (currentUser.logoText || 'CG') : getInitials(currentUser.name)}
              </div>
              <span className="nav-item" style={{ display: 'none', cursor: 'default' }}>
                {currentUser.name}
              </span>
              <button 
                className="btn btn-outline btn-sm"
                onClick={() => handleNavClick('logout')}
              >
                Log Out
              </button>
            </div>
          ) : (
            <>
              <button className="btn btn-outline btn-sm" onClick={() => onOpenAuth('login')}>
                Log In
              </button>
              <button className="btn btn-primary btn-sm" onClick={() => onOpenAuth('signup')}>
                Sign Up
              </button>
            </>
          )}

          <button 
            className="nav-mobile-toggle" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      {mobileMenuOpen && (
        <div className="mobile-nav-overlay">
          <span 
            className={`mobile-nav-link ${activeView === 'find-jobs' ? 'active' : ''}`}
            onClick={() => handleNavClick('find-jobs')}
          >
            Find Jobs
          </span>
          {currentUser && (
            <span 
              className={`mobile-nav-link ${activeView === 'dashboard' ? 'active' : ''}`}
              onClick={() => handleNavClick('dashboard')}
            >
              Dashboard
            </span>
          )}
          {currentUser && currentUser.role === 'employer' && (
            <span 
              className={`mobile-nav-link ${activeView === 'post-job' ? 'active' : ''}`}
              onClick={() => handleNavClick('post-job')}
            >
              Post a Job
            </span>
          )}
          {currentUser && (
            <span 
              className={`mobile-nav-link ${activeView === 'profile' ? 'active' : ''}`}
              onClick={() => handleNavClick('profile')}
            >
              My Profile
            </span>
          )}
        </div>
      )}
    </nav>
  );
}
