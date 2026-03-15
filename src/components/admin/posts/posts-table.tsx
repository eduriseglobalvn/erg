"use client"

import * as React from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
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
import { useVirtualizer } from "@tanstack/react-virtual"
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
import Image from "next/image"
import { toast } from "sonner"
import { Skeleton } from "@/components/admin/ui/skeleton"
import { ConfirmDialog } from "@/components/admin/shared/confirm-dialog"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/admin/ui/pagination"
import { Checkbox } from "@/components/admin/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/admin/ui/select"

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

export function PostsTable({ categorySlug, status, isTrash }: { categorySlug?: string; status?: string; isTrash?: boolean }) {
    const queryClient = useQueryClient()
    const router = useRouter()

    // Pagination & Search & Filter states
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 10,
    })
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [searchTerm, setSearchTerm] = React.useState("")
    const [debouncedSearch, setDebouncedSearch] = React.useState("")
    const [localCategory, setLocalCategory] = React.useState<string | undefined>(categorySlug || "all")
    const [localStatus, setLocalStatus] = React.useState<string | undefined>(status || "all")

    const [confirmState, setConfirmState] = React.useState<{
        type: 'soft' | 'hard' | 'restore' | 'soft-bulk' | 'hard-bulk' | null,
        postId: string | null,
        postTitle: string | null
    }>({ type: null, postId: null, postTitle: null })

    const [rowSelection, setRowSelection] = React.useState({})

    // Mutations
    const softDeleteMutation = useMutation({
        mutationFn: (id: string) => postsApi.softDelete(id),
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ['posts'] })
            const previousData = queryClient.getQueryData(['posts', pagination, debouncedSearch, sorting, localCategory, localStatus, isTrash])
            queryClient.setQueryData(['posts', pagination, debouncedSearch, sorting, localCategory, localStatus, isTrash], (old: any) => {
                if (!old || !old.data) return old
                return { ...old, data: old.data.filter((p: any) => p.id !== id) }
            })
            return { previousData }
        },
        onSuccess: () => {
            toast.success("Đã chuyển bài viết vào thùng rác")
            setConfirmState({ type: null, postId: null, postTitle: null })
        },
        onError: (error: any, __, context) => {
            if (context?.previousData) {
                queryClient.setQueryData(['posts', pagination, debouncedSearch, sorting, categorySlug, status, isTrash], context.previousData)
            }
            toast.error(`Lỗi: ${error.message}`)
            setConfirmState({ type: null, postId: null, postTitle: null })
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['posts'] })
    })

    const hardDeleteMutation = useMutation({
        mutationFn: (id: string) => postsApi.hardDelete(id),
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ['posts'] })
            const previousData = queryClient.getQueryData(['posts', pagination, debouncedSearch, sorting, localCategory, localStatus, isTrash])
            queryClient.setQueryData(['posts', pagination, debouncedSearch, sorting, localCategory, localStatus, isTrash], (old: any) => {
                if (!old || !old.data) return old
                return { ...old, data: old.data.filter((p: any) => p.id !== id) }
            })
            return { previousData }
        },
        onSuccess: () => {
            toast.success("Đã xóa vĩnh viễn bài viết")
            setConfirmState({ type: null, postId: null, postTitle: null })
        },
        onError: (error: any, __, context) => {
            if (context?.previousData) {
                queryClient.setQueryData(['posts', pagination, debouncedSearch, sorting, categorySlug, status, isTrash], context.previousData)
            }
            toast.error(`Lỗi: ${error.message}`)
            setConfirmState({ type: null, postId: null, postTitle: null })
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['posts'] })
    })

    const restoreMutation = useMutation({
        mutationFn: (id: string) => postsApi.restore(id),
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ['posts'] })
            const previousData = queryClient.getQueryData(['posts', pagination, debouncedSearch, sorting, localCategory, localStatus, isTrash])
            queryClient.setQueryData(['posts', pagination, debouncedSearch, sorting, localCategory, localStatus, isTrash], (old: any) => {
                if (!old || !old.data) return old
                return { ...old, data: old.data.filter((p: any) => p.id !== id) }
            })
            return { previousData }
        },
        onSuccess: () => toast.success("Đã khôi phục bài viết"),
        onError: (error: any, __, context) => {
            if (context?.previousData) {
                queryClient.setQueryData(['posts', pagination, debouncedSearch, sorting, categorySlug, status, isTrash], context.previousData)
            }
            toast.error(`Lỗi: ${error.message}`)
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['posts'] })
    })

    // Add mutations for bulk delete if backend supports it, else we map promises.
    // Assuming backend softDelete/hardDelete API accepts single ID, we execute Promise.all
    const handleBulkSoftDelete = async () => {
        const selectedIds = Object.keys(rowSelection);
        setConfirmState({ type: null, postId: null, postTitle: null });
        const promises = selectedIds.map(id => postsApi.softDelete(id).catch(e => console.error(e)));
        await Promise.all(promises);
        toast.success(`Đã chuyển ${selectedIds.length} bài viết vào thùng rác`);
        setRowSelection({});
        queryClient.invalidateQueries({ queryKey: ['posts'] });
    }

    const handleBulkHardDelete = async () => {
        const selectedIds = Object.keys(rowSelection);
        setConfirmState({ type: null, postId: null, postTitle: null });
        const promises = selectedIds.map(id => postsApi.hardDelete(id).catch(e => console.error(e)));
        await Promise.all(promises);
        toast.success(`Đã xóa vĩnh viễn ${selectedIds.length} bài viết`);
        setRowSelection({});
        queryClient.invalidateQueries({ queryKey: ['posts'] });
    }

    const columns = React.useMemo<ColumnDef<Post>[]>(() => [
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
                                href={isTrash ? "#" : `/admin/posts/${post.id}/edit`}
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
    ], [isTrash, softDeleteMutation, hardDeleteMutation, restoreMutation])

    // Debounce search
    React.useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500)
        return () => clearTimeout(timer)
    }, [searchTerm])

    // Fetch data using TanStack Query
    const { data: queryData, isLoading, isError, error } = useQuery({
        queryKey: ['posts', pagination, debouncedSearch, sorting, localCategory, localStatus, isTrash],
        queryFn: async () => {
            const sortField = sorting.length > 0 ? sorting[0].id : undefined
            const sortOrder = sorting.length > 0 ? (sorting[0].desc ? "DESC" : "ASC") : undefined

            const activeCategory = localCategory === "all" ? undefined : localCategory
            const activeStatus = localStatus === "all" ? undefined : localStatus

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
                category: activeCategory,
                status: activeStatus
            })
            return res.data
        },
        staleTime: 60 * 1000, // Caching response trong 1 phút để giảm tải API
        gcTime: 5 * 60 * 1000, // Giữ data rác trong 5 phút
    })

    const { data: categoriesData } = useQuery({
        queryKey: ['categories'],
        queryFn: () => postsApi.getCategories(),
        staleTime: 5 * 60 * 1000,
    })

    const posts = queryData?.items || queryData || []
    const totalItems = queryData?.totalItems || queryData?.total || posts.length

    const table = useReactTable({
        data: posts,
        columns,
        state: {
            sorting,
            pagination,
            rowSelection,
        },
        getRowId: row => row.id,
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        pageCount: Math.ceil(totalItems / pagination.pageSize),
        onSortingChange: setSorting,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        manualSorting: true,
        manualFiltering: true,
    })

    const { rows } = table.getRowModel()
    const tableContainerRef = React.useRef<HTMLDivElement>(null)

    const rowVirtualizer = useVirtualizer({
        count: rows.length,
        getScrollElement: () => tableContainerRef.current,
        estimateSize: () => 80, // Chiều cao ước tính mỗi dòng
        overscan: 5,
    })

    if (isError) {
        toast.error(`Lỗi tải dữ liệu: ${(error as Error).message}`)
    }

    return (
        <div className="w-full space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex flex-wrap items-center gap-2 flex-1 w-full">
                    <div className="relative flex-1 min-w-[200px] max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder={isTrash ? "Tìm trong thùng rác..." : "Tìm theo tiêu đề bài viết..."}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 h-10"
                        />
                    </div>
                    {!isTrash && !categorySlug && (
                        <Select value={localCategory} onValueChange={setLocalCategory}>
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
                        <Select value={localStatus} onValueChange={setLocalStatus}>
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
                                        onClick={() => table.setPageSize(size)}
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
                            <Link href="/admin/posts/create">
                                <Plus className="mr-2 h-4 w-4" /> Viết bài mới
                            </Link>
                        </Button>
                    )}
                </div>
            </div>

            {Object.keys(rowSelection).length > 0 && (
                <div className="flex items-center gap-4 bg-muted/50 p-2 rounded-lg border border-border text-sm animate-in fade-in slide-in-from-bottom-2">
                    <span className="font-semibold text-primary pl-2">
                        Đã chọn {Object.keys(rowSelection).length} bài viết
                    </span>
                    <div className="flex-1" />
                    {!isTrash ? (
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setConfirmState({ type: 'soft-bulk', postId: null, postTitle: null })}
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Chuyển vào thùng rác
                        </Button>
                    ) : (
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setConfirmState({ type: 'hard-bulk', postId: null, postTitle: null })}
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Xóa vĩnh viễn
                        </Button>
                    )}
                </div>
            )}

            <div className="rounded-md border bg-card overflow-hidden">
                <div
                    className="overflow-x-auto overflow-y-auto w-full max-h-[700px] relative scrollbar-thin"
                    ref={tableContainerRef}
                >
                    <Table className="w-full table-fixed min-w-[1050px]">
                        <TableHeader className="bg-muted/40 sticky top-0 z-10 shadow-sm">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id} className={`py-4 px-4 font-bold text-foreground/80 ${header.id === 'select' ? 'w-[50px] text-center' : header.id === 'title' ? 'w-auto text-left' :
                                                header.id === 'author' ? 'w-[180px] text-center' :
                                                    header.id === 'viewCount' ? 'w-[150px] text-center' :
                                                        header.id === 'seoScore' ? 'w-[100px] text-center' :
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
                                Array.from({ length: pagination.pageSize }).map((_, i) => (
                                    <TableRow key={i}>
                                        {columns.map((_, j) => (
                                            <TableCell key={j} className="px-4 py-4 h-16">
                                                <Skeleton className="h-4 w-full" />
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : rows.length ? (
                                <>
                                    {rowVirtualizer.getVirtualItems().length > 0 && rowVirtualizer.getVirtualItems()[0].start > 0 && (
                                        <tr>
                                            <td style={{ height: `${rowVirtualizer.getVirtualItems()[0].start}px` }} />
                                        </tr>
                                    )}
                                    {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                                        const row = rows[virtualRow.index];
                                        return (
                                            <TableRow
                                                key={row.id}
                                                data-index={virtualRow.index}
                                                ref={rowVirtualizer.measureElement}
                                                data-state={row.getIsSelected() && "selected"}
                                                className="hover:bg-muted/40 transition-colors"
                                            >
                                                {row.getVisibleCells().map((cell) => (
                                                    <TableCell key={cell.id} className={`p-0 px-4 overflow-hidden h-full ${cell.column.id === 'select' ? 'w-[50px] flex justify-center' : cell.column.id === 'title' ? 'flex-1 text-left min-w-[300px]' : 'text-center'}`}>
                                                        {flexRender(
                                                            cell.column.columnDef.cell,
                                                            cell.getContext()
                                                        )}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        )
                                    })}
                                    {rowVirtualizer.getVirtualItems().length > 0 && rowVirtualizer.getVirtualItems()[rowVirtualizer.getVirtualItems().length - 1].end < rowVirtualizer.getTotalSize() && (
                                        <tr>
                                            <td style={{ height: `${rowVirtualizer.getTotalSize() - rowVirtualizer.getVirtualItems()[rowVirtualizer.getVirtualItems().length - 1].end}px` }} />
                                        </tr>
                                    )}
                                </>
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
            <div className="flex items-center justify-between px-2 pt-4">
                <div className="text-sm text-muted-foreground font-medium">
                    Hiển thị <span className="text-foreground font-bold">{posts.length}</span> / <span className="text-foreground font-bold">{totalItems}</span> bài viết
                </div>
                <Pagination className="justify-end w-auto mx-0">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    table.previousPage();
                                }}
                                className={!table.getCanPreviousPage() || isLoading ? "pointer-events-none opacity-50" : ""}
                            />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#" isActive>
                                {pagination.pageIndex + 1}
                            </PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationNext
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    table.nextPage();
                                }}
                                className={!table.getCanNextPage() || isLoading ? "pointer-events-none opacity-50" : ""}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>

            {/* Dialog xác nhận xóa mềm */}
            <ConfirmDialog
                open={confirmState.type === 'soft'}
                onOpenChange={(open) => !open && setConfirmState({ type: null, postId: null, postTitle: null })}
                title="Chuyển vào thùng rác?"
                description={`Bạn có chắc chắn muốn chuyển bài viết "${confirmState.postTitle}" vào thùng rác không?`}
                onConfirm={() => confirmState.postId && softDeleteMutation.mutate(confirmState.postId)}
                variant="destructive"
                confirmText="Chuyển vào thùng rác"
                isLoading={softDeleteMutation.isPending}
            />

            {/* Dialog xác nhận xóa vĩnh viễn */}
            <ConfirmDialog
                open={confirmState.type === 'hard'}
                onOpenChange={(open) => !open && setConfirmState({ type: null, postId: null, postTitle: null })}
                title="XÓA VĨNH VIỄN?"
                description={`CẢNH BÁO: Bài viết "${confirmState.postTitle}" sẽ bị xóa vĩnh viễn. Hành động này không thể khôi phục!`}
                onConfirm={() => confirmState.postId && hardDeleteMutation.mutate(confirmState.postId)}
                variant="destructive"
                confirmText="Xác nhận xóa vĩnh viễn"
                isLoading={hardDeleteMutation.isPending}
            />

            {/* Dialog xác nhận xóa mềm hàng loạt */}
            <ConfirmDialog
                open={confirmState.type === 'soft-bulk'}
                onOpenChange={(open) => !open && setConfirmState({ type: null, postId: null, postTitle: null })}
                title="Chuyển vào thùng rác?"
                description={`Bạn có chắc chắn muốn chuyển ${Object.keys(rowSelection).length} bài viết đã chọn vào thùng rác không?`}
                onConfirm={handleBulkSoftDelete}
                variant="destructive"
                confirmText="Chuyển vào thùng rác"
            />

            {/* Dialog xác nhận xóa cứng hàng loạt */}
            <ConfirmDialog
                open={confirmState.type === 'hard-bulk'}
                onOpenChange={(open) => !open && setConfirmState({ type: null, postId: null, postTitle: null })}
                title="XÓA VĨNH VIỄN?"
                description={`CẢNH BÁO: ${Object.keys(rowSelection).length} bài viết đã chọn sẽ bị xóa vĩnh viễn. Hành động này không thể khôi phục!`}
                onConfirm={handleBulkHardDelete}
                variant="destructive"
                confirmText="Xoá vĩnh viễn"
            />
        </div>
    )
}
