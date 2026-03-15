
import { httpClient } from './http-client';

export interface Review {
    id: string;
    rating: number; // 1-5
    comment: string;
    userName: string;
    createdAt: string;
    targetId: string;
    targetType: 'post' | 'course' | 'product';
    status?: 'pending' | 'approved' | 'rejected';
    isVerifiedPurchase?: boolean;
    isFeatured?: boolean;
    adminReply?: string;
    helpfulCount?: number;
}

export interface ReviewStats {
    average: number;
    count: number;
    distribution?: { [key: number]: number }; // Số lượng 1 sao, 2 sao...
}

export interface ReviewsResponse {
    data: Review[];
    meta: {
        total: number;
        page: number;
        totalPages: number;
        limit: number;
    };
    stats: ReviewStats;
}

export const reviewsApi = {
    /**
     * Lấy danh sách đánh giá
     */
    getAll: (params: {
        targetId: string;
        limit?: number;
        page?: number;
        sort?: 'newest' | 'highest' | 'lowest' | 'helpful';
    }) => {
        const query = new URLSearchParams();
        query.append('targetId', params.targetId);
        if (params.limit) query.append('limit', params.limit.toString());
        if (params.page) query.append('page', params.page.toString());
        if (params.sort) query.append('sort', params.sort);

        return httpClient<ReviewsResponse>(`/reviews?${query.toString()}`);
    },

    /**
     * Gửi đánh giá mới
     */
    create: (data: {
        targetId: string;
        targetType: 'post' | 'course' | 'product';
        rating: number;
        comment: string;
        userName?: string; // Tùy chọn nếu user đã login
    }) => {
        return httpClient<Review>('/reviews', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    /**
     * Mark a review as helpful
     */
    /**
     * Mark a review as helpful
     */
    markHelpful: (reviewId: string) => {
        return httpClient(`/reviews/${reviewId}/helpful`, {
            method: 'POST'
        });
    },

    /**
     * Lấy danh sách đánh giá (Cho giao diện Admin, bao gồm cả spam, unapproved)
     */
    getAdminAll: (params: {
        status?: 'pending' | 'approved' | 'rejected';
        targetType?: string;
        rating?: number;
        limit?: number;
        page?: number;
    }) => {
        const query = new URLSearchParams();
        if (params.status) query.append('status', params.status);
        if (params.targetType) query.append('targetType', params.targetType);
        if (params.rating) query.append('rating', params.rating.toString());
        if (params.limit) query.append('limit', params.limit.toString());
        if (params.page) query.append('page', params.page.toString());

        return httpClient<ReviewsResponse>(`/reviews/admin/all?${query.toString()}`);
    },

    /**
     * Admin: Duyệt đánh giá
     */
    approve: (reviewId: string) => {
        return httpClient(`/reviews/${reviewId}/approve`, {
            method: 'PATCH'
        });
    },

    /**
     * Admin: Từ chối đánh giá
     */
    reject: (reviewId: string, reason: string, note?: string) => {
        return httpClient(`/reviews/${reviewId}/reject`, {
            method: 'PATCH',
            body: JSON.stringify({ reason, note })
        });
    },

    /**
     * Admin: Phản hồi đánh giá
     */
    reply: (reviewId: string, reply: string) => {
        return httpClient(`/reviews/${reviewId}/reply`, {
            method: 'POST',
            body: JSON.stringify({ reply })
        });
    },

    /**
     * Admin: Đánh dấu nổi bật
     */
    feature: (reviewId: string, isFeatured: boolean) => {
        return httpClient(`/reviews/${reviewId}/feature`, {
            method: 'PATCH',
            body: JSON.stringify({ isFeatured })
        });
    }
};
