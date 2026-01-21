import { httpClient } from './http-client';

// 1. Định nghĩa Interface dựa trên JSON bạn gửi
export interface PostDetailResponse {
    statusCode: number;
    message: string;
    data: {
        id: string;
        title: string;   // <--- Cần cái này
        content: string; // <--- Cần cái này (HTML)
        slug: string;
        excerpt?: string;
        // ... các trường khác nếu cần
    }
}

export const postsApi = {
    // 2. Hàm getOne trả về đúng Interface trên
    getOne: (id: string) => {
        return httpClient<PostDetailResponse>(`/posts/${id}`);
    },

    create: (data: any) => httpClient('/posts', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => httpClient(`/posts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
};