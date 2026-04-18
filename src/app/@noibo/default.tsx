import React from 'react';

export default function DefaultNoibo() {
    return (
        <div className="flex items-center justify-center min-h-[50vh]">
            <div className="animate-pulse flex flex-col items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-2xl"></div>
                <div className="h-4 w-32 bg-slate-100 rounded-full"></div>
            </div>
        </div>
    );
}
