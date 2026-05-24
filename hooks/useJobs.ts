import { useState, useCallback } from 'react';
import { getJobs, getJobsByEmployer, createJob, deleteJob, getApplications, submitApplication, getApplicants, updateApplicantStatus } from '@/services/jobService';
import { Job, Application, Applicant } from '@/services/mockData';

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getJobs();
      setJobs(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchEmployerJobs = useCallback(async (employerId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getJobsByEmployer(employerId);
      setJobs(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const postJob = useCallback(async (job: Omit<Job, 'id' | 'applicantsCount' | 'postedDate'>) => {
    const newJob = await createJob(job);
    setJobs((prev) => [newJob, ...prev]);
    return newJob;
  }, []);

  const removeJob = useCallback(async (jobId: string) => {
    await deleteJob(jobId);
    setJobs((prev) => prev.filter((j) => j.id !== jobId));
  }, []);

  return { jobs, loading, error, fetchJobs, fetchEmployerJobs, postJob, removeJob };
}

export function useApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchApplications = useCallback(async (seekerId: string) => {
    setLoading(true);
    try {
      const data = await getApplications(seekerId);
      setApplications(data);
    } finally {
      setLoading(false);
    }
  }, []);

  const apply = useCallback(async (seekerId: string, seekerName: string, seekerEmail: string, job: Job, coverLetter: string, resumeName: string) => {
    const app = await submitApplication(seekerId, seekerName, seekerEmail, job, coverLetter, resumeName);
    setApplications((prev) => [app, ...prev]);
    return app;
  }, []);

  return { applications, loading, fetchApplications, apply };
}

export function useApplicants() {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchApplicants = useCallback(async (employerId: string) => {
    setLoading(true);
    try {
      const data = await getApplicants(employerId);
      setApplicants(data);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStatus = useCallback(async (employerId: string, applicantId: string, status: string) => {
    await updateApplicantStatus(employerId, applicantId, status);
    setApplicants((prev) =>
      prev.map((a) => (a.id === applicantId ? { ...a, status } : a))
    );
  }, []);

  return { applicants, loading, fetchApplicants, updateStatus };
}
