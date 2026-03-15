// src/services/ai.api.ts
import { httpClient } from './http-client';

export const aiApi = {
    // 1. Generate: Gửi topic + configs
    generate: (data: {
        topic: string;
        categoryId: string;
        template?: string;
        length?: string;
        provider?: string;
    }) => {
        return httpClient<{ jobId: string }>('/ai-content/generate', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    // 2. Check Status: Token cũng tự động có
    checkStatus: (jobId: string) => {
        return httpClient<{
            state: 'completed' | 'failed' | 'active' | 'waiting';
            progress: number;
            // UPDATE: Backend nên trả về data luôn để đỡ phải fetch lần 2
            data?: { title: string; content: string };
            // Nếu Backend cũ của bạn trả về result.postId thì giữ nguyên dòng dưới:
            // result?: { postId: string }
        }>(`/ai-content/status/${jobId}`);
    },

    // 3. Refine: Token cũng tự động có
    refine: (data: { text: string; instruction: string }) => {
        return httpClient<{ data: { refinedContent: string } }>('/ai-content/refine', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    // 4. AI Key Management
    getMyKeys: () => {
        return httpClient<{
            data: Array<{
                id: string;
                key: string;
                label: string | null;
                provider: string | null;
                projectId: string | null;
                status: 'active' | 'rate_limited' | 'quota_exceeded' | 'error';
                todayUsage: number;
                maxDailyQuota: number;
                usageCount: number;
                lastUsedAt: string | null;
                cooldownUntil: string | null;
                lastErrorMessage: string | null;
            }>
        }>('/ai-content/keys/my');
    },

    saveKey: (data: {
        id?: string;
        key: string;
        label?: string;
        projectId?: string;
        maxDailyQuota?: number;
        type?: 'private' | 'public';
    }) => {
        return httpClient<any>('/ai-content/keys', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    deleteKey: (id: string) => {
        return httpClient<any>(`/ai-content/keys/${id}`, {
            method: 'DELETE',
        });
    },

    testKey: (id: string) => {
        return httpClient<any>(`/ai-content/keys/${id}/test`, { method: 'POST' });
    },

    reactivateKey: (id: string) => {
        return httpClient<any>(`/ai-content/keys/${id}/reactivate`, { method: 'POST' });
    }
};