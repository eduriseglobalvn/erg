import React from 'react';
import { Metadata } from 'next';
import NewsList from '@/components/features/news/news-list';

export const metadata: Metadata = {
    title: "Tin tức & Hoạt động | Tin học Thiếu nhi - Lập trình Scratch/Python",
    description: "Tin tức, sự kiện và hình ảnh lớp học lập trình, robotics dành cho thiếu nhi tại ERG.",
    openGraph: {
        title: "Tin tức & Hoạt động | Tin học Thiếu nhi - Lập trình Scratch/Python",
        description: "Tin tức, sự kiện và hình ảnh lớp học lập trình, robotics dành cho thiếu nhi tại ERG.",
    }
};

export default function THTNNewsPage() {
    return (
        <div className="min-h-screen bg-white pb-20 font-sans">
            {/* Banner Header - Màu cam hoặc theo theme thiếu nhi nếu có */}
            <div className="bg-orange-500 py-16 text-center text-white">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl font-bold mb-4">Góc Sáng Tạo Thiếu Nhi</h1>
                    <p className="text-orange-100 max-w-2xl mx-auto">
                        Cập nhật hoạt động học tập vui nhộn và bổ ích của các bé
                    </p>
                </div>
            </div>

            <div id="news-container" className="container mx-auto px-4 md:px-8 py-10">
                <NewsList />
            </div>
        </div>
    );
}