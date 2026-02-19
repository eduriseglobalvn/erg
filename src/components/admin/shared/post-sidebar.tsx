"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card"
import { Label } from "@/components/admin/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/admin/ui/select"
import { Input } from "@/components/admin/ui/input"
import { Button } from "@/components/admin/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/admin/ui/tabs"
import { SeoAnalysisPanel } from "@/components/admin/seo/SeoAnalysisPanel"
import {
    ImagePlus,
    X,
    Globe,
    Eye,
    Trash,
    DraftingCompass,
    Settings2,
    BarChart4
} from "lucide-react"
import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { postsApi } from "@/services/posts.api"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

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

    // 1. Fetch Categories
    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: () => postsApi.getCategories()
    })

    // Tự động chọn chuyên mục đầu tiên nếu đang trống
    useEffect(() => {
        if (categories && categories.length > 0 && !post.categoryId) {
            onUpdate({ categoryId: categories[0].id });
        }
    }, [categories, post.categoryId, onUpdate])

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            onUpdate({ thumbnailUrl: URL.createObjectURL(file) })
        }
    }

    // [HELPER] Get SEO Score Color
    const getScoreColor = (score: number) => {
        if (score < 50) return "bg-red-500 text-red-500";
        if (score < 80) return "bg-amber-500 text-amber-500";
        return "bg-green-500 text-green-500";
    }

    const handlePreview = async () => {
        const currentContent = editor ? editor.getHTML() : post.content;

        if (!post.title || !currentContent || currentContent === '<p></p>' || currentContent === '') {
            toast.error("Vui lòng nhập tiêu đề và nội dung để xem trước");
            return;
        }

        setIsPreviewLoading(true);

        // Mở tab trống trước để tránh bị Popup Blocker chặn
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
                const PREVIEW_SECRET = "erg_preview_secret_2026";
                const slug = post.slug || "preview-temp";
                const mainDomain = process.env.NEXT_PUBLIC_DOMAIN || "https://erg.edu.vn";
                const previewUrl = `${mainDomain}/api/preview?id=${previewId}&slug=${slug}&secret=${PREVIEW_SECRET}`;
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
                        {/* Score SEO Display (Mini version if desired) */}
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

                        {/* Trạng thái & Hiển thị */}
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Phân loại</h3>

                            <div className="grid gap-2">
                                <Label className="text-xs font-bold">Trạng thái</Label>
                                <Select
                                    value={post.status || "draft"}
                                    onValueChange={(val) => onUpdate({ status: val })}
                                >
                                    <SelectTrigger className="bg-white dark:bg-black h-9 text-sm"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="draft">Bản nháp</SelectItem>
                                        <SelectItem value="published">Công khai</SelectItem>
                                        <SelectItem value="private">Riêng tư</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <Label className="text-xs font-bold">Chuyên mục</Label>
                                <Select
                                    value={post.categoryId || ""}
                                    onValueChange={(val) => onUpdate({ categoryId: val })}
                                >
                                    <SelectTrigger className="bg-white dark:bg-black h-9 text-sm font-medium">
                                        <SelectValue placeholder="Chọn chuyên mục" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories?.map(cat => (
                                            <SelectItem key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="h-px bg-zinc-100 dark:bg-zinc-800" />

                        {/* Ảnh đại diện */}
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Hình ảnh</h3>
                            <Card className="overflow-hidden bg-white dark:bg-black shadow-none border border-zinc-200 dark:border-zinc-800 rounded-xl">
                                <CardHeader className="p-3 bg-zinc-50 dark:bg-white/5 border-b">
                                    <CardTitle className="text-[10px] font-bold uppercase text-muted-foreground tracking-tight">Ảnh đại diện (Thumbnail)</CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    {post.thumbnailUrl ? (
                                        <div className="relative aspect-video group">
                                            <img src={post.thumbnailUrl} alt="Thumbnail" className="w-full h-full object-contain bg-zinc-900" />
                                            <Button
                                                variant="destructive" size="icon"
                                                className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
                                                onClick={() => onUpdate({ thumbnailUrl: null })}
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <div
                                            className="aspect-video flex flex-col items-center justify-center hover:bg-zinc-50 dark:hover:bg-white/5 cursor-pointer transition-colors border-2 border-dashed border-zinc-200 dark:border-zinc-800 m-2 rounded-xl"
                                            onClick={() => document.getElementById('thumb-upload')?.click()}
                                        >
                                            <ImagePlus className="w-6 h-6 text-zinc-400 mb-2" />
                                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">Click để tải ảnh</span>
                                            <input id="thumb-upload" type="file" className="hidden" accept="image/*" onChange={handleUpload} />
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        <div className="h-px bg-zinc-100 dark:bg-zinc-800" />

                        {/* SEO Configuration */}
                        <div className="space-y-4 pb-10">
                            <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Tùy chọn SEO</h3>

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
                                <Select
                                    value={post.schemaType || "Article"}
                                    onValueChange={(val) => onUpdate({ schemaType: val })}
                                >
                                    <SelectTrigger className="bg-white dark:bg-black h-9 text-sm"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Article">Article (Mặc định)</SelectItem>
                                        <SelectItem value="Course">Khóa học (Course)</SelectItem>
                                        <SelectItem value="JobPosting">Tuyển dụng (JobPosting)</SelectItem>
                                        <SelectItem value="NewsArticle">Tin tức (NewsArticle)</SelectItem>
                                        <SelectItem value="FAQPage">Câu hỏi (FAQPage)</SelectItem>
                                        <SelectItem value="VideoObject">Video</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <Label className="text-xs font-bold">URL Slug</Label>
                                <div className="relative">
                                    <Globe className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-400" />
                                    <Input
                                        placeholder="tu-dong-tao-slug"
                                        className="pl-9 bg-white dark:bg-black h-9 text-xs"
                                        value={post.slug || ""}
                                        onChange={(e) => onUpdate({ slug: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
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