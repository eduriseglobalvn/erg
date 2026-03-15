// src/app/@elearning/khoa-hoc/page.tsx
"use client";
import React from 'react';

export default function ElearningCoursesPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-12">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Các khóa học E-Learning</h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Khám phá hàng trăm khóa học chất lượng từ cơ bản đến nâng cao
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="h-48 bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center">
                        <div className="text-white text-4xl font-bold">LTP</div>
                    </div>
                    <div className="p-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Lập trình cho người mới bắt đầu</h3>
                        <p className="text-gray-600 mb-4">Khóa học hướng dẫn từ những khái niệm cơ bản nhất của lập trình</p>
                        <div className="flex justify-between items-center">
                            <span className="text-blue-600 font-semibold">Miễn phí</span>
                            <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors duration-300">
                                Học ngay
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="h-48 bg-gradient-to-r from-green-400 to-teal-500 flex items-center justify-center">
                        <div className="text-white text-4xl font-bold">TW</div>
                    </div>
                    <div className="p-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Thiết kế web hiện đại</h3>
                        <p className="text-gray-600 mb-4">Tạo website chuyên nghiệp với HTML, CSS và JavaScript</p>
                        <div className="flex justify-between items-center">
                            <span className="text-blue-600 font-semibold">Miễn phí</span>
                            <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors duration-300">
                                Học ngay
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="h-48 bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center">
                        <div className="text-white text-4xl font-bold">AI</div>
                    </div>
                    <div className="p-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Trí tuệ nhân tạo căn bản</h3>
                        <p className="text-gray-600 mb-4">Hiểu về AI và cách ứng dụng trong cuộc sống thực tế</p>
                        <div className="flex justify-between items-center">
                            <span className="text-blue-600 font-semibold">Miễn phí</span>
                            <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors duration-300">
                                Học ngay
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}