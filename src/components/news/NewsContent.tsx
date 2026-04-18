'use client';

import React, { useState, useEffect } from 'react';
import {
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { postsApi } from '@/services/posts.api';
import { NewsCard } from '@/components/shared/news-card';
import { NewsGridSkeleton } from '@/components/shared/news-card-skeleton';
import { devWarn } from '@/lib/dev-logger';

// --- CONFIG ---
const DEFAULT_IMAGE = 'https://media.erg.edu.vn/posts/default-thumbnail.webp';
const ITEMS_PER_PAGE = 9;

import { useTranslations, useLocale } from 'next-intl';

// --- INTERFACES ---
interface NewsItem {
    id?: string;
    title: string;
    pubDate: string;
    link: string;
    thumbnail: string;
    description: string;
    source: 'ERG' | 'RSS';
}

type TabType = 'ERG' | 'RSS';

interface NewsPost {
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    createdAt: string;
    thumbnailUrl?: string;
    category?: {
        name?: string;
    };
}

interface NewsPostsData {
    items: NewsPost[];
    meta?: {
        totalPages?: number;
        page?: number;
        total?: number;
    };
}

interface NewsContentProps {
    initialTab?: TabType;
    initialPostsData?: NewsPostsData;
    initialRssNews?: NewsItem[];
}

function normalizePostsPayload(payload: unknown): NewsPostsData {
    const normalizedPayload = (typeof payload === 'object' && payload !== null)
        ? (payload as NewsPostsData)
        : undefined;
    const items = Array.isArray(normalizedPayload?.items)
        ? normalizedPayload.items
        : (Array.isArray(payload) ? payload : []);

    return {
        items,
        meta: {
            totalPages: Number(normalizedPayload?.meta?.totalPages) || 1,
            page: Number(normalizedPayload?.meta?.page) || 1,
            total: Number(normalizedPayload?.meta?.total) || items.length,
        },
    };
}

export default function NewsContent({
    initialTab = 'RSS',
    initialPostsData,
    initialRssNews = [],
}: NewsContentProps) {
    const t = useTranslations('news.Page');
    const locale = useLocale();
    const [activeTab, setActiveTab] = useState<TabType>(initialTab);
    const [currentPage, setCurrentPage] = useState(1);

    const [rssNews, setRssNews] = useState<NewsItem[]>(initialRssNews);
    const [loadingRss, setLoadingRss] = useState(
        initialTab === 'RSS' && initialRssNews.length === 0
    );

    const { data: postsResponse, isLoading: isLoadingApi, isError } = useQuery({
        queryKey: ['news', currentPage],
        queryFn: () => postsApi.getAll({
            page: currentPage,
            limit: ITEMS_PER_PAGE,
            status: 'published'
        }).then((res) => normalizePostsPayload(res.data)),
        enabled: activeTab === 'ERG',
        initialData: currentPage === 1 ? initialPostsData : undefined,
        staleTime: 5 * 60 * 1000,
    });

    // --- UTILS ---
    const stripHtml = (html: string | null) => {
        if (!html) return '';
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            return doc.body.textContent || doc.body.innerText || '';
        } catch (e) { return html || ''; }
    };

    const extractImage = (content: string | null) => {
        if (!content) return DEFAULT_IMAGE;
        const match = content.match(/<img[^>]+src=['"]([^'"]+)['"]/i);
        if (match && match[1]) {
            let src = match[1];
            return src.startsWith('/') ? `https://giaoduc.edu.vn${src}` : src;
        }
        return DEFAULT_IMAGE;
    };

    const formatDate = (dateString: string) => {
        try {
            return new Intl.DateTimeFormat(locale === 'vi' ? 'vi-VN' : 'en-US', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            }).format(new Date(dateString));
        } catch (e) {
            return dateString;
        }
    };

    const isRecentNews = (dateString: string) => {
        try {
            const diffDays = (new Date().getTime() - new Date(dateString).getTime()) / (86400000);
            return diffDays <= 3;
        } catch (e) { return false; }
    };

    // --- RSS FETCHING ---
    useEffect(() => {
        const fetchRss = async () => {
            if (activeTab !== 'RSS' || rssNews.length > 0) {
                if (activeTab === 'RSS' && rssNews.length > 0) setLoadingRss(false);
                return;
            }
            
            setLoadingRss(true);
            try {
                const res = await fetch('/api/rss');
                if (!res.ok) throw new Error('Failed');

                const xmlText = await res.text();
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(xmlText, "text/xml");
                const items = xmlDoc.querySelectorAll("item");

                const formatted: NewsItem[] = Array.from(items).map((item) => {
                    const desc = item.querySelector("description")?.textContent || "";
                    const content = item.getElementsByTagName("content:encoded")[0]?.textContent || "";
                    const img = extractImage(content) !== DEFAULT_IMAGE ? extractImage(content) : extractImage(desc);

                    let url = item.querySelector("guid")?.textContent?.trim() || "";
                    if (!url) {
                        const links = item.getElementsByTagName("link");
                        for (let i = 0; i < links.length; i++) {
                            if (links[i].textContent && links[i].textContent!.trim().length > 0) {
                                url = links[i].textContent!.trim();
                                break;
                            }
                        }
                    }

                    return {
                        title: item.querySelector("title")?.textContent || "",
                        pubDate: item.querySelector("pubDate")?.textContent || "",
                        link: url,
                        thumbnail: img,
                        description: stripHtml(desc),
                        source: 'RSS'
                    };
                });
                setRssNews(formatted.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()));
            } catch (err) {
                devWarn("Loi lay RSS:", err);
            } finally {
                setLoadingRss(false);
            }
        };
        fetchRss();
    }, [activeTab, rssNews.length]); // Added rssNews.length to dependencies to prevent re-fetching if already loaded

    const paginate = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 400, behavior: 'smooth' });
    };

    const postsData = postsResponse || initialPostsData;
    const ergNews = Array.isArray(postsData?.items) ? postsData.items : [];

    const totalPages = activeTab === 'ERG' 
        ? (postsData?.meta?.totalPages || 1)
        : Math.max(Math.ceil(rssNews.length / ITEMS_PER_PAGE), 1);

    const displayedRssNews = rssNews.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const getPageNumbers = () => {
        const pages = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 3) {
                pages.push(1, 2, 3, 4, '...', totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
            }
        }
        return pages;
    };

    return (
        <div className="min-h-screen bg-white pb-20 font-sans pt-[70px] lg:pt-[135px]">
            {/* Dark Blue Banner */}
            <div className="bg-[#00008b] py-20 text-center text-white relative flex flex-col items-center justify-center">
                <div className="container mx-auto px-4 z-10">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">{t('title')}</h1>
                    <p className="text-blue-100 max-w-2xl mx-auto text-lg opacity-90">
                        {t('subtitle')}
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-8 py-12">
                {/* --- TAB NAVIGATION --- */}
                <div className="flex justify-start gap-12 border-b border-gray-200 mb-12">
                    <button
                        onClick={() => { setActiveTab('ERG'); setCurrentPage(1); }}
                        className={`pb-4 text-xl font-bold transition-all relative ${activeTab === 'ERG' ? 'text-[#cc0022]' : 'text-gray-400 hover:text-[var(--erg-blue)]'}`}
                    >
                        {t('allNews')}
                        {activeTab === 'ERG' && (
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-[#cc0022] rounded-t-full" />
                        )}
                    </button>
                    <button
                        onClick={() => { setActiveTab('RSS'); setCurrentPage(1); }}
                        className={`pb-4 text-xl font-bold transition-all relative ${activeTab === 'RSS' ? 'text-[#cc0022]' : 'text-gray-400 hover:text-[var(--erg-blue)]'}`}
                    >
                        {t('educationHighlights')}
                        {activeTab === 'RSS' && (
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-[#cc0022] rounded-t-full" />
                        )}
                    </button>
                </div>

                {/* --- LOADING & CONTENT --- */}
                {(activeTab === 'ERG' ? isLoadingApi : loadingRss) ? (
                    <NewsGridSkeleton count={6} />
                ) : isError && activeTab === 'ERG' ? (
                    <div className="text-center py-20 text-red-500 font-medium border rounded-xl bg-red-50">
                        {t('loadingError')}
                    </div>
                ) : (
                    <>
                        {/* News Grid */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 mb-16">
                            {activeTab === 'ERG' ? (
                                ergNews.map((item) => (
                                    <NewsCard
                                        key={item.id}
                                        title={item.title}
                                        excerpt={item.excerpt || t('noExcerpt')}
                                        date={formatDate(item.createdAt)}
                                        thumbnail={item.thumbnailUrl || DEFAULT_IMAGE}
                                        slug={item.slug}
                                        categoryName={item.category?.name || t('uncategorized')}
                                    />
                                ))
                            ) : (
                                displayedRssNews.map((item, index) => (
                                    <NewsCard
                                        key={index}
                                        title={item.title}
                                        date={formatDate(item.pubDate)}
                                        href={item.link}
                                        thumbnail={item.thumbnail}
                                        excerpt={item.description}
                                        target="_blank"
                                        isNew={isRecentNews(item.pubDate)}
                                        showExternalIcon={true}
                                        categoryName={t('educationHighlights')}
                                    />
                                ))
                            )}
                        </div>

                        {/* --- PAGINATION --- */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2 mt-12">
                                <button
                                    onClick={() => paginate(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className={`w-11 h-11 flex items-center justify-center rounded-lg border transition-all
                                        ${currentPage === 1
                                            ? 'bg-gray-50 text-gray-300 border-gray-200 cursor-not-allowed'
                                            : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50 shadow-sm active:scale-95'
                                        }`}
                                >
                                    <ChevronLeft size={20} />
                                </button>

                                {getPageNumbers().map((page, idx) => (
                                    <React.Fragment key={idx}>
                                        {page === '...' ? (
                                            <span className="w-11 h-11 flex items-center justify-center text-gray-400 font-medium">...</span>
                                        ) : (
                                            <button
                                                onClick={() => paginate(page as number)}
                                                className={`w-11 h-11 flex items-center justify-center rounded-lg font-bold text-sm transition-all border
                                                    ${currentPage === page
                                                        ? 'bg-[#00008b] text-white border-[#00008b] shadow-indigo-200 shadow-lg'
                                                        : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50 hover:border-gray-400 shadow-sm'
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        )}
                                    </React.Fragment>
                                ))}

                                <button
                                    onClick={() => paginate(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className={`w-11 h-11 flex items-center justify-center rounded-lg border transition-all
                                        ${currentPage === totalPages
                                            ? 'bg-gray-50 text-gray-300 border-gray-200 cursor-not-allowed'
                                            : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50 shadow-sm active:scale-95'
                                        }`}
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        )}

                        {((activeTab === 'ERG' && ergNews.length === 0) || (activeTab === 'RSS' && rssNews.length === 0 && !loadingRss)) && (
                            <div className="text-center py-32 border-2 border-dashed border-gray-200 rounded-2xl">
                                <p className="text-gray-500 text-lg font-medium">{t('noNews')}</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
