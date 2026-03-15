'use client';

import React, { useState } from 'react';
import { Calendar, ChevronRight, Flame, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export interface NewsCardProps {
    title: string;
    excerpt: string;
    date: string;
    thumbnail: string;
    slug?: string;
    categoryName?: string;
    href?: string; // Hỗ trợ link tuyệt đối cho cross-subdomain hoặc RSS
    target?: '_blank' | '_self';
    isNew?: boolean;
    showExternalIcon?: boolean;
}

/**
 * Thẻ tin tức dùng chung cho toàn bộ hệ thống (Main site & Subdomains)
 */
export const NewsCard = ({
    title,
    excerpt,
    date,
    thumbnail,
    slug,
    categoryName,
    href,
    target = '_self',
    isNew = false,
    showExternalIcon = false
}: NewsCardProps) => {
    // Nếu không có href truyền vào, mặc định là link nội bộ trang tin tức
    const targetHref = href || `/tin-tuc/${slug}`;
    const DEFAULT_IMAGE = 'https://media.erg.edu.vn/posts/default-thumbnail.webp';
    const BLUR_DATA_URL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8f+F9PQAI8AKp26Y69QAAAABJRU5ErkJggg==";
    const [hasError, setHasError] = useState(false);
    const currentSrc = hasError ? DEFAULT_IMAGE : (thumbnail || DEFAULT_IMAGE);

    const CardLink = ({ children, className }: { children: React.ReactNode, className?: string }) => {
        const metadata = JSON.stringify({ title, slug: slug || href });

        if (target === '_blank' || targetHref.startsWith('http')) {
            return (
                <a
                    href={targetHref}
                    target={target}
                    className={className}
                    rel={target === '_blank' ? "noopener noreferrer" : undefined}
                    data-analytics="click_news_detail"
                    data-analytics-metadata={metadata}
                >
                    {children}
                </a>
            );
        }
        return (
            <Link
                href={targetHref}
                className={className}
                data-analytics="click_news_detail"
                data-analytics-metadata={metadata}
            >
                {children}
            </Link>
        );
    };

    return (
        <article className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100 flex flex-col h-full">
            <CardLink className="relative h-56 overflow-hidden block">
                <Image
                    src={currentSrc}
                    alt={title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    placeholder="blur"
                    blurDataURL={BLUR_DATA_URL}
                    onError={() => { setHasError(true); }}
                />
                {isNew && (
                    <div className="absolute top-3 left-3 flex items-center gap-1 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded shadow-md z-10">
                        <Flame size={12} className="fill-yellow-300 text-yellow-300" /> NEW
                    </div>
                )}
            </CardLink>

            <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-2 text-sm text-[#00008b] font-semibold mb-3">
                    <Calendar size={16} />
                    <span>{date}</span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-[#00008b] transition-colors line-clamp-2 min-h-[3.5rem]">
                    <CardLink>{title}</CardLink>
                </h3>

                <p className="text-gray-500 text-sm line-clamp-3 mb-4 flex-grow leading-relaxed">
                    {categoryName && <span className="font-semibold text-gray-700">{categoryName} - </span>}
                    {excerpt}
                </p>

                <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center">
                    <CardLink
                        className="text-[#cc0022] font-semibold text-sm hover:underline inline-flex items-center gap-1"
                    >
                        Xem chi tiết <ChevronRight size={14} />
                    </CardLink>
                    {showExternalIcon && <ExternalLink size={14} className="text-gray-300" />}
                </div>
            </div>
        </article>
    );
};
