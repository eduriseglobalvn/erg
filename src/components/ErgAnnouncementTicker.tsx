'use client';

import Link from 'next/link';
import { ERG_NEWS_MOCKS } from '@/mocks/erg-news';

export default function ErgAnnouncementTicker() {
    const tickerItems = [...ERG_NEWS_MOCKS, ...ERG_NEWS_MOCKS];

    return (
        <div
            className="fixed left-0 right-0 z-40 border-t border-red-700 bg-[#cc0022] shadow-[0_6px_18px_-10px_rgba(204,0,34,0.85)]"
            style={{ top: 'var(--erg-header-height, 70px)' }}
        >
            <div className="mx-auto flex h-11 items-center overflow-hidden px-4 md:px-6">
                <div className="mr-4 hidden shrink-0 rounded-md bg-[#8f0017] px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.18em] text-white md:block">
                    Thông báo
                </div>
                <div className="relative flex-1 overflow-hidden">
                    <div className="erg-news-ticker-track flex min-w-max items-center gap-12 whitespace-nowrap">
                        {tickerItems.map((item, index) => (
                            <Link
                                key={`${item.slug}-${index}`}
                                href={`/tin-tuc/${item.slug}`}
                                className="group inline-flex items-center gap-3 text-base font-bold text-white transition-colors hover:text-[#ffe1e6] md:text-lg"
                            >
                                <span className="h-2.5 w-2.5 rounded-full bg-[#ffd166] transition-transform group-hover:scale-125" />
                                <span>{item.title}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .erg-news-ticker-track {
                    animation: ergTickerScroll 42s linear infinite;
                }

                .erg-news-ticker-track:hover {
                    animation-play-state: paused;
                }

                @keyframes ergTickerScroll {
                    from {
                        transform: translateX(0);
                    }
                    to {
                        transform: translateX(-50%);
                    }
                }
            `}</style>
        </div>
    );
}
