'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Upload, FileText, X } from 'lucide-react';
import { Button } from '@/components/admin/ui/button';
import { Input } from '@/components/admin/ui/input';
import { Label } from '@/components/admin/ui/label';
import { Checkbox } from '@/components/admin/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/admin/ui/form';
import { documentsService } from '@/services/documents.service';
import type { WatermarkConfig } from './WatermarkCanvas';
import { WatermarkCanvas } from './WatermarkCanvas';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

const uploadSchema = z.object({
  title: z.string().min(1, 'Tiêu đề là bắt buộc').max(255),
  description: z.string().max(1000).optional(),
  isPublic: z.boolean(),
});

type UploadFormValues = z.infer<typeof uploadSchema>;

export function DocumentUploadForm() {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [watermarkConfig, setWatermarkConfig] = React.useState<WatermarkConfig | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const form = useForm<UploadFormValues>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      title: '',
      description: '',
      isPublic: false as boolean,
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Chỉ chấp nhận file PDF.');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error('File PDF tối đa 50MB.');
      return;
    }

    setSelectedFile(file);
    setWatermarkConfig(null);

    // Auto-fill title from filename (strip extension)
    if (!form.getValues('title')) {
      const nameWithoutExt = file.name.replace(/\.pdf$/i, '');
      form.setValue('title', nameWithoutExt);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setWatermarkConfig(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleWatermarkSubmit = (config: WatermarkConfig) => {
    setWatermarkConfig(config);
    toast.success('Đã áp dụng watermark!');
  };

  const onSubmit = async (values: UploadFormValues) => {
    if (!selectedFile) {
      toast.error('Vui lòng chọn file PDF.');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('title', values.title);
      if (values.description) formData.append('description', values.description);
      formData.append('isPublic', String(values.isPublic));
      formData.append('pdfFile', selectedFile);
      if (watermarkConfig) {
        formData.append('watermarkConfig', JSON.stringify(watermarkConfig));
      }

      await documentsService.uploadDocument(formData);

      toast.success('Tải lên tài liệu thành công!');
      form.reset();
      handleRemoveFile();
    } catch (err: any) {
      toast.error(err?.message || 'Tải lên thất bại. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tiêu đề *</FormLabel>
              <FormControl>
                <Input placeholder="Nhập tiêu đề tài liệu" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả</FormLabel>
              <FormControl>
                <textarea
                  className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  placeholder="Mô tả ngắn về tài liệu (tùy chọn)"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* File upload */}
        <div className="grid gap-2">
          <Label>File PDF *</Label>

          {selectedFile ? (
            <div className="flex items-center gap-3 p-3 border rounded-md bg-muted/30">
              <FileText className="size-8 text-destructive shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={handleRemoveFile}
                aria-label="Xóa file"
              >
                <X className="size-4" />
              </Button>
            </div>
          ) : (
            <div
              className="flex flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed p-6 cursor-pointer hover:border-primary/50 hover:bg-muted/20 transition-colors"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files[0];
                if (file) {
                  const dt = new DataTransfer();
                  dt.items.add(file);
                  if (fileInputRef.current) fileInputRef.current.files = dt.files;
                  fileInputRef.current?.dispatchEvent(new Event('change', { bubbles: true }));
                }
              }}
            >
              <Upload className="size-6 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Kéo thả file PDF hoặc <span className="text-primary underline">chọn file</span>
              </p>
              <p className="text-xs text-muted-foreground">Tối đa 50MB, định dạng .pdf</p>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Watermark Canvas — shown after file is selected */}
        {selectedFile && (
          <div className="grid gap-2">
            <Label>Cấu hình Watermark</Label>
            <p className="text-xs text-muted-foreground">
              Kéo thanh trượt để đặt vị trí watermark. Nhấn &quot;Áp dụng&quot; để lưu.
            </p>
            <WatermarkCanvas
              pdfFile={selectedFile}
              onSubmit={handleWatermarkSubmit}
              onConfigChange={setWatermarkConfig}
            />
          </div>
        )}

        {/* isPublic */}
        <FormField
          control={form.control}
          name="isPublic"
          render={({ field }) => (
            <FormItem className="flex items-center gap-3">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  id="isPublic"
                />
              </FormControl>
              <div className="grid gap-1">
                <FormLabel htmlFor="isPublic" className="font-normal cursor-pointer">
                  Công khai
                </FormLabel>
                <FormDescription>
                  Nếu bật, tài liệu sẽ hiển thị công khai. Tắt = chỉ admin mới thấy.
                </FormDescription>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit */}
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? (
            <>
              <div className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Đang tải lên...
            </>
          ) : (
            <>
              <Upload className="size-4" />
              Tải lên tài liệu
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
