'use client';

import React from 'react';
import {
    CheckCircle2,
    Clock,
    Users,
    FileText,
    ShieldCheck,
    Award,
    BookOpen,
    Trophy,
    Zap,
    Layers,
    BarChart3
} from 'lucide-react';
import Link from 'next/link';

export default function AdvancedITCoursePage() {
    // Nội dung chương trình học được trích xuất từ tài liệu nâng cao
    const curriculum = [
        {
            id: "IU07",
            title: "Xử lý văn bản với MS. Word nâng cao (Mô đun: IU07)",
            details: [
                "Định dạng ký tự, đoạn văn bản nâng cao (Drop Cap, chia cột phức tạp)",
                "Định dạng trang in, khung viền và tạo nền chuyên nghiệp",
                "Chèn và hiệu chỉnh đối tượng đồ họa, WordArt, Equation, SmartArt",
                "Kỹ năng trộn tài liệu (Mail Merge) nâng cao",
                "Tạo và hiệu chỉnh Style, mục lục tự động cho báo cáo dài",
                "Thiết lập Header/Footer theo chương bài, Watermark bảo mật",
                "Kỹ năng bảo mật tài liệu và in ấn chuyên sâu"
            ],
            icon: <FileText className="w-6 h-6 text-indigo-600" />
        },
        {
            id: "IU08",
            title: "Xử lý bảng tính với MS. Excel nâng cao (Mô đun: IU08)",
            details: [
                "Sử dụng thành thạo các nhóm hàm logic, chuỗi, ngày tháng chuyên sâu",
                "Nhóm hàm thống kê nâng cao: SUMPRODUCT, COUNTIFS, SUMIFS",
                "Nhóm hàm dò tìm nâng cao: INDEX, MATCH phối hợp",
                "Xử lý cơ sở dữ liệu: DSUM, DCOUNT, DMAX, DMIN",
                "Kỹ năng trích lọc dữ liệu phức tạp và sắp xếp đa điều kiện",
                "Phân tích dữ liệu với PivotTable & PivotChart",
                "Công thức mảng, Group & Subtotal và bảo mật bảng tính"
            ],
            icon: <BarChart3 className="w-6 h-6 text-indigo-600" />
        },
        {
            id: "IU09",
            title: "Sử dụng trình chiếu MS. Powerpoint nâng cao (Mô đun: IU09)",
            details: [
                "Thiết kế Slide Master để đồng bộ giao diện toàn bài",
                "Chèn và hiệu chỉnh video, phim, âm thanh vào trình chiếu",
                "Sử dụng hiệu ứng Trigger (cò điều khiển) cho trình diễn tương tác",
                "Kỹ năng thiết lập biểu đồ, sơ đồ nâng cao",
                "Kết hợp nhiều loại hiệu ứng áp dụng cho đối tượng và Slide",
                "Thiết lập liên kết (Hyperlink) và tạo tương tác giữa các slide",
                "Kỹ năng trình diễn, kiểm tra và xuất bản bài thuyết trình"
            ],
            icon: <Zap className="w-6 h-6 text-indigo-600" />
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* 1. HERO SECTION - Thông tin khóa học nâng cao */}
            <section className="bg-gradient-to-r from-indigo-900 to-indigo-700 text-white py-20 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px'}}></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl">
                        <span className="inline-block px-4 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                            Chứng chỉ Quốc gia Nâng cao
                        </span>
                        <h1 className="text-3xl md:text-5xl font-extrabold mb-6 uppercase leading-tight">
                            Kỹ Năng Sử Dụng Công Nghệ Thông Tin Nâng Cao
                        </h1>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm mb-8">
                            <div className="flex items-center gap-2">
                                <Clock className="text-yellow-400" size={20} />
                                <span>Thời lượng: 10 Buổi</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Users className="text-yellow-400" size={20} />
                                <span>Lịch học: Tối 2-4-6</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="text-yellow-400" size={20} />
                                <span>Chuẩn: Thông tư 03</span>
                            </div>
                            {/*<div className="flex items-center gap-2">*/}
                            {/*    <Trophy className="text-yellow-400" size={20} />*/}
                            {/*    <span>Học phí: 1,400,000 đ</span>*/}
                            {/*</div>*/}
                        </div>
                        <div className="flex flex-wrap gap-4">
                            <button className="px-8 py-3 bg-[#cc0022] rounded-lg font-bold hover:bg-red-700 transition-all shadow-lg">ĐĂNG KÝ NGAY</button>
                            <button className="px-8 py-3 bg-white text-indigo-900 rounded-lg font-bold hover:bg-gray-100 transition-all">XEM LỊCH THI</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. CHƯƠNG TRÌNH CHI TIẾT */}
            <section className="py-20 relative" style={{
                backgroundColor: '#ffffff',
                backgroundImage: 'linear-gradient(to right, rgba(229, 231, 235, 0.4) 1.5px, transparent 1.5px), linear-gradient(to bottom, rgba(229, 231, 235, 0.4) 1.5px, transparent 1.5px)',
                backgroundSize: '80px 80px'
            }}>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Nội dung chính */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                                <h2 className="text-2xl font-bold text-indigo-900 mb-8 flex items-center gap-3 uppercase">
                                    <Layers className="text-[#cc0022]" />
                                    Nội dung học phần nâng cao
                                </h2>

                                <div className="space-y-12">
                                    {curriculum.map((section) => (
                                        <div key={section.id} className="relative pl-8 border-l-2 border-indigo-100 group">
                                            <div className="absolute -left-[13px] top-0 w-6 h-6 rounded-full bg-white border-4 border-indigo-600 group-hover:bg-indigo-600 transition-all"></div>
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="p-3 bg-indigo-50 rounded-lg">
                                                    {section.icon}
                                                </div>
                                                <h3 className="text-xl font-bold text-gray-800 uppercase tracking-tight">{section.title}</h3>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                                                {section.details.map((item, idx) => (
                                                    <div key={idx} className="flex items-start gap-2 text-gray-600 text-[13px] leading-relaxed font-medium">
                                                        <CheckCircle2 size={16} className="text-indigo-500 mt-0.5 flex-shrink-0" />
                                                        <span>{item}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Thông tin bổ sung */}
                        <div className="space-y-8">
                            <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
                                <h4 className="font-bold text-gray-800 mb-4 border-b pb-2 uppercase text-sm">Đối tượng khóa học:</h4>
                                <ul className="space-y-4 text-sm text-gray-600 font-medium">
                                    <li className="flex gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#cc0022] mt-1.5 flex-shrink-0"></div>
                                        Học viên đã có chứng chỉ hoặc kiến thức CNTT Cơ bản (THCB).
                                    </li>
                                    <li className="flex gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#cc0022] mt-1.5 flex-shrink-0"></div>
                                        Cán bộ, sinh viên cần kỹ năng xử lý văn phòng chuyên nghiệp phục vụ công việc và học tập.
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-indigo-900 p-8 rounded-2xl shadow-xl text-white">
                                <h4 className="font-bold text-xl mb-4 italic">Ưu điểm khóa học</h4>
                                <div className="space-y-4 text-sm font-light">
                                    <p className="border-l-4 border-yellow-400 pl-4">Giáo trình thực tế bám sát nhu cầu văn phòng chuyên sâu.</p>
                                    <p className="border-l-4 border-yellow-400 pl-4">Thực hành 100% trên máy tính với phần mềm thi thử hiện đại.</p>
                                    <p className="border-l-4 border-yellow-400 pl-4">Cam kết thi đạt chứng chỉ Quốc gia phôi Bộ Giáo dục.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. FOOTER CTA */}
            <section className="py-20 bg-gray-50 border-t border-gray-100 text-center">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-indigo-950 mb-6 uppercase">
                        Nâng tầm kỹ năng số ngay
                    </h2>
                    <p className="text-gray-600 mb-10 text-lg max-w-2xl mx-auto font-medium">
                        Chứng chỉ CNTT Nâng cao là lợi thế lớn trong hồ sơ tuyển dụng và thăng tiến công việc.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link href="/lien-he" className="inline-block px-12 py-5 bg-[#cc0022] text-white font-bold text-lg rounded-xl hover:bg-red-700 transition-all shadow-xl uppercase">
                            Đăng Ký Tư Vấn
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}