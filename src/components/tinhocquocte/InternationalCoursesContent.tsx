'use client';

import React from 'react';
import { BookOpen, Monitor, Award } from 'lucide-react';
import { CourseCard } from '@/components/cards/course-card';

export default function InternationalCoursesContent() {
    const courses = [
        {
            id: 'ic3-spark',
            title: 'IC3 Spark GS6',
            subTitle: 'KHỐI TIỂU HỌC',
            description: 'Bước khởi đầu vững chắc. Giúp trẻ hiểu rõ trách nhiệm và đạo đức trong môi trường số.',
            icon: <BookOpen className="w-10 h-10 text-[var(--erg-blue)]" />,
            levels: ['Level 1: Máy tính cơ bản', 'Level 2: Các ứng dụng chính', 'Level 3: Cuộc sống trực tuyến'],
            link: '/khoa-hoc/ic3-gs6-spark',
            borderClass: 'border-blue-200'
        },
        {
            id: 'ic3-gs6',
            title: 'IC3 GS6',
            subTitle: 'KHỐI THCS',
            description: 'Tiêu chuẩn toàn cầu về năng lực số. Trang bị tư duy công nghệ và kỹ năng làm việc chuyên nghiệp.',
            icon: <Monitor className="w-10 h-10 text-[#008080]" />,
            levels: ['Level 1: Nhập môn', 'Level 2: Thực hành', 'Level 3: Nâng cao'],
            link: '/khoa-hoc/ic3-gs6',
            borderClass: 'border-teal-200'
        },
        {
            id: 'mos',
            title: 'MOS Certification',
            subTitle: 'KHỐI THPT & ĐẠI HỌC',
            description: 'Chứng chỉ tin học văn phòng Microsoft. Điểm cộng tuyệt đối cho hồ sơ du học và xin việc.',
            icon: <Award className="w-10 h-10 text-[#c43e1c]" />,
            levels: ['MOS Specialist', 'MOS Expert', 'MOS Master'],
            link: '/khoa-hoc/mos',
            borderClass: 'border-orange-200'
        }
    ];

    return (
        <div className="min-h-screen bg-white pb-20 pt-[70px] lg:pt-[135px]">
            {/* HEADER */}
            <div className="bg-[var(--erg-blue)] py-16 text-center text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <h1 className="text-3xl md:text-5xl font-bold mb-4 uppercase tracking-wide">Hệ Thống Đào Tạo</h1>
                <p className="text-blue-100 max-w-2xl mx-auto text-lg">
                    Lộ trình chuẩn quốc tế từ Tiểu học đến Đại học cùng ERG Global
                </p>
            </div>

            {/* Course List */}
            <div className="container mx-auto px-4 -mt-10 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {courses.map((course) => (
                        <CourseCard
                            key={course.id}
                            id={course.id}
                            title={course.title}
                            displayTitle={course.title.split(' ')[0]}
                            subtitle={course.subTitle}
                            description={course.description}
                            icon={course.icon}
                            points={course.levels}
                            href={course.link}
                            headerGradient={
                                course.id === 'ic3-spark' ? "from-blue-600 to-blue-400" :
                                    course.id === 'ic3-gs6' ? "from-[#008080] to-teal-400" :
                                        "from-[#c43e1c] to-orange-400"
                            }
                            btnColor={
                                course.id === 'ic3-spark' ? "border-blue-600 text-blue-600 hover:bg-blue-600" :
                                    course.id === 'ic3-gs6' ? "border-teal-600 text-teal-600 hover:bg-teal-600" :
                                        "border-[#c43e1c] text-[#c43e1c] hover:bg-[#c43e1c]"
                            }
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
