import React from 'react';
import { PostDetailResponse } from '@/services/posts.api';

// Mở rộng kiểu dữ liệu vì PostDetailResponse['data'] dường như thiếu thuộc tính 'meta'
type PostWithMeta = PostDetailResponse['data'] & {
    meta?: {
        toc?: Array<{ id: string; text: string }>;
    };
};

// AiSearchSummaryBox Helper cho Google AI Overview
export function AiSearchSummaryBox({ post }: { post: PostWithMeta | null }) {
    if (!post || !post.excerpt) return null;

    // Render key takeaways box ở đầu bài -> Google AI dễ trích dẫn (AI Overview Rule)
    return (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r-lg shadow-sm" aria-label="Tóm tắt nội dung chính">
            <h2 className="font-semibold text-lg mb-2 text-slate-800">Tóm tắt nội dung</h2>
            <p className="text-slate-700 leading-relaxed font-medium">{post.excerpt}</p>

            {post.meta && post.meta.toc && post.meta.toc.length > 0 && (
                <div className="mt-4 pt-3 border-t border-blue-200">
                    <p className="text-sm font-semibold text-slate-600 mb-2 uppercase tracking-wide">Mục lục chính</p>
                    <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                        {post.meta.toc.slice(0, 5).map(item => (
                            <li key={item.id} className="hover:text-blue-900 transition-colors">
                                <a href={`#${item.id}`}>{item.text}</a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
