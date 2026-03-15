'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import {
    Search, MapPin, DollarSign, Clock,
    ArrowRight, Heart, Zap, GraduationCap, Building,
    ChevronLeft, ChevronRight, CheckCircle2,
    Users, FileText, MonitorPlay, Trophy,
    Flame, Sparkles, Handshake, FileSearch
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { recruitmentApi } from '@/services/recruitment.api';
import { Job } from '@/types/recruitment';
import { JobCard } from '@/components/cards/job-card';
import { useTranslations } from 'next-intl';

export default function RecruitmentContent() {
    const t = useTranslations('recruitment');
    const tp = useTranslations('recruitment.Process');
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [searchInput, setSearchInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const { data, isLoading } = useQuery({
        queryKey: ['public-home-jobs', searchQuery],
        queryFn: () => recruitmentApi.getJobs({ limit: 6, q: searchQuery || undefined }).then(res => res.data)
    });

    const jobs = Array.isArray(data) ? data : (data?.items || []);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 400;
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <main className="min-h-screen bg-white pb-20 font-sans text-slate-800">
            <section className="relative bg-[#00008b] text-white py-24 overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#cc0022]/30 rounded-full -ml-10 -mb-10 blur-3xl"></div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <span className="inline-block py-1 px-4 rounded-full bg-white/10 border border-white/20 text-xs font-bold uppercase tracking-widest text-yellow-400 mb-6 backdrop-blur-sm">
                        {t('Page.badge')}
                    </span>
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
                        {t('Page.heading').split(' ').slice(0, -2).join(' ')} <span className="text-[#cc0022] bg-white px-3 rounded-lg inline-block transform -rotate-2">{t('Page.heading').split(' ').slice(-2).join(' ')}</span>
                    </h1>
                    <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-10 font-light">
                        {t('Page.subheading')}
                    </p>

                    <div className="max-w-2xl mx-auto bg-white p-2 rounded-full shadow-2xl flex items-center transform hover:scale-[1.02] transition-transform duration-300">
                        <Search className="ml-5 text-gray-400 shrink-0" size={24} />
                        <input
                            type="text"
                            placeholder={t('Page.searchPlaceholder')}
                            className="flex-1 px-4 py-4 bg-transparent border-none focus:outline-none text-gray-800 placeholder-gray-400 text-lg"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && setSearchQuery(searchInput)}
                        />
                        <button
                            onClick={() => setSearchQuery(searchInput)}
                            className="bg-[#cc0022] hover:bg-red-700 text-white rounded-full px-10 py-4 font-bold transition-all shrink-0 hidden md:block shadow-lg shadow-red-200"
                        >
                            {t('Page.search')}
                        </button>
                    </div>
                </div>
            </section>

            <section className="py-12 bg-blue-50 border-b border-blue-100">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-blue-200/50">
                        <div>
                            <div className="text-4xl font-black text-[#00008b] mb-1">5+</div>
                            <div className="text-sm text-gray-600 font-medium uppercase tracking-wide">{t('Stats.branches')}</div>
                        </div>
                        <div>
                            <div className="text-4xl font-black text-[#00008b] mb-1">20.000+</div>
                            <div className="text-sm text-gray-600 font-medium uppercase tracking-wide">{t('Stats.students')}</div>
                        </div>
                        <div>
                            <div className="text-4xl font-black text-[#00008b] mb-1">50+</div>
                            <div className="text-sm text-gray-600 font-medium uppercase tracking-wide">{t('Stats.schools')}</div>
                        </div>
                        <div>
                            <div className="text-4xl font-black text-[#00008b] mb-1">100%</div>
                            <div className="text-sm text-gray-600 font-medium uppercase tracking-wide">{t('Stats.teachers')}</div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="container mx-auto px-4 py-20 relative">
                <div className="mb-10">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="w-8 h-1 bg-[#cc0022]"></span>
                        <span className="text-[#cc0022] font-bold text-sm uppercase tracking-wider">{t('Page.title')}</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-[#00008b]">{t('Jobs.title')}</h2>
                </div>

                <div className="relative">
                    <button
                        onClick={() => scroll('left')}
                        className="absolute top-1/2 -translate-y-1/2 -mt-6 -left-4 z-20 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-[#00008b] hover:text-white hover:border-[#00008b] transition-all duration-300 opacity-90 hover:opacity-100 hidden md:flex"
                    >
                        <ChevronLeft size={24} />
                    </button>

                    <button
                        onClick={() => scroll('right')}
                        className="absolute top-1/2 -translate-y-1/2 -mt-6 -right-4 z-20 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-[#00008b] hover:text-white hover:border-[#00008b] transition-all duration-300 opacity-90 hover:opacity-100 hidden md:flex"
                    >
                        <ChevronRight size={24} />
                    </button>

                    <div ref={scrollContainerRef} className={`flex overflow-x-auto gap-6 pb-12 snap-x snap-mandatory scroll-smooth no-scrollbar p-2 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
                        {isLoading ? (
                            Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="min-w-[320px] md:min-w-[400px] bg-gray-100 animate-pulse rounded-2xl h-64 snap-start"></div>
                            ))
                        ) : jobs.length > 0 ? jobs.map((job) => (
                            <JobCard key={job.id} {...job} className="min-w-[320px] md:min-w-[400px] snap-start h-[290px]" />
                        )) : (
                            <div className="w-full text-center py-12 text-gray-500">{t('Page.noJobs')}</div>
                        )}

                        <div className="min-w-[200px] flex items-center justify-center snap-start">
                            <Link href="/tuyen-dung" className="group flex flex-col items-center text-gray-400 hover:text-[#cc0022] transition-colors">
                                <div className="w-20 h-20 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center mb-4 group-hover:border-[#cc0022] transition-colors bg-gray-50 hover:bg-white">
                                    <ArrowRight size={32} />
                                </div>
                                <span className="font-bold text-lg">{t('Buttons.viewAll', { ns: 'common' })}</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-gray-50 py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <span className="text-[#cc0022] font-bold text-sm uppercase tracking-wider">{tp('subtitle')}</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-[#00008b] mt-2">{tp('title')}</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-y-12 gap-x-8">
                        {([
                            { icon: <FileText size={28} />, key: 'apply' },
                            { icon: <FileSearch size={28} />, key: 'screen' },
                            { icon: <MonitorPlay size={28} />, key: 'test' },
                            { icon: <Users size={28} />, key: 'interview' },
                            { icon: <Handshake size={28} />, key: 'offer' },
                            { icon: <CheckCircle2 size={28} />, key: 'onboard' },
                        ] as const).map((item, i) => (
                            <div key={i} className="flex gap-4 p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all group">
                                <div className="shrink-0">
                                    <div className="w-14 h-14 bg-blue-50 text-[#00008b] rounded-full flex items-center justify-center group-hover:bg-[#cc0022] group-hover:text-white transition-colors">
                                        {item.icon}
                                    </div>
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-[#cc0022] uppercase mb-1 block">{tp(`steps.${item.key}.title` as any)}</span>
                                    <p className="text-sm text-gray-500 leading-relaxed">{tp(`steps.${item.key}.desc` as any)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-white py-20">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row gap-16 items-center">
                        <div className="w-full md:w-1/2">
                            <div className="relative">
                                <div className="grid grid-cols-2 gap-4 items-center">
                                    <div className="h-64 rounded-2xl w-full overflow-hidden shadow-lg transform translate-y-8">
                                        <img
                                            src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                                            alt="Lớp học ERG"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="h-64 rounded-2xl w-full overflow-hidden shadow-lg transform -translate-y-8">
                                        <img
                                            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                                            alt="Team ERG"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                                <div className="absolute top-1/2 left-1/2 z-20 w-max -translate-x-1/2 -translate-y-1/2">
                                    <div className="bg-white p-6 rounded-2xl shadow-2xl border border-gray-100 text-center">
                                        <Trophy className="w-10 h-10 text-yellow-500 mx-auto mb-2" />
                                        <div className="font-bold text-gray-800">Top Employer</div>
                                        <div className="text-xs text-gray-500">In Education Tech</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="w-full md:w-1/2">
                            <span className="text-[#cc0022] font-bold text-sm uppercase tracking-wider">{t('Why.subtitle')}</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-[#00008b] mt-2 mb-6">{t('Why.title')}</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {(
                                    [
                                        { icon: <Heart className="text-[#cc0022]" />, key: 'welfare' },
                                        { icon: <GraduationCap className="text-blue-500" />, key: 'training' },
                                        { icon: <Zap className="text-yellow-500" />, key: 'culture' },
                                        { icon: <Building className="text-green-500" />, key: 'facilities' },
                                    ] as const
                                ).map((item, i) => (
                                    <div key={i} className="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                                        <div className="w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center shrink-0 text-xl">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-800">{t(`Why.benefits.${item.key}.title` as any)}</h4>
                                            <p className="text-sm text-gray-500 mt-1">{t(`Why.benefits.${item.key}.sub` as any)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 mt-8 mb-12">
                <div className="bg-[#00008b] rounded-3xl p-10 md:p-20 text-center text-white relative overflow-hidden group">
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">{t('CTA.title')}</h2>
                        <p className="text-blue-100 mb-10 text-lg">
                            {t('CTA.subtitle')}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="#" className="inline-block bg-[#cc0022] px-10 py-4 rounded-full font-bold text-lg hover:bg-red-700 hover:shadow-lg hover:shadow-red-900/50 transition-all">
                                {t('CTA.sendCV')}
                            </Link>
                            <Link href="#" className="inline-block bg-white/10 backdrop-blur-md border border-white/20 px-10 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-[#00008b] transition-all">
                                {t('CTA.zaloHR')}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <style jsx>{`
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
        </main>
    );
}
