// src/services/ai.api.ts
import { httpClient } from './http-client';

export type AIProvider = 'groq' | 'gemini';
export type AIKeyStatus = 'active' | 'inactive' | 'rate_limited' | 'quota_exceeded' | 'error';

export interface AIKey {
    id: string;
    key: string;
    maskedKey: string;
    label: string;
    provider: AIProvider;
    projectId: string;
    type: 'shared' | 'private';
    status: AIKeyStatus;
    selected: boolean;
    model: string;
    todayUsage: number;
    maxDailyQuota: number;
    usageCount: number;
    maxTokensPerRequest: number;
    defaultTemperature: number;
    lastUsedAt: string | null;
    lastTestedAt: string | null;
    cooldownUntil: string | null;
    lastErrorMessage: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface SaveAIKeyPayload {
    key: string;
    label?: string;
    provider: AIProvider;
    projectId?: string;
    model?: string;
    maxDailyQuota?: number;
    maxTokensPerRequest?: number;
    defaultTemperature?: number;
    type?: 'shared' | 'private';
    selected?: boolean;
}

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
    // [BE v2026-03] Giờ trả về seoScore, readabilityScore, keywordDensity khi completed
    checkStatus: (jobId: string) => {
        return httpClient<{
            state: 'completed' | 'failed' | 'active' | 'waiting';
            progress: number;
            data?: {
                title: string;
                content: string;
                excerpt?: string;
                slug?: string;
                categoryId?: string;
                thumbnailUrl?: string;
                thumbnailPrompt?: string;
            };
            result?: {
                postId?: string;
                slug?: string;
                title?: string;
                content?: string;
                excerpt?: string;
                categoryId?: string;
                thumbnailUrl?: string;
                thumbnailPrompt?: string;
            };
            // [MỚI] SEO scores được tính tự động khi AI hoàn thành content
            seoScore?: number;
            readabilityScore?: number;
            keywordDensity?: number;
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
            data: AIKey[]
        }>('/ai-content/keys/my');
    },

    getKeysDashboard: () => {
        return httpClient<{
            data: {
                total_keys: number;
                active_keys: number;
                selected_key: AIKey | null;
                total_usage: number;
                monthly_usage: number;
                by_provider: Record<string, number>;
            }
        }>('/ai-content/keys/dashboard');
    },

    getProviderHealth: () => {
        return httpClient<{ data: Record<string, any> }>('/ai-content/provider-health');
    },

    saveKey: (data: SaveAIKeyPayload) => {
        return httpClient<{ data: AIKey }>('/ai-content/keys', {
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
        return httpClient<{ data: { ok: boolean; key: AIKey } }>(`/ai-content/keys/${id}/test`, { method: 'POST' });
    },

    selectKey: (id: string) => {
        return httpClient<{ data: AIKey }>(`/ai-content/keys/${id}/select`, { method: 'POST' });
    },

    reactivateKey: (id: string) => {
        return httpClient<{ data: AIKey }>(`/ai-content/keys/${id}/reactivate`, { method: 'POST' });
    }
};
