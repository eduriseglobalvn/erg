import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { GraduationCap, MousePointer2, ArrowRight, Star } from 'lucide-react';

const GS6_LEVELS = [
    {
        label: 'GS6 Level 1',
        sub: 'Lớp 6',
        path: '/level/secondary/gs6-level-1',
        bg: '#00ADC4',
    },
    {
        label: 'GS6 Level 2',
        sub: 'Lớp 7',
        path: '/level/secondary/gs6-level-2',
        bg: '#4352FF',
    },
    {
        label: 'GS6 Level 3',
        sub: 'Lớp 8 & 9',
        path: '/level/secondary/gs6-level-3',
        bg: '#1A237E',
    },
];

export default function ElearningHomePage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">

            {/* ── Hero ── */}
            <section className="relative h-[500px] md:h-[600px] w-full overflow-hidden">
                <Image
                    src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
                    alt="E-learning Background"
                    fill priority
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                <div className="absolute inset-0 flex flex-col items-center justify-end pb-20 md:pb-32 container mx-auto px-4 text-center text-white">
                    <div>
                        <h1 className="text-4xl md:text-7xl font-black mb-6 tracking-tight">
                            Học Mọi Lúc, Mọi Nơi
                        </h1>
                        <p className="text-lg md:text-2xl font-medium text-gray-200 max-w-2xl mx-auto opacity-90">
                            Truy cập trên điện thoại, máy tính bảng, laptop. Khám phá tri thức không giới hạn.
                        </p>
                    </div>
                </div>

                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-white opacity-40" />
                    <div className="w-8 h-2 rounded-full bg-blue-500" />
                    <div className="w-2 h-2 rounded-full bg-white opacity-40" />
                </div>
            </section>

            {/* ── Main card ── */}
            <section className="flex-1 container mx-auto px-4 -mt-16 md:-mt-24 relative z-10 pb-20">
                <div className="bg-white rounded-[40px] shadow-2xl p-10 md:p-20 text-center border border-gray-100">
                    {/* Title */}
                    <div className="mb-10">
                        <h2 className="text-4xl md:text-6xl font-black text-blue-600 mb-6 uppercase tracking-tight">
                            Học tập IC3 GS6 Trực Tuyến
                        </h2>
                        <p className="text-lg md:text-2xl text-gray-500 font-medium">
                            Nền tảng ôn tập và kiểm tra toàn diện cho học sinh{' '}
                            <span className="text-gray-900 font-bold">THCS (GS6)</span>.
                        </p>
                    </div>

                    {/* ── 3 level buttons ── */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6">
                        {GS6_LEVELS.map((lvl) => (
                            <Link
                                key={lvl.path}
                                href={lvl.path}
                                className="relative group overflow-hidden w-full sm:w-auto px-8 md:px-10 py-5 md:py-6 rounded-2xl font-black text-xl md:text-2xl transition-all transform hover:-translate-y-2 hover:shadow-2xl active:scale-95 flex items-center justify-center gap-3 text-white"
                                style={{ backgroundColor: lvl.bg }}
                            >
                                <span className="flex flex-col items-start leading-tight">
                                    <span>{lvl.label}</span>
                                    <span className="text-sm font-semibold opacity-80">{lvl.sub}</span>
                                </span>
                                <MousePointer2 size={24} className="animate-bounce flex-shrink-0" />
                                <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                            </Link>
                        ))}
                    </div>

                    {/* ── Feature cards ── */}
                    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-8 rounded-3xl bg-blue-50/50 border border-blue-100">
                            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-6 mx-auto">
                                <GraduationCap size={32} />
                            </div>
                            <h4 className="text-xl font-bold mb-3">Lộ trình học tập</h4>
                            <p className="text-gray-500 text-sm">Hướng dẫn chi tiết từ căn bản đến nâng cao theo chuẩn quốc tế.</p>
                        </div>
                        <div className="p-8 rounded-3xl bg-green-50/50 border border-green-100">
                            <div className="w-14 h-14 bg-green-600 rounded-2xl flex items-center justify-center text-white mb-6 mx-auto">
                                <Star size={32} />
                            </div>
                            <h4 className="text-xl font-bold mb-3">Kiểm tra kiến thức</h4>
                            <p className="text-gray-500 text-sm">Hệ thống bài tập trắc nghiệm mô phỏng kỳ thi thực tế.</p>
                        </div>
                        <div className="p-8 rounded-3xl bg-purple-50/50 border border-purple-100">
                            <div className="w-14 h-14 bg-purple-600 rounded-2xl flex items-center justify-center text-white mb-6 mx-auto">
                                <ArrowRight size={32} />
                            </div>
                            <h4 className="text-xl font-bold mb-3">Kết quả ngay lập tức</h4>
                            <p className="text-gray-500 text-sm">Biết ngay điểm số và đáp án sau khi hoàn thành bài thi.</p>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="py-10 text-center text-gray-400 text-sm border-t border-gray-100 bg-white">
                © {new Date().getFullYear()} EduRise Global E-learning. Tất cả bản quyền được bảo hộ.
            </footer>
        </div>
    );
}
