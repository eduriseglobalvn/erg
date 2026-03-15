import { useState, useEffect, useCallback } from 'react';
import { notificationApi } from '@/services/notification.api';
import { Notification } from '@/types/notification';
import { usePolling } from '@/hooks/use-polling';

export function useNotifications(autoRefresh = true, interval = 30000) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = useCallback(async () => {
        try {
            const data = await notificationApi.getNotifications(20, 0);
            setNotifications(data.items);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
    }, []);

    const fetchUnreadCount = useCallback(async () => {
        try {
            const count = await notificationApi.getUnreadCount();
            setUnreadCount(count);
        } catch (error) {
            console.error('Failed to fetch unread count:', error);
        }
    }, []);

    const markAsRead = useCallback(async (id: string) => {
        try {
            await notificationApi.markAsRead(id);
            await Promise.all([fetchNotifications(), fetchUnreadCount()]);
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }
    }, [fetchNotifications, fetchUnreadCount]);

    const markAllAsRead = useCallback(async () => {
        try {
            await notificationApi.markAllAsRead();
            await Promise.all([fetchNotifications(), fetchUnreadCount()]);
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    }, [fetchNotifications, fetchUnreadCount]);

    const deleteNotification = useCallback(async (id: string) => {
        try {
            await notificationApi.deleteNotification(id);
            await Promise.all([fetchNotifications(), fetchUnreadCount()]);
        } catch (error) {
            console.error('Failed to delete notification:', error);
        }
    }, [fetchNotifications, fetchUnreadCount]);

    const refreshData = useCallback(() => {
        fetchNotifications();
        fetchUnreadCount();
    }, [fetchNotifications, fetchUnreadCount]);

    // Use custom polling hook
    usePolling(refreshData, autoRefresh ? interval : null);

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            await Promise.all([fetchNotifications(), fetchUnreadCount()]);
            setLoading(false);
        };

        init();
    }, [fetchNotifications, fetchUnreadCount]);

    return {
        notifications,
        unreadCount,
        loading,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        refresh: fetchNotifications,
    };
}
