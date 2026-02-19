import React from 'react';
import { Metadata } from 'next';
import ComingSoon from "@/components/helper/ComingSoon";
import { SchemaScript } from '@/components/seo/schema-script';
import { generateBreadcrumbItems } from '@/utils/seo/generate-breadcrumb';
import { headers } from 'next/headers';

export const metadata: Metadata = {
  title: 'Đối tác chiến lược',
  description: 'Mạng lưới đối tác chiến lược của ERG Global bao gồm các tổ chức giáo dục, doanh nghiệp công nghệ hàng đầu trong và ngoài nước.',
};

export default async function DoiTacChienLuocPage() {
  const breadcrumbItems = generateBreadcrumbItems('/doi-tac', 'Đối tác chiến lược', 'Trang chủ');
  const headerList = await headers();
  const host = headerList.get('host') || 'erg.edu.vn';

  return (
    <>
      <SchemaScript type="BreadcrumbList" data={{ items: breadcrumbItems }} domain={host} />
      <ComingSoon />
    </>
  );
}