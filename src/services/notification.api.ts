import { httpClient } from "./http-client";
import { Notification, NotificationListResponse } from "@/types/notification";

export interface ChannelStatus {
    discord: { configured: boolean; channelId: string | null };
    telegram: { configured: boolean; botToken: string | null };
}

export interface NotificationPreferences {
    defaultDiscordChannel: string | null;
    telegramChatId: string | null;
    enabledEvents: {
        crawlSuccess: boolean;
        crawlFailed: boolean;
        trendingAlert: boolean;
        systemAlert: boolean;
        dailyDigest: boolean;
    };
}

export const notificationApi = {
    getNotifications: async (limit = 20, offset = 0): Promise<NotificationListResponse> => {
        const response: any = await httpClient(`/notifications?limit=${limit}&offset=${offset}`);
        return response.data || response;
    },

    getUnreadCount: async (): Promise<number> => {
        const response: any = await httpClient(`/notifications/unread-count`);
        return response.data?.count || response.count || 0;
    },

    markAsRead: async (id: string): Promise<Notification> => {
        return httpClient<Notification>(`/notifications/${id}/read`, { method: 'PATCH' });
    },

    markAllAsRead: async (): Promise<{ updated: number }> => {
        return httpClient<{ updated: number }>(`/notifications/read-all`, { method: 'PATCH' });
    },

    deleteNotification: async (id: string): Promise<{ success: boolean }> => {
        return httpClient<{ success: boolean }>(`/notifications/${id}`, { method: 'DELETE' });
    },

    getChannelStatus: async (): Promise<ChannelStatus> => {
        const response = await httpClient('/notifications/channels/status');
        return (response as any).data || response as ChannelStatus;
    },

    connectDiscord: async (channelId?: string, webhookUrl?: string): Promise<{ success: boolean }> => {
        return httpClient<{ success: boolean }>('/notifications/channels/discord/connect', {
            method: 'POST',
            body: JSON.stringify({ channelId, webhookUrl }),
        });
    },

    testDiscord: async (channelId?: string): Promise<{ success: boolean; messageId?: string; error?: string }> => {
        return httpClient<{ success: boolean; messageId?: string; error?: string }>('/notifications/channels/discord/test', {
            method: 'POST',
            body: JSON.stringify({ channelId }),
        });
    },

    disconnectDiscord: async (): Promise<{ success: boolean; message?: string }> => {
        return httpClient<{ success: boolean; message?: string }>('/notifications/channels/discord/disconnect', {
            method: 'POST',
        });
    },

    connectTelegram: async (chatId?: string, botToken?: string): Promise<{ success: boolean }> => {
        return httpClient<{ success: boolean }>('/notifications/channels/telegram/connect', {
            method: 'POST',
            body: JSON.stringify({ chatId, botToken }),
        });
    },

    testTelegram: async (chatId?: string): Promise<{ success: boolean; messageId?: number; error?: string }> => {
        return httpClient<{ success: boolean; messageId?: number; error?: string }>('/notifications/channels/telegram/test', {
            method: 'POST',
            body: JSON.stringify({ chatId }),
        });
    },

    setTelegramCommands: async (): Promise<{ success: boolean }> => {
        return httpClient<{ success: boolean }>('/notifications/channels/telegram/set-commands', {
            method: 'POST',
        });
    },

    disconnectTelegram: async (): Promise<{ success: boolean; message?: string }> => {
        return httpClient<{ success: boolean; message?: string }>('/notifications/channels/telegram/disconnect', {
            method: 'POST',
        });
    },

    getPreferences: async (): Promise<NotificationPreferences> => {
        const response = await httpClient('/notifications/preferences');
        return (response as any).data || response as NotificationPreferences;
    },

    updatePreferences: async (data: Partial<{
        discordChannelId: string;
        telegramChatId: string;
        enabledEvents: Partial<NotificationPreferences['enabledEvents']>;
    }>): Promise<{ success: boolean }> => {
        return httpClient<{ success: boolean }>('/notifications/preferences', {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    },
};
