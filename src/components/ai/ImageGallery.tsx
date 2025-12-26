'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Định nghĩa kiểu dữ liệu cho Props
interface ImageGalleryProps {
    images?: string[];      // Mảng đường dẫn ảnh
    autoPlayTime?: number;  // Thời gian tự chạy (ms)
    // Prop mới để chỉnh tỷ lệ/chiều cao. Mặc định là aspect-[4/3]
    aspectRatio?: string;
}

export default function ImageGallery({
                                         images = [],
                                         autoPlayTime = 5000,
                                         aspectRatio = 'aspect-[4/3]' // Giá trị mặc định
                                     }: ImageGalleryProps) {
    const [activeIndex, setActiveIndex] = useState<number>(0);

    // Logic tự động chuyển ảnh
    useEffect(() => {
        if (images.length <= 1) return;

        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
        }, autoPlayTime);

        return () => clearInterval(interval);
    }, [activeIndex, images.length, autoPlayTime]);

    // Xử lý sự kiện click thumbnail
    const handleThumbnailClick = (index: number) => {
        setActiveIndex(index);
    };

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const handlePrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    if (!images || images.length === 0) {
        return (
            <div className={`p-4 bg-gray-100 rounded text-center text-gray-500 text-sm w-full ${aspectRatio} flex items-center justify-center`}>
                Đang cập nhật hình ảnh...
            </div>
        );
    }

    return (
        <div className="space-y-3 w-full">
            {/* --- ẢNH CHÍNH --- */}
            {/* Sử dụng biến aspectRatio để set chiều cao */}
            <div className={`relative w-full ${aspectRatio} rounded-lg overflow-hidden group bg-gray-100 border border-gray-100 shadow-sm`}>
                <img
                    src={images[activeIndex]}
                    alt={`Slide ${activeIndex + 1}`}
                    // object-cover: Lấp đầy khung (có thể bị cắt ảnh nếu tỷ lệ không khớp)
                    // object-contain: Hiển thị toàn bộ ảnh (có thể có viền trống)
                    className="w-full h-full object-cover transition-all duration-700 ease-in-out"
                />

                {/* Nút điều hướng */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={handlePrev}
                            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 hover:scale-110 active:scale-95"
                        >
                            <ChevronLeft size={20} className="text-gray-800" />
                        </button>
                        <button
                            onClick={handleNext}
                            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 hover:scale-110 active:scale-95"
                        >
                            <ChevronRight size={20} className="text-gray-800" />
                        </button>
                    </>
                )}

                {/* Badge đếm số */}
                <div className="absolute bottom-3 right-3 bg-black/60 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md z-10">
                    {activeIndex + 1} / {images.length}
                </div>
            </div>

            {/* --- THUMBNAILS --- */}
            {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide pt-1">
                    {images.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleThumbnailClick(idx)}
                            className={`relative w-16 h-12 shrink-0 rounded-md overflow-hidden border-2 transition-all duration-300 ${
                                activeIndex === idx
                                    ? 'border-indigo-500 ring-2 ring-indigo-500/20 opacity-100 scale-105'
                                    : 'border-transparent opacity-60 hover:opacity-100 hover:border-gray-300'
                            }`}
                        >
                            <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}