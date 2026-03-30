import React from 'react';
import { Metadata } from 'next';
import CultureContent from '@/components/tuyendung/CultureContent';
import { SchemaScript } from '@/components/seo/schema-script';
import { generateBreadcrumbItems } from '@/utils/seo/generate-breadcrumb';
import { headers } from 'next/headers';

import { getTranslations } from 'next-intl/server';

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('recruitment.Culture');
    return {
        title: t('seo.title'),
        description: t('seo.description'),
    };
}

export default async function Page() {
    const breadcrumbItems = generateBreadcrumbItems('/van-hoa', 'Văn hóa', 'Tuyển dụng');
    const headerList = await headers();
    const host = headerList.get('host') || 'tuyendung.erg.edu.vn';

    return (
        <>
            <SchemaScript type="BreadcrumbList" data={{ items: breadcrumbItems }} domain={host} />
            <CultureContent />
        </>
    );
}