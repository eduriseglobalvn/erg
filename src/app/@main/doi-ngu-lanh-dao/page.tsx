import React from 'react';
import { Metadata } from 'next';
import { createPageMetadata } from '@/utils/seo/page-metadata';
import ComingSoon from "@/components/helper/ComingSoon";
import { SchemaScript } from '@/components/seo/schema-script';
import { generateBreadcrumbItems } from '@/utils/seo/generate-breadcrumb';
import { headers } from 'next/headers';

export const metadata: Metadata = createPageMetadata({
    title: 'Đội ngũ lãnh đạo',
    description: 'Gặp gỡ đội ngũ lãnh đạo tâm huyết và giàu kinh nghiệm tại ERG Global, những người đang dẫn dắt sứ mệnh khai phóng tiềm năng tri thức.',
    path: '/doi-ngu-lanh-dao',
    imageAlt: '??i ng? l?nh ??o ERG',
});

export default async function LanhDaoPage() {
  const breadcrumbItems = generateBreadcrumbItems('/doi-ngu-lanh-dao', 'Đội ngũ lãnh đạo', 'Trang chủ');
  const headerList = await headers();
  const host = headerList.get('host') || 'erg.edu.vn';

  return (
    <>
      <SchemaScript type="BreadcrumbList" data={{ items: breadcrumbItems }} domain={host} />
      <ComingSoon />
    </>
  );
}