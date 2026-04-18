"use client"

import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import {
    ArrowUpDown,
    Bot,
    Eye,
    MessageSquare,
    MoreHorizontal,
    Edit,
    Trash2,
    User,
    Image as ImageIcon,
    Plus,
} from "lucide-react"
import { Button } from "@/components/admin/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/admin/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/admin/ui/dropdown-menu"
import { Badge } from "@/components/admin/ui/badge"
import { Checkbox } from "@/components/admin/ui/checkbox"
import Link from "next/link"
import Image from "next/image"
import { toast } from "sonner"

export type Post = {
    id: string
    title: string
    slug: string
    excerpt: string | null
    thumbnailUrl: string | null
    seoScore?: number
    status: "published" | "draft" | "scheduled"
    isPublished: boolean
    createdAt: string
    updatedAt: string
    viewCount: number
    commentCount: number
    isCreatedByAI: boolean
    author: {
        fullName: string
        avatarUrl: string | null
    }
    category?: {
        id: string
        name: string
        slug: string
    }
}

interface UsePostsTableColumnsProps {
    isTrash?: boolean
    setConfirmState: React.Dispatch<React.SetStateAction<{
        type: 'soft' | 'hard' | 'restore' | 'soft-bulk' | 'hard-bulk' | null
        postId: string | null
        postTitle: string | null
    }>>
    softDeleteMutation: any
    hardDeleteMutation: any
    restoreMutation: any
}

export function usePostsTableColumns({
    isTrash,
    setConfirmState,
    softDeleteMutation,
    hardDeleteMutation,
    restoreMutation,
}: UsePostsTableColumnsProps): ColumnDef<Post>[] {
    return React.useMemo<ColumnDef<Post>[]>(() => [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                    className="translate-y-[2px]"
                />
            ),
            cell: ({ row }) => (
                <div className="flex justify-center items-center h-full">
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                        aria-label="Select row"
                        className="translate-y-[2px]"
                    />
                </div>
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "title",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        className="font-bold text-foreground p-0 hover:bg-transparent"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Nội dung bài viết
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => {
                const post = row.original
                return (
                    <div className="flex gap-4 py-3 items-center min-w-0 h-full">
                        {post.thumbnailUrl ? (
                            <div className="relative h-16 w-16 rounded-lg bg-muted overflow-hidden flex-shrink-0 border shadow-sm">
                                <Image src={post.thumbnailUrl} alt={post.title} fill className="object-cover" sizes="64px" />
                            </div>
                        ) : (
                            <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 border text-muted-foreground shadow-sm">
                                <ImageIcon className="h-6 w-6" />
                            </div>
                        )}
                        <div className="flex flex-col gap-0.5 min-w-0 flex-1 overflow-hidden">
                            <Link
                                href={isTrash === true ? "#" : `/admin/posts/${post.id}/edit`}
                                className="font-bold text-sm text-foreground line-clamp-1 leading-tight hover:text-primary transition-colors cursor-pointer truncate"
                            >
                                {post.title}
                            </Link>
                            {post.excerpt && (
                                <p className="text-xs text-muted-foreground line-clamp-1 leading-normal truncate">
                                    {post.excerpt}
                                </p>
                            )}
                            <div className="flex items-center gap-3 pt-0.5">
                                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 hover:bg-primary/10 transition-colors text-[10px] uppercase font-bold px-2 py-0 shrink-0">
                                    {post.category?.name || "Chưa phân loại"}
                                </Badge>
                                {post.isCreatedByAI && (
                                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold text-[10px] border border-primary/20 shadow-sm shrink-0">
                                        <Bot className="h-3 w-3" />
                                        <span>AI CHẤP BÚT</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )
            },
        },
        {
            accessorKey: "author",
            header: "Tác giả",
            cell: ({ row }) => {
                const author = row.original.author
                return (
                    <div className="flex items-center justify-center gap-2.5 py-3 w-[180px] shrink-0 overflow-hidden">
                        <Avatar className="h-8 w-8 border shadow-sm shrink-0">
                            <AvatarImage src={author.avatarUrl || ""} alt={author.fullName} />
                            <AvatarFallback><User className="h-3 w-3" /></AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col min-w-0">
                            <span className="text-xs font-semibold text-foreground truncate">{author.fullName}</span>
                            <span className="text-[9px] text-muted-foreground uppercase tracking-wider font-medium">BTV</span>
                        </div>
                    </div>
                )
            },
        },
        {
            accessorKey: "viewCount",
            header: "Tương tác",
            cell: ({ row }) => {
                const post = row.original
                return (
                    <div className="flex items-center gap-4 text-muted-foreground py-3 w-[150px] shrink-0 justify-center">
                        <div className="flex flex-col items-center gap-0.5" title="Lượt xem">
                            <div className="flex items-center gap-1.5">
                                <Eye className="h-4 w-4 text-primary/60" />
                                <span className="text-xs font-bold text-foreground">{post.viewCount}</span>
                            </div>
                            <span className="text-[9px] uppercase font-medium tracking-tight">Xem</span>
                        </div>
                        <div className="flex flex-col items-center gap-0.5" title="Bình luận">
                            <div className="flex items-center gap-1.5">
                                <MessageSquare className="h-4 w-4 text-primary/60" />
                                <span className="text-xs font-bold text-foreground">{post.commentCount}</span>
                            </div>
                            <span className="text-[9px] uppercase font-medium tracking-tight">Phản hồi</span>
                        </div>
                    </div>
                )
            },
        },
        {
            accessorKey: "seoScore",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        className="font-bold text-foreground p-0 hover:bg-transparent mx-auto flex"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        SEO
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => {
                const score = row.getValue("seoScore") as number | undefined;

                if (score === undefined || score === null) {
                    return (
                        <div className="py-3 w-[80px] shrink-0 flex justify-center">
                            <span className="text-xs text-muted-foreground">-</span>
                        </div>
                    )
                }

                let badgeClass = "bg-slate-100 text-slate-600 border-none font-bold";
                if (score >= 90) badgeClass = "bg-blue-100 text-blue-700 border-none font-bold ring-1 ring-blue-500/20";
                else if (score >= 80) badgeClass = "bg-emerald-100 text-emerald-700 border-none font-bold ring-1 ring-emerald-500/20";
                else if (score >= 50) badgeClass = "bg-amber-100 text-amber-700 border-none font-bold ring-1 ring-amber-500/20";
                else badgeClass = "bg-rose-100 text-rose-700 border-none font-bold ring-1 ring-rose-500/20";

                return (
                    <div className="py-3 w-[80px] shrink-0 flex justify-center">
                        <Badge variant="outline" className={badgeClass}>
                            {score}
                        </Badge>
                    </div>
                )
            },
        },
        {
            accessorKey: "status",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        className="font-bold text-foreground p-0 hover:bg-transparent mx-auto flex"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Trạng thái
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => {
                const status = row.getValue("status") as string
                return (
                    <div className="py-3 w-[130px] shrink-0 flex justify-center">
                        <Badge
                            variant={status === "published" ? "default" : (status === "archived" || status === "achired") ? "outline" : "secondary"}
                            className={
                                status === "published"
                                    ? "bg-green-100 text-green-700 hover:bg-green-200 border-none shadow-sm px-2 text-[10px] font-semibold"
                                    : (status === "archived" || status === "achired")
                                        ? "bg-amber-100 text-amber-700 hover:bg-amber-200 border-none shadow-sm px-2 text-[10px] font-semibold"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 border-none shadow-sm px-2 text-[10px] font-semibold"
                            }
                        >
                            {status === "published" ? "Đã đăng" : (status === "archived" || status === "achired") ? "Tạm ẩn" : "Đang chờ"}
                        </Badge>
                    </div>
                )
            },
        },
        {
            accessorKey: "updatedAt",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        className="font-bold text-foreground p-0 hover:bg-transparent mx-auto flex"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Cập nhật
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => {
                const post = row.original
                return (
                    <div className="flex flex-col py-3 text-[10px] text-muted-foreground whitespace-nowrap w-[140px] shrink-0 items-center">
                        <span className="font-bold text-foreground/90">
                            {new Date(post.updatedAt).toLocaleDateString("vi-VN", {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric'
                            })}
                        </span>
                        <span className="text-[8px] uppercase opacity-70 tracking-widest">Lần cuối</span>
                    </div>
                )
            },
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const post = row.original

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => {
                                navigator.clipboard.writeText(post.id)
                                toast.success("Đã copy ID")
                            }}>
                                Copy ID bài viết
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />

                            {!isTrash ? (
                                <>
                                    <DropdownMenuItem asChild>
                                        <Link href={`/admin/posts/${post.id}/edit`}>
                                            <Edit className="mr-2 h-4 w-4" /> Chỉnh sửa
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className="text-destructive font-bold"
                                        onClick={() => {
                                            setConfirmState({
                                                type: 'soft',
                                                postId: post.id,
                                                postTitle: post.title
                                            })
                                        }}
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" /> Xóa (Thùng rác)
                                    </DropdownMenuItem>
                                </>
                            ) : (
                                <>
                                    <DropdownMenuItem
                                        onClick={() => restoreMutation.mutate(post.id)}
                                        className="text-green-600 focus:text-green-600"
                                    >
                                        <Plus className="mr-2 h-4 w-4 rotate-45" /> Khôi phục
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className="text-destructive font-bold"
                                        onClick={() => {
                                            setConfirmState({
                                                type: 'hard',
                                                postId: post.id,
                                                postTitle: post.title
                                            })
                                        }}
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" /> Xóa vĩnh viễn
                                    </DropdownMenuItem>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ], [isTrash, setConfirmState, softDeleteMutation, hardDeleteMutation, restoreMutation])
}
