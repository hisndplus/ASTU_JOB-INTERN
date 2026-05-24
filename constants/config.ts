export const APP_NAME = 'CareerBridge';

export const JOB_CATEGORIES = [
  'All',
  'Technology',
  'Design',
  'Marketing',
  'Finance',
  'Healthcare',
  'Education',
  'Engineering',
  'Sales',
  'Operations',
];

export const JOB_TYPES = ['All', 'Full-time', 'Part-time', 'Internship', 'Contract', 'Remote'];

export const EXPERIENCE_LEVELS = ['Entry Level', 'Mid Level', 'Senior', 'Lead', 'Manager'];

export const APPLICATION_STATUSES = ['Pending', 'Reviewed', 'Interview', 'Offer', 'Rejected'];

export const WORKFLOW_INEFFICIENCIES = [
  {
    id: '1',
    title: 'Fragmented Job Discovery',
    severity: 'High',
    description:
      'Job seekers spend an average of 11 hours per week across 5+ platforms searching for relevant positions. There is no unified discovery layer, forcing redundant effort and missed opportunities.',
    impact: '73% of seekers miss relevant jobs due to platform fragmentation.',
    solution: 'Unified smart feed with AI-powered relevance ranking across sources.',
    icon: 'search-off',
  },
  {
    id: '2',
    title: 'Manual Application Re-entry',
    severity: 'Critical',
    description:
      'Candidates re-enter identical personal data (name, education, work history) for every application. The average application form takes 30-45 minutes due to repetitive data input.',
    impact: '60% of candidates abandon applications mid-way due to form fatigue.',
    solution: 'One-time profile creation with smart autofill and universal CV export.',
    icon: 'repeat',
  },
  {
    id: '3',
    title: 'Zero Feedback Loop',
    severity: 'High',
    description:
      'Over 75% of job applications receive no response. Seekers have no visibility into application status, screening stage, or why they were rejected — creating wasted cycles and poor candidate experience.',
    impact: 'Seekers waste 8+ hours following up with zero insight.',
    solution: 'Real-time status updates, automated status notifications, and anonymized feedback.',
  },
  {
    id: '4',
    title: 'Employer Screening Bottleneck',
    severity: 'Medium',
    description:
      'Employers manually review hundreds of unfiltered CVs. Without intelligent pre-screening, hiring managers spend 23 hours per open role on initial review — the majority of which is unqualified candidates.',
    impact: 'Time-to-hire averages 42 days, costing companies $4,700+ per hire.',
    solution: 'Skill-match scoring, knockout questions, and structured screening workflows.',
  },
];
