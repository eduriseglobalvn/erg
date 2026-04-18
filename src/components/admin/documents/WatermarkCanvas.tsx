'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/admin/ui/button';
import { Input } from '@/components/admin/ui/input';
import { Label } from '@/components/admin/ui/label';

export interface WatermarkConfig {
  text: string;
  color: string; // '#dc2626' | '#6b7280' | '#000000'
  opacity: number; // 0–50
  position: { x: number; y: number }; // percentage 0–100
}

interface WatermarkCanvasProps {
  pdfFile: File;
  initialConfig?: Partial<WatermarkConfig>;
  onConfigChange?: (config: WatermarkConfig) => void;
  onSubmit?: (config: WatermarkConfig) => void;
}

const COLOR_PRESETS = [
  { label: 'Đỏ', value: '#dc2626' },
  { label: 'Xám', value: '#6b7280' },
  { label: 'Đen', value: '#000000' },
] as const;

const DEFAULT_CONFIG: WatermarkConfig = {
  text: 'CONFIDENTIAL',
  color: '#dc2626',
  opacity: 20,
  position: { x: 70, y: 80 },
};

export function WatermarkCanvas({
  pdfFile,
  initialConfig,
  onConfigChange,
  onSubmit,
}: WatermarkCanvasProps) {
  const configRef = React.useRef<WatermarkConfig>({ ...DEFAULT_CONFIG, ...initialConfig });
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);
  const [previewUrl] = React.useState(() => URL.createObjectURL(pdfFile));

  React.useEffect(() => {
    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const emit = (next: Partial<WatermarkConfig>) => {
    configRef.current = { ...configRef.current, ...next };
    forceUpdate();
    onConfigChange?.(configRef.current);
  };

  const handleSubmit = () => {
    onSubmit?.(configRef.current);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Preview area */}
      <div className="relative rounded-md border overflow-hidden bg-muted/30" style={{ minHeight: 400 }}>
        <img
          src={previewUrl}
          alt="PDF preview"
          className="w-full h-auto max-h-[400px] object-contain pointer-events-none select-none"
        />

        {/* Draggable watermark preview */}
        <div
          className="absolute pointer-events-none select-none font-bold tracking-widest"
          style={{
            color: configRef.current.color,
            opacity: configRef.current.opacity / 100,
            fontSize: '1rem',
            left: `${configRef.current.position.x}%`,
            top: `${configRef.current.position.y}%`,
            transform: 'translate(-50%, -50%) rotate-[-30deg]',
            whiteSpace: 'nowrap',
          }}
        >
          {configRef.current.text}
        </div>

        {/* Invisible drag handles */}
        <div className="absolute inset-0">
          {/* Horizontal position */}
          <input
            type="range"
            min={0}
            max={100}
            value={configRef.current.position.x}
            onChange={(e) =>
              emit({ position: { ...configRef.current.position, x: Number(e.target.value) } })
            }
            className="absolute top-0 left-0 w-full h-1 opacity-0 cursor-ew-resize"
            aria-label="Vị trí ngang"
          />
          {/* Vertical position */}
          <input
            type="range"
            min={0}
            max={100}
            value={configRef.current.position.y}
            onChange={(e) =>
              emit({ position: { ...configRef.current.position, y: Number(e.target.value) } })
            }
            className="absolute left-0 top-0 h-full w-1 opacity-0 cursor-ns-resize"
            aria-label="Vị trí dọc"
          />
        </div>
      </div>

      {/* Controls */}
      <div className="grid gap-4 p-4 border rounded-md bg-card">
        {/* Watermark text */}
        <div className="grid gap-2">
          <Label htmlFor="wm-text">Nội dung watermark</Label>
          <Input
            id="wm-text"
            defaultValue={configRef.current.text}
            placeholder="CONFIDENTIAL"
            onChange={(e) => emit({ text: e.target.value })}
          />
        </div>

        {/* Color preset */}
        <div className="grid gap-2">
          <Label>Màu chữ</Label>
          <div className="flex gap-2">
            {COLOR_PRESETS.map((preset) => (
              <button
                key={preset.value}
                type="button"
                onClick={() => emit({ color: preset.value })}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-sm transition-all',
                  configRef.current.color === preset.value
                    ? 'border-primary bg-primary/10 ring-1 ring-primary'
                    : 'border-input hover:bg-accent'
                )}
              >
                <span
                  className="size-3 rounded-full shrink-0"
                  style={{ backgroundColor: preset.value }}
                />
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Opacity slider */}
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="wm-opacity">Độ mờ: {configRef.current.opacity}%</Label>
          </div>
          <input
            id="wm-opacity"
            type="range"
            min={5}
            max={50}
            step={1}
            defaultValue={configRef.current.opacity}
            onChange={(e) => emit({ opacity: Number(e.target.value) })}
            className="w-full accent-primary"
          />
        </div>

        {/* Submit */}
        <Button onClick={handleSubmit} className="w-full">
          Áp dụng Watermark
        </Button>
      </div>
    </div>
  );
}
