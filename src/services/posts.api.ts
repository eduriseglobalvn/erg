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
        return httpClient<CategoriesResponse>('/posts/categories');
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
    }
};