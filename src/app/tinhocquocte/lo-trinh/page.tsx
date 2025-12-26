'use client';

import React from 'react';
import { Target, Flag, Trophy } from 'lucide-react';

export default function RoadmapPage() {
    const steps = [
        {
            id: 1,
            month: 'THÁNG 9 - 10',
            title: 'Khởi động năm học',
            desc: 'Bắt đầu giảng dạy nội dung chương trình HK1 theo khung chương trình chuẩn của bộ môn Tin học quốc tế.',
            position: 'left',
            color: 'red',
            badgeBg: 'bg-red-50',
            badgeText: 'text-red-600',
            borderColor: 'border-red-600',
            circleBg: 'bg-[#dc2626]',
        },
        {
            id: 2,
            month: 'THÁNG 11',
            title: 'Làm quen công cụ thi',
            desc: 'Học sinh làm quen, nắm rõ thao tác phần mềm giả lập thi Gmetrix để chuẩn bị tâm lý vững vàng.',
            position: 'right',
            color: 'orange',
            badgeBg: 'bg-orange-50',
            badgeText: 'text-orange-600',
            borderColor: 'border-orange-500',
            circleBg: 'bg-[#f97316]',
        },
        {
            id: 3,
            month: 'THÁNG 12',
            title: 'Đánh giá Lần 1',
            // Đã rút gọn nhẹ văn bản để cân đối chiều cao layout, tránh bị đẩy xuống quá xa
            desc: 'Ôn luyện đề chuẩn. Kiểm tra đánh giá năng lực, phân loại học sinh để có phương án bồi dưỡng phù hợp.',
            position: 'left',
            color: 'yellow',
            badgeBg: 'bg-yellow-50',
            badgeText: 'text-yellow-600',
            borderColor: 'border-yellow-400',
            circleBg: 'bg-[#eab308]',
        },
        {
            id: 4,
            month: 'THÁNG 1 - 2',
            title: 'Chương trình HK2',
            desc: 'Tiếp tục giảng dạy nội dung chương trình HK2 theo khung chương trình chuẩn của bộ môn Tin học quốc tế.',
            position: 'right',
            color: 'blue',
            badgeBg: 'bg-blue-50',
            badgeText: 'text-blue-600',
            borderColor: 'border-blue-500',
            circleBg: 'bg-[#3b82f6]',
        },
        {
            id: 5,
            month: 'ĐẦU THÁNG 3',
            title: 'Đánh giá Lần 2',
            desc: 'Tổng kiểm tra kiến thức toàn diện. Phân loại học sinh lần cuối trước khi bước vào giai đoạn luyện thi nước rút.',
            position: 'left',
            color: 'indigo',
            badgeBg: 'bg-indigo-50',
            badgeText: 'text-indigo-600',
            borderColor: 'border-indigo-600',
            circleBg: 'bg-[#4f46e5]',
        },
    ];

    return (
        <div className="min-h-screen bg-white font-sans text-gray-800">

            {/* HEADER */}
            <section className="bg-[var(--erg-blue)] text-white py-16 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-4">
                        <Target size={16} className="text-yellow-400" />
                        <span className="text-xs font-bold tracking-wide text-yellow-100 uppercase">Lộ trình chuẩn quốc tế</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold mb-4 uppercase tracking-tight">
                        Lộ Trình Đào Tạo
                    </h1>
                </div>
            </section>

            {/* --- TIMELINE SECTION --- */}
            <section className="py-12 relative bg-white overflow-hidden">

                {/* 1. NỀN GIẤY Ô LY */}
                <div className="absolute inset-0 pointer-events-none opacity-40"
                     style={{
                         backgroundImage: 'linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)',
                         backgroundSize: '32px 32px'
                     }}>
                </div>

                <div className="container mx-auto px-4 max-w-7xl relative z-10">

                    {/* 2. TRỤC GIỮA (TRACK) */}
                    <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-6 bg-gray-200 transform md:-translate-x-1/2 rounded-full z-0">
                        {/* Đường đứt nét trắng */}
                        <div className="h-full w-0 border-l-2 border-dashed border-white mx-auto opacity-70"></div>
                    </div>

                    {/* 3. DANH SÁCH BƯỚC */}
                    <div className="flex flex-col">

                        {steps.map((item, index) => (
                            // QUAN TRỌNG: Tăng -mt-24 (96px) để kéo các bước sát rạt vào nhau
                            <div key={item.id} className={`flex flex-col md:flex-row w-full relative ${index !== 0 ? '-mt-12 md:-mt-24' : ''}`}>

                                {/* --- CỘT TRÁI --- */}
                                <div className={`w-full md:w-1/2 flex relative ${item.position === 'left' ? 'justify-end md:pr-16 pl-14 md:pl-0' : 'md:pr-16'}`}>
                                    {item.position === 'left' ? (
                                        // Card To: p-10
                                        <div className={`w-full bg-white p-8 md:p-10 rounded-3xl shadow-lg relative group hover:-translate-y-1 transition-transform duration-300
                                            border-l-[8px] ${item.borderColor}`}>

                                            {/* Mũi tên */}
                                            <div className="hidden md:block absolute top-10 -right-[12px] w-6 h-6 bg-white transform rotate-45 border-t border-r border-gray-100 z-10"></div>

                                            <span className={`inline-block px-4 py-1.5 ${item.badgeBg} ${item.badgeText} text-sm font-bold rounded-lg mb-3 uppercase tracking-wide`}>
                                                {item.month}
                                            </span>
                                            {/* Chữ To: text-3xl */}
                                            <h3 className="text-2xl md:text-3xl font-bold text-[#1e3a8a] mb-2">{item.title}</h3>
                                            <p className="text-gray-600 leading-relaxed text-lg">{item.desc}</p>
                                        </div>
                                    ) : (
                                        // Spacer
                                        <div className="hidden md:block w-full"></div>
                                    )}
                                </div>

                                {/* --- SỐ TRÒN --- */}
                                {/* top-10: Căn chỉnh ngang hàng với phần text đầu tiên của thẻ */}
                                <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 top-0 md:top-10 z-20 flex items-center justify-center">
                                    <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full ${item.circleBg} border-[4px] border-white shadow-xl flex items-center justify-center text-white font-bold text-xl md:text-2xl`}>
                                        {item.id}
                                    </div>
                                </div>

                                {/* --- CỘT PHẢI --- */}
                                <div className={`w-full md:w-1/2 flex relative ${item.position === 'right' ? 'justify-start md:pl-16 pl-14' : 'md:pl-16'}`}>
                                    {item.position === 'right' ? (
                                        // Card To: p-10
                                        <div className={`w-full bg-white p-8 md:p-10 rounded-3xl shadow-lg relative group hover:-translate-y-1 transition-transform duration-300 mt-4 md:mt-0
                                            border-r-[8px] md:border-l-0 md:border-r-[8px] ${item.borderColor} border-l-[8px]`}>

                                            {/* Mũi tên */}
                                            <div className="hidden md:block absolute top-10 -left-[12px] w-6 h-6 bg-white transform -rotate-45 border-t border-l border-gray-100 z-10"></div>

                                            {/* Mũi tên Mobile */}
                                            <div className="md:hidden absolute top-10 -left-[12px] w-6 h-6 bg-white transform -rotate-45 border-t border-l border-gray-100 z-10"></div>

                                            <span className={`inline-block px-4 py-1.5 ${item.badgeBg} ${item.badgeText} text-sm font-bold rounded-lg mb-3 uppercase tracking-wide`}>
                                                {item.month}
                                            </span>
                                            <h3 className="text-2xl md:text-3xl font-bold text-[#1e3a8a] mb-2">{item.title}</h3>
                                            <p className="text-gray-600 leading-relaxed text-lg">{item.desc}</p>
                                        </div>
                                    ) : (
                                        // Spacer
                                        <div className="hidden md:block w-full"></div>
                                    )}
                                </div>

                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <section className="py-20 bg-gray-50 border-t border-gray-200">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 mb-3 border border-red-100">
                            <Flag size={16} className="text-red-600" />
                            <span className="text-xs font-bold text-red-600 uppercase tracking-wide">Giai đoạn nước rút</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold text-[#1e3a8a] uppercase">
                            Lộ Trình Về Đích
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative max-w-7xl mx-auto">
                        <div className="hidden xl:block absolute top-12 left-0 w-full h-1 bg-gray-200 -z-10 rounded-full"></div>

                        {[
                            {id: '01', month: 'Giữa Tháng 3', title: 'Phân Loại', color: 'red'},
                            {id: '02', month: 'Cuối Tháng 3', title: 'Tổng Ôn', color: 'orange'},
                            {id: '03', month: 'Tháng 4', title: 'Thi Thử', color: 'yellow'},
                        ].map((card) => (
                            <div key={card.id} className={`bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:border-${card.color}-300 transition-all flex flex-col items-center text-center`}>
                                <div className={`w-24 h-24 bg-${card.color}-50 rounded-full flex items-center justify-center mb-6 border-4 border-white shadow-sm`}>
                                    <span className={`text-4xl font-black text-${card.color}-500`}>{card.id}</span>
                                </div>
                                <h4 className="text-sm font-bold text-gray-400 uppercase mb-2">{card.month}</h4>
                                <h3 className="text-2xl font-bold text-[#1e3a8a]">{card.title}</h3>
                            </div>
                        ))}

                        {/* Card Cuối */}
                        <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 rounded-3xl shadow-xl transform scale-105 flex flex-col items-center text-center border-none">
                            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-6 border-4 border-white/10 shadow-sm backdrop-blur-sm">
                                <Trophy size={48} className="text-yellow-300" fill="currentColor"/>
                            </div>
                            <h4 className="text-sm font-bold text-blue-200 uppercase mb-2">Tháng 5</h4>
                            <h3 className="text-2xl font-bold text-white">THI CHỨNG CHỈ</h3>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}