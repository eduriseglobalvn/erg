"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/cms/ui/card"
import { Label } from "@/components/cms/ui/label"
import { Input } from "@/components/cms/ui/input"
import { Button } from "@/components/cms/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/cms/ui/tabs"
import dynamic from 'next/dynamic'
import {
    ImagePlus,
    X,
    Globe,
    Eye,
    DraftingCompass,
    Settings2,
    BarChart4
} from "lucide-react"
import { useState } from "react"
import { KeywordSuggestionPanel } from "@/components/seo/keyword-suggestion-panel"
import { KeywordTagInput } from "@/components/seo/keyword-tag-input"
import { useQuery } from "@tanstack/react-query"
import { postsApi } from "@/services/posts.api"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { enablePreview } from "@/actions/preview.action"

interface PostSidebarMetaProps {
    post: {
        id?: string
        title: string
        content: string
        slug?: string
        excerpt?: string
        seoScore?: number
        metaTitle?: string
        metaDescription?: string
        keywords?: string
        schemaType?: string
        focusKeyword?: string
        canonicalUrl?: string
        noindex?: boolean
        nofollow?: boolean
        thumbnailUrl?: string | null
        status?: string
    }
    onUpdate: (data: Partial<PostSidebarMetaProps["post"]>) => void
    onSave: () => void
    onSaveDraft?: () => void
    isSaving?: boolean
    editor?: any
}

export function PostSidebarMeta({
    post,
    onUpdate,
    onSave,
    onSaveDraft,
    isSaving,
    editor,
}: PostSidebarMetaProps) {
    const [currentPreviewId, setCurrentPreviewId] = useState<string | null>(null)
    const [isPreviewLoading, setIsPreviewLoading] = useState(false)

    const getScoreColor = (score: number) => {
        if (score < 50) return "bg-red-500 text-red-500"
        if (score < 80) return "bg-amber-500 text-amber-500"
        return "bg-green-500 text-green-500"
    }

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            onUpdate({ thumbnailUrl: URL.createObjectURL(file) })
        }
    }

    const handlePreview = async () => {
        const currentContent = editor ? editor.getHTML() : post.content

        if (!post.title || !currentContent || currentContent === '<p></p>' || currentContent === '') {
            toast.error("Vui lòng nhập tiêu đề và nội dung để xem trước")
            return
        }

        setIsPreviewLoading(true)

        let previewWindow: Window | null = null
        const isFirstTime = !currentPreviewId

        if (isFirstTime) {
            previewWindow = window.open('about:blank', '_blank')
        }

        try {
            const res = await postsApi.createPreview({
                id: currentPreviewId,
                ...post,
                content: currentContent,
                slug: post.slug || "preview-temp"
            })

            const previewId = (res as any).id
            setCurrentPreviewId(previewId)

            if (isFirstTime && previewWindow) {
                const slug = post.slug || "preview-temp"
                const previewUrl = await enablePreview(previewId, slug)
                previewWindow.location.href = previewUrl
                toast.success("Đang mở trang xem trước...")
            } else {
                toast.success("Đã cập nhật nội dung! Hãy F5 tab Preview cũ.")
            }
        } catch (error: any) {
            if (previewWindow) previewWindow.close()
            toast.error("Lỗi khi tạo bản xem trước: " + error.message)
        } finally {
            setIsPreviewLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            {/* SEO Score mini */}
            {post.seoScore !== undefined && (
                <div className="bg-white dark:bg-white/5 rounded-xl p-3 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">SEO Score</span>
                        <span className={`text-xs font-black ${getScoreColor(post.seoScore).split(' ')[1]}`}>
                            {post.seoScore}/100
                        </span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-100 dark:bg-white/10 rounded-full overflow-hidden">
                        <div
                            className={`h-full transition-all duration-500 ${getScoreColor(post.seoScore).split(' ')[0]}`}
                            style={{ width: `${post.seoScore}%` }}
                        />
                    </div>
                </div>
            )}

            {/* SEO Meta Fields */}
            <div className="space-y-4 pb-10">
                <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Tùy chỉnh SEO</h3>

                <div className="grid gap-2">
                    <Label className="text-xs font-bold">Meta Title</Label>
                    <Input
                        placeholder={post.title || "Tiêu đề bài viết"}
                        className="bg-white dark:bg-black h-9 text-sm"
                        value={post.metaTitle || ""}
                        onChange={(e) => onUpdate({ metaTitle: e.target.value })}
                    />
                    <div className="flex justify-between items-center px-1">
                        <span className="text-[9px] text-muted-foreground italic">Hiển thị trên kết quả tìm kiếm</span>
                        <span className={cn("text-[9px] font-bold", (post.metaTitle?.length || 0) > 60 ? "text-red-500" : "text-muted-foreground")}>
                            {post.metaTitle?.length || 0}/60
                        </span>
                    </div>
                </div>

                <div className="grid gap-2">
                    <Label className="text-xs font-bold">Mô tả ngắn (Sapo)</Label>
                    <textarea
                        className="flex w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[80px]"
                        placeholder="Tóm tắt nội dung bài viết..."
                        value={post.excerpt || ""}
                        onChange={(e) => onUpdate({ excerpt: e.target.value })}
                    />
                </div>

                <div className="grid gap-2">
                    <Label className="text-xs font-bold">Meta Description</Label>
                    <textarea
                        className="flex w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[80px]"
                        placeholder="Mô tả cho Google..."
                        value={post.metaDescription || ""}
                        onChange={(e) => onUpdate({ metaDescription: e.target.value })}
                    />
                    <div className="flex justify-between items-center px-1">
                        <span className="text-[9px] text-muted-foreground italic">Tối ưu từ 120-160 ký tự</span>
                        <span className={cn("text-[9px] font-bold", (post.metaDescription?.length || 0) > 160 ? "text-red-500" : "text-muted-foreground")}>
                            {post.metaDescription?.length || 0}/160
                        </span>
                    </div>
                </div>

                <div className="grid gap-2">
                    <Label className="text-xs font-bold">Focus Keyword</Label>
                    <Input
                        placeholder="Từ khóa chính..."
                        className="bg-white dark:bg-black h-9 text-sm"
                        value={post.keywords || ""}
                        onChange={(e) => onUpdate({ keywords: e.target.value })}
                    />
                </div>

                <div className="grid gap-2">
                    <Label className="text-xs font-bold">Schema Type</Label>
                    <Input
                        placeholder="Article"
                        className="bg-white dark:bg-black h-9 text-sm"
                        value={post.schemaType || "Article"}
                        onChange={(e) => onUpdate({ schemaType: e.target.value })}
                    />
                </div>

                <div className="grid gap-2">
                    <Label className="text-xs font-bold">Canonical URL</Label>
                    <div className="relative">
                        <Globe className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-400" />
                        <Input
                            placeholder="https://erg.edu.vn/tin-tuc/..."
                            className="pl-9 bg-white dark:bg-black h-9 text-xs"
                            value={post.canonicalUrl || ""}
                            onChange={(e) => onUpdate({ canonicalUrl: e.target.value })}
                        />
                    </div>
                </div>

                <div className="grid gap-2">
                    <Label className="text-xs font-bold">Robots</Label>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                checked={post.noindex || false}
                                onChange={(e) => onUpdate({ noindex: e.target.checked })}
                            />
                            noindex
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                checked={post.nofollow || false}
                                onChange={(e) => onUpdate({ nofollow: e.target.checked })}
                            />
                            nofollow
                        </label>
                    </div>
                </div>
            </div>
        </div>
    )
}
