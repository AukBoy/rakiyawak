// Custom API-based Database Layer for Rakiyawak Job Portal (Full-Stack Mode)

const KEYS = {
  SESSION: 'rakiyawak_session'
};

const API_BASE = '/api';

// Helper to handle API responses
const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'An error occurred during the request.');
  }
  return data;
};

// Auth Functions (Synchronous wrappers for local session state, async for DB)
export const getSessionUser = () => {
  return JSON.parse(localStorage.getItem(KEYS.SESSION)) || null;
};

export const logout = () => {
  localStorage.removeItem(KEYS.SESSION);
};

export const login = async (email, password, role) => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, role })
  });
  const user = await handleResponse(res);
  localStorage.setItem(KEYS.SESSION, JSON.stringify(user));
  return user;
};

export const signup = async (email, password, name, role, extraDetails = {}) => {
  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name, role, extraDetails })
  });
  const user = await handleResponse(res);
  localStorage.setItem(KEYS.SESSION, JSON.stringify(user));
  return user;
};

// Jobs Functions
export const getJobs = async (filters = {}) => {
  const queryParams = new URLSearchParams();
  if (filters.search) queryParams.append('search', filters.search);
  if (filters.location) queryParams.append('location', filters.location);
  if (filters.type) queryParams.append('type', filters.type);
  if (filters.experience) queryParams.append('experience', filters.experience);

  const res = await fetch(`${API_BASE}/jobs?${queryParams.toString()}`);
  return await handleResponse(res);
};

export const addJob = async (employerId, jobData) => {
  const res = await fetch(`${API_BASE}/jobs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ employerId, jobData })
  });
  return await handleResponse(res);
};

// Application Functions
export const applyToJob = async (jobId, seekerId, coverLetter) => {
  const res = await fetch(`${API_BASE}/applications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jobId, seekerId, coverLetter })
  });
  return await handleResponse(res);
};

export const getApplicationsForEmployer = async (employerId) => {
  const res = await fetch(`${API_BASE}/applications/employer/${employerId}`);
  return await handleResponse(res);
};

export const getApplicationsForSeeker = async (seekerId) => {
  const res = await fetch(`${API_BASE}/applications/seeker/${seekerId}`);
  return await handleResponse(res);
};

export const updateApplicationStatus = async (applicationId, status) => {
  const res = await fetch(`${API_BASE}/applications/${applicationId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  return await handleResponse(res);
};

// Profile Functions
export const updateProfile = async (userId, profileData) => {
  const res = await fetch(`${API_BASE}/profile/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profileData)
  });
  const user = await handleResponse(res);
  localStorage.setItem(KEYS.SESSION, JSON.stringify(user));
  return user;
};

// Bookmark Functions
export const toggleBookmark = async (userId, jobId) => {
  const res = await fetch(`${API_BASE}/bookmarks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, jobId })
  });
  const data = await handleResponse(res);
  return data.isBookmarked;
};

export const getBookmarks = async (userId) => {
  const res = await fetch(`${API_BASE}/bookmarks/${userId}`);
  return await handleResponse(res);
};
