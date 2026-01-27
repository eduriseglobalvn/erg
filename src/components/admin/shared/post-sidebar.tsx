"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card"
import { Label } from "@/components/admin/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/admin/ui/select"
import { Input } from "@/components/admin/ui/input"
import { Button } from "@/components/admin/ui/button"
import { ImagePlus, X, Globe, Eye, Trash, DraftingCompass } from "lucide-react" // Thêm icon Eye cho Preview
import { useState } from "react"

import { useQuery } from "@tanstack/react-query"
import { postsApi } from "@/services/posts.api"
import { useEffect } from "react"

interface PostData {
    id?: string;
    title: string;
    content: string;
    slug?: string;
    excerpt?: string;
    categoryId?: string;
    thumbnailUrl?: string | null;
    status?: string;
}

export function PostSidebar({
    post,
    onUpdate,
    onSave,
    isSaving
}: {
    post: PostData,
    onUpdate: (data: Partial<PostData>) => void,
    onSave: () => void,
    isSaving?: boolean
}) {
    // 1. Fetch Categories
    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: () => postsApi.getCategories().then(res => res.data)
    })

    // [NEW] Tự động chọn chuyên mục đầu tiên nếu đang trống
    useEffect(() => {
        if (categories && categories.length > 0 && !post.categoryId) {
            onUpdate({ categoryId: categories[0].id });
        }
    }, [categories, post.categoryId, onUpdate])

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            // In real app, upload to S3/Server and get URL
            // For now, simulated
            onUpdate({ thumbnailUrl: URL.createObjectURL(file) })
        }
    }

    return (
        <div className="w-full h-full overflow-y-auto border-l bg-gray-50/50 dark:bg-zinc-900/50 relative">

            {/* 1. CỤM NÚT HÀNH ĐỘNG (STICKY HEADER) */}
            <div className="sticky top-0 z-10 p-4 bg-gray-50/95 dark:bg-zinc-900/95 backdrop-blur border-b shadow-sm">
                <div className="flex flex-col gap-2">
                    <Button
                        className="w-full bg-black hover:bg-zinc-800 text-white dark:bg-white dark:text-black font-semibold"
                        onClick={onSave}
                        disabled={isSaving}
                    >
                        {isSaving ? "Đang lưu..." : (post.id ? "Cập nhật bài viết" : "Đăng bài viết")}
                    </Button>

                    <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" className="w-full bg-white dark:bg-black text-xs px-2 flex gap-1 items-center">
                            <Eye className="w-3 h-3" />
                            Preview
                        </Button>
                        <Button variant="outline" className="w-full bg-white dark:bg-black text-xs px-2" onClick={onSave}>
                            <DraftingCompass className="w-3 h-3" />
                            Lưu bản nháp
                        </Button>
                    </div>
                </div>
            </div>

            {/* 2. CÁC PHẦN CÀI ĐẶT BÊN DƯỚI */}
            <div className="p-4 space-y-6">

                {/* Trạng thái & Hiển thị */}
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Hiển thị</h3>

                    <div className="grid gap-2">
                        <Label>Trạng thái</Label>
                        <Select
                            value={post.status || "draft"}
                            onValueChange={(val) => onUpdate({ status: val })}
                        >
                            <SelectTrigger className="bg-white dark:bg-black"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="draft">Bản nháp</SelectItem>
                                <SelectItem value="published">Công khai</SelectItem>
                                <SelectItem value="private">Riêng tư</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label>Chuyên mục</Label>
                        <Select
                            value={post.categoryId || ""}
                            onValueChange={(val) => onUpdate({ categoryId: val })}
                        >
                            <SelectTrigger className="bg-white dark:bg-black font-medium">
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

                <div className="h-px bg-border" />

                {/* Ảnh đại diện */}
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Media</h3>
                    <Card className="overflow-hidden bg-white dark:bg-black shadow-none border">
                        <CardHeader className="p-3 bg-muted/20 border-b">
                            <CardTitle className="text-[11px] font-bold uppercase text-muted-foreground">Ảnh đại diện (Thumbnail)</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {post.thumbnailUrl ? (
                                <div className="relative aspect-video group">
                                    <img src={post.thumbnailUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                                    <Button
                                        variant="destructive" size="icon"
                                        className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => onUpdate({ thumbnailUrl: null })}
                                    >
                                        <X className="w-3 h-3" />
                                    </Button>
                                </div>
                            ) : (
                                <div
                                    className="aspect-video flex flex-col items-center justify-center hover:bg-muted/50 cursor-pointer transition-colors border-2 border-dashed border-zinc-200 m-2 rounded-lg"
                                    onClick={() => document.getElementById('thumb-upload')?.click()}
                                >
                                    <ImagePlus className="w-6 h-6 text-muted-foreground mb-2" />
                                    <span className="text-[11px] font-bold text-muted-foreground uppercase">Tải ảnh lên</span>
                                    <input id="thumb-upload" type="file" className="hidden" accept="image/*" onChange={handleUpload} />
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="h-px bg-border" />

                {/* SEO */}
                <div className="space-y-4 pb-10">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">SEO & URL</h3>
                    <div className="grid gap-2">
                        <Label>Đường dẫn (Slug)</Label>
                        <div className="relative">
                            <Globe className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="tu-dong-tao-slug"
                                className="pl-8 bg-white dark:bg-black"
                                value={post.slug || ""}
                                onChange={(e) => onUpdate({ slug: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label>Mô tả ngắn</Label>
                        <textarea
                            className="flex w-full rounded-md border border-input bg-white dark:bg-black px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[80px]"
                            placeholder="Mô tả sẽ hiển thị trên Google..."
                            value={post.excerpt || ""}
                            onChange={(e) => onUpdate({ excerpt: e.target.value })}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}