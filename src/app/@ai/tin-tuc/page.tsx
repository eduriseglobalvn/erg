import React from 'react';
import { Metadata } from 'next';
import NewsPageClient from './NewsPageClient';

export const revalidate = 300; // ISR: revalidate mỗi 5 phút

export const metadata: Metadata = {
    title: 'Tin Tức & Sự Kiện AI | ERG',
    description: 'Cập nhật tin tức mới nhất về AI trong giáo dục, công nghệ và các sự kiện từ ERG Edurise Global.',
    keywords: 'tin tức AI giáo dục, ERG tin tức, trí tuệ nhân tạo giáo dục, công nghệ học tập',
    openGraph: {
        title: 'Tin Tức & Sự Kiện AI | ERG',
        description: 'Cập nhật tin tức mới nhất về AI trong giáo dục từ ERG.',
    },
};

export default function AiNewsPage() {
    return <NewsPageClient />;
}