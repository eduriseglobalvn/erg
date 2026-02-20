"use client"

import { Paper, Researcher, ContentAssessor } from 'yoastseo';
import { SeoAnalysis } from "@/types/seo";

/**
 * Utility for Client-side SEO Analysis using YoastSEO Engine
 * Giúp phân tích real-time nội dung bài viết ngay khi người dùng đang gõ
 */
export const localSeoAnalyzer = (
    content: string,
    title: string,
    metaDescription: string,
    keyword: string = "",
    slug: string = ""
): SeoAnalysis => {
    // 1. Create a Yoast Paper object
    const paper = new Paper(content, {
        keyword: keyword,
        title: title,
        description: metaDescription,
        url: slug,
        locale: "vi_VN"
    });

    // 2. Use Yoast Researcher and Assessor
    const researcher = new Researcher(paper);
    const assessor = new ContentAssessor(researcher);
    assessor.assess(paper);

    // 3. Extract and map results
    const results = assessor.getValidResults();

    // Calculate an average score from Yoast's "traffic lights"
    // Yoast ratings: 0-2 (red), 3-5 (orange), 6-9 (green)
    // We map this to 0-100
    const ratings = results.map((r: any) => r.rating);
    const avgRating = ratings.length > 0 ? (ratings.reduce((a: number, b: number) => a + b, 0) / (ratings.length * 9)) * 100 : 0;
    const overallScore = Math.max(0, Math.min(100, Math.round(avgRating)));

    // Extract suggestions from red/orange results
    const suggestions = results
        .filter((r: any) => r.rating < 6) // Non-green results
        .sort((a: any, b: any) => a.rating - b.rating) // Worst first
        .map((r: any) => r.text)
        .slice(0, 5);

    // Parse content for additional stats (DOM based)
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const plainText = doc.body.textContent || "";
    const wordCount = plainText.trim().split(/\s+/).length;

    const headings = Array.from(doc.querySelectorAll("h1, h2, h3"));
    const h1Count = headings.filter(h => h.tagName === "H1").length;
    const h2Count = headings.filter(h => h.tagName === "H2").length;
    const h3Count = headings.filter(h => h.tagName === "H3").length;

    const links = Array.from(doc.querySelectorAll("a"));
    const images = Array.from(doc.querySelectorAll("img"));
    const imagesWithAlt = images.filter(img => img.alt && img.alt.trim() !== "").length;

    const internalLinks = links.filter(a => a.href && (a.href.startsWith("/") || a.href.includes("erg.edu.vn"))).length;
    const externalLinks = links.length - internalLinks;

    return {
        overallScore,
        titleAnalysis: {
            length: title.length,
            hasKeyword: keyword ? title.toLowerCase().includes(keyword.toLowerCase()) : false,
            suggestions: results.filter((r: any) => r.text.toLowerCase().includes('title')).map((r: any) => r.text)
        },
        metaAnalysis: {
            length: metaDescription.length,
            hasKeyword: keyword ? metaDescription.toLowerCase().includes(keyword.toLowerCase()) : false,
            suggestions: results.filter((r: any) => r.text.toLowerCase().includes('description')).map((r: any) => r.text)
        },
        contentAnalysis: {
            wordCount,
            keywordDensity: (researcher.getKeywordDensity() * 100),
            readabilityScore: researcher.getFleschReadingEaseScore(),
            headingStructure: {
                h1: h1Count,
                h2: h2Count,
                h3: h3Count,
                valid: h1Count === 0 && h2Count > 0
            },
            paragraphCount: plainText.split(/\n\s*\n/).length
        },
        technicalAnalysis: {
            hasCanonical: false,
            hasSchema: false,
            imageAltTags: {
                total: images.length,
                withAlt: imagesWithAlt
            },
            internalLinks,
            externalLinks
        },
        suggestions
    };
};
