'use client';

import React, { useState } from 'react';
import { 
    GraduationCap, BookOpen, Monitor, Award, School, 
    Building2, Clock, CheckCircle2, Star 
} from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function RoadmapSection() {
    const t = useTranslations('roadmap');
    const [activeTab, setActiveTab] = useState<'school' | 'center'>('school');

    // 1. Get localized data arrays from JSON
    const schoolStepsData = t.raw('schoolSteps');
    const centerStepsData = t.raw('centerSteps');

    // 2. Map icons and colors to the localized data
    const schoolSteps = [
        { ...schoolStepsData[0], icon: <BookOpen className="w-6 h-6" />, color: 'border-blue-200 bg-blue-50 text-blue-700', iconBg: 'bg-blue-100' },
        { ...schoolStepsData[1], icon: <Monitor className="w-6 h-6" />, color: 'border-teal-200 bg-teal-50 text-teal-700', iconBg: 'bg-teal-100' },
        { ...schoolStepsData[2], icon: <Award className="w-6 h-6" />, color: 'border-orange-200 bg-orange-50 text-orange-700', iconBg: 'bg-orange-100' },
        { ...schoolStepsData[3], icon: <GraduationCap className="w-6 h-6" />, color: 'border-indigo-200 bg-indigo-50 text-indigo-700', iconBg: 'bg-indigo-100' }
    ];

    const centerSteps = [
        { ...centerStepsData[0], icon: <Star className="w-6 h-6 text-yellow-500" fill="currentColor" />, color: 'border-blue-200 bg-white' },
        { ...centerStepsData[1], icon: <Monitor className="w-6 h-6 text-teal-600" />, color: 'border-teal-200 bg-white' },
        { ...centerStepsData[2], icon: <Award className="w-6 h-6 text-orange-600" />, color: 'border-orange-200 bg-white' },
        { ...centerStepsData[3], icon: <GraduationCap className="w-6 h-6 text-indigo-600" />, color: 'border-indigo-200 bg-white' }
    ];

    const data = activeTab === 'school' ? schoolSteps : centerSteps;

    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">

                {/* HEADLINE */}
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-[var(--erg-blue)] mb-4 uppercase">
                        {t('title')}
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        {t('description')}
                    </p>
                </div>

                {/* TAB SWITCHER */}
                <div className="flex justify-center mb-12">
                    <div className="bg-white p-1.5 rounded-full shadow-md border border-gray-100 inline-flex">
                        <button
                            onClick={() => setActiveTab('school')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all duration-300 ${
                                activeTab === 'school'
                                    ? 'bg-[var(--erg-blue)] text-white shadow-lg'
                                    : 'text-gray-500 hover:bg-gray-100'
                            }`}
                        >
                            <School size={18} />
                            {t('tabs.school')}
                        </button>
                        <button
                            onClick={() => setActiveTab('center')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all duration-300 ${
                                activeTab === 'center'
                                    ? 'bg-[var(--erg-red)] text-white shadow-lg'
                                    : 'text-gray-500 hover:bg-gray-100'
                            }`}
                        >
                            <Building2 size={18} />
                            {t('tabs.center')}
                        </button>
                    </div>
                </div>

                {/* CONTENT GRID */}
                <div className="relative">
                    {/* Connecting Line (Only visible for School Timeline) */}
                    {activeTab === 'school' && (
                        <div className="hidden lg:block absolute top-[3.5rem] left-0 w-full h-1 bg-gray-200 z-0"></div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                        {data.map((step: any, index: number) => (
                            <div key={index} className="flex flex-col h-full group animate-in fade-in slide-in-from-bottom-4 duration-500" style={{animationDelay: `${index * 100}ms`}}>

                                {/* Step Header */}
                                <div className={`
                                    flex flex-col items-center text-center p-6 rounded-t-2xl border-b bg-white shadow-sm transition-transform hover:-translate-y-1 relative overflow-hidden
                                    ${activeTab === 'center' ? 'border-t-4 border-t-[var(--erg-red)]' : step.color}
                                `}>
                                    {/* Badge cho Center Track */}
                                    {activeTab === 'center' && step.tag && (
                                        <div className="absolute top-3 right-3 bg-red-50 text-[var(--erg-red)] text-[10px] font-bold px-2 py-1 rounded border border-red-100 flex items-center gap-1">
                                            <Clock size={10} /> {step.tag}
                                        </div>
                                    )}

                                    <div className={`p-3 rounded-full mb-3 ${activeTab === 'school' ? step.iconBg : 'bg-gray-50'}`}>
                                        {step.icon}
                                    </div>
                                    <h3 className="font-bold text-lg uppercase text-gray-800">{step.level}</h3>
                                    <span className="text-xs text-gray-500 font-medium mt-1">{step.sub}</span>
                                </div>

                                {/* Step Body */}
                                <div className="flex-1 bg-white p-6 rounded-b-2xl shadow-md border-x border-b border-gray-100 hover:shadow-lg transition-shadow">
                                    <div className="space-y-5">
                                        {step.certs.map((cert: any, idx: number) => (
                                            <div key={idx} className="relative pl-3">
                                                <div className="flex items-start gap-2">
                                                    <CheckCircle2 size={16} className={`mt-0.5 flex-shrink-0 ${activeTab === 'center' ? 'text-[var(--erg-red)]' : 'text-green-500'}`}/>
                                                    <div>
                                                        <h4 className="font-bold text-gray-800 text-sm leading-snug">{cert.name}</h4>
                                                        <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">{cert.desc}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Button CTA cho Center Track */}
                                    {activeTab === 'center' && (
                                        <button className="w-full mt-6 py-2 bg-gray-50 text-[var(--erg-blue)] text-xs font-bold uppercase rounded border border-gray-200 hover:bg-[var(--erg-blue)] hover:text-white transition-colors">
                                            {t('register')}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Note footer */}
                <div className="mt-10 text-center">
                    <p className="text-sm text-gray-500 italic">
                        {t('note', { type: activeTab })}
                    </p>
                </div>
            </div>
        </section>
    );
}