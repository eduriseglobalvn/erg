'use client';

import React from 'react';
import { BookOpen, CheckCircle2, GraduationCap } from 'lucide-react';
import Link from 'next/link';

const RoadmapSection = () => {
    // Dữ liệu lộ trình dựa trên chuẩn 9 mô-đun kỹ năng của Bộ Thông tin & Truyền thông
    const roadmapSteps = [
        {
            id: 1,
            tag: "Giai đoạn Khởi động",
            title: "Xây Dựng Nền Tảng Số",
            description: "Làm quen với môi trường máy tính, hệ điều hành Windows và internet an toàn. Bước đệm bắt buộc trước khi vào nghiệp vụ.",
            type: 'learning',
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
            description: "Thành thạo bộ 3 ứng dụng văn phòng cốt lõi. Đủ điều kiện chuẩn đầu ra tốt nghiệp và thi công chức.",
            type: 'milestone',
            badge: "Nhận Chứng chỉ Ứng dụng CNTT Cơ bản",
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
            description: "Tổng ôn tập, luyện đề sát hạch và tham gia kỳ thi cuối cùng để khẳng định năng lực chuyên gia.",
            type: 'milestone',
            badge: "Nhận Chứng chỉ Ứng dụng CNTT Nâng cao",
            modules: [
                "Ôn tập bộ đề luyện thi sát hạch thực tế",
                "Thi trắc nghiệm lý thuyết và thực hành trên máy",
                "Nhận phôi bằng chuẩn từ Bộ Giáo dục & Đào tạo",
            ]
        }
    ];

    return (
        <>
            {/* === PHẦN 1: LỘ TRÌNH ĐƯỜNG ĐI TRÊN NỀN Ô VUÔNG MỜ === */}
            <section className="py-20 relative overflow-hidden bg-white"
                     style={{
                         backgroundColor: '#ffffff',
                         backgroundImage: `
                        linear-gradient(to right, rgba(229, 231, 235, 0.4) 1.5px, transparent 1.5px),
                        linear-gradient(to bottom, rgba(229, 231, 235, 0.4) 1.5px, transparent 1.5px)
                    `,
                         backgroundSize: '80px 80px' // Ô vuông to 80px như yêu cầu
                     }}
            >
                <div className="container mx-auto px-4 relative z-10">

                    {/* Header Section - Đã cập nhật theo yêu cầu */}
                    <div className="text-center mb-16">
                        <div className="flex items-center justify-center gap-2 text-[var(--erg-red)] font-bold mb-3 uppercase tracking-wider text-sm">
                            <BookOpen size={18} />
                            <span>Lộ Trình Chuẩn Hóa</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4">
                            <span className="text-[var(--erg-blue)]">Lộ Trình Học Tập Chi Tiết</span>
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto text-lg bg-white/80 backdrop-blur-sm inline-block p-2 rounded">
                            Đi từ con số 0 đến thành thạo qua 4 giai đoạn được thiết kế khoa học, bám sát 9 mô-đun kỹ năng của Bộ Thông tin & Truyền thông.
                        </p>
                    </div>

                    <div className="relative max-w-6xl mx-auto">

                        {/* Đường lộ chính (The Road) */}
                        <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-8 bg-gray-200 shadow-inner z-0 rounded-full">
                            <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-0.5 border-l-2 border-dashed border-white opacity-60"></div>
                        </div>

                        <div className="space-y-24 relative pt-8 pb-8">
                            {roadmapSteps.map((step, index) => {
                                const isEven = index % 2 !== 0;
                                const isMilestone = step.type === 'milestone';
                                const mainColor = isMilestone ? 'var(--erg-red)' : 'var(--erg-blue)';
                                const tagBg = isMilestone ? 'bg-red-50 text-[var(--erg-red)]' : 'bg-blue-50 text-[var(--erg-blue)]';

                                return (
                                    <div key={step.id} className={`flex flex-col md:flex-row ${isEven ? 'md:flex-row-reverse' : ''} items-center md:gap-20 relative`}>

                                        {/* Nút tròn số thứ tự trên đường lộ */}
                                        <div
                                            className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center justify-center w-16 h-16 rounded-full border-[6px] bg-white z-20 shadow-xl"
                                            style={{ borderColor: mainColor, color: mainColor }}
                                        >
                                            <span className="text-2xl font-extrabold">{step.id}</span>
                                        </div>

                                        {/* Mobile Node */}
                                        <div className="md:hidden flex items-center gap-4 mb-6 self-start">
                                            <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 bg-white z-20"
                                                 style={{ borderColor: mainColor, color: mainColor }}>
                                                <span className="text-lg font-extrabold">{step.id}</span>
                                            </div>
                                            <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${tagBg}`}>
                                                {step.tag}
                                            </div>
                                        </div>

                                        <div className="hidden md:block w-1/2" />

                                        {/* Thẻ nội dung Giai đoạn */}
                                        <div className="w-full md:w-[45%] bg-white rounded-lg shadow-xl p-8 relative border-t-8 transition-all hover:shadow-2xl hover:-translate-y-1"
                                             style={{ borderTopColor: mainColor }}>

                                            <div className={`hidden md:inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 ${tagBg}`}>
                                                {step.tag}
                                            </div>

                                            <h3 className="text-2xl font-bold text-gray-800 mb-3">{step.title}</h3>

                                            {isMilestone && (
                                                <div className="flex items-center gap-2 mb-4 p-3 bg-red-50 rounded-lg border border-red-100">
                                                    <GraduationCap size={24} className="text-[var(--erg-red)]" />
                                                    <span className="text-[var(--erg-red)] font-bold text-sm">{step.badge}</span>
                                                </div>
                                            )}

                                            <p className="text-gray-600 mb-6 leading-relaxed">{step.description}</p>

                                            <div className="space-y-3 pt-4 border-t border-gray-100">
                                                <h4 className="font-bold text-gray-700 text-sm uppercase mb-3">Nội dung đào tạo:</h4>
                                                <ul className="space-y-2">
                                                    {step.modules.map((mod, idx) => (
                                                        <li key={idx} className="flex items-start gap-2 text-gray-700 font-medium">
                                                            <CheckCircle2 size={18} style={{ color: mainColor }} className="mt-1 flex-shrink-0" />
                                                            <span>{mod}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* === PHẦN 2: FOOTER CTA - Đã bổ sung đầy đủ === */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold text-[var(--erg-blue)] mb-6">
                        Bạn Đã Sẵn Sàng?
                    </h2>
                    <p className="text-gray-600 mb-10 text-lg max-w-3xl mx-auto">
                        Đừng để lỡ "thời điểm vàng". Đăng ký ngay để nhận lộ trình chi tiết cho con em mình.
                    </p>
                    <Link href="/lien-he" className="inline-block px-12 py-4 bg-[var(--erg-red)] text-white font-bold text-lg rounded-lg hover:bg-red-700 transition-all shadow-lg transform hover:-translate-y-1 uppercase">
                        Đăng Ký Tư Vấn Ngay
                    </Link>
                </div>
            </section>
        </>
    );
};

export default RoadmapSection;