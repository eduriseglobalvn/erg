'use client';

import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

/**
 * Skeleton loader cho NewsCard
 */
export const NewsCardSkeleton = () => {
    return (
        <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full p-0">
            {/* Thumbnail Skeleton */}
            <div className="relative h-56 overflow-hidden block">
                <Skeleton height="100%" containerClassName="flex-1 h-full" borderRadius={0} />
            </div>

            <div className="p-6 flex flex-col flex-grow space-y-4">
                {/* Date Skeleton */}
                <div className="flex items-center gap-2">
                    <Skeleton circle width={16} height={16} />
                    <Skeleton width={100} height={14} />
                </div>

                {/* Title Skeleton */}
                <div className="space-y-2">
                    <Skeleton height={20} width="100%" />
                    <Skeleton height={20} width="70%" />
                </div>

                {/* Excerpt Skeleton */}
                <div className="space-y-1">
                    <Skeleton height={14} width="100%" />
                    <Skeleton height={14} width="100%" />
                    <Skeleton height={14} width="40%" />
                </div>

                {/* Footer Skeleton */}
                <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center">
                    <Skeleton width={80} height={16} />
                </div>
            </div>
        </div>
    );
};

export const NewsGridSkeleton = ({ count = 6 }: { count?: number }) => {
    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 mb-16">
            {Array.from({ length: count }).map((_, i) => (
                <NewsCardSkeleton key={i} />
            ))}
        </div>
    );
};
