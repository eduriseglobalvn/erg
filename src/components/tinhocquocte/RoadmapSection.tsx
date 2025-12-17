'use client';

import React from 'react';
import { GraduationCap, BookOpen, Monitor, Award } from 'lucide-react';

const steps = [
    {
        level: 'Khối Tiểu học',
        icon: <BookOpen className="w-6 h-6" />,
        color: 'bg-blue-100 text-blue-600 border-blue-200',
        certs: [
            { name: 'IC3 Spark Level 1', desc: 'Học máy tính từ những bước đầu tiên' },
            { name: 'IC3 Spark Level 2', desc: 'Nâng cao nhận thức & kĩ năng thực hành' },
            { name: 'IC3 Spark Level 3', desc: 'Hiểu rõ trách nhiệm & đạo đức số' },
        ]
    },
    {
        level: 'Khối THCS',
        icon: <Monitor className="w-6 h-6" />,
        color: 'bg-teal-100 text-teal-600 border-teal-200',
        certs: [
            { name: 'IC3 GS6 Level 1', desc: 'Hiểu và sử dụng CNTT ở mức nền tảng' },
            { name: 'IC3 GS6 Level 2', desc: 'Nâng cao kỹ năng và tư duy công nghệ' },
            { name: 'IC3 GS6 Level 3', desc: 'Khẳng định sự thành thạo & bản lĩnh' },
        ]
    },
    {
        level: 'Khối THPT',
        icon: <Award className="w-6 h-6" />,
        color: 'bg-orange-100 text-orange-600 border-orange-200',
        certs: [
            { name: 'MOS Word', desc: 'Làm chủ công cụ soạn thảo văn bản' },
            { name: 'MOS Excel', desc: 'Làm chủ kỹ năng xử lý & phân tích dữ liệu' },
            { name: 'MOS PowerPoint', desc: 'Làm chủ kỹ năng thiết kế & thuyết trình' },
        ]
    },
    {
        level: 'CĐ, Đại Học',
        icon: <GraduationCap className="w-6 h-6" />,
        color: 'bg-indigo-100 text-indigo-600 border-indigo-200',
        certs: [
            { name: 'MOS Expert', desc: 'Nâng cao hiệu quả làm việc với Office' },
            { name: 'MOS Master', desc: 'Thành thạo toàn diện & chuyên nghiệp' },
        ]
    }
];

export default function RoadmapSection() {
    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                        LỘ TRÌNH ĐÀO TẠO TIN HỌC QUỐC TẾ
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Xây dựng nền tảng công nghệ vững chắc từ những bước đi đầu tiên cho đến khi thành thạo chuyên nghiệp.
                    </p>
                </div>

                <div className="relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden lg:block absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 z-0"></div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                        {steps.map((step, index) => (
                            <div key={index} className="flex flex-col h-full group">
                                {/* Step Header */}
                                <div className={`
                  flex items-center gap-3 p-4 rounded-t-xl border-b-2 bg-white shadow-sm transition-transform hover:-translate-y-1
                  ${step.color}
                `}>
                                    <div className={`p-2 rounded-full bg-white bg-opacity-60`}>
                                        {step.icon}
                                    </div>
                                    <h3 className="font-bold text-lg uppercase">{step.level}</h3>
                                </div>

                                {/* Step Body */}
                                <div className="flex-1 bg-white p-6 rounded-b-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                                    <div className="space-y-6">
                                        {step.certs.map((cert, idx) => (
                                            <div key={idx} className="relative pl-4 border-l-2 border-gray-200 hover:border-highlight transition-colors">
                                                {/* Dot visualization */}
                                                <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-gray-300 group-hover:bg-highlight transition-colors"></div>
                                                <h4 className="font-bold text-gray-800 text-sm md:text-base">{cert.name}</h4>
                                                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{cert.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}