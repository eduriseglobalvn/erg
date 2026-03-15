import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { generateBreadcrumbItems } from '@/utils/seo/generate-breadcrumb';
import { SchemaScript } from './schema-script';

interface BreadcrumbProps {
    pathname: string;
    pageTitle?: string;
    subdomainLabel?: string;
    categoryName?: string;
    domain?: string;
    className?: string;
    itemClassName?: string;
    activeItemClassName?: string;
    separatorClassName?: string;
}

export function Breadcrumb({
    pathname,
    pageTitle,
    subdomainLabel = 'Trang chủ',
    categoryName,
    domain = 'erg.edu.vn',
    className = "text-slate-500",
    itemClassName = "hover:text-blue-600",
    activeItemClassName = "text-slate-800",
    separatorClassName = "text-slate-400"
}: BreadcrumbProps) {
    const items = generateBreadcrumbItems(pathname, pageTitle, subdomainLabel, categoryName);

    if (!items || items.length <= 1) return null;

    return (
        <>
            {/* Inject Schema into DOM */}
            <SchemaScript type="BreadcrumbList" data={{ items }} domain={domain} />

            {/* Visual HTML Breadcrumb */}
            <nav aria-label="Breadcrumb" className="w-full flex">
                <ol className={`flex items-center space-x-2 text-sm flex-wrap ${className}`}>
                    {items.map((item, index) => {
                        const isLast = index === items.length - 1;

                        return (
                            <li key={index} className="flex items-center">
                                {index === 0 ? (
                                    <Link
                                        href={item.href || '/'}
                                        className={`transition-colors flex items-center gap-1.5 font-medium ${itemClassName}`}
                                        aria-label="Home"
                                    >
                                        <Home className="h-4 w-4" />
                                        <span className="hidden sm:inline">{item.label}</span>
                                    </Link>
                                ) : (
                                    <>
                                        <ChevronRight className={`h-4 w-4 mx-1 flex-shrink-0 ${separatorClassName}`} />
                                        {isLast ? (
                                            <span
                                                className={`font-semibold line-clamp-1 max-w-[200px] sm:max-w-xs md:max-w-md ${activeItemClassName}`}
                                                aria-current="page"
                                                title={pageTitle || item.label}
                                            >
                                                {item.label}
                                            </span>
                                        ) : (
                                            <Link
                                                href={item.href || '#'}
                                                className={`transition-colors font-medium whitespace-nowrap ${itemClassName}`}
                                            >
                                                {item.label}
                                            </Link>
                                        )}
                                    </>
                                )}
                            </li>
                        );
                    })}
                </ol>
            </nav>
        </>
    );
}
