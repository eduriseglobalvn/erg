export enum NotificationType {
    AI_POST_COMPLETED = 'AI_POST_COMPLETED',
    AI_POST_FAILED = 'AI_POST_FAILED',
    CRAWL_COMPLETED = 'CRAWL_COMPLETED',
    CRAWL_FAILED = 'CRAWL_FAILED',
    CRAWL_BATCH_COMPLETED = 'CRAWL_BATCH_COMPLETED',
    SYSTEM_ALERT = 'SYSTEM_ALERT',
    USER_ACTION = 'USER_ACTION',
}

export enum NotificationStatus {
    UNREAD = 'UNREAD',
    READ = 'READ',
}

export enum NotificationPriority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    URGENT = 'URGENT',
}

export interface Notification {
    id: string;
    userId: string;
    type: NotificationType;
    status: NotificationStatus;
    priority?: NotificationPriority;
    title: string;
    message: string;
    actionUrl?: string;
    actionText?: string;
    metadata?: {
        postId?: string;
        jobId?: string;
        url?: string;
        rssId?: string;
        topic?: string;
        error?: string;
        title?: string;
    };
    createdAt: string | Date;
    readAt?: string | Date;
}

export interface NotificationListResponse {
    items: Notification[];
    total: number;
}
