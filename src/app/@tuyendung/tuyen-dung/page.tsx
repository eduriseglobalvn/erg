import React from 'react';
import { Metadata } from 'next';
import JobFilter from '@/components/features/recruitment/job-filter';
import { generateFullMetadata } from '@/utils/seo/seo-metadata';
import { headers } from 'next/headers';

export async function generateMetadata(): Promise<Metadata> {
    const headerList = await headers();
    const host = headerList.get('host') || 'tuyendung.erg.edu.vn';

    return generateFullMetadata({
        title: "Tuyển dụng Giáo viên Tin học & IT | ERG Careers",
        description: "Cập nhật các cơ hội nghề nghiệp hấp dẫn tại Edurise Global: Giáo viên Tin học, Lập trình viên, Nhân viên kinh doanh...",
        path: '/tuyen-dung',
        host,
    });
}

export default function AllJobsPage() {
    return (
        <main className="min-h-screen bg-gray-50 font-sans text-slate-800">
            <JobFilter />
        </main>
    );
}