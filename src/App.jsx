import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import JobCard from './components/JobCard';
import JobDetailsModal from './components/JobDetailsModal';
import DashboardSeeker from './components/DashboardSeeker';
import DashboardEmployer from './components/DashboardEmployer';
import PostJobForm from './components/PostJobForm';
import ProfilePage from './components/ProfilePage';
import AuthModal from './components/AuthModal';

import { 
  initDB, 
  getSessionUser, 
  getJobs, 
  logout, 
  toggleBookmark, 
  isJobBookmarked, 
  getApplicationsForSeeker,
  getBookmarks
} from './utils/db';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [view, setView] = useState('find-jobs'); // 'find-jobs', 'dashboard', 'post-job', 'profile'
  const [authModal, setAuthModal] = useState(null); // null, 'login', 'signup'
  
  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedExp, setSelectedExp] = useState('All Experience');
  
  // Data lists
  const [jobs, setJobs] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [appliedJobIds, setAppliedJobIds] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  // Initialize DB and Session
  useEffect(() => {
    initDB();
    const sessionUser = getSessionUser();
    if (sessionUser) {
      setCurrentUser(sessionUser);
    }
  }, []);

  // Fetch jobs based on queries
  useEffect(() => {
    const filters = {
      search: searchQuery,
      location: locationQuery,
      type: selectedType,
      experience: selectedExp
    };
    const filteredJobs = getJobs(filters);
    setJobs(filteredJobs);
  }, [searchQuery, locationQuery, selectedType, selectedExp]);

  // Fetch seeker application IDs and Bookmarks
  useEffect(() => {
    refreshUserStates();
  }, [currentUser]);

  const refreshUserStates = () => {
    if (currentUser) {
      if (currentUser.role === 'seeker') {
        const apps = getApplicationsForSeeker(currentUser.id);
        setAppliedJobIds(apps.map(a => a.jobId));
        
        const bms = getBookmarks(currentUser.id);
        setBookmarks(bms.map(b => b.id));
      }
    } else {
      setAppliedJobIds([]);
      setBookmarks([]);
    }
  };

  const handleOpenAuth = (mode) => {
    setAuthModal(mode);
  };

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    // If employer, redirect to dashboard, otherwise stay on jobs page
    if (user.role === 'employer') {
      setView('dashboard');
    } else {
      setView('find-jobs');
    }
  };

  const handleNavView = (newView) => {
    if (newView === 'logout') {
      logout();
      setCurrentUser(null);
      setView('find-jobs');
    } else {
      setView(newView);
    }
  };

  const handleToggleBookmark = (jobId) => {
    if (!currentUser) {
      setAuthModal('login');
      return;
    }
    toggleBookmark(currentUser.id, jobId);
    refreshUserStates();
  };

  const handleViewJobDetails = (job) => {
    setSelectedJob(job);
  };

  const handleApplied = () => {
    refreshUserStates();
    // Re-render components with new application details
    if (selectedJob) {
      // Force update by setting selectedJob to a copy of itself
      setSelectedJob({ ...selectedJob });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Top Navbar */}
      <Navbar 
        currentUser={currentUser} 
        activeView={view} 
        setView={handleNavView} 
        onOpenAuth={handleOpenAuth} 
      />

      {/* Main Pages */}
      <main style={{ flex: 1 }}>
        {view === 'find-jobs' && (
          <div>
            <Hero 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              locationQuery={locationQuery}
              setLocationQuery={setLocationQuery}
              selectedType={selectedType}
              setSelectedType={setSelectedType}
              selectedExp={selectedExp}
              setSelectedExp={setSelectedExp}
            />
            
            <div className="container" style={{ padding: '60px 24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                  <h3 className="section-title">Latest Opportunities</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                    Showing {jobs.length} job{jobs.length !== 1 ? 's' : ''} based on your filters
                  </p>
                </div>
              </div>

              {jobs.length === 0 ? (
                <div className="card empty-state" style={{ background: 'var(--bg-secondary)' }}>
                  <div className="empty-state-icon">🔍</div>
                  <h4 className="empty-state-title">No matching jobs found</h4>
                  <p style={{ maxWidth: '400px', margin: '0 auto' }}>
                    We couldn't find any job posts matching your criteria. Try adjusting your search query or filters!
                  </p>
                  <button 
                    className="btn btn-primary btn-sm" 
                    style={{ marginTop: '20px' }}
                    onClick={() => {
                      setSearchQuery('');
                      setLocationQuery('');
                      setSelectedType('All Types');
                      setSelectedExp('All Experience');
                    }}
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="grid-3">
                  {jobs.map(job => (
                    <JobCard 
                      key={job.id} 
                      job={job}
                      isBookmarked={bookmarks.includes(job.id)}
                      onToggleBookmark={handleToggleBookmark}
                      onViewDetails={handleViewJobDetails}
                      isLoggedIn={currentUser !== null}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {view === 'dashboard' && currentUser && currentUser.role === 'seeker' && (
          <DashboardSeeker 
            currentUser={currentUser}
            onViewJobDetails={handleViewJobDetails}
            onUpdateSessionUser={(user) => setCurrentUser(user)}
          />
        )}

        {view === 'dashboard' && currentUser && currentUser.role === 'employer' && (
          <DashboardEmployer 
            currentUser={currentUser}
            onViewJobDetails={handleViewJobDetails}
            onUpdateSessionUser={(user) => setCurrentUser(user)}
          />
        )}

        {view === 'post-job' && currentUser && currentUser.role === 'employer' && (
          <PostJobForm 
            currentUser={currentUser}
            onJobPosted={() => setView('dashboard')}
          />
        )}

        {view === 'profile' && currentUser && (
          <ProfilePage 
            currentUser={currentUser}
            onUpdateSessionUser={(user) => setCurrentUser(user)}
          />
        )}
      </main>

      {/* Footer */}
      <footer style={{ 
        background: 'var(--bg-secondary)', 
        borderTop: '1px solid var(--border)', 
        padding: '32px 0', 
        marginTop: 'auto', 
        fontSize: '0.9rem', 
        color: 'var(--text-secondary)' 
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <strong>Rakiyawak</strong> - Job Portal © 2026. Made with ❤️ for developers and employers.
          </div>
          <div style={{ display: 'flex', gap: '24px' }}>
            <a href="#" className="nav-item">Privacy Policy</a>
            <a href="#" className="nav-item">Terms of Service</a>
            <a href="#" className="nav-item font-heading" onClick={(e) => { e.preventDefault(); setView('find-jobs'); }}>Browse Jobs</a>
          </div>
        </div>
      </footer>

      {/* Job Details Modal overlay */}
      {selectedJob && (
        <JobDetailsModal 
          job={selectedJob}
          currentUser={currentUser}
          onApplied={handleApplied}
          isAlreadyApplied={appliedJobIds.includes(selectedJob.id)}
          onClose={() => setSelectedJob(null)}
          onOpenAuth={handleOpenAuth}
        />
      )}

      {/* Login / Register Modal */}
      {authModal && (
        <AuthModal 
          initialMode={authModal}
          onClose={() => setAuthModal(null)}
          onAuthSuccess={handleAuthSuccess}
        />
      )}
    </div>
  );
}
