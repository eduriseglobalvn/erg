import { httpClient } from '@/services/http-client';
import { Job, Candidate, JobStatus, CandidateStatus } from '@/types/recruitment';

export const recruitmentApi = {
    // --- PUBLIC API ---

    // Lấy danh sách việc làm
    // Lấy danh sách việc làm
    getJobs: async (params?: { status?: JobStatus; page?: number; limit?: number }) => {
        const query = new URLSearchParams(params as any).toString();
        const endpoint = `/recruitment/jobs?${query}`;

        // Server-side fetching
        if (typeof window === 'undefined') {
            const backendUrl = process.env.BACKEND_URL || 'http://localhost:3003';
            const url = `${backendUrl}/api${endpoint}`;
            const res = await fetch(url, { next: { revalidate: 60 } });
            if (!res.ok) throw new Error(`Failed to fetch jobs: ${res.status}`);
            return res.json();
        }

        return httpClient<{ data: Job[]; meta?: any }>(endpoint);
    },

    // Lấy chi tiết việc làm theo Slug
    getJobBySlug: async (slug: string) => {
        const endpoint = `/recruitment/jobs/${slug}`;

        // Server-side fetching
        if (typeof window === 'undefined') {
            const backendUrl = process.env.BACKEND_URL || 'http://localhost:3003';
            const url = `${backendUrl}/api${endpoint}`;
            const res = await fetch(url, { next: { revalidate: 60 } });
            if (!res.ok) throw new Error(`Failed to fetch job ${slug}: ${res.status}`);
            return res.json();
        }

        return httpClient<{ data: Job }>(endpoint);
    },

    // Ứng tuyển (Upload CV)
    applyJob: (formData: FormData) => {
        // Note: httpClient wrapper usually sets Content-Type to json by default.
        // Ensure the wrapper handles FormData correctly (removing Content-Type header to let browser set boundary)
        // Or use native fetch for this specific multipart call if wrapper is rigid.
        return httpClient<{ data: { trackingCode: string; message: string } }>('/recruitment/apply', {
            method: 'POST',
            body: formData,
            // headers: {} // Let browser set Content-Type for FormData
        });
    },

    // Tra cứu hồ sơ
    trackCandidate: (code: string) => {
        return httpClient<{ data: Candidate }>(`/recruitment/tracking/${code}`);
    },

    // --- ADMIN API ---

    // Quản lý Jobs
    adminGetJobs: (params?: { page?: number; limit?: number, q?: string }) => {
        const query = new URLSearchParams(params as any).toString();
        return httpClient<{ data: Job[]; meta: any }>(`/recruitment/admin/jobs?${query}`);
    },

    adminCreateJob: (data: Partial<Job>) => {
        return httpClient<{ data: Job }>('/recruitment/admin/jobs', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    adminUpdateJob: (id: string, data: Partial<Job>) => {
        return httpClient<{ data: Job }>(`/recruitment/admin/jobs/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    },

    adminDeleteJob: (id: string) => {
        return httpClient<{ message: string }>(`/recruitment/admin/jobs/${id}`, {
            method: 'DELETE',
        });
    },

    adminGetOneJob: (id: string) => {
        return httpClient<{ data: Job }>(`/recruitment/admin/jobs/${id}`);
    },

    // Toggle Flags
    adminToggleHot: (id: string) => {
        return httpClient<{ data: Job }>(`/recruitment/admin/jobs/${id}/toggle-hot`, { method: 'PATCH' });
    },

    adminToggleUrgent: (id: string) => {
        return httpClient<{ data: Job }>(`/recruitment/admin/jobs/${id}/toggle-urgent`, { method: 'PATCH' });
    },

    adminUpdateStatus: (id: string, isActive: boolean) => {
        return httpClient<{ data: Job }>(`/recruitment/admin/jobs/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ isActive })
        });
    },

    // Quản lý Candidates
    adminGetCandidates: (params?: { jobId?: string; status?: CandidateStatus; page?: number; limit?: number }) => {
        const query = new URLSearchParams(params as any).toString();
        return httpClient<{ data: Candidate[]; meta: any }>(`/recruitment/admin/candidates?${query}`);
    },

    adminUpdateCandidateStatus: (id: string, status: CandidateStatus) => {
        return httpClient<{ data: Candidate }>(`/recruitment/admin/candidates/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
        });
    },
};
