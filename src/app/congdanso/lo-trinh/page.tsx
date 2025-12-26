'use client';

import React from 'react';
import {
    Shield,
    MessageCircle,
    Brain,
    Heart,
    CheckCircle2,
    Globe,
    GraduationCap
} from 'lucide-react';
import Link from 'next/link';

const DigitalCitizenshipRoadmap = () => {
    // Dữ liệu lộ trình - Đã thêm thuộc tính 'position' để xếp bố cục
    const roadmapSteps = [
        {
            id: 1,
            tag: "Giai đoạn 1: Phòng Vệ",
            title: "An Toàn & Bảo Mật Số",
            description: "Xây dựng 'lá chắn' đầu tiên. Học viên nhận thức được các rủi ro và biết cách tự bảo vệ mình cũng như dữ liệu cá nhân.",
            type: 'foundation',
            position: 'left',
            mainColor: "#0284c7", // Sky-700
            icon: <Shield size={28} className="text-white" />,
            modules: [
                "Quản lý dấu chân số (Digital Footprint)",
                "Bảo mật tài khoản: Mật khẩu mạnh & 2FA",
                "Nhận diện lừa đảo (Phishing) & Malware",
            ]
        },
        {
            id: 2,
            tag: "Giai đoạn 2: Kết Nối",
            title: "Văn Hóa & Giao Tiếp Số",
            description: "Học cách tương tác văn minh. Xây dựng hình ảnh cá nhân tích cực, tôn trọng sự khác biệt và thấu cảm.",
            type: 'skill',
            position: 'right',
            mainColor: "#7c3aed", // Violet-700
            icon: <MessageCircle size={28} className="text-white" />,
            modules: [
                "Quy tắc ứng xử văn minh (Netiquette)",
                "Phòng chống bắt nạt mạng (Cyberbullying)",
                "Giao tiếp chuyên nghiệp qua Email & MXH",
            ]
        },
        {
            id: 3,
            tag: "Giai đoạn 3: Tư Duy",
            title: "Năng Lực Thông Tin & Phản Biện",
            description: "Phát triển tư duy sắc bén để tìm kiếm, đánh giá và sử dụng thông tin một cách thông minh, có chọn lọc.",
            type: 'skill',
            position: 'left',
            mainColor: "#d97706", // Amber-600
            icon: <Brain size={28} className="text-white" />,
            modules: [
                "Phân biệt Tin thật - Tin giả (Fake News)",
                "Tra cứu & Đánh giá nguồn tin cậy",
                "Bản quyền số & Đạo văn",
            ]
        },
        {
            id: 4,
            tag: "Giai đoạn 4: Cống Hiến",
            title: "Trách Nhiệm & Sống Cân Bằng",
            description: "Trở thành công dân số toàn cầu có trách nhiệm, biết cân bằng giữa cuộc sống thực và ảo.",
            type: 'milestone',
            position: 'right',
            badge: "Đạt chuẩn Công Dân Số Toàn Cầu",
            mainColor: "#059669", // Emerald-600
            icon: <Heart size={28} className="text-white" />,
            modules: [
                "Sức khỏe số (Digital Wellbeing)",
                "Luật An ninh mạng & Trách nhiệm pháp lý",
                "Lan tỏa giá trị tích cực",
            ]
        }
    ];

    return (
        <>
            {/* === HEADER SECTION === */}
            <section className="bg-white pt-16 pb-8 text-center relative overflow-hidden">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 mb-4">
                        <Globe size={16} className="text-[var(--erg-blue)]" />
                        <span className="text-xs font-bold tracking-wide text-[var(--erg-blue)] uppercase">Hành trình trưởng thành</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4">
                        Lộ Trình <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">Công Dân Số</span>
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                        Từ nhận thức an toàn đến hành động trách nhiệm - 4 bước toàn diện để làm chủ cuộc sống trong kỷ nguyên số.
                    </p>
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

                    {/* TRỤC GIỮA */}
                    {/* top-0: Bắt đầu từ mép trên. bottom-60: Dừng lại sau node cuối cùng một chút */}
                    <div className="absolute left-4 md:left-1/2 top-0 bottom-16 md:bottom-60 w-6 bg-gray-200 transform md:-translate-x-1/2 rounded-full z-0">
                        <div className="h-full w-0 border-r-2 border-dashed border-white mx-auto opacity-70"></div>
                    </div>

                    {/* DANH SÁCH BƯỚC */}
                    <div className="flex flex-col">
                        {roadmapSteps.map((step, index) => {
                            const isLeft = step.position === 'left';
                            // Tạo màu nền nhạt cho badge
                            const badgeBgColor = `${step.mainColor}15`; // 15% opacity hex

                            return (
                                // Margin âm (-mt-32) để kéo sát lại
                                <div key={step.id} className={`flex flex-col md:flex-row w-full relative ${index !== 0 ? '-mt-10 md:-mt-32' : ''}`}>

                                    {/* --- CỘT TRÁI --- */}
                                    <div className={`w-full md:w-1/2 flex relative ${isLeft ? 'justify-end md:pr-16 pl-14 md:pl-0' : 'md:pr-16'}`}>
                                        {isLeft ? (
                                            <div className="w-full bg-white p-6 md:p-8 rounded-3xl shadow-lg relative group hover:-translate-y-1 transition-transform duration-300"
                                                 style={{ borderLeft: `6px solid ${step.mainColor}` }}>

                                                {/* Mũi tên */}
                                                <div className="hidden md:block absolute top-8 -right-[11px] w-6 h-6 bg-white transform rotate-45 border-t border-r border-gray-100 z-10"></div>

                                                {/* Tag */}
                                                <span className="inline-block px-3 py-1 text-[10px] md:text-xs font-bold rounded-md mb-3 uppercase tracking-wide"
                                                      style={{ backgroundColor: badgeBgColor, color: step.mainColor }}>
                                                    {step.tag}
                                                </span>

                                                <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">{step.title}</h3>

                                                {/* Badge Milestone */}
                                                {step.type === 'milestone' && (
                                                    <div className="flex items-center gap-2 mb-3 p-2 rounded-lg border bg-emerald-50 border-emerald-100">
                                                        <GraduationCap size={18} className="text-emerald-600" />
                                                        <span className="text-emerald-700 font-bold text-xs md:text-sm">{step.badge}</span>
                                                    </div>
                                                )}

                                                <p className="text-gray-600 mb-4 text-sm md:text-base leading-relaxed">{step.description}</p>

                                                {/* Modules List */}
                                                <div className="space-y-2 pt-3 border-t border-gray-100">
                                                    <ul className="space-y-1.5">
                                                        {step.modules.map((mod, idx) => (
                                                            <li key={idx} className="flex items-start gap-2 text-gray-700 font-medium text-xs md:text-sm">
                                                                <CheckCircle2 size={16} style={{ color: step.mainColor }} className="mt-0.5 flex-shrink-0" />
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

                                    {/* --- NÚT TRÒN CHỨA ICON --- */}
                                    <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 top-0 md:top-8 z-20 flex items-center justify-center">
                                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border-[4px] border-white shadow-xl flex items-center justify-center transition-transform group-hover:scale-110"
                                             style={{ backgroundColor: step.mainColor }}>
                                            {/* Render Icon */}
                                            {step.icon}
                                        </div>
                                    </div>

                                    {/* --- CỘT PHẢI --- */}
                                    <div className={`w-full md:w-1/2 flex relative ${!isLeft ? 'justify-start md:pl-16 pl-14' : 'md:pl-16'}`}>
                                        {!isLeft ? (
                                            <div className="w-full bg-white p-6 md:p-8 rounded-3xl shadow-lg relative group hover:-translate-y-1 transition-transform duration-300 mt-4 md:mt-0"
                                                 style={{ borderRight: `6px solid ${step.mainColor}`, borderLeft: 'none' }}> {/* Border Right cho cột phải */}

                                                <div className="hidden md:block absolute top-8 -left-[11px] w-6 h-6 bg-white transform -rotate-45 border-t border-l border-gray-100 z-10"></div>
                                                <div className="md:hidden absolute top-8 -left-[11px] w-6 h-6 bg-white transform -rotate-45 border-t border-l border-gray-100 z-10"></div>

                                                <span className="inline-block px-3 py-1 text-[10px] md:text-xs font-bold rounded-md mb-3 uppercase tracking-wide"
                                                      style={{ backgroundColor: badgeBgColor, color: step.mainColor }}>
                                                    {step.tag}
                                                </span>

                                                <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">{step.title}</h3>

                                                {step.type === 'milestone' && (
                                                    <div className="flex items-center gap-2 mb-3 p-2 rounded-lg border bg-emerald-50 border-emerald-100">
                                                        <GraduationCap size={18} className="text-emerald-600" />
                                                        <span className="text-emerald-700 font-bold text-xs md:text-sm">{step.badge}</span>
                                                    </div>
                                                )}

                                                <p className="text-gray-600 mb-4 text-sm md:text-base leading-relaxed">{step.description}</p>

                                                <div className="space-y-2 pt-3 border-t border-gray-100">
                                                    <ul className="space-y-1.5">
                                                        {step.modules.map((mod, idx) => (
                                                            <li key={idx} className="flex items-start gap-2 text-gray-700 font-medium text-xs md:text-sm">
                                                                <CheckCircle2 size={16} style={{ color: step.mainColor }} className="mt-0.5 flex-shrink-0" />
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
                    <p className="text-gray-600 mb-8 text-lg max-w-2xl mx-auto font-medium">
                        Đừng để lỡ "thời điểm vàng" để trang bị tư duy số. Đăng ký ngay để nhận tư vấn lộ trình phù hợp nhất.
                    </p>
                    <Link href="/lien-he" className="inline-block px-10 py-4 bg-[var(--erg-red)] text-white font-bold text-lg rounded-xl hover:bg-red-700 transition-all shadow-lg hover:shadow-red-200 transform hover:-translate-y-1 uppercase tracking-wider">
                        Đăng Ký Tư Vấn Ngay
                    </Link>
                </div>
            </section>
        </>
    );
};

export default DigitalCitizenshipRoadmap;