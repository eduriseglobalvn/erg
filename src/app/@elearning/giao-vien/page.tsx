// src/app/@elearning/giao-vien/page.tsx
"use client";
import React from 'react';

export default function ElearningTeachersPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-12">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Đội ngũ giảng viên</h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Gặp gỡ những giảng viên tài năng và tận tâm của chúng tôi
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow duration-300">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center">
                        <span className="text-white text-3xl font-bold">NT</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-1">Nguyễn Thị A</h3>
                    <p className="text-blue-600 font-medium mb-2">Chuyên gia Lập trình</p>
                    <p className="text-gray-600 text-sm">10 năm kinh nghiệm trong giảng dạy lập trình và phát triển phần mềm</p>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow duration-300">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-400 to-teal-500 flex items-center justify-center">
                        <span className="text-white text-3xl font-bold">LV</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-1">Lê Văn B</h3>
                    <p className="text-blue-600 font-medium mb-2">Chuyên gia Thiết kế Web</p>
                    <p className="text-gray-600 text-sm">8 năm kinh nghiệm trong thiết kế giao diện và trải nghiệm người dùng</p>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow duration-300">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center">
                        <span className="text-white text-3xl font-bold">TH</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-1">Trần Hồng C</h3>
                    <p className="text-blue-600 font-medium mb-2">Chuyên gia AI</p>
                    <p className="text-gray-600 text-sm">7 năm kinh nghiệm trong nghiên cứu và giảng dạy trí tuệ nhân tạo</p>
                </div>
            </div>
        </div>
    );
}