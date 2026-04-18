'use client';

import React from 'react';
import Link from 'next/link';
import {
    Globe, GraduationCap, Trophy,
    Sparkles, ArrowRight, ShieldCheck,
    Handshake
} from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function AboutRecruitmentContent() {
    const t = useTranslations('recruitment.About');
    const tr = useTranslations('recruitment');

    return (
        <main className="min-h-screen bg-white pb-20 font-sans text-slate-800 pt-[70px] lg:pt-[135px]">

            {/* --- 1. HERO: EMPLOYER BRAND STORY --- */}
            <section className="relative py-28 bg-[#00008b] text-white overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <img
                        src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
                        alt="ERG Team"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent"></div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <span className="inline-block py-1 px-4 rounded-full bg-[#cc0022] text-white text-xs font-bold uppercase tracking-widest mb-6 shadow-lg shadow-red-900/20">
                        {tr('Page.badge')}
                    </span>
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-8 leading-tight tracking-tight">
                        {t('title')}
                    </h1>
                    <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto font-light leading-relaxed">
                        {t('description')}
                    </p>
                </div>
            </section>

            {/* --- 2. THE VISION SECTION --- */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row gap-20 items-center">
                        <div className="w-full lg:w-1/2 order-2 lg:order-1">
                            <div className="relative">
                                <div className="rounded-[40px] overflow-hidden shadow-2xl border-8 border-gray-50">
                                    <img
                                        src="https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                                        alt="Education Vision"
                                        className="w-full h-auto"
                                    />
                                </div>
                                <div className="absolute -bottom-10 -right-10 bg-[#cc0022] text-white p-10 rounded-[30px] shadow-2xl hidden md:block max-w-xs">
                                    <Sparkles size={40} className="mb-4 text-yellow-400" />
                                    <h3 className="text-xl font-bold mb-2">{t('vision.title')}</h3>
                                    <p className="text-sm opacity-90 leading-relaxed font-light">{t('vision.desc')}</p>
                                </div>
                            </div>
                        </div>

                        <div className="w-full lg:w-1/2 order-1 lg:order-2">
                             <span className="text-[#cc0022] font-black text-sm uppercase tracking-[0.2em] mb-4 block">
                                {t('missionTitle')}
                            </span>
                            <h2 className="text-3xl md:text-5xl font-extrabold text-[#00008b] mb-8 leading-tight">
                                {t('missionSub')}
                            </h2>
                            <p className="text-lg text-gray-600 leading-relaxed text-justify mb-10">
                                {t('description')}
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="flex gap-4">
                                    <div className="shrink-0 text-[#00008b]"><Globe size={32} /></div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-1">Mạng lưới Rộng khắp</h4>
                                        <p className="text-sm text-gray-500">Hơn 50 đối tác trường học trên toàn quốc.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="shrink-0 text-[#cc0022]"><Trophy size={32} /></div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-1">Chất lượng Quốc tế</h4>
                                        <p className="text-sm text-gray-500">Chuẩn IC3, MOS hàng đầu thế giới.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- 3. CORE PILLARS (LINKS TO SUBPAGES) --- */}
            <section className="py-24 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16 max-w-2xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-[#00008b] mb-6">{t('pillarsTitle')}</h2>
                        <div className="w-20 h-1.5 bg-[#cc0022] mx-auto rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Box 1: Văn hóa */}
                        <Link href="/van-hoa" className="group bg-white p-10 rounded-[40px] shadow-sm hover:shadow-2xl transition-all duration-500 border border-transparent hover:border-blue-100 flex flex-col h-full">
                            <div className="w-16 h-16 bg-blue-50 text-[#00008b] rounded-[20px] flex items-center justify-center mb-8 group-hover:bg-[#00008b] group-hover:text-white transition-all transform group-hover:rotate-12">
                                <Handshake size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">{t('pillarsCulture')}</h3>
                            <p className="text-gray-500 leading-relaxed mb-8 flex-1">
                                Khám phá 5 giá trị cốt lõi và môi trường làm việc cởi mở, sáng tạo tại Edurise Global.
                            </p>
                            <span className="flex items-center gap-2 text-[#00008b] font-bold group-hover:gap-4 transition-all">
                                Xem chi tiết <ArrowRight size={20} />
                            </span>
                        </Link>

                        {/* Box 2: Chính sách */}
                        <Link href="/chinh-sach" className="group bg-white p-10 rounded-[40px] shadow-sm hover:shadow-2xl transition-all duration-500 border border-transparent hover:border-red-100 flex flex-col h-full">
                            <div className="w-16 h-16 bg-red-50 text-[#cc0022] rounded-[20px] flex items-center justify-center mb-8 group-hover:bg-[#cc0022] group-hover:text-white transition-all transform group-hover:-rotate-12">
                                <ShieldCheck size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">{t('pillarsPolicy')}</h3>
                            <p className="text-gray-500 leading-relaxed mb-8 flex-1">
                                Chế độ đãi ngộ cạnh tranh, bảo hiểm toàn diện và môi trường làm việc hiện đại.
                            </p>
                            <span className="flex items-center gap-2 text-[#cc0022] font-bold group-hover:gap-4 transition-all">
                                Xem chi tiết <ArrowRight size={20} />
                            </span>
                        </Link>

                        {/* Box 3: Đào tạo */}
                        <Link href="/chinh-sach#dao-tao" className="group bg-white p-10 rounded-[40px] shadow-sm hover:shadow-2xl transition-all duration-500 border border-transparent hover:border-blue-100 flex flex-col h-full">
                            <div className="w-16 h-16 bg-blue-50 text-[#00008b] rounded-[20px] flex items-center justify-center mb-8 group-hover:bg-[#00008b] group-hover:text-white transition-all transform group-hover:scale-110">
                                <GraduationCap size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">{t('pillarsTraining')}</h3>
                            <p className="text-gray-500 leading-relaxed mb-8 flex-1">
                                Lộ trình sự nghiệp rõ ràng và các khóa đào tạo nâng cao năng lực chuyên môn quốc tế.
                            </p>
                            <span className="flex items-center gap-2 text-[#00008b] font-bold group-hover:gap-4 transition-all">
                                Xem chi tiết <ArrowRight size={20} />
                            </span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* --- 4. CTA: THE CALL TO ACTION --- */}
            <section className="py-24 bg-white text-center">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto bg-[#00008b] p-12 md:p-20 rounded-[50px] shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-[#00008b] to-[#cc0022] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-5xl font-black text-white mb-8">{tr('CTA.title')}</h2>
                            <p className="text-xl text-blue-100 mb-12 font-light">
                                "{tr('CTA.subtitle')}"
                            </p>
                            <div className="flex flex-col sm:flex-row gap-6 justify-center">
                                <Link
                                    href="/tuyen-dung"
                                    className="bg-white text-[#00008b] px-12 py-5 rounded-full font-black text-lg hover:bg-yellow-400 hover:text-[#00008b] transition-all shadow-xl transform hover:-translate-y-1"
                                >
                                    Khám phá vị trí trống
                                </Link>
                                <a
                                    href="https://tuyendung.erg.edu.vn"
                                    className="bg-transparent border-2 border-white/30 text-white px-12 py-5 rounded-full font-black text-lg hover:bg-white/10 transition-all backdrop-blur-md"
                                >
                                    Gửi ngay hồ sơ CV
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </main>
    );
}
