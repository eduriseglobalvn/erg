import React from 'react';
import { Metadata } from 'next';
import CultureContent from '@/components/tuyendung/CultureContent';
import { SchemaScript } from '@/components/seo/schema-script';
import { generateBreadcrumbItems } from '@/utils/seo/generate-breadcrumb';
import { headers } from 'next/headers';

export const metadata: Metadata = {
    title: 'Văn hóa Edurise Global | Kiến tạo tương lai giáo dục số',
    description: 'Tìm hiểu về 5 giá trị cốt lõi, sứ mệnh và nhịp sống tại Edurise Global. Nơi mỗi giáo viên là một người truyền lửa.',
};

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