import React, { useState } from 'react';
import { updateProfile } from '../utils/db';

export default function ProfilePage({ currentUser, onUpdateSessionUser }) {
  // Common States
  const [name, setName] = useState(currentUser.name || '');
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [location, setLocation] = useState(currentUser.location || '');
  const [bio, setBio] = useState(currentUser.bio || '');
  const [successMsg, setSuccessMsg] = useState('');

  // Seeker Specific States
  const [title, setTitle] = useState(currentUser.title || '');
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

  // Employer Specific States
  const [companyName, setCompanyName] = useState(currentUser.companyName || '');
  const [website, setWebsite] = useState(currentUser.website || '');
  const [industry, setIndustry] = useState(currentUser.industry || '');

  const handleSave = async (e) => {
    e.preventDefault();
    setSuccessMsg('');

    let updatedData = {
      name,
      phone,
      location,
      bio
    };

    if (currentUser.role === 'seeker') {
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

      updatedData = {
        ...updatedData,
        title,
        skills: skillsArray,
        education: eduArray,
        experience: expArray,
        resumeName: currentUser.resumeName || 'uploaded_resume.pdf'
      };
    } else {
      updatedData = {
        ...updatedData,
        companyName,
        website,
        industry,
        logoText: companyName.split(' ').map(w => w[0]).join('').substring(0, 3).toUpperCase()
      };
    }

    try {
      // Update in local DB
      const newUser = await updateProfile(currentUser.id, updatedData);
      onUpdateSessionUser(newUser);
      setSuccessMsg('Profile details updated successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error('Error saving profile changes:', err);
    }
  };

  const getInitials = (n) => {
    if (!n) return 'U';
    return n.split(' ').map(x => x[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '2rem' }}>My Profile</h2>
        <p style={{ color: 'var(--text-secondary)' }}>View and update your public details and contact information.</p>
      </div>

      {successMsg && (
        <div className="badge badge-secondary" style={{ display: 'block', width: '100%', padding: '12px', marginBottom: '20px', textTransform: 'none', borderRadius: '8px' }}>
          {successMsg}
        </div>
      )}

      <div className="grid-aside">
        {/* Left Side: Preview Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card" style={{ textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ height: '80px', background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)', margin: '-24px -24px 40px -24px' }}></div>
            
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '-40px', marginBottom: '16px' }}>
              <div className="avatar avatar-lg">
                {currentUser.role === 'employer' ? (currentUser.logoText || 'CG') : getInitials(currentUser.name)}
              </div>
            </div>

            <h3 style={{ fontSize: '1.4rem', fontWeight: 700 }}>{currentUser.role === 'employer' ? currentUser.companyName : currentUser.name}</h3>
            <p style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '12px' }}>
              {currentUser.role === 'employer' ? currentUser.industry || 'Tech Solutions' : currentUser.title || 'Job Seeker'}
            </p>
            
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.5 }}>
              📍 {currentUser.location || 'Sri Lanka'}
            </p>

            <div className="divider"></div>

            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontStyle: 'italic', textAlign: 'left', lineHeight: 1.5 }}>
              "{currentUser.bio || 'No profile bio added yet. Write something about yourself or your company.'}"
            </p>

            {currentUser.role === 'seeker' && currentUser.skills && currentUser.skills.length > 0 && (
              <div style={{ textAlign: 'left', marginTop: '20px' }}>
                <h5 style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '8px' }}>Skills</h5>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {currentUser.skills.map(skill => (
                    <span key={skill} className="badge badge-primary" style={{ fontSize: '0.65rem' }}>{skill}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {currentUser.role === 'seeker' && (
            <div className="card" style={{ padding: '20px' }}>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '12px' }}>Attached Resume</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '1.8rem' }}>📄</span>
                <div>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem', display: 'block' }}>{currentUser.resumeName || 'No resume linked'}</span>
                  <button className="btn btn-secondary btn-sm" style={{ padding: '2px 8px', fontSize: '0.75rem', marginTop: '4px' }} onClick={() => alert('Resume preview opened')}>
                    Preview Resume
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Edit Form */}
        <div className="card">
          <h3 style={{ fontSize: '1.5rem', marginBottom: '24px' }}>Edit Profile Information</h3>
          
          <form onSubmit={handleSave}>
            {currentUser.role === 'employer' ? (
              <>
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
                      placeholder="e.g. IT Services, Telecommunications" 
                      value={industry} 
                      onChange={e => setIndustry(e.target.value)} 
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
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
                      placeholder="e.g. Associate React Developer" 
                      value={title} 
                      onChange={e => setTitle(e.target.value)} 
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Skills (comma-separated)</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g. React, Node.js, JavaScript, CSS Grid" 
                    value={skills} 
                    onChange={e => setSkills(e.target.value)} 
                  />
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Highest Education</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Format: B.Sc. in IT at University of Moratuwa (2025)" 
                      value={education} 
                      onChange={e => setEducation(e.target.value)} 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Work Experience</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Format: Software Engineer at Sysco LABS (6 months, 2024)" 
                      value={experience} 
                      onChange={e => setExperience(e.target.value)} 
                    />
                  </div>
                </div>
              </>
            )}

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Phone Contact Number</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={phone} 
                  onChange={e => setPhone(e.target.value)} 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Location / City</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={location} 
                  onChange={e => setLocation(e.target.value)} 
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">{currentUser.role === 'employer' ? 'About Company' : 'Professional Biography'}</label>
              <textarea 
                className="form-control" 
                rows="5" 
                placeholder="Write a brief overview..."
                value={bio} 
                onChange={e => setBio(e.target.value)}
              ></textarea>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button type="submit" className="btn btn-primary" style={{ padding: '12px 32px' }}>
                Save Profile Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
