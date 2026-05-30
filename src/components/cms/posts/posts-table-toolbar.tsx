"use client"

import * as React from "react"
import {
    ChevronDown,
    Plus,
    Search,
    Trash2,
} from "lucide-react"
import { Button } from "@/components/cms/ui/button"
import { Input } from "@/components/cms/ui/input"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/cms/ui/dropdown-menu"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/cms/ui/select"
import Link from "next/link"

interface PostsTableToolbarProps {
    searchTerm: string
    onSearchChange: (value: string) => void
    localCategory: string | undefined
    onCategoryChange: (value: string) => void
    localStatus: string | undefined
    onStatusChange: (value: string) => void
    pagination: { pageIndex: number; pageSize: number }
    onPageSizeChange: (size: number) => void
    rowSelection: Record<string, boolean>
    isTrash: boolean
    categorySlug?: string
    status?: string
    categoriesData?: { id: string; name: string; slug: string }[]
    table?: any
}

export function PostsTableToolbar({
    searchTerm,
    onSearchChange,
    localCategory,
    onCategoryChange,
    localStatus,
    onStatusChange,
    pagination,
    onPageSizeChange,
    rowSelection,
    isTrash,
    categorySlug,
    status,
    categoriesData,
    table,
}: PostsTableToolbarProps) {
    const selectedCount = Object.keys(rowSelection).length

    return (
        <>
            {/* Toolbar Row */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex flex-wrap items-center gap-2 flex-1 w-full">
                    <div className="relative flex-1 min-w-[200px] max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder={isTrash ? "Tìm trong thùng rác..." : "Tìm theo tiêu đề bài viết..."}
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="pl-9 h-10"
                        />
                    </div>
                    {!isTrash && !categorySlug && (
                        <Select value={localCategory} onValueChange={onCategoryChange}>
                            <SelectTrigger className="w-[180px] h-10 border-input">
                                <SelectValue placeholder="Chuyên mục" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả chuyên mục</SelectItem>
                                {categoriesData?.map((cat) => (
                                    <SelectItem key={cat.id} value={cat.slug}>{cat.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                    {!isTrash && !status && (
                        <Select value={localStatus} onValueChange={onStatusChange}>
                            <SelectTrigger className="w-[160px] h-10 border-input">
                                <SelectValue placeholder="Trạng thái" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                                <SelectItem value="published">Đã đăng</SelectItem>
                                <SelectItem value="draft">Đang chờ</SelectItem>
                                <SelectItem value="archived">Tạm ẩn</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-lg border border-border/50">
                        <span className="text-xs font-medium text-muted-foreground px-2">Hiển thị:</span>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 gap-1 px-3 font-bold text-primary">
                                    {pagination.pageSize} bài <ChevronDown className="h-3 w-3" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="min-w-[100px]">
                                {[10, 20, 50, 100].map((size) => (
                                    <DropdownMenuItem
                                        key={size}
                                        onClick={() => onPageSizeChange(size)}
                                        className={pagination.pageSize === size ? "bg-primary/10 text-primary font-bold" : ""}
                                    >
                                        {size} bài / trang
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {!isTrash && (
                        <Button asChild className="bg-primary hover:bg-primary/90 shadow-sm h-10 px-4">
                            <Link href="/posts/create">
                                <Plus className="mr-2 h-4 w-4" /> Viết bài mới
                            </Link>
                        </Button>
                    )}
                </div>
            </div>

            {/* Bulk Action Bar */}
            {selectedCount > 0 && (
                <div className="flex items-center gap-4 bg-muted/50 p-2 rounded-lg border border-border text-sm animate-in fade-in slide-in-from-bottom-2">
                    <span className="font-semibold text-primary pl-2">
                        Đã chọn {selectedCount} bài viết
                    </span>
                    <div className="flex-1" />
                    {!isTrash ? (
                        <Button
                            variant="destructive"
                            size="sm"
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Chuyển vào thùng rác
                        </Button>
                    ) : (
                        <Button
                            variant="destructive"
                            size="sm"
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Xóa vĩnh viễn
                        </Button>
                    )}
                </div>
            )}
        </>
    )
}
