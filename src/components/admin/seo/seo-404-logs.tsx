"use client"

import * as React from "react"
import { useSeo404Logs } from "@/hooks/use-seo"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/admin/ui/table"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/admin/ui/card"
import { Button } from "@/components/admin/ui/button"
import { Badge } from "@/components/admin/ui/badge"
import { ExternalLink, RefreshCw, PlusCircle } from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner"

export function Seo404Logs() {
    const { data: logs, isLoading, refetch, isFetching } = useSeo404Logs()

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>404 Monitoring</CardTitle>
                    <CardDescription>Theo dõi các đường dẫn hỏng (Broken Links) khách hàng đã truy cập</CardDescription>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => refetch()}
                    disabled={isFetching}
                >
                    <RefreshCw className={cn("w-4 h-4 mr-2", isFetching && "animate-spin")} />
                    Làm mới
                </Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>URL bị hỏng</TableHead>
                            <TableHead>Nguồn (Referrer)</TableHead>
                            <TableHead className="text-center">Số lần</TableHead>
                            <TableHead>Truy cập cuối</TableHead>
                            <TableHead className="text-right">Thao tác</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><div className="h-4 w-[250px] bg-muted animate-pulse rounded" /></TableCell>
                                    <TableCell><div className="h-4 w-[150px] bg-muted animate-pulse rounded" /></TableCell>
                                    <TableCell><div className="h-4 w-[40px] bg-muted animate-pulse mx-auto rounded" /></TableCell>
                                    <TableCell><div className="h-4 w-[100px] bg-muted animate-pulse rounded" /></TableCell>
                                    <TableCell><div className="h-8 w-8 bg-muted animate-pulse ml-auto rounded" /></TableCell>
                                </TableRow>
                            ))
                        ) : logs?.map((log) => (
                            <TableRow key={log.id}>
                                <TableCell className="font-medium max-w-[300px] truncate">
                                    <div className="flex flex-col">
                                        <span className="truncate">{log.url}</span>
                                        <Badge variant="outline" className="w-fit text-[9px] mt-1 text-red-500 border-red-200 bg-red-50">
                                            Broken
                                        </Badge>
                                    </div>
                                </TableCell>
                                <TableCell className="text-muted-foreground text-xs italic truncate max-w-[200px]">
                                    {log.referrer || "Direct / No Referrer"}
                                </TableCell>
                                <TableCell className="text-center font-bold">{log.count}</TableCell>
                                <TableCell className="text-xs text-muted-foreground">
                                    {format(new Date(log.lastAccessed), "dd/MM/yyyy HH:mm")}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 text-[10px] gap-1"
                                        onClick={() => toast.info("Tính năng tạo nhanh Redirect đang được phát triển")}
                                    >
                                        <PlusCircle className="w-3 h-3" />
                                        Fix with Redirect
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {logs?.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-20 text-muted-foreground">
                                    Tuyệt vời! Không phát hiện lỗi 404 nào trong hệ thống.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ")
}
