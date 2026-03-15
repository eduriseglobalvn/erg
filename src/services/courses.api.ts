import { httpClient } from './http-client';

export interface CourseFilterParams {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    status?: string;
    instructorId?: string;
    sortBy?: string;
    order?: 'ASC' | 'DESC';
}

export const coursesApi = {
    // Basic CRUD Operations
    getAll: (params: CourseFilterParams = {}) => {
        const query = new URLSearchParams();
        if (params.page !== undefined) query.append('page', params.page.toString());
        if (params.limit !== undefined) query.append('limit', params.limit.toString());
        if (params.search) query.append('search', params.search);
        if (params.category) query.append('category', params.category);
        if (params.status) query.append('status', params.status);
        if (params.instructorId) query.append('instructorId', params.instructorId);
        if (params.sortBy) query.append('sortBy', params.sortBy);
        if (params.order) query.append('order', params.order);

        return httpClient<any>(`/courses?${query.toString()}`);
    },

    getOne: (id: string) => {
        return httpClient<any>(`/courses/${id}`);
    },

    getBySlug: (slug: string) => {
        return httpClient<any>(`/courses/slug/${slug}`);
    },

    create: (data: any) => {
        return httpClient<any>('/courses', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    update: (id: string, data: any) => {
        return httpClient<any>(`/courses/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    },

    delete: (id: string) => {
        return httpClient<any>(`/courses/${id}`, {
            method: 'DELETE',
        });
    },

    // Theme Management
    updateTheme: (id: string, themeData: any) => {
        return httpClient<any>(`/courses/${id}/theme`, {
            method: 'PATCH',
            body: JSON.stringify(themeData),
        });
    },

    // Syllabus Management
    getLessons: (courseId: string) => {
        return httpClient<any>(`/courses/${courseId}/lessons`);
    },

    reorderLessons: (courseId: string, lessonIds: string[]) => {
        return httpClient<any>(`/courses/${courseId}/lessons/reorder`, {
            method: 'POST',
            body: JSON.stringify({ lessonIds }),
        });
    },

    // Categories
    getCategories: () => {
        return httpClient<any>('/courses/categories');
    },
};
