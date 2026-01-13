"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card"
import { Label } from "@/components/admin/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/admin/ui/select"
import { Input } from "@/components/admin/ui/input"
import { Button } from "@/components/admin/ui/button"
import {ImagePlus, X, Globe, Eye, Trash, DraftingCompass} from "lucide-react" // Thêm icon Eye cho Preview
import { useState } from "react"

export function PostSidebar() {
    const [thumbnail, setThumbnail] = useState<string | null>(null)

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) setThumbnail(URL.createObjectURL(file))
    }

    return (
        <div className="w-full h-full overflow-y-auto border-l bg-gray-50/50 dark:bg-zinc-900/50 relative">

            {/* 1. CỤM NÚT HÀNH ĐỘNG (STICKY HEADER) */}
            <div className="sticky top-0 z-10 p-4 bg-gray-50/95 dark:bg-zinc-900/95 backdrop-blur border-b shadow-sm">
                <div className="flex flex-col gap-2">
                    {/* Nút Đăng bài viết nằm trên cùng */}
                    <Button className="w-full bg-black hover:bg-zinc-800 text-white dark:bg-white dark:text-black font-semibold">
                        Đăng bài viết
                    </Button>

                    {/* Hàng chứa Lưu bản nháp và Preview */}
                    <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" className="w-full bg-white dark:bg-black text-xs px-2 flex gap-1 items-center">
                            <Eye className="w-3 h-3" />
                            Preview
                        </Button>
                        <Button variant="outline" className="w-full bg-white dark:bg-black text-xs px-2">
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
                        <Select defaultValue="draft">
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
                        <Select>
                            <SelectTrigger className="bg-white dark:bg-black"><SelectValue placeholder="Chọn chuyên mục" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="edu">Giáo dục</SelectItem>
                                <SelectItem value="tech">Công nghệ</SelectItem>
                                <SelectItem value="news">Tin tức</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="h-px bg-border" />

                {/* Ảnh đại diện */}
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Media</h3>
                    <Card className="overflow-hidden bg-white dark:bg-black">
                        <CardHeader className="p-3 bg-muted/20 border-b">
                            <CardTitle className="text-xs font-medium">Ảnh đại diện (Thumbnail)</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {thumbnail ? (
                                <div className="relative aspect-video group">
                                    <img src={thumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
                                    <Button
                                        variant="destructive" size="icon"
                                        className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => setThumbnail(null)}
                                    >
                                        <X className="w-3 h-3" />
                                    </Button>
                                </div>
                            ) : (
                                <div
                                    className="aspect-video flex flex-col items-center justify-center hover:bg-muted/50 cursor-pointer transition-colors"
                                    onClick={() => document.getElementById('thumb-upload')?.click()}
                                >
                                    <ImagePlus className="w-6 h-6 text-muted-foreground mb-2" />
                                    <span className="text-xs text-muted-foreground">Tải ảnh lên</span>
                                    <input id="thumb-upload" type="file" className="hidden" accept="image/*" onChange={handleUpload}/>
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
                            <Input placeholder="tu-dong-tao-slug" className="pl-8 bg-white dark:bg-black" />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label>Mô tả ngắn</Label>
                        <textarea
                            className="flex w-full rounded-md border border-input bg-white dark:bg-black px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[80px]"
                            placeholder="Mô tả sẽ hiển thị trên Google..."
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}