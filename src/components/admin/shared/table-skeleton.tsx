"use client"

import { Skeleton } from "@/components/admin/ui/skeleton"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/admin/ui/table"

interface TableSkeletonProps {
    columnCount: number
    rowCount?: number
    className?: string
}

export function TableSkeleton({ columnCount, rowCount = 5, className }: TableSkeletonProps) {
    return (
        <div className="rounded-md border bg-card overflow-hidden">
            <Table className="w-full">
                <TableHeader className="bg-muted/40">
                    <TableRow>
                        {Array.from({ length: columnCount }).map((_, i) => (
                            <TableHead key={i} className="py-4 px-4 font-bold">
                                <Skeleton className="h-4 w-[60%]" />
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Array.from({ length: rowCount }).map((_, i) => (
                        <TableRow key={i}>
                            {Array.from({ length: columnCount }).map((_, j) => (
                                <TableCell key={j} className="px-4 py-4">
                                    <Skeleton className="h-4 w-full" />
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
