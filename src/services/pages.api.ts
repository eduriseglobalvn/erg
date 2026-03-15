import { httpClient } from './http-client';

export interface PageContent {
    title: string;
    content?: string; // HTML content if any
    metaTitle?: string;
    metaDescription?: string;
    thumbnail?: string;
    faq?: { question: string; answer: string }[];
    gallery?: string[]; // List of image URLs
    features?: { title: string; description: string; icon?: string }[];
}

export const pagesApi = {
    getPage: async (slug: string, domain?: string): Promise<PageContent | null> => {
        try {
            const response = await httpClient<any>(`/pages/${slug}${domain ? `?domain=${domain}` : ''}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching page ${slug}:`, error);
            return null;
        }
    }
};
