// src/app/@elearning/kien-thuc/blog/page.tsx
"use client";
import React from 'react';

export default function ElearningBlogPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-12">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Blog học tập</h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Cập nhật các bài viết chia sẻ kinh nghiệm và kiến thức học tập
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="h-40 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
                    <div className="p-6">
                        <span className="text-sm text-blue-600 font-medium">Lập trình</span>
                        <h3 className="text-xl font-semibold text-gray-800 my-2">Làm thế nào để bắt đầu học lập trình hiệu quả</h3>
                        <p className="text-gray-600 mb-4">Một số lời khuyên thực tế giúp bạn học lập trình nhanh hơn và hiệu quả hơn...</p>
                        <div className="flex justify-between items-center text-sm text-gray-500">
                            <span>15/03/2026</span>
                            <span>5 phút đọc</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="h-40 bg-gradient-to-r from-green-400 to-teal-500"></div>
                    <div className="p-6">
                        <span className="text-sm text-blue-600 font-medium">Thiết kế</span>
                        <h3 className="text-xl font-semibold text-gray-800 my-2">10 nguyên tắc thiết kế giao diện người dùng</h3>
                        <p className="text-gray-600 mb-4">Những nguyên tắc cơ bản giúp bạn tạo ra giao diện thân thiện và dễ sử dụng...</p>
                        <div className="flex justify-between items-center text-sm text-gray-500">
                            <span>14/03/2026</span>
                            <span>7 phút đọc</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="h-40 bg-gradient-to-r from-purple-400 to-pink-500"></div>
                    <div className="p-6">
                        <span className="text-sm text-blue-600 font-medium">AI</span>
                        <h3 className="text-xl font-semibold text-gray-800 my-2">Tương lai của trí tuệ nhân tạo trong giáo dục</h3>
                        <p className="text-gray-600 mb-4">Khám phá cách AI đang thay đổi nền giáo dục và học tập trực tuyến...</p>
                        <div className="flex justify-between items-center text-sm text-gray-500">
                            <span>13/03/2026</span>
                            <span>6 phút đọc</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}