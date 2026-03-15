import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowLeft, BookOpen, GraduationCap, ClipboardCheck, Sparkles, ChevronRight } from 'lucide-react';
import { ELEARNING_DATA } from '@/constants/elearning.constants';
import { notFound } from 'next/navigation';
import { Reveal, ScaleIn, FadeIn } from '@/components/shared/motion-wrapper';

interface LevelPageProps {
    params: Promise<{
        type: string;
        levelId: string;
    }>
}

/**
 * SEO ĐỘNG: Tạo Metadata cho từng trang Level
 */
export async function generateMetadata({ params }: LevelPageProps): Promise<Metadata> {
    const { type, levelId } = await params;
    const category = ELEARNING_DATA.find(c => c.id === type);
    const level = category?.levels.find(l => l.id === levelId);

    if (!level) return {};

    return {
        title: `${level.title} - Ôn luyện trực tuyến`,
        description: `${level.description}. Luyện tập và làm bài kiểm tra trắc nghiệm chứng chỉ ${level.title} chuẩn quốc tế tại ERG.`,
        openGraph: {
            title: `${level.title} | E-learning ERG`,
            description: level.description,
        }
    };
}

export default async function LevelPage({ params }: LevelPageProps) {
    const { type, levelId } = await params;

    const category = ELEARNING_DATA.find(c => c.id === type);
    if (!category) notFound();

    const level = category.levels.find(l => l.id === levelId);
    if (!level) notFound();

    // Dữ liệu Schema cho Google (Rich Results)
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": level.title,
        "description": level.description,
        "provider": {
            "@type": "Organization",
            "name": "Trung Tâm Ngoại Ngữ Tin Học ERG",
            "sameAs": "https://erg.edu.vn"
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFDFF] pb-24">
            {/* Schema Markup */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <main className="container mx-auto px-4 pt-12">
                {/* Breadcrumb - Minimal & Clean */}
                <div className="flex items-center gap-2 mb-12 text-sm font-medium text-slate-400 max-w-4xl mx-auto">
                    <Link href="/" className="hover:text-[#00008b] transition-colors">E-learning</Link>
                    <ChevronRight size={14} />
                    <span className="text-slate-600">{category.title}</span>
                </div>

                {/* Level Title Header */}
                <div className="text-center mb-16 max-w-4xl mx-auto">
                    <Reveal>
                        <h1 className="text-4xl md:text-6xl font-black text-[#00008b] mb-4 tracking-tight leading-tight">
                            {level.title}
                        </h1>
                    </Reveal>
                    <FadeIn delay={0.2}>
                        <p className="text-lg md:text-xl text-slate-500 font-medium">
                            {level.description}
                        </p>
                    </FadeIn>
                </div>

                {/* Units List - Extremely Clean & Modern */}
                <div className="flex flex-col gap-6 max-w-4xl mx-auto">
                    {level.units.map((unit, index) => (
                        <ScaleIn key={unit.id} delay={index * 0.05}>
                            <div className="group bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)] hover:shadow-[0_10px_40px_rgba(0,0,0,0.06)] hover:border-[#00008b]/10 transition-all duration-300">
                                <div className="flex flex-col md:flex-row md:items-center gap-6">
                                    {/* Compact numbered badge */}
                                    <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[#00008b] font-black text-xl group-hover:bg-[#00008b] group-hover:text-white transition-all duration-300">
                                        {index + 1}
                                    </div>

                                    <div className="flex-grow">
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="text-xl md:text-2xl font-bold text-slate-800">
                                                {unit.title}
                                            </h3>
                                            <span className="bg-amber-50 text-amber-600 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 border border-amber-100">
                                                <Sparkles size={10} /> MỚI
                                            </span>
                                        </div>
                                        <p className="text-slate-400 text-base font-medium line-clamp-1 group-hover:line-clamp-none transition-all">
                                            {unit.description || "Nội dung ôn luyện và kiểm tra chuẩn quốc tế."}
                                        </p>
                                    </div>

                                    {/* Action Buttons - Modern & Compact */}
                                    <div className="flex flex-row gap-3 mt-4 md:mt-0">
                                        <a
                                            href={unit.studyLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#00008b] hover:bg-[#000066] text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md shadow-blue-900/10 active:scale-95 whitespace-nowrap"
                                        >
                                            <BookOpen size={18} />
                                            <span>Luyện tập</span>
                                        </a>
                                        <a
                                            href={unit.testLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold py-3 px-6 rounded-xl border border-slate-200 transition-all active:scale-95 whitespace-nowrap"
                                        >
                                            <ClipboardCheck size={18} />
                                            <span>Kiểm tra</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </ScaleIn>
                    ))}

                    {level.units.length === 0 && (
                        <div className="py-24 text-center">
                            <GraduationCap size={48} className="mx-auto text-slate-200 mb-4" />
                            <p className="text-slate-400 font-medium">Nội dung đang được cập nhật...</p>
                        </div>
                    )}
                </div>

                <div className="mt-20 text-center">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-slate-400 hover:text-[#00008b] font-bold transition-all text-sm group"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Quay lại chọn Khối học
                    </Link>
                </div>
            </main>
        </div>
    );
}
