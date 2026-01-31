'use client';

import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export const CourseCardSkeleton = () => {
    return (
        <div className="rounded-2xl overflow-hidden bg-white shadow-lg border border-gray-100 flex flex-col h-full">
            {/* Header Skeleton */}
            <div className="h-48 bg-gray-100 flex items-center justify-center relative flex-shrink-0">
                <div className="text-center w-full px-4">
                    <Skeleton height={32} width="60%" className="mb-2" />
                    <Skeleton height={14} width="40%" />
                </div>
            </div>

            <div className="p-6 flex flex-col flex-1">
                {/* Badge Skeleton */}
                <div className="mb-3">
                    <Skeleton width={100} height={20} borderRadius={20} />
                </div>

                {/* Title Skeleton */}
                <Skeleton height={24} width="90%" className="mb-2" />

                {/* Description Skeleton */}
                <div className="mb-6 space-y-1">
                    <Skeleton height={14} width="100%" />
                    <Skeleton height={14} width="80%" />
                </div>

                {/* Modules Skeleton */}
                <div className="space-y-4 mb-8 border-t border-gray-100 pt-4 flex-1">
                    <Skeleton height={16} width="40%" className="mb-3" />
                    <div className="space-y-3">
                        <div className="flex gap-2"><Skeleton circle width={16} height={16} /><Skeleton width="80%" height={14} /></div>
                        <div className="flex gap-2"><Skeleton circle width={16} height={16} /><Skeleton width="70%" height={14} /></div>
                        <div className="flex gap-2"><Skeleton circle width={16} height={16} /><Skeleton width="85%" height={14} /></div>
                    </div>
                </div>

                {/* Button Skeleton */}
                <Skeleton height={48} borderRadius={8} />
            </div>
        </div>
    );
};
