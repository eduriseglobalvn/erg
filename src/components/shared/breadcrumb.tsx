import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
    className?: string;
}

export function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
    return (
        <nav aria-label="Breadcrumb" className={`flex items-center gap-2 text-sm text-gray-500 ${className}`}>

            <Link href="/" className="flex items-center gap-1 hover:text-[#00008b] transition-colors">
                <Home size={14} />
                <span className="sr-only">Trang chủ</span>
            </Link>

            {items.map((item, index) => (
                <React.Fragment key={index}>
                    <ChevronRight size={14} className="text-gray-300 flex-shrink-0" />
                    {item.href && index < items.length - 1 ? (
                        <Link
                            href={item.href}
                            className="hover:text-[#00008b] transition-colors whitespace-nowrap"
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span className="font-medium text-gray-700 truncate max-w-[200px] md:max-w-md">
                            {item.label}
                        </span>
                    )}
                </React.Fragment>
            ))}
        </nav>
    );
}
