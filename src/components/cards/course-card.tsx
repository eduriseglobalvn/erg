'use client';

import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export interface CourseCardProps {
    id: string;
    code?: string;
    displayTitle: string;
    title: string;
    description: string;
    headerGradient?: string;
    modules?: string;
    points: string[];
    btnColor?: string;
    icon?: React.ReactNode;
    subtitle?: string;
    href?: string;
    price?: number;
    rating?: {
        average: number;
        count: number;
    };
}

export const CourseCard = ({
    id,
    code,
    displayTitle,
    title,
    description,
    headerGradient,
    modules,
    points,
    btnColor = "border-[var(--erg-blue)] text-[var(--erg-blue)] hover:bg-[var(--erg-blue)]",
    icon,
    subtitle,
    href
}: CourseCardProps) => {
    const finalHref = href || `/khoa-hoc/${id}`;
    const finalGradient = headerGradient || "from-[var(--erg-blue)] to-blue-400";
    const finalModules = modules || "Nội dung chương trình:";

    return (
        <div className="group rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col h-full">
            {/* Header Card */}
            <div className={`h-48 bg-gradient-to-br ${finalGradient} flex items-center justify-center relative overflow-hidden flex-shrink-0`}>
                <div className="text-center text-white p-4 relative z-10">
                    <span className="block text-3xl font-bold uppercase mb-1">{displayTitle}</span>
                    <span className="text-xs opacity-90 italic">{subtitle || (id === 'thcb' ? 'Basic IT Skills' : id === 'thnc' ? 'Advanced IT Skills' : 'Exam Preparation')}</span>
                </div>
                {icon && (
                    <div className="absolute bottom-0 right-0 p-4 opacity-20 group-hover:scale-110 transition-transform duration-500">
                        {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { size: 80, className: "text-white" }) : icon}
                    </div>
                )}
            </div>

            <div className="p-6 flex flex-col flex-1">
                {code && (
                    <div className="flex items-center gap-2 mb-3">
                        <span className="px-3 py-1 rounded-full bg-gray-50 text-gray-500 text-[10px] font-bold uppercase tracking-wider border border-gray-100">
                            {code}
                        </span>
                    </div>
                )}
                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-[var(--erg-blue)] transition-colors">
                    {title}
                </h3>
                <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                    {description}
                </p>

                <div className="space-y-3 mb-8 border-t border-gray-100 pt-4 flex-1">
                    <h4 className="font-bold text-gray-700 text-xs uppercase mb-3 italic">{finalModules}</h4>
                    <ul className="space-y-2">
                        {points.map((point, i) => (
                            <li key={i} className="flex items-start gap-2 text-[13px] text-gray-600 font-medium leading-snug">
                                <CheckCircle2 size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                                <span>{point}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <Link
                    href={finalHref}
                    className={`block w-full py-3 text-center rounded-lg border-2 font-bold transition-all mt-auto uppercase text-sm tracking-wide ${btnColor} hover:text-white shadow-sm active:scale-95`}
                    data-analytics="click_course_detail"
                    data-analytics-metadata={JSON.stringify({ courseId: id, courseTitle: title })}
                >
                    Chi Tiết & Đăng Ký
                </Link>
            </div>
        </div>
    );
};
