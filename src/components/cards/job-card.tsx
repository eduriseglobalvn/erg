'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, DollarSign, Clock, Calendar, Users, Flame, Zap, Sparkles, Briefcase } from 'lucide-react';
import { Job } from '@/types/recruitment';
import { useTranslations } from 'next-intl';

export const JobCard = ({ className, ...job }: Job & { className?: string }) => {
    const t = useTranslations('recruitment.Card');

    const getStatusBadge = () => {
        if (job.isUrgent) {
            return <div className="bg-red-100 p-1.5 rounded-full" title={t('urgent')}><Zap size={14} className="text-red-500 fill-red-500" /></div>;
        }
        if (job.isHot) {
            return <div className="bg-orange-100 p-1.5 rounded-full" title={t('hot')}><Flame size={14} className="text-orange-500 fill-orange-500" /></div>;
        }
        if (job.isNew) {
            return <div className="bg-green-100 p-1.5 rounded-full" title={t('new')}><Sparkles size={14} className="text-green-500 fill-green-500" /></div>;
        }
        return null;
    };

    return (
        <Link
            href={`/tuyen-dung/${job.slug}`}
            className={`bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-lg hover:border-blue-300 transition-all duration-300 group flex flex-col relative h-full cursor-pointer ${className || ''}`}
        >
            <div className="flex justify-between items-start mb-3 gap-2">
                <h3 className="text-base font-bold text-gray-800 group-hover:text-[#00008b] transition-colors truncate uppercase leading-snug flex-1">
                    {job.title}
                </h3>
                <div className="shrink-0">
                    {getStatusBadge()}
                </div>
            </div>

            {/* Info Lines */}
            <div className="space-y-2 mb-4 flex-1">
                <div className="flex items-start gap-2 text-xs text-gray-600">
                    <Clock size={14} className="text-blue-500 shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{job.workSchedule || t('workSchedule')}</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-gray-600">
                    <Briefcase size={14} className="text-blue-500 shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{job.workType}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Users size={14} className="text-blue-500 shrink-0" />
                    <span>{t('quantity')}: <span className="font-medium text-gray-900">{job.quantity}</span></span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Calendar size={14} className="text-blue-500 shrink-0" />
                    <span>{t('deadline')}: <span className="font-medium text-gray-900">{job.deadline}</span></span>
                </div>
                {job.postDate && (
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Calendar size={14} className="shrink-0" />
                        <span>{t('postDate') || 'Ngày đăng'}: {job.postDate}</span>
                    </div>
                )}
                <div className="flex items-center gap-2 text-xs text-gray-600">
                    <MapPin size={14} className="text-blue-500 shrink-0" />
                    <span className="truncate" title={job.location}>{job.location}</span>
                </div>
            </div>

            {/* Footer: Salary + Button */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between mt-auto">
                <div className="flex items-center gap-1 font-bold text-gray-700 text-sm">
                    <DollarSign size={14} className="text-gray-400" />
                    {job.salary}
                </div>

                <span className="px-4 py-1.5 bg-blue-50 text-[#00008b] border border-blue-100 group-hover:bg-[#00008b] group-hover:text-white text-xs font-bold rounded-full transition-all">
                    {t('apply')}
                </span>
            </div>
        </Link>
    );
};
