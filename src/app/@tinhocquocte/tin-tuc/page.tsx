import React from 'react';
import { Metadata } from 'next';
import NewsList from '@/components/features/news/news-list';

export const revalidate = 300;

export const metadata: Metadata = {
    title: "Tin tức & Sự kiện | Tin học Quốc tế MOS - IC3",
    description: "Cập nhật tin tức mới nhất về các kỳ thi MOS, IC3 và xu hướng công nghệ giáo dục quốc tế từ ERG.",
    openGraph: {
        title: "Tin tức & Sự kiện | Tin học Quốc tế MOS - IC3",
        description: "Cập nhật tin tức mới nhất về các kỳ thi MOS, IC3 và xu hướng công nghệ giáo dục quốc tế từ ERG.",
    }
};

export default function NewsPage() {
    return (
        <div className="min-h-screen bg-white pb-20 font-sans">
            {/* Banner Header */}
            <div className="bg-[#00008b] py-16 text-center text-white">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl font-bold mb-4">Tin Tức & Sự Kiện</h1>
                    <p className="text-blue-100 max-w-2xl mx-auto">
                        Thông tin cập nhật mới nhất từ ERG và ngành giáo dục
                    </p>
                </div>
            </div>

            <div id="news-container" className="container mx-auto px-4 md:px-8 py-10">
                <NewsList />
            </div>
        </div>
    );
}