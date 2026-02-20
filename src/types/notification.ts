export enum NotificationType {
    AI_POST_COMPLETED = 'AI_POST_COMPLETED',
    AI_POST_FAILED = 'AI_POST_FAILED',
    CRAWL_COMPLETED = 'CRAWL_COMPLETED',
    CRAWL_FAILED = 'CRAWL_FAILED',
    CRAWL_BATCH_COMPLETED = 'CRAWL_BATCH_COMPLETED',
}

export enum NotificationStatus {
    UNREAD = 'UNREAD',
    READ = 'READ',
}

export interface Notification {
    id: string;
    userId: string;
    type: NotificationType;
    status: NotificationStatus;
    title: string;
    message: string;
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
