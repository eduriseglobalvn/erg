'use client';

import React from 'react';
import {
    Terminal,
    Cloud,
    Container,
    GitBranch,
    ArrowRight,
    CheckCircle2
} from 'lucide-react';

const CloudRoadmap = () => {
    const steps = [
        {
            id: 1,
            phase: "Phase 1",
            title: "Foundation",
            subtitle: "Linux & Network",
            icon: <Terminal size={20} className="text-white" />,
            description: "Xây dựng nền tảng vững chắc về hệ điều hành Linux và mạng máy tính cơ bản.",
            bgIcon: "bg-slate-700",
            color: "border-slate-300",
            milestone: false
        },
        {
            id: 2,
            phase: "Phase 2",
            title: "Cloud Services",
            subtitle: "AWS / Azure Core",
            icon: <Cloud size={20} className="text-white" />,
            description: "Làm chủ các dịch vụ cốt lõi: EC2, S3, RDS, IAM. Hiểu rõ mô hình IaaS, PaaS.",
            bgIcon: "bg-orange-500",
            color: "border-orange-200",
            milestone: false
        },
        {
            id: 3,
            phase: "Phase 3",
            title: "Containerization",
            subtitle: "Docker & Kubernetes",
            icon: <Container size={20} className="text-white" />,
            description: "Chuyển đổi sang Microservices. Đóng gói và điều phối container quy mô lớn.",
            bgIcon: "bg-blue-600",
            color: "border-blue-200",
            milestone: false
        },
        {
            id: 4,
            phase: "Target",
            title: "DevOps Engineer",
            subtitle: "CI/CD & Automation",
            icon: <GitBranch size={20} className="text-white" />,
            description: "Tự động hóa quy trình triển khai (Jenkins) và quản lý hạ tầng bằng mã nguồn (Terraform).",
            bgIcon: "bg-purple-600",
            color: "border-purple-500 shadow-md", // Nổi bật bước cuối
            milestone: true
        }
    ];

    return (
        <section className="py-16 bg-white overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <span className="text-blue-600 font-bold tracking-wider uppercase text-sm">Career Path</span>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-2">
                        Lộ Trình <span className="text-blue-600">Cloud DevOps</span>
                    </h2>
                </div>

                <div className="relative">
                    {/* Đường nối đứt đoạn (Dashed Line) */}
                    <div className="hidden md:block absolute top-12 left-[10%] w-[80%] h-1 border-t-2 border-dashed border-gray-300 z-0"></div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
                        {steps.map((step, index) => (
                            <div key={step.id} className="relative group">

                                {/* Mũi tên nối tiếp */}
                                {index < steps.length - 1 && (
                                    <div className="hidden md:flex absolute top-12 -right-3 w-6 h-6 bg-white border border-gray-200 rounded-full items-center justify-center z-20 text-gray-400">
                                        <ArrowRight size={14} />
                                    </div>
                                )}

                                <div className={`h-full bg-white rounded-2xl p-6 border-2 transition-all duration-300 flex flex-col hover:-translate-y-1 hover:shadow-lg ${step.color}`}>

                                    {/* Header */}
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className={`w-12 h-12 rounded-full ${step.bgIcon} flex items-center justify-center flex-shrink-0 shadow-md`}>
                                            {/* Đã sửa lỗi cloneElement ở đây, hoặc đơn giản là render trực tiếp icon */}
                                            {step.icon}
                                        </div>
                                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                                            {step.phase}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <h3 className={`text-lg font-bold mb-1 ${step.milestone ? 'text-purple-700' : 'text-slate-800'}`}>
                                        {step.title}
                                    </h3>
                                    <p className="text-xs font-semibold text-blue-600 mb-3">
                                        {step.subtitle}
                                    </p>

                                    <p className="text-slate-600 text-sm leading-relaxed">
                                        {step.description}
                                    </p>

                                    {/* Badge cho bước cuối */}
                                    {step.milestone && (
                                        <div className="mt-4 pt-3 border-t border-dashed border-purple-100">
                                            <div className="flex items-center gap-2 text-purple-700 text-xs font-bold bg-purple-50 p-2 rounded-lg justify-center">
                                                <CheckCircle2 size={14} />
                                                <span>Ready for Job</span>
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

export default CloudRoadmap;