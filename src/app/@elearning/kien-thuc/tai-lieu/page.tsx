// src/app/@elearning/kien-thuc/tai-lieu/page.tsx
"use client";
import React from 'react';

export default function ElearningDocumentsPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-12">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Tài liệu học tập</h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Tải về miễn phí các tài liệu học tập chất lượng cao
                </p>
            </div>

            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-xl shadow-md p-6 mb-4 hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-center">
                        <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-800">Tài liệu HTML & CSS cơ bản</h3>
                            <p className="text-gray-600 text-sm">Tài liệu hướng dẫn cơ bản về HTML và CSS cho người mới bắt đầu</p>
                        </div>
                        <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-sm transition-colors duration-300">
                            Tải về
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 mb-4 hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-center">
                        <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-800">Hướng dẫn JavaScript căn bản</h3>
                            <p className="text-gray-600 text-sm">Tài liệu học JavaScript từ cơ bản đến nâng cao</p>
                        </div>
                        <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-sm transition-colors duration-300">
                            Tải về
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-center">
                        <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-800">Tài liệu React cho người mới</h3>
                            <p className="text-gray-600 text-sm">Tài liệu hướng dẫn sử dụng React.js hiệu quả</p>
                        </div>
                        <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-sm transition-colors duration-300">
                            Tải về
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}