
import { httpClient } from './http-client';

export interface Review {
    id: string;
    rating: number; // 1-5
    comment: string;
    userName: string;
    createdAt: string;
    targetId: string;
    targetType: 'post' | 'course' | 'product';
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
    }) => {
        const query = new URLSearchParams();
        query.append('targetId', params.targetId);
        if (params.limit) query.append('limit', params.limit.toString());
        if (params.page) query.append('page', params.page.toString());

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
    }
};
