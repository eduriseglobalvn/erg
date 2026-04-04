"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Search, History, Filter } from "lucide-react";
import { Input } from "@/components/admin/ui/input";
import { ProtectedRoute } from "@/components/admin/shared/protected-route";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/admin/ui/table";
import { Badge } from "@/components/admin/ui/badge";

const MOCK_LOGS = [
    { id: "1", action: "GRANT_ROLE", targetUser: "nguyenvana (Admin)", role: "Editor", performedBy: "System (SuperAdmin)", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), details: "Assigned via HR process" },
    { id: "2", action: "REVOKE_ROLE", targetUser: "tranthib (Editor)", role: "Admin", performedBy: "nguyena (SuperAdmin)", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), details: "Role downgraded based on review" },
    { id: "3", action: "UPDATE_ROLE_PERMS", targetUser: "-", role: "SEO Specialist", performedBy: "System", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), details: "Added 'seo.delete' permission" },
    { id: "4", action: "ADD_OVERRIDE", targetUser: "lethic (Writer)", role: "-", performedBy: "nguyena (Admin)", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72), details: "Granted temporary 'posts.publish' until 2024-12-31" },
];

export default function AuditLogsPage() {
    const [searchTerm, setSearchTerm] = useState("");

    const filtered = MOCK_LOGS.filter((log) =>
        log.targetUser.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.performedBy.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <ProtectedRoute permission="roles.read">
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Nhật ký thay đổi Access Control (Audit Log)</h2>
                    <p className="text-muted-foreground mt-1">
                        Theo dõi tất cả các thay đổi phân quyền: cấp/gỡ role, sửa quyền role, gán quyền ghi đè, etc.
                    </p>
                </div>
            </div>

            <div className="flex items-center space-x-2 mb-6">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Tìm kiếm user, người thực hiện hoặc hành động..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                    />
                </div>
                {/* Mock Filter button */}
                <Badge variant="outline" className="h-10 px-4 rounded-md cursor-pointer inline-flex gap-2">
                    <Filter className="h-4 w-4" /> Filter
                </Badge>
            </div>

            <div className="rounded-md border bg-white shadow-sm overflow-hidden text-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[180px]">Thời gian</TableHead>
                            <TableHead className="w-[150px]">Hành động (Action)</TableHead>
                            <TableHead>User bị ảnh hưởng</TableHead>
                            <TableHead>Role liên quan</TableHead>
                            <TableHead>Người thực hiện (By)</TableHead>
                            <TableHead>Ghi chú (Details)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filtered.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    Không tìm thấy log thay đổi nào.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filtered.map((log) => (
                                <TableRow key={log.id}>
                                    <TableCell className="text-muted-foreground whitespace-nowrap">
                                        <div className="flex items-center space-x-2">
                                            <History className="h-3 w-3" />
                                            <span>{format(log.timestamp, "yyyy-MM-dd HH:mm")}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={log.action.includes("REVOKE") ? "destructive" : "default"} className="text-[10px] font-mono">
                                            {log.action}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="font-medium">{log.targetUser}</TableCell>
                                    <TableCell>{log.role !== "-" ? <Badge variant="secondary">{log.role}</Badge> : "-"}</TableCell>
                                    <TableCell className="text-muted-foreground">{log.performedBy}</TableCell>
                                    <TableCell className="max-w-[200px] truncate text-muted-foreground" title={log.details}>
                                        {log.details}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
        </ProtectedRoute>
    );
}
