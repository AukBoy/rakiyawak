// Custom LocalStorage Database Layer for Rakiyawak Job Portal (Sri Lanka Edition)

const KEYS = {
  USERS: 'rakiyawak_users',
  JOBS: 'rakiyawak_jobs',
  APPLICATIONS: 'rakiyawak_applications',
  BOOKMARKS: 'rakiyawak_bookmarks',
  SESSION: 'rakiyawak_session'
};

// Seed Data localized for Sri Lanka
const defaultUsers = [
  {
    id: 'seeker1',
    email: 'seeker@rakiyawak.lk',
    password: 'password',
    role: 'seeker',
    name: 'Kasun Alwis',
    phone: '077 456 7890',
    location: 'Gampaha, Sri Lanka',
    title: 'Associate React Developer',
    bio: 'Passionate React developer. Graduate from the University of Moratuwa. Enthusiastic about build systems, clean UI/UX, and CSS layout engines.',
    skills: ['React', 'JavaScript', 'HTML5', 'CSS Grid', 'Git', 'REST APIs'],
    education: [
      { school: 'University of Moratuwa', degree: 'B.Sc. (Hons) in Information Technology', year: '2025' }
    ],
    experience: [
      { company: 'WSO2 Sri Lanka', role: 'Software Engineer Intern (Frontend)', duration: '6 months (2024)' }
    ],
    resumeName: 'kasun_alwis_resume.pdf'
  },
  {
    id: 'employer1',
    email: 'employer@rakiyawak.lk',
    password: 'password',
    role: 'employer',
    name: 'Nilanthi Fernando',
    companyName: 'WSO2 Sri Lanka',
    phone: '011 246 8100',
    location: 'Palm Grove, Colombo 03',
    website: 'https://wso2.com',
    industry: 'Middleware & Cloud Integration',
    bio: 'WSO2 is a global leader in digital transformation technologies, founded and headquartered with its primary engineering hub in Colombo, Sri Lanka.',
    logoText: 'WSO2'
  },
  {
    id: 'employer2',
    email: 'recruiting@syscolabs.lk',
    password: 'password',
    role: 'employer',
    name: 'Suresh Perera',
    companyName: 'Sysco LABS Sri Lanka',
    phone: '011 202 4000',
    location: 'Flower Road, Colombo 07',
    website: 'https://syscolabs.lk',
    industry: 'Foodservice Technology & Logistics',
    bio: 'Sysco LABS is the technology innovation hub of Sysco, the world\'s largest foodservice company, based in the heart of Colombo.',
    logoText: 'SL'
  }
];

const defaultJobs = [
  {
    id: 'job1',
    employerId: 'employer1',
    companyName: 'WSO2 Sri Lanka',
    logoText: 'WSO2',
    title: 'Associate Software Engineer (React)',
    department: 'Integration Cloud Team',
    type: 'Full-time', // Full-time, Part-time, Remote, Contract, Internship
    location: 'Colombo 03 (Hybrid)',
    salary: 'LKR 180,000 - 250,000',
    experience: 'Associate (1-2 years)',
    description: 'We are looking for an Associate Software Engineer skilled in React and modern CSS to join our Integration Cloud engineering team in Colombo. You will design, build, and support customer-facing configuration consoles.',
    requirements: [
      'B.Sc. in Computer Science or equivalent from a recognized Sri Lankan university.',
      'Strong proficiency in JavaScript, React, and state management (Redux or Context API).',
      'Solid experience with modern CSS (Flexbox, Grid, Custom Properties).',
      'Familiarity with REST APIs and git collaboration workflows.'
    ],
    benefits: [
      'Competitive salary pegged to USD rates.',
      'Comprehensive health insurance for employee and immediate family.',
      'Hybrid working schedule (3 days remote, 2 days office).',
      'Complimentary transport services and in-office meals.'
    ],
    createdAt: '2026-06-25T10:00:00.000Z'
  },
  {
    id: 'job2',
    employerId: 'employer1',
    companyName: 'WSO2 Sri Lanka',
    logoText: 'WSO2',
    title: 'Senior QA Engineer (Automation)',
    department: 'Quality Assurance',
    type: 'Full-time',
    location: 'Colombo 03',
    salary: 'LKR 350,000 - 500,000',
    experience: 'Senior (5+ years)',
    description: 'Seeking a Senior QA Engineer to drive test automation frameworks for our core identity server products. You will write automated end-to-end integration tests and optimize CI/CD regression suites.',
    requirements: [
      '5+ years of software testing experience, with 3+ years specializing in Selenium or Playwright.',
      'Proficiency in Java or Python for test automation scripting.',
      'Experience with JMeter, Postman, and API load testing.',
      'Understanding of AWS or Azure deployment pipelines.'
    ],
    benefits: [
      'Top-tier salary pegged to USD with annual performance reviews.',
      'Access to WSO2 wellness program and fitness center memberships.',
      'Continuous learning budget for technical certifications.',
      'Flexible work arrangements.'
    ],
    createdAt: '2026-06-24T12:00:00.000Z'
  },
  {
    id: 'job3',
    employerId: 'employer2',
    companyName: 'Sysco LABS Sri Lanka',
    logoText: 'SL',
    title: 'UI/UX Designer',
    department: 'Digital Design Studio',
    type: 'Remote',
    location: 'Colombo 07 (Remote)',
    salary: 'LKR 150,000 - 220,000',
    experience: 'Mid-Level (2-4 years)',
    description: 'Join our design hub at Sysco LABS to design customer portals, mobile delivery applications, and logistics tools. You will lead UI wireframing, high-fidelity mockups, and run usability testing with global clients.',
    requirements: [
      '2+ years of UI/UX design experience with a strong portfolio of live products.',
      'Proficiency in Figma, prototyping tools, and Adobe Creative Suite.',
      'Deep knowledge of typography, spacing hierarchies, and design systems.',
      'Strong communication skills to collaborate with US-based product managers.'
    ],
    benefits: [
      '100% remote workspace setup allowance.',
      'LKR salary backed by USD stabilization adjustments.',
      'Comprehensive OPD and surgical insurance.',
      'Recreation allowances and online learning platform access.'
    ],
    createdAt: '2026-06-23T08:30:00.000Z'
  },
  {
    id: 'job4',
    employerId: 'employer2',
    companyName: 'Sysco LABS Sri Lanka',
    logoText: 'SL',
    title: 'DevOps Engineering Intern',
    department: 'Infrastructure & Cloud Services',
    type: 'Internship',
    location: 'Colombo 07 (Hybrid)',
    salary: 'LKR 50,000',
    experience: 'Internship (Undergraduate)',
    description: 'We are seeking an undergraduate DevOps intern. You will work alongside senior engineers to automate cloud infrastructure, construct Jenkins CI/CD pipelines, and monitor server operations.',
    requirements: [
      'Undergraduate in Computer Science, IT, or Computer Engineering (University of Moratuwa, SLIIT, IIT, or similar).',
      'Basic knowledge of Linux server terminal and shell scripting.',
      'Understanding of git workflows, Docker containers, and cloud fundamentals.',
      'Highly motivated to learn infrastructure automation.'
    ],
    benefits: [
      'Mentorship by leading industry engineers.',
      'Fast-paced learning environment with access to cutting-edge technologies.',
      'Structured internship feedback and potential full-time hire opportunity.'
    ],
    createdAt: '2026-06-22T09:00:00.000Z'
  }
];

const defaultApplications = [
  {
    id: 'app1',
    jobId: 'job1',
    seekerId: 'seeker1',
    coverLetter: 'I am highly interested in the Associate React position at WSO2. Having completed my internship at WSO2 Cloud team in 2024, I am very familiar with your product structures and engineering workflows. I look forward to contributing to WSO2 integration clouds!',
    status: 'Interviewing', // Applied, Screening, Interviewing, Offered, Rejected
    appliedAt: '2026-06-25T15:30:00.000Z',
    seekerDetails: {
      name: 'Kasun Alwis',
      email: 'seeker@rakiyawak.lk',
      phone: '077 456 7890',
      location: 'Gampaha, Sri Lanka',
      title: 'Associate React Developer',
      resumeName: 'kasun_alwis_resume.pdf'
    }
  }
];

const defaultBookmarks = [
  {
    userId: 'seeker1',
    jobId: 'job3'
  }
];

// Helper to load/save
const read = (key) => JSON.parse(localStorage.getItem(key));
const write = (key, data) => localStorage.setItem(key, JSON.stringify(data));

export const initDB = () => {
  // If the DB was seeded with non-Sri Lankan data previously, let's clear it to force-update
  const existingUsers = read(KEYS.USERS);
  if (existingUsers && !existingUsers.some(u => u.name === 'Kasun Alwis')) {
    localStorage.removeItem(KEYS.USERS);
    localStorage.removeItem(KEYS.JOBS);
    localStorage.removeItem(KEYS.APPLICATIONS);
    localStorage.removeItem(KEYS.BOOKMARKS);
  }

  if (!localStorage.getItem(KEYS.USERS)) {
    write(KEYS.USERS, defaultUsers);
  }
  if (!localStorage.getItem(KEYS.JOBS)) {
    write(KEYS.JOBS, defaultJobs);
  }
  if (!localStorage.getItem(KEYS.APPLICATIONS)) {
    write(KEYS.APPLICATIONS, defaultApplications);
  }
  if (!localStorage.getItem(KEYS.BOOKMARKS)) {
    write(KEYS.BOOKMARKS, defaultBookmarks);
  }
};

// Auth Functions
export const login = (email, password, role) => {
  initDB();
  const users = read(KEYS.USERS);
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password && u.role === role);
  if (!user) {
    throw new Error('Invalid email, password, or role combination.');
  }
  const sessionUser = { ...user };
  delete sessionUser.password; // Don't keep password in session
  write(KEYS.SESSION, sessionUser);
  return sessionUser;
};

export const signup = (email, password, name, role, extraDetails = {}) => {
  initDB();
  const users = read(KEYS.USERS);
  if (users.some(u => u.email.toLowerCase() === email.toLowerCase() && u.role === role)) {
    throw new Error(`An account with this email already exists as a ${role}.`);
  }

  const newUser = {
    id: 'user_' + Date.now(),
    email,
    password,
    role,
    name,
    phone: extraDetails.phone || '',
    location: extraDetails.location || '',
    ...extraDetails
  };

  if (role === 'employer') {
    newUser.companyName = extraDetails.companyName || name;
    newUser.logoText = (extraDetails.companyName || name).split(' ').map(w => w[0]).join('').substring(0, 3).toUpperCase();
    newUser.website = extraDetails.website || '';
    newUser.industry = extraDetails.industry || '';
    newUser.bio = extraDetails.bio || '';
  } else {
    newUser.title = extraDetails.title || '';
    newUser.bio = extraDetails.bio || '';
    newUser.skills = [];
    newUser.education = [];
    newUser.experience = [];
    newUser.resumeName = '';
  }

  users.push(newUser);
  write(KEYS.USERS, users);

  const sessionUser = { ...newUser };
  delete sessionUser.password;
  write(KEYS.SESSION, sessionUser);
  return sessionUser;
};

export const getSessionUser = () => {
  return read(KEYS.SESSION) || null;
};

export const logout = () => {
  localStorage.removeItem(KEYS.SESSION);
};

// Jobs Functions
export const getJobs = (filters = {}) => {
  initDB();
  let jobs = read(KEYS.JOBS);

  if (filters.search) {
    const q = filters.search.toLowerCase();
    jobs = jobs.filter(j => 
      j.title.toLowerCase().includes(q) || 
      j.companyName.toLowerCase().includes(q) ||
      j.department.toLowerCase().includes(q) ||
      j.description.toLowerCase().includes(q)
    );
  }

  if (filters.location) {
    const loc = filters.location.toLowerCase();
    jobs = jobs.filter(j => j.location.toLowerCase().includes(loc));
  }

  if (filters.type && filters.type !== 'All Types') {
    jobs = jobs.filter(j => j.type === filters.type);
  }

  if (filters.experience && filters.experience !== 'All Experience') {
    jobs = jobs.filter(j => j.experience.includes(filters.experience));
  }

  return jobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const getJobById = (id) => {
  initDB();
  const jobs = read(KEYS.JOBS);
  return jobs.find(j => j.id === id) || null;
};

export const addJob = (employerId, jobData) => {
  initDB();
  const jobs = read(KEYS.JOBS);
  const users = read(KEYS.USERS);
  const employer = users.find(u => u.id === employerId);

  if (!employer) throw new Error('Employer not found.');

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

  jobs.push(newJob);
  write(KEYS.JOBS, jobs);
  return newJob;
};

// Application Functions
export const applyToJob = (jobId, seekerId, coverLetter) => {
  initDB();
  const applications = read(KEYS.APPLICATIONS);
  const jobs = read(KEYS.JOBS);
  const users = read(KEYS.USERS);

  const job = jobs.find(j => j.id === jobId);
  const seeker = users.find(u => u.id === seekerId);

  if (!job) throw new Error('Job not found.');
  if (!seeker) throw new Error('Seeker not found.');

  if (applications.some(app => app.jobId === jobId && app.seekerId === seekerId)) {
    throw new Error('You have already applied for this job.');
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

  applications.push(newApplication);
  write(KEYS.APPLICATIONS, applications);
  return newApplication;
};

export const getApplicationsForEmployer = (employerId) => {
  initDB();
  const jobs = read(KEYS.JOBS);
  const applications = read(KEYS.APPLICATIONS);

  const employerJobIds = jobs.filter(j => j.employerId === employerId).map(j => j.id);
  const employerApps = applications.filter(app => employerJobIds.includes(app.jobId));
  
  // Attach job details
  return employerApps.map(app => {
    const job = jobs.find(j => j.id === app.jobId);
    return {
      ...app,
      jobTitle: job ? job.title : 'Deleted Position',
      jobDepartment: job ? job.department : ''
    };
  }).sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));
};

export const getApplicationsForSeeker = (seekerId) => {
  initDB();
  const jobs = read(KEYS.JOBS);
  const applications = read(KEYS.APPLICATIONS);

  const seekerApps = applications.filter(app => app.seekerId === seekerId);

  return seekerApps.map(app => {
    const job = jobs.find(j => j.id === app.jobId);
    return {
      ...app,
      jobTitle: job ? job.title : 'Deleted Position',
      companyName: job ? job.companyName : 'Unknown Company',
      location: job ? job.location : '',
      salary: job ? job.salary : '',
      type: job ? job.type : ''
    };
  }).sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));
};

export const updateApplicationStatus = (applicationId, status) => {
  initDB();
  const applications = read(KEYS.APPLICATIONS);
  const index = applications.findIndex(app => app.id === applicationId);
  if (index === -1) throw new Error('Application not found.');

  applications[index].status = status;
  write(KEYS.APPLICATIONS, applications);
  return applications[index];
};

// Profile Functions
export const updateProfile = (userId, profileData) => {
  initDB();
  const users = read(KEYS.USERS);
  const index = users.findIndex(u => u.id === userId);
  if (index === -1) throw new Error('User not found.');

  const updatedUser = {
    ...users[index],
    ...profileData
  };

  users[index] = updatedUser;
  write(KEYS.USERS, users);

  // Update session
  const sessionUser = { ...updatedUser };
  delete sessionUser.password;
  write(KEYS.SESSION, sessionUser);

  return sessionUser;
};

// Bookmark Functions
export const toggleBookmark = (userId, jobId) => {
  initDB();
  let bookmarks = read(KEYS.BOOKMARKS);
  const index = bookmarks.findIndex(b => b.userId === userId && b.jobId === jobId);

  let isBookmarked = false;
  if (index === -1) {
    bookmarks.push({ userId, jobId });
    isBookmarked = true;
  } else {
    bookmarks.splice(index, 1);
  }

  write(KEYS.BOOKMARKS, bookmarks);
  return isBookmarked;
};

export const getBookmarks = (userId) => {
  initDB();
  const bookmarks = read(KEYS.BOOKMARKS);
  const jobs = read(KEYS.JOBS);

  const userJobIds = bookmarks.filter(b => b.userId === userId).map(b => b.jobId);
  return jobs.filter(j => userJobIds.includes(j.id));
};

export const isJobBookmarked = (userId, jobId) => {
  initDB();
  const bookmarks = read(KEYS.BOOKMARKS);
  return bookmarks.some(b => b.userId === userId && b.jobId === jobId);
};
