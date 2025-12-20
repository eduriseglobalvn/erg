'use client';

import React from 'react';
import { BookOpen, Trophy, ArrowRight, CheckCircle2, MoreHorizontal, Star, Layers, GraduationCap } from 'lucide-react';

const RoadmapSection = () => {
    const roadmapSteps = [
        {
            id: 1,
            phase: "Giai Đoạn 1",
            title: "Học Phần Cơ Bản",
            subtitle: "Trang bị kiến thức nền (IU01 - IU06)",
            icon: <BookOpen className="w-6 h-6" />,
            description: "Học từ đầu: Windows, Internet và trọn bộ Office cơ bản (Word, Excel, PPT).",
            isMilestone: false,
        },
        {
            id: 2,
            phase: "Mục Tiêu 1",
            title: "Cấp Chứng Chỉ Cơ Bản",
            subtitle: "Đủ điều kiện Tốt nghiệp & Xin việc",
            icon: <Trophy className="w-6 h-6" />,
            description: "Thi sát hạch. Nhận chứng chỉ CNTT Cơ bản có giá trị toàn quốc. Bạn có thể dừng lại ở đây.",
            isMilestone: true, // Đánh dấu đây là chặng quan trọng (Sẽ dùng màu ĐỎ)
        },
        {
            id: 3,
            phase: "Giai Đoạn 2 (Tùy chọn)",
            title: "Nâng Cấp Kỹ Năng",
            subtitle: "Yêu cầu: Đã có chứng chỉ Cơ bản",
            icon: <Layers className="w-6 h-6" />,
            description: "Học các chuyên đề nâng cao: Trộn thư, Mục lục tự động, PivotTable, Slide Master...",
            isMilestone: false,
        },
        {
            id: 4,
            phase: "Mục Tiêu 2",
            title: "Cấp Chứng Chỉ Nâng Cao",
            subtitle: "Hoàn thiện hồ sơ chuyên nghiệp",
            icon: <GraduationCap className="w-6 h-6" />,
            description: "Thi sát hạch 3 mô đun nâng cao (IU07, IU08, IU09). Nhận chứng chỉ CNTT Nâng cao.",
            isMilestone: true, // Đánh dấu đây là chặng quan trọng (Sẽ dùng màu ĐỎ)
        }
    ];

    return (
        <section className="py-20 bg-white overflow-hidden">
            <div className="container mx-auto px-4">
                {/* Header Title */}
                <div className="text-center mb-16">
                    <span className="text-[var(--erg-red)] font-bold tracking-wider uppercase text-sm">Lộ trình đào tạo & Cấp bằng</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-[var(--erg-blue)] mt-2">
                        Chinh Phục Chứng Chỉ Tin Học Quốc Gia
                    </h2>
                    <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                        Lộ trình linh hoạt theo nhu cầu, bám sát Thông tư 03/2014/TT-BTTTT. Sử dụng màu sắc thương hiệu để định hướng người học.
                    </p>
                </div>

                <div className="relative">
                    {/* Đường nối đứt đoạn (Dashed Line) - Màu xám nhẹ để không rối mắt */}
                    <div className="hidden md:block absolute top-12 left-[10%] w-[80%] h-1 border-t-2 border-dashed border-gray-200 z-0"></div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
                        {roadmapSteps.map((step, index) => {
                            // Logic xác định kiểu dáng dựa trên việc có phải Milestone hay không
                            const cardBorderClass = step.isMilestone
                                ? 'border-[var(--erg-red)] shadow-md bg-red-50/30' // Viền ĐỎ cho mục tiêu quan trọng, nền đỏ cực nhạt
                                : 'border-gray-200 hover:border-[var(--erg-blue)] hover:shadow-lg bg-white'; // Viền xám, hover ra XANH cho các bước thường

                            const iconBgClass = step.isMilestone
                                ? 'bg-red-100 text-[var(--erg-red)]' // Icon nền đỏ, màu đỏ
                                : 'bg-blue-50 text-[var(--erg-blue)]'; // Icon nền xanh nhạt, màu xanh

                            const titleColorClass = step.isMilestone
                                ? 'text-[var(--erg-red)]'
                                : 'text-[var(--erg-blue)]';

                            return (
                                <div key={step.id} className="relative group">

                                    {/* Connector Arrow (Giữ màu xám trung tính) */}
                                    {index < roadmapSteps.length - 1 && (
                                        <div className="hidden md:flex absolute top-12 -right-3 w-6 h-6 bg-white border border-gray-200 rounded-full items-center justify-center z-20 text-gray-400">
                                            {index === 1 ? <MoreHorizontal size={14} /> : <ArrowRight size={14} />}
                                        </div>
                                    )}

                                    {/* Main Card */}
                                    <div className={`h-full rounded-2xl p-6 border-2 transition-all duration-300 flex flex-col ${cardBorderClass}`}>

                                        {/* Header: Icon & Phase */}
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${iconBgClass}`}>
                                                {step.icon}
                                            </div>
                                            <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                                                {step.phase}
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <h3 className={`text-lg font-bold mb-1 ${titleColorClass}`}>
                                            {step.title}
                                        </h3>
                                        <p className="text-xs font-semibold text-gray-500 mb-3">
                                            {step.subtitle}
                                        </p>

                                        <p className="text-gray-700 text-sm leading-relaxed mb-4 flex-grow font-medium">
                                            {step.description}
                                        </p>

                                        {/* Footer Badge for Milestones (Sử dụng màu XANH thương hiệu để báo hiệu hoàn thành) */}
                                        {step.isMilestone && (
                                            <div className="mt-auto pt-3 border-t border-dashed border-[var(--erg-red)]/30">
                                                <div className="flex items-center gap-2 text-[var(--erg-blue)] text-xs font-bold bg-blue-50 p-2 rounded-lg">
                                                    <CheckCircle2 size={16} className="text-[var(--erg-blue)]" />
                                                    <span>Được cấp chứng chỉ (Phôi BGD)</span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Note for Optional Step */}
                                        {step.id === 3 && (
                                            <div className="mt-auto pt-3 border-t border-dashed border-gray-200">
                        <span className="text-xs italic text-gray-500">
                          *Dành cho người muốn nâng cao trình độ
                        </span>
                                            </div>
                                        )}

                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RoadmapSection;