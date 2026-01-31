import { httpClient } from './http-client';

// 1. Định nghĩa Interface dựa trên JSON bạn gửi
export interface PostDetailResponse {
    statusCode: number;
    message: string;
    data: {
        id: string;
        title: string;
        content: string;
        slug: string;
        excerpt?: string;
        thumbnailUrl?: string;
        publishedAt?: string;
        updatedAt?: string;
        createdAt?: string; // Add createdAt

        // SEO Fields
        metaTitle?: string;
        metaDescription?: string;
        canonicalUrl?: string;
        schemaType?: string;
        seoScore?: number;
        keywords?: string;

        author?: {
            fullName: string;
            avatarUrl?: string;
            socialLinks?: {
                linkedin?: string;
                twitter?: string;
                facebook?: string;
            };
        };
        category?: {
            id: string;
            name: string;
            slug: string;
        };
        tags?: string[];
    }
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    icon: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface CategoriesResponse {
    statusCode: number;
    message: string;
    data: Category[];
}

export const postsApi = {
    // 2. Hàm getOne trả về đúng Interface trên
    getOne: (id: string) => {
        return httpClient<PostDetailResponse>(`/posts/${id}`);
    },
    getBySlug: (slug: string) => {
        return httpClient<PostDetailResponse>(`/posts/slug/${slug}`);
    },

    create: (data: any) => httpClient('/posts', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => httpClient(`/posts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    getAll: (params: {
        page?: number;
        limit?: number;
        search?: string;
        category?: string;
        status?: string;
        sortBy?: string;
        order?: 'ASC' | 'DESC';
    } = {}) => {
        const query = new URLSearchParams();
        if (params.page) query.append('page', params.page.toString());
        if (params.limit) query.append('limit', params.limit.toString());
        if (params.search) query.append('search', params.search);
        if (params.category) query.append('category', params.category);
        if (params.status) query.append('status', params.status);
        if (params.sortBy) query.append('sortBy', params.sortBy);
        if (params.order) query.append('order', params.order);

        return httpClient<any>(`/posts?${query.toString()}`, { method: 'GET' });
    },

    getCategories: () => {
        return httpClient<CategoriesResponse>('/posts/categories').then(res => res.data);
    },

    getCategoryById: (id: string) => {
        return httpClient<any>(`/posts/categories/${id}`);
    },

    createCategory: (data: { name: string; slug: string; description?: string; icon?: string }) => {
        return httpClient<any>('/posts/categories', { method: 'POST', body: JSON.stringify(data) });
    },

    updateCategory: (id: string, data: { name: string; slug: string; description?: string; icon?: string }) => {
        return httpClient<any>(`/posts/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    },

    deleteCategory: (id: string) => {
        return httpClient<any>(`/posts/categories/${id}`, { method: 'DELETE' });
    },

    // --- POST DELETION & RESTORE ---

    /**
     * Xóa mềm bài viết (Chuyển vào thùng rác)
     */
    softDelete: (id: string) => {
        return httpClient(`/posts/${id}`, { method: 'DELETE' });
    },

    /**
     * Xóa vĩnh viễn bài viết
     */
    hardDelete: (id: string) => {
        return httpClient(`/posts/${id}/permanent`, { method: 'DELETE' });
    },

    /**
     * Khôi phục bài viết từ thùng rác
     */
    restore: (id: string) => {
        return httpClient(`/posts/${id}/restore`, { method: 'PUT' });
    },

    getTrash: (params: {
        page?: number;
        limit?: number;
        search?: string;
    } = {}) => {
        const query = new URLSearchParams();
        if (params.page) query.append('page', params.page.toString());
        if (params.limit) query.append('limit', params.limit.toString());
        if (params.search) query.append('search', params.search);

        return httpClient<any>(`/posts/trash?${query.toString()}`, { method: 'GET' });
    },

    /**
     * Upload ảnh cho bài viết
     * @param file - File ảnh cần upload
     * @returns Promise với URL ảnh đã upload
     */
    uploadImage: async (file: File): Promise<{ url: string }> => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await httpClient<{ statusCode: number; message: string; data: { url: string } }>(
            '/posts/images/upload',
            {
                method: 'POST',
                body: formData,
                // Không set Content-Type, để browser tự set với boundary
            }
        );

        return response.data;
    },

    /**
     * Xóa ảnh khỏi storage bằng URL (Body)
     * @param url - URL đầy đủ của ảnh
     */
    deleteImage: async (url: string): Promise<void> => {
        await httpClient('/posts/images', {
            method: 'DELETE',
            body: JSON.stringify({ url }),
        });
    },

    /**
     * Xóa ảnh khỏi storage bằng Filename (Path)
     * @param filename - Tên file (ví dụ: abc-123.webp)
     */
    deleteImageById: async (filename: string): Promise<void> => {
        await httpClient(`/posts/images/id/${filename}`, {
            method: 'DELETE'
        });
    },
};