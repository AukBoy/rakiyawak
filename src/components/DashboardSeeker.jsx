import React, { useState, useEffect } from 'react';
import { getApplicationsForSeeker, getBookmarks, toggleBookmark, updateProfile } from '../utils/db';
import JobCard from './JobCard';

export default function DashboardSeeker({ currentUser, onViewJobDetails, onUpdateSessionUser }) {
  const [activeTab, setActiveTab] = useState('applications'); // 'applications', 'bookmarks', 'profile'
  const [applications, setApplications] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [expandedAppId, setExpandedAppId] = useState(null);

  // Profile Form States
  const [name, setName] = useState(currentUser.name || '');
  const [title, setTitle] = useState(currentUser.title || '');
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [location, setLocation] = useState(currentUser.location || '');
  const [bio, setBio] = useState(currentUser.bio || '');
  const [skills, setSkills] = useState((currentUser.skills || []).join(', '));
  const [education, setEducation] = useState(
    currentUser.education && currentUser.education[0]
      ? `${currentUser.education[0].degree} at ${currentUser.education[0].school} (${currentUser.education[0].year})`
      : ''
  );
  const [experience, setExperience] = useState(
    currentUser.experience && currentUser.experience[0]
      ? `${currentUser.experience[0].role} at ${currentUser.experience[0].company} (${currentUser.experience[0].duration})`
      : ''
  );
  
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');

  useEffect(() => {
    refreshData();
  }, [currentUser]);

  const refreshData = async () => {
    if (currentUser) {
      try {
        const apps = await getApplicationsForSeeker(currentUser.id);
        setApplications(apps);
        const bms = await getBookmarks(currentUser.id);
        setBookmarks(bms);
      } catch (err) {
        console.error('Error refreshing seeker dashboard:', err);
      }
    }
  };

  const handleToggleBookmark = async (jobId) => {
    try {
      await toggleBookmark(currentUser.id, jobId);
      await refreshData();
    } catch (err) {
      console.error('Error toggling bookmark:', err);
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileSuccessMsg('');

    // Parse skills
    const skillsArray = skills.split(',').map(s => s.trim()).filter(s => s !== '');
    
    // Parse education
    let eduArray = [];
    if (education.trim() !== '') {
      const match = education.match(/(.+) at (.+)\((.+)\)/);
      if (match) {
        eduArray = [{ degree: match[1].trim(), school: match[2].trim(), year: match[3].replace(')', '').trim() }];
      } else {
        eduArray = [{ degree: education, school: 'General', year: 'N/A' }];
      }
    }

    // Parse experience
    let expArray = [];
    if (experience.trim() !== '') {
      const match = experience.match(/(.+) at (.+)\((.+)\)/);
      if (match) {
        expArray = [{ role: match[1].trim(), company: match[2].trim(), duration: match[3].replace(')', '').trim() }];
      } else {
        expArray = [{ role: experience, company: 'General', duration: 'N/A' }];
      }
    }

    const updatedData = {
      name,
      title,
      phone,
      location,
      bio,
      skills: skillsArray,
      education: eduArray,
      experience: expArray,
      resumeName: currentUser.resumeName || 'uploaded_resume.pdf'
    };

    try {
      // Update in local DB
      const newUser = await updateProfile(currentUser.id, updatedData);
      onUpdateSessionUser(newUser);
      setProfileSuccessMsg('Profile updated successfully!');
      setTimeout(() => setProfileSuccessMsg(''), 4000);
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };

  // Stepper helper
  const getStatusStep = (status) => {
    // Applied, Screening, Interviewing, Offered, Rejected
    switch (status) {
      case 'Applied': return 1;
      case 'Screening': return 2;
      case 'Interviewing': return 3;
      case 'Offered': return 4;
      case 'Rejected': return -1;
      default: return 1;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Applied': return 'badge-outline';
      case 'Screening': return 'badge-accent';
      case 'Interviewing': return 'badge-primary animate-pulse-glow';
      case 'Offered': return 'badge-secondary';
      case 'Rejected': return 'badge-danger';
      default: return 'badge-outline';
    }
  };

  // Stats calculation
  const totalApplied = applications.length;
  const interviewingCount = applications.filter(a => a.status === 'Interviewing').length;
  const offeredCount = applications.filter(a => a.status === 'Offered').length;
  const bookmarksCount = bookmarks.length;

  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '2rem' }}>Welcome Back, <span className="text-gradient">{currentUser.name}</span></h2>
        <p style={{ color: 'var(--text-secondary)' }}>Track your applications, manage your resume, and discover opportunities.</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="card" style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(15, 21, 36, 0.7) 100%)' }}>
          <span style={{ fontSize: '1.5rem' }}>📂</span>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px' }}>Total Applications</p>
          <div className="stat-value">{totalApplied}</div>
        </div>
        <div className="card" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(15, 21, 36, 0.7) 100%)' }}>
          <span style={{ fontSize: '1.5rem' }}>🤝</span>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px' }}>Interviews Scheduled</p>
          <div className="stat-value" style={{ color: 'var(--secondary)' }}>{interviewingCount}</div>
        </div>
        <div className="card" style={{ background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(15, 21, 36, 0.7) 100%)' }}>
          <span style={{ fontSize: '1.5rem' }}>🏆</span>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px' }}>Job Offers</p>
          <div className="stat-value" style={{ color: 'var(--accent)' }}>{offeredCount}</div>
        </div>
        <div className="card" style={{ background: 'rgba(15, 21, 36, 0.7)' }}>
          <span style={{ fontSize: '1.5rem' }}>★</span>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px' }}>Saved Jobs</p>
          <div className="stat-value">{bookmarksCount}</div>
        </div>
      </div>

      {/* Main Grid: Sidebar Menu + Content */}
      <div className="grid-aside">
        {/* Sidebar Nav */}
        <div className="card" style={{ height: 'fit-content', padding: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button 
              className={`pill-btn ${activeTab === 'applications' ? 'active' : ''}`}
              onClick={() => setActiveTab('applications')}
              style={{ width: '100%', textAlign: 'left', borderRadius: '8px', padding: '12px 16px' }}
            >
              📂 My Applications
            </button>
            <button 
              className={`pill-btn ${activeTab === 'bookmarks' ? 'active' : ''}`}
              onClick={() => setActiveTab('bookmarks')}
              style={{ width: '100%', textAlign: 'left', borderRadius: '8px', padding: '12px 16px' }}
            >
              ★ Saved Jobs
            </button>
            <button 
              className={`pill-btn ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
              style={{ width: '100%', textAlign: 'left', borderRadius: '8px', padding: '12px 16px' }}
            >
              👤 Edit Profile & Resume
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="card">
          {activeTab === 'applications' && (
            <div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '24px' }}>My Applications</h3>
              {applications.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">📂</div>
                  <h4 className="empty-state-title">No applications yet</h4>
                  <p>Start applying to jobs on the homepage to track your applications here!</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {applications.map(app => {
                    const step = getStatusStep(app.status);
                    const isExpanded = expandedAppId === app.id;

                    return (
                      <div key={app.id} className="card" style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                          <div>
                            <h4 style={{ fontSize: '1.15rem' }}>{app.jobTitle}</h4>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                              {app.companyName} • <span style={{ color: 'var(--text-muted)' }}>Applied {new Date(app.appliedAt).toLocaleDateString()}</span>
                            </p>
                          </div>
                          <div>
                            <span className={`badge ${getStatusBadge(app.status)}`}>{app.status}</span>
                          </div>
                        </div>

                        {/* Status Stepper */}
                        <div className="stepper">
                          <div className="stepper-progress" style={{ 
                            width: step === -1 ? '100%' : `${((step - 1) / 3) * 100}%`,
                            backgroundColor: step === -1 ? 'var(--danger)' : 'var(--primary)'
                          }}></div>
                          
                          <div className={`step-node ${step >= 1 ? 'completed' : 'active'}`}>
                            <div className="step-circle">1</div>
                            <div className="step-label">Applied</div>
                          </div>
                          
                          {step === -1 ? (
                            <div className="step-node rejected">
                              <div className="step-circle">✕</div>
                              <div className="step-label">Rejected</div>
                            </div>
                          ) : (
                            <>
                              <div className={`step-node ${step >= 2 ? (step > 2 ? 'completed' : 'active') : ''}`}>
                                <div className="step-circle">2</div>
                                <div className="step-label">Screening</div>
                              </div>
                              <div className={`step-node ${step >= 3 ? (step > 3 ? 'completed' : 'active') : ''}`}>
                                <div className="step-circle">3</div>
                                <div className="step-label">Interviewing</div>
                              </div>
                              <div className={`step-node ${step === 4 ? 'completed' : ''}`}>
                                <div className="step-circle">✓</div>
                                <div className="step-label">Offered</div>
                              </div>
                            </>
                          )}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                          <button 
                            className="btn btn-outline btn-sm"
                            onClick={() => setExpandedAppId(isExpanded ? null : app.id)}
                          >
                            {isExpanded ? 'Hide Details' : 'Show Applied details'}
                          </button>
                        </div>

                        {isExpanded && (
                          <div style={{ marginTop: '16px', padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                            <h5 style={{ fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>Your Cover Letter:</h5>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                              {app.coverLetter}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'bookmarks' && (
            <div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '24px' }}>Saved Jobs</h3>
              {bookmarks.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">★</div>
                  <h4 className="empty-state-title">No saved jobs</h4>
                  <p>Save jobs on the home search page to view and apply to them later!</p>
                </div>
              ) : (
                <div className="grid-2">
                  {bookmarks.map(job => (
                    <JobCard 
                      key={job.id}
                      job={job}
                      isBookmarked={true}
                      onToggleBookmark={handleToggleBookmark}
                      onViewDetails={onViewJobDetails}
                      isLoggedIn={true}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '24px' }}>Edit Profile & Resume</h3>
              
              {profileSuccessMsg && (
                <div className="badge badge-secondary" style={{ display: 'block', width: '100%', padding: '12px', marginBottom: '20px', textTransform: 'none', borderRadius: '8px' }}>
                  {profileSuccessMsg}
                </div>
              )}

              <form onSubmit={handleProfileSave}>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={name} 
                      onChange={e => setName(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Professional Title</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="e.g. Junior Frontend Developer" 
                      value={title} 
                      onChange={e => setTitle(e.target.value)} 
                    />
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={phone} 
                      onChange={e => setPhone(e.target.value)} 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Location</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={location} 
                      onChange={e => setLocation(e.target.value)} 
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Professional Bio</label>
                  <textarea 
                    className="form-control" 
                    rows="4" 
                    placeholder="Describe your goals, experience, and interests..."
                    value={bio} 
                    onChange={e => setBio(e.target.value)}
                  ></textarea>
                </div>

                <div className="form-group">
                  <label className="form-label">Skills (comma-separated)</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g. React, Node.js, JavaScript, Figma" 
                    value={skills} 
                    onChange={e => setSkills(e.target.value)} 
                  />
                </div>

                <div className="divider"></div>
                <h4 style={{ fontSize: '1.15rem', marginBottom: '16px' }}>Resume Details</h4>

                <div className="form-group">
                  <label className="form-label">Highest Education</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g. B.Sc. in IT at University of Moratuwa (2025)" 
                    value={education} 
                    onChange={e => setEducation(e.target.value)} 
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Format: [Degree] at [University/School] ([Graduation Year])</span>
                </div>

                <div className="form-group">
                  <label className="form-label">Latest Work Experience</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g. Software Engineer Intern at Sysco LABS (6 months, 2024)" 
                    value={experience} 
                    onChange={e => setExperience(e.target.value)} 
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Format: [Role] at [Company] ([Duration/Year])</span>
                </div>

                <div className="form-group">
                  <label className="form-label">Resume Document</label>
                  <div className="card" style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderStyle: 'dashed', background: 'rgba(255,255,255,0.01)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '1.5rem' }}>📄</span>
                      <div>
                        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{currentUser.resumeName || 'No resume uploaded'}</span>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>PDF formats accepted up to 5MB</p>
                      </div>
                    </div>
                    <button type="button" className="btn btn-outline btn-sm" onClick={() => alert('Resume upload simulated. File linked successfully!')}>
                      Replace File
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
