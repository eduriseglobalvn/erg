// src/services/ai.api.ts
import { httpClient } from './http-client';

export const aiApi = {
    // 1. Generate: Chỉ cần gửi topic, Token đã được httpClient tự lo
    generate: (data: { topic: string; categoryId: string }) => {
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
        return httpClient<{ result: string }>('/ai-content/refine', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
};