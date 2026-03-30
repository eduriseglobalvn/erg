'use client';

import React from 'react';
import {
    Briefcase, Award, ShieldCheck, GraduationCap,
    TrendingUp, Coffee, Clock, DollarSign
} from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function HRPolicyContent() {
    const t = useTranslations('recruitment.HRPolicy');

    return (
        <main className="min-h-screen bg-gray-50 font-sans text-slate-800 pt-[70px] lg:pt-[135px]">

            {/* --- HERO SECTION --- */}
            <section className="bg-white py-24 border-b border-gray-200">
                <div className="container mx-auto px-4 text-center">
                    <span className="inline-block py-1 px-3 rounded-full bg-blue-50 text-[#00008b] text-xs font-bold uppercase tracking-wider mb-4">
                        {t('badge')}
                    </span>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-[#00008b] mb-6">
                        {t('title')}
                    </h1>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                        {t('description')}
                    </p>
                </div>
            </section>

            {/* --- PHÚC LỢI TOÀN DIỆN --- */}
            <section className="py-16 container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Income */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-200 transition-all">
                        <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center text-green-600 mb-6">
                            <DollarSign size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">{t('income.title')}</h3>
                        <ul className="space-y-3 text-gray-600 text-sm">
                            {(t.raw('income.list') as string[]).map((item, i) => (
                                <li key={i} className="flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Security */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-200 transition-all">
                        <div className="w-14 h-14 bg-red-50 rounded-xl flex items-center justify-center text-[#cc0022] mb-6">
                            <ShieldCheck size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">{t('security.title')}</h3>
                        <ul className="space-y-3 text-gray-600 text-sm">
                            {(t.raw('security.list') as string[]).map((item, i) => (
                                <li key={i} className="flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 bg-[#cc0022] rounded-full mt-2"></span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Environment */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-200 transition-all">
                        <div className="w-14 h-14 bg-yellow-50 rounded-xl flex items-center justify-center text-yellow-600 mb-6">
                            <Coffee size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">{t('environment.title')}</h3>
                        <ul className="space-y-3 text-gray-600 text-sm">
                            {(t.raw('environment.list') as string[]).map((item, i) => (
                                <li key={i} className="flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2"></span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* --- ĐÀO TẠO & PHÁT TRIỂN --- */}
            <section id="dao-tao" className="bg-[#00008b] text-white py-20">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <div className="w-full md:w-1/2">
                            <h2 className="text-3xl font-bold mb-6">{t('training.title')}</h2>
                            <p className="text-blue-100 mb-8 leading-relaxed">
                                {t('training.desc')}
                            </p>

                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="shrink-0 bg-white/10 p-3 rounded-lg">
                                        <GraduationCap size={24} className="text-yellow-400"/>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">{t('training.programs.professional.title')}</h4>
                                        <p className="text-sm text-blue-200 mt-1">{t('training.programs.professional.desc')}</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="shrink-0 bg-white/10 p-3 rounded-lg">
                                        <Award size={24} className="text-yellow-400"/>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">{t('training.programs.tech.title')}</h4>
                                        <p className="text-sm text-blue-200 mt-1">{t('training.programs.tech.desc')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="w-full md:w-1/2 bg-white/5 rounded-2xl p-8 border border-white/10">
                            <h3 className="text-xl font-bold mb-6 text-center border-b border-white/10 pb-4">{t('careerPath.title')}</h3>

                            <div className="space-y-8 relative">
                                <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-white/20"></div>

                                {/* Step 1 */}
                                <div className="flex items-center gap-6 relative z-10">
                                    <div className="w-10 h-10 rounded-full bg-[#cc0022] flex items-center justify-center font-bold text-sm">01</div>
                                    <div className="bg-white text-[#00008b] p-4 rounded-lg flex-1 shadow-lg">
                                        <h5 className="font-bold">{t('careerPath.step1.title')}</h5>
                                        <p className="text-xs text-gray-500">{t('careerPath.step1.sub')}</p>
                                    </div>
                                </div>

                                {/* Step 2 */}
                                <div className="flex items-center gap-6 relative z-10">
                                    <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center font-bold text-sm">02</div>
                                    <div className="bg-white/90 text-[#00008b] p-4 rounded-lg flex-1">
                                        <h5 className="font-bold">{t('careerPath.step2.title')}</h5>
                                        <p className="text-xs text-gray-500">{t('careerPath.step2.sub')}</p>
                                    </div>
                                </div>

                                {/* Step 3 */}
                                <div className="flex items-center gap-6 relative z-10">
                                    <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center font-bold text-sm text-[#00008b]">03</div>
                                    <div className="bg-white/80 text-[#00008b] p-4 rounded-lg flex-1">
                                        <h5 className="font-bold">{t('careerPath.step3.title')}</h5>
                                        <p className="text-xs text-gray-500">{t('careerPath.step3.sub')}</p>
                                    </div>
                                </div>
                                {/* Step 4 */}
                                <div className="flex items-center gap-6 relative z-10">
                                    <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center font-bold text-sm">04</div>
                                    <div className="bg-white/70 text-[#00008b] p-4 rounded-lg flex-1">
                                        <h5 className="font-bold">{t('careerPath.step4.title')}</h5>
                                        <p className="text-xs text-gray-500">{t('careerPath.step4.sub')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- QUY ĐỊNH CHUNG --- */}
            <section className="py-16 container mx-auto px-4">
                <div className="bg-white border-l-4 border-[#00008b] p-8 rounded-r-xl shadow-sm">
                    <h2 className="text-2xl font-bold text-[#00008b] mb-4">{t('regulations.title')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-600">
                        <ul className="list-disc list-inside space-y-2">
                            {(t.raw('regulations.list') as string[]).slice(0, 3).map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>
                        <ul className="list-disc list-inside space-y-2">
                            {(t.raw('regulations.list') as string[]).slice(3).map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

        </main>
    );
}
