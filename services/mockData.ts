export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  location: string;
  type: string;
  category: string;
  salary: string;
  description: string;
  requirements: string[];
  postedDate: string;
  deadline: string;
  experience: string;
  remote: boolean;
  employerId: string;
  applicantsCount: number;
  featured: boolean;
}

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  appliedDate: string;
  status: string;
  coverLetter: string;
  resumeName: string;
}

export interface Applicant {
  id: string;
  name: string;
  email: string;
  jobId: string;
  jobTitle: string;
  appliedDate: string;
  status: string;
  resumeName: string;
  coverLetter: string;
  experience: string;
}

export const MOCK_JOBS: Job[] = [
  {
    id: 'j1',
    title: 'Senior React Native Developer',
    company: 'TechNova Inc.',
    companyLogo: 'TN',
    location: 'San Francisco, CA',
    type: 'Full-time',
    category: 'Technology',
    salary: '$120,000 – $160,000',
    description:
      'Join our mobile team to build next-generation cross-platform applications. You will architect and implement scalable React Native solutions that serve millions of users globally.',
    requirements: [
      '5+ years React Native experience',
      'Strong TypeScript skills',
      'Experience with Redux/Zustand',
      'CI/CD pipeline knowledge',
      'App Store deployment experience',
    ],
    postedDate: '2026-05-20',
    deadline: '2026-06-20',
    experience: 'Senior',
    remote: true,
    employerId: 'emp1',
    applicantsCount: 34,
    featured: true,
  },
  {
    id: 'j2',
    title: 'UX/UI Design Intern',
    company: 'PixelCraft Studio',
    companyLogo: 'PC',
    location: 'New York, NY',
    type: 'Internship',
    category: 'Design',
    salary: '$25/hr',
    description:
      'An exciting internship opportunity for aspiring designers. Work alongside senior designers on real product challenges and build your portfolio.',
    requirements: [
      'Figma proficiency',
      'Understanding of design systems',
      'Portfolio demonstrating UI skills',
      'Currently enrolled in design program',
    ],
    postedDate: '2026-05-18',
    deadline: '2026-06-15',
    experience: 'Entry Level',
    remote: false,
    employerId: 'emp2',
    applicantsCount: 89,
    featured: false,
  },
  {
    id: 'j3',
    title: 'Product Marketing Manager',
    company: 'GrowthLab',
    companyLogo: 'GL',
    location: 'Austin, TX',
    type: 'Full-time',
    category: 'Marketing',
    salary: '$90,000 – $115,000',
    description:
      'Lead go-to-market strategy for our SaaS product suite. You will own positioning, messaging, and launch planning for new features and product lines.',
    requirements: [
      '3+ years in B2B SaaS marketing',
      'Strong analytical skills',
      'Experience with product launches',
      'Excellent written communication',
    ],
    postedDate: '2026-05-15',
    deadline: '2026-06-10',
    experience: 'Mid Level',
    remote: true,
    employerId: 'emp3',
    applicantsCount: 47,
    featured: true,
  },
  {
    id: 'j4',
    title: 'Data Engineer',
    company: 'DataStream Corp',
    companyLogo: 'DS',
    location: 'Seattle, WA',
    type: 'Full-time',
    category: 'Technology',
    salary: '$130,000 – $170,000',
    description:
      'Design and build scalable data pipelines for real-time analytics. Work with petabyte-scale datasets and cutting-edge streaming technologies.',
    requirements: [
      'Python, Spark, Kafka expertise',
      '4+ years data engineering',
      'Cloud platforms (AWS/GCP)',
      'Strong SQL skills',
    ],
    postedDate: '2026-05-22',
    deadline: '2026-06-25',
    experience: 'Senior',
    remote: false,
    employerId: 'emp4',
    applicantsCount: 21,
    featured: false,
  },
  {
    id: 'j5',
    title: 'Financial Analyst Intern',
    company: 'Capital Bridge',
    companyLogo: 'CB',
    location: 'Chicago, IL',
    type: 'Internship',
    category: 'Finance',
    salary: '$22/hr',
    description:
      'Support the investment analysis team with financial modeling, market research, and due diligence on potential investments.',
    requirements: [
      'Finance or Economics degree in progress',
      'Excel modeling skills',
      'Basic understanding of financial statements',
      'Analytical mindset',
    ],
    postedDate: '2026-05-10',
    deadline: '2026-06-05',
    experience: 'Entry Level',
    remote: false,
    employerId: 'emp5',
    applicantsCount: 112,
    featured: false,
  },
  {
    id: 'j6',
    title: 'Frontend Engineer',
    company: 'WebForge Labs',
    companyLogo: 'WF',
    location: 'Remote',
    type: 'Remote',
    category: 'Technology',
    salary: '$95,000 – $125,000',
    description:
      'Build performant, accessible web interfaces using React and TypeScript. Collaborate with designers and backend engineers in a fully remote-first culture.',
    requirements: [
      'React & TypeScript expertise',
      '3+ years frontend experience',
      'Performance optimization skills',
      'Accessibility standards knowledge',
    ],
    postedDate: '2026-05-21',
    deadline: '2026-06-30',
    experience: 'Mid Level',
    remote: true,
    employerId: 'emp1',
    applicantsCount: 58,
    featured: true,
  },
  {
    id: 'j7',
    title: 'Nursing Practitioner',
    company: 'HealthFirst Medical',
    companyLogo: 'HF',
    location: 'Boston, MA',
    type: 'Full-time',
    category: 'Healthcare',
    salary: '$110,000 – $140,000',
    description:
      'Join our primary care team providing comprehensive patient care in a modern clinic environment with excellent work-life balance.',
    requirements: [
      'NP license required',
      '2+ years clinical experience',
      'Strong patient communication',
      'EMR system familiarity',
    ],
    postedDate: '2026-05-19',
    deadline: '2026-06-19',
    experience: 'Mid Level',
    remote: false,
    employerId: 'emp6',
    applicantsCount: 15,
    featured: false,
  },
  {
    id: 'j8',
    title: 'Sales Development Representative',
    company: 'SalesEdge',
    companyLogo: 'SE',
    location: 'Denver, CO',
    type: 'Full-time',
    category: 'Sales',
    salary: '$55,000 + Commission',
    description:
      'Drive outbound pipeline for our enterprise sales team. Great opportunity for ambitious individuals to break into tech sales with strong earning potential.',
    requirements: [
      'Strong communication skills',
      'Resilience and persistence',
      'CRM experience (Salesforce preferred)',
      '1+ year sales experience helpful',
    ],
    postedDate: '2026-05-23',
    deadline: '2026-07-01',
    experience: 'Entry Level',
    remote: false,
    employerId: 'emp7',
    applicantsCount: 76,
    featured: false,
  },
];

export const MOCK_APPLICATIONS: Application[] = [
  {
    id: 'app1',
    jobId: 'j1',
    jobTitle: 'Senior React Native Developer',
    company: 'TechNova Inc.',
    appliedDate: '2026-05-21',
    status: 'Interview',
    coverLetter: 'I am excited to apply for this role...',
    resumeName: 'MyResume_2026.pdf',
  },
  {
    id: 'app2',
    jobId: 'j3',
    jobTitle: 'Product Marketing Manager',
    company: 'GrowthLab',
    appliedDate: '2026-05-17',
    status: 'Reviewed',
    coverLetter: 'My marketing background aligns well...',
    resumeName: 'MyResume_2026.pdf',
  },
  {
    id: 'app3',
    jobId: 'j6',
    jobTitle: 'Frontend Engineer',
    company: 'WebForge Labs',
    appliedDate: '2026-05-22',
    status: 'Pending',
    coverLetter: 'I am a passionate frontend developer...',
    resumeName: 'MyResume_2026.pdf',
  },
];

export const MOCK_APPLICANTS: Applicant[] = [
  {
    id: 'apl1',
    name: 'Jordan Lee',
    email: 'jordan.lee@email.com',
    jobId: 'j1',
    jobTitle: 'Senior React Native Developer',
    appliedDate: '2026-05-21',
    status: 'Interview',
    resumeName: 'Jordan_Lee_CV.pdf',
    coverLetter: 'I have 6 years of React Native experience...',
    experience: '6 years',
  },
  {
    id: 'apl2',
    name: 'Alex Rivera',
    email: 'alex.rivera@email.com',
    jobId: 'j1',
    jobTitle: 'Senior React Native Developer',
    appliedDate: '2026-05-22',
    status: 'Pending',
    resumeName: 'Alex_Rivera_Resume.pdf',
    coverLetter: 'Building mobile apps is my passion...',
    experience: '5 years',
  },
  {
    id: 'apl3',
    name: 'Sam Chen',
    email: 'sam.chen@email.com',
    jobId: 'j6',
    jobTitle: 'Frontend Engineer',
    appliedDate: '2026-05-23',
    status: 'Reviewed',
    resumeName: 'Sam_Chen_CV.pdf',
    coverLetter: 'TypeScript and React are my strengths...',
    experience: '4 years',
  },
  {
    id: 'apl4',
    name: 'Morgan Davis',
    email: 'morgan.davis@email.com',
    jobId: 'j6',
    jobTitle: 'Frontend Engineer',
    appliedDate: '2026-05-22',
    status: 'Offer',
    resumeName: 'Morgan_Davis_Resume.pdf',
    coverLetter: 'Experienced in building accessible UIs...',
    experience: '3 years',
  },
];
