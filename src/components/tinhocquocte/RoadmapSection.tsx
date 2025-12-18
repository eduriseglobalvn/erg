'use client';

import React, { useState } from 'react';
// 1. Thêm 'Star' vào import
import { GraduationCap, BookOpen, Monitor, Award, School, Building2, Clock, CheckCircle2, Star } from 'lucide-react';

// --- DATA: Lộ trình Liên kết Trường học ---
const schoolSteps = [
    {
        level: 'Khối Tiểu học',
        sub: 'Lộ trình 5 năm',
        icon: <BookOpen className="w-6 h-6" />,
        color: 'border-blue-200 bg-blue-50 text-blue-700',
        iconBg: 'bg-blue-100',
        certs: [
            { name: 'IC3 Spark Level 1', desc: 'Làm quen phần cứng, phần mềm & HĐH.' },
            { name: 'IC3 Spark Level 2', desc: 'Các ứng dụng chủ chốt (Word, Excel, PPT cơ bản).' },
            { name: 'IC3 Spark Level 3', desc: 'Cuộc sống trực tuyến & An toàn số.' },
        ]
    },
    {
        level: 'Khối THCS',
        sub: 'Lộ trình 4 năm',
        icon: <Monitor className="w-6 h-6" />,
        color: 'border-teal-200 bg-teal-50 text-teal-700',
        iconBg: 'bg-teal-100',
        certs: [
            { name: 'IC3 GS6 Level 1', desc: 'CNTT Cơ bản & Công dân số.' },
            { name: 'IC3 GS6 Level 2', desc: 'Kỹ năng ứng dụng & Sáng tạo nội dung.' },
            { name: 'IC3 GS6 Level 3', desc: 'Quản lý hệ thống & An ninh mạng.' },
        ]
    },
    {
        level: 'Khối THPT',
        sub: 'Lộ trình 3 năm',
        icon: <Award className="w-6 h-6" />,
        color: 'border-orange-200 bg-orange-50 text-orange-700',
        iconBg: 'bg-orange-100',
        certs: [
            { name: 'MOS Word', desc: 'Soạn thảo văn bản chuyên nghiệp.' },
            { name: 'MOS Excel', desc: 'Xử lý tính toán & phân tích dữ liệu.' },
            { name: 'MOS PowerPoint', desc: 'Thiết kế bài thuyết trình ấn tượng.' },
        ]
    },
    {
        level: 'Đại Học & Đi Làm',
        sub: 'Chuyên sâu',
        icon: <GraduationCap className="w-6 h-6" />,
        color: 'border-indigo-200 bg-indigo-50 text-indigo-700',
        iconBg: 'bg-indigo-100',
        certs: [
            { name: 'MOS Specialist', desc: 'Chuẩn kỹ năng văn phòng quốc tế.' },
            { name: 'MOS Expert', desc: 'Xử lý dữ liệu & văn bản nâng cao.' },
        ]
    }
];

// --- DATA: Lộ trình Luyện thi Tại Trung tâm ---
const centerSteps = [
    {
        level: 'Luyện Thi IC3 Spark',
        sub: 'Dành cho Tiểu học',
        // 2. Sử dụng icon Star chính thức từ lucide-react
        icon: <Star className="w-6 h-6 text-yellow-500" fill="currentColor" />,
        color: 'border-blue-200 bg-white',
        tag: '10 Tuần / 30 Buổi',
        certs: [
            { name: 'Hệ thống kiến thức', desc: 'Cô đọng kiến thức 3 level trong thời gian ngắn.' },
            { name: 'Luyện đề Gmetrix', desc: 'Thực hành trên phần mềm giả lập thi thật.' },
            { name: 'Cam kết đầu ra', desc: 'Đạt chứng chỉ IC3 Spark quốc tế.' },
        ]
    },
    {
        level: 'Luyện Thi IC3 GS6',
        sub: 'Dành cho THCS',
        icon: <Monitor className="w-6 h-6 text-teal-600" />,
        color: 'border-teal-200 bg-white',
        tag: '10 Tuần / 30 Buổi',
        certs: [
            { name: 'Tư duy công nghệ', desc: 'Nắm vững kiến thức Máy tính & Internet.' },
            { name: 'Kỹ năng thực hành', desc: 'Thao tác thành thạo bộ Office cơ bản.' },
            { name: 'Chiến thuật làm bài', desc: 'Tối ưu điểm số với bộ đề thi sát sườn.' },
        ]
    },
    {
        level: 'Luyện Thi MOS',
        sub: 'THPT & Sinh viên',
        icon: <Award className="w-6 h-6 text-orange-600" />,
        color: 'border-orange-200 bg-white',
        tag: '10 Tuần / 30 Buổi',
        certs: [
            { name: 'MOS Word/Excel/PPT', desc: 'Chọn 1 trong 3 môn để luyện chuyên sâu.' },
            { name: 'Thực hành 100%', desc: 'Học trực tiếp trên máy tính, cầm tay chỉ việc.' },
            { name: 'Chứng chỉ trọn đời', desc: 'Sở hữu chứng chỉ Microsoft giá trị toàn cầu.' },
        ]
    },
    {
        level: 'Tin Học Văn Phòng',
        sub: 'Người đi làm',
        icon: <GraduationCap className="w-6 h-6 text-indigo-600" />,
        color: 'border-indigo-200 bg-white',
        tag: 'Linh hoạt',
        certs: [
            { name: 'Ứng dụng thực tế', desc: 'Xử lý văn bản, bảng tính phục vụ công việc.' },
            { name: 'Kỹ năng mềm', desc: 'Email, Lịch biểu, Quản lý tệp tin khoa học.' },
            { name: 'Cấp tốc', desc: 'Đào tạo theo nhu cầu doanh nghiệp hoặc cá nhân.' },
        ]
    }
];

export default function RoadmapSection() {
    const [activeTab, setActiveTab] = useState<'school' | 'center'>('school');

    const data = activeTab === 'school' ? schoolSteps : centerSteps;

    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">

                {/* HEADLINE */}
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-[var(--erg-blue)] mb-4 uppercase">
                        Lộ Trình Đào Tạo
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Chúng tôi thiết kế lộ trình học tập linh hoạt, phù hợp với cả chương trình chính khóa tại trường và nhu cầu luyện thi cấp tốc tại trung tâm.
                    </p>
                </div>

                {/* TAB SWITCHER */}
                <div className="flex justify-center mb-12">
                    <div className="bg-white p-1.5 rounded-full shadow-md border border-gray-100 inline-flex">
                        <button
                            onClick={() => setActiveTab('school')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all duration-300 ${
                                activeTab === 'school'
                                    ? 'bg-[var(--erg-blue)] text-white shadow-lg'
                                    : 'text-gray-500 hover:bg-gray-100'
                            }`}
                        >
                            <School size={18} />
                            Đào tạo tại cơ sở đối tác
                        </button>
                        <button
                            onClick={() => setActiveTab('center')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all duration-300 ${
                                activeTab === 'center'
                                    ? 'bg-[var(--erg-red)] text-white shadow-lg'
                                    : 'text-gray-500 hover:bg-gray-100'
                            }`}
                        >
                            <Building2 size={18} />
                            Luyện thi tại trung tâm
                        </button>
                    </div>
                </div>

                {/* CONTENT GRID */}
                <div className="relative">
                    {/* Connecting Line (Only visible for School Timeline) */}
                    {activeTab === 'school' && (
                        <div className="hidden lg:block absolute top-[3.5rem] left-0 w-full h-1 bg-gray-200 z-0"></div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                        {data.map((step, index) => (
                            <div key={index} className="flex flex-col h-full group animate-in fade-in slide-in-from-bottom-4 duration-500" style={{animationDelay: `${index * 100}ms`}}>

                                {/* Step Header */}
                                <div className={`
                                    flex flex-col items-center text-center p-6 rounded-t-2xl border-b bg-white shadow-sm transition-transform hover:-translate-y-1 relative overflow-hidden
                                    ${activeTab === 'center' ? 'border-t-4 border-t-[var(--erg-red)]' : step.color}
                                `}>
                                    {/* Badge cho Center Track */}
                                    {activeTab === 'center' && 'tag' in step && (
                                        <div className="absolute top-3 right-3 bg-red-50 text-[var(--erg-red)] text-[10px] font-bold px-2 py-1 rounded border border-red-100 flex items-center gap-1">
                                            <Clock size={10} /> {(step as any).tag}
                                        </div>
                                    )}

                                    <div className={`p-3 rounded-full mb-3 ${activeTab === 'school' ? (step as any).iconBg : 'bg-gray-50'}`}>
                                        {step.icon}
                                    </div>
                                    <h3 className="font-bold text-lg uppercase text-gray-800">{step.level}</h3>
                                    <span className="text-xs text-gray-500 font-medium mt-1">{step.sub}</span>
                                </div>

                                {/* Step Body */}
                                <div className="flex-1 bg-white p-6 rounded-b-2xl shadow-md border-x border-b border-gray-100 hover:shadow-lg transition-shadow">
                                    <div className="space-y-5">
                                        {step.certs.map((cert, idx) => (
                                            <div key={idx} className="relative pl-3">
                                                <div className="flex items-start gap-2">
                                                    <CheckCircle2 size={16} className={`mt-0.5 flex-shrink-0 ${activeTab === 'center' ? 'text-[var(--erg-red)]' : 'text-green-500'}`}/>
                                                    <div>
                                                        <h4 className="font-bold text-gray-800 text-sm leading-snug">{cert.name}</h4>
                                                        <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">{cert.desc}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Button CTA cho Center Track */}
                                    {activeTab === 'center' && (
                                        <button className="w-full mt-6 py-2 bg-gray-50 text-[var(--erg-blue)] text-xs font-bold uppercase rounded border border-gray-200 hover:bg-[var(--erg-blue)] hover:text-white transition-colors">
                                            Đăng ký ngay
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Note footer */}
                <div className="mt-10 text-center">
                    <p className="text-sm text-gray-500 italic">
                        * {activeTab === 'school' ? 'Lộ trình được thiết kế bám sát chương trình của Bộ GD&ĐT và chuẩn quốc tế.' : 'Lớp luyện thi cấp tốc cam kết số lượng học viên ít, giáo viên kèm cặp sát sao.'}
                    </p>
                </div>
            </div>
        </section>
    );
}