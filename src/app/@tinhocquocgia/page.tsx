import React from 'react';
import { Metadata } from 'next';
import NationalITContent from '@/components/tinhocquocgia/NationalITContent';
import { SEO_DATA } from '@/constants/seo.constants';
import { SchemaScript } from '@/components/seo/schema-script';
import { headers } from 'next/headers';
import { generateBreadcrumbItems } from '@/utils/seo/generate-breadcrumb';

import { generateFullMetadata } from '@/utils/seo/seo-metadata';
import { createPageMetadata } from '@/utils/seo/page-metadata';


export const metadata: Metadata = {
    ...createPageMetadata({
        title: "Chứng chỉ CNTT cơ bản, nâng cao theo Thông tư 03 | ERG",
        description: "ERG đào tạo và tổ chức thi chứng chỉ Ứng dụng công nghệ thông tin cơ bản và nâng cao theo Thông tư 03, với lộ trình học bài bản và giáo trình sát thực tế.",
        path: "/",
        image: SEO_DATA.tinhocquocgia.ogImage,
        imageAlt: "Chứng chỉ ứng dụng CNTT cơ bản và nâng cao tại ERG",
    }),
    title: { absolute: "Chứng chỉ CNTT cơ bản, nâng cao theo Thông tư 03 | ERG" },
};

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