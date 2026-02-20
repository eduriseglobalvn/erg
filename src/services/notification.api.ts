import { httpClient } from "./http-client";
import { Notification, NotificationListResponse } from "@/types/notification";

export const notificationApi = {
    // Lấy danh sách thông báo
    getNotifications: async (limit = 20, offset = 0): Promise<NotificationListResponse> => {
        const response: any = await httpClient(`/notifications?limit=${limit}&offset=${offset}`);
        // Handle wrapped response format: { statusCode, message, data: { items, total } }
        return response.data || response;
    },

    // Đếm số thông báo chưa đọc
    getUnreadCount: async (): Promise<number> => {
        const response: any = await httpClient(`/notifications/unread-count`);
        return response.data?.count || response.count || 0;
    },

    // Đánh dấu một thông báo đã đọc
    markAsRead: async (id: string): Promise<Notification> => {
        const response = await httpClient<Notification>(`/notifications/${id}/read`, {
            method: 'PATCH',
        });
        return response;
    },

    // Đánh dấu tất cả đã đọc
    markAllAsRead: async (): Promise<{ updated: number }> => {
        const response = await httpClient<{ updated: number }>(`/notifications/read-all`, {
            method: 'PATCH',
        });
        return response;
    },

    // Xóa thông báo
    deleteNotification: async (id: string): Promise<{ success: boolean }> => {
        const response = await httpClient<{ success: boolean }>(`/notifications/${id}`, {
            method: 'DELETE',
        });
        return response;
    },
};
