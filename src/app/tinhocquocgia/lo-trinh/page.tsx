'use client';

import React from 'react';
import { BookOpen, CheckCircle2, GraduationCap } from 'lucide-react';
import Link from 'next/link';

const RoadmapSection = () => {
    const roadmapSteps = [
        {
            id: 1,
            tag: "Giai đoạn Khởi động",
            title: "Xây Dựng Nền Tảng Số",
            description: "Làm quen với môi trường máy tính, hệ điều hành Windows và internet an toàn.",
            type: 'learning',
            position: 'left',
            color: 'blue',
            borderColor: 'border-blue-500',
            badgeBg: 'bg-blue-50',
            badgeText: 'text-blue-600',
            circleBg: 'bg-blue-600',
            modules: [
                "IU01, IU02, IU06: Hiểu biết CNTT & Windows Explorer",
                "Thao tác quản lý tệp tin, thư mục và tìm kiếm tập tin",
                "Sử dụng các phần mềm tiện ích cơ bản trên Windows",
            ]
        },
        {
            id: 2,
            tag: "Cột Mốc Quan Trọng 1",
            title: "Chinh Phục Chứng Chỉ Cơ Bản",
            description: "Thành thạo bộ 3 ứng dụng văn phòng cốt lõi. Đủ điều kiện chuẩn đầu ra tốt nghiệp.",
            type: 'milestone',
            position: 'right',
            badge: "Nhận Chứng chỉ Ứng dụng CNTT Cơ bản",
            color: 'red',
            borderColor: 'border-[var(--erg-red)]',
            badgeBg: 'bg-red-50',
            badgeText: 'text-[var(--erg-red)]',
            circleBg: 'bg-[var(--erg-red)]',
            modules: [
                "IU03: Soạn thảo văn bản MS Word cơ bản",
                "IU04: Sử dụng bảng tính MS Excel cơ bản",
                "IU05: Thiết kế trình chiếu MS Powerpoint cơ bản",
            ]
        },
        {
            id: 3,
            tag: "Giai đoạn Tăng tốc",
            title: "Nâng Cao Kỹ Năng Chuyên Sâu",
            description: "Đi sâu vào các tính năng phức tạp để xử lý dữ liệu lớn và tự động hóa công việc văn phòng.",
            type: 'learning',
            position: 'left',
            color: 'indigo',
            borderColor: 'border-indigo-500',
            badgeBg: 'bg-indigo-50',
            badgeText: 'text-indigo-600',
            circleBg: 'bg-indigo-600',
            modules: [
                "IU07: Word nâng cao (Trộn thư, Mục lục tự động)",
                "IU08: Excel nâng cao (PivotTable, VLOOKUP, Hàm mảng)",
                "IU09: PowerPoint nâng cao (Slide Master, hiệu ứng nâng cao)",
            ]
        },
        {
            id: 4,
            tag: "Cột Mốc Quan Trọng 2",
            title: "Về Đích & Nhận Bằng Nâng Cao",
            description: "Tổng ôn tập, luyện đề sát hạch và tham gia kỳ thi cuối cùng để khẳng định năng lực.",
            type: 'milestone',
            position: 'right',
            badge: "Nhận Chứng chỉ Ứng dụng CNTT Nâng cao",
            color: 'orange',
            borderColor: 'border-orange-500',
            badgeBg: 'bg-orange-50',
            badgeText: 'text-orange-600',
            circleBg: 'bg-orange-500',
            modules: [
                "Ôn tập bộ đề luyện thi sát hạch thực tế",
                "Thi trắc nghiệm lý thuyết và thực hành trên máy",
                "Nhận phôi bằng chuẩn từ Bộ Giáo dục & Đào tạo",
            ]
        }
    ];

    return (
        <>
            {/* === HEADER SECTION === */}
            <section className="bg-white pt-16 pb-8 text-center relative overflow-hidden">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 mb-4">
                        <BookOpen size={16} className="text-[var(--erg-blue)]" />
                        <span className="text-xs font-bold tracking-wide text-[var(--erg-blue)] uppercase">Lộ trình chuẩn hóa</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4">
                        Lộ Trình <span className="text-[var(--erg-blue)]">Học Tập Chi Tiết</span>
                    </h2>
                </div>
            </section>

            {/* === MAIN TIMELINE SECTION === */}
            <section className="py-8 relative bg-white overflow-hidden">

                {/* NỀN GIẤY Ô LY */}
                <div className="absolute inset-0 pointer-events-none opacity-40"
                     style={{
                         backgroundImage: 'linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)',
                         backgroundSize: '32px 32px'
                     }}>
                </div>

                <div className="container mx-auto px-4 max-w-7xl relative z-10">

                    {/* --- TRỤC GIỮA (Đã chỉnh sửa để nhú ra 2 đầu) --- */}
                    {/* top-0: Bắt đầu từ mép trên cùng (cao hơn số 1 khoảng 32px vì số 1 ở top-8).
                        bottom-16 md:bottom-60: Kéo dài xuống dưới, vượt qua tâm số 4 một đoạn.
                    */}
                    <div className="absolute left-4 md:left-1/2 top-0 bottom-16 md:bottom-60 w-6 bg-gray-200 transform md:-translate-x-1/2 rounded-full z-0">
                        <div className="h-full w-0 border-r-2 border-dashed border-white mx-auto opacity-70"></div>
                    </div>

                    {/* DANH SÁCH BƯỚC */}
                    <div className="flex flex-col">
                        {roadmapSteps.map((step, index) => {
                            const isLeft = step.position === 'left';

                            return (
                                // Margin âm (-mt) để kéo sát lại
                                <div key={step.id} className={`flex flex-col md:flex-row w-full relative ${index !== 0 ? '-mt-10 md:-mt-32' : ''}`}>

                                    {/* --- CỘT TRÁI --- */}
                                    <div className={`w-full md:w-1/2 flex relative ${isLeft ? 'justify-end md:pr-16 pl-14 md:pl-0' : 'md:pr-16'}`}>
                                        {isLeft ? (
                                            <div className={`w-full bg-white p-6 md:p-8 rounded-3xl shadow-lg relative group hover:-translate-y-1 transition-transform duration-300
                                                border-l-[6px] ${step.borderColor}`}>

                                                <div className="hidden md:block absolute top-8 -right-[11px] w-6 h-6 bg-white transform rotate-45 border-t border-r border-gray-100 z-10"></div>

                                                <span className={`inline-block px-3 py-1 ${step.badgeBg} ${step.badgeText} text-[10px] md:text-xs font-bold rounded-md mb-3 uppercase tracking-wide`}>
                                                    {step.tag}
                                                </span>

                                                <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">{step.title}</h3>

                                                {step.type === 'milestone' && (
                                                    <div className="flex items-center gap-2 mb-3 p-2 bg-red-50 rounded-lg border border-red-100">
                                                        <GraduationCap size={18} className="text-[var(--erg-red)]" />
                                                        <span className="text-[var(--erg-red)] font-bold text-xs md:text-sm">{step.badge}</span>
                                                    </div>
                                                )}

                                                <p className="text-gray-600 mb-4 text-sm md:text-base leading-relaxed">{step.description}</p>

                                                <div className="space-y-2 pt-3 border-t border-gray-100">
                                                    <ul className="space-y-1.5">
                                                        {step.modules.map((mod, idx) => (
                                                            <li key={idx} className="flex items-start gap-2 text-gray-700 font-medium text-xs md:text-sm">
                                                                <CheckCircle2 size={16} className={`mt-0.5 flex-shrink-0 ${step.type === 'milestone' ? 'text-red-500' : 'text-blue-500'}`} />
                                                                <span>{mod}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="hidden md:block w-full"></div>
                                        )}
                                    </div>

                                    {/* --- SỐ TRÒN --- */}
                                    {/* top-8: Để số ngang hàng với phần đầu thẻ */}
                                    <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 top-0 md:top-8 z-20 flex items-center justify-center">
                                        <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full ${step.circleBg} border-[4px] border-white shadow-xl flex items-center justify-center text-white font-bold text-xl`}>
                                            {step.id}
                                        </div>
                                    </div>

                                    {/* --- CỘT PHẢI --- */}
                                    <div className={`w-full md:w-1/2 flex relative ${!isLeft ? 'justify-start md:pl-16 pl-14' : 'md:pl-16'}`}>
                                        {!isLeft ? (
                                            <div className={`w-full bg-white p-6 md:p-8 rounded-3xl shadow-lg relative group hover:-translate-y-1 transition-transform duration-300 mt-4 md:mt-0
                                                border-r-[6px] md:border-l-0 md:border-r-[6px] ${step.borderColor} border-l-[6px]`}>

                                                <div className="hidden md:block absolute top-8 -left-[11px] w-6 h-6 bg-white transform -rotate-45 border-t border-l border-gray-100 z-10"></div>
                                                <div className="md:hidden absolute top-8 -left-[11px] w-6 h-6 bg-white transform -rotate-45 border-t border-l border-gray-100 z-10"></div>

                                                <span className={`inline-block px-3 py-1 ${step.badgeBg} ${step.badgeText} text-[10px] md:text-xs font-bold rounded-md mb-3 uppercase tracking-wide`}>
                                                    {step.tag}
                                                </span>

                                                <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">{step.title}</h3>

                                                {step.type === 'milestone' && (
                                                    <div className="flex items-center gap-2 mb-3 p-2 bg-red-50 rounded-lg border border-red-100">
                                                        <GraduationCap size={18} className="text-[var(--erg-red)]" />
                                                        <span className="text-[var(--erg-red)] font-bold text-xs md:text-sm">{step.badge}</span>
                                                    </div>
                                                )}

                                                <p className="text-gray-600 mb-4 text-sm md:text-base leading-relaxed">{step.description}</p>

                                                <div className="space-y-2 pt-3 border-t border-gray-100">
                                                    <ul className="space-y-1.5">
                                                        {step.modules.map((mod, idx) => (
                                                            <li key={idx} className="flex items-start gap-2 text-gray-700 font-medium text-xs md:text-sm">
                                                                <CheckCircle2 size={16} className={`mt-0.5 flex-shrink-0 ${step.type === 'milestone' ? 'text-red-500' : 'text-blue-500'}`} />
                                                                <span>{mod}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="hidden md:block w-full"></div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* === FOOTER CTA === */}
            <section className="py-16 bg-gray-50 border-t border-gray-200">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold text-[var(--erg-blue)] mb-6">
                        Bạn Đã Sẵn Sàng?
                    </h2>
                    <p className="text-gray-600 mb-8 text-lg max-w-3xl mx-auto">
                        Đừng để lỡ "thời điểm vàng". Đăng ký ngay để nhận lộ trình chi tiết cho con em mình.
                    </p>
                    <Link href="/lien-he" className="inline-block px-10 py-4 bg-[var(--erg-red)] text-white font-bold text-lg rounded-xl hover:bg-red-700 transition-all shadow-lg hover:shadow-red-200 transform hover:-translate-y-1 uppercase">
                        Đăng Ký Tư Vấn Ngay
                    </Link>
                </div>
            </section>
        </>
    );
};

export default RoadmapSection;