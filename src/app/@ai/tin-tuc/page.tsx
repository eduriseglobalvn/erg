'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
    Calendar,
    ChevronLeft,
    ChevronRight,
    Loader2,
    Flame,
    ExternalLink,
    ChevronRightIcon
} from 'lucide-react';
import { NewsCard } from '@/components/shared/news-card';
import { NewsGridSkeleton } from '@/components/shared/news-card-skeleton';

// --- CẤU HÌNH ---
const DEFAULT_IMAGE = 'https://moet.gov.vn/upload/2007219/20251020/image_2025-10-20_11-46-19_998cd.png';
const ITEMS_PER_PAGE = 9;

// --- DỮ LIỆU MẪU ERG ---
const MOCK_ERG_NEWS: NewsItem[] = [
    {
        title: "ERG chính thức khởi động dự án Chuyển đổi số Giáo dục 2025",
        pubDate: new Date().toISOString(),
        link: "#",
        thumbnail: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1000",
        description: "Dự án hứa hẹn mang lại nền tảng học tập thông minh, kết nối học sinh và giáo viên trên toàn quốc.",
        source: 'ERG'
    },
    {
        title: "Hội thảo: Ứng dụng AI trong công tác quản lý trường học",
        pubDate: new Date(Date.now() - 86400000).toISOString(),
        link: "#",
        thumbnail: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1000",
        description: "Các chuyên gia công nghệ chia sẻ về giải pháp AI giúp tối ưu hóa quy trình vận hành giáo dục.",
        source: 'ERG'
    },
    {
        title: "Lễ tổng kết và vinh danh cán bộ nhân viên xuất sắc quý 3",
        pubDate: "2025-11-15T09:00:00Z",
        link: "#",
        thumbnail: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=1000",
        description: "Nhìn lại chặng đường phát triển và tri ân những đóng góp không ngừng nghỉ của đội ngũ nhân sự.",
        source: 'ERG'
    },
];

// --- INTERFACES ---
interface NewsItem {
    title: string;
    pubDate: string;
    link: string;
    thumbnail: string;
    description: string;
    source: 'ERG' | 'RSS';
}

type TabType = 'ERG' | 'RSS';

// --- MAIN COMPONENT ---
export default function NewsPage() {
    const [activeTab, setActiveTab] = useState<TabType>('RSS');
    const [rssNews, setRssNews] = useState<NewsItem[]>([]);
    const [loadingRss, setLoadingRss] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    // --- LOGIC HELPER ---
    const isRecentNews = (dateString: string) => {
        try {
            const diffDays = (new Date().getTime() - new Date(dateString).getTime()) / (86400000);
            return diffDays <= 3;
        } catch (e) { return false; }
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

    const stripHtml = (html: string | null) => {
        if (!html) return '';
        const temp = document.createElement('div');
        temp.innerHTML = html;
        return temp.textContent || temp.innerText || '';
    };

    const formatDate = (dateString: string) => {
        try {
            return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(dateString));
        } catch (e) { return dateString; }
    };

    // --- FETCH RSS ---
    useEffect(() => {
        const fetchRss = async () => {
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

                    // --- SỬA LỖI LINK TẠI ĐÂY ---
                    // 1. Ưu tiên lấy từ thẻ <guid> vì trong RSS này guid chứa đúng link bài viết
                    let url = item.querySelector("guid")?.textContent?.trim() || "";

                    // 2. Nếu không có guid, tìm thẻ <link> có chứa text (bỏ qua thẻ atom:link rỗng)
                    if (!url) {
                        const links = item.getElementsByTagName("link");
                        for (let i = 0; i < links.length; i++) {
                            // Chỉ lấy thẻ link có nội dung text (link bài viết)
                            if (links[i].textContent && links[i].textContent.trim().length > 0) {
                                url = links[i].textContent.trim();
                                break;
                            }
                        }
                    }
                    // ----------------------------

                    return {
                        title: item.querySelector("title")?.textContent || "",
                        pubDate: item.querySelector("pubDate")?.textContent || "",
                        link: url, // Gán URL đã xử lý
                        thumbnail: img,
                        description: stripHtml(desc),
                        source: 'RSS'
                    };
                });
                setRssNews(formatted.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()));
            } catch (err) {
                console.error("Lỗi lấy RSS:", err);
            } finally {
                setLoadingRss(false);
            }
        };
        fetchRss();
    }, []);

    // --- PHÂN TRANG LOGIC ---
    useEffect(() => { setCurrentPage(1); }, [activeTab]);

    const currentData = useMemo(() => activeTab === 'ERG' ? MOCK_ERG_NEWS : rssNews, [activeTab, rssNews]);
    const totalPages = Math.ceil(currentData.length / ITEMS_PER_PAGE);
    const displayedNews = currentData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const paginate = (page: number) => {
        setCurrentPage(page);
        document.getElementById('news-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

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
        <div className="min-h-screen bg-white pb-20 font-sans">
            {/* Banner Header */}
            <div className="bg-[#00008b] py-16 text-center text-white">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl font-bold mb-4">Tin Tức & Sự Kiện</h1>
                    <p className="text-blue-100 max-w-2xl mx-auto">
                        Thông tin cập nhật mới nhất từ ERG và ngành giáo dục
                    </p>
                </div>
            </div>

            <div id="news-container" className="container mx-auto px-4 md:px-8 py-10">

                {/* --- TAB NAVIGATION --- */}
                <div className="flex justify-start gap-10 border-b border-gray-200 mb-10">
                    <button
                        onClick={() => setActiveTab('ERG')}
                        className={`pb-4 text-xl font-medium transition-all duration-200 ${activeTab === 'ERG'
                            ? 'text-[#cc0022] border-b-4 border-[#cc0022]'
                            : 'text-gray-500 hover:text-[#00008b] border-b-4 border-transparent'
                            }`}
                    >
                        Tin tức ERG
                    </button>
                    <button
                        onClick={() => setActiveTab('RSS')}
                        className={`pb-4 text-xl font-medium transition-all duration-200 ${activeTab === 'RSS'
                            ? 'text-[#cc0022] border-b-4 border-[#cc0022]'
                            : 'text-gray-500 hover:text-[#00008b] border-b-4 border-transparent'
                            }`}
                    >
                        Điểm tin Giáo dục
                    </button>
                </div>

                {/* --- LOADING & CONTENT --- */}
                {activeTab === 'RSS' && loadingRss ? (
                    <NewsGridSkeleton count={6} />
                ) : (
                    <>
                        {/* News Grid */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                            {displayedNews.map((item, index) => (
                                <NewsCard
                                    key={index}
                                    title={item.title}
                                    excerpt={item.description}
                                    date={formatDate(item.pubDate)}
                                    thumbnail={item.thumbnail}
                                    href={item.link}
                                    target={item.source === 'RSS' ? '_blank' : '_self'}
                                    isNew={isRecentNews(item.pubDate)}
                                    showExternalIcon={item.source === 'RSS'}
                                    categoryName={item.source === 'ERG' ? 'ERG News' : 'Điểm tin'}
                                />
                            ))}
                        </div>

                        {/* --- PAGINATION --- */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2 mt-8">
                                <button
                                    onClick={() => paginate(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className={`w-10 h-10 flex items-center justify-center rounded-lg border transition-colors
                                        ${currentPage === 1
                                            ? 'bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed'
                                            : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    <ChevronLeft size={20} />
                                </button>

                                {getPageNumbers().map((page, idx) => (
                                    <React.Fragment key={idx}>
                                        {page === '...' ? (
                                            <span className="w-10 h-10 flex items-center justify-center text-gray-400 font-medium">...</span>
                                        ) : (
                                            <button
                                                onClick={() => paginate(page as number)}
                                                className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium text-base transition-all border
                                                    ${currentPage === page
                                                        ? 'bg-[#00008b] text-white border-[#00008b] shadow-md'
                                                        : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
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
                                    className={`w-10 h-10 flex items-center justify-center rounded-lg border transition-colors
                                        ${currentPage === totalPages
                                            ? 'bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed'
                                            : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        )}

                        {!loadingRss && displayedNews.length === 0 && (
                            <div className="text-center py-10 text-gray-500">Chưa có bài viết nào.</div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}