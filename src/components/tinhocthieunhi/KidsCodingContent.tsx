'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    ArrowRight,
    Award,
    Gamepad2,
    Monitor,
    Smile,
    Palette,
    Terminal,
    Sparkles,
    Zap,
    Check
} from 'lucide-react';
import { CourseCard } from '@/components/cards/course-card';
import { COURSES } from '@/constants/courses';
import { useTranslations } from 'next-intl';

const KidsCodingCarousel = () => {
    const images = [
        { src: "https://media.erg.edu.vn/banner/scratch-banner.jpg", label: "Lập trình Scratch (Tiểu học)" },
        { src: "https://media.erg.edu.vn/banner/python-banner.jpg", label: "Lập trình Python (THCS)" },
    ];

    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % images.length);
        }, 4000);
        return () => clearInterval(timer);
    }, [images.length]);

    return (
        <div className="relative w-full max-w-md aspect-[4/3] rounded-2xl shadow-2xl overflow-hidden border-4 border-white/20 bg-white group">
            <div className="absolute inset-0 bg-[#fdfbf7] flex items-center justify-center border-[10px] border-[#8B0000]/10">
                <div className="text-center text-gray-500 p-8">
                    <div className="mb-4 flex justify-center">
                        <Gamepad2 size={64} className="text-[#DAA520]" />
                    </div>
                    <h3 className="text-xl font-serif font-bold text-[#8B0000] uppercase mb-2">Lập trình Thiếu Nhi</h3>
                    <p className="font-semibold text-gray-700">{images[current].label}</p>
                </div>
            </div>

            <div className="absolute inset-0 w-full h-full bg-white transition-opacity duration-500">
                <img
                    src={images[current].src}
                    alt={images[current].label}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        (e.target as HTMLImageElement).style.opacity = '0';
                    }}
                />
            </div>

            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
                {images.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrent(idx)}
                        className={`w-2 h-2 rounded-full transition-all ${current === idx ? 'w-6 bg-[var(--erg-red)]' : 'bg-gray-300'}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default function KidsCodingContent() {
    const t = useTranslations('courses.tinhocthieunhi');
    const items = t.raw('learning.items');

    return (
        <main className="min-h-screen">
            <section className="relative bg-[var(--erg-blue)] text-white py-20 lg:py-28 overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-full bg-[url('https://media.erg.edu.vn/background/pattern-grid.png')] opacity-5"></div>
                <div className="absolute bottom-0 right-0 -mr-20 -mb-20 w-80 h-80 rounded-full bg-yellow-500 opacity-10 blur-3xl"></div>

                <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center gap-12">
                    <div className="md:w-1/2 space-y-6">
                        <span className="inline-block py-1 px-3 rounded-full bg-yellow-500/20 border border-yellow-400/30 text-sm font-semibold backdrop-blur-sm text-yellow-300">
                            {t('heroBadge')}
                        </span>
                        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
                            {t('heroTitle1')} <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400">
                                {t('heroTitle2')}
                            </span>
                        </h1>
                        <p className="text-lg text-blue-100 max-w-lg leading-relaxed">
                            {t('heroDesc')}
                        </p>
                        <div className="flex flex-wrap gap-4 pt-4">
                            <Link href="/khoa-hoc" className="px-8 py-3.5 bg-[var(--erg-red)] hover:bg-red-700 text-white font-bold rounded-lg transition-all shadow-lg shadow-red-900/20 flex items-center gap-2">
                                {t('cta.program')} <ArrowRight size={18} />
                            </Link>
                            <Link href="/tu-van" className="px-8 py-3.5 bg-white text-[var(--erg-blue)] hover:bg-blue-50 font-bold rounded-lg transition-all">
                                {t('cta.consult')}
                            </Link>
                        </div>
                    </div>

                    <div className="md:w-1/2 flex justify-center w-full">
                        <KidsCodingCarousel />
                    </div>
                </div>
            </section>

            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-[var(--erg-blue)]">{t('learning.title')}</h2>
                        <p className="text-gray-600 mt-2">{t('learning.subtitle')}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Monitor className="w-10 h-10 text-[var(--erg-red)]" />,
                                title: items[0].title,
                                desc: items[0].desc
                            },
                            {
                                icon: <Award className="w-10 h-10 text-[var(--erg-red)]" />,
                                title: items[1].title,
                                desc: items[1].desc
                            },
                            {
                                icon: <Smile className="w-10 h-10 text-[var(--erg-red)]" />,
                                title: items[2].title,
                                desc: items[2].desc
                            }
                        ].map((item, i) => (
                            <div key={i} className="p-8 rounded-2xl border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white group">
                                <div className="mb-4 bg-red-50 w-16 h-16 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-bold text-[var(--erg-blue)] mb-2">{item.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="khoa-hoc" className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                        <div>
                            <h2 className="text-3xl font-bold text-[var(--erg-blue)]">{t('coursesTitle')}</h2>
                            <p className="text-gray-600 mt-2">{t('coursesSubtitle')}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {COURSES.tinhocthieunhi.map((course) => (
                            <CourseCard
                                key={course.id}
                                {...course}
                            />
                        ))}
                    </div>
                    <div className="mt-12 text-center">
                        <div className="inline-flex items-center gap-2 text-gray-600 bg-white px-6 py-3 rounded-full border border-gray-200 shadow-sm text-sm font-medium">
                            <Check size={18} className="text-green-500" />
                            <span>{t('footerNote', { levels: t('footerNoteBold') })}</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 bg-[var(--erg-blue)] text-white text-center">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('ctaTitle')}</h2>
                    <p className="text-blue-100 mb-8 text-lg max-w-2xl mx-auto">
                        {t('ctaDesc')}
                    </p>
                    <Link href="/lien-he" className="inline-block px-12 py-4 bg-[var(--erg-red)] text-white font-bold rounded-full text-lg hover:scale-105 transition-transform shadow-lg shadow-red-900/30">
                        {t('ctaButton')}
                    </Link>
                </div>
            </section>
        </main>
    );
}
