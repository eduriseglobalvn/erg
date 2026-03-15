import React from 'react';
import { Metadata } from 'next';
import RecruitmentContent from '@/components/tuyendung/RecruitmentContent';
import { SEO_DATA } from '@/constants/seo.constants';
import { SchemaScript } from '@/components/seo/schema-script';
import { generateBreadcrumbItems } from '@/utils/seo/generate-breadcrumb';
import { headers } from 'next/headers';

import { generateFullMetadata } from '@/utils/seo/seo-metadata';

export const revalidate = 300;

export default async function RecruitmentPage() {
  const breadcrumbItems = generateBreadcrumbItems('/tuyen-dung', 'Tuyển dụng', 'ERG');
  const headerList = await headers();
  const host = headerList.get('host') || 'tuyendung.erg.edu.vn';

  return (
    <>
      <SchemaScript type="BreadcrumbList" data={{ items: breadcrumbItems }} domain={host} />
      <RecruitmentContent />
    </>
  );
}