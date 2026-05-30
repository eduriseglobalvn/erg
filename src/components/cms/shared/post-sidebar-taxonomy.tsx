"use client"

import * as React from "react"
import { useEffect } from "react"
import { Button } from "@/components/cms/ui/button"
import { Label } from "@/components/cms/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/cms/ui/select"
import { ImagePlus, X } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { postsApi } from "@/services/posts.api"

interface PostSidebarTaxonomyProps {
    post: {
        categoryId?: string
        thumbnailUrl?: string | null
        status?: string
    }
    onUpdate: (data: Partial<PostSidebarTaxonomyProps["post"]>) => void
}

const statusOptions = [
    { value: "draft", label: "Bản nháp" },
    { value: "published", label: "Công khai" },
    { value: "private", label: "Riêng tư" },
]

export function PostSidebarTaxonomy({
    post,
    onUpdate,
}: PostSidebarTaxonomyProps) {
    const [isUploadingThumbnail, setIsUploadingThumbnail] = React.useState(false)
    const inputId = React.useId()
    const { data: categories } = useQuery({
        queryKey: ["categories"],
        queryFn: () => postsApi.getCategories(),
    })

    useEffect(() => {
        if (categories && categories.length > 0 && !post.categoryId) {
            onUpdate({ categoryId: categories[0].id })
        }
    }, [categories, post.categoryId, onUpdate])

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        try {
            setIsUploadingThumbnail(true)
            const result = await postsApi.uploadImage(file)
            onUpdate({ thumbnailUrl: result.url })
            toast.success("Đã tải ảnh đại diện lên hệ thống")
        } catch (error: any) {
            toast.error(error.message || "Lỗi khi tải ảnh đại diện")
        } finally {
            setIsUploadingThumbnail(false)
            event.target.value = ""
        }
    }

    return (
        <div className="space-y-5">
            <div className="grid gap-2">
                <Label className="text-xs font-bold">Trạng thái</Label>
                <Select
                    value={post.status || "draft"}
                    onValueChange={(value) => onUpdate({ status: value })}
                >
                    <SelectTrigger className="h-10 bg-white text-sm dark:bg-black">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {statusOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="grid gap-2">
                <Label className="text-xs font-bold">Chuyên mục</Label>
                <Select
                    value={post.categoryId || ""}
                    onValueChange={(value) => onUpdate({ categoryId: value })}
                >
                    <SelectTrigger className="h-10 bg-white text-sm font-medium dark:bg-black">
                        <SelectValue placeholder="Chọn chuyên mục" />
                    </SelectTrigger>
                    <SelectContent>
                        {categories?.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                                {category.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label className="text-xs font-bold">Ảnh đại diện</Label>
                <div className="overflow-hidden rounded-xl border bg-white">
                    {post.thumbnailUrl ? (
                        <div className="group relative aspect-video">
                            <img src={post.thumbnailUrl} alt="Ảnh đại diện bài viết" className="h-full w-full bg-zinc-900 object-contain" />
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute right-2 top-2 h-7 w-7 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                                onClick={() => onUpdate({ thumbnailUrl: null })}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            className="m-2 flex aspect-video w-[calc(100%-1rem)] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-200 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-white/5"
                            onClick={() => !isUploadingThumbnail && document.getElementById(inputId)?.click()}
                        >
                            <ImagePlus className="mb-2 h-6 w-6 text-zinc-400" />
                            <span className="text-xs font-bold uppercase tracking-tight text-zinc-400">
                                {isUploadingThumbnail ? "Đang tải ảnh..." : "Click để tải ảnh"}
                            </span>
                        </button>
                    )}
                    <input
                        id={inputId}
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleUpload}
                        disabled={isUploadingThumbnail}
                    />
                </div>
            </div>
        </div>
    )
}
