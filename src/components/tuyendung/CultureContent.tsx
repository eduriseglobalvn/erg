'use client';

import React from 'react';
import {
    Heart, Users, Quote, Globe, Star, Lightbulb, CheckCircle2
} from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

export default function CultureContent() {
    const t = useTranslations('recruitment.Culture');

    const CORE_VALUES = [
        {
            id: 1,
            num: "01",
            title: t('values.responsibility.title'),
            desc: t('values.responsibility.desc'),
            icon: <Globe size={32} />,
            color: "blue"
        },
        {
            id: 2,
            num: "02",
            title: t('values.quality.title'),
            desc: t('values.quality.desc'),
            icon: <Star size={32} />,
            color: "red"
        },
        {
            id: 3,
            num: "03",
            title: t('values.cooperation.title'),
            desc: t('values.cooperation.desc'),
            icon: <Users size={32} />,
            color: "blue"
        },
        {
            id: 4,
            num: "04",
            title: t('values.customer.title'),
            desc: t('values.customer.desc'),
            icon: <Heart size={32} />,
            color: "red"
        },
        {
            id: 5,
            num: "05",
            title: t('values.innovation.title'),
            desc: t('values.innovation.desc'),
            icon: <Lightbulb size={32} />,
            color: "blue"
        }
    ];

    return (
        <main className="min-h-screen bg-white font-sans text-slate-900 antialiased selection:bg-blue-100 pt-[70px] lg:pt-[135px]">
            <section className="relative bg-[#00008b] text-white py-24 overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#cc0022]/20 rounded-full -ml-10 -mb-10 blur-3xl"></div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <span className="inline-block py-1 px-4 rounded-full bg-white/10 border border-white/20 text-xs font-bold uppercase tracking-widest text-yellow-400 mb-6 backdrop-blur-sm">
                        {t('badge')}
                    </span>
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
                        {t('heading').split(' ')[0]} <span className="text-[#cc0022] bg-white px-3 rounded-lg inline-block transform -rotate-2">{t('heading').split(' ').slice(1).join(' ')}</span>
                    </h1>
                    <p className="text-xl text-white/90 max-w-3xl mx-auto font-normal leading-relaxed">
                        "{t('description')}"
                    </p>
                </div>
            </section>

            <section className="py-24 bg-gray-50/50 relative">
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#00008b 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-16">
                        <span className="text-[#cc0022] font-bold text-sm uppercase tracking-widest">{t('subtitle')}</span>
                        <h2 className="text-3xl md:text-5xl font-extrabold text-[#00008b] mt-3 tracking-tight">{t('values.title')}</h2>
                        <div className="w-20 h-1.5 bg-[#cc0022] mx-auto mt-6 rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {CORE_VALUES.map((item) => {
                            const isBlue = item.color === 'blue';
                            return (
                                <div
                                    key={item.id}
                                    className="group relative bg-white rounded-3xl p-8 shadow-sm hover:shadow-2xl border border-gray-100 transition-all duration-500 hover:-translate-y-2 overflow-hidden flex flex-col"
                                >
                                    <div className={`absolute top-0 left-0 w-full h-1.5 ${isBlue ? 'bg-[#00008b]' : 'bg-[#cc0022]'}`}></div>
                                    <div className={`absolute -right-4 -bottom-10 text-[10rem] font-black leading-none opacity-[0.04] select-none transition-transform duration-500 group-hover:scale-110 group-hover:opacity-[0.08] ${isBlue ? 'text-[#00008b]' : 'text-[#cc0022]'}`}>
                                        {item.num}
                                    </div>

                                    <div className="flex items-center gap-5 mb-6">
                                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg transform transition-transform duration-500 group-hover:rotate-6
                                    ${isBlue ? 'bg-gradient-to-br from-blue-900 to-blue-600' : 'bg-gradient-to-br from-red-600 to-orange-500'}`}
                                        >
                                            {item.icon}
                                        </div>
                                        <h3 className={`text-xl font-bold uppercase tracking-tight ${isBlue ? 'text-[#00008b]' : 'text-[#cc0022]'}`}>
                                            {item.title}
                                        </h3>
                                    </div>
                                    <p className="text-slate-600 leading-relaxed text-justify relative z-10 flex-1 font-medium md:font-normal">
                                        {item.desc}
                                    </p>
                                    <div className={`w-12 h-1 mt-6 rounded-full transition-all duration-500 group-hover:w-full ${isBlue ? 'bg-blue-100 group-hover:bg-[#00008b]' : 'bg-red-100 group-hover:bg-[#cc0022]'}`}></div>
                                </div>
                            );
                        })}

                        <div className="bg-[#00008b] rounded-3xl p-8 text-white flex flex-col justify-center items-center text-center shadow-xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-[#cc0022] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                            <div className="relative z-10">
                                <CheckCircle2 size={48} className="mb-4 mx-auto text-yellow-400" />
                                <h3 className="text-xl font-bold uppercase mb-2 tracking-tight">{t('values.title')}</h3>
                                <p className="text-blue-50 text-sm font-normal">{t('commitment')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="relative rounded-3xl overflow-hidden bg-[#00008b] text-white shadow-2xl">
                        <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
                            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
                            </svg>
                        </div>

                        <div className="flex flex-col md:flex-row items-center">
                            <div className="w-full md:w-3/5 p-10 md:p-16 relative z-10">
                                <Quote size={60} className="text-[#cc0022] mb-6 opacity-90" />
                                <h3 className="text-2xl md:text-3xl font-medium italic leading-relaxed mb-8 text-white/95 text-justify">
                                    "{t('quote')}"
                                </h3>
                                <div className="flex items-center gap-4">
                                    <div className="h-1 w-12 bg-[#cc0022]"></div>
                                    <div>
                                        <h4 className="font-bold text-xl uppercase tracking-wide">{t('director')}</h4>
                                        <p className="text-blue-100 text-sm">{t('position')}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full md:w-2/5 h-64 md:h-full min-h-[400px] relative">
                                <Image
                                    src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                    alt="Ban lãnh đạo ERG"
                                    fill
                                    sizes="(max-width: 768px) 100vw, 40vw"
                                    className="object-cover opacity-90 mix-blend-overlay md:mix-blend-normal"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-transparent to-[#00008b]"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24 container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-[#00008b] tracking-tight">{t('life.title')}</h2>
                    <p className="text-slate-500 mt-4 max-w-2xl mx-auto font-medium md:font-normal">
                        {t('life.sub')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-auto md:h-[600px] min-h-[600px]">
                    <div className="md:col-span-2 md:row-span-2 rounded-2xl overflow-hidden relative group shadow-lg cursor-pointer min-h-[300px] md:min-h-0">
                        <Image src="https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt={t('life.stem')} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute bottom-6 left-6 text-white z-10"><h3 className="text-xl font-bold drop-shadow-lg">{t('life.stem')}</h3></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    </div>
                    <div className="md:col-span-1 md:row-span-1 rounded-2xl overflow-hidden relative group shadow-lg cursor-pointer min-h-[250px] md:min-h-0">
                        <Image src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt={t('life.training')} fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute bottom-4 left-4 text-white z-10"><h3 className="font-bold text-sm drop-shadow-lg">{t('life.training')}</h3></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    </div>
                    <div className="md:col-span-1 md:row-span-1 rounded-2xl overflow-hidden relative group shadow-lg cursor-pointer min-h-[250px] md:min-h-0">
                        <Image src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt={t('life.teambuilding')} fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute bottom-4 left-4 text-white z-10"><h3 className="font-bold text-sm drop-shadow-lg">{t('life.teambuilding')}</h3></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    </div>
                    <div className="md:col-span-2 md:row-span-1 rounded-2xl overflow-hidden relative group shadow-lg cursor-pointer min-h-[250px] md:min-h-0">
                        <Image src="https://images.unsplash.com/photo-1544531586-fde5298cdd40?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt={t('life.workshop')} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute bottom-4 left-4 text-white z-10"><h3 className="font-bold text-lg drop-shadow-lg">{t('life.workshop')}</h3></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    </div>
                </div>
            </section>
        </main>
    );
}
