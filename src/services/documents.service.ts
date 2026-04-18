import { httpClient } from './http-client';
import {
  DOCUMENT_UPLOAD,
  DOCUMENT_BY_ID,
} from '@/constants/endpoints';

// ============================================================
// Types
// ============================================================
export interface DocumentResponse {
  id: string;
  title: string;
  description?: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  isPublic: boolean;
  watermarkConfig?: WatermarkConfig;
  createdAt: string;
  updatedAt: string;
}

export interface WatermarkConfig {
  text: string;
  color: string;
  opacity: number;
  position: { x: number; y: number };
}

export interface PublicDocument {
  id: string;
  title: string;
  description?: string;
  isPublic: boolean;
  createdAt: string;
}

// ============================================================
// Service
// ============================================================
export const documentsService = {
  /**
   * GET /api/documents — Get all public documents (no auth required)
   */
  getPublicDocuments: () => {
    return httpClient<PublicDocument[]>(DOCUMENT_UPLOAD, {
      method: 'GET',
      requireAuth: false,
    });
  },

  /**
   * POST /api/documents — Upload a PDF document
   */
  uploadDocument: (formData: FormData) => {
    return httpClient<DocumentResponse>(DOCUMENT_UPLOAD, {
      method: 'POST',
      body: formData,
      requireAuth: true,
    });
  },

  /**
   * GET /api/documents/:id — Get document metadata (public)
   */
  getDocument: (id: string) => {
    return httpClient<DocumentResponse>(DOCUMENT_BY_ID(id), {
      method: 'GET',
      requireAuth: false,
    });
  },

  /**
   * GET /api/documents/:id/file — Get PDF as blob (for embed/object)
   */
  getDocumentFile: (id: string): Promise<Blob> => {
    return new Promise(async (resolve, reject) => {
      try {
        const isServer = typeof window === 'undefined';
        let url: string;

        if (isServer) {
          const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
          url = `${backendUrl}/api/documents/${id}/file`;
        } else {
          url = `/api/documents/${id}/file`;
        }

        const response = await fetch(url, {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          reject(new Error(errorData.message || `HTTP Error ${response.status}`));
          return;
        }

        const blob = await response.blob();
        resolve(blob);
      } catch (err) {
        reject(err);
      }
    });
  },

  /**
   * DELETE /api/documents/:id — Delete a document
   */
  deleteDocument: (id: string) => {
    return httpClient<void>(DOCUMENT_BY_ID(id), {
      method: 'DELETE',
      requireAuth: true,
    });
  },
};
