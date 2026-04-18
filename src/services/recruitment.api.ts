import { httpClient } from '@/services/http-client';
import { getPreferredBackendBaseUrl } from '@/lib/backend-url';
import { Job, Candidate, CandidateStatus } from '@/types/recruitment';

export interface ApiResponse<T> {
    statusCode: number;
    message: string;
    data: T;
    errors?: any;
    timestamp?: string;
    path?: string;
}

export const recruitmentApi = {
    // --- PUBLIC API ---

    // 1. Lấy danh sách việc làm đang mở (Active)
    getJobs: async (searchParams?: Record<string, any>) => {
        const queryParams = new URLSearchParams();
        if (searchParams) {
            Object.entries(searchParams).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    value.forEach(v => queryParams.append(key, String(v)));
                } else if (value !== undefined && value !== null && value !== '') {
                    queryParams.append(key, String(value));
                }
            });
        }
        const query = queryParams.toString();
        const endpoint = `/recruitment/jobs${query ? `?${query}` : ''}`;

        // Server-side fetching
        if (typeof window === 'undefined') {
            const backendUrl = getPreferredBackendBaseUrl();
            const url = `${backendUrl}/api${endpoint}`;
            const res = await fetch(url, { next: { revalidate: 60 } });
            if (!res.ok) throw new Error(`Failed to fetch jobs: ${res.status}`);
            return res.json() as Promise<ApiResponse<{ items: Job[]; meta: any }>>;
        }

        return httpClient<ApiResponse<{ items: Job[]; meta: any }>>(endpoint);
    },

    // 2. Lấy chi tiết việc làm
    getJobBySlug: async (slug: string) => {
        const endpoint = `/recruitment/jobs/${slug}`;

        // Server-side fetching
        if (typeof window === 'undefined') {
            const backendUrl = getPreferredBackendBaseUrl();
            const url = `${backendUrl}/api${endpoint}`;
            const res = await fetch(url, { next: { revalidate: 60 } });
            if (!res.ok) throw new Error(`Failed to fetch job ${slug}: ${res.status}`);
            return res.json() as Promise<ApiResponse<Job>>;
        }

        return httpClient<ApiResponse<Job>>(endpoint);
    },

    // 3. Nộp hồ sơ (Apply)
    applyJob: (formData: FormData) => {
        return httpClient<ApiResponse<{ trackingCode: string; message: string }>>('/recruitment/apply', {
            method: 'POST',
            body: formData,
        });
    },

    // 4. Theo dõi trạng thái hồ sơ (Tracking)
    trackCandidate: (code: string) => {
        return httpClient<ApiResponse<Candidate>>(`/recruitment/tracking/${code}`);
    },

    // --- ADMIN API ---

    adminGetJobs: (params?: { page?: number; limit?: number, q?: string }) => {
        const query = new URLSearchParams(params as any).toString();
        return httpClient<ApiResponse<{ items: Job[]; meta: any }>>(`/recruitment/jobs?${query}`);
    },

    adminCreateJob: (data: Partial<Job>) => {
        return httpClient<ApiResponse<Job>>('/recruitment/jobs', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    adminUpdateJob: (id: string, data: Partial<Job>) => {
        return httpClient<ApiResponse<Job>>(`/recruitment/jobs/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    adminDeleteJob: (id: string) => {
        return httpClient<ApiResponse<null>>(`/recruitment/jobs/${id}`, {
            method: 'DELETE',
        });
    },

    adminGetOneJob: (id: string) => {
        return httpClient<ApiResponse<Job>>(`/recruitment/jobs/${id}`);
    },

    // 2. Thao Tác Nhanh (Toggles)
    adminToggleHot: (id: string) => {
        return httpClient<ApiResponse<Job>>(`/recruitment/jobs/${id}/toggle-hot`, { method: 'PATCH' });
    },

    adminToggleUrgent: (id: string) => {
        return httpClient<ApiResponse<Job>>(`/recruitment/jobs/${id}/toggle-urgent`, { method: 'PATCH' });
    },

    adminUpdateStatus: (id: string, isActive: boolean) => {
        return httpClient<ApiResponse<Job>>(`/recruitment/jobs/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ isActive })
        });
    },

    // 3. Quản lý Candidates
    adminGetCandidates: (params?: { jobId?: string; status?: CandidateStatus; page?: number; limit?: number }) => {
        const query = new URLSearchParams(params as any).toString();
        return httpClient<ApiResponse<Candidate[]>>(`/recruitment/admin/candidates?${query}`);
    },

    adminUpdateCandidateStatus: (id: string, status: CandidateStatus) => {
        return httpClient<ApiResponse<Candidate>>(`/recruitment/admin/candidates/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
        });
    },
};
