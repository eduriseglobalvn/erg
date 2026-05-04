"use client"

import * as React from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
    SortingState,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { useVirtualizer } from "@tanstack/react-virtual"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/admin/ui/table"
import { postsApi } from "@/services/posts.api"
import { toast } from "sonner"
import { Skeleton } from "@/components/admin/ui/skeleton"
import { ConfirmDialog } from "@/components/admin/shared/confirm-dialog"
import { PostsTableToolbar } from "@/components/admin/posts/posts-table-toolbar"
import { PostsTablePagination } from "@/components/admin/posts/posts-table-pagination"
import { usePostsTableColumns } from "@/components/admin/posts/posts-table-columns"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/admin/ui/pagination"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/admin/ui/button"
import { Checkbox } from "@/components/admin/ui/checkbox"

export function PostsTable({ categorySlug, status, isTrash }: { categorySlug?: string; status?: string; isTrash?: boolean }) {
    const queryClient = useQueryClient()

    // Pagination & Search & Filter states
    const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 })
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

    const handleBulkSoftDelete = async () => {
        const selectedIds = Object.keys(rowSelection)
        setConfirmState({ type: null, postId: null, postTitle: null })
        const promises = selectedIds.map(id => postsApi.softDelete(id).catch(e => console.error(e)))
        await Promise.all(promises)
        toast.success(`Đã chuyển ${selectedIds.length} bài viết vào thùng rác`)
        setRowSelection({})
        queryClient.invalidateQueries({ queryKey: ['posts'] })
    }

    const handleBulkHardDelete = async () => {
        const selectedIds = Object.keys(rowSelection)
        setConfirmState({ type: null, postId: null, postTitle: null })
        const promises = selectedIds.map(id => postsApi.hardDelete(id).catch(e => console.error(e)))
        await Promise.all(promises)
        toast.success(`Đã xóa vĩnh viễn ${selectedIds.length} bài viết`)
        setRowSelection({})
        queryClient.invalidateQueries({ queryKey: ['posts'] })
    }

    // Use extracted columns hook
    const columns = usePostsTableColumns({
        isTrash,
        setConfirmState,
        softDeleteMutation,
        hardDeleteMutation,
        restoreMutation,
    })

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
        staleTime: 60 * 1000,
        gcTime: 5 * 60 * 1000,
    })

    const { data: categoriesData } = useQuery({
        queryKey: ['categories'],
        queryFn: () => postsApi.getCategories(),
        staleTime: 5 * 60 * 1000,
    })

    const posts = Array.isArray(queryData?.items)
        ? queryData.items
        : Array.isArray(queryData?.data)
            ? queryData.data
            : Array.isArray(queryData)
                ? queryData
                : []
    const totalItems = Number(queryData?.totalItems ?? queryData?.total ?? posts.length)

    const table = useReactTable({
        data: posts,
        columns,
        state: { sorting, pagination, rowSelection },
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
        estimateSize: () => 80,
        overscan: 5,
    })

    if (isError) {
        toast.error(`Lỗi tải dữ liệu: ${(error as Error).message}`)
    }

    return (
        <div className="w-full space-y-4">
            {/* Toolbar */}
            <PostsTableToolbar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                localCategory={localCategory}
                onCategoryChange={setLocalCategory}
                localStatus={localStatus}
                onStatusChange={setLocalStatus}
                pagination={pagination}
                onPageSizeChange={(size) => table.setPageSize(size)}
                rowSelection={rowSelection}
                isTrash={isTrash || false}
                categorySlug={categorySlug}
                status={status}
                categoriesData={categoriesData}
                table={table}
            />

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
                                                    : flexRender(header.column.columnDef.header, header.getContext())}
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
                                        <tr><td style={{ height: `${rowVirtualizer.getVirtualItems()[0].start}px` }} /></tr>
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
                                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        )
                                    })}
                                    {rowVirtualizer.getVirtualItems().length > 0 && rowVirtualizer.getVirtualItems()[rowVirtualizer.getVirtualItems().length - 1].end < rowVirtualizer.getTotalSize() && (
                                        <tr><td style={{ height: `${rowVirtualizer.getTotalSize() - rowVirtualizer.getVirtualItems()[rowVirtualizer.getVirtualItems().length - 1].end}px` }} /></tr>
                                    )}
                                </>
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        Không có bài viết nào.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Pagination */}
            <PostsTablePagination
                pagination={pagination}
                totalItems={totalItems}
                posts={posts}
                table={table}
                isLoading={isLoading || false}
            />

            {/* Confirm Dialogs */}
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

            <ConfirmDialog
                open={confirmState.type === 'soft-bulk'}
                onOpenChange={(open) => !open && setConfirmState({ type: null, postId: null, postTitle: null })}
                title="Chuyển vào thùng rác?"
                description={`Bạn có chắc chắn muốn chuyển ${Object.keys(rowSelection).length} bài viết đã chọn vào thùng rác không?`}
                onConfirm={handleBulkSoftDelete}
                variant="destructive"
                confirmText="Chuyển vào thùng rác"
            />

            <ConfirmDialog
                open={confirmState.type === 'hard-bulk'}
                onOpenChange={(open) => !open && setConfirmState({ type: null, postId: null, postTitle: null })}
                title="XÓA VĨNH VIỄN?"
                description={`CẢNH BÁO: ${Object.keys(rowSelection).length} bài viết đã chọn sẽ bị xóa vĩnh viễn. Hành động này không thể khôi phục!`}
                onConfirm={handleBulkHardDelete}
                variant="destructive"
                confirmText="Xóa vĩnh viễn"
            />
        </div>
    )
}
