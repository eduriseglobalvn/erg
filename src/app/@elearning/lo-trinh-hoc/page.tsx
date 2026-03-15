// src/app/@elearning/lo-trinh-hoc/page.tsx
"use client";
import React from 'react';

export default function ElearningLearningPathPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-12">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Lộ trình học tập</h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Chọn lộ trình phù hợp để bắt đầu hành trình học tập của bạn
                </p>
            </div>

            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                    <div className="flex items-center mb-4">
                        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-4">1</div>
                        <h3 className="text-xl font-semibold text-gray-800">Người mới bắt đầu</h3>
                    </div>
                    <p className="text-gray-600 ml-14 mb-4">
                        Dành cho những người chưa có kiến thức nền tảng, bắt đầu từ những khái niệm cơ bản nhất.
                    </p>
                    <div className="ml-14 text-sm text-gray-500">
                        <p>• HTML & CSS cơ bản</p>
                        <p>• JavaScript cơ bản</p>
                        <p>• Làm quen với lập trình</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                    <div className="flex items-center mb-4">
                        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold mr-4">2</div>
                        <h3 className="text-xl font-semibold text-gray-800">Người học trung cấp</h3>
                    </div>
                    <p className="text-gray-600 ml-14 mb-4">
                        Dành cho những người đã có kiến thức cơ bản, muốn nâng cao kỹ năng.
                    </p>
                    <div className="ml-14 text-sm text-gray-500">
                        <p>• React & Node.js</p>
                        <p>• Cơ sở dữ liệu</p>
                        <p>• Kiến trúc ứng dụng</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center mb-4">
                        <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold mr-4">3</div>
                        <h3 className="text-xl font-semibold text-gray-800">Người học nâng cao</h3>
                    </div>
                    <p className="text-gray-600 ml-14 mb-4">
                        Dành cho những người muốn chuyên sâu vào các lĩnh vực chuyên môn.
                    </p>
                    <div className="ml-14 text-sm text-gray-500">
                        <p>• Machine Learning</p>
                        <p>• Cloud Computing</p>
                        <p>• DevOps</p>
                    </div>
                </div>
            </div>
        </div>
    );
}