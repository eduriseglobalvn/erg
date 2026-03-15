import { httpClient } from './http-client';

export interface ElearningUnitData {
    id: string;
    title: string;
    description?: string;
    studyLink?: string;
    testLink?: string;
    sortOrder: number;
    isActive: boolean;
}

export interface ElearningLevelData {
    id: string;
    title: string;
    description?: string;
    slug: string;
    sortOrder: number;
    isActive: boolean;
    units: ElearningUnitData[];
}

export interface ElearningCategoryData {
    id: string;
    title: string;
    subtitle?: string;
    slug: string;
    sortOrder: number;
    isActive: boolean;
    levels: ElearningLevelData[];
}

export const elearningApi = {
    // ========== PUBLIC ==========
    getCategories: () =>
        httpClient<ElearningCategoryData[]>('/elearning/categories'),

    getCategoryBySlug: (slug: string) =>
        httpClient<ElearningCategoryData>(`/elearning/categories/${slug}`),

    getLevelBySlug: (slug: string) =>
        httpClient<ElearningLevelData>(`/elearning/levels/${slug}`),

    // ========== ADMIN ==========
    admin: {
        getCategories: () =>
            httpClient<ElearningCategoryData[]>('/admin/elearning/categories'),

        createCategory: (data: Partial<ElearningCategoryData>) =>
            httpClient<ElearningCategoryData>('/admin/elearning/categories', {
                method: 'POST',
                body: JSON.stringify(data),
            }),

        updateCategory: (id: string, data: Partial<ElearningCategoryData>) =>
            httpClient<ElearningCategoryData>(`/admin/elearning/categories/${id}`, {
                method: 'PATCH',
                body: JSON.stringify(data),
            }),

        deleteCategory: (id: string) =>
            httpClient<void>(`/admin/elearning/categories/${id}`, { method: 'DELETE' }),

        createLevel: (data: Partial<ElearningLevelData> & { categoryId: string }) =>
            httpClient<ElearningLevelData>('/admin/elearning/levels', {
                method: 'POST',
                body: JSON.stringify(data),
            }),

        updateLevel: (id: string, data: Partial<ElearningLevelData> & { categoryId?: string }) =>
            httpClient<ElearningLevelData>(`/admin/elearning/levels/${id}`, {
                method: 'PATCH',
                body: JSON.stringify(data),
            }),

        deleteLevel: (id: string) =>
            httpClient<void>(`/admin/elearning/levels/${id}`, { method: 'DELETE' }),

        createUnit: (data: Partial<ElearningUnitData> & { levelId: string }) =>
            httpClient<ElearningUnitData>('/admin/elearning/units', {
                method: 'POST',
                body: JSON.stringify(data),
            }),

        updateUnit: (id: string, data: Partial<ElearningUnitData> & { levelId?: string }) =>
            httpClient<ElearningUnitData>(`/admin/elearning/units/${id}`, {
                method: 'PATCH',
                body: JSON.stringify(data),
            }),

        deleteUnit: (id: string) =>
            httpClient<void>(`/admin/elearning/units/${id}`, { method: 'DELETE' }),
    },
};
