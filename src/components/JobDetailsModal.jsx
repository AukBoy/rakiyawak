import React, { useState } from 'react';
import { applyToJob } from '../utils/db';

export default function JobDetailsModal({ job, currentUser, onApplied, isAlreadyApplied, onClose, onOpenAuth }) {
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleApplySubmit = (e) => {
    e.preventDefault();
    if (!currentUser) return;
    setError('');
    setSubmitting(true);

    try {
      applyToJob(job.id, currentUser.id, coverLetter);
      onApplied();
      setShowApplyForm(false);
      setCoverLetter('');
    } catch (err) {
      setError(err.message || 'Failed to submit application.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-content-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div className="avatar" style={{ borderRadius: '12px', width: '56px', height: '56px', fontSize: '1.2rem' }}>
              {job.logoText}
            </div>
            <div>
              <h3 className="modal-title text-gradient">{job.title}</h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                {job.companyName} • <span style={{ color: 'var(--text-muted)' }}>{job.department}</span>
              </p>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {/* Top Quick Meta */}
          <div className="grid-3" style={{ marginBottom: '32px', gap: '16px' }}>
            <div className="card" style={{ padding: '16px', textAlign: 'center', background: 'rgba(255,255,255,0.02)' }}>
              <span style={{ fontSize: '1.5rem' }}>📍</span>
              <h5 style={{ marginTop: '8px', fontWeight: 600 }}>Location</h5>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{job.location}</p>
            </div>
            <div className="card" style={{ padding: '16px', textAlign: 'center', background: 'rgba(255,255,255,0.02)' }}>
              <span style={{ fontSize: '1.5rem' }}>💰</span>
              <h5 style={{ marginTop: '8px', fontWeight: 600 }}>Salary Range</h5>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{job.salary}</p>
            </div>
            <div className="card" style={{ padding: '16px', textAlign: 'center', background: 'rgba(255,255,255,0.02)' }}>
              <span style={{ fontSize: '1.5rem' }}>💼</span>
              <h5 style={{ marginTop: '8px', fontWeight: 600 }}>Job Type</h5>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{job.type} ({job.experience.split(' ')[0]})</p>
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: '32px' }}>
            <h4 style={{ fontSize: '1.25rem', marginBottom: '12px', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>Job Description</h4>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.95rem', whiteSpace: 'pre-line' }}>{job.description}</p>
          </div>

          {/* Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <div style={{ marginBottom: '32px' }}>
              <h4 style={{ fontSize: '1.25rem', marginBottom: '12px', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>Requirements</h4>
              <ul style={{ listStyle: 'none', paddingLeft: '4px' }}>
                {job.requirements.map((req, idx) => (
                  <li key={idx} style={{ color: 'var(--text-secondary)', marginBottom: '8px', display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.95rem' }}>
                    <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>✓</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Benefits */}
          {job.benefits && job.benefits.length > 0 && (
            <div style={{ marginBottom: '32px' }}>
              <h4 style={{ fontSize: '1.25rem', marginBottom: '12px', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>Benefits & Perks</h4>
              <ul style={{ listStyle: 'none', paddingLeft: '4px' }}>
                {job.benefits.map((ben, idx) => (
                  <li key={idx} style={{ color: 'var(--text-secondary)', marginBottom: '8px', display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.95rem' }}>
                    <span style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>✦</span>
                    <span>{ben}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Apply Form Toggle or Success State */}
          <div className="divider"></div>

          {currentUser && currentUser.role === 'employer' ? (
            <div className="badge badge-primary" style={{ display: 'block', width: '100%', padding: '16px', textTransform: 'none', textAlign: 'center', borderRadius: '12px' }}>
              ℹ️ <strong>Employer view</strong>: Job seekers will apply to this posting. You can manage candidates in your Employer Dashboard.
            </div>
          ) : isAlreadyApplied ? (
            <div className="badge badge-secondary" style={{ display: 'block', width: '100%', padding: '16px', textTransform: 'none', textAlign: 'center', borderRadius: '12px', fontSize: '0.95rem' }}>
              🎉 <strong>Application Submitted!</strong> You have already applied for this job. Check your Seeker Dashboard to track its status.
            </div>
          ) : showApplyForm ? (
            <form onSubmit={handleApplySubmit} className="card" style={{ background: 'var(--bg-tertiary)', marginTop: '20px' }}>
              <h4 style={{ marginBottom: '16px' }}>Submit Your Application</h4>
              {error && <div className="badge badge-danger" style={{ display: 'block', padding: '10px', marginBottom: '16px', textTransform: 'none' }}>{error}</div>}
              
              <div className="form-group">
                <label className="form-label">Cover Letter / Supporting Notes *</label>
                <textarea 
                  className="form-control" 
                  rows="5"
                  placeholder="Explain why you are a good fit for this role, highlight relevant experience..."
                  value={coverLetter}
                  onChange={e => setCoverLetter(e.target.value)}
                  required
                ></textarea>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowApplyForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Send Application'}
                </button>
              </div>
            </form>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h5 style={{ fontWeight: 600 }}>Ready to Apply?</h5>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {currentUser ? 'Your profile details and resume will be sent to the hiring manager.' : 'Log in or sign up as a Job Seeker to apply.'}
                </p>
              </div>
              {currentUser ? (
                <button className="btn btn-primary animate-pulse-glow" onClick={() => setShowApplyForm(true)}>
                  Apply Now 🚀
                </button>
              ) : (
                <button className="btn btn-primary" onClick={() => onOpenAuth('login')}>
                  Log In to Apply
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
