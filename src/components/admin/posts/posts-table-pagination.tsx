"use client"

import * as React from "react"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/admin/ui/pagination"

interface PostsTablePaginationProps {
    pagination: { pageIndex: number; pageSize: number }
    totalItems: number
    posts: any[]
    table: any
    isLoading: boolean
}

export function PostsTablePagination({
    pagination,
    totalItems,
    posts,
    table,
    isLoading,
}: PostsTablePaginationProps) {
    return (
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
    )
}
