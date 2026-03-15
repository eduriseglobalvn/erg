import React from 'react';
import { Metadata } from 'next';
import NationalITContent from '@/components/tinhocquocgia/NationalITContent';
import { SEO_DATA } from '@/constants/seo.constants';
import { SchemaScript } from '@/components/seo/schema-script';
import { headers } from 'next/headers';
import { generateBreadcrumbItems } from '@/utils/seo/generate-breadcrumb';

import { generateFullMetadata } from '@/utils/seo/seo-metadata';


export default async function NationalITPage() {
  const headerList = await headers();
  const hostname = headerList.get('host') || 'tinhocquocgia.erg.edu.vn';
  const breadcrumbItems = generateBreadcrumbItems('/', 'Trang chủ', 'Tin học Quốc gia');

  return (
    <>
      {/* Breadcrumb Schema */}
      <SchemaScript
        type="BreadcrumbList"
        data={{
          items: breadcrumbItems
        }}
        domain={hostname}
      />

      <NationalITContent />
    </>
  );
}