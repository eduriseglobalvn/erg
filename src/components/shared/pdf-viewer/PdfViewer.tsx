'use client';

import * as React from 'react';
import { useEffect, useState, useCallback } from 'react';
import { useModifierBlur } from './useModifierBlur';
import { PdfToolbar } from './PdfToolbar';
import { PdfWatermarkOverlay } from './PdfWatermarkOverlay';

interface PdfViewerProps {
  documentId?: string;
  fileUrl?: string;
  title?: string;
}

export function PdfViewer({ documentId, fileUrl, title = 'CONFIDENTIAL' }: PdfViewerProps) {
  const { isBlurred } = useModifierBlur();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  // Load PDF blob from backend stream URL or use the direct file URL when provided.
  useEffect(() => {
    let objectUrl: string | null = null;

    const loadPdf = async () => {
      try {
        if (fileUrl) {
          setPdfUrl(fileUrl);
          return;
        }

        if (!documentId) {
          setPdfUrl(null);
          return;
        }

        const isServer = typeof window === 'undefined';
        let url: string;

        if (isServer) {
          const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
          url = `${backendUrl}/api/documents/${documentId}/file`;
        } else {
          url = `/api/documents/${documentId}/file`;
        }

        const response = await fetch(url, { credentials: 'include' });
        if (!response.ok) throw new Error(`Failed to load PDF: ${response.status}`);

        const blob = await response.blob();
        objectUrl = URL.createObjectURL(blob);
        setPdfUrl(objectUrl);
      } catch (err) {
        console.error('[PdfViewer] Failed to load PDF:', err);
      }
    };

    loadPdf();

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [documentId, fileUrl]);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    return false;
  }, []);

  const handleDragStart = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    return false;
  }, []);

  const handleCopy = useCallback((e: React.ClipboardEvent) => {
    // Allow normal copy — text selection is fine for normal users
  }, []);

  return (
    <div
      className="relative flex flex-col h-full w-full overflow-hidden rounded-md border"
      onContextMenu={handleContextMenu}
      onDragStart={handleDragStart}
      onCopy={handleCopy}
    >
      {/* Disclaimer banner — persistent, pointer-events-none */}
      <div className="pointer-events-none flex items-center gap-2 bg-destructive/10 border-b border-destructive/20 px-4 py-2 text-xs text-destructive font-medium">
        <svg className="size-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        Tài liệu này được bảo mật. Việc sao chép hoặc phát tán trái phép bị nghiêm cấm.
      </div>

      {/* Toolbar */}
      <PdfToolbar
        currentPage={currentPage}
        totalPages={totalPages}
        zoom={zoom}
        onZoomChange={setZoom}
        onPageChange={setCurrentPage}
      />

      {/* PDF Container */}
      <div
        className="relative flex-1 overflow-auto bg-muted/30"
        style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
      >
        {pdfUrl ? (
          <iframe
            src={pdfUrl}
            className="w-full h-full border-0"
            title={`Document ${documentId || title}`}
            sandbox="allow-same-origin allow-scripts"
          />
        ) : (
          /* Placeholder while loading */
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-3 text-muted-foreground">
              <div className="size-8 animate-spin rounded-full border-2 border-current border-t-transparent" />
              <span className="text-sm">Đang tải tài liệu...</span>
            </div>
          </div>
        )}

        {/* Watermark overlay */}
        <PdfWatermarkOverlay documentId={documentId || title} title={title} />
      </div>

      {/* Blur overlay — active when modifier key is pressed */}
      {isBlurred && (
        <div
          className="fixed inset-0 z-[9998] backdrop-blur-[20px] pointer-events-none bg-background/30"
          aria-hidden="true"
        />
      )}
    </div>
  );
}
