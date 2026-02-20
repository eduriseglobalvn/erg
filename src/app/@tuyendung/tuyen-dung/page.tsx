import React from 'react';
import { Metadata } from 'next';
import JobFilter from '@/components/features/recruitment/job-filter';

export const metadata: Metadata = {
    title: "Tuyển dụng Giáo viên Tin học & IT | ERG Careers",
    description: "Cập nhật các cơ hội nghề nghiệp hấp dẫn tại Edurise Global: Giáo viên Tin học, Lập trình viên, Nhân viên kinh doanh...",
    openGraph: {
        title: "Tuyển dụng Giáo viên Tin học & IT | ERG Careers",
        description: "Cập nhật các cơ hội nghề nghiệp hấp dẫn tại Edurise Global: Giáo viên Tin học, Lập trình viên, Nhân viên kinh doanh...",
    }
};

export default function AllJobsPage() {
    return (
        <main className="min-h-screen bg-gray-50 font-sans text-slate-800">
            <JobFilter />
        </main>
    );
}