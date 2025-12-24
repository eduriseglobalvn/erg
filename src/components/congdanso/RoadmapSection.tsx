'use client';

import React from 'react';
import { Shield, MessageCircle, Brain, Heart, ArrowRight, CheckCircle2 } from 'lucide-react';

const RoadmapSection = () => {
    const roadmapSteps = [
        {
            id: 1,
            phase: "Giai Đoạn 1",
            title: "Phòng Vệ Số",
            subtitle: "Xây dựng lá chắn an toàn",
            icon: <Shield className="w-6 h-6 text-blue-600" />,
            bgIcon: "bg-blue-100",
            description: "Nhận diện rủi ro, bảo mật tài khoản và giữ an toàn cho dữ liệu cá nhân.",
            color: "border-blue-200",
            milestone: false
        },
        {
            id: 2,
            phase: "Giai Đoạn 2",
            title: "Văn Hóa Số",
            subtitle: "Giao tiếp & Ứng xử",
            icon: <MessageCircle className="w-6 h-6 text-purple-600" />,
            bgIcon: "bg-purple-100",
            description: "Tương tác văn minh, tôn trọng cộng đồng và xây dựng hình ảnh tích cực.",
            color: "border-purple-200",
            milestone: false
        },
        {
            id: 3,
            phase: "Giai Đoạn 3",
            title: "Tư Duy Số",
            subtitle: "Năng lực thông tin",
            icon: <Brain className="w-6 h-6 text-orange-600" />,
            bgIcon: "bg-orange-100",
            description: "Đánh giá nguồn tin, phân biệt tin giả và tư duy phản biện sắc bén.",
            color: "border-orange-200",
            milestone: false
        },
        {
            id: 4,
            phase: "Mục Tiêu",
            title: "Công Dân Số Toàn Cầu",
            subtitle: "Trách nhiệm & Cống hiến",
            icon: <Heart className="w-6 h-6 text-red-600" />,
            bgIcon: "bg-red-100",
            description: "Sống cân bằng, tuân thủ pháp luật và lan tỏa giá trị tốt đẹp.",
            color: "border-red-500 shadow-md", // Nổi bật bước cuối
            milestone: true
        }
    ];

    return (
        <section className="py-16 bg-white overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <span className="text-[var(--erg-red)] font-bold tracking-wider uppercase text-sm">Lộ trình phát triển năng lực</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-[var(--erg-blue)] mt-2">
                        Hành Trình Trưởng Thành Số
                    </h2>
                </div>

                <div className="relative">
                    {/* Đường nối đứt đoạn (Dashed Line) */}
                    <div className="hidden md:block absolute top-12 left-[10%] w-[80%] h-1 border-t-2 border-dashed border-gray-300 z-0"></div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
                        {roadmapSteps.map((step, index) => (
                            <div key={step.id} className="relative group">

                                {/* Mũi tên nối tiếp */}
                                {index < roadmapSteps.length - 1 && (
                                    <div className="hidden md:flex absolute top-12 -right-3 w-6 h-6 bg-white border border-gray-200 rounded-full items-center justify-center z-20 text-gray-400">
                                        <ArrowRight size={14} />
                                    </div>
                                )}

                                <div className={`h-full bg-white rounded-2xl p-6 border-2 transition-all duration-300 flex flex-col hover:-translate-y-1 hover:shadow-lg ${step.color}`}>

                                    {/* Header */}
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className={`w-12 h-12 rounded-full ${step.bgIcon} flex items-center justify-center flex-shrink-0`}>
                                            {step.icon}
                                        </div>
                                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                                            {step.phase}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <h3 className={`text-lg font-bold mb-1 ${step.milestone ? 'text-[var(--erg-red)]' : 'text-gray-800'}`}>
                                        {step.title}
                                    </h3>
                                    <p className="text-xs font-semibold text-gray-500 mb-3">
                                        {step.subtitle}
                                    </p>

                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {step.description}
                                    </p>

                                    {/* Badge cho bước cuối */}
                                    {step.milestone && (
                                        <div className="mt-4 pt-3 border-t border-dashed border-red-100">
                                            <div className="flex items-center gap-2 text-red-600 text-xs font-bold bg-red-50 p-2 rounded-lg justify-center">
                                                <CheckCircle2 size={14} />
                                                <span>Đạt chuẩn Công dân số</span>
                                            </div>
                                        </div>
                                    )}

                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RoadmapSection;