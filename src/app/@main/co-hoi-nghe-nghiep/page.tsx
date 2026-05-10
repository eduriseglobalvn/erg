import React from 'react';
import { Metadata } from 'next';
import { createPageMetadata } from '@/utils/seo/page-metadata';
import CareerContent from '@/components/marketing/CareerContent';
import { SchemaScript } from '@/components/seo/schema-script';
import { generateBreadcrumbItems } from '@/utils/seo/generate-breadcrumb';
import { headers } from 'next/headers';

export const metadata: Metadata = createPageMetadata({
    title: 'Cơ hội nghề nghiệp',
    description: 'Gia nhập đội ngũ Edurise Global để cùng nhau kiến tạo tương lai giáo dục và công nghệ. Khám phá chính sách phát triển nhân viên và quy trình tuyển dụng.',
    path: '/co-hoi-nghe-nghiep',
    imageAlt: 'C? h?i ngh? nghi?p t?i ERG',
});

export default async function Page() {
  const breadcrumbItems = generateBreadcrumbItems('/co-hoi-nghe-nghiep', 'Cơ hội nghề nghiệp', 'Trang chủ');
  const headerList = await headers();
  const host = headerList.get('host') || 'erg.edu.vn';

  return (
    <>
      <SchemaScript type="BreadcrumbList" data={{ items: breadcrumbItems }} domain={host} />
      <CareerContent />
    </>
  );
}