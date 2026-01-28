'use client';

import React from 'react';
import { Calendar, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface NewsCardProps {
    title: string;
    excerpt: string;
    date: string;
    thumbnail: string;
    slug: string;
    categoryName: string;
}

export const NewsCard = ({ title, excerpt, date, thumbnail, slug, categoryName }: NewsCardProps) => {
    return (
        <article className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100 flex flex-col h-full">
            <Link href={`/tin-tuc/${slug}`} className="relative h-56 overflow-hidden block">
                <img
                    src={thumbnail}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
            </Link>

            <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-2 text-sm text-[#00008b] font-semibold mb-3">
                    <Calendar size={16} />
                    <span>{date}</span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-[#00008b] transition-colors line-clamp-2 min-h-[3.5rem]">
                    <Link href={`/tin-tuc/${slug}`}>{title}</Link>
                </h3>

                <p className="text-gray-500 text-sm line-clamp-3 mb-4 flex-grow leading-relaxed">
                    <span className="font-semibold text-gray-700">{categoryName} - </span>
                    {excerpt}
                </p>

                <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center">
                    <Link
                        href={`/tin-tuc/${slug}`}
                        className="text-[#cc0022] font-semibold text-sm hover:underline inline-flex items-center gap-1"
                    >
                        Xem chi tiết <ChevronRight size={14} />
                    </Link>
                </div>
            </div>
        </article>
    );
};
