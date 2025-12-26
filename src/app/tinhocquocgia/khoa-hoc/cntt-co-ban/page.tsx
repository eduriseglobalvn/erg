'use client';

import React from 'react';
import {
    CheckCircle2,
    Clock,
    Users,
    FileText,
    Monitor,
    Globe,
    Layout,
    Table,
    Presentation,
    ShieldCheck, BookOpen, Award
} from 'lucide-react';
import Link from 'next/link';

export default function BasicITCoursePage() {
    // Nội dung chi tiết được trích xuất từ các hình ảnh cung cấp
    const curriculum = [
        {
            id: "IU01-02-06",
            title: "Sử dụng Windows Explorer (Mô đun: IU01, IU02, IU06)",
            details: [
                "Sơ lược về phần cứng và phần mềm máy tính",
                "Giới thiệu hệ điều hành Windows: Quản lý tập tin/thư mục",
                "Thao tác tìm kiếm file trên máy hoặc Internet",
                "Sao chép, di chuyển, đổi tên tập tin và thư mục",
                "Tạo shortcut, xem và gán thuộc tính cho tập tin",
                "Nén và giải nén dữ liệu",
                "Sử dụng các phần mềm có sẵn: Paint, Notepad, Wordpad, Calc..."
            ],
            icon: <Monitor className="w-6 h-6 text-blue-600" />
        },
        {
            id: "IU03",
            title: "Soạn thảo văn bản với MS. Word (Mô đun: IU03)",
            details: [
                "Tạo, lưu và định dạng văn bản, đoạn văn bản",
                "Định dạng Font chữ, canh lề, gạch đầu dòng, kẻ khung, tô nền",
                "Chia cột báo (Columns), tạo chữ lớn đầu dòng (Drop Cap)",
                "Chèn hiệu ứng WordArt, Clip Art, Shapes, Picture",
                "Tạo Table (bảng biểu) và hiệu chỉnh chi tiết",
                "Thiết lập Header/Footer, Watermark bảo vệ văn bản"
            ],
            icon: <FileText className="w-6 h-6 text-blue-600" />
        },
        {
            id: "IU04",
            title: "Các hàm cơ bản trong MS. Excel (Mô đun: IU04)",
            details: [
                "Nhóm hàm kiểu chuỗi (LEFT, RIGHT, MID, LEN, VALUE)",
                "Nhóm hàm ngày tháng năm (DAY, MONTH, YEAR, NOW, TODAY)",
                "Nhóm hàm số (INT, MOD, ROUND, AVERAGE, MIN, MAX)",
                "Nhóm hàm điều kiện (IF, AND, OR)",
                "Nhóm hàm thống kê (SUMIF, COUNTIF)",
                "Nhóm hàm dò tìm (VLOOKUP, HLOOKUP)",
                "Trích lọc dữ liệu, sắp xếp và vẽ biểu đồ hiển thị"
            ],
            icon: <Table className="w-6 h-6 text-blue-600" />
        },
        {
            id: "IU05",
            title: "Thiết kế trình chiếu với MS. Powerpoint (Mô đun: IU05)",
            details: [
                "Giới thiệu kỹ năng trình bày nội dung chuyên nghiệp",
                "Thao tác tạo slide: thêm, xóa, sắp xếp thứ tự slide",
                "Chèn đối tượng: bảng, hình ảnh, biểu đồ, video, âm thanh",
                "Sử dụng định dạng Themes có sẵn",
                "Thiết lập hiệu ứng chuyển slide (Transitions)",
                "Thiết lập hiệu ứng cho các đối tượng trong slide (Animations)",
                "Kỹ năng trình chiếu bài thuyết trình"
            ],
            icon: <Presentation className="w-6 h-6 text-blue-600" />
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* 1. HERO SECTION - Thông tin chung */}
            <section className="bg-[var(--erg-blue)] text-white py-20 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px'}}></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl">
                        <h1 className="text-3xl md:text-5xl font-extrabold mb-6 uppercase leading-tight">
                            Kỹ Năng Sử Dụng Công Nghệ Thông Tin Cơ Bản
                        </h1>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm mb-8">
                            <div className="flex items-center gap-2">
                                <Clock className="text-yellow-400" size={20} />
                                <span>Thời lượng: 15 Buổi</span>
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
                            {/*    <Award className="text-yellow-400" size={20} />*/}
                            {/*    <span>Học phí: 1,650,000 đ</span>*/}
                            {/*</div>*/}
                        </div>
                        <div className="flex gap-4">
                            <button className="px-8 py-3 bg-[var(--erg-red)] rounded-lg font-bold hover:bg-red-700 transition-all">ĐĂNG KÝ NGAY</button>
                            <button className="px-8 py-3 bg-white text-[var(--erg-blue)] rounded-lg font-bold hover:bg-gray-100 transition-all">TẢI ĐỀ CƯƠNG</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. COURSE CONTENT - Nội dung chi tiết */}
            <section className="py-20 relative" style={{
                backgroundColor: '#ffffff',
                backgroundImage: 'linear-gradient(to right, rgba(229, 231, 235, 0.4) 1.5px, transparent 1.5px), linear-gradient(to bottom, rgba(229, 231, 235, 0.4) 1.5px, transparent 1.5px)',
                backgroundSize: '80px 80px'
            }}>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Cột trái: Nội dung học phần */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                                <h2 className="text-2xl font-bold text-[var(--erg-blue)] mb-8 flex items-center gap-3">
                                    <BookOpen className="text-[var(--erg-red)]" />
                                    CHI TIẾT CHƯƠNG TRÌNH HỌC
                                </h2>

                                <div className="space-y-10">
                                    {curriculum.map((section) => (
                                        <div key={section.id} className="relative pl-8 border-l-2 border-gray-100 group">
                                            <div className="absolute -left-[13px] top-0 w-6 h-6 rounded-full bg-white border-4 border-[var(--erg-blue)] group-hover:bg-[var(--erg-blue)] transition-all"></div>
                                            <div className="flex items-center gap-4 mb-4">
                                                {section.icon}
                                                <h3 className="text-xl font-bold text-gray-800 uppercase tracking-tight">{section.title}</h3>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {section.details.map((item, idx) => (
                                                    <div key={idx} className="flex items-start gap-2 text-gray-600 text-sm">
                                                        <CheckCircle2 size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                                                        <span>{item}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Cột phải: Thông tin bổ sung */}
                        <div className="space-y-8">
                            <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
                                <h4 className="font-bold text-gray-800 mb-4 border-b pb-2 uppercase italic text-sm">Đối tượng tham gia:</h4>
                                <ul className="space-y-3 text-sm text-gray-600">
                                    <li className="flex gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--erg-red)] mt-1.5 flex-shrink-0"></div>
                                        Học viên chưa có kiến thức về tin học cơ bản (Word, Excel, PowerPoint).
                                    </li>
                                    <li className="flex gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--erg-red)] mt-1.5 flex-shrink-0"></div>
                                        Học viên cần cập nhật và thực hành các kiến thức tin học văn phòng bài bản.
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-[var(--erg-blue)] p-8 rounded-2xl shadow-xl text-white">
                                <h4 className="font-bold text-xl mb-4">Mục tiêu khóa học</h4>
                                <p className="text-sm text-blue-100 leading-relaxed mb-6">
                                    Giúp học viên đạt kết quả cao trong kỳ thi cấp chứng chỉ ứng dụng CNTT quốc gia chuẩn Bộ GD&ĐT.
                                </p>
                                <div className="space-y-4 text-sm">
                                    <div className="bg-white/10 p-4 rounded-lg">
                                        <p className="font-bold text-yellow-400">Cam kết đầu ra</p>
                                        <p className="opacity-80">Hỗ trợ ôn luyện bộ đề thi thực tế sát hạch nhất.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. FOOTER CTA */}
            <section className="py-20 bg-white border-t border-gray-100 text-center">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-5xl font-bold text-[var(--erg-blue)] mb-6 uppercase">
                        Ghi Danh Ngay Hôm Nay
                    </h2>
                    <p className="text-gray-600 mb-10 text-lg max-w-2xl mx-auto font-medium">
                        Để lại thông tin để được tư vấn lộ trình và nhận tài liệu ôn thi miễn phí.
                    </p>
                    <Link href="/lien-he" className="inline-block px-12 py-5 bg-[var(--erg-red)] text-white font-bold text-xl rounded-xl hover:bg-red-700 transition-all shadow-xl uppercase">
                        Đăng Ký Tư Vấn Ngay
                    </Link>
                </div>
            </section>
        </div>
    );
}