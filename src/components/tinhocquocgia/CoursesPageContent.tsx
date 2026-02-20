'use client';

import React from 'react';
import { BookOpen, CheckCircle2, FileText, Award, Star } from 'lucide-react';
import Link from 'next/link';
import { CourseCard } from '@/components/cards/course-card';
import { CourseData } from '@/constants/courses';

interface CoursesPageContentProps {
    courses: CourseData[];
}

export default function CoursesPageContent({ courses }: CoursesPageContentProps) {
    return (
        <div className="min-h-screen bg-white">
            {/* 1. HERO SECTION */}
            <section className="bg-[var(--erg-blue)] text-white py-24 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
                </div>
                <div className="container mx-auto px-4 relative z-10">
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6 uppercase tracking-tight leading-tight">
                        Chương Trình <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400">Đào Tạo</span>
                    </h1>
                    <p className="text-blue-100 max-w-2xl mx-auto text-lg md:text-xl font-light">
                        Đáp ứng đầy đủ chuẩn đầu ra Tin học cho sinh viên và người đi làm theo quy định của Bộ GD&ĐT.
                    </p>
                </div>
            </section>

            {/* 2. COURSE LISTING */}
            <section className="py-20 relative"
                style={{
                    backgroundColor: '#ffffff',
                    backgroundImage: `
                        linear-gradient(to right, rgba(229, 231, 235, 0.4) 1.5px, transparent 1.5px),
                        linear-gradient(to bottom, rgba(229, 231, 235, 0.4) 1.5px, transparent 1.5px)
                    `,
                    backgroundSize: '80px 80px'
                }}
            >
                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {courses.map((course) => (
                            <CourseCard
                                key={course.id}
                                {...course}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. FOOTER CTA */}
            <section className="py-20 bg-white border-t border-gray-100">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold text-[var(--erg-blue)] mb-6">
                        Bạn Đã Sẵn Sàng?
                    </h2>
                    <p className="text-gray-600 mb-10 text-lg max-w-2xl mx-auto font-medium">
                        Đừng để lỡ "thời điểm vàng". Đăng ký ngay để nhận lộ trình chi tiết cho con em mình.
                    </p>
                    <Link href="/lien-he" className="inline-block px-12 py-5 bg-[var(--erg-red)] text-white font-bold text-xl rounded-xl hover:bg-red-700 transition-all shadow-xl hover:shadow-red-200 transform hover:-translate-y-1 uppercase tracking-wider">
                        Đăng Ký Tư Vấn Ngay
                    </Link>
                </div>
            </section>
        </div>
    );
}
