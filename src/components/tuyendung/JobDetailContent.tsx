'use client';

import React from 'react';
import {
    MapPin,
    DollarSign,
    Users,
    Clock,
    Calendar,
    Building2,
    CheckCircle2,
    AlertCircle,
    Info,
    ArrowLeft,
    MessageCircle
} from 'lucide-react';
import Link from 'next/link';
import { Job } from '@/types/recruitment';
import { EmployerInfo } from '@/mocks/types';
import { useTranslations } from 'next-intl';

// --- COMPONENT CON: INFO ITEM ---
const InfoItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) => (
    <div className="flex flex-col mb-4 md:mb-0">
        <div className="flex items-center text-gray-500 mb-1">
            <span className="mr-2 text-gray-400">{icon}</span>
            <span className="text-sm font-medium">{label}</span>
        </div>
        <span className="text-gray-900 font-semibold pl-8 md:pl-0 block text-sm md:text-base">{String(value)}</span>
    </div>
);

interface JobDetailContentProps {
    job: Job;
    employer: EmployerInfo;
}

const JobDetailContent = ({ job, employer }: JobDetailContentProps) => {
    const t = useTranslations('recruitment.Detail');
    return (
        <div className="bg-gray-50 min-h-screen font-sans pb-20">

            {/* Header Background */}
            <div className="bg-[#00008b] h-64 w-full absolute top-0 left-0 z-0"></div>

            <div className="container mx-auto px-4 max-w-6xl relative z-10 pt-32">

                {/* Breadcrumb / Back button */}
                <div className="mb-6">
                    <Link href="/tuyen-dung" className="text-blue-100 hover:text-white flex items-center gap-2 text-sm font-medium transition-colors w-fit">
                        <ArrowLeft size={16} /> {t('back')}
                    </Link>
                </div>

                {/* HEADER DẠNG CARD */}
                <div className="bg-white rounded-xl shadow-lg border-b-4 border-[#cc0022] p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                    <div className="flex-1">
                        <h1 className="text-2xl md:text-3xl font-extrabold text-[#00008b] uppercase leading-tight">
                            {job.title}
                        </h1>
                        <div className="flex flex-wrap items-center text-gray-500 text-sm mt-4 gap-y-2">
                            <span className="flex items-center mr-6">
                                <MapPin size={18} className="mr-1.5 text-[#cc0022]" />
                                {job.location}
                            </span>
                            <span className="flex items-center">
                                <Clock size={18} className="mr-1.5 text-blue-500" />
                                {job.workSchedule || job.workType}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 w-fit ml-auto">
                        <Link
                            href={`/tuyen-dung/${job.slug}/ung-tuyen`}
                            className="bg-[#cc0022] hover:bg-red-700 text-white font-bold py-2 px-6 rounded-xl shadow-lg shadow-red-900/10 transition-all whitespace-nowrap flex items-center justify-center transform hover:scale-105 cursor-pointer text-sm"
                        >
                            <CheckCircle2 className="mr-2 w-4 h-4" />
                            {t('applyNow')}
                        </Link>
                        <a
                            href="http://zalo.me/0967689259"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white font-bold py-2 px-6 rounded-xl shadow-lg shadow-blue-900/10 transition-all whitespace-nowrap flex items-center justify-center transform hover:scale-105 cursor-pointer text-sm"
                            style={{ backgroundColor: '#0068ff' }}
                        >
                            <MessageCircle className="mr-2 w-4 h-4 text-white" />
                            <span className="text-white">{t('applyZalo')}</span>
                        </a>
                    </div>
                </div>

                {/* BODY CONTENT */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* === CỘT TRÁI (NỘI DUNG CHÍNH) === */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Box 1: Thông tin tóm tắt */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                            <h3 className="text-lg font-bold text-[#00008b] mb-6 border-l-4 border-[#00008b] pl-3">
                                {t('generalInfo')}
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-4">
                                <InfoItem icon={<Building2 size={20} />} label={t('unit')} value={employer.name} />
                                <InfoItem icon={<Users size={20} />} label={t('quantity')} value={job.quantity} />
                                <InfoItem icon={<Clock size={20} />} label={t('workType')} value={job.workType} />
                                <InfoItem icon={<DollarSign size={20} />} label={t('salary')} value={job.salary} />
                                <InfoItem icon={<MapPin size={20} />} label={t('location')} value={job.location} />
                                <InfoItem icon={<Calendar size={20} />} label={t('deadline')} value={job.deadline} />
                                {job.postDate && <InfoItem icon={<CheckCircle2 size={20} />} label={t('postDate')} value={job.postDate} />}
                            </div>
                        </div>

                        {/* Box 2: Chi tiết công việc */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                            <h3 className="text-lg font-bold text-[#00008b] mb-8 border-b pb-4 uppercase tracking-wider">
                                {t('jobDetail')}
                            </h3>

                            <div className="space-y-10">
                                <div>
                                    <h4 className="font-bold text-gray-800 mb-4 text-lg flex items-center">
                                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mr-3 text-[#00008b]">1</div>
                                        {t('description')}
                                    </h4>
                                    <ul className="list-disc list-outside space-y-2 text-gray-600 pl-6 leading-relaxed">
                                        {(job.description || []).map((item, idx) => (
                                            <li key={idx}>{item}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="font-bold text-gray-800 mb-4 text-lg flex items-center">
                                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mr-3 text-[#00008b]">2</div>
                                        {t('requirements')}
                                    </h4>
                                    <ul className="list-disc list-outside space-y-2 text-gray-600 pl-6 leading-relaxed">
                                        {job.requirements.map((item, idx) => (
                                            <li key={idx}>{item}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="font-bold text-gray-800 mb-4 text-lg flex items-center">
                                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mr-3 text-[#00008b]">3</div>
                                        {t('benefits')}
                                    </h4>
                                    <ul className="list-disc list-outside space-y-2 text-gray-600 pl-6 leading-relaxed">
                                        {job.benefits.map((item, idx) => (
                                            <li key={idx}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* === CỘT PHẢI (SIDEBAR) === */}
                    <div className="lg:col-span-1 space-y-8">

                        {/* Box 1: Nơi làm việc */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-4">
                            <h3 className="text-lg font-bold text-[#00008b] mb-4 flex items-center">
                                <MapPin className="mr-2 text-[#cc0022]" size={20} />
                                {t('workplace')}
                            </h3>
                            <p className="text-gray-700 text-sm font-medium mb-4 pl-1">
                                {job.location}
                            </p>
                            <div className="h-64 rounded-lg overflow-hidden border border-gray-200">
                                <iframe
                                    src="https://maps.google.com/maps?q=ERG+Academy%2C+S%E1%BB%91+21+%C4%90%C6%B0%E1%BB%9Dng+Hu%E1%BB%B3nh+V%C4%83n+M%E1%BB%99t%2C+Ph%C3%BA+Th%E1%BA%A1nh%2C+H%E1%BB%93+Ch%C3%AD+Minh&t=&z=15&ie=UTF8&iwloc=&output=embed"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </div>
                        </div>

                        {/* Box 2: THÔNG TIN CÔNG TY */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-bold text-[#00008b] mb-4 flex items-center border-b pb-3">
                                <Building2 className="mr-2 text-blue-500" size={20} />
                                {t('companyInfo')}
                            </h3>
                            <div className="space-y-4 text-sm text-gray-600">
                                <div>
                                    <p className="font-semibold text-gray-900 mb-1">{t('orgName')}:</p>
                                    <p>{employer.nameOfOrganization}</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900 mb-1">{t('mainAddress')}:</p>
                                    <p>{employer.mainAddress}</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900 mb-2 flex items-center">
                                        <Info size={14} className="mr-1 text-blue-500" />
                                        {t('fieldOfActivity')}:
                                    </p>
                                    <ul className="list-disc list-outside ml-4 space-y-1 text-xs text-gray-500">
                                        {employer.fieldOfActivity.map((item, idx) => (
                                            <li key={idx}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default JobDetailContent;
