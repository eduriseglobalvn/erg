'use client';

import * as React from 'react';
import { ZoomIn, ZoomOut, ChevronsLeft, ChevronsRight, Maximize } from 'lucide-react';
import { Button, buttonVariants } from '@/components/admin/ui/button';
import { cn } from '@/lib/utils';

interface PdfToolbarProps {
  currentPage: number;
  totalPages: number;
  zoom: number; // percentage e.g. 100
  onZoomChange: (zoom: number) => void;
  onPageChange: (page: number) => void;
}

const MIN_ZOOM = 50;
const MAX_ZOOM = 200;
const ZOOM_STEP = 10;

export function PdfToolbar({
  currentPage,
  totalPages,
  zoom,
  onZoomChange,
  onPageChange,
}: PdfToolbarProps) {
  const handleZoomIn = () => onZoomChange(Math.min(zoom + ZOOM_STEP, MAX_ZOOM));
  const handleZoomOut = () => onZoomChange(Math.max(zoom - ZOOM_STEP, MIN_ZOOM));
  const handleFitWidth = () => onZoomChange(100);

  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <div className="flex items-center gap-2 px-4 py-2 border-b bg-background/80 backdrop-blur-sm">
      {/* Zoom Out */}
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={handleZoomOut}
        disabled={zoom <= MIN_ZOOM}
        aria-label="Thu nhỏ"
      >
        <ZoomOut className="size-4" />
      </Button>

      {/* Zoom percentage */}
      <span className="min-w-[3.5rem] text-center text-sm tabular-nums">
        {zoom}%
      </span>

      {/* Zoom In */}
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={handleZoomIn}
        disabled={zoom >= MAX_ZOOM}
        aria-label="Phóng to"
      >
        <ZoomIn className="size-4" />
      </Button>

      {/* Fit to width */}
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={handleFitWidth}
        aria-label="Fit to width"
      >
        <Maximize className="size-4" />
      </Button>

      {/* Separator */}
      <div className="w-px h-5 bg-border mx-1" />

      {/* Prev */}
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!canGoPrev}
        aria-label="Trang trước"
      >
        <ChevronsLeft className="size-4" />
      </Button>

      {/* Page indicator */}
      <span className="text-sm tabular-nums text-muted-foreground">
        <input
          type="number"
          min={1}
          max={totalPages}
          value={currentPage}
          onChange={(e) => {
            const p = parseInt(e.target.value, 10);
            if (!isNaN(p) && p >= 1 && p <= totalPages) {
              onPageChange(p);
            }
          }}
          className="w-10 text-center bg-transparent border-none outline-none focus:ring-1 focus:ring-ring rounded-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          aria-label="Trang hiện tại"
        />
        <span className="mx-1 text-muted-foreground">/</span>
        <span>{totalPages}</span>
      </span>

      {/* Next */}
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!canGoNext}
        aria-label="Trang sau"
      >
        <ChevronsRight className="size-4" />
      </Button>
    </div>
  );
}