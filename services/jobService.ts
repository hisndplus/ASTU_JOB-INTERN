import AsyncStorage from '@react-native-async-storage/async-storage';
import { MOCK_JOBS, Job, Application, Applicant } from './mockData';

const JOBS_KEY = 'careerbridge_jobs';
const APPLICATIONS_KEY = 'careerbridge_applications';
const APPLICANTS_KEY = 'careerbridge_applicants';

const generateId = () => 'j_' + Math.random().toString(36).substr(2, 9);
const generateAppId = () => 'app_' + Math.random().toString(36).substr(2, 9);

export async function getJobs(): Promise<Job[]> {
  const json = await AsyncStorage.getItem(JOBS_KEY);
  if (!json) {
    await AsyncStorage.setItem(JOBS_KEY, JSON.stringify(MOCK_JOBS));
    return MOCK_JOBS;
  }
  return JSON.parse(json);
}

export async function getJobsByEmployer(employerId: string): Promise<Job[]> {
  const jobs = await getJobs();
  return jobs.filter((j) => j.employerId === employerId);
}

export async function getJobById(id: string): Promise<Job | null> {
  const jobs = await getJobs();
  return jobs.find((j) => j.id === id) || null;
}

export async function createJob(job: Omit<Job, 'id' | 'applicantsCount' | 'postedDate'>): Promise<Job> {
  const jobs = await getJobs();
  const newJob: Job = {
    ...job,
    id: generateId(),
    applicantsCount: 0,
    postedDate: new Date().toISOString().split('T')[0],
  };
  jobs.unshift(newJob);
  await AsyncStorage.setItem(JOBS_KEY, JSON.stringify(jobs));
  return newJob;
}

export async function deleteJob(jobId: string): Promise<void> {
  const jobs = await getJobs();
  const updated = jobs.filter((j) => j.id !== jobId);
  await AsyncStorage.setItem(JOBS_KEY, JSON.stringify(updated));
}

export async function getApplications(seekerId: string): Promise<Application[]> {
  const json = await AsyncStorage.getItem(APPLICATIONS_KEY + '_' + seekerId);
  if (!json) return [];
  return JSON.parse(json);
}

export async function submitApplication(
  seekerId: string,
  seekerName: string,
  seekerEmail: string,
  job: Job,
  coverLetter: string,
  resumeName: string
): Promise<Application> {
  const applications = await getApplications(seekerId);
  const existing = applications.find((a) => a.jobId === job.id);
  if (existing) throw new Error('You have already applied to this job.');

  const appId = generateAppId();
  const appliedDate = new Date().toISOString().split('T')[0];

  const newApp: Application = {
    id: appId,
    jobId: job.id,
    jobTitle: job.title,
    company: job.company,
    appliedDate,
    status: 'Pending',
    coverLetter,
    resumeName,
  };

  applications.unshift(newApp);
  await AsyncStorage.setItem(APPLICATIONS_KEY + '_' + seekerId, JSON.stringify(applications));

  // Also push to employer's applicants list
  const applicants = await getApplicants(job.employerId);
  const newApplicant: Applicant = {
    id: appId,
    name: seekerName,
    email: seekerEmail,
    jobId: job.id,
    jobTitle: job.title,
    appliedDate,
    status: 'Pending',
    resumeName,
    coverLetter,
    experience: '',
  };
  applicants.unshift(newApplicant);
  await AsyncStorage.setItem(APPLICANTS_KEY + '_' + job.employerId, JSON.stringify(applicants));

  // Increment applicantsCount on the job
  const jobs = await getJobs();
  const jobIdx = jobs.findIndex((j) => j.id === job.id);
  if (jobIdx >= 0) {
    jobs[jobIdx].applicantsCount = (jobs[jobIdx].applicantsCount || 0) + 1;
    await AsyncStorage.setItem(JOBS_KEY, JSON.stringify(jobs));
  }

  return newApp;
}

export async function getApplicants(employerId: string): Promise<Applicant[]> {
  const json = await AsyncStorage.getItem(APPLICANTS_KEY + '_' + employerId);
  if (!json) return [];
  return JSON.parse(json);
}

export async function updateApplicantStatus(
  employerId: string,
  applicantId: string,
  status: string
): Promise<void> {
  const applicants = await getApplicants(employerId);
  const idx = applicants.findIndex((a) => a.id === applicantId);
  if (idx >= 0) {
    applicants[idx].status = status;
    await AsyncStorage.setItem(APPLICANTS_KEY + '_' + employerId, JSON.stringify(applicants));
  }
}
