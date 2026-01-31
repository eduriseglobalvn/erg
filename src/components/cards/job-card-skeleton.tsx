'use client';

import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export const JobCardSkeleton = () => {
    return (
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex flex-col h-full">
            {/* Header Skeleton */}
            <div className="flex justify-between items-start mb-3 gap-2">
                <div className="flex-1 space-y-2">
                    <Skeleton height={18} width="100%" />
                    <Skeleton height={18} width="70%" />
                </div>
                <Skeleton circle width={28} height={28} />
            </div>

            {/* Info Lines Skeleton */}
            <div className="space-y-3 mb-4 flex-1 mt-2">
                <div className="flex gap-2"><Skeleton width={14} height={14} /><Skeleton width="80%" height={12} /></div>
                <div className="flex gap-2"><Skeleton width={14} height={14} /><Skeleton width="60%" height={12} /></div>
                <div className="flex gap-2"><Skeleton width={14} height={14} /><Skeleton width="65%" height={12} /></div>
                <div className="flex gap-2"><Skeleton width={14} height={14} /><Skeleton width="90%" height={12} /></div>
            </div>

            {/* Footer Skeleton */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between mt-auto">
                <Skeleton width={80} height={20} />
                <Skeleton width={100} height={28} borderRadius={14} />
            </div>
        </div>
    );
};

export const JobGridSkeleton = ({ count = 6 }: { count?: number }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {Array.from({ length: count }).map((_, i) => (
                <JobCardSkeleton key={i} />
            ))}
        </div>
    );
};
