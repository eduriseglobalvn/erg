import { Metadata } from 'next';

export interface SEOptions {
    title: string;
    description: string;
    keywords?: string[];
    images?: string[];
    path: string;
    host: string;
    type?: 'website' | 'article' | 'book' | 'profile';
    publishedTime?: string;
    modifiedTime?: string;
    author?: string[];
    robots?: { index: boolean; follow: boolean };
}

/**
 * Lấy protocol và root domain tự động hỗ trợ cho cả môi trường dev (localhost) và production.
 */
export function getBaseUrl(host: string): string {
    const protocol = host.includes('localhost') || host.includes('.local') ? 'http' : 'https';
    return `${protocol}://${host}`;
}

/**
 * Hàm chung dùng để tạo canonical URL.
 */
export function generateCanonical(host: string, path: string): string {
    const baseUrl = getBaseUrl(host);
    // Chuẩn hóa path: đảm bảo bắt đầu bằng /, xóa trailing slash nếu có (trừ trường hợp path là '/')
    let normalizedPath = path.startsWith('/') ? path : `/${path}`;
    if (normalizedPath.length > 1 && normalizedPath.endsWith('/')) {
        normalizedPath = normalizedPath.slice(0, -1);
    }
    return `${baseUrl}${normalizedPath}`;
}

/**
 * Hàm tạo Full Metadata chuẩn chỉnh Google SEO, dùng trên tất cả pages.
 */
export function generateFullMetadata(options: SEOptions): Metadata {
    const {
        title,
        description,
        keywords = [],
        images = [],
        path,
        host,
        type = 'website',
        publishedTime,
        modifiedTime,
        author,
        robots = { index: true, follow: true }
    } = options;

    const canonicalUrl = generateCanonical(host, path);

    const metadata: Metadata = {
        title,
        description,
        ...(keywords.length > 0 && { keywords }),
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            title,
            description,
            url: canonicalUrl,
            siteName: 'Edurise Global',
            type,
            ...(images.length > 0 && { images }),
            ...(publishedTime && { publishedTime }),
            ...(modifiedTime && { modifiedTime }),
            ...(author && { authors: author }),
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            ...(images.length > 0 && { images }),
            site: '@eduriseglobal', // Optional handle
        },
        robots: {
            index: robots.index,
            follow: robots.follow,
            googleBot: {
                index: robots.index,
                follow: robots.follow,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
    };

    return metadata;
}
