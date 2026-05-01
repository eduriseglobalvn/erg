'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useLocale, useTranslations } from 'next-intl';
import { postsApi } from '@/services/posts.api';
import { NewsCard } from '@/components/shared/news-card';
import { NewsGridSkeleton } from '@/components/shared/news-card-skeleton';
import { devWarn } from '@/lib/dev-logger';

const DEFAULT_IMAGE = 'https://media.erg.edu.vn/posts/default-thumbnail.webp';
const ITEMS_PER_PAGE = 9;
const ALL_ERG_POST_LIMIT = 50;

interface NewsItem {
    id?: string;
    title: string;
    pubDate: string;
    link: string;
    thumbnail: string;
    description: string;
    source: 'RSS';
}

type TabType = 'ALL' | 'RSS' | 'ERG';

interface NewsPost {
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    createdAt: string;
    publishedAt?: string;
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
    initialAllPostsData?: NewsPostsData;
    initialRssNews?: NewsItem[];
}

interface RssApiPayload {
    data?: NewsItem[];
}

interface DisplayNewsItem {
    key: string;
    title: string;
    excerpt: string;
    dateRaw: string;
    thumbnail: string;
    source: 'ERG' | 'RSS';
    slug?: string;
    href?: string;
    categoryName?: string;
}

function normalizePostsPayload(payload: unknown): NewsPostsData {
    const normalizedPayload = (typeof payload === 'object' && payload !== null)
        ? (payload as NewsPostsData & {
            data?: NewsPost[];
            page?: number;
            total?: number;
            totalPages?: number;
        })
        : undefined;
    const items = Array.isArray(normalizedPayload?.items)
        ? normalizedPayload.items
        : (Array.isArray(normalizedPayload?.data) ? normalizedPayload.data : (Array.isArray(payload) ? payload : []));
    const meta = normalizedPayload?.meta || normalizedPayload;

    return {
        items,
        meta: {
            totalPages: Number(meta?.totalPages) || 1,
            page: Number(meta?.page) || 1,
            total: Number(meta?.total) || items.length,
        },
    };
}

function normalizeRssPayload(payload: unknown): NewsItem[] {
    const data = (typeof payload === 'object' && payload !== null)
        ? (payload as RssApiPayload).data
        : undefined;

    return Array.isArray(data)
        ? data
        : (Array.isArray(payload) ? payload : []);
}

export default function NewsContent({
    initialTab = 'ALL',
    initialPostsData,
    initialAllPostsData,
    initialRssNews = [],
}: NewsContentProps) {
    const t = useTranslations('news.Page');
    const locale = useLocale();
    const [activeTab, setActiveTab] = useState<TabType>(initialTab);
    const [currentPage, setCurrentPage] = useState(1);
    const [rssNews, setRssNews] = useState<NewsItem[]>(initialRssNews);
    const [loadingRss, setLoadingRss] = useState(
        (initialTab === 'ALL' || initialTab === 'RSS') && initialRssNews.length === 0
    );

    const { data: postsResponse, isLoading: isLoadingApi, isError } = useQuery({
        queryKey: ['news', 'erg', currentPage],
        queryFn: () => postsApi.getAll({
            page: currentPage,
            limit: ITEMS_PER_PAGE,
            status: 'published',
            sortBy: 'createdAt',
            order: 'DESC',
        }).then((res) => normalizePostsPayload(res.data)),
        enabled: activeTab === 'ERG',
        initialData: currentPage === 1 ? initialPostsData : undefined,
        staleTime: 5 * 60 * 1000,
    });

    const { data: allPostsResponse, isLoading: isLoadingAllPosts } = useQuery({
        queryKey: ['news', 'all', 'erg-posts'],
        queryFn: () => postsApi.getAll({
            page: 1,
            limit: ALL_ERG_POST_LIMIT,
            status: 'published',
            sortBy: 'createdAt',
            order: 'DESC',
        }).then((res) => normalizePostsPayload(res.data)),
        enabled: activeTab === 'ALL',
        initialData: initialAllPostsData || initialPostsData,
        staleTime: 5 * 60 * 1000,
    });

    const formatDate = (dateString: string) => {
        try {
            return new Intl.DateTimeFormat(locale === 'vi' ? 'vi-VN' : 'en-US', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            }).format(new Date(dateString));
        } catch (e) {
            return dateString;
        }
    };

    const isRecentNews = (dateString: string) => {
        try {
            const diffDays = (new Date().getTime() - new Date(dateString).getTime()) / 86400000;
            return diffDays <= 3;
        } catch (e) {
            return false;
        }
    };

    useEffect(() => {
        const fetchRss = async () => {
            if ((activeTab !== 'ALL' && activeTab !== 'RSS') || rssNews.length > 0) {
                if ((activeTab === 'ALL' || activeTab === 'RSS') && rssNews.length > 0) {
                    setLoadingRss(false);
                }
                return;
            }

            setLoadingRss(true);
            try {
                const res = await fetch('/api/rss?format=json');
                if (!res.ok) throw new Error('Failed');

                const payload = await res.json();
                setRssNews(normalizeRssPayload(payload));
            } catch (err) {
                devWarn('Loi lay RSS:', err);
            } finally {
                setLoadingRss(false);
            }
        };
        fetchRss();
    }, [activeTab, rssNews.length]);

    const mapPostToDisplay = (item: NewsPost): DisplayNewsItem => ({
        key: `erg-${item.id}`,
        title: item.title,
        excerpt: item.excerpt || t('noExcerpt'),
        dateRaw: item.publishedAt || item.createdAt,
        thumbnail: item.thumbnailUrl || DEFAULT_IMAGE,
        source: 'ERG',
        slug: item.slug,
        categoryName: item.category?.name || t('ergNews'),
    });

    const mapRssToDisplay = (item: NewsItem, index: number): DisplayNewsItem => ({
        key: `rss-${item.id || item.link || index}`,
        title: item.title,
        excerpt: item.description,
        dateRaw: item.pubDate,
        thumbnail: item.thumbnail || DEFAULT_IMAGE,
        source: 'RSS',
        href: item.link,
        categoryName: t('educationHighlights'),
    });

    const postsData = postsResponse || initialPostsData;
    const ergNews = Array.isArray(postsData?.items) ? postsData.items : [];
    const allErgNews = Array.isArray(allPostsResponse?.items) ? allPostsResponse.items : [];

    const displayedRssNews = useMemo(
        () => rssNews.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE),
        [currentPage, rssNews]
    );

    const allNews = useMemo(() => {
        return [
            ...allErgNews.map(mapPostToDisplay),
            ...rssNews.map(mapRssToDisplay),
        ].sort((left, right) => new Date(right.dateRaw).getTime() - new Date(left.dateRaw).getTime());
    }, [allErgNews, rssNews, t]);

    const displayedAllNews = useMemo(
        () => allNews.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE),
        [allNews, currentPage]
    );

    const totalPages = activeTab === 'ERG'
        ? (postsData?.meta?.totalPages || 1)
        : activeTab === 'ALL'
            ? Math.max(Math.ceil(allNews.length / ITEMS_PER_PAGE), 1)
            : Math.max(Math.ceil(rssNews.length / ITEMS_PER_PAGE), 1);

    const isLoadingCurrentTab = activeTab === 'ERG'
        ? isLoadingApi
        : activeTab === 'ALL'
            ? (isLoadingAllPosts || loadingRss)
            : loadingRss;

    const paginate = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 400, behavior: 'smooth' });
    };

    const selectTab = (tab: TabType) => {
        setActiveTab(tab);
        setCurrentPage(1);
    };

    const getPageNumbers = () => {
        const pages = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else if (currentPage <= 3) {
            pages.push(1, 2, 3, 4, '...', totalPages);
        } else if (currentPage >= totalPages - 2) {
            pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
        } else {
            pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
        }
        return pages;
    };

    const renderTabButton = (tab: TabType, label: string) => (
        <button
            onClick={() => selectTab(tab)}
            className={`pb-4 text-xl font-bold transition-all relative whitespace-nowrap ${activeTab === tab ? 'text-[#cc0022]' : 'text-gray-400 hover:text-[var(--erg-blue)]'}`}
        >
            {label}
            {activeTab === tab && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-[#cc0022] rounded-t-full" />
            )}
        </button>
    );

    const renderDisplayCards = (items: DisplayNewsItem[]) => items.map((item) => (
        <NewsCard
            key={item.key}
            title={item.title}
            excerpt={item.excerpt}
            date={formatDate(item.dateRaw)}
            thumbnail={item.thumbnail}
            slug={item.slug}
            href={item.href}
            target={item.source === 'RSS' ? '_blank' : '_self'}
            isNew={isRecentNews(item.dateRaw)}
            showExternalIcon={item.source === 'RSS'}
            categoryName={item.categoryName}
        />
    ));

    const hasNoNews =
        (activeTab === 'ALL' && allNews.length === 0) ||
        (activeTab === 'ERG' && ergNews.length === 0) ||
        (activeTab === 'RSS' && rssNews.length === 0 && !loadingRss);

    return (
        <div className="min-h-screen bg-white pb-20 font-sans pt-[70px] lg:pt-[135px]">
            <div className="bg-[#00008b] py-20 text-center text-white relative flex flex-col items-center justify-center">
                <div className="container mx-auto px-4 z-10">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">{t('title')}</h1>
                    <p className="text-blue-100 max-w-2xl mx-auto text-lg opacity-90">
                        {t('subtitle')}
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-8 py-12">
                <div className="flex justify-start gap-8 md:gap-12 border-b border-gray-200 mb-12 overflow-x-auto">
                    {renderTabButton('ALL', t('allNews'))}
                    {renderTabButton('RSS', t('educationHighlights'))}
                    {renderTabButton('ERG', t('ergNews'))}
                </div>

                {isLoadingCurrentTab ? (
                    <NewsGridSkeleton count={6} />
                ) : isError && activeTab === 'ERG' ? (
                    <div className="text-center py-20 text-red-500 font-medium border rounded-xl bg-red-50">
                        {t('loadingError')}
                    </div>
                ) : (
                    <>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 mb-16">
                            {activeTab === 'ALL' && renderDisplayCards(displayedAllNews)}
                            {activeTab === 'ERG' && ergNews.map((item) => (
                                <NewsCard
                                    key={item.id}
                                    title={item.title}
                                    excerpt={item.excerpt || t('noExcerpt')}
                                    date={formatDate(item.publishedAt || item.createdAt)}
                                    thumbnail={item.thumbnailUrl || DEFAULT_IMAGE}
                                    slug={item.slug}
                                    categoryName={item.category?.name || t('ergNews')}
                                    isNew={isRecentNews(item.publishedAt || item.createdAt)}
                                />
                            ))}
                            {activeTab === 'RSS' && renderDisplayCards(displayedRssNews.map(mapRssToDisplay))}
                        </div>

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

                        {hasNoNews && (
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
