import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    ArrowRight, CheckCircle2, Award, Users, BookOpen,
    MonitorPlay, GraduationCap, ArrowUpRight
} from 'lucide-react';
import { TRAINING_CONTACT_URL, TRAINING_FIELDS } from "@/constants/training-fields";
import { useTranslations } from 'next-intl';

export default function TrainingFieldsContent() {
    const t = useTranslations('about.linhVucDaoTao');
    return (
        <main className="min-h-screen bg-gray-50 font-sans text-slate-800 pt-[70px] lg:pt-[135px]">

            {/* --- 1. HERO SECTION --- */}
            <section className="relative pt-20 pb-24 overflow-hidden" style={{ backgroundColor: '#00008b' }}>
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20"></div>

                <div className="container mx-auto px-4 relative z-10 text-center text-white">
                    <span className="inline-block py-1 px-3 rounded-full bg-white/10 border border-white/20 text-xs font-bold uppercase tracking-widest text-yellow-400 mb-6 backdrop-blur-sm">
                        {t('badge')}
                    </span>
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
                        {t('heading')}
                    </h1>
                    <p className="text-blue-100 max-w-2xl mx-auto text-lg font-light leading-relaxed">
                        {t('subheading')}
                    </p>
                </div>
            </section>

            {/* --- 2. STATS SECTION --- */}
            <div className="container mx-auto px-4 -mt-10 relative z-20">
                <div className="bg-white rounded-2xl shadow-xl p-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center border border-gray-100">
                    {[
                        { num: "8+", label: t('stats.experience'), icon: <Award className="w-6 h-6 text-[#cc0022]" /> },
                        { num: `${TRAINING_FIELDS.length}+`, label: t('stats.courses'), icon: <BookOpen className="w-6 h-6 text-[#cc0022]" /> },
                        { num: "20k+", label: t('stats.students'), icon: <Users className="w-6 h-6 text-[#cc0022]" /> },
                        { num: "100%", label: t('stats.quality'), icon: <CheckCircle2 className="w-6 h-6 text-[#cc0022]" /> },
                    ].map((stat, idx) => (
                        <div key={idx} className="flex flex-col items-center">
                            <div className="mb-3 bg-red-50 p-3 rounded-full">{stat.icon}</div>
                            <span className="text-3xl font-black text-[#00008b] mb-1">{stat.num}</span>
                            <span className="text-sm text-gray-500 font-medium uppercase tracking-wide">{stat.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- 3. MAIN CONTENT: DANH SÁCH LĨNH VỰC --- */}
            <div className="container mx-auto px-4 py-24">
                <div className="mb-16 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#00008b' }}>
                        {t('fields.title')}
                    </h2>
                    <div className="w-20 h-1.5 mx-auto rounded-full mb-6" style={{ backgroundColor: '#cc0022' }}></div>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        {t('fields.description')}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {TRAINING_FIELDS.map((item) => {
                        return (
                            <Link
                                key={item.id}
                                href={item.link}
                                aria-label={`Xem chi tiết ${item.title}`}
                                className="group bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-2xl transition-all duration-300 flex flex-col md:flex-row gap-6 items-stretch relative overflow-hidden"
                            >
                                {/* Thanh màu trang trí bên trái khi hover */}
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#cc0022] transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-bottom"></div>

                                {/* Image Area */}
                                <div className="w-full md:w-5/12 h-56 md:h-auto shrink-0 relative overflow-hidden rounded-xl">
                                    <Image
                                        src={item.image}
                                        alt={item.imageAlt}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 360px"
                                        className="object-cover transform transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <span className="bg-white/90 backdrop-blur-sm text-[#00008b] p-3 rounded-full">
                                            <ArrowUpRight size={24} />
                                        </span>
                                    </div>
                                </div>

                                {/* Content Area */}
                                <div className="flex-1 py-1 pr-2 flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="px-2 py-1 rounded bg-blue-50 text-[#00008b] text-[10px] font-bold uppercase tracking-wider">
                                                {item.badge}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold mb-3 transition-colors group-hover:text-[#cc0022]" style={{ color: '#00008b' }}>
                                            {item.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 mb-4">
                                            {item.description}
                                        </p>
                                    </div>

                                    {/* Action Link */}
                                    <span
                                        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider hover:gap-3 transition-all mt-auto group/btn w-fit"
                                        style={{ color: '#cc0022' }}
                                    >
                                        {t('fields.more')}
                                        <ArrowRight size={16} className="transform group-hover/btn:translate-x-1 transition-transform" />
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                <div className="mt-12 rounded-2xl border border-blue-100 bg-white p-6 text-center shadow-sm">
                    <h3 className="text-2xl font-black text-[#00008b]">
                        Cần tư vấn chọn chương trình phù hợp?
                    </h3>
                    <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                        ERG sẽ tư vấn lộ trình theo độ tuổi, nền tảng hiện tại và mục tiêu học tập hoặc chứng chỉ của học viên.
                    </p>
                    <Link
                        href={TRAINING_CONTACT_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-6 inline-flex items-center justify-center rounded-full bg-[#cc0022] px-7 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-lg transition hover:bg-red-700"
                    >
                        Liên hệ nhanh qua Zalo
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </div>
            </div>

            {/* --- 4. WHY CHOOSE ERG --- */}
            <section className="bg-white py-20 border-t border-gray-100">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <div className="text-center px-4">
                            <div className="w-16 h-16 mx-auto bg-blue-50 rounded-2xl flex items-center justify-center text-[#00008b] mb-6">
                                <GraduationCap size={32} />
                            </div>
                            <h3 className="text-lg font-bold mb-3 text-gray-900">{t('why.teachers.title')}</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">{t('why.teachers.desc')}</p>
                        </div>
                        <div className="text-center px-4">
                            <div className="w-16 h-16 mx-auto bg-red-50 rounded-2xl flex items-center justify-center text-[#cc0022] mb-6">
                                <MonitorPlay size={32} />
                            </div>
                            <h3 className="text-lg font-bold mb-3 text-gray-900">{t('why.practice.title')}</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">{t('why.practice.desc')}</p>
                        </div>
                        <div className="text-center px-4">
                            <div className="w-16 h-16 mx-auto bg-yellow-50 rounded-2xl flex items-center justify-center text-yellow-600 mb-6">
                                <Award size={32} />
                            </div>
                            <h3 className="text-lg font-bold mb-3 text-gray-900">{t('why.award.title')}</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">{t('why.award.desc')}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- 5. CTA SECTION --- */}
            <section className="py-20 relative overflow-hidden" style={{ backgroundColor: '#00008b' }}>
                <div className="container mx-auto px-4 text-center relative z-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                        {t('cta.title')}
                    </h2>
                    <p className="text-blue-100 max-w-2xl mx-auto mb-10 text-lg">
                        {t('cta.subtitle')}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href={TRAINING_CONTACT_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block px-8 py-4 bg-[#cc0022] text-white font-bold rounded-full hover:bg-red-700 transition-all shadow-lg hover:shadow-red-900/30 hover:-translate-y-1"
                        >
                            {t('cta.register')}
                        </Link>
                        <Link href="/tuyen-dung" className="inline-block px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold rounded-full hover:bg-white hover:text-[#00008b] transition-all">
                            {t('cta.schedule')}
                        </Link>
                    </div>
                </div>
                {/* Decor circles */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mt-32"></div>
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mb-32"></div>
            </section>

        </main>
    );
}
