import { httpClient } from "./http-client";

// --- TYPES ---

export type BotChannel = 'discord' | 'telegram';
export type ExecutionStatus = 'pending' | 'success' | 'failed' | 'partial';
export type LinkedAccountStatus = 'active' | 'suspended';

export interface LinkedAccount {
    id: string;
    channel: BotChannel;
    platformUserId: string;
    ergUserId: string;
    lastInteractionAt?: string;
    status: LinkedAccountStatus;
    permissions?: string[];
    notificationPreferences?: {
        crawlAlerts?: boolean;
        trendingAlerts?: boolean;
        systemAlerts?: boolean;
        dailyDigest?: boolean;
    };
    createdAt?: string;
}

export interface LinkedAccountListResponse {
    data: LinkedAccount[];
    total: number;
}

export interface BotCommand {
    id: string;
    conversationId: string;
    channel: BotChannel;
    direction: 'inbound' | 'outbound';
    content: string;
    command?: string;
    commandArgs?: string[];
    executionStatus: ExecutionStatus;
    executionResult?: string;
    executionError?: string;
    executionDurationMs?: number;
    userId?: string;
    chatName?: string;
    createdAt: string;
    processedAt?: string;
}

export interface BotCommandListResponse {
    data: BotCommand[];
    total: number;
}

export interface LinkCodeResponse {
    code: string;
    expiresIn: number;
    message: string;
}

// --- API SERVICE ---

export const botApi = {
    // 1. Link Code
    getLinkCode: () => {
        return httpClient<{ data: LinkCodeResponse }>('/bot/link-code').then(res => res.data);
    },

    // 2. Linked Accounts
    getLinkedAccounts: (channel?: BotChannel) => {
        const url = channel ? `/bot/linked-accounts?channel=${channel}` : '/bot/linked-accounts';
        return httpClient<LinkedAccountListResponse>(url).then(res => res.data || res);
    },

    getLinkedAccount: (id: string) => {
        return httpClient<{ data: LinkedAccount }>(`/bot/linked-accounts/${id}`).then(res => res.data);
    },

    updateLinkedAccountPreferences: (id: string, prefs: {
        crawlAlerts?: boolean;
        trendingAlerts?: boolean;
        systemAlerts?: boolean;
        dailyDigest?: boolean;
    }) => {
        return httpClient<{ success: boolean }>(`/bot/linked-accounts/${id}/preferences`, {
            method: 'POST',
            body: JSON.stringify(prefs),
        }).then(res => (res as any).data ?? res);
    },

    deleteLinkedAccount: (id: string) => {
        return httpClient<{ success: boolean }>(`/bot/linked-accounts/${id}`, {
            method: 'DELETE',
        }).then(res => (res as any).data ?? res);
    },

    // 3. Commands
    getRecentCommands: (limit?: number) => {
        const url = limit ? `/bot/commands/recent?limit=${limit}` : '/bot/commands/recent';
        return httpClient<BotCommandListResponse>(url).then(res => res.data || res);
    },

    getConversation: (conversationId: string, limit?: number) => {
        const url = limit
            ? `/bot/conversations/${conversationId}?limit=${limit}`
            : `/bot/conversations/${conversationId}`;
        return httpClient<{ data: BotCommand[]; total: number }>(url).then(res => res.data || res);
    },
};
