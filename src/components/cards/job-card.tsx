'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, DollarSign, Clock, Calendar, Users, Flame, Zap, Sparkles } from 'lucide-react';

export type JobStatusType = 'hot' | 'urgent' | 'new' | string;

export interface JobCardProps {
    id: string;
    slug: string;
    title: string;
    status: JobStatusType;
    workSchedule: string;
    quantity: number | string;
    deadline: string;
    location: string;
    salary: string;
}

const getStatusBadge = (status: JobStatusType) => {
    switch (status) {
        case 'hot':
            return <div className="bg-orange-100 p-1.5 rounded-full" title="Hot"><Flame size={14} className="text-orange-500 fill-orange-500" /></div>;
        case 'urgent':
            return <div className="bg-red-100 p-1.5 rounded-full" title="Tuyển gấp"><Zap size={14} className="text-red-500 fill-red-500" /></div>;
        case 'new':
            return <div className="bg-green-100 p-1.5 rounded-full" title="Mới"><Sparkles size={14} className="text-green-500 fill-green-500" /></div>;
        default:
            return null;
    }
};

export const JobCard = ({
    id,
    slug,
    title,
    status,
    workSchedule,
    quantity,
    deadline,
    location,
    salary
}: JobCardProps) => {
    return (
        <Link
            href={`/tuyen-dung/${slug}`}
            className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-lg hover:border-blue-300 transition-all duration-300 group flex flex-col relative h-full cursor-pointer"
        >
            {/* Header: Title + Badge */}
            <div className="flex justify-between items-start mb-3 gap-2">
                <h3 className="text-base font-bold text-gray-800 group-hover:text-[#00008b] transition-colors line-clamp-2 uppercase leading-snug flex-1">
                    {title}
                </h3>
                <div className="shrink-0">
                    {getStatusBadge(status)}
                </div>
            </div>

            {/* Info Lines */}
            <div className="space-y-2 mb-4 flex-1">
                <div className="flex items-start gap-2 text-xs text-gray-600">
                    <Clock size={14} className="text-blue-500 shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{workSchedule}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Users size={14} className="text-blue-500 shrink-0" />
                    <span>Số lượng: <span className="font-medium text-gray-900">{quantity}</span></span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Calendar size={14} className="text-blue-500 shrink-0" />
                    <span>Hạn nộp: <span className="font-medium text-gray-900">{deadline}</span></span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                    <MapPin size={14} className="text-blue-500 shrink-0" />
                    <span className="truncate" title={location}>{location}</span>
                </div>
            </div>

            {/* Footer: Salary + Button */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between mt-auto">
                <div className="flex items-center gap-1 font-bold text-gray-700 text-sm">
                    <DollarSign size={14} className="text-gray-400" />
                    {salary}
                </div>

                <span className="px-4 py-1.5 bg-blue-50 text-[#00008b] border border-blue-100 group-hover:bg-[#00008b] group-hover:text-white text-xs font-bold rounded-full transition-all">
                    Ứng Tuyển
                </span>
            </div>
        </Link>
    );
};
