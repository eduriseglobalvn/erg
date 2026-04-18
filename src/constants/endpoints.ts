// ============================================================
// Documents endpoints
// ============================================================
export const DOCUMENT_UPLOAD = '/api/documents';
export const DOCUMENT_BY_ID = (id: string) => `/api/documents/${id}`;
export const DOCUMENT_FILE = (id: string) => `/api/documents/${id}/file`;
