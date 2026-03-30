import React from 'react';
import { Metadata } from 'next';
import AboutRecruitmentContent from '@/components/tuyendung/AboutRecruitmentContent';
import { SchemaScript } from '@/components/seo/schema-script';
import { generateBreadcrumbItems } from '@/utils/seo/generate-breadcrumb';
import { headers } from 'next/headers';

import { getTranslations } from 'next-intl/server';

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('recruitment.About');
    return {
        title: t('seo.title'),
        description: t('seo.description'),
    };
}

export default async function AboutRecruitmentPage() {
    const breadcrumbItems = generateBreadcrumbItems('/gioi-thieu', 'Giới thiệu', 'Tuyển dụng');
    const headerList = await headers();
    const host = headerList.get('host') || 'tuyendung.erg.edu.vn';

    return (
        <>
            <SchemaScript type="BreadcrumbList" data={{ items: breadcrumbItems }} domain={host} />
            <AboutRecruitmentContent />
        </>
    );
}
