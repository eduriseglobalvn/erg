"use client"

import * as React from "react"
import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card"
import { Label } from "@/components/admin/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/admin/ui/select"
import { Button } from "@/components/admin/ui/button"
import { ImagePlus, X } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { postsApi } from "@/services/posts.api"

interface PostSidebarTaxonomyProps {
    post: {
        categoryId?: string
        thumbnailUrl?: string | null
        status?: string
    }
    onUpdate: (data: Partial<PostSidebarTaxonomyProps["post"]>) => void
}

export function PostSidebarTaxonomy({
    post,
    onUpdate,
}: PostSidebarTaxonomyProps) {
    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: () => postsApi.getCategories()
    })

    // Auto-select first category if empty
    useEffect(() => {
        if (categories && categories.length > 0 && !post.categoryId) {
            onUpdate({ categoryId: categories[0].id })
        }
    }, [categories, post.categoryId, onUpdate])

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            onUpdate({ thumbnailUrl: URL.createObjectURL(file) })
        }
    }

    return (
        <div className="space-y-6">
            {/* Status & Visibility */}
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

            {/* Thumbnail */}
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
        </div>
    )
}
