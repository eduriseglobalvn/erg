import React from 'react';
import { Metadata } from 'next';
import RecruitmentContent from '@/components/tuyendung/RecruitmentContent';
import { SEO_DATA } from '@/constants/seo.constants';
import { SchemaScript } from '@/components/seo/schema-script';
import { generateBreadcrumbItems } from '@/utils/seo/generate-breadcrumb';
import { headers } from 'next/headers';

import { generateFullMetadata } from '@/utils/seo/seo-metadata';
import { createPageMetadata } from '@/utils/seo/page-metadata';

export const revalidate = 300;

export const metadata: Metadata = {
    ...createPageMetadata({
        title: "Tuyển dụng giáo viên Tin học, trợ giảng, nhân sự | ERG",
        description: "Khám phá cơ hội nghề nghiệp tại ERG (Edurise Global) với các nhóm vị trí như giáo viên Tin học IC3/MOS, trợ giảng, giáo vụ, IT Helpdesk. Xem việc làm và ứng tuyển.",
        path: "/",
        image: SEO_DATA.tuyendung.ogImage,
        imageAlt: "Tuyển dụng tại ERG",
    }),
    title: { absolute: "Tuyển dụng giáo viên Tin học, trợ giảng, nhân sự | ERG" },
};

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