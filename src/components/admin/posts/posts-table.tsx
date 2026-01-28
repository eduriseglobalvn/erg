"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import {
    ChevronDown,
    MoreHorizontal,
    Plus,
    Search,
    Edit,
    Trash2,
    Eye,
    MessageSquare,
    ArrowUpDown,
    Bot,
    User,
    Image as ImageIcon
} from "lucide-react"

import { Button } from "@/components/admin/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/admin/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/admin/ui/dropdown-menu"
import { Input } from "@/components/admin/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/admin/ui/table"
import { Badge } from "@/components/admin/ui/badge"
import { postsApi } from "@/services/posts.api"
import Link from "next/link"
import { toast } from "sonner"

export type Post = {
    id: string
    title: string
    slug: string
    excerpt: string | null
    thumbnailUrl: string | null
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

const columns: ColumnDef<Post>[] = [
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
                        <div className="h-16 w-16 rounded-lg bg-muted overflow-hidden flex-shrink-0 border shadow-sm">
                            <img src={post.thumbnailUrl} alt={post.title} className="h-full w-full object-cover" />
                        </div>
                    ) : (
                        <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 border text-muted-foreground shadow-sm">
                            <ImageIcon className="h-6 w-6" />
                        </div>
                    )}
                    <div className="flex flex-col gap-0.5 min-w-0 flex-1 overflow-hidden">
                        <Link
                            href={`/admin/posts/${post.id}/edit`}
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
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(post.id)}>
                            Copy ID bài viết
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href={`/admin/posts/${post.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" /> Chỉnh sửa
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" /> Xóa bài viết
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]

export function PostsTable({ categorySlug, status, isTrash }: { categorySlug?: string; status?: string; isTrash?: boolean }) {
    // Pagination & Search states
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 10,
    })
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [searchTerm, setSearchTerm] = React.useState("")
    const [debouncedSearch, setDebouncedSearch] = React.useState("")

    // Debounce search
    React.useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500)
        return () => clearTimeout(timer)
    }, [searchTerm])

    // Fetch data using TanStack Query
    const { data: queryData, isLoading, isError, error } = useQuery({
        queryKey: ['posts', pagination, debouncedSearch, sorting, categorySlug, status, isTrash],
        queryFn: async () => {
            const sortField = sorting.length > 0 ? sorting[0].id : undefined
            const sortOrder = sorting.length > 0 ? (sorting[0].desc ? "DESC" : "ASC") : undefined

            if (isTrash) {
                const res = await postsApi.getTrash({
                    page: pagination.pageIndex + 1,
                    limit: pagination.pageSize,
                    search: debouncedSearch || undefined,
                })
                return res.data
            }

            const res = await postsApi.getAll({
                page: pagination.pageIndex + 1,
                limit: pagination.pageSize,
                search: debouncedSearch || undefined,
                sortBy: sortField,
                order: sortOrder as any,
                category: categorySlug,
                status: status
            })
            return res.data
        }
    })

    const posts = queryData?.items || queryData || []
    const totalItems = queryData?.totalItems || queryData?.total || posts.length

    const table = useReactTable({
        data: posts,
        columns,
        state: {
            sorting,
            pagination,
        },
        pageCount: Math.ceil(totalItems / pagination.pageSize),
        onSortingChange: setSorting,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        manualSorting: true,
        manualFiltering: true,
    })

    if (isError) {
        toast.error(`Lỗi tải dữ liệu: ${(error as Error).message}`)
    }

    return (
        <div className="w-full space-y-4">
            <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Tìm theo tiêu đề bài viết..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 h-10"
                    />
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
                                        onClick={() => table.setPageSize(size)}
                                        className={pagination.pageSize === size ? "bg-primary/10 text-primary font-bold" : ""}
                                    >
                                        {size} bài / trang
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <Button asChild className="bg-primary hover:bg-primary/90 shadow-sm h-10 px-4">
                        <Link href="/posts/create">
                            <Plus className="mr-2 h-4 w-4" /> Viết bài mới
                        </Link>
                    </Button>
                </div>
            </div>
            <div className="rounded-md border bg-card overflow-hidden">
                <div className="overflow-x-auto w-full">
                    <Table className="w-full table-fixed min-w-[1050px]">
                        <TableHeader className="bg-muted/40">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id} className={`py-4 px-4 font-bold text-foreground/80 ${header.id === 'title' ? 'w-auto text-left' :
                                                header.id === 'author' ? 'w-[180px] text-center' :
                                                    header.id === 'viewCount' ? 'w-[150px] text-center' :
                                                        header.id === 'status' ? 'w-[130px] text-center' :
                                                            header.id === 'updatedAt' ? 'w-[140px] text-center' :
                                                                header.id === 'actions' ? 'w-[50px] text-center' : ''
                                                }`}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </TableHead>
                                        )
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        Đang tải dữ liệu...
                                    </TableCell>
                                </TableRow>
                            ) : table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                        className="hover:bg-muted/40 transition-colors"
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id} className={`p-0 px-4 overflow-hidden h-full ${cell.column.id === 'title' ? 'text-left' : 'text-center'}`}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        Không có bài viết nào.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
            <div className="flex items-center justify-between px-2">
                <div className="text-sm text-muted-foreground font-medium">
                    Hiển thị <span className="text-foreground font-bold">{posts.length}</span> / <span className="text-foreground font-bold">{totalItems}</span> bài viết
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-9 px-4 font-semibold"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage() || isLoading}
                    >
                        Trang trước
                    </Button>
                    <div className="flex items-center justify-center min-w-[100px] text-sm font-bold">
                        Trang {pagination.pageIndex + 1} / {table.getPageCount() || 1}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-9 px-4 font-semibold"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage() || isLoading}
                    >
                        Trang sau
                    </Button>
                </div>
            </div>
        </div>
    )
}
