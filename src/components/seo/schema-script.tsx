import React from 'react';
import { PostDetailResponse } from '@/services/posts.api';
import { SEO_DATA } from '@/constants/seo.constants';

type SchemaType =
    | 'WebSite'
    | 'Organization'
    | 'NewsArticle'
    | 'Article'
    | 'Course'
    | 'JobPosting'
    | 'BreadcrumbList'
    | 'SiteNavigationElement'
    | 'FAQPage'
    | 'VideoObject'
    | 'EducationalOrganization';

interface SchemaScriptProps {
    type: SchemaType;
    data: any;
    domain?: string;
}

export function SchemaScript({ type, data, domain = 'erg.edu.vn' }: SchemaScriptProps) {
    let schemaData = {};

    switch (type) {
        case 'WebSite':
            schemaData = {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": data.name || "Edurise Global",
                "url": data.url || `https://${domain}`,
                "potentialAction": {
                    "@type": "SearchAction",
                    "target": {
                        "@type": "EntryPoint",
                        "urlTemplate": `https://${domain}/tim-kiem?q={search_term_string}`
                    },
                    "query-input": "required name=search_term_string"
                }
            };
            break;

        case 'Organization':
        case 'EducationalOrganization':
            schemaData = {
                "@context": "https://schema.org",
                "@type": type,
                "name": "Edurise Global",
                "url": `https://${domain}`,
                "logo": "https://media.erg.edu.vn/logo/erg.png",
                "sameAs": [
                    "https://www.facebook.com/eduriseglobal",
                    "https://www.youtube.com/@eduriseglobal",
                    "https://www.linkedin.com/company/eduriseglobal"
                ],
                "contactPoint": {
                    "@type": "ContactPoint",
                    "telephone": "+84-766-144-888",
                    "contactType": "Customer Service",
                    "areaServed": "VN",
                    "availableLanguage": "Vietnamese"
                }
            };
            break;

        case 'SiteNavigationElement':
            // data là mảng MenuItemType[]
            const menuItems = Array.isArray(data) ? data : [];
            const itemListElement = menuItems.map((item: any, index: number) => ({
                "@type": "SiteNavigationElement",
                "position": index + 1,
                "name": item.label || item.name,
                "description": item.label || item.name,
                "url": item.path?.startsWith('http') ? item.path : `https://${domain}${item.path}`
            }));

            schemaData = {
                "@context": "https://schema.org",
                "@type": "ItemList",
                "itemListElement": itemListElement
            };
            break;

        case 'NewsArticle':
        case 'Article':
            schemaData = {
                "@context": "https://schema.org",
                "@type": type,
                "headline": data.title,
                "description": data.excerpt || data.description || data.title,
                "image": data.thumbnailUrl ? [data.thumbnailUrl] : (data.thumbnail ? [data.thumbnail] : ["https://media.erg.edu.vn/logo/erg.png"]),
                "datePublished": data.publishedAt || data.createdAt,
                "dateModified": data.updatedAt || data.createdAt,
                "author": [{
                    "@type": "Person",
                    "name": data.author?.fullName || "Ban biên tập ERG",
                    "url": data.author?.username ? `https://${domain}/tac-gia/${data.author.username}` : undefined
                }],
                "publisher": {
                    "@type": "Organization",
                    "name": "Edurise Global",
                    "logo": {
                        "@type": "ImageObject",
                        "url": "https://media.erg.edu.vn/logo/erg.png"
                    }
                },
                ...(data.rating && data.rating.count >= 3 && {
                    "aggregateRating": {
                        "@type": "AggregateRating",
                        "ratingValue": data.rating.average,
                        "reviewCount": data.rating.count,
                        "bestRating": 5,
                        "worstRating": 1
                    }
                })
            };
            break;

        case 'Course':
            schemaData = {
                "@context": "https://schema.org",
                "@type": "Course",
                "name": data.title,
                "description": data.description || data.title,
                "hasCourseInstance": {
                    "@type": "CourseInstance",
                    "courseMode": "Online", // Assuming default, can be extended if data provides it
                    "courseWorkload": "PT40H",
                    "instructor": {
                        "@type": "Organization",
                        "name": "Edurise Global",
                        "url": `https://${domain}`
                    }
                },
                "provider": {
                    "@type": "EducationalOrganization",
                    "name": "Edurise Global",
                    "sameAs": `https://${domain}`
                },
                ...(data.rating && data.rating.count >= 3 && {
                    "aggregateRating": {
                        "@type": "AggregateRating",
                        "ratingValue": data.rating.average,
                        "reviewCount": data.rating.count,
                        "bestRating": 5,
                        "worstRating": 1
                    }
                }),
                ...(data.price && {
                    "offers": {
                        "@type": "Offer",
                        "category": "Paid",
                        "price": data.price,
                        "priceCurrency": "VND"
                    }
                })
            };
            break;

        case 'BreadcrumbList':
            schemaData = {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": (data.items || []).map((item: any, index: number) => ({
                    "@type": "ListItem",
                    "position": index + 1,
                    "name": item.label,
                    "item": item.href ? (item.href.startsWith('http') ? item.href : `https://${domain}${item.href}`) : undefined
                }))
            };
            break;

        case 'FAQPage':
            schemaData = {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": (data.questions || []).map((q: any) => ({
                    "@type": "Question",
                    "name": q.question,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": q.answer
                    }
                }))
            };
            break;

        case 'JobPosting':
            schemaData = {
                "@context": "https://schema.org",
                "@type": "JobPosting",
                "title": data.title,
                "description": data.description,
                "datePosted": data.postedAt || data.createdAt,
                "validThrough": data.validThrough,
                "employmentType": data.type || "FULL_TIME",
                "hiringOrganization": {
                    "@type": "Organization",
                    "name": "Edurise Global",
                    "sameAs": `https://${domain}`
                },
                "jobLocation": {
                    "@type": "Place",
                    "address": {
                        "@type": "PostalAddress",
                        "addressLocality": data.location || "Toàn quốc",
                        "addressCountry": "VN"
                    }
                }
            };
            break;

        case 'VideoObject':
            schemaData = {
                "@context": "https://schema.org",
                "@type": "VideoObject",
                "name": data.name,
                "description": data.description,
                "thumbnailUrl": [data.thumbnailUrl],
                "uploadDate": data.uploadDate,
                "contentUrl": data.contentUrl,
                "embedUrl": data.embedUrl
            };
            break;

        default:
            schemaData = data;
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
    );
}
