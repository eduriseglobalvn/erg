"use client"

import { SeoAnalysis } from "@/types/seo";

const clamp = (value: number, min = 0, max = 100) => Math.max(min, Math.min(max, value));

function countKeyword(text: string, keyword: string) {
    if (!keyword.trim()) return 0;
    const normalizedText = text.toLowerCase();
    const normalizedKeyword = keyword.trim().toLowerCase();
    let count = 0;
    let index = normalizedText.indexOf(normalizedKeyword);

    while (index !== -1) {
        count += 1;
        index = normalizedText.indexOf(normalizedKeyword, index + normalizedKeyword.length);
    }

    return count;
}

function getDocumentFromHtml(content: string) {
    if (typeof DOMParser === "undefined") {
        return null;
    }

    return new DOMParser().parseFromString(content || "", "text/html");
}

/**
 * Fast client-side SEO estimate for editor feedback.
 * Server-side SEO APIs remain the source of truth for deeper analysis.
 */
export const localSeoAnalyzer = (
    content: string,
    title: string,
    metaDescription: string,
    keyword: string = "",
    slug: string = ""
): SeoAnalysis => {
    const doc = getDocumentFromHtml(content);
    const plainText = (doc?.body.textContent || content.replace(/<[^>]+>/g, " ")).trim();
    const words = plainText ? plainText.split(/\s+/).filter(Boolean) : [];
    const wordCount = words.length;
    const keywordCount = countKeyword(plainText, keyword);
    const keywordDensity = wordCount > 0 ? (keywordCount / wordCount) * 100 : 0;

    const headings = doc ? Array.from(doc.querySelectorAll("h1, h2, h3")) : [];
    const h1Count = headings.filter(h => h.tagName === "H1").length;
    const h2Count = headings.filter(h => h.tagName === "H2").length;
    const h3Count = headings.filter(h => h.tagName === "H3").length;

    const links = doc ? Array.from(doc.querySelectorAll("a")) : [];
    const images = doc ? Array.from(doc.querySelectorAll("img")) : [];
    const imagesWithAlt = images.filter(img => img.alt && img.alt.trim() !== "").length;
    const internalLinks = links.filter(a => {
        const href = a.getAttribute("href") || "";
        return href.startsWith("/") || href.includes("erg.edu.vn");
    }).length;
    const externalLinks = links.length - internalLinks;

    const titleHasKeyword = keyword ? title.toLowerCase().includes(keyword.toLowerCase()) : false;
    const metaHasKeyword = keyword ? metaDescription.toLowerCase().includes(keyword.toLowerCase()) : false;
    const contentHasKeyword = keyword ? keywordCount > 0 : true;
    const slugHasKeyword = keyword && slug
        ? slug.toLowerCase().includes(keyword.toLowerCase().replace(/\s+/g, "-"))
        : false;

    const suggestions: string[] = [];
    if (title.length < 30 || title.length > 70) {
        suggestions.push("Tiêu đề nên nằm trong khoảng 30-70 ký tự.");
    }
    if (keyword && !titleHasKeyword) {
        suggestions.push("Thêm từ khóa chính vào tiêu đề.");
    }
    if (metaDescription.length < 120 || metaDescription.length > 160) {
        suggestions.push("Meta description nên nằm trong khoảng 120-160 ký tự.");
    }
    if (keyword && !metaHasKeyword) {
        suggestions.push("Thêm từ khóa chính vào meta description.");
    }
    if (wordCount < 300) {
        suggestions.push("Nội dung nên có ít nhất 300 từ để đủ chiều sâu SEO.");
    }
    if (keyword && !contentHasKeyword) {
        suggestions.push("Bổ sung từ khóa chính một cách tự nhiên trong nội dung.");
    }
    if (h1Count > 0 || h2Count === 0) {
        suggestions.push("Trong nội dung bài viết nên dùng H2/H3 và tránh thêm H1.");
    }
    if (images.length > imagesWithAlt) {
        suggestions.push("Bổ sung alt text cho tất cả hình ảnh.");
    }
    if (internalLinks === 0) {
        suggestions.push("Thêm liên kết nội bộ tới nội dung liên quan.");
    }

    const titleScore = title.length >= 30 && title.length <= 70 ? 15 : 7;
    const metaScore = metaDescription.length >= 120 && metaDescription.length <= 160 ? 15 : 7;
    const keywordScore = (titleHasKeyword ? 10 : 0)
        + (metaHasKeyword ? 10 : 0)
        + (contentHasKeyword ? 10 : 0)
        + (slugHasKeyword ? 5 : 0);
    const structureScore = h1Count === 0 && h2Count > 0 ? 15 : 7;
    const contentScore = wordCount >= 800 ? 15 : wordCount >= 300 ? 10 : 4;
    const mediaScore = images.length === 0 || images.length === imagesWithAlt ? 10 : 4;
    const linkScore = internalLinks > 0 ? 10 : 3;
    const overallScore = clamp(titleScore + metaScore + keywordScore + structureScore + contentScore + mediaScore + linkScore);

    const sentenceCount = Math.max(1, plainText.split(/[.!?]+/).filter(Boolean).length);
    const avgWordsPerSentence = wordCount / sentenceCount;
    const readabilityScore = clamp(100 - Math.max(0, avgWordsPerSentence - 18) * 2);

    return {
        overallScore,
        titleAnalysis: {
            length: title.length,
            hasKeyword: titleHasKeyword,
            suggestions: suggestions.filter(item => item.toLowerCase().includes("tiêu đề")),
        },
        metaAnalysis: {
            length: metaDescription.length,
            hasKeyword: metaHasKeyword,
            suggestions: suggestions.filter(item => item.toLowerCase().includes("meta")),
        },
        contentAnalysis: {
            wordCount,
            keywordDensity,
            readabilityScore,
            headingStructure: {
                h1: h1Count,
                h2: h2Count,
                h3: h3Count,
                valid: h1Count === 0 && h2Count > 0,
            },
            paragraphCount: Math.max(1, plainText.split(/\n\s*\n/).filter(Boolean).length),
        },
        technicalAnalysis: {
            hasCanonical: false,
            hasSchema: false,
            imageAltTags: {
                total: images.length,
                withAlt: imagesWithAlt,
            },
            internalLinks,
            externalLinks,
        },
        suggestions: suggestions.slice(0, 5),
    };
};
