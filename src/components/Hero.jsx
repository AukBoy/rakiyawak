import React from 'react';

export default function Hero({ 
  searchQuery, 
  setSearchQuery, 
  locationQuery, 
  setLocationQuery, 
  selectedType, 
  setSelectedType,
  selectedExp,
  setSelectedExp
}) {
  const jobTypes = ['All Types', 'Full-time', 'Part-time', 'Remote', 'Contract', 'Internship'];
  const expLevels = ['All Experience', 'Internship (Undergraduate)', 'Associate (1-2 years)', 'Mid-Level (2-4 years)', 'Senior (5+ years)'];

  return (
    <div style={{ 
      background: 'linear-gradient(180deg, rgba(99, 102, 241, 0.15) 0%, transparent 100%)', 
      padding: '80px 0 60px 0', 
      textAlign: 'center',
      position: 'relative'
    }}>
      <div className="container" style={{ position: 'relative', zIndex: 5 }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '16px', lineHeight: 1.1 }}>
          Find Your Next <span className="text-gradient-accent">Dream Job</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 48px auto' }}>
          Discover thousands of job opportunities in Sri Lanka with premium employers. Build your profile, apply in one click, and track your progress.
        </p>

        {/* Search Bar */}
        <div className="search-container">
          <div className="search-input-group">
            <span className="search-icon">🔍</span>
            <input 
              type="text" 
              className="search-field" 
              placeholder="Job title, company, skills..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="search-input-group">
            <span className="search-icon">📍</span>
            <input 
              type="text" 
              className="search-field" 
              placeholder="City or 'Remote'" 
              value={locationQuery}
              onChange={e => setLocationQuery(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" style={{ padding: '0 32px', height: '48px' }}>
            Search
          </button>
        </div>

        {/* Filter Pills */}
        <div style={{ marginTop: '48px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
            {/* Job Types */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Type:</span>
              <div className="pills-container" style={{ margin: 0 }}>
                {jobTypes.map(type => (
                  <button
                    key={type}
                    className={`pill-btn ${selectedType === type ? 'active' : ''}`}
                    onClick={() => setSelectedType(type)}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Experience Levels */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Experience:</span>
              <div className="pills-container" style={{ margin: 0 }}>
                {expLevels.map(exp => {
                  const label = exp === 'All Experience' ? 'All Experience' : exp.split(' ')[0];
                  const isActive = selectedExp === exp || (selectedExp === 'All Experience' && exp === 'All Experience');
                  return (
                    <button
                      key={exp}
                      className={`pill-btn ${isActive ? 'active' : ''}`}
                      onClick={() => setSelectedExp(exp)}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
