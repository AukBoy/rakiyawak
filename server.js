import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const DB_FILE = path.join(__dirname, 'database.json');

app.use(cors());
app.use(express.json());

// Database Access Helpers
const readDB = () => {
  try {
    if (!fs.existsSync(DB_FILE)) {
      return { users: [], jobs: [], applications: [], bookmarks: [] };
    }
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database file:', error);
    return { users: [], jobs: [], applications: [], bookmarks: [] };
  }
};

const writeDB = (data) => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing to database file:', error);
  }
};

// API ENDPOINTS

// 1. Auth Endpoints
app.post('/api/auth/login', (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return res.status(400).json({ error: 'Please provide email, password, and role.' });
  }

  const db = readDB();
  const user = db.users.find(
    u => u.email.toLowerCase() === email.toLowerCase() && u.password === password && u.role === role
  );

  if (!user) {
    return res.status(401).json({ error: 'Invalid email, password, or role combination.' });
  }

  const sessionUser = { ...user };
  delete sessionUser.password;
  res.json(sessionUser);
});

app.post('/api/auth/signup', (req, res) => {
  const { email, password, name, role, phone, location, extraDetails } = req.body;
  if (!email || !password || !name || !role) {
    return res.status(400).json({ error: 'Please fill in all required fields.' });
  }

  const db = readDB();
  if (db.users.some(u => u.email.toLowerCase() === email.toLowerCase() && u.role === role)) {
    return res.status(400).json({ error: `An account with this email already exists as a ${role}.` });
  }

  const newUser = {
    id: 'user_' + Date.now(),
    email,
    password,
    role,
    name,
    phone: phone || '',
    location: location || '',
    bio: '',
    ...extraDetails
  };

  if (role === 'employer') {
    newUser.companyName = extraDetails?.companyName || name;
    newUser.logoText = (extraDetails?.companyName || name).split(' ').map(w => w[0]).join('').substring(0, 3).toUpperCase();
    newUser.website = extraDetails?.website || '';
    newUser.industry = extraDetails?.industry || '';
  } else {
    newUser.title = extraDetails?.title || '';
    newUser.skills = [];
    newUser.education = [];
    newUser.experience = [];
    newUser.resumeName = '';
  }

  db.users.push(newUser);
  writeDB(db);

  const sessionUser = { ...newUser };
  delete sessionUser.password;
  res.json(sessionUser);
});

// 2. Jobs Endpoints
app.get('/api/jobs', (req, res) => {
  const { search, location, type, experience } = req.query;
  const db = readDB();
  let jobs = db.jobs;

  if (search) {
    const q = search.toLowerCase();
    jobs = jobs.filter(j => 
      j.title.toLowerCase().includes(q) || 
      j.companyName.toLowerCase().includes(q) ||
      j.department.toLowerCase().includes(q) ||
      j.description.toLowerCase().includes(q)
    );
  }

  if (location) {
    const loc = location.toLowerCase();
    jobs = jobs.filter(j => j.location.toLowerCase().includes(loc));
  }

  if (type && type !== 'All Types') {
    jobs = jobs.filter(j => j.type === type);
  }

  if (experience && experience !== 'All Experience') {
    jobs = jobs.filter(j => j.experience.includes(experience));
  }

  // Sort by newest
  jobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(jobs);
});

app.post('/api/jobs', (req, res) => {
  const { employerId, jobData } = req.body;
  if (!employerId || !jobData) {
    return res.status(400).json({ error: 'Employer ID and job details are required.' });
  }

  const db = readDB();
  const employer = db.users.find(u => u.id === employerId && u.role === 'employer');
  if (!employer) {
    return res.status(404).json({ error: 'Employer account not found.' });
  }

  const newJob = {
    id: 'job_' + Date.now(),
    employerId,
    companyName: employer.companyName,
    logoText: employer.logoText || 'WSO2',
    title: jobData.title,
    department: jobData.department,
    type: jobData.type,
    location: jobData.location,
    salary: jobData.salary,
    experience: jobData.experience,
    description: jobData.description,
    requirements: Array.isArray(jobData.requirements) ? jobData.requirements : jobData.requirements.split('\n').filter(r => r.trim() !== ''),
    benefits: Array.isArray(jobData.benefits) ? jobData.benefits : jobData.benefits.split('\n').filter(b => b.trim() !== ''),
    createdAt: new Date().toISOString()
  };

  db.jobs.push(newJob);
  writeDB(db);
  res.json(newJob);
});

// 3. Profile Updates
app.put('/api/profile/:userId', (req, res) => {
  const { userId } = req.params;
  const profileData = req.body;
  
  const db = readDB();
  const index = db.users.findIndex(u => u.id === userId);
  if (index === -1) {
    return res.status(404).json({ error: 'User not found.' });
  }

  const updatedUser = {
    ...db.users[index],
    ...profileData
  };

  db.users[index] = updatedUser;
  writeDB(db);

  const sessionUser = { ...updatedUser };
  delete sessionUser.password;
  res.json(sessionUser);
});

// 4. Applications Endpoints
app.get('/api/applications/seeker/:seekerId', (req, res) => {
  const { seekerId } = req.params;
  const db = readDB();
  const seekerApps = db.applications.filter(app => app.seekerId === seekerId);

  const enrichedApps = seekerApps.map(app => {
    const job = db.jobs.find(j => j.id === app.jobId);
    return {
      ...app,
      jobTitle: job ? job.title : 'Deleted Position',
      companyName: job ? job.companyName : 'Unknown Company',
      location: job ? job.location : '',
      salary: job ? job.salary : '',
      type: job ? job.type : ''
    };
  }).sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));

  res.json(enrichedApps);
});

app.get('/api/applications/employer/:employerId', (req, res) => {
  const { employerId } = req.params;
  const db = readDB();
  const employerJobIds = db.jobs.filter(j => j.employerId === employerId).map(j => j.id);
  const employerApps = db.applications.filter(app => employerJobIds.includes(app.jobId));

  const enrichedApps = employerApps.map(app => {
    const job = db.jobs.find(j => j.id === app.jobId);
    return {
      ...app,
      jobTitle: job ? job.title : 'Deleted Position',
      jobDepartment: job ? job.department : ''
    };
  }).sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));

  res.json(enrichedApps);
});

app.post('/api/applications', (req, res) => {
  const { jobId, seekerId, coverLetter } = req.body;
  if (!jobId || !seekerId || !coverLetter) {
    return res.status(400).json({ error: 'Please provide jobId, seekerId, and coverLetter.' });
  }

  const db = readDB();
  const job = db.jobs.find(j => j.id === jobId);
  const seeker = db.users.find(u => u.id === seekerId && u.role === 'seeker');

  if (!job) return res.status(404).json({ error: 'Job position not found.' });
  if (!seeker) return res.status(404).json({ error: 'Seeker account not found.' });

  if (db.applications.some(app => app.jobId === jobId && app.seekerId === seekerId)) {
    return res.status(400).json({ error: 'You have already applied for this job.' });
  }

  const newApplication = {
    id: 'app_' + Date.now(),
    jobId,
    seekerId,
    coverLetter,
    status: 'Applied',
    appliedAt: new Date().toISOString(),
    seekerDetails: {
      name: seeker.name,
      email: seeker.email,
      phone: seeker.phone || '',
      location: seeker.location || '',
      title: seeker.title || '',
      resumeName: seeker.resumeName || ''
    }
  };

  db.applications.push(newApplication);
  writeDB(db);
  res.json(newApplication);
});

app.put('/api/applications/:appId', (req, res) => {
  const { appId } = req.params;
  const { status } = req.body;

  const db = readDB();
  const index = db.applications.findIndex(app => app.id === appId);
  if (index === -1) {
    return res.status(404).json({ error: 'Application not found.' });
  }

  db.applications[index].status = status;
  writeDB(db);
  res.json(db.applications[index]);
});

// 5. Bookmarks Endpoints
app.get('/api/bookmarks/:userId', (req, res) => {
  const { userId } = req.params;
  const db = readDB();
  const userJobIds = db.bookmarks.filter(b => b.userId === userId).map(b => b.jobId);
  const bookmarkedJobs = db.jobs.filter(j => userJobIds.includes(j.id));
  res.json(bookmarkedJobs);
});

app.post('/api/bookmarks', (req, res) => {
  const { userId, jobId } = req.body;
  if (!userId || !jobId) {
    return res.status(400).json({ error: 'Please provide userId and jobId.' });
  }

  const db = readDB();
  const index = db.bookmarks.findIndex(b => b.userId === userId && b.jobId === jobId);

  let isBookmarked = false;
  if (index === -1) {
    db.bookmarks.push({ userId, jobId });
    isBookmarked = true;
  } else {
    db.bookmarks.splice(index, 1);
  }

  writeDB(db);
  res.json({ isBookmarked });
});

// SERVE STATIC PRODUCTION BUILD FILES
app.use(express.static(path.join(__dirname, 'dist')));

// SPA fallback
app.get(/^(?!\/api).+/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
