import { httpClient } from './http-client';

export interface MenuItem {
    name: string;
    url: string;
    type: 'link' | 'dropdown';
    children?: MenuItem[];
}

export interface MenuResponse {
    data: MenuItem[];
}

export const menuApi = {
    getStructure: async (domain: string): Promise<MenuItem[]> => {
        try {
            const response = await httpClient<MenuResponse>(`/menus/structure?domain=${domain}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching menu structure:', error);
            return [];
        }
    }
};
