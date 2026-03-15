/**
 * SEO Health Metrics
 */
export interface SeoHealth {
    score: number;               // 0-100 (Overall Health)
    avgScore?: number;           // Average score of all posts
    totalPosts: number;
    totalPostsWithSeo: number;   // Số bài viết đã tối ưu
    totalInternalLinks: number;
    lastGscSync: string | null;  // ISO Date string
    issuesCount: number;         // Tổng số vấn đề SEO cần xử lý
    postsAbove80?: number;
    needImprovement?: number;
}

/**
 * Detailed SEO Analysis of a Post
 */
export interface SeoAnalysis {
    overallScore: number;
    titleAnalysis: {
        length: number;
        hasKeyword: boolean;
        suggestions: string[];
    };
    metaAnalysis: {
        length: number;
        hasKeyword: boolean;
        suggestions: string[];
    };
    contentAnalysis: {
        wordCount: number;
        keywordDensity: number;
        readabilityScore: number;
        headingStructure: {
            h1: number;
            h2: number;
            h3: number;
            valid: boolean;
        };
        paragraphCount: number;
    };
    technicalAnalysis: {
        hasCanonical: boolean;
        hasSchema: boolean;
        imageAltTags: {
            total: number;
            withAlt: number;
        };
        internalLinks: number;
        externalLinks: number;
    };
    suggestions: string[]; // Top 10 gợi ý cải thiện
}

/**
 * SEO Schema Markup
 */
export interface SeoSchema {
    type: string; // "Article" | "FAQ" | "HowTo" | ...
    data: any;    // JSON-LD object
}

/**
 * SEO Keywords for Auto-linking
 */
export interface SeoKeyword {
    id: string;
    keyword: string;
    targetUrl: string;
    linkLimit: number;
}

/**
 * GSC Performance Data
 */
export interface GscData {
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
    topQueries?: Array<{
        query: string;
        clicks: number;
        impressions: number;
        ctr: number;
        position: number;
    }>;
}

/**
 * SEO Trend Data
 */
export interface SeoTrendData {
    date: string;
    score: number;
}

/**
 * SEO Redirect Rule
 */
export interface SeoRedirect {
    id: string;
    fromUrl: string;
    toUrl: string;
    type: 301 | 302;
    isActive: boolean;
    createdAt?: string;
}

/**
 * SEO 404 Log
 */
export interface Seo404Log {
    id: string;
    url: string;
    referrer?: string;
    count: number;
    lastAccessed: string;
}

/**
 * SEO Robots Settings
 */
export interface SeoRobots {
    index: boolean;
    follow: boolean;
    advanced?: string; // e.g., "noarchive, nosnippet"
}

/**
 * SEO Duplicate Content Result
 */
export interface SeoDuplicateResult {
    similarity: number; // 0-1
    duplicatePosts: Array<{
        postId: string;
        title: string;
        slug: string;
        similarity: number;
    }>;
}

/**
 * SEO Auth URL
 */
export interface SeoAuthUrl {
    url: string;
}

/**
 * SEO Performance Overview (Site-wide)
 */
export interface SeoPerformance {
    overview: {
        totalClicks: number;
        totalImpressions: number;
        avgCtr: number;
        avgPosition: number;
    };
    topPerformingPosts: Array<{
        id: string;
        title: string;
        total_clicks: number;
        avg_position: number;
    }>;
}

/**
 * SEO Query Performance (Keywords)
 */
export interface SeoQueryPerformance {
    query: string;
    clicks: number;
    impressions: number;
    ctr?: number;
    position?: number;
}

/**
 * SEO Analysis for Drafts (AI/Real-time)
 */
export interface SeoAnalysisDraftResult {
    score: number;
    readabilityScore: number;
    suggestions: string[];
}

/**
 * SEO Dashboard Data
 */
export interface SeoDashboardData {
    health: SeoHealth;
    performance: SeoPerformance;
    trends: SeoTrendData[];
    topIssues: Array<{
        issue: string;
        count: number;
        severity: 'high' | 'medium' | 'low';
    }>;
}
