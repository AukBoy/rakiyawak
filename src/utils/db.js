// Custom LocalStorage Database Layer for Rakiyawak Job Portal

const KEYS = {
  USERS: 'rakiyawak_users',
  JOBS: 'rakiyawak_jobs',
  APPLICATIONS: 'rakiyawak_applications',
  BOOKMARKS: 'rakiyawak_bookmarks',
  SESSION: 'rakiyawak_session'
};

// Seed Data
const defaultUsers = [
  {
    id: 'seeker1',
    email: 'seeker@rakiyawak.lk',
    password: 'password',
    role: 'seeker',
    name: 'Dilshan Perera',
    phone: '077 123 4567',
    location: 'Colombo',
    title: 'Junior Frontend Developer',
    bio: 'Passionate React developer with 1.5 years of experience building responsive web applications. Enthusiastic about clean code and UI/UX design.',
    skills: ['React', 'JavaScript', 'HTML5', 'CSS3', 'Git', 'REST APIs'],
    education: [
      { school: 'University of Moratuwa', degree: 'B.Sc. in Information Technology', year: '2025' }
    ],
    experience: [
      { company: 'Sysco LABS', role: 'Software Engineer Intern', duration: '6 months (2024)' }
    ],
    resumeName: 'dilshan_perera_resume.pdf'
  },
  {
    id: 'employer1',
    email: 'employer@rakiyawak.lk',
    password: 'password',
    role: 'employer',
    name: 'Sarah Jenkins',
    companyName: 'CodeGen International',
    phone: '011 234 5678',
    location: 'Trace Expert City, Colombo 10',
    website: 'https://codegen.lk',
    industry: 'Software & Cloud Solutions',
    bio: 'CodeGen is a pioneer in travel technology software solutions globally, driven by innovation and high-performance teams.',
    logoText: 'CG'
  },
  {
    id: 'employer2',
    email: 'recruiting@dialog.lk',
    password: 'password',
    role: 'employer',
    name: 'Rohan de Silva',
    companyName: 'Dialog Axiata',
    phone: '077 765 4321',
    location: 'Union Place, Colombo 02',
    website: 'https://dialog.lk',
    industry: 'Telecommunications',
    bio: 'Dialog Axiata PLC is Sri Lanka\'s premier connectivity provider, operating the country\'s leading mobile network.',
    logoText: 'D'
  }
];

const defaultJobs = [
  {
    id: 'job1',
    employerId: 'employer1',
    companyName: 'CodeGen International',
    logoText: 'CG',
    title: 'Associate React Developer',
    department: 'Frontend Engineering',
    type: 'Full-time', // Full-time, Part-time, Remote, Contract, Internship
    location: 'Colombo 10 (Hybrid)',
    salary: 'LKR 150,000 - 220,000',
    experience: 'Associate (1-2 years)',
    description: 'We are seeking an Associate React Developer to join our core product team. You will collaborate with designers and backend engineers to build highly responsive, state-of-the-art enterprise travel software applications.',
    requirements: [
      'Strong proficiency in JavaScript, React, and modern state management (Redux, Context API).',
      'Solid understanding of HTML5, CSS3, and responsive design systems.',
      'Familiarity with RESTful APIs and modern frontend build pipelines (Vite, npm).',
      'Experience with version control tools like Git.'
    ],
    benefits: [
      'Competitive salary package with health insurance.',
      'Hybrid work environment (3 days remote, 2 days office).',
      'Continuous learning and certification subsidies.',
      'Free meals and gym access at Trace Expert City.'
    ],
    createdAt: '2026-06-25T10:00:00.000Z'
  },
  {
    id: 'job2',
    employerId: 'employer1',
    companyName: 'CodeGen International',
    logoText: 'CG',
    title: 'Senior Node.js Engineer',
    department: 'Backend & APIs',
    type: 'Full-time',
    location: 'Colombo 10',
    salary: 'LKR 350,000 - 480,000',
    experience: 'Senior (5+ years)',
    description: 'Looking for a Senior backend engineer with extensive experience in Node.js, Express, and microservices architecture. You will be designing robust, scalable REST and GraphQL APIs handling millions of requests daily.',
    requirements: [
      '5+ years of software development experience, with 3+ years in Node.js backend services.',
      'Deep understanding of asynchronous programming, event loop, and performance tuning.',
      'Familiarity with SQL/NoSQL databases (PostgreSQL, MongoDB) and Redis caching.',
      'Experience with Docker, Kubernetes, and AWS deployment.'
    ],
    benefits: [
      'Top-tier salary matching global standards.',
      'Performance-based annual bonuses.',
      'Comprehensive family medical insurance.',
      'Flexible working hours.'
    ],
    createdAt: '2026-06-24T12:00:00.000Z'
  },
  {
    id: 'job3',
    employerId: 'employer2',
    companyName: 'Dialog Axiata',
    logoText: 'D',
    title: 'UI/UX Designer',
    department: 'Digital Design',
    type: 'Remote',
    location: 'Colombo (100% Remote)',
    salary: 'LKR 120,000 - 180,000',
    experience: 'Mid-Level (2-4 years)',
    description: 'Join Dialog\'s digital experiences team to design user interfaces and seamless user flows for our mobile self-care app and digital service portals. You will translate wireframes into high-fidelity mockups.',
    requirements: [
      'Proven experience as a UI/UX designer with a strong portfolio.',
      'Proficiency in Figma, Adobe XD, or Sketch.',
      'Deep knowledge of wireframing, prototyping, and user journey mapping.',
      'Basic understanding of frontend constraints (HTML/CSS).'
    ],
    benefits: [
      '100% Remote work setting.',
      'Discounted Dialog connection and broadband packages.',
      'Professional training courses on design systems.',
      'Performance incentives.'
    ],
    createdAt: '2026-06-23T08:30:00.000Z'
  },
  {
    id: 'job4',
    employerId: 'employer2',
    companyName: 'Dialog Axiata',
    logoText: 'D',
    title: 'Cloud DevOps Intern',
    department: 'Cloud Services',
    type: 'Internship',
    location: 'Colombo 02 (Hybrid)',
    salary: 'LKR 45,000',
    experience: 'Internship (Undergraduate)',
    description: 'Dialog\'s cloud division is seeking an enthusiastic Cloud DevOps intern. You will assist in CI/CD pipeline automation, monitoring, and cloud resource provisioning under the mentorship of senior engineers.',
    requirements: [
      'Currently pursuing a Bachelor\'s degree in Computer Science, IT, or equivalent.',
      'Basic knowledge of Linux administration and command line interface.',
      'Familiarity with cloud concepts (AWS, Azure, or GCP).',
      'Basic understanding of Docker containers and Git workflows.'
    ],
    benefits: [
      'Excellent learning opportunity with direct industry mentors.',
      'Structured internship certificate and potential full-time conversion.',
      'Subsidized transport allowance.'
    ],
    createdAt: '2026-06-22T09:00:00.000Z'
  }
];

const defaultApplications = [
  {
    id: 'app1',
    jobId: 'job1',
    seekerId: 'seeker1',
    coverLetter: 'I am highly interested in this Associate React position. As a recent graduate from UOM, I have worked on multiple web projects using React and state management. I completed a 6-month internship at Sysco LABS where I optimized frontend loading times by 20%. I would love to bring my skills to CodeGen!',
    status: 'Interviewing', // Applied, Screening, Interviewing, Offered, Rejected
    appliedAt: '2026-06-25T15:30:00.000Z',
    seekerDetails: {
      name: 'Dilshan Perera',
      email: 'seeker@rakiyawak.lk',
      phone: '077 123 4567',
      location: 'Colombo',
      title: 'Junior Frontend Developer',
      resumeName: 'dilshan_perera_resume.pdf'
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
    logoText: employer.logoText || 'CG',
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
