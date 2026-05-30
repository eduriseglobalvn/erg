"use client"

import * as React from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
    getCoreRowModel,
    useReactTable,
    flexRender,
} from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/cms/ui/table"
import { publicDisclosureApi, DisclosureDocument } from "@/services/public-disclosure.api"
import { toast } from "sonner"
import { Skeleton } from "@/components/cms/ui/skeleton"
import { Button } from "@/components/cms/ui/button"
import { Trash2, ExternalLink, FileText, Settings } from "lucide-react"
import { Badge } from "@/components/cms/ui/badge"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

export function DisclosureTable({ section }: { section?: string }) {
    const queryClient = useQueryClient()

    const { data, isLoading } = useQuery({
        queryKey: ['public-disclosure', section],
        queryFn: () => publicDisclosureApi.getAll(section),
    })

    const deleteMutation = useMutation({
        mutationFn: (id: string) => publicDisclosureApi.delete(id),
        onSuccess: () => {
            toast.success("Đã xóa văn bản công khai")
            queryClient.invalidateQueries({ queryKey: ['public-disclosure'] })
        },
        onError: (err: any) => toast.error(`Lỗi: ${err.message}`)
    })

    const columns = [
        {
            accessorKey: "title",
            header: "Văn bản",
            cell: ({ row }: any) => (
                <div className="flex flex-col gap-1 py-1">
                    <span className="font-medium text-foreground">{row.original.title}</span>
                    <span className="text-xs text-muted-foreground font-mono">{row.original.referenceCode}</span>
                </div>
            )
        },
        {
            accessorKey: "sectionSlug",
            header: "Danh mục",
            cell: ({ row }: any) => (
                <Badge variant="outline" className="capitalize bg-muted/50">
                    {row.original.sectionSlug.replace(/-/g, ' ')}
                </Badge>
            )
        },
        {
            accessorKey: "schoolYear",
            header: "Năm học",
            cell: ({ row }: any) => <span className="text-sm">{row.original.schoolYear}</span>
        },
        {
            accessorKey: "updatedAt",
            header: "Cập nhật",
            cell: ({ row }: any) => (
                <span className="text-xs text-muted-foreground">
                    {format(new Date(row.original.updatedAt), "dd/MM/yyyy HH:mm", { locale: vi })}
                </span>
            )
        },
        {
            id: "actions",
            header: "",
            cell: ({ row }: any) => (
                <div className="flex justify-end gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                        onClick={() => window.open(`/api/documents/${row.original.documentId}/file`, '_blank')}
                    >
                        <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                        onClick={() => {
                            if (confirm("Bạn có chắc chắn muốn xóa văn bản này?")) {
                                deleteMutation.mutate(row.original.id)
                            }
                        }}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            )
        }
    ]

    const table = useReactTable({
        data: data || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    if (isLoading) {
        return (
            <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full rounded-lg" />
                ))}
            </div>
        )
    }

    return (
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <Table>
                <TableHeader className="bg-muted/30">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id} className="hover:bg-transparent border-b">
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id} className="h-11 font-semibold text-foreground/70">
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id} className="hover:bg-muted/20 transition-colors border-b last:border-0">
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id} className="py-3">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground italic">
                                Chưa có hồ sơ công khai nào được tải lên.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
