import React from 'react';

export default function JobCard({ job, isBookmarked, onToggleBookmark, onViewDetails, isLoggedIn }) {
  const getDaysAgo = (dateString) => {
    const created = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - created);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  const getBadgeClass = (type) => {
    switch (type) {
      case 'Full-time': return 'badge-primary';
      case 'Remote': return 'badge-secondary';
      case 'Internship': return 'badge-accent';
      default: return 'badge-outline';
    }
  };

  return (
    <div className="card card-hover" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div className="avatar" style={{ fontSize: '0.9rem', width: '48px', height: '48px', borderRadius: '12px' }}>
            {job.logoText || 'CG'}
          </div>
          <div>
            <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>{job.title}</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              {job.companyName} • <span style={{ color: 'var(--text-muted)' }}>{job.department}</span>
            </p>
          </div>
        </div>

        {/* Bookmark Button */}
        {isLoggedIn && (
          <button 
            className="btn-icon" 
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark(job.id);
            }}
            style={{ 
              width: '36px', 
              height: '36px', 
              borderRadius: '8px',
              color: isBookmarked ? 'var(--accent)' : 'var(--text-secondary)',
              borderColor: isBookmarked ? 'var(--accent)' : 'var(--border)',
              background: isBookmarked ? 'var(--accent-glow)' : 'var(--bg-tertiary)'
            }}
            title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Job'}
          >
            ★
          </button>
        )}
      </div>

      {/* Description Snippet */}
      <p style={{ 
        fontSize: '0.9rem', 
        color: 'var(--text-secondary)', 
        marginBottom: '20px', 
        lineHeight: 1.5,
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        flex: 1
      }}>
        {job.description}
      </p>

      {/* Meta Specs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          <span>📍</span> {job.location}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          <span>💰</span> {job.salary}
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'var(--border)', marginBottom: '16px' }}></div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <span className={`badge ${getBadgeClass(job.type)}`}>{job.type}</span>
          <span className="badge" style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
            {job.experience.split(' ')[0]}
          </span>
        </div>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {getDaysAgo(job.createdAt)}
        </span>
      </div>

      <button 
        className="btn btn-secondary btn-sm" 
        onClick={() => onViewDetails(job)}
        style={{ width: '100%', marginTop: '20px' }}
      >
        View Details & Apply
      </button>
    </div>
  );
}
