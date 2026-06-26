import React, { useState, useEffect } from 'react';
import { getApplicationsForEmployer, getJobs, updateApplicationStatus, updateProfile } from '../utils/db';

export default function DashboardEmployer({ currentUser, onViewJobDetails, onUpdateSessionUser }) {
  const [activeTab, setActiveTab] = useState('posted-jobs'); // 'posted-jobs', 'applicants', 'profile'
  const [postedJobs, setPostedJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null); // For viewing applicant cover letter
  
  // Profile settings states
  const [companyName, setCompanyName] = useState(currentUser.companyName || '');
  const [name, setName] = useState(currentUser.name || '');
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [location, setLocation] = useState(currentUser.location || '');
  const [website, setWebsite] = useState(currentUser.website || '');
  const [industry, setIndustry] = useState(currentUser.industry || '');
  const [bio, setBio] = useState(currentUser.bio || '');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    refreshData();
  }, [currentUser]);

  const refreshData = async () => {
    if (currentUser) {
      try {
        // Get jobs posted by this employer
        const allJobs = await getJobs();
        const myJobs = allJobs.filter(j => j.employerId === currentUser.id);
        setPostedJobs(myJobs);

        // Get applications for these jobs
        const apps = await getApplicationsForEmployer(currentUser.id);
        setApplicants(apps);
      } catch (err) {
        console.error('Error refreshing employer dashboard:', err);
      }
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await updateApplicationStatus(appId, newStatus);
      await refreshData();
    } catch (err) {
      console.error('Error updating application status:', err);
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSuccessMsg('');

    const updatedData = {
      name,
      companyName,
      phone,
      location,
      website,
      industry,
      bio,
      logoText: companyName.split(' ').map(w => w[0]).join('').substring(0, 3).toUpperCase()
    };

    try {
      // Update in local DB
      const newUser = await updateProfile(currentUser.id, updatedData);
      onUpdateSessionUser(newUser);
      setSuccessMsg('Company details updated successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error('Error updating company profile:', err);
    }
  };

  // Stats
  const activePostsCount = postedJobs.length;
  const totalAppsCount = applicants.length;
  const interviewingCount = applicants.filter(a => a.status === 'Interviewing').length;
  const pendingCount = applicants.filter(a => a.status === 'Applied' || a.status === 'Screening').length;

  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '2rem' }}>Employer Portal: <span className="text-gradient">{currentUser.companyName}</span></h2>
        <p style={{ color: 'var(--text-secondary)' }}>Manage your job listings, track applications, and hire talent.</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="card" style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(15, 21, 36, 0.7) 100%)' }}>
          <span style={{ fontSize: '1.5rem' }}>💼</span>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px' }}>Active Postings</p>
          <div className="stat-value">{activePostsCount}</div>
        </div>
        <div className="card" style={{ background: 'rgba(15, 21, 36, 0.7)' }}>
          <span style={{ fontSize: '1.5rem' }}>📂</span>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px' }}>Total Applications</p>
          <div className="stat-value">{totalAppsCount}</div>
        </div>
        <div className="card" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(15, 21, 36, 0.7) 100%)' }}>
          <span style={{ fontSize: '1.5rem' }}>🤝</span>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px' }}>Interviews Scheduled</p>
          <div className="stat-value" style={{ color: 'var(--secondary)' }}>{interviewingCount}</div>
        </div>
        <div className="card" style={{ background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(15, 21, 36, 0.7) 100%)' }}>
          <span style={{ fontSize: '1.5rem' }}>⏳</span>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px' }}>Pending Review</p>
          <div className="stat-value" style={{ color: 'var(--accent)' }}>{pendingCount}</div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid-aside">
        {/* Sidebar Navigation */}
        <div className="card" style={{ height: 'fit-content', padding: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button 
              className={`pill-btn ${activeTab === 'posted-jobs' ? 'active' : ''}`}
              onClick={() => setActiveTab('posted-jobs')}
              style={{ width: '100%', textAlign: 'left', borderRadius: '8px', padding: '12px 16px' }}
            >
              💼 Manage Job Posts
            </button>
            <button 
              className={`pill-btn ${activeTab === 'applicants' ? 'active' : ''}`}
              onClick={() => setActiveTab('applicants')}
              style={{ width: '100%', textAlign: 'left', borderRadius: '8px', padding: '12px 16px' }}
            >
              👥 Applicant Tracking (ATS)
            </button>
            <button 
              className={`pill-btn ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
              style={{ width: '100%', textAlign: 'left', borderRadius: '8px', padding: '12px 16px' }}
            >
              🏢 Company Profile
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="card">
          {activeTab === 'posted-jobs' && (
            <div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '24px' }}>Active Job Postings</h3>
              {postedJobs.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">💼</div>
                  <h4 className="empty-state-title">No jobs posted yet</h4>
                  <p>Create your first job listing to find qualified candidates!</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {postedJobs.map(job => {
                    const jobAppsCount = applicants.filter(a => a.jobId === job.id).length;

                    return (
                      <div key={job.id} className="card" style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                        <div>
                          <h4 style={{ fontSize: '1.15rem' }}>{job.title}</h4>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            {job.department} • 📍 {job.location} • 💰 {job.salary}
                          </p>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Posted: {new Date(job.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <div style={{ textAlign: 'right' }}>
                            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)' }}>{jobAppsCount}</span>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Applicants</p>
                          </div>
                          <button 
                            className="btn btn-outline btn-sm"
                            onClick={() => onViewJobDetails(job)}
                          >
                            View Post
                          </button>
                          <button 
                            className="btn btn-primary btn-sm"
                            onClick={() => {
                              setActiveTab('applicants');
                            }}
                          >
                            View Applicants
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'applicants' && (
            <div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '24px' }}>Applicant Tracking System (ATS)</h3>
              {applicants.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">👥</div>
                  <h4 className="empty-state-title">No applicants yet</h4>
                  <p>Candidates will appear here once they apply to your jobs.</p>
                </div>
              ) : (
                <div className="table-container">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Candidate</th>
                        <th>Applied Position</th>
                        <th>Applied Date</th>
                        <th>Resume</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applicants.map(app => (
                        <tr key={app.id}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div className="avatar" style={{ width: '32px', height: '32px', fontSize: '0.8rem' }}>
                                {app.seekerDetails.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
                              </div>
                              <div>
                                <div style={{ fontWeight: 600 }}>{app.seekerDetails.name}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{app.seekerDetails.email}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div style={{ fontWeight: 500 }}>{app.jobTitle}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{app.jobDepartment}</div>
                          </td>
                          <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            {new Date(app.appliedAt).toLocaleDateString()}
                          </td>
                          <td>
                            <a 
                              href="#" 
                              onClick={(e) => {
                                e.preventDefault();
                                alert(`Opening resume: ${app.seekerDetails.resumeName || 'dilshan_resume.pdf'}`);
                              }}
                              style={{ color: 'var(--primary)', textDecoration: 'underline', fontSize: '0.85rem' }}
                            >
                              📄 Resume
                            </a>
                          </td>
                          <td>
                            <span className={`badge ${
                              app.status === 'Applied' ? 'badge-outline' :
                              app.status === 'Screening' ? 'badge-accent' :
                              app.status === 'Interviewing' ? 'badge-primary animate-pulse-glow' :
                              app.status === 'Offered' ? 'badge-secondary' : 'badge-danger'
                            }`} style={{ fontSize: '0.7rem' }}>
                              {app.status}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                              <button 
                                className="btn btn-outline btn-sm" 
                                style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                                onClick={() => setSelectedApp(app)}
                              >
                                View Cover Letter
                              </button>
                              
                              <select 
                                className="form-control"
                                style={{ padding: '4px 8px', fontSize: '0.75rem', width: 'auto', background: 'var(--bg-tertiary)' }}
                                value={app.status}
                                onChange={(e) => handleStatusChange(app.id, e.target.value)}
                              >
                                <option value="Applied">Applied</option>
                                <option value="Screening">Screening</option>
                                <option value="Interviewing">Interviewing</option>
                                <option value="Offered">Offered</option>
                                <option value="Rejected">Rejected</option>
                              </select>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '24px' }}>Edit Company Profile</h3>
              
              {successMsg && (
                <div className="badge badge-secondary" style={{ display: 'block', width: '100%', padding: '12px', marginBottom: '20px', textTransform: 'none', borderRadius: '8px' }}>
                  {successMsg}
                </div>
              )}

              <form onSubmit={handleProfileSave}>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Company Name *</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={companyName} 
                      onChange={e => setCompanyName(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Recruiter Contact Name *</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={name} 
                      onChange={e => setName(e.target.value)} 
                      required 
                    />
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Company Website</label>
                    <input 
                      type="url" 
                      className="form-control" 
                      placeholder="e.g. https://mycompany.com" 
                      value={website} 
                      onChange={e => setWebsite(e.target.value)} 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Industry Sector</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="e.g. IT, Finance, Telecom" 
                      value={industry} 
                      onChange={e => setIndustry(e.target.value)} 
                    />
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Phone Contact</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={phone} 
                      onChange={e => setPhone(e.target.value)} 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Company Location</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={location} 
                      onChange={e => setLocation(e.target.value)} 
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">About Company</label>
                  <textarea 
                    className="form-control" 
                    rows="5" 
                    placeholder="Describe your company, products, and culture..."
                    value={bio} 
                    onChange={e => setBio(e.target.value)}
                  ></textarea>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
                  <button type="submit" className="btn btn-primary">
                    Save Details
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Cover Letter Viewer Modal */}
      {selectedApp && (
        <div className="modal-overlay" onClick={() => setSelectedApp(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title text-gradient">Application Cover Letter</h3>
              <button className="modal-close" onClick={() => setSelectedApp(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '24px' }}>
                <div className="avatar" style={{ width: '48px', height: '48px' }}>
                  {selectedApp.seekerDetails.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
                </div>
                <div>
                  <h4 style={{ fontWeight: 600 }}>{selectedApp.seekerDetails.name}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Applying for: <strong>{selectedApp.jobTitle}</strong>
                  </p>
                </div>
              </div>
              
              <div style={{ padding: '20px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                  {selectedApp.coverLetter}
                </p>
              </div>

              <div style={{ marginTop: '24px' }}>
                <h5 style={{ fontWeight: 600, marginBottom: '8px' }}>Candidate Details:</h5>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>📍 Location: {selectedApp.seekerDetails.location || 'N/A'}</p>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>📞 Phone: {selectedApp.seekerDetails.phone || 'N/A'}</p>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>📧 Email: {selectedApp.seekerDetails.email}</p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setSelectedApp(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
