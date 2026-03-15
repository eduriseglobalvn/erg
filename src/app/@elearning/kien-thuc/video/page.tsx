// src/app/@elearning/kien-thuc/video/page.tsx
"use client";
import React from 'react';

export default function ElearningVideoPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-12">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Video hướng dẫn</h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Học tập qua các video dễ hiểu và trực quan
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="relative">
                        <div className="h-48 bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-white bg-opacity-80 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">HTML & CSS cơ bản</h3>
                        <p className="text-gray-600 text-sm mb-3">Khóa học cơ bản về HTML và CSS cho người mới bắt đầu</p>
                        <div className="flex justify-between items-center text-sm text-gray-500">
                            <span>45 phút</span>
                            <span>10 bài học</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="relative">
                        <div className="h-48 bg-gradient-to-r from-green-400 to-teal-500 flex items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-white bg-opacity-80 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-600" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">JavaScript từ A đến Z</h3>
                        <p className="text-gray-600 text-sm mb-3">Khóa học JavaScript đầy đủ từ cơ bản đến nâng cao</p>
                        <div className="flex justify-between items-center text-sm text-gray-500">
                            <span>2 giờ 30 phút</span>
                            <span>20 bài học</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="relative">
                        <div className="h-48 bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-white bg-opacity-80 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-pink-600" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">React cơ bản</h3>
                        <p className="text-gray-600 text-sm mb-3">Học React từ những khái niệm cơ bản nhất</p>
                        <div className="flex justify-between items-center text-sm text-gray-500">
                            <span>1 giờ 45 phút</span>
                            <span>15 bài học</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}