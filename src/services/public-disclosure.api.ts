import { httpClient } from './http-client';

export interface DisclosureDocument {
  id: string;
  sectionSlug: string;
  slug: string;
  title: string;
  menuLabel: string;
  shortDescription: string;
  description: string;
  publishedAt: string;
  effectiveDate: string;
  referenceCode: string;
  issuingAuthority: string;
  reviewCycle: string;
  accessScope: string;
  heroKicker: string;
  highlights: string[];
  detailBlocks: Array<{ heading: string; body: string }>;
  cover: {
    eyebrow: string;
    issuedBy: string;
    title: string;
    subtitle: string;
    footer: string;
  };
  documentId?: string;
  thumbnailUrl?: string;
  schoolYear: string;
  createdAt: string;
  updatedAt: string;
}

export const publicDisclosureApi = {
  getAll: (section?: string) => {
    const url = section ? `/public-disclosure?section=${encodeURIComponent(section)}` : '/public-disclosure';
    return httpClient<DisclosureDocument[]>(url, {
      method: 'GET',
    });
  },

  getById: (id: string) => {
    return httpClient<DisclosureDocument>(`/public-disclosure/${id}`, {
      method: 'GET',
    });
  },

  create: (formData: FormData) => {
    return httpClient<DisclosureDocument>('/public-disclosure', {
      method: 'POST',
      body: formData,
      requireAuth: true,
    });
  },

  delete: (id: string) => {
    return httpClient<void>(`/public-disclosure/${id}`, {
      method: 'DELETE',
      requireAuth: true,
    });
  },
};
