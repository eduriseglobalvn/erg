import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { documentsService } from '@/services/documents.service';
import { PdfViewer } from '@/components/shared/pdf-viewer';
import { generateBreadcrumbItems } from '@/utils/seo/generate-breadcrumb';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const doc = await documentsService.getDocument(id);
    return {
      title: doc.title,
      description: doc.description || `Tài liệu: ${doc.title}`,
    };
  } catch {
    return { title: 'Tài liệu' };
  }
}

export default async function PdfPage({ params }: PageProps) {
  const { id } = await params;

  let document: Awaited<ReturnType<typeof documentsService.getDocument>>;

  try {
    document = await documentsService.getDocument(id);
  } catch {
    notFound();
  }

  const breadcrumbItems = generateBreadcrumbItems(`/pdf/${id}`, document.title, 'Trang chủ');

  return (
    <div className="container mx-auto py-6 px-4">
      {/* Breadcrumb */}
      <nav className="mb-4 text-sm text-muted-foreground">
        <ol className="flex items-center gap-1">
          {breadcrumbItems.map((item, i) => (
            <li key={i} className="flex items-center gap-1">
              {i > 0 && <span className="mx-1">/</span>}
              <span className={i === breadcrumbItems.length - 1 ? 'font-medium text-foreground' : ''}>
                {item.label}
              </span>
            </li>
          ))}
        </ol>
      </nav>

      {/* PDF Viewer — client component, SSR-friendly */}
      <div className="h-[calc(100vh-12rem)] min-h-[500px]">
        <PdfViewer documentId={id} fileUrl={`/api/documents/${id}/file`} title={document.title} />
      </div>
    </div>
  );
}
