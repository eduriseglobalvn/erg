import React from 'react';
import { Metadata } from 'next';
import TrainingFieldsContent from '@/components/marketing/TrainingFieldsContent';
import { SchemaScript } from '@/components/seo/schema-script';
import { generateBreadcrumbItems } from '@/utils/seo/generate-breadcrumb';
import { headers } from 'next/headers';
import { TRAINING_FIELDS } from '@/constants/training-fields';

export const metadata: Metadata = {
    title: 'Lĩnh vực đào tạo CNTT & chứng chỉ quốc tế',
    description: 'Khám phá các chương trình đào tạo CNTT và chứng chỉ tại ERG: IC3 GS6, MOS, Tin học cơ bản và nâng cao, lập trình thiếu nhi, STEM Robotics, AI, luyện thi học sinh giỏi Tin học và lập trình thi đấu.',
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
    alternates: {
        canonical: '/linh-vuc-dao-tao',
    },
    openGraph: {
        type: 'website',
        title: 'Lĩnh vực đào tạo CNTT & chứng chỉ quốc tế | ERG',
        description: 'Tổng quan các chương trình đào tạo CNTT, chứng chỉ quốc tế và phát triển năng lực công nghệ tại ERG.',
        url: '/linh-vuc-dao-tao',
        images: [{ url: '/util/ic3.jpg', alt: 'Lĩnh vực đào tạo CNTT tại ERG' }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Lĩnh vực đào tạo CNTT & chứng chỉ quốc tế | ERG',
        description: 'Khám phá IC3 GS6, MOS, Tin học trẻ, lập trình, STEM Robotics và AI tại ERG.',
        images: ['/util/ic3.jpg'],
    },
};

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
