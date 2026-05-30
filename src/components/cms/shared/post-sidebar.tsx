"use client"

import { Button } from "@/components/cms/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/cms/ui/tabs"
import dynamic from 'next/dynamic'
import {
    Eye,
    DraftingCompass,
    Settings2,
    BarChart4
} from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { postsApi } from "@/services/posts.api"
import { enablePreview } from "@/actions/preview.action"

// Sub-components
import { PostSidebarMeta } from "@/components/cms/shared/post-sidebar-meta"
import { PostSidebarTaxonomy } from "@/components/cms/shared/post-sidebar-taxonomy"

const SeoAnalysisPanel = dynamic(
    () => import('@/components/cms/seo/SeoAnalysisPanel').then(mod => ({ default: mod.SeoAnalysisPanel })),
    { ssr: false, loading: () => <div className="p-4 text-center text-sm text-muted-foreground animate-pulse">Đang tải công cụ phân tích...</div> }
)

interface PostData {
    id?: string;
    title: string;
    content: string;
    slug?: string;
    excerpt?: string;
    categoryId?: string;
    seoScore?: number;
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string;
    schemaType?: string;
    focusKeyword?: string;
    canonicalUrl?: string;
    noindex?: boolean;
    nofollow?: boolean;
    thumbnailUrl?: string | null;
    status?: string;
}

export function PostSidebar({
    post,
    onUpdate,
    onSave,
    onSaveDraft,
    isSaving,
    editor
}: {
    post: PostData,
    onUpdate: (data: Partial<PostData>) => void,
    onSave: () => void,
    onSaveDraft?: () => void,
    isSaving?: boolean,
    editor?: any
}) {
    const [currentPreviewId, setCurrentPreviewId] = useState<string | null>(null);
    const [isPreviewLoading, setIsPreviewLoading] = useState(false);

    const handlePreview = async () => {
        const currentContent = editor ? editor.getHTML() : post.content;

        if (!post.title || !currentContent || currentContent === '<p></p>' || currentContent === '') {
            toast.error("Vui lòng nhập tiêu đề và nội dung để xem trước");
            return;
        }

        setIsPreviewLoading(true);

        let previewWindow: Window | null = null;
        const isFirstTime = !currentPreviewId;

        if (isFirstTime) {
            previewWindow = window.open('about:blank', '_blank');
        }

        try {
            const res = await postsApi.createPreview({
                id: currentPreviewId,
                ...post,
                content: currentContent,
                slug: post.slug || "preview-temp"
            });

            const previewId = (res as any).id;
            setCurrentPreviewId(previewId);

            if (isFirstTime && previewWindow) {
                const slug = post.slug || "preview-temp";
                const previewUrl = await enablePreview(previewId, slug);
                previewWindow.location.href = previewUrl;
                toast.success("Đang mở trang xem trước...");
            } else {
                toast.success("Đã cập nhật nội dung! Hãy F5 tab Preview cũ.");
            }
        } catch (error: any) {
            if (previewWindow) previewWindow.close();
            toast.error("Lỗi khi tạo bản xem trước: " + error.message);
        } finally {
            setIsPreviewLoading(false);
        }
    };

    return (
        <div className="w-full h-full flex flex-col border-l bg-gray-50/50 dark:bg-zinc-900/50 relative">
            {/* 1. CỤM NÚT HÀNH ĐỘNG (STICKY HEADER) */}
            <div className="p-4 bg-gray-50/95 dark:bg-zinc-900/95 backdrop-blur border-b shadow-sm shrink-0">
                <div className="flex flex-col gap-2">
                    <Button
                        className="w-full bg-black hover:bg-zinc-800 text-white dark:bg-white dark:text-black font-semibold shadow-sm"
                        onClick={onSave}
                        disabled={isSaving}
                    >
                        {isSaving ? "Đang lưu..." : (post.id ? "Cập nhật bài viết" : "Đăng bài viết")}
                    </Button>

                    <div className="grid grid-cols-2 gap-2">
                        <Button
                            variant="outline"
                            className="w-full bg-white dark:bg-black text-[11px] px-2 flex gap-1.5 items-center font-bold h-9 border-zinc-200 dark:border-zinc-800"
                            onClick={handlePreview}
                            disabled={isPreviewLoading}
                        >
                            {isPreviewLoading ? (
                                <span className="animate-spin mr-1 text-zinc-500">⌛</span>
                            ) : (
                                <Eye className="w-3.5 h-3.5" />
                            )}
                            Xem trước
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full bg-white dark:bg-black text-[11px] px-2 flex gap-1.5 items-center font-bold h-9 border-zinc-200 dark:border-zinc-800"
                            onClick={onSaveDraft || onSave}
                            disabled={isSaving}
                        >
                            <DraftingCompass className="w-3.5 h-3.5" />
                            Lưu nháp
                        </Button>
                    </div>
                </div>
            </div>

            {/* 2. TABS CONTENT */}
            <Tabs defaultValue="settings" className="flex-1 flex flex-col min-h-0">
                <div className="px-4 pt-4 shrink-0">
                    <TabsList className="w-full grid grid-cols-2 bg-zinc-200/50 dark:bg-white/5 rounded-lg p-1">
                        <TabsTrigger value="settings" className="text-xs font-bold gap-2 py-1.5">
                            <Settings2 className="w-3.5 h-3.5" />
                            Cài đặt
                        </TabsTrigger>
                        <TabsTrigger value="seo" className="text-xs font-bold gap-2 py-1.5">
                            <BarChart4 className="w-3.5 h-3.5" />
                            SEO
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="settings" className="flex-1 mt-0 overflow-y-auto">
                    <div className="p-4 space-y-6">
                        <PostSidebarTaxonomy post={post} onUpdate={onUpdate} />
                        <PostSidebarMeta
                            post={post}
                            onUpdate={onUpdate}
                            onSave={onSave}
                            onSaveDraft={onSaveDraft}
                            isSaving={isSaving}
                            editor={editor}
                        />
                    </div>
                </TabsContent>

                <TabsContent value="seo" className="flex-1 mt-0 overflow-y-auto bg-zinc-50/50 dark:bg-white/5">
                    {post.id ? (
                        <SeoAnalysisPanel
                            postId={post.id}
                            liveData={{
                                title: post.title || "",
                                content: editor ? editor.getHTML() : post.content,
                                metaDescription: post.metaDescription || "",
                                keyword: post.keywords || "",
                                slug: post.slug || ""
                            }}
                        />
                    ) : (
                        <div className="p-10 text-center flex flex-col items-center justify-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                                <BarChart4 className="w-6 h-6 text-zinc-400" />
                            </div>
                            <p className="text-sm text-zinc-500 font-medium">Vui lòng lưu bài viết trước khi phân tích SEO chi tiết.</p>
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    )
}
