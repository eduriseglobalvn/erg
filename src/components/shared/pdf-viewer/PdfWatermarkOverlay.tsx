'use client';

import { cn } from '@/lib/utils';

interface PdfWatermarkOverlayProps {
  documentId: string;
  title?: string;
  className?: string;
}

/**
 * Diện mềm watermark overlay — pointer-events-none, user-select-none.
 * Hiển thị "CONFIDENTIAL" và title ở bottom-right, rotated -30deg, opacity 20%.
 */
export function PdfWatermarkOverlay({
  documentId,
  title = 'CONFIDENTIAL',
  className,
}: PdfWatermarkOverlayProps) {
  return (
    <div
      className={cn(
        'pointer-events-none select-none absolute inset-0 z-10 overflow-hidden',
        className
      )}
      aria-hidden="true"
    >
      {/* CONFIDENTIAL watermark — bottom-right diagonal */}
      <div
        className="absolute bottom-8 right-6 rotate-[-30deg] whitespace-nowrap"
        style={{ opacity: 0.2, fontSize: 'clamp(1rem, 2vw, 1.5rem)', fontWeight: 700, letterSpacing: '0.15em', color: '#dc2626', fontFamily: 'monospace' }}
      >
        {title}
      </div>

      {/* Subtle corner mark */}
      <div
        className="absolute top-4 left-4"
        style={{ opacity: 0.1, fontSize: '0.65rem', color: '#6b7280', fontFamily: 'monospace', letterSpacing: '0.05em' }}
      >
        {documentId}
      </div>
    </div>
  );
}
