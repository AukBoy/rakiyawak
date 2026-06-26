import React, { useState } from 'react';
import { addJob } from '../utils/db';

export default function PostJobForm({ currentUser, onJobPosted }) {
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [type, setType] = useState('Full-time');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');
  const [experience, setExperience] = useState('Associate (1-2 years)');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [benefits, setBenefits] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!title || !department || !location || !salary || !description) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      const jobData = {
        title,
        department,
        type,
        location,
        salary,
        experience,
        description,
        requirements, // db.js will parse newlines automatically
        benefits
      };

      addJob(currentUser.id, jobData);
      setSuccess(true);
      
      // Reset form
      setTitle('');
      setDepartment('');
      setLocation('');
      setSalary('');
      setDescription('');
      setRequirements('');
      setBenefits('');

      // Redirect after brief delay
      setTimeout(() => {
        onJobPosted();
      }, 1500);

    } catch (err) {
      setError(err.message || 'Failed to post job.');
    }
  };

  const jobTypes = ['Full-time', 'Part-time', 'Remote', 'Contract', 'Internship'];
  const expLevels = [
    'Internship (Undergraduate)',
    'Associate (1-2 years)',
    'Mid-Level (2-4 years)',
    'Senior (5+ years)'
  ];

  return (
    <div className="container" style={{ padding: '40px 24px', maxWidth: '800px' }}>
      <div className="card">
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.75rem' }} className="text-gradient">Post a New Job Opportunity</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Fill out the details below to publish a new job opening on Rakiyawak.</p>
        </div>

        {error && (
          <div className="badge badge-danger" style={{ display: 'block', width: '100%', padding: '12px', marginBottom: '20px', textTransform: 'none', borderRadius: '8px' }}>
            {error}
          </div>
        )}

        {success && (
          <div className="badge badge-secondary" style={{ display: 'block', width: '100%', padding: '12px', marginBottom: '20px', textTransform: 'none', borderRadius: '8px' }}>
            🎉 Job opportunity posted successfully! Redirecting to Dashboard...
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Job Title *</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="e.g. Associate React Developer"
                value={title} 
                onChange={e => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Department / Team *</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="e.g. Frontend Engineering"
                value={department} 
                onChange={e => setDepartment(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid-3" style={{ gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Job Type *</label>
              <select 
                className="form-control"
                value={type}
                onChange={e => setType(e.target.value)}
              >
                {jobTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Experience Level *</label>
              <select 
                className="form-control"
                value={experience}
                onChange={e => setExperience(e.target.value)}
              >
                {expLevels.map(exp => <option key={exp} value={exp}>{exp}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Salary Range *</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="e.g. LKR 150,000 - 200,000"
                value={salary} 
                onChange={e => setSalary(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Job Location *</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="e.g. Colombo 10 (Hybrid) or Remote"
              value={location} 
              onChange={e => setLocation(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Job Description *</label>
            <textarea 
              className="form-control" 
              rows="6" 
              placeholder="Describe the role, responsibilities, expectations, and day-to-day operations..."
              value={description} 
              onChange={e => setDescription(e.target.value)}
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label className="form-label">Candidate Requirements (one requirement per line)</label>
            <textarea 
              className="form-control" 
              rows="5" 
              placeholder="e.g. Strong proficiency in HTML, CSS, JavaScript&#10;1+ years of React development experience&#10;Familiarity with REST APIs"
              value={requirements} 
              onChange={e => setRequirements(e.target.value)}
            ></textarea>
          </div>

          <div className="form-group">
            <label className="form-label">Benefits & Perks (one benefit per line)</label>
            <textarea 
              className="form-control" 
              rows="5" 
              placeholder="e.g. Hybrid work schedule&#10;Health insurance package&#10;Learning and certification subsidies"
              value={benefits} 
              onChange={e => setBenefits(e.target.value)}
            ></textarea>
          </div>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end', marginTop: '32px' }}>
            <button type="submit" className="btn btn-primary" style={{ padding: '12px 32px' }}>
              Publish Position 🚀
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
