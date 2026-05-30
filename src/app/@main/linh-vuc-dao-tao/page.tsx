import React from 'react';
import { Metadata } from 'next';
import { headers } from 'next/headers';
import TrainingFieldsContent from '@/components/marketing/TrainingFieldsContent';
import { SchemaScript } from '@/components/seo/schema-script';
import { generateBreadcrumbItems } from '@/utils/seo/generate-breadcrumb';
import { TRAINING_FIELDS } from '@/constants/training-fields';
import { generateCanonical, generateFullMetadata } from '@/utils/seo/seo-metadata';

export async function generateMetadata(): Promise<Metadata> {
    const headerList = await headers();
    const host = headerList.get('host') || 'erg.edu.vn';
    const title = 'Lĩnh vực đào tạo CNTT & chứng chỉ quốc tế';
    const description = 'Khám phá các chương trình đào tạo CNTT và chứng chỉ tại ERG: IC3 GS6, MOS, Tin học cơ bản và nâng cao, lập trình thiếu nhi, STEM Robotics, AI, luyện thi học sinh giỏi Tin học và lập trình thi đấu.';

    return generateFullMetadata({
        title,
        description,
        keywords: [
            'lĩnh vực đào tạo ERG',
            'đào tạo CNTT',
            'chứng chỉ tin học',
            'IC3 GS6',
            'MOS',
            'tin học trẻ',
            'lập trình thiếu nhi',
            'STEM Robotics',
            'trí tuệ nhân tạo AI',
            ...TRAINING_FIELDS.map((field) => field.title),
        ],
        path: '/linh-vuc-dao-tao',
        host,
        images: [generateCanonical(host, '/util/ic3.jpg')],
        robots: { index: true, follow: true },
    });
}

export default async function Page() {
    const breadcrumbItems = generateBreadcrumbItems('/linh-vuc-dao-tao', 'Lĩnh vực đào tạo', 'Trang chủ');
    const headerList = await headers();
    const host = headerList.get('host') || 'erg.edu.vn';

    return (
        <>
            <SchemaScript type="BreadcrumbList" data={{ items: breadcrumbItems }} domain={host} />
            <TrainingFieldsContent />
        </>
    );
}
