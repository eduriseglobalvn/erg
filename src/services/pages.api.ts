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
            // [MOCK] Simulation for development until BE is ready
            // In production, this would be: return httpClient.get(`/pages/${slug}?domain=${domain}`);

            // Mock data for MOS
            if (slug === 'mos') {
                return {
                    title: "Microsoft Office Specialist (MOS)",
                    metaTitle: "Chứng chỉ MOS Quốc tế | Word, Excel, PowerPoint - ERG",
                    metaDescription: "Luyện thi chứng chỉ tin học văn phòng quốc tế MOS (Word, Excel, PowerPoint) chuẩn Microsoft. Ưu tiên xét tuyển đại học và chuẩn đầu ra.",
                    thumbnail: "https://media.erg.edu.vn/banner/mos.jpg",
                    gallery: [
                        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
                        "https://images.unsplash.com/photo-1517048676732-d65bc937f952",
                        "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4"
                    ]
                };
            }

            // Fallback to API
            const response = await httpClient<any>(`/pages/${slug}${domain ? `?domain=${domain}` : ''}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching page ${slug}:`, error);
            return null;
        }
    }
};
